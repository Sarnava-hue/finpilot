from collections import defaultdict
from datetime import date, timedelta
from statistics import mean

from sqlalchemy.orm import Session

from app.models.transaction import Transaction


def detect_recurring_payments(
    db: Session,
    min_occurrences: int = 3,
) -> list[dict]:
    transactions = (
        db.query(Transaction)
        .filter(
            Transaction.transaction_type == "expense",
            Transaction.merchant.isnot(None),
        )
        .order_by(Transaction.date)
        .all()
    )

    merchant_groups = defaultdict(list)

    for transaction in transactions:
        merchant_key = transaction.merchant.strip().lower()
        merchant_groups[merchant_key].append(transaction)

    recurring = []

    for merchant, items in merchant_groups.items():
        if len(items) < min_occurrences:
            continue

        amounts = [item.amount for item in items]
        average_amount = mean(amounts)

        max_deviation = max(
            abs(amount - average_amount)
            for amount in amounts
        )

        # Allow up to 15% variation in recurring amounts.
        if max_deviation > average_amount * 0.15:
            continue

        dates = [item.date for item in items]

        intervals = []

        for previous, current in zip(
            dates,
            dates[1:],
        ):
            intervals.append(
                (current - previous).days
            )

        if not intervals:
            continue

        average_interval = mean(intervals)

        next_payment_date = (
            dates[-1]
            + timedelta(days=round(average_interval))
        )

        recurring.append(
            {
                "merchant": items[0].merchant,
                "occurrences": len(items),
                "average_amount": round(
                    average_amount,
                    2,
                ),
                "last_payment_date": str(
                    dates[-1]
                ),
                "average_interval_days": round(
                    average_interval,
                    1,
                ),
                "next_expected_date": str(
                    next_payment_date
                ),
                "category": items[0].category,
            }
        )

    return sorted(
        recurring,
        key=lambda item: item["next_expected_date"],
    )
    