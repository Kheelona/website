/* Approved deviations from the mockup (tasks.md SPA 1 and 2).
 *
 * A page task that exceeds the parity tolerance lists each exceeding chunk or text difference in
 * its report with the reason (a founder decision after Gate A, a corrected defect, the D044
 * screenshot edits, a resolved placeholder). Only the main session adds a row here, after it has
 * accepted that reason; every row names the decision or review that approved it. The specs print
 * every deviation they apply, so none is silent.
 */
import type { Page } from "@playwright/test";
import { HOSTS } from "@/config/env";
import { faqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { RETENTION_LINE } from "@/content/en-IN/policies";
import { product } from "@/content/en-IN/products/kheelu/product";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { toPlainText } from "@/lib/content/plain-text";
import { PAGE_FACTS, type FactEdit, type PageFacts, type PageFactsSlug } from "./page-facts";
import { sentences } from "./parity";

export type VisualDeviation = {
  /** Viewport name from viewports.ts, for example "phone-360x640". */
  viewport: string;
  /** Zero-based screen-height chunk index. */
  chunk: number;
  reason: string;
  /** Decision id or review that accepted it, for example "D050" or "QA review 2026-10-20". */
  approvedBy: string;
};

export type TextDeviation = {
  /** A sentence of the mockup that the build may show differently (or not at all). */
  mockup: RegExp;
  /** What the build shows instead, when it shows something. */
  build?: RegExp;
  /** The build differs only without JavaScript: with it on, the build must show the mockup's text as it is.
   *  no-js.spec.ts applies only such rules; text-parity.spec.ts (task 1.1's harness) applies every rule to both of
   *  its runs until it reads this flag (5.2 review; the main session's call). */
  jsOff?: true;
  reason: string;
  approvedBy: string;
};

/** An element the visual pass hides on one side before it measures, when a whole block is approved as absent or moved
 *  and every chunk below it would otherwise shift (SPA 1). Printed when applied, as every deviation. */
export type VisualHide = {
  /** The page the element is hidden on: the approved mockup or the build. */
  side: "mockup" | "build";
  selector: string;
  reason: string;
  approvedBy: string;
};

const literal = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
/** Matches a line that is exactly one of these sentences. */
const oneOf = (lines: readonly string[]) => new RegExp(`^(?:${lines.map(literal).join("|")})$`);
/* The build's words for the team and setup rules (V7, V8). Spelled here because Playwright cannot load those content
   modules (they import images); src/content/en-IN/pages/parity-deviations.test.ts holds each to its content module. */
/* The team page's resolved placeholders (V7 since task 6.6; D054 item 20): the founders' background lines, sentence by
   sentence, and the strip's names that show as text (the NVIDIA and nasscom marks carry theirs as alt text). */
export const TEAM_BIOS_BUILD = [
  "He is a Chartered Accountant with 15 years in finance and company-building.",
  "He was the first student at his family’s pre-school, in 1994.",
  "He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name.",
  "Over a decade in hardware, including years at Intel leading Thunderbolt 4 and 5 compliance, he took products from a blank page to certification.",
] as const;
export const TEAM_STRIP_BUILD = ["Karnataka Elevate", "Founders Inc"] as const;
export const TEAM_LEAD_BUILD = "Kheelona’s founders are parents in Bengaluru, building Kheelu: a screen-free plush toy that talks, for children aged 3 to 7.";
/* Step 2's light without a colour (V8, shrunk to the colour by D055 item 25: the button's place is the founder's and the
   mockup's own, so its title is the mockup's again). */
export const SETUP_STEP_BUILD = ["Hold it for 3 seconds, until its light starts pulsing."] as const;
/* The build's words for the privacy rule (V10): the B11 events of task 6.2 named in the policy, in the words the founder
   approved after Gate A (D054 item 10). Literals for the same reason; src/content/en-IN/legal/parity-deviations.test.ts
   holds them to privacy.ts. */
export const PRIVACY_B11_BUILD = [
  "Counts visits and the steps of a pre-order: starting the form, being asked to correct an answer (which answers, never what you typed), opening and closing the payment window, a payment that fails (with Razorpay’s code for why), paying, and saving your address.",
  "It is told the same steps of a pre-order as Google Analytics.",
] as const;
const PRIVACY_V10 = "deviations.md V10 (founder, D054 item 10, 2026-10-14; task 6.2)";
/* The card the hub no longer shows (V9): the 3-6-9-12 article left the journal after Gate A (D053), so the approved
   hub's second screen-time guide has no page and no module. Its words are spelled here because nothing in the build
   holds them any more; src/content/en-IN/stories/parity-deviations.test.ts holds them, and the row's selector, to the
   approved hub and to hub.ts. */
export const STORIES_REMOVED_CARD = {
  title: "The 3-6-9-12 rule, and other screen rules parents swear by",
  summary: "Where the 3-6-9-12 rule comes from, whether it holds up, and what the WHO, the IAP and the AAP say.",
  /** The card's row in the approved hub (stories.html fold 2): the screen-time topic's second guide. */
  selector: "section#screen-time .mk-guides > .kh-listitem:nth-child(2)",
} as const;
const STORIES_V9 = "deviations.md V9 (founder, D053, 2026-10-14; task 6.5)";

/** A page's accepted changes as one text rule: the sentences they change, as listed beside their edits (page-facts.ts's
 *  form; each page's parity-deviations unit test proves them exactly the ones the edits change). */
const factsRule = (facts: PageFacts): TextDeviation => ({
  /* Each line also in capitals: an eyebrow (kh-eyebrow) renders uppercase, and the browser's text reports it so
     ("SEVEN FILMS"; D057 item 2), while the unit tests read the words as written. */
  mockup: oneOf([...facts.mockup, ...facts.mockup.map((line) => line.toUpperCase())]),
  build: oneOf([...facts.build, ...facts.build.map((line) => line.toUpperCase())]),
  reason: facts.reason,
  approvedBy: facts.approvedBy,
});

/** The founder's page facts on one page (task 6.7; D055, D054 items 12 and 19): each placeholder he filled and each line
 *  he ruled off, the sentences listed in page-facts.ts. */
const pageFacts = (slug: PageFactsSlug): TextDeviation => factsRule(PAGE_FACTS[slug]);

/** The blocks a page's accepted changes touch, hidden for the pixels: on both sides where the words reflow, on the
 *  mockup's alone where a row or line came off (each page's parity-deviations test checks every selector finds one
 *  changed block on its side). Their words are compared by the text pass (factsRule, above). `whose` names the changes
 *  in the printed reason. */
const factsHidden = (facts: PageFacts, whose: string): VisualHide[] => {
  const { hidden, approvedBy } = facts;
  const rule = (side: VisualHide["side"], selector: string, reason: string): VisualHide => ({ side, selector, reason, approvedBy });
  return [
    ...(["mockup", "build"] as const).flatMap((side) =>
      hidden.both.map((selector) => rule(side, selector, `a block ${whose} reword, compared by the text pass`)),
    ),
    ...hidden.mockup.map((selector) => rule("mockup", selector, `a block ${whose} take off, or its approved form`)),
    ...hidden.build.map((selector) => rule("build", selector, `${whose} in a block the build words differently`)),
  ];
};
const pageFactsHidden = (slug: PageFactsSlug): VisualHide[] => factsHidden(PAGE_FACTS[slug], "the founder's page facts");

/* Task 7.1b's copy fixes (wiki/qa/deviations.md V9 as amended, V17-V21): approved lines the copy pages changed after the
   built-page reviews of 2026-10-14, the founder's answers (D056 items 2 and 4) and the CMO's findings (review A M4, M5,
   M6 and M8; review B m1), passed by the CMO's copy review (wiki/qa/cmo-review-copy-fixes-7.1b-2026-10-14.md). The
   founder signs each changed line at Gate B (D015). In page-facts.ts's form: `edits` turn the frozen mockup's elements
   into the build's (each route's unit test holds the build to the mockup with them applied, markup and words alike), and
   `mockup` and `build` are the sentences that differ, for the text pass (src/content/en-IN/pages/parity-deviations.test.ts
   proves them exactly the sentences the edits change). Literal, because Playwright cannot load every content module. */

/** An approved element whose words change in one place: its words with `from` swapped for `to` (plain text only). */
const swap = (at: string, was: string, from: string, to: string): FactEdit => {
  if (!was.includes(from)) throw new Error(`"${from}" is not in "${was}"`);
  return { at, was, now: was.replace(from, to), inner: true };
};
const NO_HIDES = { both: [], mockup: [], build: [] } as const;

/** The screen-time topic's line, on the hub and on Home's guide card: the 3-6-9-12 guide that answered "which rules hold
 *  up" left the journal (D053), so the line names what guide 1 gives (CMO review A M5, review B m1). */
const SCREEN_TIME_LEAD = {
  mockup: "How much, which rules hold up, and what to do when the screen goes off.",
  build: "How much, what the guidelines say, and what to do when the screen goes off.",
} as const;
/** The age-3 advice in one wording (CMO review A M8), the CMO's pick in the copy review of task 7.1b (minor 1): "If your
 *  child is 3, keep a grown-up nearby." on Home, /safety and /setup alike, and "keep a grown-up nearby." under /safety's
 *  "At 3:" lead. The longer "…while they play." would take three FAQ answers over the 60-word answer guard. */
const AGE_THREE_LINE = "If your child is 3, keep a grown-up nearby.";
const AGE_THREE = {
  home: { mockup: "For 3-year-olds, we advise having a grown-up nearby.", build: AGE_THREE_LINE },
  safety: { mockup: "If your child is 3, we advise play with a grown-up nearby.", build: AGE_THREE_LINE },
  safetyDetail: { mockup: "At 3: we advise play with a grown-up nearby.", build: "At 3: keep a grown-up nearby." },
  setup: { mockup: "If your child is 3, keep a grown-up nearby while they talk.", build: AGE_THREE_LINE },
  /* The product page's FAQ 3 and the buyer's guide's age answer, which review A M8 names too (main session at the wave 8
     merge, copy review 7.1b minor 2): the same sentence, 59 and 58 words. */
  product: { mockup: "At 3, play with a grown-up nearby.", build: AGE_THREE_LINE },
  guide: { mockup: "At 3, we advise play with a grown-up nearby.", build: AGE_THREE_LINE },
  /* /terms section 9 (the founder's answer, D057 item 3). */
  terms: { mockup: "For 3-year-olds, we advise having a grown-up nearby.", build: AGE_THREE_LINE },
} as const;
/** The two FAQ answers' approved words around the age-3 sentence (products/kheelu FAQ 3; the guide's "What age"). */
const PRODUCT_AGE_ANSWER = `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${AGE_THREE.product.mockup} When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.`;
const GUIDE_AGE_ANSWER = (age: string, safety: string) =>
  `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${age} You enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. What child-safety groups advise is on our ${safety}.`;
/** The refund after a return "reaches you within 7 working days", as /refund says it (D056 item 4; D055 item 5: bank
 *  time included). */
const REFUND_REACHES = { from: "your refund is processed within 7 working days", to: "your refund reaches you within 7 working days" } as const;
const HOME_REFUND = "Once it reaches us and qualifies for return, your refund is processed within 7 working days.";
const TERMS_REFUND = "Once your Kheelu reaches us and qualifies for return, your refund is processed within 7 working days.";
/** The product page's films heading without a count of families and without "in their own homes" (D056 item 2, then
 *  D057 item 2: not every film was shot at home), its eyebrow the films' count (D040), and its sources line in Home's
 *  short form (A M6). */
const FILMS_EYEBROW = { mockup: "Real homes", build: "Seven films" } as const;
const FILMS_TITLE = { mockup: "Seven families, in their own homes.", build: "Real children, real families." } as const;
const HARVARD_URL = "https://developingchild.harvard.edu/key-concept/serve-and-return/";
const HARVARD_LABEL = "developingchild.harvard.edu/key-concept/serve-and-return";
const HARVARD = "Sources [1] Center on the Developing Child at Harvard University, “Serve and Return” (Key Concepts)";
const HARVARD_LOCATOR = ", undated (page metadata 2024, updated 2026), Key Takeaways and the paragraph after Fast Facts";

export const COPY_FIXES = {
  stories: {
    edits: [swap("#screen-time .kh-heading__lead", SCREEN_TIME_LEAD.mockup, SCREEN_TIME_LEAD.mockup, SCREEN_TIME_LEAD.build)],
    mockup: [SCREEN_TIME_LEAD.mockup],
    build: [SCREEN_TIME_LEAD.build],
    /* At 360 the new line takes one more line and moves every topic below it. */
    hidden: { both: ["#screen-time .kh-heading__lead"], mockup: [], build: [] },
    reason: "the screen-time topic's line names what its guides give, now that the 3-6-9-12 guide has left (D053; CMO A M5, B m1)",
    approvedBy: "deviations.md V9, amended (CMO built-page reviews A M5 and B m1, 2026-10-14; copy review 7.1b; task 7.1b)",
  },
  home: {
    edits: [
      swap(".kh-card__body", SCREEN_TIME_LEAD.mockup, SCREEN_TIME_LEAD.mockup, SCREEN_TIME_LEAD.build),
      swap(
        ".kh-faq__a > p",
        "Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. For 3-year-olds, we advise having a grown-up nearby. When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.",
        AGE_THREE.home.mockup,
        AGE_THREE.home.build,
      ),
      swap(
        ".kh-faq__a > p",
        `Return it within 7 days of delivery, no questions asked. Opened is fine: just send back everything that came in the box, undamaged. We arrange the pickup, free. ${HOME_REFUND} Until we dispatch it, everything you’ve paid is refundable in full.`,
        REFUND_REACHES.from,
        REFUND_REACHES.to,
      ),
    ],
    mockup: [SCREEN_TIME_LEAD.mockup, AGE_THREE.home.mockup, HOME_REFUND],
    build: [SCREEN_TIME_LEAD.build, AGE_THREE.home.build, HOME_REFUND.replace(REFUND_REACHES.from, REFUND_REACHES.to)],
    /* The card's line takes one more line at 360 and moves the folds below; the two answers sit in closed items. */
    hidden: { both: ['section[aria-labelledby="guides-title"] .kh-card:first-child .kh-card__body'], mockup: [], build: [] },
    reason: "Home's screen-time guide card and two FAQ answers: the topic's line (CMO A M5), the age-3 advice in one wording (A M8), the refund timing as /refund words it (D056 item 4)",
    approvedBy: "deviations.md V18 (founder, D056 item 4, 2026-10-14; CMO built-page review A M5 and M8; copy review 7.1b; task 7.1b)",
  },
  "meet-kheelu": {
    edits: [
      { at: ".kh-eyebrow", was: FILMS_EYEBROW.mockup, now: FILMS_EYEBROW.build, inner: true },
      { at: "#films-title", was: FILMS_TITLE.mockup, now: 'Real children, <span class="kh-hand">real families.</span>', inner: true },
      {
        at: "#src-1",
        was: `${HARVARD}${HARVARD_LOCATOR}. ${HARVARD_LABEL}`,
        now: `${HARVARD.replace("Sources", "<strong>Sources</strong>")}. <a href="${HARVARD_URL}">${HARVARD_LABEL}</a>`,
        inner: true,
      },
      swap(".kh-faq__a > p", PRODUCT_AGE_ANSWER, AGE_THREE.product.mockup, AGE_THREE.product.build),
    ],
    mockup: [FILMS_EYEBROW.mockup, FILMS_TITLE.mockup, AGE_THREE.product.mockup, `${HARVARD}${HARVARD_LOCATOR}. ${HARVARD_LABEL}`],
    build: [FILMS_EYEBROW.build, FILMS_TITLE.build, AGE_THREE.product.build, `${HARVARD}. ${HARVARD_LABEL}`],
    /* The films heading is shorter and wraps to fewer lines on a phone, and the short sources line is one or two lines
       shorter at every width: each moves the folds below it. FAQ 3 sits in a closed item. */
    hidden: { both: ["#films-title", "#src-1"], mockup: [], build: [] },
    reason: "the films heading claims no count of families and no place (D056 item 2, D057 item 2) under the films' count, the sources line is Home's short form (CMO A M6), and FAQ 3 gives the age-3 advice in one wording (A M8)",
    approvedBy: "deviations.md V17 (founder, D056 item 2 and D057 item 2, 2026-10-14; CMO built-page review A M6; copy review 7.1b; task 7.1b)",
  },
  safety: {
    edits: [
      {
        at: ".kh-faq__a > p",
        was: `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${AGE_THREE.safety.mockup} Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, follow below.`,
        now: `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${AGE_THREE.safety.build} Common Sense Media advises against AI toys at this age. Its advice in full, and our answer, are in the next question.`,
        inner: true,
      },
      { at: ".kh-faq__a li", was: AGE_THREE.safetyDetail.mockup, now: `<strong>At 3:</strong> ${AGE_THREE.safetyDetail.build.replace("At 3: ", "")}`, inner: true },
    ],
    mockup: [AGE_THREE.safety.mockup, "Its advice in full, and our answer, follow below.", AGE_THREE.safetyDetail.mockup],
    build: [AGE_THREE.safety.build, "Its advice in full, and our answer, are in the next question.", AGE_THREE.safetyDetail.build],
    /* At 390 the open answer takes one line less and moves the fold below it; the "At 3:" line sits in a closed item. */
    hidden: { both: ['[aria-labelledby="faq-title"] .kh-faq__item:first-child .kh-faq__a > p'], mockup: [], build: [] },
    reason: "the FAQ's age-3 advice in one wording (CMO A M8), and the open answer points to the next question, which is closed (A M4)",
    approvedBy: "deviations.md V19 (CMO built-page review A M4 and M8, 2026-10-14; copy review 7.1b; task 7.1b)",
  },
  setup: {
    edits: [swap("p.kh-body-l", `Kheelu is made for children aged 3 to 7. ${AGE_THREE.setup.mockup}`, AGE_THREE.setup.mockup, AGE_THREE.setup.build)],
    mockup: [AGE_THREE.setup.mockup],
    build: [AGE_THREE.setup.build],
    /* At 390 the line takes one line less and moves the folds below it. */
    hidden: { both: ['[aria-labelledby="age-title"] .kh-body-l:nth-child(3)'], mockup: [], build: [] },
    reason: "the age-3 advice in one wording (CMO A M8)",
    approvedBy: "deviations.md V20 (CMO built-page review A M8, 2026-10-14; copy review 7.1b; task 7.1b)",
  },
  terms: {
    edits: [
      swap(
        "p",
        `We arrange the pickup, free, for returns we accept, faulty units and warranty claims. ${TERMS_REFUND}`,
        REFUND_REACHES.from,
        REFUND_REACHES.to,
      ),
      swap("p", `Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. ${AGE_THREE.terms.mockup}`, AGE_THREE.terms.mockup, AGE_THREE.terms.build),
    ],
    mockup: [TERMS_REFUND, AGE_THREE.terms.mockup],
    build: [TERMS_REFUND.replace(REFUND_REACHES.from, REFUND_REACHES.to), AGE_THREE.terms.build],
    hidden: NO_HIDES,
    reason: "section 8's refund timing as /refund words it (D056 item 4; D055 item 5), and section 9's age-3 advice in the site's one wording (D057 item 3)",
    approvedBy: "deviations.md V21 (founder, D056 item 4 and D057 item 3, 2026-10-14; task 7.1b)",
  },
  "ai-toys-for-kids-in-india": {
    edits: [
      {
        at: ".kh-faq__a > p",
        was: GUIDE_AGE_ANSWER(AGE_THREE.guide.mockup, "safety page"),
        now: GUIDE_AGE_ANSWER(AGE_THREE.guide.build, '<a href="safety.html">safety page</a>'),
        inner: true,
      },
    ],
    mockup: [AGE_THREE.guide.mockup],
    build: [AGE_THREE.guide.build],
    /* The answer sits in a closed item. */
    hidden: NO_HIDES,
    reason: "the FAQ's age-3 advice in one wording (CMO A M8)",
    approvedBy: "deviations.md V22 (CMO built-page review A M8, 2026-10-14; copy review 7.1b, minor 2; wave 8 merge)",
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type CopyFixesSlug = keyof typeof COPY_FIXES;
const COPY_FIXES_WHOSE = "task 7.1b's copy fixes";

/** A route whose own parity runs would compare a state its mockup does not show, with the spec that proves that
 *  state's parity instead. The visual and text parity specs skip the route on the build and print why (SPA 1 and 2). */
export type ParityElsewhere = {
  reason: string;
  /** The spec that compares the mockup's state with the build. */
  provedBy: string;
  approvedBy: string;
};

export const PARITY_ELSEWHERE: Readonly<Record<string, ParityElsewhere>> = {
  "store-confirmation": {
    reason:
      "the route opens /thanks with no order, which shows the link-needed state; the mockup is the paid state, which needs a real order (never placed; checkout logic frozen, ADR-013)",
    provedBy: "test/e2e/thanks-paid.spec.ts (the paid-state story in the store chrome against store-confirmation.html at 360, 390 and 1440; task 4.8 item 3)",
    approvedBy: "deviations.md V5 (main session, 2026-10-14; the route's parity runs ruled skipped at the wave 5 part C merge)",
  },
};

/** Skips the calling parity spec's describe block on the build when its route's parity is proved elsewhere, and says
 *  where. The mockup self-test (calibration) still runs it. */
export function parityElsewhere(slug: string, spec: string): string | undefined {
  const rule = PARITY_ELSEWHERE[slug];
  return rule && `${spec}: ${slug} is proved by ${rule.provedBy} (${rule.approvedBy}): ${rule.reason}`;
}

/* Task 8b.2a's claim fixes on the approved articles: the founder's D058 (2026-10-14) has the site follow the live team's
   code check of 12 October (origin/main c630a49, #19), so the safe-AI-toy guide's fold 5 takes the code-checked words:
   "a couple of minutes of quiet", no place on the providers line, deletion by deleting the account after the retention
   line, replies generated by an AI model given child-safety rules and the age, with Google's safety filters on top, and
   no "Tested by us first" item. Its copy page carries each changed line ("Changes after approval (task 8b.2a)"), passed by
   the CMO's review (wiki/qa/cmo-review-guides-d058-8b.2a-2026-10-14.md); the founder signs them at Gate B (D015). The
   other two approved articles say none of the withdrawn claims. In page-facts.ts's form: `edits` turn the frozen
   mockup's facts into the build's (approved-articles.test.tsx holds the reading column to the mockup with them applied,
   markup and words alike), and `mockup` and `build` are the sentences they change, for the text pass (the same test
   proves them exactly those). The retention line is policies.ts's (task 8b.1 owns its words), so the sentences it
   changes are read from it. */

/** The retention line as the frozen mockup prints it (policies.ts RETENTION_LINE at Gate A, D020). */
const APPROVED_RETENTION =
  "Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically. You can delete any of them sooner, in one tap.";
/** The sentences of `lines` that `not` lacks, in order. */
const sentencesBeyond = (lines: string, not: string) => sentences(lines).filter((line) => !sentences(not).includes(line));
/** One of the article's facts (TrustList `facts`): its bold lead-in, then the body. */
const factBody = (title: string, body: string) => `<strong class="kh-label">${title}</strong> ${body}`;
/** A fact whose body the fixes reword: found by its words, its lead-in kept. */
const refact = (title: string, was: string, now: string): FactEdit => ({ at: ".kh-trust__body", was: `${title} ${was}`, now: factBody(title, now), inner: true });

const SAFE_AI_TOY_FACTS = {
  microphone:
    "It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it’s listening. It switches itself off after about a minute of quiet. Kheelu has no camera.",
  voice:
    "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.",
  internet: {
    kept: "Kheelu can’t browse the internet.",
    was: "Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app.",
    now: [
      "Its answers are generated by an AI model.",
      "On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
    ],
  },
  tested: ["Tested by us first.", "We attack our own safety layer before every release."],
} as const;
const READ_EVERY = "You can read every conversation in the parent app.";
const DELETE_BY_ACCOUNT = "Delete them all sooner by deleting your account.";
const QUIET_D058 = { from: "about a minute of quiet", to: "a couple of minutes of quiet" } as const;
const PLACE_D058 = ", on servers in India";
const firstSentenceWith = (text: string, part: string) => sentences(text).find((line) => line.includes(part))!;
/** The safe-AI-toy guide's facts list, as the visual pass names its items on both pages. */
const safeAiToyFact = (n: number) => `.kh-trust > .kh-trust__item:nth-child(${n})`;

export const ARTICLE_CLAIM_FIXES = {
  "story-what-to-look-for-in-a-safe-ai-toy": {
    edits: [
      refact("The microphone.", SAFE_AI_TOY_FACTS.microphone, SAFE_AI_TOY_FACTS.microphone.replace(QUIET_D058.from, QUIET_D058.to)),
      refact("Your child’s voice.", SAFE_AI_TOY_FACTS.voice, SAFE_AI_TOY_FACTS.voice.replace(PLACE_D058, "")),
      refact("Every conversation.", `${READ_EVERY} ${APPROVED_RETENTION}`, `${READ_EVERY} ${RETENTION_LINE} ${DELETE_BY_ACCOUNT}`),
      refact(
        "No open internet.",
        `${SAFE_AI_TOY_FACTS.internet.kept} ${SAFE_AI_TOY_FACTS.internet.was}`,
        [SAFE_AI_TOY_FACTS.internet.kept, ...SAFE_AI_TOY_FACTS.internet.now].join(" "),
      ),
      { at: ".kh-trust__body", was: SAFE_AI_TOY_FACTS.tested.join(" "), scope: ".kh-trust__item", now: null },
    ],
    mockup: [
      firstSentenceWith(SAFE_AI_TOY_FACTS.microphone, QUIET_D058.from),
      firstSentenceWith(SAFE_AI_TOY_FACTS.voice, PLACE_D058),
      ...sentencesBeyond(APPROVED_RETENTION, RETENTION_LINE),
      SAFE_AI_TOY_FACTS.internet.was,
      ...SAFE_AI_TOY_FACTS.tested,
    ],
    build: [
      firstSentenceWith(SAFE_AI_TOY_FACTS.microphone, QUIET_D058.from).replace(QUIET_D058.from, QUIET_D058.to),
      firstSentenceWith(SAFE_AI_TOY_FACTS.voice, PLACE_D058).replace(PLACE_D058, ""),
      ...sentencesBeyond(RETENTION_LINE, APPROVED_RETENTION),
      DELETE_BY_ACCOUNT,
      ...SAFE_AI_TOY_FACTS.internet.now,
    ],
    /* The four reworded facts wrap to other heights on both sides (each moves every fact below it, and from 1200 px its
       row); the fact that came off is hidden on the mockup's side, so the two lists hold the same items in the same
       cells. */
    hidden: { both: [1, 2, 3, 5].map((n) => `${safeAiToyFact(n)} > .kh-trust__body`), mockup: [safeAiToyFact(8)], build: [] },
    reason:
      "the guide's facts in the live team's code-checked words (D058): a couple of minutes of quiet, no place on the providers line, deletion by deleting the account, replies generated by an AI model with child-safety rules and Google's safety filters; the \"Tested by us first\" fact comes off",
    approvedBy:
      "founder, D058 (2026-10-14; story-what-to-look-for-in-a-safe-ai-toy.md, \"Changes after approval (task 8b.2a)\"; CMO review cmo-review-guides-d058-8b.2a-2026-10-14.md passed; task 8b.2a)",
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
const ARTICLE_CLAIM_FIXES_WHOSE = "task 8b.2a's claim fixes (D058)";

export const VISUAL_DEVIATIONS: Readonly<Record<string, readonly VisualDeviation[]>> = {};

/* D042's payments line (wiki/qa/deviations.md V1): both store mockups print it in the store footer; the build prints it
   as the last line of main, because the store layout's policy links are a frozen checkout contract. The pixels compare
   both pages without it, on both sides, so the footer chunk lines up (with the build's line alone hidden, the mockup's
   footer stays one line taller and the last chunk of each phone width differed by 6 to 8 percent); the line itself is
   compared element by element with each mockup's footer line in StorePaymentsLine.test.tsx, and its words by the text
   pass (paymentsMoved, below). */
const PAYMENTS_V1 = "deviations.md V1 (main session, 2026-10-13, wave-3 close; extended to /thanks at the wave 5 part B2 merge; task 4.8)";
const paymentsHidden: readonly VisualHide[] = [
  {
    side: "mockup",
    selector: 'footer p:has(> a[href$="#chargeback"])',
    reason: "the mockup's payments line, in its store footer, which the build's footer cannot carry (its policy links are a frozen checkout contract)",
    approvedBy: PAYMENTS_V1,
  },
  {
    side: "build",
    selector: ".ks-store-payments",
    reason: "the build's payments line, moved from the store footer to the end of main (the footer's policy links are a frozen checkout contract)",
    approvedBy: PAYMENTS_V1,
  },
];

const TEAM_V7 = "deviations.md V7 (main session, 2026-10-14, M1; task 5.7, CMO M-T1; task 6.6, D054 item 20)";
/** One element per side: the mockup's selector, then the build's. */
const bothSides = (mockup: string, build: string, reason: string): VisualHide[] => [
  { side: "mockup", selector: mockup, reason, approvedBy: TEAM_V7 },
  { side: "build", selector: build, reason, approvedBy: TEAM_V7 },
];

/* The in-app browser note ships switched on (D056 item 3, task 7.1c; deviation V4, "built but off", retired). It shows
   only inside the Instagram, Facebook or WhatsApp browser, and the parity browser is plain Chromium, so the build there
   shows no fold 2, as a parent in Chrome or Safari sees it; the mockup prints it as an example (store.md fold 2). */
const IN_APP_ONLY = "deviations.md V25, D056 item 3 (founder, 2026-10-14; task 7.1c): the note ships, shown only in the in-app browsers";
const IN_APP_REASON =
  "the in-app browser note (fold 2) shows only inside the Instagram, Facebook or WhatsApp browser, and the parity browser is plain Chromium, so the build shows no fold 2";

export const VISUAL_HIDDEN: Readonly<Record<string, readonly VisualHide[]>> = {
  store: [
    {
      /* Every chunk below the first screen would move up by the note's height (without these hides the store is 3 to 5
         percent shorter than the mockup at the three widths, task 4.8). */
      side: "mockup",
      selector: ".mk-inapp",
      reason: IN_APP_REASON,
      approvedBy: IN_APP_ONLY,
    },
    ...paymentsHidden,
  ],
  "store-confirmation": paymentsHidden,
  /* The safe-AI-toy guide's reworded facts and the one that came off (task 8b.2a, D058), compared by the text pass. */
  "story-what-to-look-for-in-a-safe-ai-toy": factsHidden(ARTICLE_CLAIM_FIXES["story-what-to-look-for-in-a-safe-ai-toy"], ARTICLE_CLAIM_FIXES_WHOSE),
  /* The 3-6-9-12 card (V9) is hidden in the approved hub, so its screen-time topic lists the build's five guides in the
     build's order and every fold below it lines up. The mockup alone: hidden there, the topic's rows reflow into the
     build's grid (two columns from 900 px), and the build has nothing of the card to hide. */
  stories: [
    {
      side: "mockup",
      selector: STORIES_REMOVED_CARD.selector,
      reason: "the 3-6-9-12 guide left the journal (D053), so its card left the screen-time topic",
      approvedBy: STORIES_V9,
    },
    /* The topic's line (V9 as amended in task 7.1b), compared by the text pass. */
    ...factsHidden(COPY_FIXES.stories, COPY_FIXES_WHOSE),
  ],
  /* The screen-time guide card's line (V18, task 7.1b), compared by the text pass. */
  home: factsHidden(COPY_FIXES.home, COPY_FIXES_WHOSE),
  /* The open FAQ answer (V19, task 7.1b), compared by the text pass. */
  safety: factsHidden(COPY_FIXES.safety, COPY_FIXES_WHOSE),
  team: [
    /* What still differs on purpose (V7): the hero lead (CMO M-T1), and the mockup's placeholders that the founder's
       answers resolved (D054 item 20), each with other words or another height on the build's side, so every chunk
       below would shift. The pixels compare the page without them on both sides: fold 3's cards as name, role, words
       and link, fold 5 as its heading. Their words are compared by the text pass (TEXT_DEVIATIONS), their markup and
       files by the unit tests (team.test.ts, the team route's page.test.tsx, FoundersSection and RecognitionStrip). */
    /* The lead wraps to a different number of lines on phones. */
    ...bothSides("#hero-title ~ .kh-heading__lead", "#hero-title ~ .kh-heading__lead", "the hero lead (CMO fix M-T1 in the build), compared by the text pass; hidden on both sides so the chunks below line up"),
    ...bothSides(
      ".mk-founder__head .kh-avatar",
      ".ks-founder__head .kh-avatar",
      "each founder's badge: initials in the mockup (B24's placeholder), the live photo in the build (D054 item 20); the same box, other pixels",
    ),
    {
      side: "mockup",
      selector: ".mk-founder__photo",
      reason: "the mockup's B24 photo placeholder line under each founder's name; the build shows the photo in the badge instead (D054 item 20)",
      approvedBy: TEAM_V7,
    },
    ...bothSides(
      ".mk-founder__bg",
      ".ks-founder__bg",
      "each founder's background line: the F11 placeholder in the mockup, the live bio's line in the build (D054 item 20); they wrap to different heights",
    ),
    ...bothSides(
      "#recognised-title ~ .kh-body",
      "#recognised-title ~ .ks-recognition",
      "fold 5's line: the F11 placeholder in the mockup, the live strip of marks and names in the build (D054 item 20); the heading is compared",
    ),
    ...bothSides(
      ".kh-quote__avatar",
      ".kh-quote__who .kh-avatar",
      "the quote's badge (fold 4): the AS initials in the mockup, Apoorva's live photo in the build (task 7.1a, CMO built-page review A, M10); the same 48 px box, other pixels",
    ),
  ],
  setup: [
    ...(["mockup", "build"] as const).map((side) => ({
      /* Step 2 is CMO fix M-S1 in the build (its light without a colour, V8), so it may wrap differently and move every
         step below it; the pixels compare the page without step 2 on both sides, and its words are compared by the text
         pass (TEXT_DEVIATIONS). */
      side,
      selector: ".kh-steps > .kh-step:nth-child(2)",
      reason: "step 2 (CMO fix M-S1 in the build: its light without a colour), compared by the text pass; hidden on both sides so the steps below line up",
      approvedBy: "deviations.md V8 (main session, 2026-10-14, M1; task 5.8, CMO M-S1)",
    })),
    ...pageFactsHidden("setup"),
    /* Fold 4's age line (V20, task 7.1b), compared by the text pass. */
    ...factsHidden(COPY_FIXES.setup, COPY_FIXES_WHOSE),
  ],
  "meet-kheelu": [
    ...pageFactsHidden("meet-kheelu"),
    /* The sources line (V17, task 7.1b), compared by the text pass. */
    ...factsHidden(COPY_FIXES["meet-kheelu"], COPY_FIXES_WHOSE),
  ],
  /* The Google Analytics block's paragraph and the PostHog block's first one say more in the build (V10), so they wrap
     to more lines and every block below would shift; the pixels compare the page without the two paragraphs on both
     sides, and their words are compared by the text pass (TEXT_DEVIATIONS). Third and sixth tools, as privacy.ts
     and the mockup order them (parity-deviations.test.ts checks the headings). */
  privacy: [
    ...(["mockup", "build"] as const).flatMap((side) => {
      const tool = side === "mockup" ? "mk-tool" : "ks-tool";
      return [`.${tool}s > .${tool}:nth-child(3) > p`, `.${tool}s > .${tool}:nth-child(6) > p:first-of-type`].map((selector) => ({
        side,
        selector,
        reason: "the Google Analytics and PostHog paragraphs name the B11 events (D054 item 10), compared by the text pass; hidden on both sides so the blocks below line up",
        approvedBy: PRIVACY_V10,
      }));
    }),
    ...pageFactsHidden("privacy"),
  ],
  refund: pageFactsHidden("refund"),
  shipping: pageFactsHidden("shipping"),
  terms: pageFactsHidden("terms"),
};

/* The tap areas (task 7.1a; CMO built-page review A, B1): wherever a help line sits right under a trust line, the build
   spaces it --space-5 below (two 12 px tap extensions, so a tap on "7-day returns" no longer opens WhatsApp or a call),
   where the approved mockup has it --space-2 below in the CTA groups, flush in the heroes and Home's close, --space-4 in
   the offer column and the journal close (mockup.css:26-31, meet-kheelu.css, stories.css:45; the mockup is frozen, D046,
   and keeps the defect). Every chunk below each such help line would shift, on every page that sells, so the pixels
   compare the pages without those help lines, on both sides: the trust line and everything else line up again. Their
   words are compared by the text pass; their markup by HelpLine's and the sections' unit tests; the taps by
   test/e2e/tap-areas.spec.ts. One shared rule for every page (the main session's ruling for 7.1a), applied before each
   page's own (visualHidden), never a row per page key. */
const TAP_AREAS = "deviations.md V23 (main session; task 7.1a, CMO built-page review A B1, 2026-10-14)";
export const TAP_AREA_HIDDEN: readonly VisualHide[] = [
  {
    side: "mockup",
    selector: ".mk-trust + .mk-help, .mk-beside + .mk-help",
    reason: "a help line right under a trust line: --space-5 below it in the build (two tap extensions), less in the mockup; compared by the text pass",
    approvedBy: TAP_AREAS,
  },
  {
    side: "build",
    selector: ".ks-trust + .ks-help, .ks-beside + .ks-help",
    reason: "a help line right under a trust line, --space-5 below it (two tap extensions, task 7.1a); compared by the text pass",
    approvedBy: TAP_AREAS,
  },
];

/** Every rule the visual pass applies to one page: the rules every page shares (TAP_AREA_HIDDEN), then the page's own. */
export function visualHidden(slug: string): readonly VisualHide[] {
  return [...TAP_AREA_HIDDEN, ...(VISUAL_HIDDEN[slug] ?? [])];
}

const hidingStyle = (rules: readonly VisualHide[], side: VisualHide["side"]): string => {
  const selectors = rules.filter((rule) => rule.side === side).map((rule) => rule.selector);
  return selectors.length ? `${selectors.join(", ")} { display: none !important; }` : "";
};

/** The style of the rules every page shares (TAP_AREA_HIDDEN) on one side. */
export function sharedHiddenCss(side: VisualHide["side"]): string {
  return hidingStyle(TAP_AREA_HIDDEN, side);
}

/** The style the visual pass adds to one side of a page's comparison for the page's own rules: its hidden selectors, or
 *  "" when it has none. */
export function hiddenCss(slug: string, side: VisualHide["side"]): string {
  return hidingStyle(VISUAL_HIDDEN[slug] ?? [], side);
}

/** Hides one side's approved elements on the page (before it is settled and measured): the rules every page shares,
 *  then the page's own, each as a style of its own; prints each rule it applies under `label`, the calling spec's name
 *  ("visual-parity", "thanks-paid"; task 4.9 item 6). */
export async function hideDeviations(page: Page, slug: string, side: VisualHide["side"], label: string): Promise<void> {
  for (const css of [sharedHiddenCss(side), hiddenCss(slug, side)]) if (css) await page.addStyleTag({ content: css });
  for (const rule of visualHidden(slug).filter((r) => r.side === side)) {
    console.log(`[${label}] ${slug}: ${rule.selector} hidden in the ${side} (${rule.approvedBy}): ${rule.reason}`);
  }
}

const PAYMENTS_WORDS = sentences(`${paymentsLine.text} ${paymentsLine.link.label}`);
const paymentsMoved: TextDeviation = {
  /* The mockups' main lacks the line (it is in their footer), so this side matches nothing there; the build's main has
     the line's words and, on a line of its own, the link's new-tab note (an absolutely positioned visually hidden span).
     The note stays out of the mockup side: the store's trust links carry it too, and one going missing is a defect. */
  mockup: oneOf(PAYMENTS_WORDS),
  build: oneOf([...PAYMENTS_WORDS, navigation.labels.newTabNote.trim()]),
  reason: "the payments line moved from the store footer to the last line of main (the footer's policy links are a frozen checkout contract)",
  approvedBy: PAYMENTS_V1,
};

export const TEXT_DEVIATIONS: Readonly<Record<string, readonly TextDeviation[]>> = {
  store: [
    {
      /* The in-app browser note's lines as the mockup prints them (store.html fold 2), read from in-app-note.ts with the
         production store's address the mockup shows, so the rule follows the content. */
      mockup: oneOf([
        ...sentences(inAppNote.title),
        ...sentences(`${inAppNote.body} ${HOSTS.production.store}`),
        inAppNote.copyLabel,
      ]),
      reason: `${IN_APP_REASON}: its lines are missing`,
      approvedBy: IN_APP_ONLY,
    },
    paymentsMoved,
  ],
  "store-confirmation": [paymentsMoved],
  /* The safe-AI-toy guide's facts in the code-checked words (task 8b.2a, D058): ARTICLE_CLAIM_FIXES above. */
  "story-what-to-look-for-in-a-safe-ai-toy": [factsRule(ARTICLE_CLAIM_FIXES["story-what-to-look-for-in-a-safe-ai-toy"])],
  stories: [
    {
      /* The 3-6-9-12 card's title and summary (stories.html fold 2), missing from the build; nothing replaces them. */
      mockup: oneOf(sentences(`${STORIES_REMOVED_CARD.title}\n${STORIES_REMOVED_CARD.summary}`)),
      reason: "the 3-6-9-12 guide left the journal (D053), so its card left the screen-time topic",
      approvedBy: STORIES_V9,
    },
    /* The screen-time topic's line (V9 as amended in task 7.1b): COPY_FIXES above. */
    factsRule(COPY_FIXES.stories),
  ],
  /* The screen-time guide card's line and two FAQ answers (V18, task 7.1b): COPY_FIXES above. The answers sit in closed
     items, which the text pass does not read; Home's unit test holds them. */
  home: [factsRule(COPY_FIXES.home)],
  "meet-kheelu": [
    {
      /* The product details fold without JavaScript (wiki/qa/deviations.md V3): the tab row stays hidden and the three
         panels stack under their headings, so against the approved (tabbed) text the build lacks the tab label "Specs"
         (the panel's heading stays) and adds the In the box and Safety panels' lines. With JavaScript on, the build's
         tabs hide panels 2 and 3 as the mockup's do, so no difference is accepted there (jsOff). Applied by
         text-parity.spec.ts and, for the build's own JavaScript-on and -off texts, by no-js.spec.ts. */
      mockup: /^Specs$/,
      /* Every sentence of the In the box and Safety panels as the page prints them (product.ts, placeholders as their
         markers), so the rule follows the founder's F4 answers instead of retyping today's lines. */
      build: oneOf([...product.box, ...product.safety].flatMap(({ text }) => sentences(toPlainText(text)))),
      jsOff: true,
      reason: "details fold without JavaScript: the tab row hidden, the three panels stacked (the approved tabs with JavaScript; P1, N21 corrected)",
      approvedBy: "deviations.md V3 (main session, 2026-10-13; task 5.2)",
    },
    {
      /* P15's default (open questions §P; task 4.7 item 4): the shared FAQ answer "What if it isn’t right for us, or stops
         working?" (faqs.ts returns-and-warranty, fold 8) gives D033's remedy for a faulty Kheelu, as /refund does. The
         approved sentence (meet-kheelu.html:357) and the build's, read from faqs.ts so the rule follows the content. Both
         runs: the answer is the same with JavaScript on and off. */
      mockup: /^Tell us within 7 days and we replace it\.$/,
      build: oneOf(sentences(toPlainText(faqs["returns-and-warranty"].answer)).filter((s) => s.startsWith("Tell us within"))),
      reason: "P15 default: a faulty Kheelu reported within 7 days gets a replacement or a full refund (D033, Rule 7(4)), the words of /refund",
      approvedBy: "deviations.md V6 (main session; task 4.7 item 4, P15 default)",
    },
    pageFacts("meet-kheelu"),
    /* The films heading and the sources line (V17, task 7.1b): COPY_FIXES above. */
    factsRule(COPY_FIXES["meet-kheelu"]),
  ],
  /* The open FAQ answer and the closed one's "At 3:" line (V19, task 7.1b): COPY_FIXES above. */
  safety: [factsRule(COPY_FIXES.safety)],
  /* The age answer's "At 3" sentence (V22, wave 8 merge): COPY_FIXES above. It sits in a closed item, which the text
     pass does not read; the route's unit test holds it. */
  "ai-toys-for-kids-in-india": [factsRule(COPY_FIXES["ai-toys-for-kids-in-india"])],
  team: [
    {
      /* CMO fix M-T1 (task 5.7): the hero lead says what Kheelu is, for whom, and the search term (team.ts). */
      mockup: /^Kheelu is designed by parents in Bengaluru\.$/,
      build: oneOf([TEAM_LEAD_BUILD]),
      reason: "CMO fix M-T1: the hero lead names the product, the age band and the search term",
      approvedBy: TEAM_V7,
    },
    {
      /* The placeholders the founder's answers resolved (D054 item 20): the photos (B24), the three founders'
         backgrounds and fold 5's programmes (F11). The build shows the photos without words, the background lines and
         the strip's two names as text. */
      mockup: /^\[PLACEHOLDER (?:B24: founder photo|F11: .+)\]$/,
      build: oneOf([...TEAM_BIOS_BUILD, ...TEAM_STRIP_BUILD]),
      reason: "resolved placeholders: the founders' photos, background lines and the recognition strip, as live (D054 item 20)",
      approvedBy: TEAM_V7,
    },
    {
      /* Each initials badge reads as a line of its own; the build's badges hold the photos: the founders' three (D054
         item 20) and, since task 7.1a, the quote's "AS" (fold 4; CMO built-page review A, M10). The V7 unit test holds
         the build to no badge with words, so the rule covers exactly those four. */
      mockup: /^(?:AS|KC)$/,
      reason: "the initials badges, replaced by the live photos: the founders' (D054 item 20; B24) and the quote's (task 7.1a, CMO M10)",
      approvedBy: TEAM_V7,
    },
  ],
  setup: [
    {
      /* CMO fix M-S1 (task 5.8): step 2's light names no colour (the app's own screen bracketed it). Since D055 item 25
         the button's place is the founder's, the mockup's own words, so only the colour differs (setup.ts). */
      mockup: oneOf(["Hold it for 3 seconds, until the light starts pulsing blue."]),
      build: oneOf(SETUP_STEP_BUILD),
      reason: "CMO fix M-S1: no unconfirmed colour for the setup button's light (its place confirmed by D055 item 25)",
      approvedBy: "deviations.md V8 (main session, 2026-10-14, M1; task 5.8; shrunk to the colour by D055 item 25, task 6.7)",
    },
    pageFacts("setup"),
    /* Fold 4's age-3 line (V20, task 7.1b): COPY_FIXES above. */
    factsRule(COPY_FIXES.setup),
  ],
  privacy: [
    {
      /* The three new checkout events (B11, task 6.2): the Google Analytics block's first sentence names the two new
         steps a parent can meet, and the PostHog block gains one sentence (it has no counterpart in the mockup). */
      mockup: /^Counts visits and the steps of a pre-order: starting the form, opening and closing the payment window, paying, and saving your address\.$/,
      build: oneOf(PRIVACY_B11_BUILD),
      reason: "the three new checkout events (B11) named in the policy, in the words the founder approved (D054 item 10)",
      approvedBy: PRIVACY_V10,
    },
    pageFacts("privacy"),
  ],
  refund: [pageFacts("refund")],
  shipping: [pageFacts("shipping")],
  /* Section 8's refund timing (V21, task 7.1b): COPY_FIXES above. */
  terms: [pageFacts("terms"), factsRule(COPY_FIXES.terms)],
};
