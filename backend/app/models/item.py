from bson import ObjectId

from app.schemas import ItemCreate, ItemUpdate
from app.utils import now_utc


def build_item_document(payload: ItemCreate, created_by: ObjectId) -> dict:
    now = now_utc()
    return {
        "sku": payload.sku.upper(),
        "name": payload.name,
        "category": payload.category,
        "location": payload.location,
        "quantity": payload.quantity,
        "incoming_at": payload.incoming_at,
        "outgoing_at": payload.outgoing_at,
        "notes": payload.notes,
        "created_by": created_by,
        "created_at": now,
        "updated_at": now,
    }


def build_item_update_document(payload: ItemUpdate) -> dict:
    changes = payload.model_dump(exclude_unset=True)
    if changes:
        changes["updated_at"] = now_utc()
    return changes
