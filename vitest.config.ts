import { configDefaults, defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

// Dev-only unit tests. jsdom + module mocks (test/setup.ts) mean WebGL is never
// constructed and Next runtime modules resolve. Not part of `next build`.
// The @/ and @ds/ aliases are declared explicitly (not via tsconfig paths) because
// tsconfig.json excludes *.test/*.stories, so a tsconfig-based resolver would
// not apply them to imports that originate inside a test file.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@ds": fileURLToPath(new URL("./design-system/project", import.meta.url)),
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    // `test/` holds repo-level guards (config, redirects, test/guards); `src/` holds the
    // colocated component tests. Playwright owns test/e2e/** (`npm run verify:e2e`).
    include: ["src/**/*.test.{ts,tsx}", "test/**/*.test.{ts,tsx}"],
    exclude: [...configDefaults.exclude, "test/e2e/**"],
    css: true,
  },
});
