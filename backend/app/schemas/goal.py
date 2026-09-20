from datetime import date

from pydantic import BaseModel, ConfigDict, Field


class GoalCreate(BaseModel):
    name: str = Field(
        min_length=1,
        max_length=200,
    )

    target_amount: float = Field(
        gt=0,
    )

    current_amount: float = Field(
        default=0,
        ge=0,
    )

    target_date: date | None = None


class GoalResponse(GoalCreate):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )
    