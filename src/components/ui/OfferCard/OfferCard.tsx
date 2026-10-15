import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Offer } from "@/content/types";
import { offerWords, PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";

/**
 * The DS OfferCard (`kh-offer`), composed for the live mode (architecture §5.2, ADR-005, G-08): the product, the
 * headline price, the token-mode split (what is paid when), the perks, the pre-order button and the short price line as
 * fine print. In full mode the split is left out, whatever is passed (DS gap G-08: the DS card always draws it). Home's
 * close (home.html fold 9) and the product page (meet-kheelu.html fold 3). The amount takes no note beside it since task
 * Q2.8 (D065 item 3: no "incl. GST" on the selling pages; the split's two rows keep their amounts).
 *
 * The amounts and the offer's own strings come from the offer view model; the perks come from the offer's card
 * for the placement (icon slot: `Icon`; text slot: `RichText`); the button slot takes `PreorderButton`, which alone
 * writes the CTA tracking value. The card never moves on arrival (architecture §11.2), so it takes no reveal hook.
 *
 * The fine print is left out where the placement asks (`fine={false}`): the D2C plan v2 §2 fold 7 has the card's price
 * block stand in for the price line on Home's offer, so the line is not repeated (task Q2.9's review); the product page's
 * card prints the price once too since task Q2.13 (§3 fold 3).
 *
 * The note (task Q2.13; the D2C plan v2 §2 fold 7 and §3 fold 3, the main session's OK for the slot): a small line of its
 * own after the perks and before the button, inside the card (both cards print the Kheelona+ note there, offer.ts
 * `PLUS_NOTE`), so under the button only the trust line, the card's third row and the share link follow (OfferSection).
 * Its type is the DS's kh-body-s, as the later price's; the card's grid gap spaces it (`ks-offer__note`, offer-card.css).
 *
 * The later price (D061 item 3; task 8c.2): in token mode only, a plain line in the DS card's later-price place, the
 * prices row where the DS draws `was`, on a row of its own (`ks-offer__later`, offer-card.css). Never the DS's
 * `kh-offer__was`, which strikes the price through: not lawful until the later price has been charged (PRICE-01).
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
  /** The short price line as fine print under the button (default). `false` where the card's price block stands in for
   *  it, so the price is not repeated: both offer cards since task Q2.13 (the D2C plan v2 §2 fold 7, §3 fold 3). */
  fine?: boolean;
  /** A small line after the perks and before the button (task Q2.13): its words, rendered inside the card's paragraph. */
  note?: ReactNode;
}

export function OfferCard({ offer, perks, action, label, id, className, fine = true, note }: OfferCardProps) {
  const Root = label !== undefined ? "section" : "div";
  const split = offer.mode === "token" ? (offer.card.split ?? []) : [];
  const later = offer.mode === "token" ? offer.card.later : undefined;
  return (
    <Root className={clsx("kh-offer", className)} id={id} aria-label={label}>
      <p className="kh-offer__product">{offer.card.product}</p>
      <div className="kh-offer__prices">
        <span className="kh-offer__price">{offer.prices.headline}</span>
        {later !== undefined && <p className="kh-body-s ks-offer__later">{offerWords(later, offer, "OfferCard later price")}</p>}
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
      {note !== undefined && <p className="kh-body-s ks-offer__note">{note}</p>}
      {action}
      {fine && <PriceSentence offer={offer} variant="offer-fine" />}
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
