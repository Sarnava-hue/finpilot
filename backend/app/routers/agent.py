from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.agent import FinancialQuestion
from app.services.ai_agent import (
    answer_financial_question,
    generate_monthly_summary,
)


router = APIRouter(
    prefix="/api/agent",
    tags=["AI Agent"],
)


@router.post("/ask")
def ask_financial_question(
    request: FinancialQuestion,
    db: Session = Depends(get_db),
):
    return answer_financial_question(
        db=db,
        question=request.question,
        year=request.year,
        month=request.month,
    )

@router.get("/monthly-summary")
def monthly_summary(
    year: int,
    month: int,
    db: Session = Depends(get_db),
):
    return generate_monthly_summary(
        db=db,
        year=year,
        month=month,
    )