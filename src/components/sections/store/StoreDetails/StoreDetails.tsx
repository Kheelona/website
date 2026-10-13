import type { ReactNode } from "react";
import { SellingHelpLine } from "@/components/sections/CtaBlock/selling-lines";
import { storeTrustItems } from "@/components/sections/store/StoreTop/StoreTop";
import { RichText } from "@/components/ui/RichText/RichText";
import { TrustLine } from "@/components/ui/TrustLine/TrustLine";
import type { Offer } from "@/content/types";
import type { PayBesideConfig, StoreDetailsConfig } from "./store-details.types";

export type {
  CheckoutRow,
  OrderSummaryCopy,
  PayBesideConfig,
  PreorderFormCopy,
  StoreDetailsConfig,
} from "./store-details.types";

export interface StoreDetailsProps {
  /** The details section's heading and fragment. */
  readonly content: StoreDetailsConfig;
  /** The first screen (StoreTop, or an event page's own heading block). */
  readonly top: ReactNode;
  /** The in-app browser note; it renders nothing while switched off (N7). */
  readonly note?: ReactNode;
  /** The pre-order form, wired by the page (its tier, amount and mode are the checkout's; ADR-013). */
  readonly form: ReactNode;
  /** The agreement card (OrderSummary), wired by the page. */
  readonly summary: ReactNode;
  /** The questions under the card (FaqSection `store`). */
  readonly questions?: ReactNode;
}

/**
 * The store's two columns (task 5.15; store.md folds 1-5; mockup/store.html `mk-store`): on the left the first screen,
 * the in-app note and the details section holding the form; on the right the agreement card and the questions, sticky
 * from 900 px. On a phone they stack in that order, so the summary follows the pay button and the films come only after
 * every money answer. The checkout's own parts arrive as slots: the page wires PreorderForm and OrderSummary with the
 * tier the server priced, so nothing here can change what is charged. Server component.
 */
export function StoreDetails({ content, top, note, form, summary, questions }: StoreDetailsProps) {
  return (
    <div className="kh-section ks-store">
      <div className="kh-container ks-store__grid">
        <div className="ks-store__main">
          {top}
          {note}
          <section className="ks-details" id={content.id} aria-labelledby={content.titleId}>
            <h2 className="kh-title ks-h2" id={content.titleId}>
              {content.title}
            </h2>
            {form}
          </section>
        </div>
        <div className="ks-store__side">
          {summary}
          {questions}
        </div>
      </div>
    </div>
  );
}

export interface PayBesideProps {
  readonly content: PayBesideConfig;
  /** The offer resolves the delivery line in the trust row. */
  readonly offer: Offer;
  /** Read after each trust link, which opens its terms in a new tab. */
  readonly newTabNote: string;
}

/**
 * What follows the price sentence beside the pay button (store.md fold 3): Home's full trust row, each promise opening
 * its terms on the marketing site in a new tab; the payment window line; the help line with a person to reach. The
 * pre-order form renders it inside its own block, after the price sentence it prints itself (a client island never
 * draws the icon map, so this server part is handed in).
 */
export function PayBeside({ content, offer, newTabNote }: PayBesideProps) {
  return (
    <>
      <TrustLine items={storeTrustItems(content.trust, offer)} newTabNote={newTabNote} />
      <RichText as="p" className="kh-body-s ks-muted" text={content.payment} offer={offer} />
      <SellingHelpLine help={content.help} offer={offer} />
    </>
  );
}
