import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SafetyStrip } from "./SafetyStrip";

const meta = {
  title: "Home/SafetyStrip",
  component: SafetyStrip,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof SafetyStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
