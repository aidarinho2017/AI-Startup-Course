from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.content.modules_seed import MODULES
from app.deps import CurrentUser, DbSession
from app.models import Module, Submission
from app.schemas.modules import ModuleDetailOut, ModuleListOut, SubmissionFieldSpec, VideoOut

router = APIRouter()

_SPEC_BY_SLUG = {m["slug"]: m for m in MODULES}


@router.get("", response_model=list[ModuleListOut])
async def list_modules(user: CurrentUser, db: DbSession) -> list[ModuleListOut]:
    modules = (await db.scalars(select(Module).order_by(Module.order_index))).all()
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
            is_completed=m.id in completed_module_ids,
        )
        for m in modules
    ]


@router.get("/{slug}", response_model=ModuleDetailOut)
async def get_module(slug: str, user: CurrentUser, db: DbSession) -> ModuleDetailOut:
    module = await db.scalar(
        select(Module).where(Module.slug == slug).options(selectinload(Module.videos))
    )
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
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
        is_completed=is_completed,
        videos=[VideoOut.model_validate(v) for v in module.videos],
        submission_fields=submission_fields,
    )
