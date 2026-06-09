import Container from "../ui/Container";
import { SectionHeading, Spinner, ErrorMessage, EmptyState } from "../ui/States";
import { useFetch } from "../../hooks/useFetch";
import { collaborationService } from "../../services/collaborationService";
import { mediaUrl } from "../../services/api";

function CollaborationItem({ collab }) {
  const content = (
    <div className="flex h-20 items-center justify-center rounded-lg border border-line bg-surface px-4 text-center">
      {collab.logo_url ? (
        <img src={mediaUrl(collab.logo_url)} alt={collab.name} referrerPolicy="no-referrer" className="max-h-10 max-w-full object-contain" />
      ) : (
        <span className="text-small text-muted">{collab.name}</span>
      )}
    </div>
  );

  return collab.website_url ? (
    <a href={collab.website_url} target="_blank" rel="noopener noreferrer" title={collab.name}>
      {content}
    </a>
  ) : (
    content
  );
}

export default function Collaborations() {
  const { data, loading, error } = useFetch(collaborationService.list);

  return (
    <section className="py-20">
      <Container>
        <SectionHeading overline="Marca personal" title="Colaboraciones y clientes">
          Personas e instituciones con quienes he trabajado.
        </SectionHeading>

        {loading && <Spinner />}
        {error && <ErrorMessage message="No se pudieron cargar las colaboraciones." />}
        {!loading && !error && (data?.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {data.map((c) => (
              <CollaborationItem key={c.id} collab={c} />
            ))}
          </div>
        ) : (
          <EmptyState message="Pronto se sumarán colaboraciones." />
        ))}
      </Container>
    </section>
  );
}
