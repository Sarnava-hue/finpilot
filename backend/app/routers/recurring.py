from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.recurring import (
    detect_recurring_payments,
)


router = APIRouter(
    prefix="/api/recurring",
    tags=["Recurring Payments"],
)


@router.get("")
def recurring_payments(
    db: Session = Depends(get_db),
):
    return {
        "recurring_payments": detect_recurring_payments(
            db
        )
    }


@router.get("/upcoming")
def upcoming_obligations(
    db: Session = Depends(get_db),
):
    recurring = detect_recurring_payments(db)

    today = date.today()

    upcoming = []

    for payment in recurring:
        expected_date = date.fromisoformat(
            payment["next_expected_date"]
        )

        days_until = (
            expected_date - today
        ).days

        upcoming.append(
            {
                **payment,
                "days_until": days_until,
            }
        )

    upcoming.sort(
        key=lambda item: item["next_expected_date"]
    )

    return {
        "upcoming_obligations": upcoming
    }
    