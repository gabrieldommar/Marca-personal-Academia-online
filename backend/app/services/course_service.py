import re

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.course import Category, Content, ContentType, Course
from app.schemas.course import (
    ContentCreate,
    ContentUpdate,
    CourseCreate,
    CourseUpdate,
)


def _slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "curso"


def _unique_slug(db: Session, base: str) -> str:
    slug = base
    i = 2
    while db.query(Course).filter(Course.slug == slug).first():
        slug = f"{base}-{i}"
        i += 1
    return slug


def _get_course(db: Session, course_id: int) -> Course:
    course = db.get(Course, course_id)
    if not course:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Curso no encontrado")
    return course


def _get_content(db: Session, content_id: int) -> Content:
    content = db.get(Content, content_id)
    if not content:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Contenido no encontrado")
    return content


def _validate_content_fields(content_type: ContentType | None, provider) -> None:
    # Un video debe declarar provider; un PDF no debe tenerlo.
    if content_type == ContentType.video and provider is None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Un video requiere 'provider'")
    if content_type == ContentType.pdf and provider is not None:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Un PDF no debe tener 'provider'")


# ---- Cursos (lectura pública) ----

def list_all(db: Session) -> list[Course]:
    return db.query(Course).order_by(Course.created_at.desc()).all()


def list_by_category(db: Session, category: Category) -> list[Course]:
    return (
        db.query(Course)
        .filter(Course.category == category)
        .order_by(Course.created_at.desc())
        .all()
    )


def get_detail(db: Session, category: Category, slug: str) -> Course:
    course = (
        db.query(Course)
        .filter(Course.category == category, Course.slug == slug)
        .first()
    )
    if not course:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Curso no encontrado")
    return course


# ---- Cursos (escritura admin) ----

def create_course(db: Session, data: CourseCreate) -> Course:
    base = _slugify(data.slug) if data.slug else _slugify(data.title)
    slug = _unique_slug(db, base)
    course = Course(
        slug=slug,
        title=data.title,
        description=data.description,
        category=data.category,
        cover_image=data.cover_image,
        price=data.price,
    )
    db.add(course)
    db.commit()
    db.refresh(course)
    return course


def update_course(db: Session, course_id: int, data: CourseUpdate) -> Course:
    course = _get_course(db, course_id)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(course, field, value)
    db.commit()
    db.refresh(course)
    return course


def delete_course(db: Session, course_id: int) -> None:
    course = _get_course(db, course_id)
    db.delete(course)
    db.commit()


# ---- Contenido (escritura admin) ----

def add_content(db: Session, course_id: int, data: ContentCreate) -> Content:
    _get_course(db, course_id)
    _validate_content_fields(data.type, data.provider)
    content = Content(course_id=course_id, **data.model_dump())
    db.add(content)
    db.commit()
    db.refresh(content)
    return content


def update_content(db: Session, content_id: int, data: ContentUpdate) -> Content:
    content = _get_content(db, content_id)
    updates = data.model_dump(exclude_unset=True)
    new_type = updates.get("type", content.type)
    new_provider = updates.get("provider", content.provider)
    _validate_content_fields(new_type, new_provider)
    for field, value in updates.items():
        setattr(content, field, value)
    db.commit()
    db.refresh(content)
    return content


def delete_content(db: Session, content_id: int) -> None:
    content = _get_content(db, content_id)
    db.delete(content)
    db.commit()
