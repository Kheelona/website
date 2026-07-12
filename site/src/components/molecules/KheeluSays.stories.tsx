import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { KheeluSays } from "./KheeluSays";

const meta = {
  title: "Molecules/KheeluSays",
  component: KheeluSays,
  args: { line: "I'm Kheelu. Let me show you around.", pose: "hero-wink" },
  argTypes: {
    pose: {
      control: "select",
      options: ["hero-wink", "curious", "grumpy", "sad", "silly", "joy", "bliss"],
    },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof KheeluSays>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Curious: Story = {
  args: { pose: "curious", line: "Wondering what's in the box?" },
};
export const Joy: Story = {
  args: { pose: "joy", line: "You reserved a Lumi. Hooray!" },
};
