from collections import defaultdict
from datetime import date

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def get_monthly_analytics(
    db: Session,
    year: int,
    month: int,
) -> dict:
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.date >= date(year, month, 1),
            Transaction.date < _next_month(year, month),
        )
        .all()
    )

    total_income = 0.0
    total_expenses = 0.0

    category_totals = defaultdict(float)

    income_count = 0
    expense_count = 0

    for transaction in transactions:
        if transaction.transaction_type == "income":
            total_income += transaction.amount
            income_count += 1

        elif transaction.transaction_type == "expense":
            total_expenses += transaction.amount
            expense_count += 1

            category = (
                transaction.category
                or "Uncategorized"
            )

            category_totals[category] += transaction.amount

    net_savings = total_income - total_expenses

    if total_income > 0:
        savings_rate = (
            net_savings / total_income
        ) * 100
    else:
        savings_rate = 0.0

    return {
        "year": year,
        "month": month,
        "total_income": round(total_income, 2),
        "total_expenses": round(total_expenses, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate": round(savings_rate, 2),
        "income_transaction_count": income_count,
        "expense_transaction_count": expense_count,
        "spending_by_category": {
            category: round(amount, 2)
            for category, amount in sorted(
                category_totals.items(),
                key=lambda item: item[1],
                reverse=True,
            )
        },
        "transaction_count": len(transactions),
    }


def _next_month(year: int, month: int) -> date:
    if month == 12:
        return date(year + 1, 1, 1)

    return date(year, month + 1, 1)
