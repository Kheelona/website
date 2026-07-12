import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Feelings } from "./Feelings";

const meta = {
  title: "Home/Feelings",
  component: Feelings,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Feelings>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
