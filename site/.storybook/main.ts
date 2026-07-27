import type { StorybookConfig } from "@storybook/nextjs-vite";

// Dev-only. Storybook is the living component catalog (COMPONENT_GUIDELINES §2:
// "a component nobody can find gets rebuilt"). It is never part of `next build`.
const config: StorybookConfig = {
  framework: "@storybook/nextjs-vite",
  stories: ["../src/**/*.stories.@(tsx|mdx)"],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  staticDirs: ["../public"],
};

export default config;
