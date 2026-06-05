import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String(255), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    last_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    dream: Mapped[str | None] = mapped_column(Text, nullable=True)
    study_group_id: Mapped[int | None] = mapped_column(
        Integer,
        ForeignKey("study_groups.id", ondelete="SET NULL"),
        nullable=True,
        index=True,
    )
    google_id: Mapped[str | None] = mapped_column(String(255), unique=True, nullable=True, index=True)
    is_instructor: Mapped[bool] = mapped_column(default=False, nullable=False, server_default="false")
    telegram_chat_id: Mapped[str | None] = mapped_column(String(64), unique=True, nullable=True, index=True)
    telegram_link_code_hash: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    telegram_link_code_expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    telegram_linked_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), nullable=False
    )

    study_group: Mapped["StudyGroup | None"] = relationship("StudyGroup")
