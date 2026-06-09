import Container from "../ui/Container";
import { SectionHeading, Spinner, ErrorMessage, EmptyState } from "../ui/States";
import CommentForm from "./CommentForm";
import { useFetch } from "../../hooks/useFetch";
import { commentService } from "../../services/commentService";
import { mediaUrl } from "../../services/api";

function CommentCard({ comment }) {
  return (
    <figure className="rounded-lg border border-line bg-surface p-6">
      <blockquote className="text-body text-ink">“{comment.body}”</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        {comment.author.picture && (
          <img
            src={mediaUrl(comment.author.picture)}
            alt={comment.author.name}
            referrerPolicy="no-referrer"
            className="h-8 w-8 rounded-full object-cover"
          />
        )}
        <span className="text-small font-medium text-muted">{comment.author.name}</span>
      </figcaption>
    </figure>
  );
}

export default function ApprovedComments() {
  const { data, loading, error } = useFetch(commentService.listApproved);

  return (
    <section id="comentarios" className="border-t border-line py-20">
      <Container>
        <div className="max-w-xl">
          <SectionHeading overline="Comunidad" title="Comentarios">
            Opiniones de estudiantes y colegas.
          </SectionHeading>

          {loading && <Spinner />}
          {error && <ErrorMessage message="No se pudieron cargar los comentarios." />}
          {!loading && !error && (data?.length ? (
            <div className="space-y-4">
              {data.map((c) => (
                <CommentCard key={c.id} comment={c} />
              ))}
            </div>
          ) : (
            <EmptyState message="Todavía no hay comentarios aprobados." />
          ))}

          <div className="mt-12">
            <CommentForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
