from datetime import date
from sqlalchemy import String, Date, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database import Base


class CafeEmployee(Base):
    __tablename__ = "cafe_employees"

    employee_id: Mapped[str] = mapped_column(String(9), ForeignKey("employees.id", ondelete="CASCADE"), primary_key=True)
    cafe_id: Mapped[str] = mapped_column(String(36), ForeignKey("cafes.id", ondelete="CASCADE"), nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)

    employee: Mapped["Employee"] = relationship("Employee", back_populates="cafe_employee")
    cafe: Mapped["Cafe"] = relationship("Cafe", back_populates="cafe_employees")
