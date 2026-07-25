import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Statement } from "./Statement";

const meta = {
  title: "Home/Statement",
  component: Statement,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Statement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
