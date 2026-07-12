import type { Preview } from "@storybook/nextjs-vite";
import React from "react";
import localFont from "next/font/local";
import { Instrument_Serif } from "next/font/google";
import "../src/styles/globals.css";

// Mirror app/layout.tsx exactly so var(--font-*) resolve to the real faces and
// stories render pixel-identical to the app.
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
const instrumentSerif = Instrument_Serif({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
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
