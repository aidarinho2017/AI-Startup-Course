import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Header, HTTPException, Request, Response, status
from sqlalchemy import select

from app.config import settings
from app.content.modules_seed import ACTIVE_MODULE_SLUGS
from app.deps import CurrentUser, DbSession
from app.models import Module, StudyGroup, StudyGroupDeadline, Submission, User
from app.schemas.telegram import TelegramLinkCodeOut, TelegramStatusOut
from app.services.telegram_ai import queue_telegram_ai_message
from app.services.telegram_service import (
    send_message,
    telegram_bot_username,
    telegram_enabled,
    telegram_start_url,
)

router = APIRouter()

CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
CODE_LENGTH = 8


@router.get("/status", response_model=TelegramStatusOut)
async def telegram_status(user: CurrentUser) -> TelegramStatusOut:
    return _status_out(user)


@router.post("/link-code", response_model=TelegramLinkCodeOut)
async def create_link_code(user: CurrentUser, db: DbSession) -> TelegramLinkCodeOut:
    if not telegram_enabled():
        raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Telegram bot is not configured")

    expires_at = _now() + timedelta(minutes=settings.TELEGRAM_LINK_CODE_TTL_MINUTES)
    code = await _unique_code(db)
    user.telegram_link_code_hash = _hash_code(code)
    user.telegram_link_code_expires_at = expires_at
    await db.commit()

    return TelegramLinkCodeOut(
        code=code,
        expires_at=expires_at,
        bot_username=telegram_bot_username(),
        start_url=telegram_start_url(code),
    )


@router.post("/unlink", response_model=TelegramStatusOut)
async def unlink_telegram(
    user: CurrentUser,
    db: DbSession,
    background_tasks: BackgroundTasks,
) -> TelegramStatusOut:
    chat_id = user.telegram_chat_id
    _clear_telegram_link(user)
    await db.commit()

    if chat_id:
        background_tasks.add_task(send_message, chat_id, "Telegram notifications have been unlinked.")

    return _status_out(user)


@router.post("/webhook", status_code=status.HTTP_204_NO_CONTENT)
async def telegram_webhook(
    request: Request,
    db: DbSession,
    x_telegram_secret: Annotated[
        str | None,
        Header(alias="X-Telegram-Bot-Api-Secret-Token"),
    ] = None,
) -> Response:
    if settings.TELEGRAM_WEBHOOK_SECRET and x_telegram_secret != settings.TELEGRAM_WEBHOOK_SECRET:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Invalid Telegram secret")

    update = await request.json()
    message = update.get("message") or {}
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    text = message.get("text") or ""
    if chat_id is None or not text:
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    chat_id_str = str(chat_id)
    command, args = _parse_command(text)

    if command == "/unlink":
        await _handle_unlink_command(db, chat_id_str)
    elif command == "/help":
        await _send_help(db, chat_id_str)
    elif command == "/status":
        await _send_linked_command_message(db, chat_id_str, _progress_message)
    elif command == "/deadlines":
        await _send_linked_command_message(db, chat_id_str, _deadlines_message)
    elif command == "/next":
        await _send_linked_command_message(db, chat_id_str, _next_module_message)
    elif command in {"/start", "/link"}:
        await _handle_link_code(db, chat_id_str, args)
    elif command:
        await send_message(chat_id_str, f"Unknown command: {command}\n\n{await _help_message(db, chat_id_str)}")
    else:
        linked_user = await _linked_user(db, chat_id_str)
        if linked_user is not None and not _looks_like_link_code(args):
            await queue_telegram_ai_message(linked_user, chat_id_str, args)
        else:
            await _handle_link_code(db, chat_id_str, args)

    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def _handle_link_code(db: DbSession, chat_id: str, code: str) -> None:
    code = code.strip().upper()
    if not code:
        await send_message(
            chat_id,
            "Generate a Telegram link code in your course dashboard, then send it here.",
        )
        return

    now = _now()
    user = await db.scalar(
        select(User).where(
            User.telegram_link_code_hash == _hash_code(code),
            User.telegram_link_code_expires_at > now,
        )
    )
    if user is None:
        await send_message(
            chat_id,
            "That link code is invalid or expired. Generate a new code in your course dashboard.",
        )
        return

    existing_user = await db.scalar(
        select(User).where(User.telegram_chat_id == chat_id, User.id != user.id)
    )
    if existing_user is not None:
        await send_message(chat_id, "This Telegram chat is already linked to another course account.")
        return

    user.telegram_chat_id = chat_id
    user.telegram_linked_at = now
    user.telegram_link_code_hash = None
    user.telegram_link_code_expires_at = None
    await db.commit()

    await send_message(chat_id, "Telegram notifications are linked to AI Startup Course.")


async def _handle_unlink_command(db: DbSession, chat_id: str) -> None:
    user = await _linked_user(db, chat_id)
    if user is None:
        await send_message(chat_id, "This Telegram chat is not linked to a course account.")
        return

    _clear_telegram_link(user)
    await db.commit()
    await send_message(chat_id, "Telegram notifications are now unlinked from your course account.")


async def _send_help(db: DbSession, chat_id: str) -> None:
    await send_message(chat_id, await _help_message(db, chat_id))


async def _send_linked_command_message(db: DbSession, chat_id: str, formatter) -> None:
    user = await _linked_user(db, chat_id)
    if user is None:
        await send_message(
            chat_id,
            "This Telegram chat is not linked yet. Generate a link code in your course dashboard, then send /start CODE here.",
        )
        return
    await send_message(chat_id, await formatter(db, user))


