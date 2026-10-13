import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { DELIVERY_TEXT } from "@/content/en-IN/delivery";
import { OrderSummary } from "./OrderSummary";

/* OrderSummary, restyled on the DS: the store's agreement card (task 5.15; store.html fold 4). */

const meta = {
  title: "Features/Preorder/OrderSummary",
  component: OrderSummary,
  args: { amountLabel: "₹499", tierLabel: "Pre-order price", delivery: DELIVERY_TEXT },
  parameters: { layout: "padded" },
} satisfies Meta<typeof OrderSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The store page: token mode with the D023 delivery line. */
export const LaunchPrice: Story = {};

/** Full mode: the whole price today, nothing due before delivery. */
export const FullPrice: Story = { args: { amountLabel: "₹7,999", tierLabel: "Launch price", mode: "full" } };

/** An event token: its own advance and derived balance. */
export const EventPrice: Story = { args: { amountLabel: "₹99", tierLabel: "Bangalore expo price", balanceLabel: "₹4,900" } };

/** Without a delivery line (the event and partner pages until task 6.1): the checkout's own ship date. */
export const LegacyShipDate: Story = { args: { delivery: undefined } };
