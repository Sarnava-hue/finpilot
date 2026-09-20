from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.decision_support import get_decision_support


router = APIRouter(
    prefix="/api/decision-support",
    tags=["Decision Support"],
)


@router.get("")
def decision_support(
    year: int = Query(..., ge=2000, le=2100),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
):
    return get_decision_support(
        db=db,
        year=year,
        month=month,
    )