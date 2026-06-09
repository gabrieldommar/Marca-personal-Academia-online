from datetime import datetime
from enum import Enum

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Category(str, Enum):
    ingreso_medicina = "ingreso-medicina"
    medicina = "medicina"
    programacion = "programacion"


class ContentType(str, Enum):
    pdf = "pdf"
    video = "video"


class VideoProvider(str, Enum):
    youtube = "youtube"
    vimeo = "vimeo"
    direct = "direct"


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True)
    slug: Mapped[str] = mapped_column(String(160), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[Category] = mapped_column(String(30), index=True, nullable=False)
    cover_image: Mapped[str | None] = mapped_column(String(500), nullable=True)
    # Precio estático (pagos fuera de alcance). None = sin precio definido.
    price: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    contents: Mapped[list["Content"]] = relationship(
        back_populates="course", cascade="all, delete-orphan", order_by="Content.position"
    )


class Content(Base):
    __tablename__ = "contents"

    id: Mapped[int] = mapped_column(primary_key=True)
    course_id: Mapped[int] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(200), nullable=False)
    type: Mapped[ContentType] = mapped_column(String(10), nullable=False)
    # provider solo aplica a type=video. PDF lo deja en None.
    provider: Mapped[VideoProvider | None] = mapped_column(String(10), nullable=True)
    # Para video: URL externa (YouTube/Vimeo) o ruta del archivo directo.
    # Para PDF: ruta relativa en el storage local.
    url: Mapped[str] = mapped_column(String(700), nullable=False)
    # Si False, el video no se embebe; el frontend muestra "Ver en YouTube" (redirección).
    embeddable: Mapped[bool] = mapped_column(default=True, nullable=False)
    position: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    course: Mapped["Course"] = relationship(back_populates="contents")
