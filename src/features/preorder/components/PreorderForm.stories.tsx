import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PayBeside } from "@/components/sections/store/StoreDetails/StoreDetails";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { buildOffer } from "@/lib/offer/offer";
import { PreorderForm } from "./PreorderForm";

/* PreorderForm, restyled on the DS (task 5.15; store.html fold 3). The pay button posts to nothing here: Storybook has
 * no store API, so a submit shows the form's failure line, a DS danger Alert (nothing is ever charged). */

const meta = {
  title: "Features/Preorder/PreorderForm",
  component: PreorderForm,
  args: { tier: "launch", amountLabel: "₹499" },
  parameters: { layout: "padded", nextjs: { appDirectory: true } },
  decorators: [
    (Story) => (
      <div className="ks-details">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PreorderForm>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The store page's form: token mode, with the store's beside block (trust row, payment line, help line). */
export const LaunchPrice: Story = {
  args: { beside: <PayBeside content={storePage.beside} offer={buildOffer("token")} newTabNote={navigation.labels.newTabNote} /> },
};

/** Full mode: "Pay ₹7,999 and pre-order", the full-price sentence and the refund promise beside it. */
export const FullPrice: Story = {
  args: {
    tier: "full",
    amountLabel: "₹7,999",
    mode: "full",
    beside: <PayBeside content={storePage.beside} offer={buildOffer("full")} newTabNote={navigation.labels.newTabNote} />,
  },
};

/** An event token without a beside block (the event and partner pages until task 6.1): its own advance and balance. */
export const EventPrice: Story = {
  args: { tier: "blr-aug", signature: "ieW9NcWgHmASN60o", amountLabel: "₹99", balanceLabel: "₹4,900" },
};
