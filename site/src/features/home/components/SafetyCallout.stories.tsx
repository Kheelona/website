import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SafetyCallout } from "./SafetyCallout";

const meta = {
  title: "Home/SafetyCallout",
  component: SafetyCallout,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof SafetyCallout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
