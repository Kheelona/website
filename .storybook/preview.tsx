import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import { Fraunces, DM_Sans } from "next/font/google";
import "../src/styles/globals.css";

// Mirror app/layout.tsx exactly so var(--font-*) resolve to the real faces and
// stories render pixel-identical to the app (redesign 2026-10: Fraunces +
// DM Sans, self-hosted by next/font at build time).
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
});

const preview: Preview = {
  parameters: {
    nextjs: { appDirectory: true },
    layout: "fullscreen",
    a11y: { test: "todo" },
  },
  decorators: [
    (Story) => (
      <div
        className={`${fraunces.variable} ${dmSans.variable} js`}
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink)" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
