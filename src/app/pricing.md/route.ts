import {
  LAUNCH_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  TOKEN_PRICE,
  BALANCE_PRICE,
  STORE_URL,
  TAX_LINE,
  KHEELU_AGES,
  LANGUAGES_LINE,
  SHIP_DATE_TEXT,
} from "@/config/site";

/** `/pricing.md` (V3 SEO/AEO pass).
 *
 *  Why: AI agents increasingly compare products on a buyer's behalf before any
 *  human visits the site, and an agent skips what it cannot parse. Our price is
 *  public and simple, so there is no reason to make an agent read it out of a
 *  rendered page. Same idea as robots.txt for crawlers and llms.txt for context.
 *
 *  HARD RULES, same as llms.txt: only facts published on the site, from
 *  `config/site` so they cannot drift. 2026-07-31: ship date + named languages
 *  + lifetime smart features are now published; still gated: any Kheelona+ ₹
 *  amount. */
export const dynamic = "force-static";

/** The date the PRICES in this file last changed: 2026-08-23 is the day the
 *  first-500-units offer and the full-payment tier landed (§8.26). The old line
 *  said "July 2026", which was wrong for a month. Bump this in the commit that
 *  moves a price (the sell-out sweep, §8.26-g, is the next one). */
export const PRICING_UPDATED = "2026-08-23";

const BODY = `# Pricing: Kheelu by Kheelona

Market: India. Currency: INR. Stage: pre-order, taking a refundable token.

## Kheelu (the talking toy, ages ${KHEELU_AGES})

- Pre-order price: ${LAUNCH_PRICE}, for the ${CAP_UNITS_TEXT}
- Price once they are gone: ${FULL_PRICE}, paid in full at pre-order
- Paid at pre-order while the ${CAP_UNITS_TEXT} last: ${TOKEN_PRICE}, adjusted against the price, and fully refundable until dispatch
- Balance on a ${TOKEN_PRICE} reservation: ${BALANCE_PRICE}, due by payment link when your unit is ready to dispatch
- Taxes: ${TAX_LINE} The published price is what a buyer pays.
- Delivery: included, anywhere in India. No charge is added at any step.
- Included with every Kheelu: 6 months of Kheelona+
- Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed.
- Where to pre-order: ${STORE_URL}

## Kheelona+ (the content and the controls)

- What it is: stories, lessons, language packs, and the parent app that shows you every conversation
- Included free for the first 6 months with every Kheelu
- Pricing after the included months: announced soon. Kheelu's smart features are yours for life.
- Renewal: nothing renews without the parent

## Also in the family (not yet purchasable)

- Kheelu Speaker, ages 5+: in development, price not announced
- AI books: in development, price not announced

## What you get for the price

- Three modes in one toy: AI mode (open conversation), Story mode (stories and lessons that quiz back, offline), Bluetooth mode (pair a phone and Kheelu is the speaker)
- Languages: ${LANGUAGES_LINE}, with up to 10 at launch. Kheelu switches mid-sentence.
- No screen, and no access to the open internet
- A parent app with the full conversation log, topic controls, quiet hours, and one-tap deletion

Last updated: ${PRICING_UPDATED}. Canonical page: https://kheelona.com/products/kheelu
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
