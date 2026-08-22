import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PreorderForm } from "./PreorderForm";

const meta = {
  title: "Features/Preorder/PreorderForm",
  component: PreorderForm,
  args: { tier: "launch", amountLabel: "₹499" },
  parameters: { layout: "padded", nextjs: { appDirectory: true } },
} satisfies Meta<typeof PreorderForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LaunchPrice: Story = {};

export const EventPrice: Story = {
  args: { tier: "blr-aug", signature: "ieW9NcWgHmASN60o", amountLabel: "₹99" },
};
