from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.models import Cafe, CafeEmployee
from app.schemas.cafe import CafeCreate, CafeUpdate, CafeResponse


def get_cafes(db: Session, location: str | None) -> list[CafeResponse]:
    query = db.query(
        Cafe,
        func.count(CafeEmployee.employee_id).label("employee_count")
    ).outerjoin(CafeEmployee, Cafe.id == CafeEmployee.cafe_id)

    if location:
        results = query.filter(Cafe.location.ilike(f"%{location}%")).group_by(Cafe.id).order_by(func.count(CafeEmployee.employee_id).desc()).all()
    else:
        results = query.group_by(Cafe.id).order_by(func.count(CafeEmployee.employee_id).desc()).all()

    return [
        CafeResponse(
            id=cafe.id,
            name=cafe.name,
            description=cafe.description,
            employees=count,
            logo=cafe.logo,
            location=cafe.location,
        )
        for cafe, count in results
    ]


def create_cafe(db: Session, data: CafeCreate) -> Cafe:
    import uuid
    cafe = Cafe(
        id=str(uuid.uuid4()),
        name=data.name,
        description=data.description,
        logo=data.logo,
        location=data.location,
    )
    db.add(cafe)
    db.commit()
    db.refresh(cafe)
    return cafe


def update_cafe(db: Session, data: CafeUpdate) -> Cafe:
    cafe = db.get(Cafe, data.id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    cafe.name = data.name
    cafe.description = data.description
    cafe.location = data.location
    if data.logo is not None:
        cafe.logo = data.logo
    db.commit()
    db.refresh(cafe)
    return cafe


def delete_cafe(db: Session, cafe_id: str) -> None:
    cafe = db.get(Cafe, cafe_id)
    if not cafe:
        raise HTTPException(status_code=404, detail="Cafe not found")
    db.delete(cafe)
    db.commit()
