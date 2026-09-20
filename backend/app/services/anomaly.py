from collections import defaultdict
from statistics import mean, pstdev

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def detect_unusual_spending(
    db: Session,
    z_threshold: float = 1.5,
) -> list[dict]:
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.transaction_type == "expense"
        )
        .order_by(Transaction.date, Transaction.id)
        .all()
    )

    category_history = defaultdict(list)
    unusual_transactions = []

    for transaction in transactions:
        category = (
            transaction.category
            or "Uncategorized"
        )

        history = category_history[category]

        # We need at least 3 previous transactions
        # to establish a basic spending pattern.
        if len(history) >= 3:
            average_amount = mean(history)

            std_amount = pstdev(history)

            if std_amount == 0:
                # If historical spending is identical,
                # flag a transaction that is substantially
                # larger than that historical amount.
                if transaction.amount >= average_amount * 2:
                    unusual_transactions.append(
                        {
                            "transaction_id": transaction.id,
                            "date": str(transaction.date),
                            "description": transaction.description,
                            "merchant": transaction.merchant,
                            "amount": round(
                                transaction.amount,
                                2,
                            ),
                            "category": category,
                            "category_average": round(
                                average_amount,
                                2,
                            ),
                            "z_score": None,
                            "reason": (
                                "Transaction is at least "
                                "twice the historical "
                                "average for this category."
                            ),
                        }
                    )

            else:
                z_score = (
                    transaction.amount - average_amount
                ) / std_amount

                if z_score >= z_threshold:
                    unusual_transactions.append(
                        {
                            "transaction_id": transaction.id,
                            "date": str(transaction.date),
                            "description": transaction.description,
                            "merchant": transaction.merchant,
                            "amount": round(
                                transaction.amount,
                                2,
                            ),
                            "category": category,
                            "category_average": round(
                                average_amount,
                                2,
                            ),
                            "z_score": round(
                                z_score,
                                2,
                            ),
                            "reason": (
                                "Transaction amount is "
                                "significantly above the "
                                "historical average for "
                                "this category."
                            ),
                        }
                    )

        # Add this transaction only AFTER evaluating it.
        history.append(transaction.amount)

    return unusual_transactions