from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ChatMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    role: str
    content: str
    created_at: datetime


class ChatHistoryOut(BaseModel):
    messages: list[ChatMessageOut]


class ChatRequest(BaseModel):
    message: str


class SummaryOut(BaseModel):
    summary: dict
    generated_at: datetime
