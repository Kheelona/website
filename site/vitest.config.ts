import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Dev-only unit tests. jsdom + module mocks (test/setup.ts) mean WebGL is never
// constructed and Next runtime modules resolve. Not part of `next build`.
// The @/ alias is declared explicitly (not via tsconfig paths) because
// tsconfig.json excludes *.test/*.stories, so a tsconfig-based resolver would
// not apply @/ to imports that originate inside a test file.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    css: true,
  },
});
