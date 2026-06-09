import { useState } from "react";

import Container from "../components/ui/Container";
import CommentModeration from "../components/admin/CommentModeration";
import CourseManager from "../components/admin/CourseManager";
import CollaborationManager from "../components/admin/CollaborationManager";

const TABS = [
  { id: "comments", label: "Comentarios", Component: CommentModeration },
  { id: "courses", label: "Cursos", Component: CourseManager },
  { id: "brand", label: "Colaboraciones", Component: CollaborationManager },
];

export default function AdminPage() {
  const [active, setActive] = useState("comments");
  const Active = TABS.find((t) => t.id === active).Component;

  return (
    <Container className="py-16">
      <h1 className="text-h1">Panel de administración</h1>

      <nav className="mt-8 flex gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`-mb-px border-b-2 px-4 py-2 text-small transition-colors ${
              active === t.id
                ? "border-accent text-ink"
                : "border-transparent text-muted hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="mt-10">
        <Active />
      </div>
    </Container>
  );
}
