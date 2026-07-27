import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GA4_HOSTS, GA4_MEASUREMENT_ID } from "@/config/site";
import { GoogleAnalyticsGate, shouldLoadGa4 } from "./GoogleAnalyticsGate";

/** Renders nothing by design, so the story documents the decision instead of a
 *  surface: which hosts load the tag, and what happens everywhere else. In
 *  Storybook the hostname is localhost, so the gate is closed and the component
 *  below correctly outputs nothing. */
const meta = {
  title: "Molecules/GoogleAnalyticsGate",
  component: GoogleAnalyticsGate,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Loads gtag.js on production hosts only. Manual install (not Tag Manager) " +
          "via @next/third-parties, after hydration so it never competes with the hero LCP.",
      },
    },
  },
} satisfies Meta<typeof GoogleAnalyticsGate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TheGate: Story = {
  render: () => {
    const cases = [
      "kheelona.com",
      "www.kheelona.com",
      "localhost",
      "website-hdn2.vercel.app",
      "kheelona.ai",
    ];
    return (
      <div className="max-w-md p-4 text-sm">
        <p className="mb-3">
          Measurement ID <code>{GA4_MEASUREMENT_ID}</code>, allowed on{" "}
          {GA4_HOSTS.join(" and ")}.
        </p>
        <ul className="space-y-1">
          {cases.map((h) => (
            <li key={h}>
              <code>{h}</code> {shouldLoadGa4(h) ? "loads the tag" : "loads nothing"}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Current host is <code>{typeof window === "undefined" ? "server" : window.location.hostname}</code>,
          so the mounted component renders {shouldLoadGa4(
            typeof window === "undefined" ? "" : window.location.hostname,
          )
            ? "the tag"
            : "nothing"}
          .
        </p>
        <GoogleAnalyticsGate />
      </div>
    );
  },
};
