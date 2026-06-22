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
    db.items.create_index("sku", unique=True)
    db.loans.create_index([("item_id", 1), ("status", 1)])
