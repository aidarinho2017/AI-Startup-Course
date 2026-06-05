import asyncio
import logging
from datetime import datetime, timedelta, timezone

from sqlalchemy import and_, select
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db import SessionLocal
from app.models import Module, StudyGroupDeadline, Submission, TelegramNotification, User
from app.services.telegram_service import send_deadline_reminder, telegram_enabled

logger = logging.getLogger(__name__)

REMINDER_3H = "deadline_3h"
REMINDER_24H = "deadline_24h"


async def run_deadline_reminder_loop() -> None:
    if not telegram_enabled():
        return

    interval = max(settings.TELEGRAM_REMINDER_INTERVAL_SECONDS, 30)
    while True:
        try:
            sent_count = await run_deadline_reminder_once()
            if sent_count:
                logger.info("Sent %s Telegram deadline reminders", sent_count)
        except Exception:
            logger.exception("Telegram deadline reminder loop failed")
        await asyncio.sleep(interval)


async def run_deadline_reminder_once() -> int:
    if not telegram_enabled():
        return 0

    now = datetime.now(timezone.utc)
    async with SessionLocal() as db:
        sent_3h = await _send_due_reminders(
            db=db,
            now=now,
            kind=REMINDER_3H,
            label="3 hours",
            min_due_at=now,
            max_due_at=now + timedelta(hours=3),
        )
        sent_24h = await _send_due_reminders(
            db=db,
            now=now,
            kind=REMINDER_24H,
            label="24 hours",
            min_due_at=now + timedelta(hours=3),
            max_due_at=now + timedelta(hours=24),
        )
    return sent_3h + sent_24h


async def _send_due_reminders(
    db: AsyncSession,
    now: datetime,
    kind: str,
    label: str,
    min_due_at: datetime,
    max_due_at: datetime,
) -> int:
    stmt = (
        select(User.id, User.telegram_chat_id, Module.id, Module.title)
        .select_from(User)
        .join(StudyGroupDeadline, StudyGroupDeadline.group_id == User.study_group_id)
        .join(Module, Module.id == StudyGroupDeadline.module_id)
        .outerjoin(
            Submission,
            and_(Submission.user_id == User.id, Submission.module_id == Module.id),
        )
        .outerjoin(
            TelegramNotification,
            and_(
                TelegramNotification.user_id == User.id,
                TelegramNotification.module_id == Module.id,
                TelegramNotification.kind == kind,
            ),
        )
        .where(
            User.telegram_chat_id.is_not(None),
            User.study_group_id.is_not(None),
            StudyGroupDeadline.due_at > min_due_at,
            StudyGroupDeadline.due_at <= max_due_at,
            Submission.id.is_(None),
            TelegramNotification.id.is_(None),
        )
    )
    rows = (await db.execute(stmt)).all()
    sent_count = 0
    for user_id, chat_id, module_id, module_title in rows:
        if not await _claim_notification(db, user_id, module_id, kind, now):
            continue
        if await send_deadline_reminder(chat_id, module_title, label):
            sent_count += 1
    return sent_count


async def _claim_notification(
    db: AsyncSession,
    user_id,
    module_id: int,
    kind: str,
    now: datetime,
) -> bool:
    stmt = (
        insert(TelegramNotification)
        .values(user_id=user_id, module_id=module_id, kind=kind, sent_at=now)
        .on_conflict_do_nothing(constraint="uq_telegram_notification_user_module_kind")
        .returning(TelegramNotification.id)
    )
    claimed_id = await db.scalar(stmt)
    await db.commit()
    return claimed_id is not None
