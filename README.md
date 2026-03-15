# Café Employee Manager

A full-stack web application for managing cafés and their employees.

## Tech Stack

- **Backend:** Python 3.12 + FastAPI + SQLAlchemy + PostgreSQL
- **Frontend:** React 19 + Vite + TypeScript + AG Grid + Ant Design + TanStack Query
- **Infrastructure:** Docker + Docker Compose

## Running with Docker (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Steps

```bash
# 1. Clone the repository and navigate to the project root
cd cafe-employee-manager

# 2. Start all services (database, backend, frontend)
docker compose up --build

# 3. Seed the database with sample data (in a separate terminal)
docker compose exec backend python seed.py
```

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs

## Running Locally (Development)

### Backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set environment variable (or create a .env file)
export DATABASE_URL=postgresql://cafe_user:cafe_pass@localhost:5432/cafe_db

# Start PostgreSQL (if not using Docker for DB only):
docker run -d -p 5432:5432 \
  -e POSTGRES_USER=cafe_user \
  -e POSTGRES_PASSWORD=cafe_pass \
  -e POSTGRES_DB=cafe_db \
  postgres:16-alpine

# Run database migrations / create tables
uvicorn app.main:app --reload  # tables are auto-created on startup

# Seed sample data
python seed.py

# Start the backend
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at http://localhost:5173 (Vite dev server).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cafes?location=` | List cafes (optional location filter), sorted by employee count |
| POST | `/cafes` | Create a café (multipart/form-data, supports logo upload) |
| PUT | `/cafes/{id}` | Update a café |
| DELETE | `/cafes/{id}` | Delete a café and all its employees |
| GET | `/employees?cafe=` | List employees (optional café filter), sorted by days worked |
| POST | `/employees` | Create an employee and optionally assign to a café |
| PUT | `/employees/{id}` | Update an employee and reassign café |
| DELETE | `/employees/{id}` | Delete an employee |

## Features

- **Cafés Page** — table view with logo, name, description, employee count, location; location filter; click employee count to see café's employees
- **Employees Page** — table view with ID, name, email, phone, days worked, café; filter by café
- **Add/Edit Café** — form with validation (name 6–10 chars, description max 256, logo max 2MB), unsaved-changes warning
- **Add/Edit Employee** — form with SG phone validation (starts with 8/9, 8 digits), email validation, café assignment
- **Delete** — confirmation dialog before deletion; cascades employees when a café is deleted
