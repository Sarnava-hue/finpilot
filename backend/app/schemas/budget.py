from pydantic import BaseModel, ConfigDict, Field


class BudgetCreate(BaseModel):
    year: int = Field(ge=2000, le=2100)
    month: int = Field(ge=1, le=12)
    category: str = Field(
        min_length=1,
        max_length=100,
    )
    monthly_limit: float = Field(gt=0)


class BudgetResponse(BudgetCreate):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )
    