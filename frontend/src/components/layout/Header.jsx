import { Link, NavLink } from "react-router-dom";

import { useAuth } from "../../hooks/useAuth";
import { CATEGORIES } from "../../services/courseService";
import Container from "../ui/Container";
import Button from "../ui/Button";
import GoogleLoginButton from "../auth/GoogleLoginButton";

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="font-serif text-h3 leading-none text-ink hover:text-accent">
          Luciano Nuñez
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {CATEGORIES.map((c) => (
            <NavLink
              key={c.slug}
              to={`/cursos/${c.slug}`}
              className={({ isActive }) =>
                `text-small ${isActive ? "text-accent" : "text-muted hover:text-ink"}`
              }
            >
              {c.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {isAdmin && (
            <Link to="/admin" className="text-small text-muted hover:text-ink">
              Admin
            </Link>
          )}
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-small text-muted sm:inline">{user.name}</span>
              <Button variant="ghost" onClick={logout}>
                Salir
              </Button>
            </div>
          ) : (
            <GoogleLoginButton />
          )}
        </div>
      </Container>
    </header>
  );
}
