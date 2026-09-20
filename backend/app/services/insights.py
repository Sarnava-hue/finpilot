from sqlalchemy.orm import Session

from app.services.analytics import get_monthly_analytics
from app.services.anomaly import detect_unusual_spending
from app.services.budget import get_budget_status
from app.services.recurring import detect_recurring_payments


def generate_financial_insights(
    db: Session,
    year: int,
    month: int,
) -> list[dict]:
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

    insights = []

    # Savings insight
    if analytics["total_income"] > 0:
        if analytics["net_savings"] > 0:
            insights.append({
                "type": "savings",
                "severity": "positive",
                "title": "Positive monthly savings",
                "message": (
                    f"You saved {analytics['net_savings']:.2f} "
                    f"this month, a savings rate of "
                    f"{analytics['savings_rate']:.2f}%."
                ),
            })
        else:
            insights.append({
                "type": "savings",
                "severity": "warning",
                "title": "Expenses exceeded income",
                "message": (
                    f"Your expenses exceeded income by "
                    f"{abs(analytics['net_savings']):.2f} this month."
                ),
            })

    # Largest category
    spending = analytics["spending_by_category"]

    if spending:
        category, amount = next(iter(spending.items()))

        insights.append({
            "type": "spending",
            "severity": "info",
            "title": "Largest spending category",
            "message": (
                f"{category} was your largest spending category "
                f"at {amount:.2f}."
            ),
        })

    # Budget warnings
    for budget in budgets:
        if budget["percentage_used"] >= 100:
            insights.append({
                "type": "budget",
                "severity": "warning",
                "title": f"{budget['category']} budget exceeded",
                "message": (
                    f"You spent {budget['spent']:.2f} against a "
                    f"{budget['monthly_limit']:.2f} budget."
                ),
            })

        elif budget["percentage_used"] >= 80:
            insights.append({
                "type": "budget",
                "severity": "warning",
                "title": f"{budget['category']} budget is nearly used",
                "message": (
                    f"You have used {budget['percentage_used']:.2f}% "
                    f"of your {budget['category']} budget."
                ),
            })

    # Anomalies
    if anomalies:
        insights.append({
            "type": "anomaly",
            "severity": "warning",
            "title": "Unusual spending detected",
            "message": (
                f"{len(anomalies)} transaction(s) were significantly "
                f"above historical category spending."
            ),
        })

    # Recurring payments
    if recurring:
        insights.append({
            "type": "recurring",
            "severity": "info",
            "title": "Recurring payments detected",
            "message": (
                f"{len(recurring)} recurring payment(s) were identified."
            ),
        })

    return insights