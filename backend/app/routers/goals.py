from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.goal import SavingsGoal
from app.schemas.goal import (
    GoalCreate,
    GoalResponse,
)
from app.services.goals import (
    analyze_goal_impact,
    get_goal_progress,
)

router = APIRouter(
    prefix="/api/goals",
    tags=["Savings Goals"],
)


@router.post(
    "",
    response_model=GoalResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_goal(
    goal: GoalCreate,
    db: Session = Depends(get_db),
):
    new_goal = SavingsGoal(
        **goal.model_dump()
    )

    db.add(new_goal)
    db.commit()
    db.refresh(new_goal)

    return new_goal


@router.get("")
def list_goals(
    db: Session = Depends(get_db),
):
    goals = (
        db.query(SavingsGoal)
        .order_by(SavingsGoal.id.desc())
        .all()
    )

    return goals


@router.get("/{goal_id}/progress")
def goal_progress(
    goal_id: int,
    db: Session = Depends(get_db),
):
    return get_goal_progress(
        db,
        goal_id,
    )
    
@router.get("/{goal_id}/impact")
def goal_impact(
    goal_id: int,
    db: Session = Depends(get_db),
):
    return analyze_goal_impact(
        db,
        goal_id,
    )