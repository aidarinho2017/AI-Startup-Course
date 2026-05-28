from fastapi import APIRouter, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy import select

from app.content.prompts import SUMMARY_SCHEMAS
from app.deps import CurrentUser, DbSession
from app.models import ChatSummary, Module
from app.schemas.chat import ChatHistoryOut, ChatMessageOut, ChatRequest, SummaryOut
from app.services.chat_service import (
    generate_summary,
    get_or_create_session,
    load_history,
    stream_chat,
)

router = APIRouter()


@router.get("/{slug}/chat", response_model=ChatHistoryOut)
async def get_chat_history(slug: str, user: CurrentUser, db: DbSession) -> ChatHistoryOut:
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    if not module.has_chatbot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="This module has no chatbot"
        )
    session = await get_or_create_session(db, user.id, module)
    messages = await load_history(db, session.id)
    return ChatHistoryOut(messages=[ChatMessageOut.model_validate(m) for m in messages])


@router.post("/{slug}/chat")
async def post_chat(slug: str, body: ChatRequest, user: CurrentUser, db: DbSession):
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    if not module.has_chatbot:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="This module has no chatbot"
        )
    message = body.message.strip()
    if not message:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Empty message")

    session = await get_or_create_session(db, user.id, module)
    generator = stream_chat(db, session, slug, message)
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )


@router.post("/{slug}/chat/summary", response_model=SummaryOut)
async def post_chat_summary(slug: str, user: CurrentUser, db: DbSession) -> SummaryOut:
    if slug not in SUMMARY_SCHEMAS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This module does not support summaries",
        )
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    session = await get_or_create_session(db, user.id, module)
    try:
        summary = await generate_summary(db, session, slug)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    return SummaryOut(summary=summary.summary, generated_at=summary.generated_at)


@router.get("/{slug}/chat/summary", response_model=SummaryOut)
async def get_chat_summary(slug: str, user: CurrentUser, db: DbSession) -> SummaryOut:
    if slug not in SUMMARY_SCHEMAS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This module does not support summaries",
        )
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    session = await get_or_create_session(db, user.id, module)
    existing = await db.scalar(select(ChatSummary).where(ChatSummary.session_id == session.id))
    if existing is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No summary yet")
    return SummaryOut(summary=existing.summary, generated_at=existing.generated_at)
