from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CollaborationBase(BaseModel):
    name: str = Field(min_length=1, max_length=200)
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None
    position: int = 0


class CollaborationCreate(CollaborationBase):
    pass


class CollaborationUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=200)
    logo_url: str | None = None
    website_url: str | None = None
    description: str | None = None
    position: int | None = None


class CollaborationResponse(CollaborationBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
