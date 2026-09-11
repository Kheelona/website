import {
  KHEELU_AGES,
  LANGUAGES_LINE,
  KHEELU_LANGUAGES,
  LAUNCH_PRICE,
  FULL_PRICE,
  TOKEN_PRICE,
  BALANCE_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  TAX_LINE,
} from "@/config/site";

/** Kheelu's specification, as ONE list (SEO/AEO/GEO round 2026-09-11, §8.36).
 *
 *  WHY THIS FILE EXISTS. Measured on Perplexity on 2026-09-11: asked for the
 *  best AI toy for a four-year-old in India, it answered with YUMI, Pookie,
 *  AIVY and Miko, and four of its eleven citations were the vendors' OWN sites.
 *  So a brand page can be the answer. What those cited pages share is shape:
 *  every snippet the model lifted was spec-dense — a price, an age, a language
 *  count, a battery life, in one scannable line. Kheelona's copy is warm prose,
 *  which reads better to a parent and gives a retrieval model nothing to put in
 *  a comparison row.
 *
 *  This list is that missing shape. It is rendered as a visible table by
 *  `SpecTable` AND emitted as the Product's `additionalProperty` array from the
 *  same constant, so the page a parent reads and the graph a machine reads
 *  cannot disagree (the registry law, §8.19, applied to specifications).
 *
 *  THE HARD RULE, and it is the reason half these rows read the way they do:
 *  EVERY VALUE HERE IS ALREADY PUBLISHED SOMEWHERE ELSE ON THIS SITE. Nothing
 *  is measured, estimated, or inferred for this table. The never-invent law
 *  (CLAUDE.md, hard gates) does not relax because a competitor's page has a row
 *  we do not.
 *
 *  Three specs a rival table would carry are therefore ABSENT, and their
 *  absence is deliberate and load-bearing:
 *    - BATTERY LIFE. Not published anywhere on this site. YUMI's cited snippet
 *      says "up to 7 days"; we do not get to answer that with a guess.
 *    - WARRANTY TERMS. /products/kheelu says "warranty details land closer to
 *      launch". That stays the answer here.
 *    - COUNTRY OF MANUFACTURE. The company is in Bengaluru; where the toy is
 *      MADE is a different claim and this site has never made it. Grepped
 *      2026-09-11: no "made in India" string exists in the repo. A competitor
 *      citation says "Designed and built in India" — that is their claim to
 *      make, not ours to match.
 *
 *  Rows whose value is genuinely "not announced yet" are kept and answered
 *  honestly rather than dropped. A parent comparing toys reads a stated
 *  "announced before we ship" as candour; a model reading it cannot hallucinate
 *  a number into the gap, which is the real protection. */
export type ProductFact = {
  /** Short label. Doubles as the schema `PropertyValue.name`, so keep it the
   *  noun a comparison table would use, not a sentence. */
  name: string;
  /** The published value. */
  value: string;
  /** Set where the honest answer is "we have not announced this". Rendered in
   *  muted ink and NEVER emitted into schema — an unannounced spec is not a
   *  property, and publishing it as one invites a machine to quote the caveat
   *  as though it were the specification. */
  pending?: true;
};

export const KHEELU_FACTS: readonly ProductFact[] = [
  { name: "Age", value: `${KHEELU_AGES} years` },
  { name: "Screen", value: "None. There is no screen on the toy and none in the play." },
  {
    name: "Languages",
    value: `${KHEELU_LANGUAGES.length} at launch (${LANGUAGES_LINE}), up to 10. Switches mid-sentence.`,
  },
  { name: "Modes", value: "Three: AI mode for open conversation, Story mode for stories and lessons, Bluetooth mode as a speaker." },
  { name: "Microphone", value: "Wakes to a word. Off the rest of the time, not muted." },
  { name: "Internet access", value: "None. Answers come from a closed library. Kheelu cannot browse or search." },
  {
    name: "Works offline",
    value: "Story-mode stories and lessons, and Bluetooth music with a paired phone. AI mode needs home WiFi.",
  },
  { name: "Parent app", value: "Every conversation word for word, deletable in one tap, plus topic controls and quiet hours." },
  { name: "Where the voice data goes", value: "Stays in your region. Never sold, never used to advertise to your child." },
  { name: "Price", value: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, then ${FULL_PRICE}.` },
  { name: "To reserve one", value: `${TOKEN_PRICE}, refundable in full any time before dispatch. ${BALANCE_PRICE} balance falls due before we ship.` },
  { name: "Delivery", value: `Included anywhere in India. ${TAX_LINE} The published price is the total cost.` },
  { name: "Ships from", value: SHIP_DATE_TEXT },
  { name: "Included subscription", value: "6 months of Kheelona+. Kheelu's smart features are lifetime." },
  /* The three honest gaps. See the file header for why each one is empty. */
  { name: "Battery life", value: "Not announced yet. It will be published before we ship.", pending: true },
  { name: "Warranty", value: "Terms land closer to launch.", pending: true },
  {
    name: "Toy-safety certification",
    value: "In progress. Certificates are published in full before Kheelu ships, and no badge is claimed before it is earned.",
    pending: true,
  },
];

/** The announced half, as schema.org `PropertyValue` nodes.
 *
 *  `pending` rows are filtered out on purpose (see the type above): schema is a
 *  statement of fact, and "not announced yet" is the absence of one. */
export function productProperties() {
  return KHEELU_FACTS.filter((f) => !f.pending).map((f) => ({
    "@type": "PropertyValue" as const,
    name: f.name,
    value: f.value,
  }));
}
