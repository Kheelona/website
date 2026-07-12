import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WhyWeExist } from "./WhyWeExist";

const meta = {
  title: "Home/WhyWeExist",
  component: WhyWeExist,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof WhyWeExist>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
