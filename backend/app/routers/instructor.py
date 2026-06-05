import uuid

from fastapi import APIRouter, BackgroundTasks, HTTPException, status
from sqlalchemy import func, select

from app.deps import CurrentInstructor, DbSession
from app.models import Module, StudyGroup, StudyGroupDeadline, Submission, User
from app.schemas.instructor import (
    FeedbackIn,
    GroupDeadlinesUpdateIn,
    InstructorGroupDeadlineOut,
    InstructorModuleBriefOut,
    InstructorModuleOut,
    InstructorStudentOut,
    InstructorStudentSubmissionsOut,
    InstructorStudyGroupOut,
    InstructorSubmissionOut,
    StudentOut,
    StudyGroupCreateIn,
    StudyGroupUpdateIn,
)
from app.schemas.profile import StudyGroupOut
from app.services.telegram_service import send_instructor_feedback

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
            select(Submission, User, StudyGroup)
            .join(User, User.id == Submission.user_id)
            .outerjoin(StudyGroup, StudyGroup.id == User.study_group_id)
            .where(Submission.module_id == module.id)
            .order_by(Submission.submitted_at.desc())
        )
    ).all()

    return [
        _submission_out(sub, user, group, module=None)
        for sub, user, group in rows
    ]


@router.get("/students", response_model=list[InstructorStudentOut])
async def list_students(instructor: CurrentInstructor, db: DbSession) -> list[InstructorStudentOut]:
    total_modules = await _total_modules(db)
    counts = await _student_submission_counts(db)
    rows = (
        await db.execute(
            select(User, StudyGroup)
            .outerjoin(StudyGroup, StudyGroup.id == User.study_group_id)
            .where(User.is_instructor.is_(False))
            .order_by(User.created_at.desc())
        )
    ).all()
    return [
        _student_summary_out(user, group, counts.get(user.id, (0, 0)), total_modules)
        for user, group in rows
    ]


@router.get("/students/{student_id}/submissions", response_model=InstructorStudentSubmissionsOut)
async def list_student_submissions(
    student_id: uuid.UUID,
    instructor: CurrentInstructor,
    db: DbSession,
) -> InstructorStudentSubmissionsOut:
    student_row = (
        await db.execute(
            select(User, StudyGroup)
            .outerjoin(StudyGroup, StudyGroup.id == User.study_group_id)
            .where(User.id == student_id, User.is_instructor.is_(False))
        )
    ).first()
    if student_row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student not found")

    student, group = student_row
    rows = (
        await db.execute(
            select(Submission, Module)
            .join(Module, Module.id == Submission.module_id)
            .where(Submission.user_id == student.id)
            .order_by(Module.order_index)
        )
    ).all()

    counts = await _student_submission_counts(db)
    total_modules = await _total_modules(db)
    return InstructorStudentSubmissionsOut(
        student=_student_summary_out(student, group, counts.get(student.id, (0, 0)), total_modules),
        submissions=[
            _submission_out(sub, student, group, module=module)
            for sub, module in rows
        ],
    )


@router.get("/groups", response_model=list[InstructorStudyGroupOut])
async def list_groups(instructor: CurrentInstructor, db: DbSession) -> list[InstructorStudyGroupOut]:
    groups = (await db.scalars(select(StudyGroup).order_by(StudyGroup.name))).all()
    return await _groups_out(db, groups)


@router.post("/groups", response_model=InstructorStudyGroupOut, status_code=status.HTTP_201_CREATED)
async def create_group(
    body: StudyGroupCreateIn,
    instructor: CurrentInstructor,
    db: DbSession,
) -> InstructorStudyGroupOut:
    name = _clean_required(body.name)
    existing = await db.scalar(select(StudyGroup.id).where(func.lower(StudyGroup.name) == name.lower()))
    if existing is not None:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Study group already exists")

    group = StudyGroup(name=name, description=_clean_optional(body.description))
    db.add(group)
    await db.commit()
    await db.refresh(group)
    return (await _groups_out(db, [group]))[0]


@router.patch("/groups/{group_id}", response_model=InstructorStudyGroupOut)
async def update_group(
    group_id: int,
    body: StudyGroupUpdateIn,
    instructor: CurrentInstructor,
    db: DbSession,
) -> InstructorStudyGroupOut:
    group = await db.scalar(select(StudyGroup).where(StudyGroup.id == group_id))
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study group not found")

    if "name" in body.model_fields_set and body.name is not None:
        name = _clean_required(body.name)
        existing = await db.scalar(
            select(StudyGroup.id).where(
                func.lower(StudyGroup.name) == name.lower(),
                StudyGroup.id != group.id,
            )
        )
        if existing is not None:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Study group already exists")
        group.name = name
    if "description" in body.model_fields_set:
        group.description = _clean_optional(body.description)

    await db.commit()
    await db.refresh(group)
    return (await _groups_out(db, [group]))[0]


