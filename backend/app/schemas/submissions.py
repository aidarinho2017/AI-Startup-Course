from datetime import datetime

from pydantic import BaseModel, ConfigDict


class SubmissionIn(BaseModel):
    content: dict


class SubmissionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    module_id: int
    content: dict
    submitted_at: datetime
    updated_at: datetime
