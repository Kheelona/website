import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Quote } from "./Quote";

const meta = {
  title: "UI/Quote",
  component: Quote,
  args: {
    tone: "sun",
    quote: "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
    cite: { name: "Apoorva Sahu", role: "Co-Founder and CEO", initials: "AS" },
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The founder's quote (team.html fold 4). */
export const Default: Story = {};
/** Without an avatar or role. */
export const NameOnly: Story = { args: { tone: undefined, cite: { name: "Apoorva Sahu" } } };
