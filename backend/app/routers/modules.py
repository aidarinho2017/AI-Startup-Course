from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.content.modules_seed import ACTIVE_MODULE_SLUGS, MODULES
from app.deps import CurrentUser, DbSession
from app.models import Module, Submission
from app.schemas.modules import ModuleDetailOut, ModuleListOut, SubmissionFieldSpec, VideoOut
from app.services.deadlines import deadline_map_for_user, deadline_state

router = APIRouter()

_SPEC_BY_SLUG = {m["slug"]: m for m in MODULES}


@router.get("", response_model=list[ModuleListOut])
async def list_modules(user: CurrentUser, db: DbSession) -> list[ModuleListOut]:
    modules = (
        await db.scalars(
            select(Module)
            .where(Module.slug.in_(ACTIVE_MODULE_SLUGS))
            .order_by(Module.order_index)
        )
    ).all()
    deadlines = await deadline_map_for_user(db, user, [module.id for module in modules])
    completed_module_ids = set(
        (
            await db.scalars(select(Submission.module_id).where(Submission.user_id == user.id))
        ).all()
    )
    return [
        ModuleListOut(
            slug=m.slug,
            title=m.title,
            description=m.description,
            order_index=m.order_index,
            has_chatbot=m.has_chatbot,
            due_at=deadlines.get(m.id),
            deadline_state=deadline_state(user, deadlines.get(m.id)),
            is_completed=m.id in completed_module_ids,
        )
        for m in modules
    ]


@router.get("/{slug}", response_model=ModuleDetailOut)
async def get_module(slug: str, user: CurrentUser, db: DbSession) -> ModuleDetailOut:
    if slug not in ACTIVE_MODULE_SLUGS:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    module = await db.scalar(
        select(Module)
        .where(Module.slug == slug)
        .options(selectinload(Module.videos))
    )
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    deadlines = await deadline_map_for_user(db, user, [module.id])
    due_at = deadlines.get(module.id)
    spec = _SPEC_BY_SLUG.get(slug)
    submission_fields = (
        [SubmissionFieldSpec(**f) for f in spec["submission_fields"]] if spec else []
    )
    is_completed = (
        await db.scalar(
            select(Submission.id).where(
                Submission.user_id == user.id, Submission.module_id == module.id
            )
        )
    ) is not None
    return ModuleDetailOut(
        slug=module.slug,
        title=module.title,
        description=module.description,
        order_index=module.order_index,
        has_chatbot=module.has_chatbot,
        due_at=due_at,
        deadline_state=deadline_state(user, due_at),
        is_completed=is_completed,
        videos=[VideoOut.model_validate(v) for v in module.videos],
        submission_fields=submission_fields,
    )
