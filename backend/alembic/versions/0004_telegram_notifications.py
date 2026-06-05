"""add telegram notifications

Revision ID: 0004
Revises: 0003
Create Date: 2026-06-04

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("modules", sa.Column("due_at", sa.DateTime(timezone=True), nullable=True))

    op.add_column("users", sa.Column("telegram_chat_id", sa.String(64), nullable=True))
    op.add_column("users", sa.Column("telegram_link_code_hash", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("telegram_link_code_expires_at", sa.DateTime(timezone=True), nullable=True))
    op.add_column("users", sa.Column("telegram_linked_at", sa.DateTime(timezone=True), nullable=True))
    op.create_index("ix_users_telegram_chat_id", "users", ["telegram_chat_id"], unique=True)
    op.create_index("ix_users_telegram_link_code_hash", "users", ["telegram_link_code_hash"])

    op.create_table(
        "telegram_notifications",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column(
            "user_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("users.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "module_id",
            sa.Integer(),
            sa.ForeignKey("modules.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(64), nullable=False),
        sa.Column(
            "sent_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "user_id",
            "module_id",
            "kind",
            name="uq_telegram_notification_user_module_kind",
        ),
    )
    op.create_index("ix_telegram_notifications_user_id", "telegram_notifications", ["user_id"])
    op.create_index("ix_telegram_notifications_module_id", "telegram_notifications", ["module_id"])


def downgrade() -> None:
    op.drop_index("ix_telegram_notifications_module_id", table_name="telegram_notifications")
    op.drop_index("ix_telegram_notifications_user_id", table_name="telegram_notifications")
    op.drop_table("telegram_notifications")

    op.drop_index("ix_users_telegram_link_code_hash", table_name="users")
    op.drop_index("ix_users_telegram_chat_id", table_name="users")
    op.drop_column("users", "telegram_linked_at")
    op.drop_column("users", "telegram_link_code_expires_at")
    op.drop_column("users", "telegram_link_code_hash")
    op.drop_column("users", "telegram_chat_id")

    op.drop_column("modules", "due_at")
