from fastapi import APIRouter, Depends, status
from pymongo.database import Database

from app.controllers import loan_controller
from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.schemas import LoanCreate, LoanDecision, LoanResponse, LoanReturn


router = APIRouter(prefix="/loans", tags=["loans"])


@router.get("", response_model=list[LoanResponse])
def list_loans(
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> list[dict]:
    return loan_controller.list_loans(db)


@router.post("", response_model=LoanResponse, status_code=status.HTTP_201_CREATED)
def request_loan(
    payload: LoanCreate,
    db: Database = Depends(get_db),
    current_user: dict = Depends(get_current_user),
) -> dict:
    return loan_controller.request_loan(payload, db, current_user)


@router.patch("/{loan_id}/decision", response_model=LoanResponse)
def decide_loan(
    loan_id: str,
    payload: LoanDecision,
    db: Database = Depends(get_db),
    current_user: dict = Depends(require_admin),
) -> dict:
    return loan_controller.decide_loan(loan_id, payload, db, current_user)


@router.patch("/{loan_id}/return", response_model=LoanResponse)
def return_loan(
    loan_id: str,
    payload: LoanReturn,
    db: Database = Depends(get_db),
    current_user: dict = Depends(require_admin),
) -> dict:
    return loan_controller.return_loan(loan_id, payload, db)
