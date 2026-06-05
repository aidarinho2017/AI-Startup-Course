from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from sqlalchemy import select

from app.content.modules_seed import MODULES
from app.deps import CurrentUser, DbSession
from app.models import Module, Submission
from app.schemas.submissions import SubmissionIn, SubmissionOut
from app.services.telegram_service import send_task_completed

router = APIRouter()

_SPEC_BY_SLUG = {m["slug"]: m for m in MODULES}


def _validate_submission(slug: str, content: dict) -> dict:
    spec = _SPEC_BY_SLUG.get(slug)
    if spec is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    cleaned: dict = {}
    for field in spec["submission_fields"]:
        key = field["key"]
        value = content.get(key, "")
        if not isinstance(value, str):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Field '{key}' must be a string",
            )
        value = value.strip()
        if field.get("required") and not value:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Field '{field['label']}' is required",
            )
        if field["type"] == "url" and value and not (
            value.startswith("http://") or value.startswith("https://")
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Field '{field['label']}' must be a valid URL",
            )
        cleaned[key] = value
    return cleaned


@router.get("/{slug}/submission", response_model=SubmissionOut)
async def get_submission(slug: str, user: CurrentUser, db: DbSession) -> SubmissionOut:
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    sub = await db.scalar(
        select(Submission).where(
            Submission.user_id == user.id, Submission.module_id == module.id
        )
    )
    if sub is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No submission yet")
    return SubmissionOut.model_validate(sub)


@router.put("/{slug}/submission", response_model=SubmissionOut)
async def upsert_submission(
    slug: str,
    body: SubmissionIn,
    user: CurrentUser,
    db: DbSession,
    background_tasks: BackgroundTasks,
) -> SubmissionOut:
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    cleaned = _validate_submission(slug, body.content)
    sub = await db.scalar(
        select(Submission).where(
            Submission.user_id == user.id, Submission.module_id == module.id
        )
    )
    is_new_submission = sub is None
    if is_new_submission:
        sub = Submission(user_id=user.id, module_id=module.id, content=cleaned)
        db.add(sub)
    else:
        sub.content = cleaned
    await db.commit()
    await db.refresh(sub)
    if is_new_submission:
        background_tasks.add_task(
            send_task_completed, user.telegram_chat_id, module.title
        )
    return SubmissionOut.model_validate(sub)
