from datetime import datetime

from pydantic import BaseModel, ConfigDict


class VideoOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    youtube_id: str
    title: str
    order_index: int


class SubmissionFieldSpec(BaseModel):
    key: str
    label: str
    type: str
    required: bool = False
    placeholder: str = ""


class ModuleListOut(BaseModel):
    slug: str
    title: str
    description: str
    order_index: int
    has_chatbot: bool
    due_at: datetime | None = None
    deadline_state: str = "no_group"
    is_completed: bool


class ModuleDetailOut(BaseModel):
    slug: str
    title: str
    description: str
    order_index: int
    has_chatbot: bool
    due_at: datetime | None = None
    deadline_state: str = "no_group"
    is_completed: bool
    videos: list[VideoOut]
    submission_fields: list[SubmissionFieldSpec]


class DashboardOut(BaseModel):
    total: int
    completed: int
    progress_pct: int
    modules: list[ModuleListOut]
