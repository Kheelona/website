import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Checkbox } from "./Checkbox";

/* The DS checkbox and the store's consent row (the approved wording; the store passes kheelona.com links). */
function ConsentSentence() {
  return (
    <>
      I accept the{" "}
      <a href="https://kheelona.com/terms" target="_blank" rel="noopener">
        pre-order terms<span className="kh-sr"> (opens in a new tab)</span>
      </a>{" "}
      and the{" "}
      <a href="https://kheelona.com/refund" target="_blank" rel="noopener">
        refund policy<span className="kh-sr"> (opens in a new tab)</span>
      </a>
      , and I am happy to hear about my own order on WhatsApp.
    </>
  );
}

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: { label: "Send me order updates on WhatsApp", name: "updates" },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  args: { hint: "Only about your own order." },
};

export const Consent: Story = {
  args: { consent: true, name: "accepted", required: true, label: <ConsentSentence /> },
};

export const ConsentWithError: Story = {
  args: { ...Consent.args, error: "Please tick the box to accept the pre-order terms." },
};

export const Disabled: Story = {
  args: { disabled: true },
};
