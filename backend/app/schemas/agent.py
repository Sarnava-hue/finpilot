from pydantic import BaseModel, Field


class FinancialQuestion(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    year: int = Field(ge=2000, le=2100)
    month: int = Field(ge=1, le=12)
    