import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class StudyGroupOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None = None


class ProfileOut(BaseModel):
    id: uuid.UUID
    email: EmailStr
    name: str
    first_name: str | None = None
    last_name: str | None = None
    dream: str | None = None
    study_group: StudyGroupOut | None = None
    created_at: datetime


class ProfileUpdateIn(BaseModel):
    first_name: str | None = Field(default=None, max_length=255)
    last_name: str | None = Field(default=None, max_length=255)
    dream: str | None = Field(default=None, max_length=4000)
    study_group_id: int | None = None
