import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // MathQuest brand palette (GDD Art Direction)
        correct: "#22c55e",
        incorrect: "#ef4444",
        streak: "#f59e0b",
        primary: "#3b82f6",
        achievement: "#8b5cf6",
      },
      fontSize: {
        // Base ≥16px to prevent iOS auto-zoom (TECH-STACK responsive standard)
        base: ["1rem", { lineHeight: "1.5" }],
      },
    },
  },
  plugins: [],
};

export default config;
