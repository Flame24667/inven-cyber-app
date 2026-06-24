from pymongo import MongoClient
from pymongo.database import Database

from app.config import get_settings


settings = get_settings()
client = MongoClient(settings.mongo_uri)
db: Database = client[settings.mongo_db]


def get_db() -> Database:
    return db


def ensure_indexes() -> None:
    db.users.create_index("email", unique=True)
    item_indexes = db.items.index_information()
    if "sku_1" in item_indexes:
        db.items.drop_index("sku_1")
    if "asset_id_1" in item_indexes and not item_indexes["asset_id_1"].get("sparse", False):
        db.items.drop_index("asset_id_1")
    db.items.create_index("asset_id", unique=True, sparse=True)
    db.loans.create_index([("item_id", 1), ("status", 1)])
