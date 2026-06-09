from fastapi import APIRouter, Depends, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware.auth import get_current_admin
from app.models.course import Category
from app.models.user import User
from app.schemas.course import (
    ContentCreate,
    ContentResponse,
    ContentUpdate,
    CourseCreate,
    CourseDetail,
    CourseSummary,
    CourseUpdate,
)
from app.services import course_service, storage

router = APIRouter(prefix="/api/courses", tags=["courses"])


# ---- Público ----

@router.get("", response_model=list[CourseSummary], summary="Lista todos los cursos")
def list_courses(db: Session = Depends(get_db)):
    return course_service.list_all(db)


@router.get(
    "/{category}",
    response_model=list[CourseSummary],
    summary="Lista cursos por categoría (ingreso-medicina | medicina | programacion)",
)
def list_by_category(category: Category, db: Session = Depends(get_db)):
    return course_service.list_by_category(db, category)


@router.get(
    "/{category}/{slug}",
    response_model=CourseDetail,
    summary="Detalle de un curso con su contenido (PDF/video)",
)
def course_detail(category: Category, slug: str, db: Session = Depends(get_db)):
    return course_service.get_detail(db, category, slug)


# ---- Admin: cursos ----

@router.post(
    "",
    response_model=CourseDetail,
    status_code=status.HTTP_201_CREATED,
    summary="Crea un curso (admin)",
)
def create_course(
    data: CourseCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return course_service.create_course(db, data)


@router.patch("/{course_id}", response_model=CourseDetail, summary="Actualiza un curso (admin)")
def update_course(
    course_id: int,
    data: CourseUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return course_service.update_course(db, course_id, data)


@router.delete(
    "/{course_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Elimina un curso y su contenido (admin)",
)
def delete_course(
    course_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    course_service.delete_course(db, course_id)


# ---- Admin: contenido ----

@router.post(
    "/{course_id}/contents",
    response_model=ContentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Agrega contenido (PDF/video) a un curso (admin)",
)
def add_content(
    course_id: int,
    data: ContentCreate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return course_service.add_content(db, course_id, data)


@router.post(
    "/upload",
    summary="Sube un archivo (PDF o video directo) y devuelve su URL (admin)",
)
def upload_file(
    file: UploadFile,
    kind: str = "pdf",
    _admin: User = Depends(get_current_admin),
):
    url = storage.save_upload(file, kind)
    return {"url": url}


# Router separado para contenido individual (rutas no anidadas bajo /courses).
content_router = APIRouter(prefix="/api/contents", tags=["courses"])


@content_router.patch(
    "/{content_id}", response_model=ContentResponse, summary="Actualiza un contenido (admin)"
)
def update_content(
    content_id: int,
    data: ContentUpdate,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    return course_service.update_content(db, content_id, data)


@content_router.delete(
    "/{content_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Elimina un contenido (admin)",
)
def delete_content(
    content_id: int,
    db: Session = Depends(get_db),
    _admin: User = Depends(get_current_admin),
):
    course_service.delete_content(db, content_id)
