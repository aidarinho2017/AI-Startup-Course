from datetime import datetime

from pydantic import BaseModel


class TelegramStatusOut(BaseModel):
    is_configured: bool
    is_linked: bool
    linked_at: datetime | None = None
    bot_username: str | None = None


class TelegramLinkCodeOut(BaseModel):
    code: str
    expires_at: datetime
    bot_username: str | None = None
    start_url: str | None = None
