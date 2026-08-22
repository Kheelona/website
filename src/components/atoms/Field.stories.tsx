import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TextField, SelectField, ChoiceField } from "./Field";

const meta = {
  title: "Atoms/Field",
  component: TextField,
  args: { label: "Your name", name: "name", required: true },
  parameters: { layout: "padded" },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Text: Story = {};

export const WithHint: Story = {
  args: {
    label: "WhatsApp number",
    name: "phone",
    hint: "This is where we send your confirmation and the balance link.",
    inputMode: "tel",
  },
};

export const Optional: Story = {
  args: { label: "Landmark", name: "line2", required: false },
};

export const WithError: Story = {
  args: {
    label: "WhatsApp number",
    name: "phone",
    hint: "This is where we send your confirmation.",
    error: "We need a 10 digit Indian mobile number, the one you use on WhatsApp.",
  },
};

export const Select: StoryObj<typeof SelectField> = {
  render: () => (
    <SelectField
      label="Your child's age"
      name="childAge"
      required
      options={["Under 2", "2", "3", "4", "5", "6 or older"]}
    />
  ),
};

export const Choice: StoryObj<typeof ChoiceField> = {
  render: () => (
    <ChoiceField name="accepted">
      I accept the pre-order terms and the refund policy, and I am happy to hear
      about my own order on WhatsApp.
    </ChoiceField>
  ),
};

export const ChoiceWithError: StoryObj<typeof ChoiceField> = {
  render: () => (
    <ChoiceField name="accepted" error="Please tick the box to accept the pre-order terms.">
      I accept the pre-order terms and the refund policy.
    </ChoiceField>
  ),
};
