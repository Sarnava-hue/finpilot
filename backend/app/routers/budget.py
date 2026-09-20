from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.budget import Budget
from app.schemas.budget import (
    BudgetCreate,
    BudgetResponse,
)
from app.services.budget import get_budget_status


router = APIRouter(
    prefix="/api/budgets",
    tags=["Budgets"],
)


@router.post(
    "",
    response_model=BudgetResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
):
    existing = (
        db.query(Budget)
        .filter(
            Budget.year == budget.year,
            Budget.month == budget.month,
            Budget.category == budget.category,
        )
        .first()
    )

    if existing:
        existing.monthly_limit = (
            budget.monthly_limit
        )

        db.commit()
        db.refresh(existing)

        return existing

    new_budget = Budget(
        **budget.model_dump()
    )

    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)

    return new_budget


@router.get("/status")
def budget_status(
    year: int,
    month: int,
    db: Session = Depends(get_db),
):
    return {
        "year": year,
        "month": month,
        "budgets": get_budget_status(
            db,
            year,
            month,
        ),
    }
    