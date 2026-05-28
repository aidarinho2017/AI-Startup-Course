from fastapi import APIRouter, HTTPException, status
from sqlalchemy import func, select

from app.deps import CurrentInstructor, DbSession
from app.models import Module, Submission, User
from app.schemas.instructor import FeedbackIn, InstructorModuleOut, InstructorSubmissionOut, StudentOut

router = APIRouter()


@router.get("/modules", response_model=list[InstructorModuleOut])
async def list_modules(instructor: CurrentInstructor, db: DbSession):
    modules = (await db.scalars(select(Module).order_by(Module.order_index))).all()
    counts = {
        row.module_id: row.cnt
        for row in (
            await db.execute(
                select(Submission.module_id, func.count().label("cnt")).group_by(Submission.module_id)
            )
        ).all()
    }
    return [
        InstructorModuleOut(
            slug=m.slug,
            title=m.title,
            order_index=m.order_index,
            submission_count=counts.get(m.id, 0),
        )
        for m in modules
    ]


@router.get("/modules/{slug}/submissions", response_model=list[InstructorSubmissionOut])
async def list_submissions(slug: str, instructor: CurrentInstructor, db: DbSession):
    module = await db.scalar(select(Module).where(Module.slug == slug))
    if module is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Module not found")

    rows = (
        await db.execute(
            select(Submission, User)
            .join(User, User.id == Submission.user_id)
            .where(Submission.module_id == module.id)
            .order_by(Submission.submitted_at.desc())
        )
    ).all()

    return [
        InstructorSubmissionOut(
            id=sub.id,
            student=StudentOut.model_validate(user),
            content=sub.content,
            instructor_feedback=sub.instructor_feedback,
            is_reviewed=sub.is_reviewed,
            submitted_at=sub.submitted_at,
            updated_at=sub.updated_at,
        )
        for sub, user in rows
    ]


@router.patch("/submissions/{submission_id}", response_model=InstructorSubmissionOut)
async def update_feedback(submission_id: int, body: FeedbackIn, instructor: CurrentInstructor, db: DbSession):
    row = (
        await db.execute(
            select(Submission, User)
            .join(User, User.id == Submission.user_id)
            .where(Submission.id == submission_id)
        )
    ).first()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

    sub, user = row
    sub.instructor_feedback = body.instructor_feedback
    sub.is_reviewed = body.is_reviewed
    await db.commit()
    await db.refresh(sub)

    return InstructorSubmissionOut(
        id=sub.id,
        student=StudentOut.model_validate(user),
        content=sub.content,
        instructor_feedback=sub.instructor_feedback,
        is_reviewed=sub.is_reviewed,
        submitted_at=sub.submitted_at,
        updated_at=sub.updated_at,
    )
