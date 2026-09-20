from datetime import date

from sqlalchemy.orm import Session

from app.models.goal import SavingsGoal
from app.models.transaction import Transaction
from app.services.analytics import get_monthly_analytics
from app.services.anomaly import detect_unusual_spending
from app.services.budget import get_budget_status
from app.services.recurring import detect_recurring_payments
from app.services.goals import get_goal_progress


def get_dashboard_data(
    db: Session,
    year: int,
    month: int,
) -> dict:
    analytics = get_monthly_analytics(
        db=db,
        year=year,
        month=month,
    )

    budgets = get_budget_status(
        db=db,
        year=year,
        month=month,
    )

    anomalies = detect_unusual_spending(db)
    recurring = detect_recurring_payments(db)

    goals = db.query(SavingsGoal).order_by(SavingsGoal.id.desc()).all()

    goal_progress = []

    for goal in goals:
        progress = get_goal_progress(db, goal.id)

        if "error" not in progress:
            goal_progress.append(progress)

    start_date = date(year, month, 1)

    if month == 12:
        end_date = date(year + 1, 1, 1)
    else:
        end_date = date(year, month + 1, 1)

    recent_transactions = (
        db.query(Transaction)
        .filter(
            Transaction.date >= start_date,
            Transaction.date < end_date,
        )
        .order_by(Transaction.date.desc(), Transaction.id.desc())
        .limit(10)
        .all()
    )

    transactions = [
        {
            "id": transaction.id,
            "date": str(transaction.date),
            "description": transaction.description,
            "merchant": transaction.merchant,
            "amount": round(transaction.amount, 2),
            "transaction_type": transaction.transaction_type,
            "category": transaction.category,
            "confidence": transaction.confidence,
        }
        for transaction in recent_transactions
    ]

    return {
        "period": {
            "year": year,
            "month": month,
        },
        "analytics": analytics,
        "budgets": budgets,
        "unusual_transactions": anomalies,
        "recurring_payments": recurring,
        "goals": goal_progress,
        "recent_transactions": transactions,
    }