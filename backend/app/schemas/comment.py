from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.comment import CommentStatus


class CommentCreate(BaseModel):
    body: str = Field(min_length=1, max_length=2000)


class CommentAuthor(BaseModel):
    name: str
    picture: str | None = None

    model_config = ConfigDict(from_attributes=True)


class CommentPublic(BaseModel):
    """Comentario aprobado, vista pública (sin email del autor)."""

    id: int
    body: str
    created_at: datetime
    author: CommentAuthor

    model_config = ConfigDict(from_attributes=True)


class CommentAdmin(BaseModel):
    """Vista del administrador: incluye estado para moderación."""

    id: int
    body: str
    status: CommentStatus
    created_at: datetime
    author: CommentAuthor

    model_config = ConfigDict(from_attributes=True)
