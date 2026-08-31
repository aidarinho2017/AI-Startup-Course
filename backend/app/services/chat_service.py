import json
import uuid
from collections.abc import AsyncIterator

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.content.modules_seed import base_module_slug, course_id_for_slug
from app.content.prompts import SUMMARY_SCHEMAS, SYSTEM_PROMPTS
from app.models import ChatMessage, ChatSession, ChatSummary, Module
from app.services.gemini_client import get_client, prepare_contents


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
    prompt = SYSTEM_PROMPTS.get(base_module_slug(slug))
    if prompt is None:
        raise ValueError(f"No system prompt for module {slug!r}")
    course_id = course_id_for_slug(slug)
    if course_id == "ru":
        return f"{prompt}\n\nAlways respond in Russian."
    if course_id == "kk":
        return f"{prompt}\n\nAlways respond in Kazakh."
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
        contents, system_instruction = prepare_contents(messages)
        stream = await get_client().aio.models.generate_content_stream(
            model=settings.GEMINI_MODEL,
            contents=contents,
            config={"system_instruction": system_instruction},
        )
        async for chunk in stream:
            if chunk.text:
                full_text_parts.append(chunk.text)
                yield f"data: {json.dumps({'delta': chunk.text})}\n\n"
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
    schema = SUMMARY_SCHEMAS.get(base_module_slug(module_slug))
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

    contents, system_instruction = prepare_contents(messages)
    response = await get_client().aio.models.generate_content(
        model=settings.GEMINI_MODEL,
        contents=contents,
        config={
            "system_instruction": system_instruction,
            "response_mime_type": "application/json",
            "response_json_schema": schema.get("schema", schema),
        },
    )
    raw = response.text or "{}"
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
