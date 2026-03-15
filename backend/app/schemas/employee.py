import re
from datetime import date
from pydantic import BaseModel, EmailStr, field_validator


class EmployeeCreate(BaseModel):
    name: str
    email_address: EmailStr
    phone_number: str
    gender: str
    cafe_id: str | None = None
    start_date: date | None = None

    @field_validator("name")
    @classmethod
    def name_length(cls, v: str) -> str:
        if len(v) < 6 or len(v) > 10:
            raise ValueError("Name must be between 6 and 10 characters")
        return v

    @field_validator("phone_number")
    @classmethod
    def phone_sg(cls, v: str) -> str:
        if not re.match(r"^[89]\d{7}$", v):
            raise ValueError("Phone number must start with 8 or 9 and be 8 digits")
        return v

    @field_validator("gender")
    @classmethod
    def gender_valid(cls, v: str) -> str:
        if v not in ("Male", "Female"):
            raise ValueError("Gender must be Male or Female")
        return v


class EmployeeUpdate(EmployeeCreate):
    id: str


class EmployeeResponse(BaseModel):
    id: str
    name: str
    email_address: str
    phone_number: str
    gender: str
    days_worked: int
    cafe: str

    model_config = {"from_attributes": True}
