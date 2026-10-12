import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Field } from "./Field";

/* The DS text field and its `tel-in` variant, with the approved store and confirmation wording. */
const meta = {
  title: "UI/Field",
  component: Field,
  args: { label: "Your name", name: "parentName", type: "text", autoComplete: "name", maxLength: 80, required: true },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: {
    label: "Email",
    name: "email",
    type: "email",
    inputMode: "email",
    autoComplete: "email",
    maxLength: undefined,
    hint: "We email your confirmation here.",
  },
};

export const TelIn: Story = {
  args: {
    variant: "tel-in",
    label: "Indian WhatsApp number",
    name: "phone",
    type: "tel",
    inputMode: "tel",
    autoComplete: "tel",
    maxLength: undefined,
    hint: "For messages about your order, including the link to pay the balance before dispatch.",
  },
};

export const WithError: Story = {
  args: { error: "We need a name to put on the order." },
};

export const TelInWithError: Story = {
  args: {
    ...TelIn.args,
    error: "Check the number: an Indian mobile number has 10 digits.",
  },
};

export const Optional: Story = {
  args: {
    label: "Landmark or area (optional)",
    name: "line2",
    autoComplete: "address-line2",
    maxLength: 120,
    required: false,
  },
};
