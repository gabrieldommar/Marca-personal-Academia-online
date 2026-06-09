import Container from "../ui/Container";
import Button from "../ui/Button";

// ✏️ EDITAR: completá con los datos reales de Luciano.
// Todo el contenido del hero se controla desde acá.
const PROFILE = {
  role: "profesor · medicina + programación",
  tagline: "Enseño dos disciplinas con el mismo método: claridad y práctica.",
  bio:
    "Soy profesor y acompaño a estudiantes en el ingreso a medicina, durante la " +
    "carrera y en sus primeros pasos como programadores. [Completá con tu historia: " +
    "trayectoria, enfoque y qué te diferencia.]",
  stats: [
    { value: "10+", label: "años enseñando" },
    { value: "500+", label: "alumnos" },
    { value: "12", label: "cursos publicados" },
  ],
};

function Stat({ value, label }) {
  return (
    <div>
      <dt className="font-serif text-h2 leading-none text-ink">{value}</dt>
      <dd className="mt-1 font-mono text-small text-muted">{label}</dd>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="border-b border-line">
      <Container className="py-20 sm:py-24">
        <p className="font-mono text-small text-accent">{PROFILE.role}</p>

        <h1 className="mt-4 text-display">Luciano Nuñez</h1>
        <p className="mt-3 max-w-2xl text-h3 text-muted">{PROFILE.tagline}</p>
        <p className="mt-6 max-w-2xl text-body text-muted">{PROFILE.bio}</p>

        <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
          {PROFILE.stats.map((s) => (
            <Stat key={s.label} value={s.value} label={s.label} />
          ))}
        </dl>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button as="a" href="#cursos">
            Ver cursos
          </Button>
          <Button as="a" href="#comentarios" variant="outline">
            Lo que dicen
          </Button>
        </div>
      </Container>
    </section>
  );
}
