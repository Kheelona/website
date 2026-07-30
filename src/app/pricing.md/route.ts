import {
  LAUNCH_PRICE,
  LATER_PRICE,
  LUMI_AGES,
  PLATFORM_AGES,
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

const BODY = `# Pricing — Lumi by Kheelona

Market: India. Currency: INR. Stage: pre-order, no payment taken.

## Lumi (the talking toy, ages ${LUMI_AGES})

- Pre-order price: ${LAUNCH_PRICE} — the first 500 units
- Price after launch: ${LATER_PRICE}
- Payment taken at pre-order: none. Reserving holds the price and your place, and does not commit you to buy.
- Included with every Lumi: 6 months of Kheelona+
- Shipping starts ${SHIP_DATE_TEXT}. Everyone on the list is served first, in reservation order.
- Where to reserve: https://kheelona.com/#reserve

## Kheelona+ (the content and the controls)

- What it is: stories, lessons, language packs, and the parent app that shows you every conversation
- Included free for the first 6 months with every Lumi
- Pricing after the included months: announced soon. Lumi's smart features are yours for life.
- Renewal: nothing renews without the parent

## Also in the family (not yet purchasable)

- Kheelu Speaker, ages 5 to 14 — in development, price not announced
- AI books, ages ${PLATFORM_AGES} — in development, price not announced

## What you get for the price

- Three modes in one toy: AI mode (open conversation), Kheelu mode (stories and lessons that quiz back, offline), Bluetooth mode (pair a phone and Lumi is the speaker)
- Languages: ${LANGUAGES_LINE}, with up to 10 at launch. Lumi switches mid-sentence.
- No screen, and no access to the open internet
- A parent app with the full conversation log, topic controls, quiet hours, and one-tap deletion

Last updated: July 2026. Canonical page: https://kheelona.com/products/lumi
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
