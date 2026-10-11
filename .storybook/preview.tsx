import type { Preview } from "@storybook/nextjs-vite";
import "../src/styles/site.css";

// Stories load the site's one CSS entry (task 1.2, ADR-002), so a component renders against the same DS tokens,
// fonts (served from public/fonts through staticDirs), bundle.css, motion presets and composition CSS as the
// pages. The predev step writes the composition manifest before Storybook starts. bundle.css styles the body
// (surface, text, body font), so no decorator is needed. Legacy stories (atoms, molecules, organisms) were styled
// by the retired globals.css; they render unstyled here until task 6.3 deletes them with their components.
const preview: Preview = {
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
};

export default preview;
