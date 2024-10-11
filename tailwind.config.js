/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,svelte,js,ts}'],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#4f46e5",
          "primary-focus": "#4338ca",
          secondary: "#10b981",
          "secondary-focus": "#059669",
          accent: "#f59e0b",
          neutral: "#3d4451",
          "base-100": "#f3f4f6",
          "base-200": "#e5e7eb",
          "base-300": "#d1d5db",
          "base-content": "#1f2937",
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["[data-theme=dark]"],
          primary: "#60a5fa",
          "primary-focus": "#3b82f6",
          secondary: "#fbbf24",
          "secondary-focus": "#f59e0b",
          accent: "#4ade80",
          neutral: "#1f2937",
          "base-100": "#1f2937",
          "base-200": "#111827",
          "base-300": "#0f172a",
        },
      },
      {
        corporate: {
          primary: "#0ea5e9",
          "primary-focus": "#0284c7",
          secondary: "#f43f5e",
          "secondary-focus": "#e11d48",
          accent: "#8b5cf6",
          neutral: "#64748b",
          "base-100": "#ffffff",
          "base-200": "#f1f5f9",
          "base-300": "#e2e8f0",
          "base-content": "#0f172a",
        },
      },
      {
        coffee: {
          primary: "#DB924B",
          "primary-focus": "#C17A3A",
          secondary: "#6F4E37",
          "secondary-focus": "#5C4130",
          accent: "#B85C38",
          neutral: "#20130D",
          "base-100": "#362517",
          "base-200": "#2C1E13",
          "base-300": "#23170F",
          "base-content": "#EDE0D4",
        },
      },
      {
        cupcake: {
          primary: "#d946ef",         // Vibrant pink
          "primary-focus": "#c026d3", // Darker shade of primary
          secondary: "#0dac47",       // Fresh green
          "secondary-focus": "#22c55e", // Darker shade of secondary
          accent: "#14b8a6",          // Teal accent
          neutral: "#64748b",         // Cool gray
          "base-100": "#fdf4ff",      // Very light pink
          "base-200": "#fae8ff",      // Light pink
          "base-300": "#f5d0fe",      // Slightly darker pink
          "base-content": "#701a75",  // Deep purple for text
        },
      },
      {
        cyberpunk: {
          primary: "#ff00ff",
          "primary-focus": "#d100d1",
          secondary: "#00ffff",
          "secondary-focus": "#00d1d1",
          accent: "#ffff00",
          neutral: "#1a103d",
          "base-100": "#2d1b69",
          "base-200": "#25175a",
          "base-300": "#1e124b",
          "base-content": "#ffffff",
        },
      },
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: true,
    themeRoot: ":root",
  },
}