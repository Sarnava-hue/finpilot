from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class TransactionBase(BaseModel):
    date: date
    description: str = Field(min_length=1, max_length=500)
    merchant: str | None = None
    amount: float = Field(gt=0)
    transaction_type: Literal["income", "expense"]
    category: str | None = None
    source: str | None = None
    confidence: float | None = Field(default=None, ge=0, le=1)


class TransactionCreate(TransactionBase):
    pass


class TransactionResponse(TransactionBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
    