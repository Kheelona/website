import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { StoreTop } from "@/components/sections/store/StoreTop/StoreTop";
import { BALANCE_PRICE, FULL_PRICE, TOKEN_PRICE } from "@/config/site";
import { pickFaqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { OrderSummary } from "@/features/preorder/components/OrderSummary";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { buildOffer } from "@/lib/offer/offer";
import { PayBeside, StoreDetails, StorePaymentsLine } from "./StoreDetails";

/* StoreDetails (task 5.15): the store's two columns (store.html folds 1-5) with the store page's own parts in its
 * slots, in both offer modes, and the payments line the page closes its main with. The pay button here posts to
 * nothing: Storybook has no store API, so a submit only shows the form's failure line (nothing is ever charged). */

const NOTE = navigation.labels.newTabNote;

function Store({ mode }: { mode: "token" | "full" }) {
  const offer = buildOffer(mode);
  const amountLabel = mode === "token" ? TOKEN_PRICE : FULL_PRICE;
  return (
    <>
      <StoreDetails
        content={storePage.details}
        top={<StoreTop content={storePage.top} offer={offer} newTabNote={NOTE} />}
        form={
          <PreorderForm
            tier={mode === "token" ? "launch" : "full"}
            amountLabel={amountLabel}
            mode={mode}
            beside={<PayBeside content={storePage.beside} offer={offer} newTabNote={NOTE} />}
          />
        }
        summary={<OrderSummary amountLabel={amountLabel} tierLabel="" balanceLabel={BALANCE_PRICE} mode={mode} delivery={offer.delivery} />}
        questions={<FaqSection variant="store" heading={storePage.questions.heading} items={pickFaqs(storePage.questions.items)} offer={offer} />}
      />
      <StorePaymentsLine content={storePage.payments} newTabNote={NOTE} />
    </>
  );
}

const meta = {
  title: "Sections/Store/StoreDetails",
  component: Store,
  args: { mode: "token" },
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof Store>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Token mode, as the approved mockup shows it. */
export const Token: Story = {};

/** Full mode: the whole price today, the full-price sentence and the refund promise beside the button. */
export const Full: Story = { args: { mode: "full" } };
