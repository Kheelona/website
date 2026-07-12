import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HowItWorks } from "./HowItWorks";

const meta = {
  title: "Home/HowItWorks",
  component: HowItWorks,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof HowItWorks>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
