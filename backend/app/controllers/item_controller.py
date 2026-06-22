from pymongo.database import Database

from app.schemas import ItemCreate, ItemUpdate
from app.services import item_service


def list_items(db: Database) -> list[dict]:
    return item_service.list_items(db)


def get_item_detail(item_id: str, db: Database) -> dict:
    return item_service.get_item_detail(db, item_id)


def create_item(payload: ItemCreate, db: Database, current_user: dict) -> dict:
    return item_service.create_item(db, payload, current_user)


def update_item(item_id: str, payload: ItemUpdate, db: Database) -> dict:
    return item_service.update_item(db, item_id, payload)


def delete_item(item_id: str, db: Database) -> None:
    item_service.delete_item(db, item_id)
