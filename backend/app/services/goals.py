from datetime import date

from sqlalchemy.orm import Session

from app.models.goal import SavingsGoal
from app.models.transaction import Transaction

def get_goal_progress(
    db: Session,
    goal_id: int,
) -> dict:
    goal = (
        db.query(SavingsGoal)
        .filter(
            SavingsGoal.id == goal_id
        )
        .first()
    )

    if not goal:
        return {
            "error": "Goal not found"
        }

    remaining = max(
        goal.target_amount - goal.current_amount,
        0,
    )

    progress_percentage = (
        goal.current_amount
        / goal.target_amount
    ) * 100

    result = {
        "id": goal.id,
        "name": goal.name,
        "target_amount": round(
            goal.target_amount,
            2,
        ),
        "current_amount": round(
            goal.current_amount,
            2,
        ),
        "remaining_amount": round(
            remaining,
            2,
        ),
        "progress_percentage": round(
            min(progress_percentage, 100),
            2,
        ),
        "target_date": (
            str(goal.target_date)
            if goal.target_date
            else None
        ),
    }

    if goal.target_date and remaining > 0:
        today = date.today()

        days_remaining = (
            goal.target_date - today
        ).days

        if days_remaining > 0:
            months_remaining = max(
                days_remaining / 30.44,
                1,
            )

            result["required_monthly_saving"] = round(
                remaining / months_remaining,
                2,
            )
        else:
            result["required_monthly_saving"] = round(
                remaining,
                2,
            )
    else:
        result["required_monthly_saving"] = None

    return result

def analyze_goal_impact(
    db: Session,
    goal_id: int,
    months_of_history: int = 3,
) -> dict:
    goal = (
        db.query(SavingsGoal)
        .filter(
            SavingsGoal.id == goal_id
        )
        .first()
    )

    if not goal:
        return {
            "error": "Goal not found"
        }

    transactions = (
        db.query(Transaction)
        .order_by(Transaction.date.desc())
        .all()
    )

    if not transactions:
        return {
            "error": "No transaction history available"
        }

    # Find the latest transaction month.
    latest_date = transactions[0].date

    # Use transactions from the requested number
    # of recent months.
    cutoff_year = latest_date.year
    cutoff_month = latest_date.month - (
        months_of_history - 1
    )

    while cutoff_month <= 0:
        cutoff_month += 12
        cutoff_year -= 1

    cutoff_date = date(
        cutoff_year,
        cutoff_month,
        1,
    )

    recent_transactions = [
        transaction
        for transaction in transactions
        if transaction.date >= cutoff_date
    ]

    total_income = sum(
        transaction.amount
        for transaction in recent_transactions
        if transaction.transaction_type == "income"
    )

    total_expenses = sum(
        transaction.amount
        for transaction in recent_transactions
        if transaction.transaction_type == "expense"
    )

    average_monthly_income = (
        total_income / months_of_history
    )

    average_monthly_expenses = (
        total_expenses / months_of_history
    )

    average_monthly_surplus = (
        average_monthly_income
        - average_monthly_expenses
    )

    progress = get_goal_progress(
        db,
        goal_id,
    )

    required_monthly_saving = (
        progress["required_monthly_saving"]
    )

    if required_monthly_saving is None:
        required_monthly_saving = 0.0

    projected_surplus = (
        average_monthly_surplus
        - required_monthly_saving
    )

    return {
        "goal_id": goal.id,
        "goal_name": goal.name,
        "analysis_period_months": months_of_history,
        "average_monthly_income": round(
            average_monthly_income,
            2,
        ),
        "average_monthly_expenses": round(
            average_monthly_expenses,
            2,
        ),
        "average_monthly_surplus": round(
            average_monthly_surplus,
            2,
        ),
        "required_monthly_goal_saving": round(
            required_monthly_saving,
            2,
        ),
        "projected_surplus_after_goal": round(
            projected_surplus,
            2,
        ),
        "goal_contribution_within_surplus": (
            required_monthly_saving
            <= average_monthly_surplus
        ),
    }