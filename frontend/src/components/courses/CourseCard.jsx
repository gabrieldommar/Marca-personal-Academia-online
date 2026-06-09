import { Link } from "react-router-dom";

import { categoryLabel } from "../../services/courseService";
import { mediaUrl } from "../../services/api";

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/cursos/${course.category}/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-line bg-surface transition-colors hover:border-accent"
    >
      {course.cover_image ? (
        <img
          src={mediaUrl(course.cover_image)}
          alt={course.title}
          referrerPolicy="no-referrer"
          className="aspect-[16/9] w-full object-cover"
        />
      ) : (
        <div className="aspect-[16/9] w-full bg-accent-soft" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <span className="text-small font-medium text-accent">
          {categoryLabel(course.category)}
        </span>
        <h3 className="mt-1 text-h3 group-hover:text-accent">{course.title}</h3>
        {course.description && (
          <p className="mt-2 line-clamp-3 text-small text-muted">{course.description}</p>
        )}
        {course.price != null && (
          <span className="mt-4 text-small text-ink">${course.price}</span>
        )}
      </div>
    </Link>
  );
}
