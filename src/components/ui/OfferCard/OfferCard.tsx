import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Offer } from "@/content/types";
import { offerWords, PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";

/**
 * The DS OfferCard (`kh-offer`), composed for the live mode (architecture §5.2, ADR-005, G-08): the product, the
 * headline price and its note, the token-mode split (what is paid when), the perks, the pre-order button and the
 * price sentence as fine print. In full mode the split is left out, whatever is passed (DS gap G-08: the DS card
 * always draws it). Home's close (home.html fold 9) and the product page (meet-kheelu.html fold 3).
 *
 * The amounts and the offer's own strings come from the offer view model; the perks come from the offer's card
 * for the placement (icon slot: `Icon`; text slot: `RichText`); the button slot takes `PreorderButton`, which alone
 * writes the CTA tracking value. The card never moves on arrival (architecture §11.2), so it takes no reveal hook.
 */
export interface OfferPerk {
  icon: ReactNode;
  text: ReactNode;
}

export interface OfferCardProps {
  offer: Offer;
  perks: readonly OfferPerk[];
  /** The pre-order button (`PreorderButton`, block, large, with the placement's CTA id). */
  action: ReactNode;
  /** Home's card is a named region ("Kheelu offer"); without a label the card is a plain block (product page). */
  label?: string;
  id?: string;
  /** The parent's composition class, added after the DS class. */
  className?: string;
}

export function OfferCard({ offer, perks, action, label, id, className }: OfferCardProps) {
  const Root = label !== undefined ? "section" : "div";
  const split = offer.mode === "token" ? (offer.card.split ?? []) : [];
  return (
    <Root className={clsx("kh-offer", className)} id={id} aria-label={label}>
      <p className="kh-offer__product">{offer.card.product}</p>
      <div className="kh-offer__prices">
        <span className="kh-offer__price">{offer.prices.headline}</span>
        <span className="kh-body-s">{offerWords(offer.card.priceNote, offer, "OfferCard price note")}</span>
      </div>
      {split.length > 0 && (
        <div className="kh-offer__split">
          {split.map((row, i) => (
            <SplitRow key={i} label={offerWords(row.label, offer, "OfferCard split label")} amount={offer.prices[row.price]} />
          ))}
        </div>
      )}
      <ul className="kh-offer__list">
        {perks.map((perk, i) => (
          <li key={i}>
            {perk.icon}
            <span>{perk.text}</span>
          </li>
        ))}
      </ul>
      {action}
      <PriceSentence offer={offer} variant="offer-fine" />
    </Root>
  );
}

/** One line of the split: its label, then its amount (the DS grid's two columns). */
function SplitRow({ label, amount }: { label: string; amount: string }) {
  return (
    <>
      <span>{label}</span>
      <b>{amount}</b>
    </>
  );
}
