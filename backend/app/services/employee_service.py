import random
import string
from datetime import date
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException

from app.models import Employee, Cafe, CafeEmployee
from app.schemas.employee import EmployeeCreate, EmployeeUpdate, EmployeeResponse


def _generate_employee_id(db: Session) -> str:
    while True:
        suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=7))
        eid = f"UI{suffix}"
        if not db.get(Employee, eid):
            return eid


def _days_worked(start_date: date) -> int:
    return (date.today() - start_date).days


def get_employees(db: Session, cafe_name: str | None) -> list[EmployeeResponse]:
    query = db.query(Employee).options(
        joinedload(Employee.cafe_employee).joinedload(CafeEmployee.cafe)
    )

    if cafe_name:
        query = query.join(CafeEmployee, Employee.id == CafeEmployee.employee_id)\
                     .join(Cafe, CafeEmployee.cafe_id == Cafe.id)\
                     .filter(Cafe.name.ilike(f"%{cafe_name}%"))

    employees = query.all()

    def sort_key(emp: Employee) -> int:
        if emp.cafe_employee:
            return _days_worked(emp.cafe_employee.start_date)
        return 0

    employees.sort(key=sort_key, reverse=True)

    return [
        EmployeeResponse(
            id=emp.id,
            name=emp.name,
            email_address=emp.email_address,
            phone_number=emp.phone_number,
            gender=emp.gender,
            days_worked=_days_worked(emp.cafe_employee.start_date) if emp.cafe_employee else 0,
            cafe=emp.cafe_employee.cafe.name if emp.cafe_employee else "",
        )
        for emp in employees
    ]


def create_employee(db: Session, data: EmployeeCreate) -> Employee:
    employee_id = _generate_employee_id(db)
    employee = Employee(
        id=employee_id,
        name=data.name,
        email_address=data.email_address,
        phone_number=data.phone_number,
        gender=data.gender,
    )
    db.add(employee)

    if data.cafe_id:
        cafe = db.get(Cafe, data.cafe_id)
        if not cafe:
            raise HTTPException(status_code=404, detail="Cafe not found")
        start = data.start_date or date.today()
        db.add(CafeEmployee(employee_id=employee_id, cafe_id=data.cafe_id, start_date=start))

    db.commit()
    db.refresh(employee)
    return employee


def update_employee(db: Session, data: EmployeeUpdate) -> Employee:
    employee = db.get(Employee, data.id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    employee.name = data.name
    employee.email_address = data.email_address
    employee.phone_number = data.phone_number
    employee.gender = data.gender

    # Update cafe assignment
    existing = db.get(CafeEmployee, data.id)
    if data.cafe_id:
        cafe = db.get(Cafe, data.cafe_id)
        if not cafe:
            raise HTTPException(status_code=404, detail="Cafe not found")
        if existing:
            existing.cafe_id = data.cafe_id
        else:
            start = data.start_date or date.today()
            db.add(CafeEmployee(employee_id=data.id, cafe_id=data.cafe_id, start_date=start))
    else:
        if existing:
            db.delete(existing)

    db.commit()
    db.refresh(employee)
    return employee


def delete_employee(db: Session, employee_id: str) -> None:
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    db.delete(employee)
    db.commit()
