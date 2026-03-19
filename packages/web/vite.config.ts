import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
  // Resolve React development build during tests so act() is available
  resolve:
    mode === "test"
      ? {
          conditions: ["development", "browser"],
        }
      : undefined,
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    // Ensure React dev build is used (act() support)
    alias: [
      {
        find: /^react$/,
        replacement:
          "react/cjs/react.development.js",
      },
      {
        find: /^react-dom$/,
        replacement:
          "react-dom/cjs/react-dom.development.js",
      },
      {
        find: /^react-dom\/client$/,
        replacement:
          "react-dom/cjs/react-dom-client.development.js",
      },
    ],
  },
}));
