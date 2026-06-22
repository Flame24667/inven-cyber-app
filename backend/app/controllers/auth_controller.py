from pymongo.database import Database

from app.schemas import LoginRequest, UserCreate
from app.services import auth_service


def register(payload: UserCreate, db: Database) -> dict:
    return auth_service.register_user(db, payload)


def login(payload: LoginRequest, db: Database) -> dict:
    return auth_service.login_user(db, payload)


def me(current_user: dict) -> dict:
    return current_user
