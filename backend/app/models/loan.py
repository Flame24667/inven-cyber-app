from bson import ObjectId

from app.schemas import LoanCreate, LoanStatus
from app.utils import now_utc


def build_loan_document(payload: LoanCreate, item: dict, requested_by: ObjectId) -> dict:
    now = now_utc()
    return {
        "item_id": item["_id"],
        "item_name": item["name"],
        "borrower_name": payload.borrower_name,
        "borrower_division": payload.borrower_division,
        "quantity": payload.quantity,
        "borrowed_at": payload.borrowed_at or now,
        "expected_return_at": payload.expected_return_at,
        "status": LoanStatus.pending,
        "requested_by": requested_by,
        "approved_by": None,
        "approval_notes": None,
        "notes": payload.notes,
        "returned_at": None,
        "return_notes": None,
        "created_at": now,
        "updated_at": now,
    }
