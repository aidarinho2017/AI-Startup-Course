import asyncio
import logging
import re
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.config import settings
from app.content.modules_seed import ACTIVE_MODULE_SLUGS
from app.db import SessionLocal
from app.models import (
    Module,
    StudyGroup,
    StudyGroupDeadline,
    Submission,
    TelegramAIBatch,
    TelegramAIMessage,
    User,
)
from app.services.gemini_client import get_client, prepare_contents
from app.services.telegram_service import send_chat_action, send_message, telegram_enabled

logger = logging.getLogger(__name__)

STATUS_PENDING = "pending"
STATUS_PROCESSING = "processing"
STATUS_ANSWERED = "answered"
STATUS_FAILED = "failed"
MARKDOWN_STRONG_RE = re.compile(r"(\*\*|__)(.+?)\1")
MARKDOWN_ITALIC_STAR_RE = re.compile(r"(?<!\*)\*([^*\n]+)\*(?!\*)")
MARKDOWN_ITALIC_UNDERSCORE_RE = re.compile(r"(?<!\w)_([^_\n]+)_(?!\w)")
MARKDOWN_HEADING_RE = re.compile(r"^\s{0,3}#{1,6}\s+", re.MULTILINE)


async def queue_telegram_ai_message(user: User, chat_id: str, content: str) -> None:
    content = content.strip()
    if not content:
        return

    now = _now()
    async with SessionLocal() as db:
        batch = await db.scalar(
            select(TelegramAIBatch)
            .where(
                TelegramAIBatch.user_id == user.id,
                TelegramAIBatch.telegram_chat_id == chat_id,
                TelegramAIBatch.status == STATUS_PENDING,
            )
            .order_by(TelegramAIBatch.created_at.desc())
            .limit(1)
        )
        if batch is None:
            batch = TelegramAIBatch(
                user_id=user.id,
                telegram_chat_id=chat_id,
                status=STATUS_PENDING,
                retry_count=0,
                last_message_at=now,
            )
            db.add(batch)
            await db.flush()
        else:
            batch.last_message_at = now

        db.add(TelegramAIMessage(batch_id=batch.id, role="user", content=content))
        await db.commit()


async def run_telegram_ai_loop() -> None:
    if not telegram_enabled() or not settings.GEMINI_API_KEY:
        return

    interval = max(settings.TELEGRAM_AI_WORKER_INTERVAL_SECONDS, 1)
    while True:
        try:
            processed_count = await run_telegram_ai_once()
            if processed_count:
                logger.info("Processed %s Telegram AI batch(es)", processed_count)
        except Exception:
            logger.exception("Telegram AI worker failed")
        await asyncio.sleep(interval)


async def run_telegram_ai_once() -> int:
    if not telegram_enabled() or not settings.GEMINI_API_KEY:
        return 0

    processed = 0
    for _ in range(5):
        batch_id = await _claim_ready_batch()
        if batch_id is None:
            break
        await _process_batch(batch_id)
        processed += 1
    return processed


async def _claim_ready_batch() -> int | None:
    cutoff = _now() - timedelta(seconds=max(settings.TELEGRAM_AI_DEBOUNCE_SECONDS, 1))
    async with SessionLocal() as db:
        batch = await db.scalar(
            select(TelegramAIBatch)
            .where(
                TelegramAIBatch.status == STATUS_PENDING,
                TelegramAIBatch.last_message_at <= cutoff,
            )
            .order_by(TelegramAIBatch.last_message_at, TelegramAIBatch.id)
            .limit(1)
            .with_for_update(skip_locked=True)
        )
        if batch is None:
            return None

        batch.status = STATUS_PROCESSING
        batch.processing_started_at = _now()
        await db.commit()
        return batch.id


