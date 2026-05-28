"""add instructor fields

Revision ID: 0003
Revises: 0002
Create Date: 2026-05-28

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("is_instructor", sa.Boolean(), nullable=False, server_default="false"))
    op.add_column("submissions", sa.Column("instructor_feedback", sa.Text(), nullable=True))
    op.add_column("submissions", sa.Column("is_reviewed", sa.Boolean(), nullable=False, server_default="false"))


def downgrade() -> None:
    op.drop_column("submissions", "is_reviewed")
    op.drop_column("submissions", "instructor_feedback")
    op.drop_column("users", "is_instructor")
