import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import APIRouter, Header, HTTPException, Request, Response, status
from sqlalchemy import select

from app.config import settings
from app.deps import CurrentUser, DbSession
from app.models import User
from app.schemas.telegram import TelegramLinkCodeOut, TelegramStatusOut
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
    return TelegramStatusOut(
        is_configured=telegram_enabled(),
        is_linked=bool(user.telegram_chat_id),
        linked_at=user.telegram_linked_at,
        bot_username=telegram_bot_username(),
    )


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
    code = _extract_code(text)
    if not code:
        await send_message(
            chat_id_str,
            "Generate a Telegram link code in your course dashboard, then send it here.",
        )
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    now = _now()
    user = await db.scalar(
        select(User).where(
            User.telegram_link_code_hash == _hash_code(code),
            User.telegram_link_code_expires_at > now,
        )
    )
    if user is None:
        await send_message(
            chat_id_str,
            "That link code is invalid or expired. Generate a new code in your course dashboard.",
        )
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    existing_user = await db.scalar(
        select(User).where(User.telegram_chat_id == chat_id_str, User.id != user.id)
    )
    if existing_user is not None:
        await send_message(chat_id_str, "This Telegram chat is already linked to another course account.")
        return Response(status_code=status.HTTP_204_NO_CONTENT)

    user.telegram_chat_id = chat_id_str
    user.telegram_linked_at = now
    user.telegram_link_code_hash = None
    user.telegram_link_code_expires_at = None
    await db.commit()

    await send_message(chat_id_str, "Telegram notifications are linked to AI Startup Course.")
    return Response(status_code=status.HTTP_204_NO_CONTENT)


async def _unique_code(db: DbSession) -> str:
    for _ in range(10):
        code = "".join(secrets.choice(CODE_ALPHABET) for _ in range(CODE_LENGTH))
        existing = await db.scalar(select(User.id).where(User.telegram_link_code_hash == _hash_code(code)))
        if existing is None:
            return code
    raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Could not generate link code")


def _extract_code(text: str) -> str:
    value = text.strip()
    if not value:
        return ""
    parts = value.split(maxsplit=1)
    command = parts[0].split("@", 1)[0].lower()
    if command in {"/start", "/link"}:
        return parts[1].strip().upper() if len(parts) > 1 else ""
    return value.upper()


def _hash_code(code: str) -> str:
    normalized = code.strip().upper()
    return hashlib.sha256(f"{settings.JWT_SECRET}:{normalized}".encode("utf-8")).hexdigest()


def _now() -> datetime:
    return datetime.now(timezone.utc)
