import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card } from "./Card";

const meta = {
  title: "Molecules/Card",
  component: Card,
  args: {
    title: "In the box",
    children:
      "One Lumi plush, a charging base, and a quick-start card for parents.",
  },
  argTypes: {
    tilt: { control: "boolean" },
    maxTilt: { control: { type: "number", min: 0, max: 12 } },
  },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithoutTitle: Story = { args: { title: undefined } };
export const NoTilt: Story = { args: { tilt: false } };
