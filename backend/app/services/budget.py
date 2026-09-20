from datetime import date

from sqlalchemy.orm import Session

from app.models.budget import Budget
from app.models.transaction import Transaction


def get_budget_status(
    db: Session,
    year: int,
    month: int,
) -> list[dict]:
    budgets = (
        db.query(Budget)
        .filter(
            Budget.year == year,
            Budget.month == month,
        )
        .all()
    )

    results = []

    for budget in budgets:
        start_date = date(year, month, 1)

        if month == 12:
            end_date = date(
                year + 1,
                1,
                1,
            )
        else:
            end_date = date(
                year,
                month + 1,
                1,
            )

        transactions = (
            db.query(Transaction)
            .filter(
                Transaction.date >= start_date,
                Transaction.date < end_date,
                Transaction.transaction_type == "expense",
                Transaction.category == budget.category,
            )
            .all()
        )

        spent = sum(
            transaction.amount
            for transaction in transactions
        )

        remaining = (
            budget.monthly_limit - spent
        )

        if budget.monthly_limit > 0:
            percentage_used = (
                spent / budget.monthly_limit
            ) * 100
        else:
            percentage_used = 0

        results.append(
            {
                "budget_id": budget.id,
                "category": budget.category,
                "monthly_limit": round(
                    budget.monthly_limit,
                    2,
                ),
                "spent": round(
                    spent,
                    2,
                ),
                "remaining": round(
                    remaining,
                    2,
                ),
                "percentage_used": round(
                    percentage_used,
                    2,
                ),
                "status": (
                    "over_budget"
                    if spent > budget.monthly_limit
                    else "within_budget"
                ),
            }
        )

    return results
