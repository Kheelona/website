import {
  BALANCE_AMOUNT_PAISE,
  FULL_AMOUNT_PAISE,
  LAUNCH_AMOUNT_PAISE,
  MRP_AMOUNT_PAISE,
  TOKEN_AMOUNT_PAISE,
} from "@/config/site";
import { DELIVERY_SCHEMA_DATE, DELIVERY_TEXT } from "@/content/en-IN/delivery";
import { offerCopy } from "@/content/en-IN/offer";
import type { Offer, OfferCard, OfferCopy, OfferMode, OfferShare, PriceKey } from "@/content/types";
import { toPlainText } from "@/lib/content/plain-text";
import { formatInr } from "@/lib/format/inr";

/**
 * The offer view model (ADR-005, architecture §7): the live store mode turned into everything a
 * page shows about the price. Every amount is the checkout's own paise constant formatted once
 * (the money block of src/config/site.ts stays the single source, ADR-013); the words come from
 * content/en-IN/offer.ts. The count behind the mode never reaches this file (src/lib/store/mode.ts).
 */

/** The headline amount: LAUNCH while a token reserves one of the capped units, FULL after. The
 *  Meta ViewContent value is this divided by 100, so the tracker follows the mode too. */
export function headlinePaise(mode: OfferMode): number {
  switch (mode) {
    case "token":
      return LAUNCH_AMOUNT_PAISE;
    case "full":
      return FULL_AMOUNT_PAISE;
  }
}

/** The six amounts a content string may name as `{price:…}`. `launch` is LAUNCH in both modes (task 4.7): a
 *  reservation's total, which a reservation still owes the rest of after the headline has moved to FULL. */
export function offerPrices(mode: OfferMode): Readonly<Record<PriceKey, string>> {
  return {
    token: formatInr(TOKEN_AMOUNT_PAISE),
    balance: formatInr(BALANCE_AMOUNT_PAISE),
    headline: formatInr(headlinePaise(mode)),
    full: formatInr(FULL_AMOUNT_PAISE),
    mrp: formatInr(MRP_AMOUNT_PAISE),
    launch: formatInr(LAUNCH_AMOUNT_PAISE),
  };
}

function offerCard(mode: OfferMode, copy: OfferCopy): OfferCard {
  const card = { product: copy.card.product, perks: copy.card.perks };
  /* Full mode has no advance, so its card has no split (DS gap G-08), and no later price: the later price is the price
     then (D061 item 3). */
  if (mode !== "token") return card;
  const { split, later } = copy.card;
  return later === undefined ? { ...card, split } : { ...card, split, later };
}

/** The share link for the mode (D061; task 8c.2): WhatsApp's share link with the message the parent sends, its amounts
 *  resolved as the page resolves them, then the tagged address, all encoded as the WhatsApp bubble encodes its text. */
function offerShare(copy: OfferCopy, offer: Offer): OfferShare | undefined {
  if (copy.share === undefined) return undefined;
  const { label, href, text, address } = copy.share;
  return { label, href: `${href}?text=${encodeURIComponent(`${toPlainText(text, offer)} ${address}`)}` };
}

/** The offer for a mode. `copy` is the locale's offer module (en-IN by default). */
export function buildOffer(mode: OfferMode, copy: OfferCopy = offerCopy): Offer {
  const offer: Offer = {
    mode,
    headlinePaise: headlinePaise(mode),
    prices: offerPrices(mode),
    sentence: copy.sentence[mode],
    priceLine: copy.priceLine[mode],
    sticky: copy.sticky[mode],
    card: offerCard(mode, copy),
    plus: copy.plus,
    delivery: DELIVERY_TEXT,
    availabilityStarts: DELIVERY_SCHEMA_DATE,
  };
  const share = offerShare(copy, offer);
  return share === undefined ? offer : { ...offer, share };
}
