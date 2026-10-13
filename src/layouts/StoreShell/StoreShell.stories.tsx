import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { StepsSection } from "@/components/sections/StepsSection/StepsSection";
import { AddressStep } from "@/components/sections/store/AddressStep/AddressStep";
import { ConfirmationHead } from "@/components/sections/store/ConfirmationHead/ConfirmationHead";
import { fillSteps } from "@/components/sections/store/ConfirmationHead/slot-text";
import { HelpBlock } from "@/components/sections/store/HelpBlock/HelpBlock";
import { OrderRows } from "@/components/sections/store/OrderRows/OrderRows";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { formatInr, LAUNCH_AMOUNT_PAISE, LAUNCH_PRICE } from "@/config/site";
import { navigation } from "@/content/en-IN/navigation";
import { seller } from "@/content/en-IN/seller";
import { confirmation } from "@/content/en-IN/store/confirmation";
import { AddressForm } from "@/features/preorder";
import { THANKS_PAID } from "../../../test/fixtures/store/thanks-paid";
import { StoreShell } from "./StoreShell";

/* StoreShell (task 3.1): the store host's chrome around a store page. Its story is the /thanks paid state (task 4.8
 * item 3; wiki/qa/deviations.md V5): the route's own specs open /thanks with no order and see the link-needed state, so
 * the state the approved mockup shows (mockup/store-confirmation.html) is composed here from a fixture order
 * (test/fixtures/store/thanks-paid.ts), exactly as src/app/store/thanks/page.tsx renders a paid token order with no
 * address yet: the five folds in the privacy container, then the payments line and the /thanks bubble. No real order
 * and no change to the page: thanks-paid-story.test.tsx proves this story's main equals the route's render of the same
 * order, and test/e2e/thanks-paid.spec.ts compares the story with the mockup at 360, 390 and 1440. */

const meta: Meta<typeof StoreShell> = {
  title: "Layouts/StoreShell",
  component: StoreShell,
};
export default meta;

type Story = StoryObj<typeof StoreShell>;

const { order, token } = THANKS_PAID;
/* Derived from the order row as the page derives them (never from the store's current mode). */
const paid = formatInr(order.amount_paise);
const balance = formatInr(Math.max(0, LAUNCH_AMOUNT_PAISE - order.amount_paise));

/** /thanks, paid, a token order with no address yet (store-confirmation.html), inside the store chrome. */
export const ThanksPaid: Story = {
  name: "Thanks paid",
  render: () => (
    <StoreShell>
      <div className="ph-no-capture ph-mask kh-section ks-thanks">
        <div className="ks-thanks__col">
          <ConfirmationHead copy={confirmation.head.paid} amount={paid} email={order.email} />
          <OrderRows
            copy={confirmation.order}
            orderRef={order.order_ref}
            paid={paid}
            balance={balance}
            price={LAUNCH_PRICE}
            createdAt={order.created_at}
          />
          <AddressStep copy={confirmation.address.empty}>
            <AddressForm orderRef={order.order_ref} token={token} existing={order.address} />
          </AddressStep>
          <StepsSection variant="thanks" heading={confirmation.next.heading} steps={fillSteps(confirmation.next.token, { balance })} />
          <HelpBlock copy={confirmation.help} />
        </div>
      </div>
      <StorePaymentsLine content={confirmation.payments} newTabNote={navigation.labels.newTabNote} noCapture />
      <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="thanks" />
    </StoreShell>
  ),
};
