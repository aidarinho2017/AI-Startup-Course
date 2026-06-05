from fastapi import APIRouter, HTTPException, status
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models import StudyGroup
from app.schemas.profile import ProfileOut, ProfileUpdateIn, StudyGroupOut

router = APIRouter()


@router.get("/profile", response_model=ProfileOut)
async def get_profile(user: CurrentUser, db: DbSession) -> ProfileOut:
    return await _profile_out(user, db)


@router.patch("/profile", response_model=ProfileOut)
async def update_profile(body: ProfileUpdateIn, user: CurrentUser, db: DbSession) -> ProfileOut:
    group = None
    if body.study_group_id is not None:
        group = await db.scalar(select(StudyGroup).where(StudyGroup.id == body.study_group_id))
        if group is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study group not found")

    user.first_name = _clean_optional(body.first_name)
    user.last_name = _clean_optional(body.last_name)
    user.dream = _clean_optional(body.dream)
    user.study_group_id = group.id if group else None

    display_name = " ".join(
        value for value in [user.first_name, user.last_name] if value
    ).strip()
    if display_name:
        user.name = display_name

    await db.commit()
    await db.refresh(user)
    return await _profile_out(user, db)


@router.get("/study-groups", response_model=list[StudyGroupOut])
async def list_study_groups(user: CurrentUser, db: DbSession) -> list[StudyGroupOut]:
    groups = (await db.scalars(select(StudyGroup).order_by(StudyGroup.name))).all()
    return [StudyGroupOut.model_validate(group) for group in groups]


async def _profile_out(user, db: DbSession) -> ProfileOut:
    group = None
    if user.study_group_id is not None:
        group = await db.scalar(select(StudyGroup).where(StudyGroup.id == user.study_group_id))
    return ProfileOut(
        id=user.id,
        email=user.email,
        name=user.name,
        first_name=user.first_name,
        last_name=user.last_name,
        dream=user.dream,
        study_group=StudyGroupOut.model_validate(group) if group else None,
        created_at=user.created_at,
    )


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None