async def _help_message(db: DbSession, chat_id: str) -> str:
    is_linked = await db.scalar(select(User.id).where(User.telegram_chat_id == chat_id)) is not None
    if not is_linked:
        return (
            "AI Startup Course bot\n\n"
            "To link this chat, generate a Telegram link code in your dashboard and send /start CODE here.\n\n"
            "Commands:\n"
            "/help - show commands\n"
            "/link CODE - link this Telegram chat"
        )
    return (
        "AI Startup Course bot\n\n"
        "Send any course or startup question here. I will collect your messages and reply after about a minute of silence.\n\n"
        "Commands:\n"
        "/status - show course progress\n"
        "/deadlines - show upcoming deadlines\n"
        "/next - show your next mission\n"
        "/unlink - unlink this Telegram chat\n"
        "/help - show commands"
    )


async def _progress_message(db: DbSession, user: User) -> str:
    modules = (
        await db.scalars(
            select(Module)
            .where(Module.slug.in_(ACTIVE_MODULE_SLUGS))
            .order_by(Module.order_index)
        )
    ).all()
    module_ids = [module.id for module in modules]
    completed_ids = set(
        (
            await db.scalars(
                select(Submission.module_id).where(
                    Submission.user_id == user.id,
                    Submission.module_id.in_(module_ids),
                )
            )
        ).all()
    )
    group = await _study_group(db, user)
    lines = [
        "Course status",
        f"Progress: {len(completed_ids)} of {len(modules)} missions completed.",
    ]
    if group:
        lines.append(f"Study group: {group.name}")
    else:
        lines.append("Study group: not selected.")
    return "\n".join(lines)


async def _deadlines_message(db: DbSession, user: User) -> str:
    group = await _study_group(db, user)
    if group is None:
        return "No study group is selected, so deadlines are not set for your account."

    now = _now()
    rows = (
        await db.execute(
            select(Module, StudyGroupDeadline)
            .join(StudyGroupDeadline, StudyGroupDeadline.module_id == Module.id)
            .where(
                Module.slug.in_(ACTIVE_MODULE_SLUGS),
                StudyGroupDeadline.group_id == group.id,
                StudyGroupDeadline.due_at >= now,
            )
            .order_by(StudyGroupDeadline.due_at, Module.order_index)
            .limit(6)
        )
    ).all()
    if not rows:
        return f"No upcoming deadlines are set for {group.name}."

    lines = [f"Upcoming deadlines for {group.name}:"]
    for module, deadline in rows:
        lines.append(f"- Mission {module.order_index}: {module.title} - {_format_dt(deadline.due_at)}")
    return "\n".join(lines)


async def _next_module_message(db: DbSession, user: User) -> str:
    modules = (
        await db.scalars(
            select(Module)
            .where(Module.slug.in_(ACTIVE_MODULE_SLUGS))
            .order_by(Module.order_index)
        )
    ).all()
    module_ids = [module.id for module in modules]
    completed_ids = set(
        (
            await db.scalars(
                select(Submission.module_id).where(
                    Submission.user_id == user.id,
                    Submission.module_id.in_(module_ids),
                )
            )
        ).all()
    )
    next_module = next((module for module in modules if module.id not in completed_ids), None)
    if next_module is None:
        return "All missions are completed."

    lines = [
        "Next mission",
        f"Mission {next_module.order_index}: {next_module.title}",
    ]
    if user.study_group_id is not None:
        deadline = await db.scalar(
            select(StudyGroupDeadline.due_at).where(
                StudyGroupDeadline.group_id == user.study_group_id,
                StudyGroupDeadline.module_id == next_module.id,
            )
        )
        lines.append(f"Deadline: {_format_dt(deadline)}" if deadline else "Deadline: not set yet")
    return "\n".join(lines)


async def _unique_code(db: DbSession) -> str:
    for _ in range(10):
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(CODE_LENGTH))
        existing = await db.scalar(select(User.id).where(User.telegram_link_code_hash == _hash_code(code)))
        if existing is None:
            return code
    raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not generate link code")


async def _linked_user(db: DbSession, chat_id: str) -> User | None:
    return await db.scalar(select(User).where(User.telegram_chat_id == chat_id))


async def _study_group(db: DbSession, user: User) -> StudyGroup | None:
    if user.study_group_id is None:
        return None
    return await db.scalar(select(StudyGroup).where(StudyGroup.id == user.study_group_id))


def _clear_telegram_link(user: User) -> None:
    user.telegram_chat_id = None
    user.telegram_linked_at = None
    user.telegram_link_code_hash = None
    user.telegram_link_code_expires_at = None


def _status_out(user: User) -> TelegramStatusOut:
    return TelegramStatusOut(
        is_configured=telegram_enabled(),
        is_linked=bool(user.telegram_chat_id),
        linked_at=user.telegram_linked_at,
        bot_username=telegram_bot_username(),
    )


def _parse_command(text: str) -> tuple[str | None, str]:
    value = text.strip()
    if not value:
        return None, ""
    parts = value.split(maxsplit=1)
    first = parts[0]
    rest = parts[1].strip() if len(parts) > 1 else ""
    if not first.startswith("/"):
        return None, value
    return first.split("@", 1)[0].lower(), rest


def _looks_like_link_code(text: str) -> bool:
    value = text.strip().upper()
    return len(value) == CODE_LENGTH and all(char in CODE_ALPHABET for char in value)


def _hash_code(code: str) -> str:
    normalized = code.strip().upper()
    return hashlib.sha256(f"{settings.JWT_SECRET}:{normalized}".encode("utf-8")).hexdigest()


def _format_dt(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%b %d, %H:%M UTC")


def _now() -> datetime:
    return datetime.now(timezone.utc)
