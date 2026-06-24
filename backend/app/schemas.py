from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, EmailStr, Field, field_validator

from app.security import ensure_password_supported


class Role(str, Enum):
    admin = "admin"
    staff = "staff"


class ItemStatus(str, Enum):
    available = "available"
    low_stock = "low_stock"
    out_of_stock = "out_of_stock"


class LoanStatus(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    returned = "returned"


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)
    role: Role = Role.staff

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, value: str) -> str:
        return ensure_password_supported(value)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)

    @field_validator("password")
    @classmethod
    def password_must_fit_bcrypt(cls, value: str) -> str:
        return ensure_password_supported(value)


class UserResponse(BaseModel):
    id: str
    name: str
    email: EmailStr
    role: Role
    created_at: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserResponse


class ItemCreate(BaseModel):
    asset_id: str = Field(min_length=2, max_length=50)
    name: str = Field(min_length=2, max_length=120)
    category: str = Field(min_length=2, max_length=80)
    location: str = Field(min_length=2, max_length=120)
    quantity: int = Field(ge=0)
    incoming_at: Optional[datetime] = None
    notes: Optional[str] = Field(default=None, max_length=500)


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=2, max_length=120)
    category: Optional[str] = Field(default=None, min_length=2, max_length=80)
    location: Optional[str] = Field(default=None, min_length=2, max_length=120)
    quantity: Optional[int] = Field(default=None, ge=0)
    incoming_at: Optional[datetime] = None
    outgoing_at: Optional[datetime] = None
    notes: Optional[str] = Field(default=None, max_length=500)


class ItemResponse(BaseModel):
    id: str
    asset_id: str
    name: str
    category: str
    location: str
    quantity: int
    incoming_at: datetime
    outgoing_at: Optional[datetime] = None
    notes: Optional[str] = None
    status: ItemStatus
    created_at: datetime
    updated_at: datetime


class LoanCreate(BaseModel):
    item_id: str
    borrower_name: str = Field(min_length=2, max_length=120)
    borrower_division: str = Field(min_length=2, max_length=120)
    quantity: int = Field(ge=1)
    borrowed_at: Optional[datetime] = None
    expected_return_at: datetime
    notes: Optional[str] = Field(default=None, max_length=500)


class LoanDecision(BaseModel):
    status: LoanStatus
    approval_notes: Optional[str] = Field(default=None, max_length=500)


class LoanReturn(BaseModel):
    return_notes: Optional[str] = Field(default=None, max_length=500)


class LoanResponse(BaseModel):
    id: str
    item_id: str
    item_name: str
    borrower_name: str
    borrower_division: str
    quantity: int
    borrowed_at: datetime
    expected_return_at: datetime
    returned_at: Optional[datetime] = None
    status: LoanStatus
    requested_by: str
    approved_by: Optional[str] = None
    approval_notes: Optional[str] = None
    notes: Optional[str] = None
    return_notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class ItemDetailResponse(ItemResponse):
    loan_history: list[LoanResponse] = Field(default_factory=list)
