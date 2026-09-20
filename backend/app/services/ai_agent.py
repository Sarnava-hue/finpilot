import json

from openai import OpenAI
from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.orm import Session

from app.services.analytics import get_monthly_analytics
from app.services.anomaly import detect_unusual_spending
from app.services.recurring import detect_recurring_payments

class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-5.6-luna"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()


def answer_financial_question(
    db: Session,
    question: str,
    year: int,
    month: int,
) -> dict:
    analytics = get_monthly_analytics(
        db=db,
        year=year,
        month=month,
    )

    if not settings.openai_api_key:
        return {
            "answer": "AI service is not configured.",
            "financial_context": analytics,
        }

    client = OpenAI(api_key=settings.openai_api_key)

    prompt = f"""
You are FinPilot, a personal finance decision-support assistant.

Answer the user's question using ONLY the financial data provided below.

Do not invent financial facts.
Do not calculate values that are not supported by the provided data.
Keep the answer concise and explain the relevant numbers clearly.

Financial data:
{json.dumps(analytics, indent=2)}

User question:
{question}
"""

    try:
        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
        )

        return {
            "answer": response.output_text,
            "financial_context": analytics,
        }

    except Exception as exc:
        return {
            "answer": "AI generation failed.",
            "financial_context": analytics,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }

def generate_monthly_summary(
    db: Session,
    year: int,
    month: int,
) -> dict:
    analytics = get_monthly_analytics(
        db=db,
        year=year,
        month=month,
    )

    anomalies = detect_unusual_spending(db)
    recurring = detect_recurring_payments(db)

    context = {
        "analytics": analytics,
        "unusual_transactions": anomalies,
        "recurring_payments": recurring,
    }

    if not settings.openai_api_key:
        return {
            "summary": "AI service is not configured.",
            "financial_context": context,
        }

    client = OpenAI(api_key=settings.openai_api_key)

    prompt = f"""
You are FinPilot, a personal finance decision-support assistant.

Create a concise monthly financial summary using ONLY the supplied
financial data.

Include:
1. A short overview of income, expenses, and savings.
2. The largest spending categories.
3. Any unusual spending that appears in the data.
4. Relevant recurring payments.
5. Three practical observations the user can consider.

Do not invent transactions or numbers.
Do not provide investment recommendations.
Do not claim certainty where the data is incomplete.

Financial data:
{json.dumps(context, indent=2)}

Return a clear, friendly summary suitable for a dashboard.
"""

    try:
        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
        )

        return {
            "summary": response.output_text,
            "financial_context": context,
        }

    except Exception as exc:
        return {
            "summary": "AI generation failed.",
            "financial_context": context,
            "error_type": type(exc).__name__,
            "error": str(exc),
        }