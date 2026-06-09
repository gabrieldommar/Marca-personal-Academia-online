from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.course import Category, ContentType, VideoProvider


class ContentBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    type: ContentType
    provider: VideoProvider | None = None
    url: str = Field(min_length=1, max_length=700)
    embeddable: bool = True
    position: int = 0


class ContentCreate(ContentBase):
    pass


class ContentUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    type: ContentType | None = None
    provider: VideoProvider | None = None
    url: str | None = Field(default=None, max_length=700)
    embeddable: bool | None = None
    position: int | None = None


class ContentResponse(ContentBase):
    id: int
    course_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CourseBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    category: Category
    cover_image: str | None = None
    price: float | None = Field(default=None, ge=0)


class CourseCreate(CourseBase):
    slug: str | None = Field(default=None, max_length=160)


class CourseUpdate(BaseModel):
    title: str | None = Field(default=None, max_length=200)
    description: str | None = None
    category: Category | None = None
    cover_image: str | None = None
    price: float | None = Field(default=None, ge=0)


class CourseSummary(CourseBase):
    id: int
    slug: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CourseDetail(CourseSummary):
    contents: list[ContentResponse] = []
