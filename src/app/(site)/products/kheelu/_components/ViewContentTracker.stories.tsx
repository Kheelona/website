import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ViewContentTracker } from "./ViewContentTracker";
import { LAUNCH_AMOUNT_PAISE, TOKEN_AMOUNT_PAISE, FULL_AMOUNT_PAISE } from "@/config/site";

/** Renders nothing, so the story documents the decision rather than a surface.
 *  In Storybook the hostname is localhost, the pixel gate is shut, `fbq` never
 *  arrives, and `whenFbqReady` gives up quietly after its timeout — which is
 *  exactly the behaviour worth showing. */
const meta = {
  title: "Products/Kheelu/ViewContentTracker",
  component: ViewContentTracker,
  parameters: {
    nextjs: { appDirectory: true },
    docs: {
      description: {
        component:
          "Reports a Meta ViewContent for Kheelu once per page view. Waits for the pixel " +
          "instead of calling fbTrack at mount, because the pixel is host-gated behind an " +
          "effect and then loads afterInteractive, so at mount it is usually not there yet.",
      },
    },
  },
} satisfies Meta<typeof ViewContentTracker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TheValueAndItsExpiryDate: Story = {
  render: () => (
    <div className="max-w-md p-4 text-sm">
      <p className="mb-3">
        The event carries <code>content_name</code>, <code>content_ids</code>,{" "}
        <code>content_type</code>, and a <code>value</code> of{" "}
        <strong>{LAUNCH_AMOUNT_PAISE / 100}</strong> INR, read from{" "}
        <code>LAUNCH_AMOUNT_PAISE</code> so it cannot drift from the price the page renders.
      </p>
      <p className="mb-3">
        That is the HEADLINE unit price, not the {TOKEN_AMOUNT_PAISE / 100} the checkout
        collects. Different events answer different questions: browsing is about what Kheelu
        costs, Purchase is about what was actually taken.
      </p>
      <p>
        <strong>It has an expiry date.</strong> The day the 500-unit cap fills, the price is{" "}
        {FULL_AMOUNT_PAISE / 100} and this number is wrong. A client component cannot see that
        server-side mode, so it is a manual change riding the standing sell-out copy sweep
        (§8.26-g). Accepted knowingly by the founder on 2026-09-01.
      </p>
      <ViewContentTracker />
    </div>
  ),
};
