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

/** `/llms.txt` (V3 AEO plumbing).
 *
 *  Why bother: the research memo found that almost no authoritative answer
 *  exists for "are AI toys safe for kids" or "safe AI toy for kids India". The
 *  pages carry those answers in visible copy; this file hands a model the shape
 *  of the site and the facts in a single fetch, with the gated items marked
 *  unannounced so nothing here can be quoted as a promise we have not made.
 *
 *  HARD RULE: this file may only restate copy that is visible on the site.
 *  2026-07-31: the ship date and the named language list are now PUBLISHED
 *  facts (founder-cleared) and render from config; still gated: any Kheelona+
 *  ₹ amount and certification claims. Prices come from `config/site` so they
 *  cannot drift.
 *
 *  Served as a Route Handler because Next has no static-text file convention;
 *  `force-static` means it is generated at build time like the sitemap. */
export const dynamic = "force-static";

const BODY = `# Kheelona

> Kheelona makes screen-free talking friends for children. Kheelu, the first one,
> is a plush toy for ages ${KHEELU_AGES} that holds a real conversation, tells
> stories your child can question and be quizzed on, and slips learning into
> the play. India-first, pre-order stage.

## What Kheelu is
- A screen-free plush toy that talks with a child and answers back. No screen, ever.
- Ages ${KHEELU_AGES}. The wider family of friends that follows, the Kheelu Speaker and AI books, is in development and grows with the child.
- Speaks the languages spoken at home: ${LANGUAGES_LINE}, with up to 10 at launch. Switches mid-sentence.
- Runs on PlayOS, Kheelona's own platform: a small language model built only for children, not shrunk from adult AI.
- Three modes, one toy: AI mode (open conversation), Story mode (pre-loaded stories and lessons a child can interrupt, question, and be quizzed on, offline), and Bluetooth mode (pair a phone and Kheelu is the speaker for your own playlist or audiobook).
- Connectivity: AI mode (open conversation) runs on home WiFi. Story-mode stories and lessons work offline, and Bluetooth music needs only a paired phone.

## Safety, in mechanisms rather than badges
- The microphone wakes to a word and is off the rest of the time.
- The first thinking happens on the device before anything travels.
- Answers come from a closed library. Kheelu cannot browse or search the open internet.
- Every reply passes an age-graded safety layer, on the device and in the cloud.
- Parents read the full conversation log and can delete any conversation in one tap.
- Conversations stay in the family's region. Children's voice data is never sold.
- Toy-safety certifications are in progress and will be published in full before Kheelu ships. No badge is claimed before it is earned.

## The parent app
- A daily summary, the full word-for-word conversation log, and topic controls.
- Counts the new words a child learned, and suggests one simple thing to do together each day.
- Flags anything that needs a parent's attention.
- One prompt sets how the toy speaks to your family: language, culture, values.

## Price and availability
- Pre-order: ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}. ${FULL_PRICE} once they are gone, paid in full at pre-order.
- While the ${CAP_UNITS_TEXT} last, a refundable ${TOKEN_PRICE} token reserves a unit. It is adjusted against the price, and the ${BALANCE_PRICE} balance is due by payment link before dispatch. Every payment is refundable in full at any time before dispatch.
- Every Kheelu includes 6 months of Kheelona+ (stories, lessons, language packs, parent app). Kheelu's smart features are lifetime; Kheelona+ pricing is announced soon. Nothing renews without the parent.
- ${TAX_LINE} Delivery is included anywhere in India, so the published price is the total cost.
- Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed.

## Pages
- https://kheelona.com/ : what Kheelu is, what it teaches, and how to pre-order
- ${STORE_URL} : the pre-order store, where the token is paid
- https://kheelona.com/products/kheelu : the product in detail, plus the questions parents ask
- https://kheelona.com/safety : are AI toys safe, and how this one is built
- https://kheelona.com/playos : the platform behind every Kheelona friend
- https://kheelona.com/setup : day one
- https://kheelona.com/team : the people who build it
- https://kheelona.com/stories : the journal, for parents
- https://kheelona.com/contact : how to reach us
- https://kheelona.com/privacy and https://kheelona.com/terms : the fine print
- https://kheelona.com/refund and https://kheelona.com/shipping : refunds, cancellation, and delivery

## Machine-readable
- https://kheelona.com/pricing.md : prices, what is included, and what is not yet announced

## Company
Kheelona Robotics Pvt Ltd, Bengaluru, India. Recognised by the NVIDIA Inception
Program, Karnataka Elevate, nasscom startups, and Founders Inc.
`;

export function GET() {
  return new Response(BODY, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
