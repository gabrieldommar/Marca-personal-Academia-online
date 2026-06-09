from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str
    picture: str | None = None
    role: str
    is_admin: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
