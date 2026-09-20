import re


CATEGORY_RULES = {
    "Housing": [
        "rent",
        "apartment",
        "landlord",
        "housing",
    ],
    "Groceries": [
        "grocery",
        "supermart",
        "supermarket",
        "walmart",
        "food mart",
    ],
    "Dining": [
        "restaurant",
        "cafe",
        "coffee",
        "dinner",
        "lunch",
        "pizza",
        "food corner",
    ],
    "Entertainment": [
        "netflix",
        "spotify",
        "prime video",
        "movie",
        "cinema",
        "gaming",
    ],
    "Utilities": [
        "electricity",
        "power company",
        "water bill",
        "gas bill",
        "internet",
        "wifi",
        "phone bill",
    ],
    "Shopping": [
        "amazon",
        "flipkart",
        "shopping",
        "mall",
        "store",
    ],
    "Transportation": [
        "uber",
        "ola",
        "taxi",
        "bus",
        "metro",
        "train",
        "fuel",
        "petrol",
        "diesel",
    ],
    "Healthcare": [
        "hospital",
        "doctor",
        "pharmacy",
        "medicine",
        "medical",
    ],
    "Salary": [
        "salary",
        "payroll",
        "wages",
    ],
}


def categorize_transaction(
    description: str,
    merchant: str | None = None,
    transaction_type: str = "expense",
) -> tuple[str, float]:
    """
    Return (category, confidence).

    Confidence is between 0 and 1.
    """

    if transaction_type == "income":
        text = f"{description} {merchant or ''}".lower()

        for keyword in CATEGORY_RULES["Salary"]:
            if keyword in text:
                return "Salary", 0.99

    text = f"{description} {merchant or ''}".lower()
    text = re.sub(r"\s+", " ", text).strip()

    for category, keywords in CATEGORY_RULES.items():
        if category == "Salary":
            continue

        for keyword in keywords:
            if keyword in text:
                return category, 0.95

    return "Other", 0.30
