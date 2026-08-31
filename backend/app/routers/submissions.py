import json

from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from sqlalchemy import select

from app.content.modules_seed import ACTIVE_MODULE_SLUGS, MODULES, course_id_for_slug
from app.deps import CurrentUser, DbSession
from app.models import Module, Submission
from app.schemas.submissions import SubmissionIn, SubmissionOut
from app.services.telegram_service import send_task_completed, send_task_updated

router = APIRouter()

_SPEC_BY_SLUG = {m["slug"]: m for m in MODULES}


def _validate_submission(slug: str, content: dict) -> dict:
    spec = _SPEC_BY_SLUG.get(slug)
    if spec is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    language = course_id_for_slug(slug)

    def message(english: str, russian: str, kazakh: str) -> str:
        return {"ru": russian, "kk": kazakh}.get(language, english)

    cleaned: dict = {}
    for field in spec["submission_fields"]:
        key = field["key"]
        value = content.get(key, "")
        if not isinstance(value, str):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=message(
                    f"Field '{key}' must be a string",
                    f"Поле '{key}' должно быть строкой",
                    f"'{key}' өрісі мәтін болуы керек",
                ),
            )
        value = value.strip()
        if field["type"] == "link_list":
            try:
                links = json.loads(value) if value else []
            except json.JSONDecodeError as exc:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=message(
                        f"Field '{field['label']}' must be a valid list of links",
                        f"Поле «{field['label']}» должно содержать список ссылок",
                        f"«{field['label']}» өрісінде сілтемелер тізімі болуы керек",
                    ),
                ) from exc
            if not isinstance(links, list) or not all(isinstance(link, str) for link in links):
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=message(
                        f"Field '{field['label']}' must be a valid list of links",
                        f"Поле «{field['label']}» должно содержать список ссылок",
                        f"«{field['label']}» өрісінде сілтемелер тізімі болуы керек",
                    ),
                )
            cleaned_links = [link.strip() for link in links if link.strip()]
            if field.get("required") and not cleaned_links:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=message(
                        f"Field '{field['label']}' is required",
                        f"Поле «{field['label']}» обязательно",
                        f"«{field['label']}» өрісі міндетті",
                    ),
                )
            invalid_link = next(
                (
                    link
                    for link in cleaned_links
                    if not (link.startswith("http://") or link.startswith("https://"))
                ),
                None,
            )
            if invalid_link is not None:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=message(
                        f"Field '{field['label']}' must contain valid URLs",
                        f"Поле «{field['label']}» должно содержать корректные ссылки",
                        f"«{field['label']}» өрісінде жарамды сілтемелер болуы керек",
                    ),
                )
            cleaned[key] = json.dumps(cleaned_links)
            continue
        if field.get("required") and not value:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=message(
                    f"Field '{field['label']}' is required",
                    f"Поле «{field['label']}» обязательно",
                    f"«{field['label']}» өрісі міндетті",
                ),
            )
        if field["type"] == "url" and value and not (
            value.startswith("http://") or value.startswith("https://")
        ):
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=message(
                    f"Field '{field['label']}' must be a valid URL",
                    f"Поле «{field['label']}» должно содержать корректную ссылку",
                    f"«{field['label']}» өрісінде жарамды сілтеме болуы керек",
                ),
            )
        cleaned[key] = value
    return cleaned


@router.get("/{slug}/submission", response_model=SubmissionOut)
async def get_submission(slug: str, user: CurrentUser, db: DbSession) -> SubmissionOut:
    module = await db.scalar(
        select(Module).where(
            Module.slug == slug,
            Module.slug.in_(ACTIVE_MODULE_SLUGS),
        )
    )
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
    module = await db.scalar(
        select(Module).where(
            Module.slug == slug,
            Module.slug.in_(ACTIVE_MODULE_SLUGS),
        )
    )
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")
    cleaned = _validate_submission(slug, body.content)
    sub = await db.scalar(
        select(Submission).where(
            Submission.user_id == user.id, Submission.module_id == module.id
        )
    )
    is_new_submission = sub is None
    is_changed_submission = False
    if is_new_submission:
        sub = Submission(user_id=user.id, module_id=module.id, content=cleaned)
        db.add(sub)
    else:
        is_changed_submission = sub.content != cleaned
        sub.content = cleaned
    await db.commit()
    await db.refresh(sub)
    if is_new_submission:
        background_tasks.add_task(
            send_task_completed, user.telegram_chat_id, module.title
        )
    elif is_changed_submission:
        background_tasks.add_task(
            send_task_updated, user.telegram_chat_id, module.title
        )
    return SubmissionOut.model_validate(sub)
