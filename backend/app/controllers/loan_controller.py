from pymongo.database import Database

from app.schemas import LoanCreate, LoanDecision, LoanReturn
from app.services import loan_service


def list_loans(db: Database) -> list[dict]:
    return loan_service.list_loans(db)


def request_loan(payload: LoanCreate, db: Database, current_user: dict) -> dict:
    return loan_service.request_loan(db, payload, current_user)


def decide_loan(loan_id: str, payload: LoanDecision, db: Database, current_user: dict) -> dict:
    return loan_service.decide_loan(db, loan_id, payload, current_user)


def return_loan(loan_id: str, payload: LoanReturn, db: Database) -> dict:
    return loan_service.return_loan(db, loan_id, payload)
