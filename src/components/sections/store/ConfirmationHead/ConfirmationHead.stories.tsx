import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BALANCE_PRICE, LAUNCH_PRICE, TOKEN_PRICE } from "@/config/site";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { placeholderText } from "@/lib/content/placeholder";
import { ConfirmationHead } from "./ConfirmationHead";

/* ConfirmationHead (task 5.16): /thanks fold 1 in its three states. The words are the content module's
 * (src/content/en-IN/store/confirmation.ts). SAMPLE_ORDER is the approved mockup's token order: its amounts, and its
 * two placeholders where the real page prints the order row's number and email (story and test data only). */

/** The mockup's sample order (store-confirmation.html): a ₹499 token, no address yet. */
export const SAMPLE_ORDER = {
  amount: TOKEN_PRICE,
  balance: BALANCE_PRICE,
  price: LAUNCH_PRICE,
  email: placeholderText({ id: null, note: "the email given at checkout" }),
  orderRef: placeholderText({ id: null, note: "order number, KH-XXXX-XXXX" }),
} as const;

const meta = {
  title: "Sections/Store/ConfirmationHead",
  component: ConfirmationHead,
  excludeStories: /^[A-Z0-9_]+$/,
  parameters: { layout: "fullscreen" },
  args: { copy: confirmation.head.paid, amount: SAMPLE_ORDER.amount, email: "parent@example.com" },
  render: (args) => (
    <div className="kh-section ks-thanks">
      <div className="ks-thanks__col">
        <ConfirmationHead {...args} />
      </div>
    </div>
  ),
} satisfies Meta<typeof ConfirmationHead>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Paid: the approved fold, the amount paid and the email from the order. */
export const Paid: Story = {};

/** Confirming: the payment is with the provider, the webhook not in yet. */
export const Confirming: Story = { args: { copy: confirmation.head.created, amount: undefined, email: undefined } };

/** Link needed: a bare /thanks, or a cookie that has aged out. */
export const LinkNeeded: Story = { args: { copy: confirmation.head.linkNeeded, amount: undefined, email: undefined } };
