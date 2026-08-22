import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OrderSummary } from "./OrderSummary";

const meta = {
  title: "Features/Preorder/OrderSummary",
  component: OrderSummary,
  args: { amountLabel: "₹499", tierLabel: "Pre-order price" },
  parameters: { layout: "padded" },
} satisfies Meta<typeof OrderSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LaunchPrice: Story = {};
export const EventPrice: Story = { args: { amountLabel: "₹99", tierLabel: "Bangalore expo price" } };
