from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.collaboration import Collaboration
from app.schemas.collaboration import CollaborationCreate, CollaborationUpdate


def _get(db: Session, collab_id: int) -> Collaboration:
    collab = db.get(Collaboration, collab_id)
    if not collab:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Colaboración no encontrada")
    return collab


def list_all(db: Session) -> list[Collaboration]:
    return (
        db.query(Collaboration)
        .order_by(Collaboration.position, Collaboration.created_at)
        .all()
    )


def create(db: Session, data: CollaborationCreate) -> Collaboration:
    collab = Collaboration(**data.model_dump())
    db.add(collab)
    db.commit()
    db.refresh(collab)
    return collab


def update(db: Session, collab_id: int, data: CollaborationUpdate) -> Collaboration:
    collab = _get(db, collab_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(collab, field, value)
    db.commit()
    db.refresh(collab)
    return collab


def delete(db: Session, collab_id: int) -> None:
    collab = _get(db, collab_id)
    db.delete(collab)
    db.commit()
