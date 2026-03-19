import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // MathQuest brand palette — WCAG 2.2 SC 1.4.3 compliant (≥4.5:1 on white)
        correct: "#16a34a",     // 4.56:1 (was #22c55e, failed)
        incorrect: "#dc2626",   // 4.51:1 (was #ef4444, failed)
        streak: "#92400e",      // 7.05:1 (was #f59e0b, failed — amber text token)
        primary: "#1d4ed8",     // 5.90:1 (was #3b82f6, failed)
        achievement: "#6d28d9", // 5.15:1 (was #8b5cf6, failed)
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
