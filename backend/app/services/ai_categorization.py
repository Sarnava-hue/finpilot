import json

from openai import OpenAI
from pydantic_settings import BaseSettings, SettingsConfigDict

from app.services.categorization import categorize_transaction


class Settings(BaseSettings):
    openai_api_key: str = ""
    openai_model: str = "gpt-5.6-luna"

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
    )


settings = Settings()


ALLOWED_CATEGORIES = [
    "Housing",
    "Groceries",
    "Dining",
    "Entertainment",
    "Utilities",
    "Shopping",
    "Transportation",
    "Healthcare",
    "Salary",
    "Other",
]


def ai_categorize_transaction(
    description: str,
    merchant: str | None = None,
    transaction_type: str = "expense",
) -> tuple[str, float]:

    # First try deterministic rules.
    category, confidence = categorize_transaction(
        description=description,
        merchant=merchant,
        transaction_type=transaction_type,
    )

    if category != "Other":
        return category, confidence

    # If no API key is configured, safely keep the fallback.
    if not settings.openai_api_key:
        return "Other", 0.30

    client = OpenAI(api_key=settings.openai_api_key)

    prompt = f"""
Classify this financial transaction into exactly one category.

Allowed categories:
{", ".join(ALLOWED_CATEGORIES)}

Transaction description: {description}
Merchant: {merchant or "Unknown"}
Transaction type: {transaction_type}

Return ONLY valid JSON:
{{
  "category": "one allowed category",
  "confidence": 0.0
}}

Confidence must be between 0 and 1.
"""

    try:
        response = client.responses.create(
            model=settings.openai_model,
            input=prompt,
        )

        result = json.loads(response.output_text)

        category = result.get("category", "Other")
        confidence = float(result.get("confidence", 0.0))

        if category not in ALLOWED_CATEGORIES:
            return "Other", 0.0

        confidence = max(0.0, min(confidence, 1.0))

        return category, confidence

    except Exception:
        # Never let an AI failure break CSV importing.
        return "Other", 0.0