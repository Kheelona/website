import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Journal } from "./Journal";

const meta = {
  title: "Home/Journal",
  component: Journal,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Journal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
