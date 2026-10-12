import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PolicyLinks } from "./PolicyLinks";

/* The store footer's policy links, as on the store and the confirmation page. */
const meta = {
  title: "UI/PolicyLinks",
  component: PolicyLinks,
  args: {
    label: "Policies",
    newTabNote: " (opens in a new tab)",
    links: [
      { label: "Pre-order terms", href: "https://kheelona.com/terms" },
      { label: "Refunds and cancellation", href: "https://kheelona.com/refund" },
      { label: "Shipping and delivery", href: "https://kheelona.com/shipping" },
      { label: "Privacy", href: "https://kheelona.com/privacy" },
      { label: "Contact", href: "https://kheelona.com/contact" },
    ],
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof PolicyLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Store: Story = {};
