"""
Run with: python seed.py
Seeds the database with sample cafes and employees.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from datetime import date, timedelta
from app.database import SessionLocal, engine, Base
import app.models  # register all models

Base.metadata.create_all(bind=engine)

from app.models import Cafe, Employee, CafeEmployee

CAFES = [
    {"id": "a1b2c3d4-0001-0001-0001-000000000001", "name": "Kopi Tiam", "description": "Traditional Singapore coffee shop with local delights", "location": "Orchard", "logo": None},
    {"id": "a1b2c3d4-0002-0002-0002-000000000002", "name": "Bean Scene", "description": "Specialty coffee and artisan pastries in the heart of the city", "location": "CBD", "logo": None},
    {"id": "a1b2c3d4-0003-0003-0003-000000000003", "name": "Cafe Latte", "description": "Cozy neighborhood cafe with a wide selection of teas and coffees", "location": "Tampines", "logo": None},
    {"id": "a1b2c3d4-0004-0004-0004-000000000004", "name": "GrindHouse", "description": "Modern cafe focused on single origin espresso and cold brew", "location": "Orchard", "logo": None},
]

EMPLOYEES = [
    {"name": "Alice Tan", "email": "alice.tan@email.com", "phone": "91234567", "gender": "Female", "cafe_idx": 0, "days_ago": 365},
    {"name": "Bob Lim", "email": "bob.lim@email.com", "phone": "81234567", "gender": "Male", "cafe_idx": 0, "days_ago": 200},
    {"name": "Carol Ng", "email": "carol.ng@email.com", "phone": "92345678", "gender": "Female", "cafe_idx": 0, "days_ago": 100},
    {"name": "David Koh", "email": "david.koh@email.com", "phone": "82345678", "gender": "Male", "cafe_idx": 1, "days_ago": 500},
    {"name": "Eve Wong", "email": "eve.wong@email.com", "phone": "93456789", "gender": "Female", "cafe_idx": 1, "days_ago": 300},
    {"name": "Frank Ong", "email": "frank.ong@email.com", "phone": "83456789", "gender": "Male", "cafe_idx": 2, "days_ago": 150},
    {"name": "Grace Lee", "email": "grace.lee@email.com", "phone": "94567890", "gender": "Female", "cafe_idx": 2, "days_ago": 45},
    {"name": "Henry Goh", "email": "henry.goh@email.com", "phone": "84567890", "gender": "Male", "cafe_idx": 3, "days_ago": 700},
    {"name": "Iris Chan", "email": "iris.chan@email.com", "phone": "95678901", "gender": "Female", "cafe_idx": None, "days_ago": 0},
]

EMPLOYEE_IDS = [
    "UIAB12345", "UIBC23456", "UICD34567", "UIDE45678",
    "UIEF56789", "UIFG67890", "UIGH78901", "UIHI89012", "UIIJ90123",
]


def seed():
    db = SessionLocal()
    try:
        # Clear existing data
        db.query(CafeEmployee).delete()
        db.query(Employee).delete()
        db.query(Cafe).delete()
        db.commit()

        # Insert cafes
        cafes = []
        for c in CAFES:
            cafe = Cafe(id=c["id"], name=c["name"], description=c["description"], location=c["location"], logo=c["logo"])
            db.add(cafe)
            cafes.append(cafe)
        db.commit()

        # Insert employees and assignments
        for i, e in enumerate(EMPLOYEES):
            emp = Employee(
                id=EMPLOYEE_IDS[i],
                name=e["name"],
                email_address=e["email"],
                phone_number=e["phone"],
                gender=e["gender"],
            )
            db.add(emp)
            db.flush()

            if e["cafe_idx"] is not None:
                start = date.today() - timedelta(days=e["days_ago"])
                db.add(CafeEmployee(
                    employee_id=EMPLOYEE_IDS[i],
                    cafe_id=cafes[e["cafe_idx"]].id,
                    start_date=start,
                ))

        db.commit()
        print(f"Seeded {len(CAFES)} cafes and {len(EMPLOYEES)} employees.")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
