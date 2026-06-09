import { render, screen } from "@testing-library/react";

import VideoPlayer from "./VideoPlayer";

test("YouTube embebible renderiza un iframe de embed", () => {
  const { container } = render(
    <VideoPlayer
      content={{
        title: "Clase",
        type: "video",
        provider: "youtube",
        url: "https://youtu.be/abc12345678",
        embeddable: true,
      }}
    />
  );
  const iframe = container.querySelector("iframe");
  expect(iframe).toBeTruthy();
  expect(iframe.getAttribute("src")).toContain("/embed/abc12345678");
});

test("YouTube no embebible muestra enlace a YouTube", () => {
  render(
    <VideoPlayer
      content={{
        title: "Clase",
        type: "video",
        provider: "youtube",
        url: "https://youtu.be/abc12345678",
        embeddable: false,
      }}
    />
  );
  const link = screen.getByRole("link", { name: /Ver en YouTube/i });
  expect(link).toHaveAttribute("href", "https://www.youtube.com/watch?v=abc12345678");
});

test("video directo renderiza un elemento <video>", () => {
  const { container } = render(
    <VideoPlayer
      content={{ title: "Clase", type: "video", provider: "direct", url: "/storage/videos/x.mp4", embeddable: true }}
    />
  );
  expect(container.querySelector("video")).toBeTruthy();
});
