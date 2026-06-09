import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import Container from "../components/ui/Container";

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setToken, refresh } = useAuth();
  const [error, setError] = useState(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;

    const token = params.get("token");
    const err = params.get("error");
    if (err || !token) {
      setError("No se pudo completar el inicio de sesión.");
      return;
    }
    setToken(token);
    refresh().then(() => navigate("/", { replace: true }));
  }, [params, setToken, refresh, navigate]);

  return (
    <Container className="py-24 text-center">
      {error ? (
        <p className="text-muted">{error}</p>
      ) : (
        <p className="text-muted">Iniciando sesión…</p>
      )}
    </Container>
  );
}
