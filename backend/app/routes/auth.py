from fastapi import APIRouter, Depends, status
from pymongo.database import Database

from app.controllers import auth_controller
from app.database import get_db
from app.dependencies import get_current_user
from app.schemas import AuthResponse, LoginRequest, UserCreate, UserResponse


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Database = Depends(get_db)) -> dict:
    return auth_controller.register(payload, db)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Database = Depends(get_db)) -> dict:
    return auth_controller.login(payload, db)


@router.get("/me", response_model=UserResponse)
def me(current_user: dict = Depends(get_current_user)) -> dict:
    return auth_controller.me(current_user)
