import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B14",
        foreground: "#F1F5F9",
        card: {
          DEFAULT: "#0D1322",
          foreground: "#F1F5F9",
        },
        panel: "#111A2E",
        cyber: {
          cyan: "#00F0FF",
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#EF4444",
        },
        border: "#1E293B",
        muted: {
          DEFAULT: "#1E293B",
          foreground: "#94A3B8",
        },
      },
      fontFamily: {
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(0, 240, 255, 0.2)",
        "glow-danger": "0 0 25px -5px rgba(239, 68, 68, 0.3)",
        "glow-success": "0 0 25px -5px rgba(16, 185, 129, 0.2)",
      },
    },
  },
  plugins: [],
};
export default config;
