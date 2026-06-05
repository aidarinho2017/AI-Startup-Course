from datetime import datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import StudyGroupDeadline, User

DeadlineState = str


async def deadline_map_for_user(
    db: AsyncSession,
    user: User,
    module_ids: list[int],
) -> dict[int, datetime]:
    if user.study_group_id is None or not module_ids:
        return {}
    rows = (
        await db.execute(
            select(StudyGroupDeadline.module_id, StudyGroupDeadline.due_at).where(
                StudyGroupDeadline.group_id == user.study_group_id,
                StudyGroupDeadline.module_id.in_(module_ids),
            )
        )
    ).all()
    return {module_id: due_at for module_id, due_at in rows}


def deadline_state(user: User, due_at: datetime | None) -> DeadlineState:
    if due_at is not None:
        return "set"
    if user.study_group_id is not None:
        return "not_set"
    return "no_group"
