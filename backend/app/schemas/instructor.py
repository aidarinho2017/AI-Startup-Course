import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.profile import StudyGroupOut


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    dream: str | None = None
    study_group: StudyGroupOut | None = None


class InstructorModuleBriefOut(BaseModel):
    slug: str
    title: str
    order_index: int


class InstructorSubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student: StudentOut
    module: InstructorModuleBriefOut | None = None
    content: dict
    instructor_feedback: str | None
    is_reviewed: bool
    submitted_at: datetime
    updated_at: datetime


class InstructorModuleOut(BaseModel):
    slug: str
    title: str
    order_index: int
    submission_count: int


class InstructorStudentOut(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    first_name: str | None = None
    last_name: str | None = None
    dream: str | None = None
    study_group: StudyGroupOut | None = None
    completed_count: int
    reviewed_count: int
    unreviewed_count: int
    submission_count: int
    total_modules: int


class InstructorStudentSubmissionsOut(BaseModel):
    student: InstructorStudentOut
    submissions: list[InstructorSubmissionOut]


class InstructorGroupDeadlineOut(BaseModel):
    module_slug: str
    module_title: str
    module_order_index: int
    due_at: datetime | None = None


class InstructorStudyGroupOut(BaseModel):
    id: int
    name: str
    description: str | None = None
    deadlines: list[InstructorGroupDeadlineOut]


class StudyGroupCreateIn(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=4000)


class StudyGroupUpdateIn(BaseModel):
    name: str | None = Field(default=None, max_length=255)
    description: str | None = Field(default=None, max_length=4000)


class GroupDeadlineIn(BaseModel):
    module_slug: str
    due_at: datetime | None = None


class GroupDeadlinesUpdateIn(BaseModel):
    deadlines: list[GroupDeadlineIn]


class FeedbackIn(BaseModel):
    instructor_feedback: str | None = None
    is_reviewed: bool = False
