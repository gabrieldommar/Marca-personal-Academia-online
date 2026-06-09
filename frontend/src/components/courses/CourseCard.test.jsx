import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import CourseCard from "./CourseCard";

const course = {
  id: 1,
  slug: "python-basico",
  title: "Python Básico",
  description: "Intro",
  category: "programacion",
  cover_image: null,
  price: 20,
};

const renderCard = () =>
  render(
    <MemoryRouter>
      <CourseCard course={course} />
    </MemoryRouter>
  );

test("muestra título y etiqueta de categoría", () => {
  renderCard();
  expect(screen.getByText("Python Básico")).toBeInTheDocument();
  expect(screen.getByText("Programación")).toBeInTheDocument();
});

test("enlaza al detalle del curso", () => {
  renderCard();
  expect(screen.getByRole("link")).toHaveAttribute(
    "href",
    "/cursos/programacion/python-basico"
  );
});
