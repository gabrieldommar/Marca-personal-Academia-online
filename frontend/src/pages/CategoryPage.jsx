import { useParams } from "react-router-dom";

import Container from "../components/ui/Container";
import { Spinner, ErrorMessage, EmptyState } from "../components/ui/States";
import CourseCard from "../components/courses/CourseCard";
import { useFetch } from "../hooks/useFetch";
import { courseService, categoryLabel, CATEGORIES } from "../services/courseService";

export default function CategoryPage() {
  const { category } = useParams();
  const known = CATEGORIES.some((c) => c.slug === category);

  const { data, loading, error } = useFetch(
    () => courseService.listByCategory(category),
    [category]
  );

  if (!known) {
    return (
      <Container className="py-24">
        <ErrorMessage message="Categoría no encontrada." />
      </Container>
    );
  }

  return (
    <Container className="py-16">
      <h1 className="text-h1">{categoryLabel(category)}</h1>
      <p className="mt-3 text-muted">Cursos disponibles en esta categoría.</p>

      <div className="mt-10">
        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudieron cargar los cursos." />}
        {!loading && !error && (data?.length ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <EmptyState message="Aún no hay cursos en esta categoría." />
        ))}
      </div>
    </Container>
  );
}
