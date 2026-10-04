import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import localFont from "next/font/local";
import "../src/styles/globals.css";

// Mirror app/layout.tsx exactly so var(--font-*) resolve to the real faces and
// stories render pixel-identical to the app. The serif is the LOCAL italic
// subset since CS3 — the old Google Fonts import here was fetching a face the
// app had retired, on every `storybook dev`, for nothing.
const glory = localFont({
  src: [{ path: "../src/app/fonts/Glory.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-glory",
  display: "swap",
});
const instrumentSans = localFont({
  src: [{ path: "../src/app/fonts/InstrumentSans.woff2", weight: "100 900", style: "normal" }],
  variable: "--font-instrument-sans",
  display: "swap",
});
const instrumentSerif = localFont({
  src: [
    { path: "../src/app/fonts/InstrumentSerifItalic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-instrument-serif",
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
        className={`${glory.variable} ${instrumentSans.variable} ${instrumentSerif.variable} js`}
        style={{ fontFamily: "var(--font-sans)", color: "var(--color-ink)" }}
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
