import Container from "../ui/Container";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line py-10">
      <Container className="flex flex-col items-center justify-between gap-2 text-small text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} — Marca personal & academia</span>
        <span>Medicina · Programación</span>
      </Container>
    </footer>
  );
}
