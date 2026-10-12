import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";
import { TrustLine } from "./TrustLine";

/* Story stand-in for the Icon primitive (task 2.2, built in the same wave): the same DS svg. */
const icon = (name: IconName) => (
  <svg className="kh-icon" viewBox={ICON_VIEWBOX} aria-hidden="true" focusable="false">
    <path d={ICON_PATHS[name]} />
  </svg>
);

const meta = {
  title: "UI/TrustLine",
  component: TrustLine,
  args: {
    items: [
      { icon: icon("truck"), label: "Deliveries start mid-November", href: "/shipping" },
      { icon: icon("arrow-counter-clockwise"), label: "7-day returns, no questions asked", href: "/refund" },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof TrustLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Beside a CTA (home.html fold 1). */
export const Linked: Story = {};

/** The full line under the offer card (home.html fold 9). */
export const Full: Story = {
  args: {
    items: [
      { icon: icon("arrow-counter-clockwise"), label: "7-day returns, no questions asked", href: "/refund" },
      { icon: icon("shield-check"), label: "6-month warranty", href: "/refund" },
      { icon: icon("currency-inr"), label: "UPI, card or net banking", href: "/terms" },
      { icon: icon("package"), label: "Delivery included anywhere in India", href: "/shipping" },
    ],
  },
};

/** The store's line: each link opens the terms in a new tab (store.html fold 1). */
export const NewTab: Story = { args: { newTabNote: " (opens in a new tab)" } };

/** The unlinked facts line (home.html fold 6). */
export const Facts: Story = {
  args: {
    items: [
      { icon: icon("eye-slash"), label: "No camera" },
      { icon: icon("wifi-slash"), label: "It can’t browse the internet" },
      { icon: icon("smiley"), label: "It says it’s a toy, and never asks your child to keep a secret from you" },
    ],
  },
};
