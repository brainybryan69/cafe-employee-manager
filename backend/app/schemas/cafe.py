from pydantic import BaseModel, field_validator


class CafeCreate(BaseModel):
    name: str
    description: str
    location: str
    logo: str | None = None

    @field_validator("name")
    @classmethod
    def name_length(cls, v: str) -> str:
        if len(v) < 6 or len(v) > 10:
            raise ValueError("Name must be between 6 and 10 characters")
        return v

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str) -> str:
        if len(v) > 256:
            raise ValueError("Description must not exceed 256 characters")
        return v


class CafeUpdate(CafeCreate):
    id: str


class CafeResponse(BaseModel):
    id: str
    name: str
    description: str
    employees: int
    logo: str | None
    location: str

    model_config = {"from_attributes": True}
