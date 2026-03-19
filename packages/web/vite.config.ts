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
  // React 18 uses process.env.NODE_ENV to select dev vs prod build.
  // Vitest sets NODE_ENV="test" which causes React to load its production
  // bundle, breaking act().  Patching here selects the development build
  // so act() is available in all test environments.
  define:
    mode === "test"
      ? { "process.env.NODE_ENV": '"development"' }
      : undefined,
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
}));
