import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Alert } from "./Alert";

/* The DS inline notice in each tone. */
const meta = {
  title: "UI/Alert",
  component: Alert,
  args: {
    title: "Paying by UPI? Open this page in Chrome or Safari.",
    children: <p>Do it first, so you don’t type your details twice.</p>,
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: { tone: "success", title: "Address saved.", children: <p>We will deliver your Kheelu there.</p> },
};

export const Warning: Story = {
  args: { tone: "warning", title: "Your connection dropped.", children: <p>Your details are still here. Try again in a moment.</p> },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    title: "We could not reach our payment provider.",
    children: <p>Nothing was charged. Please try again in a moment.</p>,
  },
};

export const WithAction: Story = {
  args: {
    // The DS's own action row (bundle.css .kh-alert__action: a small ghost button).
    action: (
      <div className="kh-alert__action">
        <a className="kh-btn kh-btn--ghost kh-btn--s" href="#details">
          <span>Back to your details</span>
        </a>
      </div>
    ),
  },
};

export const TitleOnly: Story = {
  args: { children: undefined },
};
