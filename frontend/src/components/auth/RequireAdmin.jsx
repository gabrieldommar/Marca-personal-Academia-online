import { Navigate } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import Container from "../ui/Container";
import { Spinner } from "../ui/States";

export default function RequireAdmin({ children }) {
  const { loading, isAdmin } = useAuth();

  if (loading) {
    return (
      <Container className="py-24">
        <Spinner label="Verificando sesión…" />
      </Container>
    );
  }
  // El frontend solo controla la navegación; el backend valida is_admin en cada endpoint.
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
