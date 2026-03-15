from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[str] = mapped_column(String(9), primary_key=True)  # UIXXXXXXX
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    email_address: Mapped[str] = mapped_column(String(255), nullable=False, unique=True)
    phone_number: Mapped[str] = mapped_column(String(8), nullable=False)
    gender: Mapped[str] = mapped_column(String(6), nullable=False)  # Male/Female

    cafe_employee: Mapped["CafeEmployee | None"] = relationship(
        "CafeEmployee", back_populates="employee", cascade="all, delete-orphan", uselist=False
    )
