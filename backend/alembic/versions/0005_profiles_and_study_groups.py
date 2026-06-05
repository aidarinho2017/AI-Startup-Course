"""add profiles and study groups

Revision ID: 0005
Revises: 0004
Create Date: 2026-06-05

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "study_groups",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_study_groups_name", "study_groups", ["name"], unique=True)

    op.create_table(
        "study_group_deadlines",
        sa.Column("id", sa.Integer(), autoincrement=True, nullable=False),
        sa.Column("group_id", sa.Integer(), nullable=False),
        sa.Column("module_id", sa.Integer(), nullable=False),
        sa.Column("due_at", sa.DateTime(timezone=True), nullable=False),
        sa.ForeignKeyConstraint(["group_id"], ["study_groups.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["module_id"], ["modules.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("group_id", "module_id", name="uq_study_group_deadline_group_module"),
    )
    op.create_index("ix_study_group_deadlines_group_id", "study_group_deadlines", ["group_id"])
    op.create_index("ix_study_group_deadlines_module_id", "study_group_deadlines", ["module_id"])

    op.add_column("users", sa.Column("first_name", sa.String(length=255), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(length=255), nullable=True))
    op.add_column("users", sa.Column("dream", sa.Text(), nullable=True))
    op.add_column("users", sa.Column("study_group_id", sa.Integer(), nullable=True))
    op.create_index("ix_users_study_group_id", "users", ["study_group_id"])
    op.create_foreign_key(
        "fk_users_study_group_id_study_groups",
        "users",
        "study_groups",
        ["study_group_id"],
        ["id"],
        ondelete="SET NULL",
    )


def downgrade() -> None:
    op.drop_constraint("fk_users_study_group_id_study_groups", "users", type_="foreignkey")
    op.drop_index("ix_users_study_group_id", table_name="users")
    op.drop_column("users", "study_group_id")
    op.drop_column("users", "dream")
    op.drop_column("users", "last_name")
    op.drop_column("users", "first_name")

    op.drop_index("ix_study_group_deadlines_module_id", table_name="study_group_deadlines")
    op.drop_index("ix_study_group_deadlines_group_id", table_name="study_group_deadlines")
    op.drop_table("study_group_deadlines")

    op.drop_index("ix_study_groups_name", table_name="study_groups")
    op.drop_table("study_groups")
