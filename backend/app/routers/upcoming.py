from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.upcoming import get_upcoming_obligations

router = APIRouter(
    prefix="/api/upcoming",
    tags=["Upcoming Obligations"],
)


@router.get("")
def upcoming_obligations(
    days_ahead: int = Query(
        default=30,
        ge=1,
        le=365,
    ),
    db: Session = Depends(get_db),
):
    return {
        "days_ahead": days_ahead,
        "obligations": get_upcoming_obligations(
            db=db,
            days_ahead=days_ahead,
        ),
    }