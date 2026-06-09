import { Link } from "react-router-dom";

import Container from "../ui/Container";
import { SectionHeading, Spinner, ErrorMessage, EmptyState } from "../ui/States";
import CourseCard from "../courses/CourseCard";
import { useFetch } from "../../hooks/useFetch";
import { courseService, CATEGORIES } from "../../services/courseService";

export default function CoursesByCategory() {
  const { data, loading, error } = useFetch(courseService.listAll);

  return (
    <section id="cursos" className="border-t border-line py-20">
      <Container>
        <SectionHeading overline="Academia" title="Cursos por categoría">
          Contenido estructurado en PDF y video.
        </SectionHeading>

        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudieron cargar los cursos." />}

        {!loading && !error && (!data?.length ? (
          <EmptyState message="Aún no hay cursos publicados." />
        ) : (
          <div className="space-y-14">
            {CATEGORIES.map((cat) => {
              const courses = data.filter((c) => c.category === cat.slug);
              if (!courses.length) return null;
              return (
                <div key={cat.slug}>
                  <div className="mb-5 flex items-baseline justify-between">
                    <h3 className="text-h3">{cat.label}</h3>
                    <Link to={`/cursos/${cat.slug}`} className="text-small text-accent hover:underline">
                      Ver todos
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </Container>
    </section>
  );
}
