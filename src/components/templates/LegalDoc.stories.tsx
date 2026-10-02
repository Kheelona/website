import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { LegalDoc } from "./LegalDoc";

const SECTIONS = [
  {
    h: "What we collect",
    ps: [
      "We keep the list short: a parent name, a way to reach you, and your child's birth month.",
      "Nothing here is sold, and nothing leaves the reservation flow.",
    ],
  },
  {
    h: "How to leave",
    ps: ["One message removes you from the list, and the data goes with it."],
  },
] as const;

const meta = {
  title: "Templates/LegalDoc",
  component: LegalDoc,
  args: {
    title: "Privacy, in plain words",
    lede: "The short version of what we hold and why.",
    sections: SECTIONS,
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof LegalDoc>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
