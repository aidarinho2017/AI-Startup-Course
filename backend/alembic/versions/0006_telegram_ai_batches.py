"""add telegram ai batches

Revision ID: 0006
Revises: 0005
Create Date: 2026-06-05

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0006"
down_revision: Union[str, None] = "0005"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "telegram_ai_batches",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column("telegram_chat_id", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False),
        sa.Column("retry_count", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("last_message_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("processing_started_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_telegram_ai_batches_user_id", "telegram_ai_batches", ["user_id"])
    op.create_index("ix_telegram_ai_batches_telegram_chat_id", "telegram_ai_batches", ["telegram_chat_id"])
    op.create_index("ix_telegram_ai_batches_status", "telegram_ai_batches", ["status"])
    op.create_index("ix_telegram_ai_batches_last_message_at", "telegram_ai_batches", ["last_message_at"])
    op.create_index(
        "ix_telegram_ai_batches_status_last_message_at",
        "telegram_ai_batches",
        ["status", "last_message_at"],
    )

    op.create_table(
        "telegram_ai_messages",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("batch_id", sa.Integer(), nullable=False),
        sa.Column("role", sa.String(length=16), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["batch_id"], ["telegram_ai_batches.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_telegram_ai_messages_batch_id", "telegram_ai_messages", ["batch_id"])


def downgrade() -> None:
    op.drop_index("ix_telegram_ai_messages_batch_id", table_name="telegram_ai_messages")
    op.drop_table("telegram_ai_messages")

    op.drop_index("ix_telegram_ai_batches_status_last_message_at", table_name="telegram_ai_batches")
    op.drop_index("ix_telegram_ai_batches_last_message_at", table_name="telegram_ai_batches")
    op.drop_index("ix_telegram_ai_batches_status", table_name="telegram_ai_batches")
    op.drop_index("ix_telegram_ai_batches_telegram_chat_id", table_name="telegram_ai_batches")
    op.drop_index("ix_telegram_ai_batches_user_id", table_name="telegram_ai_batches")
    op.drop_table("telegram_ai_batches")
