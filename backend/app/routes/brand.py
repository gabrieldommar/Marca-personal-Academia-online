from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_admin
from app.models.user import User
from app.schemas.collaboration import (
    CollaborationCreate,
    CollaborationResponse,
    CollaborationUpdate,
)
from app.services import collaboration_service

router = APIRouter(prefix="/api/brand/collaborations", tags=["brand"])


@router.get(
    "",
    response_model=list[CollaborationResponse],
    summary="Lista pública de colaboraciones/clientes",
)
def list_collaborations(db: Session = Depends(get_db)):
    return collaboration_service.list_all(db)


@router.post(
    "",
    response_model=CollaborationResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Crea una colaboración (admin)",
)
def create_collaboration(
    data: CollaborationCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return collaboration_service.create(db, data)


@router.patch(
    "/{collab_id}",
    response_model=CollaborationResponse,
    summary="Actualiza una colaboración (admin)",
)
def update_collaboration(
    collab_id: int,
    data: CollaborationUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return collaboration_service.update(db, collab_id, data)


@router.delete(
    "/{collab_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Elimina una colaboración (admin)",
)
def delete_collaboration(
    collab_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    collaboration_service.delete(db, collab_id)
