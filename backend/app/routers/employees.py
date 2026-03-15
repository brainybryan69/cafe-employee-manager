from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse
from app.services import employee_service

router = APIRouter(prefix="/employees", tags=["employees"])


@router.get("", response_model=list[EmployeeResponse])
def get_employees(cafe: str | None = Query(default=None), db: Session = Depends(get_db)):
    return employee_service.get_employees(db, cafe)


@router.post("", response_model=EmployeeResponse)
def create_employee(data: EmployeeCreate, db: Session = Depends(get_db)):
    employee = employee_service.create_employee(db, data)
    employees = employee_service.get_employees(db, None)
    return next(e for e in employees if e.id == employee.id)


@router.put("/{employee_id}", response_model=EmployeeResponse)
def update_employee(employee_id: str, data: EmployeeUpdate, db: Session = Depends(get_db)):
    data.id = employee_id
    employee_service.update_employee(db, data)
    employees = employee_service.get_employees(db, None)
    return next(e for e in employees if e.id == employee_id)


@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db)):
    employee_service.delete_employee(db, employee_id)
    return {"message": "Employee deleted successfully"}
