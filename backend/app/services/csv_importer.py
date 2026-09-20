import csv
from datetime import date
from io import TextIOWrapper
import hashlib
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.services.ai_categorization import ai_categorize_transaction

REQUIRED_COLUMNS = {
    "date",
    "description",
    "merchant",
    "amount",
    "transaction_type",
    "category",
}

def generate_fingerprint(
    transaction_date: date,
    description: str,
    merchant: str | None,
    amount: float,
    transaction_type: str,
) -> str:
    raw = "|".join(
        [
            transaction_date.isoformat(),
            description.strip().lower(),
            (merchant or "").strip().lower(),
            f"{amount:.2f}",
            transaction_type.strip().lower(),
        ]
    )

    return hashlib.sha256(
        raw.encode("utf-8")
    ).hexdigest()

def import_transactions_from_csv(
    file,
    db: Session,
) -> dict:
    text_file = TextIOWrapper(
        file.file,
        encoding="utf-8-sig",
    )

    reader = csv.DictReader(text_file)

    if not reader.fieldnames:
        raise ValueError("CSV file is empty")

    missing_columns = REQUIRED_COLUMNS - set(reader.fieldnames)

    if missing_columns:
        raise ValueError(
            f"Missing required columns: {sorted(missing_columns)}"
        )

    imported_count = 0
    errors = []

    for row_number, row in enumerate(reader, start=2):
        try:
            transaction_date = date.fromisoformat(
                row["date"].strip()
            )

            amount = float(row["amount"].strip())

            if amount <= 0:
                raise ValueError("Amount must be greater than 0")

            transaction_type = (
                row["transaction_type"]
                .strip()
                .lower()
            )

            if transaction_type not in {"income", "expense"}:
                raise ValueError(
                    "transaction_type must be 'income' or 'expense'"
                )

            description = row["description"].strip()
            merchant = row["merchant"].strip() or None
            category = row["category"].strip() or None

            if not category:
                category, category_confidence = ai_categorize_transaction(
                    description=description,
                    merchant=merchant,
                    transaction_type=transaction_type,
                )
            else:
                category_confidence = 1.0

            fingerprint = generate_fingerprint(
                transaction_date=transaction_date,
                description=description,
                merchant=merchant,
                amount=amount,
                transaction_type=transaction_type,
            )

            existing_transaction = (
                db.query(Transaction)
                .filter(
                    Transaction.fingerprint == fingerprint
                )   
                .first()
            )

            if existing_transaction:
                continue

            transaction = Transaction(
                date=transaction_date,
                description=description,
                merchant=merchant,
                amount=amount,
                transaction_type=transaction_type,
                category=category,
                source="csv",
                confidence=category_confidence,
                fingerprint=fingerprint,
            )

            db.add(transaction)
            imported_count += 1

        except Exception as exc:
            errors.append(
                {
                    "row": row_number,
                    "error": str(exc),
                }
            )

    db.commit()

    return {
        "imported": imported_count,
        "failed": len(errors),
        "errors": errors,
    }
    