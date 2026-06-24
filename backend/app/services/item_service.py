from fastapi import HTTPException
from pymongo.database import Database

from app.models.item import build_item_document, build_item_update_document
from app.schemas import ItemCreate, ItemUpdate
from app.utils import object_id, serialize_item, serialize_loan


def list_items(db: Database) -> list[dict]:
    return [serialize_item(item) for item in db.items.find().sort("created_at", -1)]


def get_item(db: Database, item_id: str) -> dict:
    try:
        oid = object_id(item_id)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail="Invalid item id") from exc

    item = db.items.find_one({"_id": oid})
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


def get_item_detail(db: Database, item_id: str) -> dict:
    item = get_item(db, item_id)
    loans = db.loans.find({"item_id": item["_id"]}).sort("created_at", -1)
    item_data = serialize_item(item)
    item_data["loan_history"] = [serialize_loan(loan, item["name"]) for loan in loans]
    return item_data


def create_item(db: Database, payload: ItemCreate, current_user: dict) -> dict:
    asset_id = payload.asset_id.upper()
    if db.items.find_one({"$or": [{"asset_id": asset_id}, {"sku": asset_id}]}):
        raise HTTPException(status_code=409, detail="Asset ID already exists")

    document = build_item_document(payload, object_id(current_user["id"]))
    result = db.items.insert_one(document)
    item = db.items.find_one({"_id": result.inserted_id})
    return serialize_item(item)


def update_item(db: Database, item_id: str, payload: ItemUpdate) -> dict:
    item = get_item(db, item_id)
    changes = build_item_update_document(payload)
    if not changes:
        raise HTTPException(status_code=400, detail="No changes provided")

    db.items.update_one({"_id": item["_id"]}, {"$set": changes})
    updated = db.items.find_one({"_id": item["_id"]})
    return serialize_item(updated)


def delete_item(db: Database, item_id: str) -> None:
    item = get_item(db, item_id)
    result = db.items.delete_one({"_id": item["_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Item not found")
