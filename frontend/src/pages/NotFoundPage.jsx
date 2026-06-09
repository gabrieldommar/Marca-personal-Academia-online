import { Link } from "react-router-dom";

import Container from "../components/ui/Container";

export default function NotFoundPage() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-h1">404</h1>
      <p className="mt-4 text-muted">Esta página no existe.</p>
      <Link to="/" className="mt-6 inline-block text-accent hover:underline">
        Volver al inicio
      </Link>
    </Container>
  );
}
