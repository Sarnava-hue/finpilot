from fastapi import FastAPI

from app.database import Base, engine
from app.models.transaction import Transaction
from app.routers.transactions import router as transactions_router
from app.routers.upload import router as upload_router
from app.routers.analytics import router as analytics_router
from app.routers.recurring import router as recurring_router
from app.routers.anomaly import router as anomaly_router
from app.routers.budget import router as budget_router
from app.routers.goals import router as goals_router
from app.routers.agent import router as agent_router
from app.routers.dashboard import router as dashboard_router
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="FinPilot API",
    description="Personal Finance Decision Support API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(transactions_router)
app.include_router(upload_router)
app.include_router(analytics_router)
app.include_router(recurring_router)
app.include_router(anomaly_router)
app.include_router(budget_router)
app.include_router(goals_router)
app.include_router(agent_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "FinPilot API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
 
@app.get("/api")
def api_info():
    return {
        "name": "FinPilot API",
        "version": "0.1.0",
        "status": "ready",
        "features": [
            "transactions",
            "csv_upload",
            "pdf_upload",
            "monthly_analytics",
            "recurring_payments",
            "spending_anomalies",
            "budgets",
            "savings_goals",
            "ai_agent",
            "dashboard",
        ],
    }    