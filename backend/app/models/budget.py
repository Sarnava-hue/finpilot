from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    __table_args__ = (
        UniqueConstraint(
            "year",
            "month",
            "category",
            name="uq_budget_month_category",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    year: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    month: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )

    category: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    monthly_limit: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )
    