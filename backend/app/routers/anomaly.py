from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.anomaly import (
    detect_unusual_spending,
)


router = APIRouter(
    prefix="/api/anomalies",
    tags=["Anomalies"],
)


@router.get("/spending")
def unusual_spending(
    db: Session = Depends(get_db),
):
    return {
        "unusual_transactions": (
            detect_unusual_spending(db)
        )
    }
    