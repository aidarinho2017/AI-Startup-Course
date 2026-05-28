import json
import uuid
from collections.abc import AsyncIterator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.content.prompts import SUMMARY_SCHEMAS, SYSTEM_PROMPTS
from app.models import ChatMessage, ChatSession, ChatSummary, Module
from app.services.openai_client import client


async def get_or_create_session(
    db: AsyncSession, user_id: uuid.UUID, module: Module
) -> ChatSession:
    session = await db.scalar(
        select(ChatSession)
        .where(ChatSession.user_id == user_id, ChatSession.module_id == module.id)
        .order_by(ChatSession.created_at.desc())
    )
    if session is None:
        session = ChatSession(user_id=user_id, module_id=module.id)
        db.add(session)
        await db.commit()
        await db.refresh(session)
    return session


async def load_history(db: AsyncSession, session_id: int) -> list[ChatMessage]:
    return list(
        (
            await db.scalars(
                select(ChatMessage)
                .where(ChatMessage.session_id == session_id)
                .order_by(ChatMessage.created_at, ChatMessage.id)
            )
        ).all()
    )


def _system_prompt_for(slug: str) -> str:
    prompt = SYSTEM_PROMPTS.get(slug)
    if prompt is None:
        raise ValueError(f"No system prompt for module {slug!r}")
    return prompt


async def stream_chat(
    db: AsyncSession,
    session: ChatSession,
    module_slug: str,
    user_message: str,
) -> AsyncIterator[str]:
    """Persist the user message, stream assistant tokens as SSE 'data:' frames,
    then persist the full assistant message."""

    user_msg = ChatMessage(session_id=session.id, role="user", content=user_message)
    db.add(user_msg)
    await db.commit()

    history = await load_history(db, session.id)
    messages: list[dict] = [{"role": "system", "content": _system_prompt_for(module_slug)}]
    for m in history:
        messages.append({"role": m.role, "content": m.content})

    full_text_parts: list[str] = []
    try:
        stream = await client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            stream=True,
        )
        async for chunk in stream:
            if not chunk.choices:
                continue
            delta = chunk.choices[0].delta
            if delta and delta.content:
                full_text_parts.append(delta.content)
                yield f"data: {json.dumps({'delta': delta.content})}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as exc:  # surface the error to the client and persist what we have
        yield f"data: {json.dumps({'error': str(exc)})}\n\n"

    full_text = "".join(full_text_parts).strip()
    if full_text:
        db.add(ChatMessage(session_id=session.id, role="assistant", content=full_text))
        await db.commit()


async def generate_summary(
    db: AsyncSession, session: ChatSession, module_slug: str
) -> ChatSummary:
    schema = SUMMARY_SCHEMAS.get(module_slug)
    if schema is None:
        raise ValueError(f"Module {module_slug!r} does not support summaries")

    history = await load_history(db, session.id)
    if not history:
        raise ValueError("No conversation to summarize")

    system_prompt = _system_prompt_for(module_slug) + (
        "\n\nNow produce a structured summary of the conversation in the required JSON schema."
    )
    messages: list[dict] = [{"role": "system", "content": system_prompt}]
    for m in history:
        messages.append({"role": m.role, "content": m.content})
    messages.append(
        {
            "role": "user",
            "content": "Produce the summary now in the required JSON schema.",
        }
    )

    completion = await client.chat.completions.create(
        model=settings.OPENAI_MODEL,
        messages=messages,
        response_format={"type": "json_schema", "json_schema": schema},
    )
    raw = completion.choices[0].message.content or "{}"
    parsed = json.loads(raw)

    existing = await db.scalar(select(ChatSummary).where(ChatSummary.session_id == session.id))
    if existing is None:
        existing = ChatSummary(session_id=session.id, summary=parsed)
        db.add(existing)
    else:
        existing.summary = parsed
    await db.commit()
    await db.refresh(existing)
    return existing
