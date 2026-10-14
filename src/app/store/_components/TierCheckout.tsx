import type { ReactNode } from "react";
import type { ResolvedTier } from "@/lib/store/tiers";
import { PreorderForm } from "@/features/preorder/components/PreorderForm";
import { OrderSummary } from "@/features/preorder/components/OrderSummary";
import { WhatsAppFloat } from "@/components/chrome/WhatsAppFloat/WhatsAppFloat";
import { FaqSection } from "@/components/sections/FaqSection/FaqSection";
import { checkoutPrices } from "@/components/sections/store/StoreDetails/checkout-words";
import { PayBeside, StoreDetails } from "@/components/sections/store/StoreDetails/StoreDetails";
import { StorePaymentsLine } from "@/components/sections/store/StorePaymentsLine/StorePaymentsLine";
import { StoreTop } from "@/components/sections/store/StoreTop/StoreTop";
import { pickFaqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { seller } from "@/content/en-IN/seller";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import type { TierCheckoutContent } from "@/content/en-IN/store/event-page";
import { buildOffer } from "@/lib/offer/offer";

/** An event tier's checkout (§8.25-g; task 6.1, architecture §16.1, ADR-013).
 *
 *  What a QR code at a stall and a partner page sell through. Neither page has a
 *  mockup: they reuse the store page's layout and components (StoreTop, StoreDetails,
 *  the store's questions), around the same frozen PreorderForm and OrderSummary.
 *  The pages resolve and price the tier on the server, exactly as before, and hand
 *  over the tier, its signature and the two labels they formatted; this only lays
 *  them out. It lives under src/app/store so its wiring stays under the checkout's
 *  logic signature (test/guards/checkout-signature.test.ts).
 *
 *  Always the token shape, whatever the public mode is: an event token is a token,
 *  with the same balance-before-delivery terms. The store's `{price:…}` words take
 *  this tier's amounts (checkout-words.ts, the form's own rule: today the tier's
 *  amount, before delivery the balance the page derived, in total the launch price),
 *  so the first screen, the sentence beside the pay button, the agreement card and
 *  the questions all name the same ₹99 and ₹4,900. The tier's own price name
 *  ("Bangalore expo price") opens the first screen's eyebrow, since OrderSummary
 *  no longer prints it (store.md fold 4; the 5.15 review), with the store's age
 *  band after it so the band stays on the first screen (CMO review C m2, task
 *  7.1c: "Bangalore expo price · Ages 3 to 7", composed by the content).
 *
 *  No in-app note and no films: the note's "Copy link" copies the store's address,
 *  which would drop the tier and its signature, and the event page is the form and
 *  its answers. Server component. */
export function TierCheckout({
  tier,
  signature,
  amountLabel,
  balanceLabel,
  content,
  mark,
}: {
  tier: ResolvedTier;
  signature?: string;
  /** What the tier charges today, formatted by the server. */
  amountLabel: string;
  /** What the launch price still needs after this token, formatted by the server. */
  balanceLabel: string;
  /** The words: the store page's folds (content/en-IN/store/event-page.ts). */
  content: TierCheckoutContent;
  /** A partner's lockup, above the first screen (the partner page, B29). */
  mark?: ReactNode;
}) {
  const offer = { ...buildOffer("token"), prices: checkoutPrices("token", amountLabel, balanceLabel) };
  const newTabNote = navigation.labels.newTabNote;

  return (
    <>
      <StoreDetails
        content={content.details}
        top={
          <>
            {mark}
            <StoreTop content={{ ...content.top, eyebrow: content.eyebrow(tier.label) }} offer={offer} newTabNote={newTabNote} />
          </>
        }
        form={
          <PreorderForm
            tier={tier.id}
            signature={signature}
            amountLabel={amountLabel}
            mode="token"
            balanceLabel={balanceLabel}
            beside={<PayBeside content={content.beside} offer={offer} newTabNote={newTabNote} />}
          />
        }
        summary={
          <OrderSummary amountLabel={amountLabel} tierLabel={tier.label} mode="token" balanceLabel={balanceLabel} delivery={offer.delivery} />
        }
        questions={
          <FaqSection variant="store" heading={content.questions.heading} items={pickFaqs(content.questions.items)} offer={offer} />
        }
      />
      <StoreClose />
    </>
  );
}

/** What ends every store page but /thanks (D042, D050): the store footer's payments
 *  line as the last line of main (the store layout's policy links are a frozen
 *  contract, so it cannot sit in the footer; wiki/qa/deviations.md V1), then the
 *  store's WhatsApp bubble with the store's own pre-filled text, never an order
 *  detail. Each page renders it, since a layout cannot know its page. /thanks has
 *  its own (ph-no-capture on both, its own text). */
export function StoreClose() {
  return (
    <>
      <StorePaymentsLine content={paymentsLine} newTabNote={navigation.labels.newTabNote} />
      <WhatsAppFloat href={seller.support.whatsapp} chat={seller.chat} context="store" />
    </>
  );
}