async def _process_batch(batch_id: int) -> None:
    try:
        payload = await _load_batch_payload(batch_id)
        if payload is None:
            return

        chat_id, messages = payload
        await send_chat_action(chat_id, "typing")
        contents, system_instruction = prepare_contents(messages)
        response = await get_client().aio.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config={"system_instruction": system_instruction},
        )
        reply = _clean_telegram_ai_reply(response.text or "")
        if not reply:
            raise RuntimeError("Gemini returned an empty Telegram AI reply")

        if not await _send_long_message(chat_id, reply):
            raise RuntimeError("Telegram AI reply could not be sent")

        async with SessionLocal() as db:
            batch = await db.scalar(select(TelegramAIBatch).where(TelegramAIBatch.id == batch_id))
            if batch is None:
                return
            db.add(TelegramAIMessage(batch_id=batch.id, role="assistant", content=reply))
            batch.status = STATUS_ANSWERED
            batch.processing_started_at = None
            await db.commit()
    except Exception as exc:
        logger.exception("Telegram AI batch failed: %s", batch_id)
        await _mark_batch_failed_or_retry(batch_id, str(exc))


async def _load_batch_payload(batch_id: int) -> tuple[str, list[dict]] | None:
    async with SessionLocal() as db:
        row = (
            await db.execute(
                select(TelegramAIBatch, User)
                .join(User, User.id == TelegramAIBatch.user_id)
                .where(TelegramAIBatch.id == batch_id)
            )
        ).first()
        if row is None:
            return None

        batch, user = row
        if not user.telegram_chat_id or user.telegram_chat_id != batch.telegram_chat_id:
            batch.status = STATUS_FAILED
            batch.processing_started_at = None
            await db.commit()
            return None

        batch_messages = (
            await db.scalars(
                select(TelegramAIMessage)
                .where(TelegramAIMessage.batch_id == batch.id)
                .order_by(TelegramAIMessage.created_at, TelegramAIMessage.id)
            )
        ).all()
        user_messages = [m.content for m in batch_messages if m.role == "user" and m.content.strip()]
        if not user_messages:
            batch.status = STATUS_ANSWERED
            batch.processing_started_at = None
            await db.commit()
            return None

        messages = await _build_ai_messages(db, user, batch, user_messages)
        return batch.telegram_chat_id, messages


async def _build_ai_messages(
    db,
    user: User,
    batch: TelegramAIBatch,
    user_messages: list[str],
) -> list[dict]:
    history_limit = max(settings.TELEGRAM_AI_HISTORY_TURNS, 0) * 2
    history: list[TelegramAIMessage] = []
    if history_limit:
        history = list(
            (
                await db.scalars(
                    select(TelegramAIMessage)
                    .join(TelegramAIBatch, TelegramAIBatch.id == TelegramAIMessage.batch_id)
                    .where(
                        TelegramAIBatch.user_id == user.id,
                        TelegramAIBatch.status == STATUS_ANSWERED,
                        TelegramAIBatch.id != batch.id,
                        TelegramAIMessage.role.in_(["user", "assistant"]),
                    )
                    .order_by(TelegramAIMessage.created_at.desc(), TelegramAIMessage.id.desc())
                    .limit(history_limit)
                )
            ).all()
        )
        history.reverse()

    messages: list[dict] = [
        {
            "role": "system",
            "content": await _system_prompt(db, user),
        }
    ]
    for item in history:
        messages.append({"role": item.role, "content": item.content})

    combined = "\n\n".join(
        f"Message {index + 1}: {message}" for index, message in enumerate(user_messages)
    )
    messages.append(
        {
            "role": "user",
            "content": (
                "The student sent these Telegram messages within one batch. "
                "Answer them together as one concise course assistant response.\n\n"
                f"{combined}"
            ),
        }
    )
    return messages


