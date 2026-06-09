/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#FAFAF9",
        surface: "#FFFFFF",
        ink: "#18181B",
        muted: "#71717A",
        line: "#E4E4E7",
        accent: "#0D9488",
        "accent-soft": "#CCFBF1",
      },
      fontFamily: {
        serif: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Inter"', "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        display: ["3.05rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h1: ["2.44rem", { lineHeight: "1.1", letterSpacing: "-0.015em" }],
        h2: ["1.95rem", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
        h3: ["1.56rem", { lineHeight: "1.2" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};
