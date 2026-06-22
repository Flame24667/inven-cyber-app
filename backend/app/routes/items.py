from fastapi import APIRouter, Depends, status
from pymongo.database import Database

from app.controllers import item_controller
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas import ItemCreate, ItemDetailResponse, ItemResponse, ItemUpdate


router = APIRouter(prefix="/items", tags=["items"])


@router.get("", response_model=list[ItemResponse])
def list_items(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    return item_controller.list_items(db)


@router.get("/{item_id}/detail", response_model=ItemDetailResponse)
def get_item_detail(
    item_id: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    return item_controller.get_item_detail(item_id, db)


@router.post("", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
def create_item(
    payload: ItemCreate,
    db: Database = Depends(get_db),
    current_user: dict = Depends(require_admin),
) -> dict:
    return item_controller.create_item(payload, db, current_user)


@router.patch("/{item_id}", response_model=ItemResponse)
def update_item(
    item_id: str,
    payload: ItemUpdate,
    db: Database = Depends(get_db),
    current_user: dict = Depends(require_admin),
) -> dict:
    return item_controller.update_item(item_id, payload, db)


@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(
    item_id: str,
    db: Database = Depends(get_db),
    current_user: dict = Depends(require_admin),
) -> None:
    item_controller.delete_item(item_id, db)
