import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { META_PIXEL_HOSTS, META_PIXEL_ID } from "@/config/site";
import { MetaPixel, shouldLoadMetaPixel } from "./MetaPixel";

/** Renders nothing by design, so the story documents the decision instead of a
 *  surface: which hosts load the pixel, and what happens everywhere else. In
 *  Storybook the hostname is localhost, so the gate is closed and the component
 *  below correctly outputs nothing. */
const meta = {
  title: "Molecules/MetaPixel",
  component: MetaPixel,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Loads the Meta Pixel on production hosts only, after hydration so it never " +
          "competes with the hero LCP. Fires PageView on first load and on client-side " +
          "route changes; InitiateCheckout and Purchase come from the pre-order funnel " +
          "in features/preorder/lib/analytics.ts.",
      },
    },
  },
} satisfies Meta<typeof MetaPixel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TheGate: Story = {
  render: () => {
    const cases = [
      "kheelona.com",
      "www.kheelona.com",
      "store.kheelona.com",
      "localhost",
      "website-hdn2.vercel.app",
      "kheelona.ai",
    ];
    return (
      <div className="max-w-md p-4 text-sm">
        <p className="mb-3">
          Pixel <code>{META_PIXEL_ID}</code>, allowed on {META_PIXEL_HOSTS.join(", ")}.
        </p>
        <ul className="space-y-1">
          {cases.map((h) => (
            <li key={h}>
              <code>{h}</code>{" "}
              {shouldLoadMetaPixel(h) ? "loads the pixel" : "loads nothing"}
            </li>
          ))}
        </ul>
        <p className="mt-3">
          A page view from anywhere off that list would not merely dirty a report. It would
          join a retargeting audience and feed the conversion signal Meta spends the ad
          budget against.
        </p>
        <MetaPixel />
      </div>
    );
  },
};
