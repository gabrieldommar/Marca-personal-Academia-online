import { render, screen } from "@testing-library/react";

import CommentForm from "./CommentForm";

const state = vi.hoisted(() => ({ authed: false }));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ isAuthenticated: state.authed, login: () => {} }),
}));

test("sin sesión muestra el login contextual con Google", () => {
  state.authed = false;
  render(<CommentForm />);
  expect(
    screen.getByRole("button", { name: /Inicia sesión con Google para comentar/i })
  ).toBeInTheDocument();
  expect(screen.queryByPlaceholderText(/Comparte tu experiencia/i)).not.toBeInTheDocument();
});

test("con sesión muestra el formulario de comentario", () => {
  state.authed = true;
  render(<CommentForm />);
  expect(screen.getByPlaceholderText(/Comparte tu experiencia/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Enviar comentario/i })).toBeInTheDocument();
});
