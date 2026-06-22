from datetime import datetime, timezone
from typing import Any, Dict

from bson import ObjectId

from app.schemas import ItemStatus


def now_utc() -> datetime:
    return datetime.now(timezone.utc)


def object_id(id_value: str) -> ObjectId:
    if not ObjectId.is_valid(id_value):
        raise ValueError("Invalid object id")
    return ObjectId(id_value)


def document_id(document: Dict[str, Any]) -> str:
    return str(document["_id"])


def item_status(quantity: int) -> ItemStatus:
    if quantity <= 0:
        return ItemStatus.out_of_stock
    if quantity <= 3:
        return ItemStatus.low_stock
    return ItemStatus.available


def serialize_user(document: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": document_id(document),
        "name": document["name"],
        "email": document["email"],
        "role": document["role"],
        "created_at": document["created_at"],
    }


def serialize_item(document: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": document_id(document),
        "sku": document["sku"],
        "name": document["name"],
        "category": document["category"],
        "location": document["location"],
        "quantity": document["quantity"],
        "incoming_at": document["incoming_at"],
        "outgoing_at": document.get("outgoing_at"),
        "notes": document.get("notes"),
        "status": item_status(document["quantity"]),
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }


def serialize_loan(document: Dict[str, Any], item_name: str = "") -> Dict[str, Any]:
    return {
        "id": document_id(document),
        "item_id": str(document["item_id"]),
        "item_name": item_name or document.get("item_name", "Unknown item"),
        "borrower_name": document["borrower_name"],
        "borrower_division": document["borrower_division"],
        "quantity": document["quantity"],
        "borrowed_at": document["borrowed_at"],
        "expected_return_at": document["expected_return_at"],
        "returned_at": document.get("returned_at"),
        "status": document["status"],
        "requested_by": str(document["requested_by"]),
        "approved_by": str(document["approved_by"]) if document.get("approved_by") else None,
        "approval_notes": document.get("approval_notes"),
        "notes": document.get("notes"),
        "return_notes": document.get("return_notes"),
        "created_at": document["created_at"],
        "updated_at": document["updated_at"],
    }
