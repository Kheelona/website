import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Compare } from "./Compare";

const meta = {
  title: "Home/Compare",
  component: Compare,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Compare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
