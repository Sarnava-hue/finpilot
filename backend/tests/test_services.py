from datetime import date

from app.services.categorization import categorize_transaction
from app.services.csv_importer import generate_fingerprint
from app.services.pdf_importer import parse_transactions_from_text


def test_categorize_netflix():
    category, confidence = categorize_transaction(
        description="Netflix subscription",
        merchant="Netflix",
        transaction_type="expense",
    )

    assert category == "Entertainment"
    assert confidence > 0.9


def test_categorize_salary():
    category, confidence = categorize_transaction(
        description="Monthly salary",
        merchant="ABC Company",
        transaction_type="income",
    )

    assert category == "Salary"
    assert confidence > 0.9


def test_generate_fingerprint_is_deterministic():
    first = generate_fingerprint(
        transaction_date=date(2026, 9, 1),
        description="Netflix subscription",
        merchant="Netflix",
        amount=649.0,
        transaction_type="expense",
    )

    second = generate_fingerprint(
        transaction_date=date(2026, 9, 1),
        description="Netflix subscription",
        merchant="Netflix",
        amount=649.0,
        transaction_type="expense",
    )

    assert first == second


def test_pdf_parser():
    text = """01/09/2026 UPI-Netflix 649.00 DR
02/09/2026 Salary ABC 50,000.00 CR
03/09/2026 SuperMart 2,450.00 DR"""

    transactions = parse_transactions_from_text(text)

    assert len(transactions) == 3

    assert transactions[0]["amount"] == 649.0
    assert transactions[0]["transaction_type"] == "expense"

    assert transactions[1]["amount"] == 50000.0
    assert transactions[1]["transaction_type"] == "income"

    assert transactions[2]["amount"] == 2450.0
    assert transactions[2]["transaction_type"] == "expense"
    
def test_financial_insights_with_empty_database():
    from sqlalchemy import create_engine
    from sqlalchemy.orm import sessionmaker

    from app.database import Base
    from app.services.insights import generate_financial_insights

    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
    )

    TestingSessionLocal = sessionmaker(
        autocommit=False,
        autoflush=False,
        bind=engine,
    )

    Base.metadata.create_all(bind=engine)

    db = TestingSessionLocal()

    try:
        insights = generate_financial_insights(
            db=db,
            year=2026,
            month=9,
        )

        assert isinstance(insights, list)
    finally:
        db.close()