@router.put("/groups/{group_id}/deadlines", response_model=InstructorStudyGroupOut)
async def update_group_deadlines(
    group_id: int,
    body: GroupDeadlinesUpdateIn,
    instructor: CurrentInstructor,
    db: DbSession,
) -> InstructorStudyGroupOut:
    group = await db.scalar(select(StudyGroup).where(StudyGroup.id == group_id))
    if group is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Study group not found")

    modules = {
        module.slug: module
        for module in (await db.scalars(select(Module))).all()
    }
    existing = {
        deadline.module_id: deadline
        for deadline in (
            await db.scalars(
                select(StudyGroupDeadline).where(StudyGroupDeadline.group_id == group.id)
            )
        ).all()
    }

    for item in body.deadlines:
        module = modules.get(item.module_slug)
        if module is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Module not found: {item.module_slug}",
            )
        deadline = existing.get(module.id)
        if item.due_at is None:
            if deadline is not None:
                await db.delete(deadline)
            continue
        if deadline is None:
            db.add(
                StudyGroupDeadline(
                    group_id=group.id,
                    module_id=module.id,
                    due_at=item.due_at,
                )
            )
        else:
            deadline.due_at = item.due_at

    await db.commit()
    await db.refresh(group)
    return (await _groups_out(db, [group]))[0]


@router.patch("/submissions/{submission_id}", response_model=InstructorSubmissionOut)
async def update_feedback(
    submission_id: int,
    body: FeedbackIn,
    instructor: CurrentInstructor,
    db: DbSession,
    background_tasks: BackgroundTasks,
):
    row = (
        await db.execute(
            select(Submission, User, StudyGroup, Module)
            .join(User, User.id == Submission.user_id)
            .join(Module, Module.id == Submission.module_id)
            .outerjoin(StudyGroup, StudyGroup.id == User.study_group_id)
            .where(Submission.id == submission_id)
        )
    ).first()

    if row is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")

    sub, user, group, module = row
    previous_feedback = _clean_optional(sub.instructor_feedback)
    next_feedback = _clean_optional(body.instructor_feedback)
    should_notify_feedback = bool(next_feedback) and next_feedback != previous_feedback
    sub.instructor_feedback = next_feedback
    sub.is_reviewed = body.is_reviewed
    await db.commit()
    await db.refresh(sub)

    if should_notify_feedback:
        background_tasks.add_task(
            send_instructor_feedback,
            user.telegram_chat_id,
            module.title,
            next_feedback,
        )

    return _submission_out(sub, user, group, module=module)


async def _groups_out(db: DbSession, groups: list[StudyGroup]) -> list[InstructorStudyGroupOut]:
    modules = (await db.scalars(select(Module).order_by(Module.order_index))).all()
    group_ids = [group.id for group in groups]
    deadline_rows = []
    if group_ids:
        deadline_rows = (
            await db.execute(
                select(StudyGroupDeadline.group_id, StudyGroupDeadline.module_id, StudyGroupDeadline.due_at)
                .where(StudyGroupDeadline.group_id.in_(group_ids))
            )
        ).all()
    deadline_map = {
        (group_id, module_id): due_at
        for group_id, module_id, due_at in deadline_rows
    }
    return [
        InstructorStudyGroupOut(
            id=group.id,
            name=group.name,
            description=group.description,
            deadlines=[
                InstructorGroupDeadlineOut(
                    module_slug=module.slug,
                    module_title=module.title,
                    module_order_index=module.order_index,
                    due_at=deadline_map.get((group.id, module.id)),
                )
                for module in modules
            ],
        )
        for group in groups
    ]


async def _student_submission_counts(db: DbSession) -> dict[uuid.UUID, tuple[int, int]]:
    rows = (
        await db.execute(
            select(Submission.user_id, Submission.is_reviewed)
        )
    ).all()
    counts: dict[uuid.UUID, tuple[int, int]] = {}
    for user_id, is_reviewed in rows:
        reviewed, unreviewed = counts.get(user_id, (0, 0))
        if is_reviewed:
            reviewed += 1
        else:
            unreviewed += 1
        counts[user_id] = (reviewed, unreviewed)
    return counts


async def _total_modules(db: DbSession) -> int:
    return await db.scalar(select(func.count(Module.id))) or 0


def _student_summary_out(
    user: User,
    group: StudyGroup | None,
    counts: tuple[int, int],
    total_modules: int,
) -> InstructorStudentOut:
    reviewed, unreviewed = counts
    submission_count = reviewed + unreviewed
    return InstructorStudentOut(
        id=user.id,
        name=user.name,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        dream=user.dream,
        study_group=StudyGroupOut.model_validate(group) if group else None,
        completed_count=submission_count,
        reviewed_count=reviewed,
        unreviewed_count=unreviewed,
        submission_count=submission_count,
        total_modules=total_modules,
    )


def _submission_out(
    sub: Submission,
    user: User,
    group: StudyGroup | None,
    module: Module | None,
) -> InstructorSubmissionOut:
    return InstructorSubmissionOut(
        id=sub.id,
        student=StudentOut(
            id=user.id,
            name=user.name,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            dream=user.dream,
            study_group=StudyGroupOut.model_validate(group) if group else None,
        ),
        module=(
            InstructorModuleBriefOut(
                slug=module.slug,
                title=module.title,
                order_index=module.order_index,
            )
            if module
            else None
        ),
        content=sub.content,
        instructor_feedback=sub.instructor_feedback,
        is_reviewed=sub.is_reviewed,
        submitted_at=sub.submitted_at,
        updated_at=sub.updated_at,
    )


def _clean_required(value: str) -> str:
    value = value.strip()
    if not value:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Name is required")
    return value


def _clean_optional(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None
