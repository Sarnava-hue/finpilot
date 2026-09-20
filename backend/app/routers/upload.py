from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_db
from app.services.csv_importer import import_transactions_from_csv
from app.services.pdf_importer import (
    import_transactions_from_pdf,
    extract_text_from_pdf,
    parse_transactions_from_text,
)

router = APIRouter(prefix="/api/upload", tags=["Upload"])


@router.post("/csv")
def upload_csv(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        return {"error": "No file provided"}

    if not file.filename.lower().endswith(".csv"):
        return {"error": "Only CSV files are supported"}

    result = import_transactions_from_csv(file, db)

    return {
        "filename": file.filename,
        **result,
    }


@router.post("/pdf/preview")
async def preview_pdf(file: UploadFile = File(...)):
    if not file.filename:
        return {"error": "No file provided"}

    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF files are supported"}

    file_bytes = await file.read()

    try:
        text = extract_text_from_pdf(file_bytes)
        transactions = parse_transactions_from_text(text)

        return {
            "filename": file.filename,
            "parsed_count": len(transactions),
            "transactions": transactions,
        }

    except Exception as exc:
        return {
            "filename": file.filename,
            "parsed_count": 0,
            "transactions": [],
            "error": str(exc),
        }


@router.post("/pdf")
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    if not file.filename:
        return {"error": "No file provided"}

    if not file.filename.lower().endswith(".pdf"):
        return {"error": "Only PDF files are supported"}

    file_bytes = await file.read()

    result = import_transactions_from_pdf(
        file_bytes=file_bytes,
        db=db,
    )

    return {
        "filename": file.filename,
        **result,
    }