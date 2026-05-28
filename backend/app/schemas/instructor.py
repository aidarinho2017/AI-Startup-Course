import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class StudentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    email: EmailStr


class InstructorSubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student: StudentOut
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


class FeedbackIn(BaseModel):
    instructor_feedback: str | None = None
    is_reviewed: bool = False
