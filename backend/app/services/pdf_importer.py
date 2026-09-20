import re
from datetime import date

import fitz
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.services.ai_categorization import ai_categorize_transaction
from app.services.csv_importer import generate_fingerprint


DATE_PATTERN = r"\d{4}-\d{2}-\d{2}"
AMOUNT_PATTERN = r"\d+(?:,\d{3})*(?:\.\d{2})?"


def extract_text_from_pdf(file_bytes: bytes) -> str:
    document = fitz.open(stream=file_bytes, filetype="pdf")

    pages = []

    for page in document:
        pages.append(page.get_text())

    document.close()

    return "\n".join(pages)


def parse_transactions_from_text(text: str) -> list[dict]:
    transactions = []

    date_patterns = [
        r"(\d{4}-\d{2}-\d{2})",
        r"(\d{2}/\d{2}/\d{4})",
        r"(\d{2}-\d{2}-\d{4})",
    ]

    for raw_line in text.splitlines():
        line = raw_line.strip()

        if not line:
            continue

        transaction_date = None

        for pattern in date_patterns:
            match = re.search(pattern, line)

            if match:
                raw_date = match.group(1)

                try:
                    if "-" in raw_date and len(raw_date.split("-")[0]) == 4:
                        transaction_date = date.fromisoformat(raw_date)
                    else:
                        day, month, year = re.split(r"[/\-]", raw_date)
                        transaction_date = date(
                            int(year),
                            int(month),
                            int(day),
                        )

                    break

                except ValueError:
                    continue

        if not transaction_date:
            continue

        # Find monetary amounts such as:
        # 649
        # 649.00
        # 2,450.00
        amounts = re.findall(
            r"\b\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\b",
            line,
        )

        if not amounts:
            continue

        try:
            amount = float(amounts[-1].replace(",", ""))
        except ValueError:
            continue

        if amount <= 0:
            continue

        upper_line = line.upper()

        if re.search(r"\b(CR|CREDIT)\b", upper_line):
            transaction_type = "income"
        elif re.search(r"\b(DR|DEBIT)\b", upper_line):
            transaction_type = "expense"
        else:
            continue

        # Remove date, amount and debit/credit markers
        description = re.sub(
            r"\d{4}-\d{2}-\d{2}",
            "",
            line,
        )

        description = re.sub(
            r"\d{2}[/\-]\d{2}[/\-]\d{4}",
            "",
            description,
        )

        description = re.sub(
            r"\b\d{1,3}(?:,\d{3})*(?:\.\d{1,2})?\b",
            "",
            description,
        )

        description = re.sub(
            r"\b(CR|CREDIT|DR|DEBIT)\b",
            "",
            description,
            flags=re.IGNORECASE,
        )

        description = re.sub(r"\s+", " ", description).strip(" -|")

        if not description:
            description = "Unknown transaction"

        transactions.append(
            {
                "date": transaction_date,
                "description": description,
                "merchant": description,
                "amount": amount,
                "transaction_type": transaction_type,
            }
        )

    return transactions


def import_transactions_from_pdf(
    file_bytes: bytes,
    db: Session,
) -> dict:
    text = extract_text_from_pdf(file_bytes)

    if not text.strip():
        return {
            "imported": 0,
            "failed": 0,
            "errors": [],
            "message": "No readable text found in PDF.",
        }

    parsed_transactions = parse_transactions_from_text(text)

    imported_count = 0
    errors = []

    for transaction_data in parsed_transactions:
        try:
            category, confidence = ai_categorize_transaction(
                description=transaction_data["description"],
                merchant=transaction_data["merchant"],
                transaction_type=transaction_data["transaction_type"],
            )

            fingerprint = generate_fingerprint(
                transaction_date=transaction_data["date"],
                description=transaction_data["description"],
                merchant=transaction_data["merchant"],
                amount=transaction_data["amount"],
                transaction_type=transaction_data["transaction_type"],
            )

            existing = (
                db.query(Transaction)
                .filter(Transaction.fingerprint == fingerprint)
                .first()
            )

            if existing:
                continue

            transaction = Transaction(
                date=transaction_data["date"],
                description=transaction_data["description"],
                merchant=transaction_data["merchant"],
                amount=transaction_data["amount"],
                transaction_type=transaction_data["transaction_type"],
                category=category,
                source="pdf",
                confidence=confidence,
                fingerprint=fingerprint,
            )

            db.add(transaction)
            imported_count += 1

        except Exception as exc:
            errors.append(
                {
                    "description": transaction_data.get("description"),
                    "error": str(exc),
                }
            )

    db.commit()

    return {
        "imported": imported_count,
        "failed": len(errors),
        "errors": errors,
        "parsed_transactions": len(parsed_transactions),
    }