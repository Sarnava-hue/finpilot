from fastapi import FastAPI

app = FastAPI(
    title="FinPilot API",
    description="Personal Finance Decision Support API",
    version="0.1.0",
)


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
    