import asyncio
import logging

import requests

from app.config import settings

logger = logging.getLogger(__name__)


def telegram_enabled() -> bool:
    return bool(settings.TELEGRAM_BOT_TOKEN)


def telegram_bot_username() -> str | None:
    username = settings.TELEGRAM_BOT_USERNAME.strip().lstrip("@")
    return username or None


def telegram_start_url(code: str) -> str | None:
    username = telegram_bot_username()
    if not username:
        return None
    return f"https://t.me/{username}?start={code}"


async def _post(method: str, payload: dict) -> bool:
    if not telegram_enabled():
        return False
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/{method}"
    try:
        response = await asyncio.to_thread(requests.post, url, json=payload, timeout=10)
    except requests.RequestException:
        logger.exception("Telegram API request failed: %s", method)
        return False

    if not response.ok:
        logger.warning("Telegram API request failed: %s %s", method, response.text)
        return False
    return True


async def configure_webhook() -> bool:
    if not telegram_enabled() or not settings.TELEGRAM_WEBHOOK_URL:
        return False
    payload: dict = {
        "url": settings.TELEGRAM_WEBHOOK_URL,
        "allowed_updates": ["message"],
    }
    if settings.TELEGRAM_WEBHOOK_SECRET:
        payload["secret_token"] = settings.TELEGRAM_WEBHOOK_SECRET
    return await _post("setWebhook", payload)


async def send_message(chat_id: str | None, text: str) -> bool:
    if not chat_id:
        return False
    return await _post(
        "sendMessage",
        {
            "chat_id": chat_id,
            "text": text,
            "disable_web_page_preview": True,
        },
    )


async def send_task_completed(chat_id: str | None, module_title: str) -> bool:
    return await send_message(chat_id, f"You've done the task: {module_title}.")


async def send_task_updated(chat_id: str | None, module_title: str) -> bool:
    return await send_message(chat_id, f"You've updated the task: {module_title}.")


async def send_instructor_feedback(
    chat_id: str | None,
    module_title: str,
    feedback: str,
) -> bool:
    feedback = feedback.strip()
    if not feedback:
        return False
    text = f'Instructor feedback for "{module_title}":\n\n{_truncate(feedback, 3600)}'
    return await send_message(chat_id, text)


async def send_deadline_reminder(chat_id: str | None, module_title: str, label: str) -> bool:
    return await send_message(
        chat_id,
        f'Reminder: "{module_title}" is due in about {label}. Submit your artifacts before the deadline.',
    )


def _truncate(value: str, max_length: int) -> str:
    if len(value) <= max_length:
        return value
    return f"{value[: max_length - 3]}..."
