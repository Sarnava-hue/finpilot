from sqlalchemy.orm import Session

from app.services.analytics import compare_monthly_analytics
from app.services.anomaly import detect_unusual_spending
from app.services.budget import get_budget_status
from app.services.goals import get_goal_progress
from app.services.recurring import detect_recurring_payments
from app.services.upcoming import get_upcoming_obligations
from app.models.goal import SavingsGoal


def get_decision_support(
    db: Session,
    year: int,
    month: int,
) -> dict:
    comparison = compare_monthly_analytics(
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
    upcoming = get_upcoming_obligations(db)

    goals = db.query(SavingsGoal).order_by(
        SavingsGoal.id.desc()
    ).all()

    goal_progress = []

    for goal in goals:
        progress = get_goal_progress(db, goal.id)

        if "error" not in progress:
            goal_progress.append(progress)

    budget_alerts = [
        budget
        for budget in budgets
        if budget["percentage_used"] >= 80
    ]

    return {
        "period": {
            "year": year,
            "month": month,
        },
        "monthly_comparison": comparison,
        "budget_alerts": budget_alerts,
        "unusual_transactions": anomalies,
        "recurring_payments": recurring,
        "upcoming_obligations": upcoming,
        "goals": goal_progress,
    }