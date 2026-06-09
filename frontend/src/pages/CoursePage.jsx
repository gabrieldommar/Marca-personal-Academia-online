import { Link, useParams } from "react-router-dom";

import Container from "../components/ui/Container";
import { Spinner, ErrorMessage } from "../components/ui/States";
import CourseContent from "../components/courses/CourseContent";
import { useFetch } from "../hooks/useFetch";
import { courseService, categoryLabel } from "../services/courseService";

export default function CoursePage() {
  const { category, slug } = useParams();
  const { data: course, loading, error } = useFetch(
    () => courseService.getDetail(category, slug),
    [category, slug]
  );

  if (loading) {
    return (
      <Container className="py-24">
        <Spinner />
      </Container>
    );
  }

  if (error || !course) {
    return (
      <Container className="py-24">
        <ErrorMessage message="No se encontró el curso." />
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          Volver al inicio
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <Link
        to={`/cursos/${course.category}`}
        className="text-small text-muted hover:text-ink"
      >
        ← {categoryLabel(course.category)}
      </Link>

      <header className="mt-4 max-w-3xl">
        <h1 className="text-h1">{course.title}</h1>
        {course.description && <p className="mt-4 text-muted">{course.description}</p>}
      </header>

      <div className="mt-12">
        <CourseContent key={course.id} contents={course.contents} />
      </div>
    </Container>
  );
}
