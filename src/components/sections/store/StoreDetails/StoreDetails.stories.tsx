import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { StorePayBar } from "@/components/sections/store/StorePayBar/StorePayBar.client";
import { StoreTop } from "@/components/sections/store/StoreTop/StoreTop";
import { BALANCE_PRICE, FULL_PRICE, TOKEN_PRICE } from "@/config/site";
import { pickFaqs } from "@/content/en-IN/faqs";
import { films, filmsStrip } from "@/content/en-IN/films";
import { navigation } from "@/content/en-IN/navigation";
import { storePage } from "@/content/en-IN/store/store-page";
import { OrderSummary } from "@/features/preorder/components/OrderSummary";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { buildOffer } from "@/lib/offer/offer";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { playLabel } from "@/components/sections/FilmsStrip/films-view";
import { PayBeside, StoreDetails } from "./StoreDetails";

/* StoreDetails (task 5.15): the store's two columns (store.html folds 1-5) with the store page's own parts in its
 * slots, in both offer modes, and the payments line the page closes its main with. The pay button here posts to
 * nothing: Storybook has no store API, so a submit only shows the form's failure line (nothing is ever charged). */

const NOTE = navigation.labels.newTabNote;

function Store({ mode, reservation = false }: { mode: "token" | "full"; reservation?: boolean }) {
  const offer = buildOffer(mode);
  const amountLabel = mode === "token" ? TOKEN_PRICE : FULL_PRICE;
  const { anchor, open } = storePage.answers;
  return (
    <>
      <StoreDetails
        content={storePage.details}
        questionsFirst={reservation}
        bar={reservation ? <StorePayBar /> : undefined}
        top={
          <StoreTop
            content={storePage.top}
            offer={offer}
            newTabNote={NOTE}
            film={reservation ? { id: films[0].id, label: playLabel(films[0], filmsStrip) } : undefined}
          />
        }
        form={
          <PreorderForm
            tier={mode === "token" ? "launch" : "full"}
            amountLabel={amountLabel}
            mode={mode}
            beside={<PayBeside content={storePage.beside} offer={offer} newTabNote={NOTE} />}
          />
        }
        summary={<OrderSummary amountLabel={amountLabel} tierLabel="" balanceLabel={BALANCE_PRICE} mode={mode} delivery={offer.delivery} />}
        questions={
          <FaqSection
            variant="store"
            heading={storePage.questions.heading}
            items={pickFaqs(storePage.questions.items)}
            open={reservation ? open : undefined}
            anchor={reservation ? anchor : undefined}
            offer={offer}
          />
        }
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

/** The reservation layout of the store page (D070 / C1): the questions under the pay block, the three money answers open, the
 *  agreement card after them, the small Khelu linking to the first film, and the pay bar below 900 px (scroll to see it:
 *  from the first scroll, it steps aside for a field's focus and while the form's own button is on screen). */
export const Reservation: Story = { args: { reservation: true } };
