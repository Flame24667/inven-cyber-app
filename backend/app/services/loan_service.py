from fastapi import HTTPException
from pymongo.database import Database

from app.models.loan import build_loan_document
from app.schemas import LoanCreate, LoanDecision, LoanReturn, LoanStatus
from app.services.item_service import get_item
from app.utils import now_utc, object_id, serialize_loan


def list_loans(db: Database) -> list[dict]:
    loans = list(db.loans.find().sort("created_at", -1))
    item_ids = list({loan["item_id"] for loan in loans})
    item_names = {
        item["_id"]: item["name"]
        for item in db.items.find({"_id": {"$in": item_ids}}, {"name": 1})
    }
    return [serialize_loan(loan, item_names.get(loan["item_id"], "")) for loan in loans]


def request_loan(db: Database, payload: LoanCreate, current_user: dict) -> dict:
    item = get_item(db, payload.item_id)
    borrowed_at = payload.borrowed_at or now_utc()
    if payload.quantity > item["quantity"]:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds stock")
    if payload.expected_return_at <= borrowed_at:
        raise HTTPException(status_code=400, detail="Expected return must be after borrowed date")

    document = build_loan_document(payload, item, object_id(current_user["id"]))
    result = db.loans.insert_one(document)
    loan = db.loans.find_one({"_id": result.inserted_id})
    return serialize_loan(loan, item["name"])


def decide_loan(db: Database, loan_id: str, payload: LoanDecision, current_user: dict) -> dict:
    if payload.status not in [LoanStatus.approved, LoanStatus.rejected]:
        raise HTTPException(status_code=400, detail="Decision must be approved or rejected")

    loan = _get_loan(db, loan_id)
    if loan["status"] != LoanStatus.pending:
        raise HTTPException(status_code=400, detail="Only pending loans can be decided")

    item = db.items.find_one({"_id": loan["item_id"]})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if payload.status == LoanStatus.approved and loan["quantity"] > item["quantity"]:
        raise HTTPException(status_code=400, detail="Stock is no longer sufficient")

    now = now_utc()
    db.loans.update_one(
        {"_id": loan["_id"]},
        {
            "$set": {
                "status": payload.status,
                "approved_by": object_id(current_user["id"]),
                "approval_notes": payload.approval_notes,
                "updated_at": now,
            }
        },
    )
    if payload.status == LoanStatus.approved:
        db.items.update_one(
            {"_id": loan["item_id"]},
            {
                "$inc": {"quantity": -loan["quantity"]},
                "$set": {"outgoing_at": loan["borrowed_at"], "updated_at": now},
            },
        )

    updated = db.loans.find_one({"_id": loan["_id"]})
    return serialize_loan(updated, item["name"])


def return_loan(db: Database, loan_id: str, payload: LoanReturn) -> dict:
    loan = _get_loan(db, loan_id)
    if loan["status"] != LoanStatus.approved:
        raise HTTPException(status_code=400, detail="Only approved loans can be returned")

    now = now_utc()
    db.loans.update_one(
        {"_id": loan["_id"]},
        {
            "$set": {
                "status": LoanStatus.returned,
                "returned_at": now,
                "return_notes": payload.return_notes,
                "updated_at": now,
            }
        },
    )
    db.items.update_one(
        {"_id": loan["item_id"]},
        {"$inc": {"quantity": loan["quantity"]}, "$set": {"updated_at": now}},
    )

    item = db.items.find_one({"_id": loan["item_id"]})
    updated = db.loans.find_one({"_id": loan["_id"]})
    return serialize_loan(updated, item["name"] if item else "")


def _get_loan(db: Database, loan_id: str) -> dict:
    try:
        oid = object_id(loan_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid loan id") from exc

    loan = db.loans.find_one({"_id": oid})
    if not loan:
        raise HTTPException(status_code=404, detail="Loan not found")
    return loan
