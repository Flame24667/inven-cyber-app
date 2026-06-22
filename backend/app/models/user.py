from app.security import hash_password
from app.schemas import UserCreate
from app.utils import now_utc


def build_user_document(payload: UserCreate) -> dict:
    now = now_utc()
    return {
        "name": payload.name,
        "email": payload.email.lower(),
        "password_hash": hash_password(payload.password),
        "role": payload.role,
        "created_at": now,
        "updated_at": now,
    }
