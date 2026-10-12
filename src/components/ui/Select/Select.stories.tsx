import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Select } from "./Select";

/* The DS select as the confirmation page's state picker (a few of the 36 states and territories). */
const STATES = ["Andhra Pradesh", "Delhi", "Karnataka", "Kerala", "Maharashtra", "Tamil Nadu", "West Bengal"];

const meta = {
  title: "UI/Select",
  component: Select,
  args: { label: "State", name: "state", placeholder: "Choose your state", options: STATES, required: true },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPlaceholder: Story = {};

export const Saved: Story = {
  args: { defaultValue: "Karnataka" },
};

export const WithHint: Story = {
  args: { hint: "Where we deliver your Kheelu." },
};

export const WithError: Story = {
  args: { error: "Choose your state." },
};

export const OptionObjects: Story = {
  args: {
    label: "Your child’s age",
    name: "age",
    placeholder: "Choose an age",
    options: [
      { value: "3", label: "3 years" },
      { value: "4", label: "4 years" },
      { value: "5", label: "5 years" },
      { value: "6", label: "6 years" },
      { value: "7", label: "7 years" },
    ],
  },
};
