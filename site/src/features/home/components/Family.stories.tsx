import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Family } from "./Family";

const meta = {
  title: "Home/Family",
  component: Family,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Family>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
