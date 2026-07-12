import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// Dev-only unit tests. jsdom + module mocks (test/setup.ts) mean WebGL is never
// constructed and Next runtime modules resolve. Not part of `next build`.
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
});
