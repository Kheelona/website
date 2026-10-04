import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TwoReasons } from "./TwoReasons";

const meta = {
  title: "Home/TwoReasons",
  component: TwoReasons,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TwoReasons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