async def _system_prompt(db, user: User) -> str:
    context = await _course_context(db, user)
    return (
        "You are the AI Startup Course assistant inside Telegram. "
        "Be concise, practical, and supportive. Answer in the same language as the student when it is clear. "
        "Help with startup thinking, course navigation, deadlines, and next steps. "
        "Use plain Telegram text only: no Markdown formatting, no **bold**, no headings, no tables, "
        "and no code fences unless the student explicitly asks for code. Prefer simple numbered lists "
        "and short plain-text bullets. "
        "Do not claim instructor authority, do not grade submissions, and do not invent private course data. "
        "If the student asks for official grading or feedback, tell them to use the course platform or wait for instructor feedback.\n\n"
        f"Course context:\n{context}"
    )


async def _course_context(db, user: User) -> str:
    modules = list(
        (
            await db.scalars(
                select(Module)
                .where(Module.slug.in_(ACTIVE_MODULE_SLUGS))
                .order_by(Module.order_index)
            )
        ).all()
    )
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
    group = None
    if user.study_group_id is not None:
        group = await db.scalar(select(StudyGroup).where(StudyGroup.id == user.study_group_id))

    lines = [
        f"Student: {user.name}",
        f"Progress: {len(completed_ids)} of {len(modules)} missions completed.",
    ]
    if group:
        lines.append(f"Study group: {group.name}.")
    else:
        lines.append("Study group: not selected.")
    if next_module:
        lines.append(f"Next incomplete mission: Mission {next_module.order_index}: {next_module.title}.")
    else:
        lines.append("Next incomplete mission: none; all missions are completed.")

    if group:
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
                .limit(5)
            )
        ).all()
        if rows:
            lines.append("Upcoming deadlines:")
            for module, deadline in rows:
                lines.append(
                    f"- Mission {module.order_index}: {module.title} due {_format_dt(deadline.due_at)}."
                )
        else:
            lines.append("Upcoming deadlines: none set.")

    return "\n".join(lines)


async def _mark_batch_failed_or_retry(batch_id: int, error_message: str) -> None:
    async with SessionLocal() as db:
        batch = await db.scalar(select(TelegramAIBatch).where(TelegramAIBatch.id == batch_id))
        if batch is None:
            return
        batch.retry_count += 1
        batch.processing_started_at = None
        if batch.retry_count >= max(settings.TELEGRAM_AI_MAX_RETRIES, 1):
            batch.status = STATUS_FAILED
            await send_message(
                batch.telegram_chat_id,
                "I could not answer that Telegram assistant message right now. Please try again later.",
            )
            logger.warning("Telegram AI batch failed permanently: %s %s", batch_id, error_message)
        else:
            batch.status = STATUS_PENDING
            batch.last_message_at = _now()
        await db.commit()


async def _send_long_message(chat_id: str, text: str) -> bool:
    for chunk in _split_message(text):
        if not await send_message(chat_id, chunk):
            return False
    return True


def _clean_telegram_ai_reply(text: str) -> str:
    cleaned = text.strip()
    cleaned = MARKDOWN_STRONG_RE.sub(r"\2", cleaned)
    cleaned = MARKDOWN_ITALIC_STAR_RE.sub(r"\1", cleaned)
    cleaned = MARKDOWN_ITALIC_UNDERSCORE_RE.sub(r"\1", cleaned)
    cleaned = MARKDOWN_HEADING_RE.sub("", cleaned)
    return cleaned.strip()


def _split_message(text: str, max_length: int = 3800) -> list[str]:
    text = text.strip()
    if len(text) <= max_length:
        return [text]

    chunks: list[str] = []
    remaining = text
    while len(remaining) > max_length:
        split_at = remaining.rfind("\n", 0, max_length)
        if split_at < max_length // 2:
            split_at = remaining.rfind(" ", 0, max_length)
        if split_at < max_length // 2:
            split_at = max_length
        chunks.append(remaining[:split_at].strip())
        remaining = remaining[split_at:].strip()
    if remaining:
        chunks.append(remaining)
    return chunks


def _format_dt(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%b %d, %H:%M UTC")


def _now() -> datetime:
    return datetime.now(timezone.utc)
