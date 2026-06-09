from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.comment import Comment, CommentStatus
from app.models.user import User
from app.schemas.comment import CommentCreate


def _get(db: Session, comment_id: int) -> Comment:
    comment = db.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Comentario no encontrado")
    return comment


def list_approved(db: Session) -> list[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.status == CommentStatus.approved)
        .order_by(Comment.created_at.desc())
        .all()
    )


def list_pending(db: Session) -> list[Comment]:
    return (
        db.query(Comment)
        .filter(Comment.status == CommentStatus.pending)
        .order_by(Comment.created_at.asc())
        .all()
    )


def create(db: Session, user: User, data: CommentCreate) -> Comment:
    comment = Comment(user_id=user.id, body=data.body, status=CommentStatus.pending)
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


def set_status(db: Session, comment_id: int, new_status: CommentStatus) -> Comment:
    comment = _get(db, comment_id)
    comment.status = new_status
    db.commit()
    db.refresh(comment)
    return comment
