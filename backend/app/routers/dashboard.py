from fastapi import APIRouter
from sqlalchemy import select

from app.deps import CurrentUser, DbSession
from app.models import Module, Submission
from app.schemas.modules import DashboardOut, ModuleListOut
from app.services.deadlines import deadline_map_for_user, deadline_state

router = APIRouter()


@router.get("", response_model=DashboardOut)
async def dashboard(user: CurrentUser, db: DbSession) -> DashboardOut:
    modules = (await db.scalars(select(Module).order_by(Module.order_index))).all()
    deadlines = await deadline_map_for_user(db, user, [module.id for module in modules])
    completed_ids = set(
        (
            await db.scalars(select(Submission.module_id).where(Submission.user_id == user.id))
        ).all()
    )
    module_outs = [
        ModuleListOut(
            slug=m.slug,
            title=m.title,
            description=m.description,
            order_index=m.order_index,
            has_chatbot=m.has_chatbot,
            due_at=deadlines.get(m.id),
            deadline_state=deadline_state(user, deadlines.get(m.id)),
            is_completed=m.id in completed_ids,
        )
        for m in modules
    ]
    total = len(module_outs)
    completed = sum(1 for m in module_outs if m.is_completed)
    pct = int(round((completed / total) * 100)) if total else 0
    return DashboardOut(total=total, completed=completed, progress_pct=pct, modules=module_outs)
