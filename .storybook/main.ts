import { fileURLToPath } from "node:url";
import type { StorybookConfig } from "@storybook/nextjs-vite";

// Dev-only. Storybook is the living component catalog (COMPONENT_GUIDELINES §2:
// "a component nobody can find gets rebuilt"). It is never part of `next build`.
const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  staticDirs: ["../public"],
  // Teach the preview bundler the `@/*` alias from tsconfig. `next build` and Vitest
  // both resolve it; without this, a story importing `@/components/...` fails the
  // Storybook build alone (it did, silently, from the revamp until 2026-07-28).
  viteFinal: async (vite) => ({
    ...vite,
    resolve: {
      ...vite.resolve,
      alias: {
        ...vite.resolve?.alias,
        "@": fileURLToPath(new URL("../src", import.meta.url)),
      },
    },
  }),
};

export default config;
