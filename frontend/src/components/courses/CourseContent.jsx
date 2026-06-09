import { useState } from "react";

import ContentViewer from "./ContentViewer";
import { EmptyState } from "../ui/States";

const TypeIcon = ({ type }) => (
  <span className="text-small text-accent">{type === "video" ? "▶" : "▤"}</span>
);

export default function CourseContent({ contents }) {
  const [selectedId, setSelectedId] = useState(contents[0]?.id ?? null);

  if (!contents.length) {
    return <EmptyState message="Este curso aún no tiene contenido." />;
  }

  const selected = contents.find((c) => c.id === selectedId) ?? contents[0];

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="order-2 lg:order-1">
        <p className="mb-3 text-small font-medium uppercase tracking-wide text-muted">
          Contenido
        </p>
        <ul className="space-y-1">
          {contents.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => setSelectedId(c.id)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-small transition-colors ${
                  c.id === selected.id
                    ? "border-accent bg-accent-soft text-ink"
                    : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                <TypeIcon type={c.type} />
                <span className="truncate">{c.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <div className="order-1 lg:order-2">
        <ContentViewer content={selected} />
      </div>
    </div>
  );
}
