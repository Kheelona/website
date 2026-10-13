import { BALANCE_PRICE, FULL_PRICE, LAUNCH_PRICE, MRP_PRICE, TOKEN_PRICE } from "@/config/site";
import type { OfferMode, PriceKey, RichTextString } from "@/content/types";
import { parseRichText } from "@/lib/content/rich-text";

/**
 * How the checkout prints its amounts (task 5.15; ADR-013, architecture §16). The restyled PreorderForm and
 * OrderSummary read their words from content (`content/en-IN/store/store-page.ts`), whose amounts are `{price:…}`
 * tokens, and fill them from the order the server priced: the labels it formatted for this tier (what is paid today,
 * what is still owed; an event tier's ₹99 and ₹4,900) and the money block's own prices. No amount is typed, and none
 * comes from the marketing offer's cache. Client-safe: the pre-order form is a client island.
 */

/**
 * The amounts a checkout string names, for an order in `mode`:
 * - `{price:token}` what a token order pays today (`amountLabel`; the money block's token price in full mode);
 * - `{price:balance}` what a token order still owes before delivery (`balanceLabel`);
 * - `{price:headline}` the launch price the advance counts toward (LAUNCH_PRICE in both modes: the full-mode small
 *   print names the launch price the first units went at, store.md fold 4);
 * - `{price:full}` the full price; in full mode, what this order pays today (`amountLabel`);
 * - `{price:mrp}` the money block's MRP;
 * - `{price:launch}` a reservation's total, LAUNCH_PRICE in both modes (task 4.7; the headline here already is).
 */
export function checkoutPrices(mode: OfferMode, amountLabel: string, balanceLabel: string): Readonly<Record<PriceKey, string>> {
  return {
    token: mode === "token" ? amountLabel : TOKEN_PRICE,
    balance: mode === "token" ? balanceLabel : BALANCE_PRICE,
    headline: LAUNCH_PRICE,
    full: mode === "full" ? amountLabel : FULL_PRICE,
    mrp: MRP_PRICE,
    launch: LAUNCH_PRICE,
  };
}

/** A checkout string as the words a parent reads: words and `{price:…}` amounts only; any other token (a link, an
 *  accent, the delivery line, a placeholder) is refused with the string that carried it, so the content is fixed
 *  instead of a flattened token reaching the page that takes money. */
export function checkoutWords(text: RichTextString, prices: Readonly<Record<PriceKey, string>>): string {
  return parseRichText(text)
    .map((node) => {
      if (node.kind === "text") return node.text;
      if (node.kind === "price") return prices[node.key];
      throw new Error(`checkoutWords: a checkout string is words and amounts only ({price:…}); found a ${node.kind} token in ${JSON.stringify(text)}`);
    })
    .join("");
}
