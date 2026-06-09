from sqlalchemy.orm import Session

from app.config import settings
from app.models.user import User


def _role_for(email: str) -> str:
    return "admin" if email.lower() == settings.admin_email.lower() else "user"


def get_or_create_user(db: Session, *, email: str, name: str | None, picture: str | None) -> User:
    """Busca el usuario por email o lo crea. El rol se determina en el servidor
    comparando contra ADMIN_EMAIL en cada login (mantiene el rol sincronizado)."""
    role = _role_for(email)
    user = db.query(User).filter(User.email == email).first()

    if user:
        changed = False
        if user.role != role:
            user.role = role
            changed = True
        if name and user.name != name:
            user.name = name
            changed = True
        if picture and user.picture != picture:
            user.picture = picture
            changed = True
        if changed:
            db.commit()
            db.refresh(user)
        return user

    user = User(email=email, name=name or email, picture=picture, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
