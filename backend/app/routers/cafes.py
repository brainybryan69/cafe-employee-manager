import os
import uuid
from fastapi import APIRouter, Depends, Query, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.cafe import CafeCreate, CafeUpdate, CafeResponse
from app.services import cafe_service

router = APIRouter(prefix="/cafes", tags=["cafes"])

UPLOAD_DIR = "uploads"
MAX_LOGO_SIZE = 2 * 1024 * 1024  # 2MB


@router.get("", response_model=list[CafeResponse])
def get_cafes(location: str | None = Query(default=None), db: Session = Depends(get_db)):
    return cafe_service.get_cafes(db, location)


@router.post("", response_model=CafeResponse)
async def create_cafe(
    name: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    logo: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    logo_path = await _save_logo(logo) if logo and logo.filename else None
    data = CafeCreate(name=name, description=description, location=location, logo=logo_path)
    cafe = cafe_service.create_cafe(db, data)
    employees = len(cafe.cafe_employees)
    return CafeResponse(id=cafe.id, name=cafe.name, description=cafe.description, employees=employees, logo=cafe.logo, location=cafe.location)


@router.put("/{cafe_id}", response_model=CafeResponse)
async def update_cafe(
    cafe_id: str,
    name: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    logo: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
):
    logo_path = await _save_logo(logo) if logo and logo.filename else None
    data = CafeUpdate(id=cafe_id, name=name, description=description, location=location, logo=logo_path)
    cafe = cafe_service.update_cafe(db, data)
    employees = len(cafe.cafe_employees)
    return CafeResponse(id=cafe.id, name=cafe.name, description=cafe.description, employees=employees, logo=cafe.logo, location=cafe.location)


@router.delete("/{cafe_id}")
def delete_cafe(cafe_id: str, db: Session = Depends(get_db)):
    cafe_service.delete_cafe(db, cafe_id)
    return {"message": "Cafe deleted successfully"}


async def _save_logo(logo: UploadFile) -> str:
    content = await logo.read()
    if len(content) > MAX_LOGO_SIZE:
        raise HTTPException(status_code=400, detail="Logo must not exceed 2MB")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    ext = os.path.splitext(logo.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(content)
    return f"/uploads/{filename}"
