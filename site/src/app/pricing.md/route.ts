import {
  LAUNCH_PRICE,
  LATER_PRICE,
  LUMI_AGES,
  PLATFORM_AGES,
} from "@/config/site";

/** `/pricing.md` (V3 SEO/AEO pass).
 *
 *  Why: AI agents increasingly compare products on a buyer's behalf before any
 *  human visits the site, and an agent skips what it cannot parse. Our price is
 *  public and simple, so there is no reason to make an agent read it out of a
 *  rendered page. Same idea as robots.txt for crawlers and llms.txt for context.
 *
 *  HARD RULES, same as llms.txt: only facts published on the site, prices from
 *  `config/site` so they cannot drift, and NO gated facts — no ship date, no
 *  Kheelona+ monthly price, no claim about what happens if it lapses. */
export const dynamic = "force-static";

const BODY = `# Pricing — Lumi by Kheelona

Market: India. Currency: INR. Stage: pre-order, no payment taken.

## Lumi (the talking toy, ages ${LUMI_AGES})

- Pre-order price: ${LAUNCH_PRICE} — the first 500 units
- Price after launch: ${LATER_PRICE}
- Payment taken at pre-order: none. Reserving holds the price and your place, and does not commit you to buy.
- Included with every Lumi: 6 months of Kheelona+
- Ship date: not announced. Everyone on the list is told first.
- Where to reserve: https://kheelona.com/#reserve

## Kheelona+ (the content and the controls)

- What it is: stories, lessons, language packs, and the parent app that shows you every conversation
- Included free for the first 6 months with every Lumi
- Monthly price after that: announced before launch
- Renewal: nothing renews without the parent

## Also in the family (not yet purchasable)

- Kheelu Speaker, ages 5 to 14 — in development, price not announced
- AI books, ages ${PLATFORM_AGES} — in development, price not announced

## What you get for the price

- Three modes in one toy: AI mode (open conversation), Kheelu mode (stories and lessons that quiz back, offline), Bluetooth mode (pair a phone and Lumi is the speaker)
- Up to 10 languages spoken at home, including English, Hindi, and regional Indian languages. Full list announced before launch.
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
