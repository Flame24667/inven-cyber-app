from fastapi import HTTPException
from pymongo.database import Database

from app.models.user import build_user_document
from app.schemas import LoginRequest, Role, UserCreate
from app.security import create_access_token, verify_password
from app.utils import serialize_user


def register_user(db: Database, payload: UserCreate) -> dict:
    if db.users.find_one({"email": payload.email.lower()}):
        raise HTTPException(status_code=409, detail="Email already registered")
    if payload.role == Role.admin and db.users.count_documents({}) > 0:
        raise HTTPException(status_code=403, detail="Admin registration is only allowed for the first user")

    result = db.users.insert_one(build_user_document(payload))
    user = db.users.find_one({"_id": result.inserted_id})
    user_data = serialize_user(user)
    return {
        "token": create_access_token(user_data["id"], user_data["role"]),
        "user": user_data,
    }


def login_user(db: Database, payload: LoginRequest) -> dict:
    user = db.users.find_one({"email": payload.email.lower()})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user_data = serialize_user(user)
    return {
        "token": create_access_token(user_data["id"], user_data["role"]),
        "user": user_data,
    }
