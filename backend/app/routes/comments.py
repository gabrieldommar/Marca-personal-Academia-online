from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_admin, get_current_user
from app.models.comment import CommentStatus
from app.models.user import User
from app.schemas.comment import CommentAdmin, CommentCreate, CommentPublic
from app.services import comment_service

router = APIRouter(prefix="/api/comments", tags=["comments"])


@router.get(
    "/approved",
    response_model=list[CommentPublic],
    summary="Lista pública de comentarios aprobados (página principal)",
)
def approved(db: Session = Depends(get_db)):
    return comment_service.list_approved(db)


@router.post(
    "",
    response_model=CommentAdmin,
    status_code=status.HTTP_201_CREATED,
    summary="Crea un comentario (cualquier usuario autenticado con Google). Queda en 'pending'.",
)
def create_comment(
    data: CommentCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return comment_service.create(db, user, data)


@router.get(
    "/pending",
    response_model=list[CommentAdmin],
    summary="Lista de comentarios pendientes de moderación (admin)",
)
def pending(
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return comment_service.list_pending(db)


@router.patch(
    "/{comment_id}/approve",
    response_model=CommentAdmin,
    summary="Aprueba un comentario (admin)",
)
def approve(
    comment_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return comment_service.set_status(db, comment_id, CommentStatus.approved)


@router.patch(
    "/{comment_id}/reject",
    response_model=CommentAdmin,
    summary="Rechaza un comentario (admin)",
)
def reject(
    comment_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return comment_service.set_status(db, comment_id, CommentStatus.rejected)
