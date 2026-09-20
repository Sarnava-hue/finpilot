from datetime import date, timedelta

from sqlalchemy.orm import Session

from app.services.recurring import detect_recurring_payments


def get_upcoming_obligations(
    db: Session,
    days_ahead: int = 30,
) -> list[dict]:
    today = date.today()
    cutoff = today + timedelta(days=days_ahead)

    recurring = detect_recurring_payments(db)

    upcoming = []

    for payment in recurring:
        expected_date = date.fromisoformat(
            payment["next_expected_date"]
        )

        if today <= expected_date <= cutoff:
            upcoming.append({
                **payment,
                "days_until": (expected_date - today).days,
            })

    return sorted(
        upcoming,
        key=lambda item: item["next_expected_date"],
    )