import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FULL_PRICE } from "@/config/site";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { SAMPLE_ORDER } from "../ConfirmationHead/ConfirmationHead.stories";
import { OrderRows } from "./OrderRows";

/* OrderRows (task 5.16): /thanks fold 2. The words are the content module's; the values are the mockup's sample token
 * order, as the page would derive them from the order row. */

const meta = {
  title: "Sections/Store/OrderRows",
  component: OrderRows,
  parameters: { layout: "fullscreen" },
  args: {
    copy: confirmation.order,
    orderRef: "KH-A2B3-C4D5",
    paid: SAMPLE_ORDER.amount,
    balance: SAMPLE_ORDER.balance,
    price: SAMPLE_ORDER.price,
    createdAt: "2026-10-12T10:23:45.123456+00:00",
  },
  render: (args) => (
    <div className="kh-section ks-thanks">
      <div className="ks-thanks__col">
        <OrderRows {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof OrderRows>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A token order placed after 10 October: the approved fold, the D023 delivery line. */
export const TokenOrder: Story = {};

/** A token order placed before 10 October: the date it was sold with (N9, until F12 is answered). */
export const BeforeTenOctober: Story = { args: { createdAt: "2026-09-20T08:00:00+00:00" } };

/** A full-payment order: nothing still due. */
export const PaidInFull: Story = { args: { paid: FULL_PRICE, balance: null } };
