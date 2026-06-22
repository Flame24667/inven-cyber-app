from fastapi import Depends, Header, HTTPException, status
from pymongo.database import Database

from app.database import get_db
from app.security import decode_token
from app.schemas import Role
from app.utils import object_id, serialize_user


def get_current_user(
    authorization: str = Header(default=""),
    db: Database = Depends(get_db),
) -> dict:
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token",
        )

    token = authorization.replace("Bearer ", "", 1)
    payload = decode_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    try:
        user_id = object_id(payload["sub"])
    except ValueError as exc:
        raise HTTPException(status_code=401, detail="Invalid token subject") from exc

    user = db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return serialize_user(user)


def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    if current_user["role"] != Role.admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user
