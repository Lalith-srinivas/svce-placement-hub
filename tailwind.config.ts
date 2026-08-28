import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      fontFamily: {
        heading: ["Outfit", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      colors: {
        border: "#000000",
        background: "#FFFDF5",
        foreground: "#000000",
        neo: {
          yellow: "#FFE600",
          pink: "#FF6B8B",
          cyan: "#38BDF8",
          green: "#4ADE80",
          purple: "#C084FC",
          orange: "#FB923C",
          lime: "#A3E635",
          red: "#F87171",
          cream: "#FFFDF5",
          dark: "#121212",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#000000",
        },
        primary: {
          DEFAULT: "#FFE600",
          foreground: "#000000",
        },
        secondary: {
          DEFAULT: "#F1F5F9",
          foreground: "#000000",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#475569",
        },
        accent: {
          DEFAULT: "#38BDF8",
          foreground: "#000000",
        },
        sidebar: {
          background: "#FFFFFF",
          foreground: "#000000",
          accent: "#FFE600",
          border: "#000000",
        },
        navy: "#0F172A",
        "navy-light": "#1E293B",
        "super-dream": "#A855F7",
        dream: "#2563EB",
        standard: "#16A34A",
        regular: "#D97706",
      },
      boxShadow: {
        neo: "4px 4px 0px 0px #000000",
        "neo-sm": "2px 2px 0px 0px #000000",
        "neo-md": "3px 3px 0px 0px #000000",
        "neo-lg": "6px 6px 0px 0px #000000",
        "neo-xl": "8px 8px 0px 0px #000000",
        "neo-hover": "2px 2px 0px 0px #000000",
        "neo-active": "0px 0px 0px 0px #000000",
      },
      borderRadius: {
        neo: "12px",
        "neo-sm": "8px",
        "neo-lg": "16px",
      },
    },
  },
  plugins: [],
} satisfies Config;
