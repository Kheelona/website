/* Approved deviations from the mockup (tasks.md SPA 1 and 2).
 *
 * A page task that exceeds the parity tolerance lists each exceeding chunk or text difference in
 * its report with the reason (a founder decision after Gate A, a corrected defect, the D044
 * screenshot edits, a resolved placeholder). Only the main session adds a row here, after it has
 * accepted that reason; every row names the decision or review that approved it. The specs print
 * every deviation they apply, so none is silent.
 */
import type { Page } from "@playwright/test";
import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { HOSTS } from "@/config/env";
import { filmQuotes } from "@/content/en-IN/films";
import { faqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { RETENTION_LINE } from "@/content/en-IN/policies";
import { product } from "@/content/en-IN/products/kheelu/product";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
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

/** An approved element ruled off whole. */
const cut = (at: string, was: string): FactEdit => ({ at, was, now: null });
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

/* Task 8b.1's claim fixes (wiki/qa/deviations.md V26-V36): the founder's D058 (2026-10-14) has the site follow the live
   team's code check of 12 October (origin/main c630a49, #19; dd04e6d, #18): one-tap delete, "servers in India", the
   closed library, the age-graded safety layer, topic controls, quiet hours, the new-word count, the weekly report and
   "about a minute" of quiet come off or take the code-checked words, the parent app's sections come onto /privacy and
   /terms, and Kheelona+ reads D058 item 3's sentence. The copy pages (wiki/site/pages/*.md, "Changes after approval
   (task 8b.1)") carry every changed line, passed by the CMO's review (wiki/qa/cmo-review-claims-8b.1-2026-10-14.md);
   the founder signs them at Gate B (D015), the legal pages with D029's sign-off. In page-facts.ts's form, applied after a
   page's earlier rules (its page facts, then task 7.1b's copy fixes: editsBeforeClaimFixes): `edits` turn that mockup
   into the build, and `mockup` and `build` are the sentences the edits change, for the text pass (each page's
   parity-deviations unit test proves them exactly those). Literal, because Playwright cannot load every content module;
   the content modules' tests hold each literal to the module. */

/** The DS icon as the mockups print it inline (mockup/build.mjs), for an item the fixes add. */
const icon = (name: IconName) =>
  `<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${ICON_PATHS[name]}"></path></svg>`;
/** An approved element whose words are replaced whole (plain text, or inline markup). */
const rewrite = (at: string, was: string, now: string): FactEdit => ({ at, was, now, inner: true });
/** An approved element that comes off, found by a heading or label inside it (`scope`, the element that goes). */
const cutAround = (at: string, was: string, scope: string): FactEdit => ({ at, was, scope, now: null });

/** "About a minute" of quiet: a conversation ends after "~2 minutes of quiet" (D058 item 1; narrows D018). */
const QUIET = { from: "about a minute of quiet", to: "a couple of minutes of quiet" } as const;
/** D020 item 6's place comes off the providers line: some processors work outside India (D058 item 6). */
const IN_INDIA = ", on servers in India";
/** The retention line (policies.ts RETENTION_LINE) keeps D020's first sentence; its one-tap sentence comes off (D058
 *  items 1 and 9). */
export const RETENTION = {
  mockup: "Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically. You can delete any of them sooner, in one tap.",
  build: "Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically.",
} as const;
/** Kheelona+ (D058 item 3, verbatim): a paid subscription on top of the free parent app, with no feature list. The
 *  product card's perk took the same sentence (meet-kheelu.md fold 3). */
export const KHEELONA_PLUS = {
  mockup: "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
  perk: "6 months of Kheelona+ included: stories, poems, jingles, languages and the parent app",
  build: "Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.",
} as const;
/** The footer's promise on every page (navigation.ts; home.md "Footer"; deviations.md V36): the live footer's "No web
 *  browsing." (D058 item 1; Kheelu does use the internet, on home Wi-Fi). Outside <main>, so no text-pass rule, and the
 *  chrome's footer pixels stay within tolerance at the three widths (chrome.spec.ts); the chrome's unit tests
 *  (navigation.test.ts, SiteShell.test.tsx, not-found.test.tsx) apply FOOTER_FIX to the mockup's footer. */
export const FOOTER_PROMISE = {
  mockup: "Press to talk. No open internet. You read every conversation.",
  build: "Press to talk. No web browsing. You read every conversation.",
} as const;
export const FOOTER_FIX: FactEdit = rewrite(".kh-footer__promise", FOOTER_PROMISE.mockup, FOOTER_PROMISE.build);
/** Removing a chat hides it on that phone; deleting the account deletes the profile, conversations and recordings
 *  (D058 item 1; the live /privacy, map §1 P11-P12). */
const DELETE_ACCOUNT =
  "Removing a chat in the app hides it on that phone. Deleting your account deletes your child’s profile, conversations and recordings from our servers.";
/** The age answers' last sentences (Home and the product page's FAQ): the age set at setup, then the mechanism in the live
 *  team's words (D058 item 1). "At setup" keeps each answer within 60 words (home.md, meet-kheelu.md fold 8). */
const AGE_SETUP = {
  from: "When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age. You can change it later.",
  to: "At setup, you enter your child’s age in the parent app. You can change it later. The AI model gets child-safety rules for that age, with Google’s safety filters on top.",
} as const;
/** The listening and providers bodies of the safety block Home and the product page share (D018, D020); the providers
 *  body is also the safe-AI-toy guide's "Your child’s voice." fact, word for word (ARTICLE_CLAIM_FIXES). */
const LISTENING =
  "Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it’s listening. Left alone, it hears nothing and sends nothing.";
const PROVIDERS =
  "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so.";
/** /privacy section 7's one row for the processors D058 item 6 names, as the live /privacy names them. */
const PROCESSORS = {
  who: "Google Cloud, Google’s Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic and Sentry",
  what: "Run Kheelu and the parent app for us, from Kheelu’s replies to storing conversations, your child’s age and your parent-app account",
  where: "India, and some of them outside India",
} as const;
const CLAIM_FIXES_WHOSE = "task 8b.1's claim fixes (D058)";
const claimsApproved = (row: string, page: string) => `deviations.md ${row} (founder, D058, 2026-10-14; ${page}; task 8b.1, CMO review passed)`;

export const CLAIM_FIXES = {
  home: {
    edits: [
      /* Fold 5: the app as the code check found it; the mechanism; the retention line's first sentence. */
      rewrite(
        ".kh-trust__body",
        "Every week, the app gives you a report on four thinking skills (words, reasons, stories and questions) and a new-word count.",
        "Each conversation appears a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
      ),
      rewrite(
        ".kh-trust__body",
        "You set your child’s age in the app, and the age-graded safety layer follows it.",
        "You set your child’s age in the app. The AI model that answers your child gets child-safety rules for that age, with Google’s safety filters on top.",
      ),
      rewrite(".kh-trust__body", RETENTION.mockup, RETENTION.build),
      /* Fold 6: a couple of minutes; no place on the providers line; what removing and deleting do; the privacy screen's
         alt without "delete all chats" (it hides chats on that phone). */
      swap(".kh-trust__body", LISTENING, QUIET.from, QUIET.to),
      swap(".kh-trust__body", PROVIDERS, IN_INDIA, ""),
      rewrite(".kh-trust__body", "In the parent app. Delete any of them in one tap.", `In the parent app. ${DELETE_ACCOUNT.replace("in the app hides", "there hides")}`),
      {
        at: 'img[src="assets/app/app-privacy.webp"]',
        was: "",
        now: `<img src="assets/app/app-privacy.webp" width="576" height="1209" loading="lazy" alt="The parent app's privacy centre: keep chats for 36 months, a switch to save voice recordings, download your child's data, and links to the privacy policy, terms and the grievance officer.">`,
      },
      /* Fold 8, the age answer (after task 7.1b's age-3 sentence). */
      swap(
        ".kh-faq__a > p",
        `Kheelu is made for children aged 3 to 7. It is not a toy for children under 3. ${AGE_THREE_LINE} ${AGE_SETUP.from}`,
        AGE_SETUP.from,
        AGE_SETUP.to,
      ),
      /* Fold 9, under the offer card. */
      rewrite("p.kh-body-s", KHEELONA_PLUS.mockup, KHEELONA_PLUS.build),
    ],
    mockup: [
      "Every week, the app gives you a report on four thinking skills (words, reasons, stories and questions) and a new-word count.",
      "You set your child’s age in the app, and the age-graded safety layer follows it.",
      "You can delete any of them sooner, in one tap.",
      "It stays on while your child talks and switches itself off after about a minute of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India.",
      "Delete any of them in one tap.",
      "When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age.",
      KHEELONA_PLUS.mockup,
    ],
    build: [
      "Each conversation appears a few minutes after it ends.",
      "Search them, read a daily summary, or look back over the week or the month.",
      "You set your child’s age in the app.",
      "The AI model that answers your child gets child-safety rules for that age, with Google’s safety filters on top.",
      "It stays on while your child talks and switches itself off after a couple of minutes of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      "Removing a chat there hides it on that phone.",
      "Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
      "At setup, you enter your child’s age in the parent app.",
      "The AI model gets child-safety rules for that age, with Google’s safety filters on top.",
      KHEELONA_PLUS.build,
    ],
    /* Fold 5's three bullets, fold 6's three bodies and the Kheelona+ line under the offer card (one more line at 360)
       wrap to other heights; the FAQ answer sits in a closed item. */
    hidden: {
      both: [
        ...[2, 3, 4].map((n) => `section[aria-labelledby="see-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`),
        ...[1, 2, 3].map((n) => `section[aria-labelledby="safety-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`),
        "#offer + .kh-body-s",
      ],
      mockup: [],
      build: [],
    },
    reason:
      "Home's parent-app bullets, safety block and age answer in the live team's code-checked words, without one-tap delete, the weekly report, the new-word count, the age-graded layer or \"servers in India\"; Kheelona+ as D058 item 3 words it",
    approvedBy: claimsApproved("V26", "home.md"),
  },
  "meet-kheelu": {
    edits: [
      /* Fold 3, the offer card's Kheelona+ perk; fold 4, Good to know. */
      rewrite(".kh-offer__list li > span", KHEELONA_PLUS.perk, KHEELONA_PLUS.build),
      swap("li > span", "Each conversation starts with a press of the wake-up button. It switches itself off after about a minute of quiet.", QUIET.from, QUIET.to),
      /* Fold 5: the app as the code check found it; the four-skills chips come off with the weekly report (D058 item 8). */
      rewrite("#app-title", "Their week, in four thinking skills.", 'Every conversation, <span class="kh-hand">word for word.</span>'),
      rewrite(
        ".kh-heading__lead",
        "Every week, the parent app gives you a report on four thinking skills: words, reasons, stories and questions, plus a new-word count. And you can read every conversation, word for word.",
        "Each one appears in the parent app a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
      ),
      cut(".kh-chips", "Words Reasons Stories Questions"),
      rewrite("p.kh-body-s", "The parent app is part of Kheelona+, included for 6 months with every Kheelu.", KHEELONA_PLUS.build),
      /* Fold 6: Home's safety block, and its privacy screen's alt without "delete all chats". */
      swap(".kh-trust__body", LISTENING, QUIET.from, QUIET.to),
      swap(".kh-trust__body", PROVIDERS, IN_INDIA, ""),
      rewrite(".kh-trust__title", "You can read and delete every conversation.", "You can read every conversation."),
      rewrite(".kh-trust__body", RETENTION.mockup, `${RETENTION.build} ${DELETE_ACCOUNT}`),
      {
        at: 'img[src="assets/app/app-privacy.webp"]',
        was: "",
        now: `<img loading="lazy" src="assets/app/app-privacy.webp" width="576" height="1209" alt="A real parent-app privacy screen: keep chats for 36 months, save voice recordings and download the child’s data.">`,
      },
      /* Fold 7: the Microphone and Parent app rows (after the founder's page facts), the Safety tab's first line. */
      swap("dd", "On only after a press of the wake-up button; off after about a minute of quiet; a light shows while it’s on", QUIET.from, QUIET.to),
      rewrite(
        "dd",
        "Every conversation, word for word; a weekly report on four thinking skills; a new-word count. On iPhone and Android.",
        "Every conversation, word for word, a few minutes after it ends; a daily summary; search; a look back over the week or the month. On iPhone and Android.",
      ),
      rewrite(
        "li > span",
        "Every reply passes an age-graded safety layer, set to the age you enter in the parent app.",
        "Every reply comes from an AI model given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
      ),
      /* Fold 8: FAQ 3's age answer (after task 7.1b's age-3 sentence) and FAQ 7 without "or delete". */
      swap(
        ".kh-faq__a > p",
        `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${AGE_THREE_LINE} ${AGE_SETUP.from}`,
        AGE_SETUP.from,
        AGE_SETUP.to,
      ),
      swap(
        ".kh-faq__a > p",
        "No toy can promise that. Kheelu remembers earlier conversations, so it can pick up where your child stopped instead of starting over. Story mode adds stories, poems and jingles, with no Wi‑Fi needed. You can read or delete any conversation in the parent app.",
        "You can read or delete any conversation",
        "You can read any conversation",
      ),
    ],
    mockup: [
      KHEELONA_PLUS.perk,
      "It switches itself off after about a minute of quiet.",
      "Their week, in four thinking skills.",
      "Every week, the parent app gives you a report on four thinking skills: words, reasons, stories and questions, plus a new-word count.",
      "And you can read every conversation, word for word.",
      "Words",
      "Reasons",
      "Stories",
      "Questions",
      "The parent app is part of Kheelona+, included for 6 months with every Kheelu.",
      "It stays on while your child talks and switches itself off after about a minute of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India.",
      "You can read and delete every conversation.",
      "You can delete any of them sooner, in one tap.",
      "On only after a press of the wake-up button; off after about a minute of quiet; a light shows while it’s on",
      "Every conversation, word for word; a weekly report on four thinking skills; a new-word count.",
      "Every reply passes an age-graded safety layer, set to the age you enter in the parent app.",
      "When you set it up, you enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age.",
      "You can read or delete any conversation in the parent app.",
    ],
    /* In order of first appearance on the page: the Kheelona+ sentence twice (the perk and fold 5's note), and "At setup,
       …" where fold 4's Good to know already says it (FAQ 3 says it too now). */
    build: [
      KHEELONA_PLUS.build,
      KHEELONA_PLUS.build,
      "It switches itself off after a couple of minutes of quiet.",
      "At setup, you enter your child’s age in the parent app.",
      "Every conversation, word for word.",
      "Each one appears in the parent app a few minutes after it ends.",
      "Search them, read a daily summary, or look back over the week or the month.",
      "It stays on while your child talks and switches itself off after a couple of minutes of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      "You can read every conversation.",
      "Removing a chat in the app hides it on that phone.",
      "Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
      "On only after a press of the wake-up button; off after a couple of minutes of quiet; a light shows while it’s on",
      "Every conversation, word for word, a few minutes after it ends; a daily summary; search; a look back over the week or the month.",
      "Every reply comes from an AI model given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
      "The AI model gets child-safety rules for that age, with Google’s safety filters on top.",
      "You can read any conversation in the parent app.",
    ],
    /* The perk, the Good-to-know line, fold 5's words column (its chips come off), fold 6's three changed items and the
       Parent app row wrap to other heights; the Safety panel and the answers sit in a hidden tab and closed items. */
    hidden: {
      both: [
        ".kh-offer__list > li:nth-child(2)",
        "#know-title ~ ul > li:nth-child(3)",
        "#app .kh-split > div:first-child",
        ...[1, 2].map((n) => `section[aria-labelledby="safety-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`),
        'section[aria-labelledby="safety-title"] .kh-trust__item:nth-child(3) > div',
        "#panel-specs > dl > div:nth-child(5)",
      ],
      mockup: [],
      build: [],
    },
    reason:
      "the product page's Kheelona+ perk and note as D058 item 3 words them; the parent app as the code check found it (the four-skills report and its chips off until it ships); the safety block, specs, Safety tab and two answers without one-tap delete, the age-graded layer or \"servers in India\"",
    approvedBy: claimsApproved("V27", "meet-kheelu.md"),
  },
  safety: {
    edits: [
      /* Fold 2, the four facts: a couple of minutes; no place on the providers line; read a few minutes after, delete by
         deleting the account. */
      swap(
        ".kh-trust__body",
        "No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after about a minute of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it’s listening.",
        QUIET.from,
        QUIET.to,
      ),
      swap(".kh-trust__body", PROVIDERS, IN_INDIA, ""),
      rewrite(
        ".kh-trust__body",
        "Yes, in the parent app, word for word. Delete any of them in one tap.",
        "Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account.",
      ),
      /* Fold 3: the live footer's words (CMO review m12; safety.md question 5). */
      rewrite(".kh-trust__title", "No open internet.", "No web browsing."),
      /* Fold 4, the controls: the mechanism; no topics or quiet hours; the Save voice recordings switch after Languages. */
      rewrite(
        ".kh-trust__body",
        "Enter it when you set Kheelu up, and change it later if you need to. The age-graded safety layer follows it.",
        "Enter it when you set Kheelu up, and change it later if you need to. On every conversation, the AI model that answers your child is given that age and child‑safety rules.",
      ),
      cutAround(".kh-trust__title", "Topics.", "li"),
      cutAround(".kh-trust__title", "Quiet hours.", "li"),
      {
        at: ".kh-trust__title",
        was: "Languages.",
        scope: "li",
        now: [
          ["translate", "Languages.", "Pick the ones you speak at home."],
          ["microphone-slash", "Voice recordings.", "Turn off Save voice recordings, and only the written record of each conversation is kept."],
        ]
          .map(([name, title, body]) => `<li class="kh-trust__item"><span class="kh-trust__icon">${icon(name as IconName)}</span><div><h3 class="kh-trust__title">${title}</h3><p class="kh-trust__body">${body}</p></div></li>`)
          .join(""),
      },
      /* Fold 4's privacy screen: its alt without "and to delete all chats" (the button hides chats on that phone), as
         Home's and the product page's (task 8b.1b; D058 item 1). */
      {
        at: 'img[src="assets/app/app-privacy.webp"]',
        was: "",
        now: `<img loading="lazy" src="assets/app/app-privacy.webp" width="576" height="1209" alt="A real screen from the Kheelu parent app: the privacy centre. Chats are kept for 36 months, with a switch to save voice recordings and a button to download your child’s data.">`,
      },
      /* Fold 5: the retention line's first sentence, then what removing and deleting do. */
      {
        at: "p.kh-body-l",
        was: RETENTION.mockup,
        now: `<p class="kh-body-l">${RETENTION.build}</p><p class="kh-body-l">${DELETE_ACCOUNT}</p>`,
      },
      /* Fold 7, question 2: how Kheelu answers, in the live team's words. */
      rewrite(
        "li",
        "Replies: its answers come from a curated, closed content library, and every reply passes an age-graded safety layer. When it doesn’t know something, it says so. Before launch, we test it by trying to make it say things it shouldn’t. You can read every conversation.",
        "<strong>Replies:</strong> its answers are generated by an AI model that is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. It can’t browse or search the web. When it doesn’t know something, it says so. Before launch, we test it by trying to make it say things it shouldn’t. You can read every conversation.",
      ),
    ],
    mockup: [
      "It stays on while your child is talking and switches itself off after about a minute of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India.",
      "Yes, in the parent app, word for word.",
      "Delete any of them in one tap.",
      "No open internet.",
      "The age-graded safety layer follows it.",
      "Topics.",
      "You choose what’s open, and what waits.",
      "Quiet hours.",
      "They’re yours to set.",
      "You can delete any of them sooner, in one tap.",
      "Replies: its answers come from a curated, closed content library, and every reply passes an age-graded safety layer.",
    ],
    build: [
      "It stays on while your child is talking and switches itself off after a couple of minutes of quiet.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      "Yes, in the parent app, word for word, a few minutes after each one ends.",
      "Delete them all by deleting your account.",
      "No web browsing.",
      /* Fold 3's body says it already; fold 7's "Replies" line says it too now. */
      "It can’t browse or search the web.",
      "On every conversation, the AI model that answers your child is given that age and child‑safety rules.",
      "Voice recordings.",
      "Turn off Save voice recordings, and only the written record of each conversation is kept.",
      "Removing a chat in the app hides it on that phone.",
      "Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
      "Replies: its answers are generated by an AI model that is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
    ],
    /* Fold 2's three bodies and fold 4's list (two items off, one on) change height; fold 5's card gains a paragraph;
       the "Replies" line sits in a closed item. */
    hidden: {
      both: [
        ...[1, 2, 3].map((n) => `#facts .kh-trust__item:nth-child(${n}) .kh-trust__body`),
        'section[aria-labelledby="controls-title"] .kh-trust',
        'section[aria-labelledby="kept-title"] > .kh-body-l:nth-child(2)',
      ],
      mockup: [],
      build: ['section[aria-labelledby="kept-title"] > .kh-body-l:nth-child(3)'],
    },
    reason:
      "the safety facts, controls and retention card in the live team's code-checked words: a couple of minutes, no place on the providers line, no one-tap delete, no topics or quiet hours, the Save voice recordings switch, no closed library or age-graded layer; \"No web browsing.\" as the live footer words it",
    approvedBy: claimsApproved("V28", "safety.md"),
  },
  setup: {
    edits: [
      rewrite(
        "p.kh-body-l",
        "You enter your child’s age in the parent app. Every reply Kheelu gives passes a safety layer set to that age.",
        "You enter your child’s age in the parent app. On every conversation, the AI model that answers your child is given that age and child-safety rules, with Google’s safety filters on top.",
      ),
      rewrite(
        "p.kh-body-l",
        "While you’re in the app, you can also choose your family’s languages, pick which topics are open and set quiet hours.",
        "While you’re in the app, you can also choose your family’s languages.",
      ),
      swap(
        "p.kh-body-l",
        "One press starts a conversation. A light on Kheelu shows whenever it’s listening. After about a minute of quiet, it switches itself off, so the next chat starts with another press.",
        "After about a minute of quiet",
        "After a couple of minutes of quiet",
      ),
      rewrite(
        "p.kh-body-l",
        "Later, open the parent app to read every word of it. You can delete any conversation in one tap.",
        "Later, open the parent app to read every word of it. Removing a chat in the app hides it on that phone. Deleting your account deletes every conversation and recording.",
      ),
    ],
    mockup: [
      "Every reply Kheelu gives passes a safety layer set to that age.",
      "While you’re in the app, you can also choose your family’s languages, pick which topics are open and set quiet hours.",
      "After about a minute of quiet, it switches itself off, so the next chat starts with another press.",
      "You can delete any conversation in one tap.",
    ],
    build: [
      "On every conversation, the AI model that answers your child is given that age and child-safety rules, with Google’s safety filters on top.",
      "While you’re in the app, you can also choose your family’s languages.",
      "After a couple of minutes of quiet, it switches itself off, so the next chat starts with another press.",
      "Removing a chat in the app hides it on that phone.",
      "Deleting your account deletes every conversation and recording.",
    ],
    hidden: {
      both: [
        '[aria-labelledby="age-title"] .kh-body-l:nth-child(1)',
        '[aria-labelledby="age-title"] .kh-body-l:nth-child(4)',
        '[aria-labelledby="button-title"] .kh-body-l:nth-child(2)',
        '[aria-labelledby="talk-title"] .kh-body-l:nth-child(2)',
      ],
      mockup: [],
      build: [],
    },
    reason:
      "setup's age, languages, button and first-conversation lines in the live team's code-checked words: the AI model given the age and child-safety rules, no topics or quiet hours, a couple of minutes, no one-tap delete",
    approvedBy: claimsApproved("V29", "setup.md"),
  },
  team: {
    edits: [
      swap(
        ".kh-card__body",
        "Aman builds the part your child talks to: how Kheelu listens and replies, and the safety layer every reply passes. He is also our grievance officer.",
        "the safety layer every reply passes",
        "the child-safety rules its AI is given",
      ),
      rewrite(
        "p.kh-body-l",
        "And you hold the keys. You can read every conversation in the parent app and delete any of them in one tap. You set your child’s age, and every reply passes a safety layer set to it.",
        "And you hold the keys. You can read every conversation in the parent app, and delete them all by deleting your account. You set your child’s age, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
      ),
    ],
    mockup: [
      "Aman builds the part your child talks to: how Kheelu listens and replies, and the safety layer every reply passes.",
      "You can read every conversation in the parent app and delete any of them in one tap.",
      "You set your child’s age, and every reply passes a safety layer set to it.",
    ],
    build: [
      "Aman builds the part your child talks to: how Kheelu listens and replies, and the child-safety rules its AI is given.",
      "You can read every conversation in the parent app, and delete them all by deleting your account.",
      "You set your child’s age, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
    ],
    hidden: {
      both: ['[aria-labelledby="founders-title"] .kh-card:nth-child(2) .kh-card__body', '[aria-labelledby="why-title"] .kh-body-l:nth-child(3)'],
      mockup: [],
      build: [],
    },
    reason: "Aman's job line and fold 4's keys line in the live team's code-checked words: the child-safety rules the AI is given, no one-tap delete",
    approvedBy: claimsApproved("V30", "team.md"),
  },
  "ai-toys-for-kids-in-india": {
    edits: [
      swap(
        ".kh-step__body",
        "A summary shows you what the maker chose to show. Ask whether you can read every word, and delete it yourself.",
        "and delete it yourself.",
        "and how you delete it.",
      ),
      swap(
        ".kh-trust__body",
        "On only after someone presses the wake-up button. A light shows whenever it’s listening, and it switches itself off after about a minute of quiet.",
        QUIET.from,
        QUIET.to,
      ),
      rewrite(
        ".kh-trust__body",
        "It can’t browse the internet. Its answers come from a curated, closed content library, and when it doesn’t know something, it says so.",
        "It can’t browse the internet. Its answers are generated by an AI model. The model is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. When it doesn’t know something, it says so.",
      ),
      rewrite(
        ".kh-trust__body",
        "Yes, in the parent app, word for word. Delete any of them in one tap.",
        "Yes, in the parent app, word for word. Removing a chat in the app hides it on that phone. Deleting your account deletes the conversations and recordings from our servers.",
      ),
      /* Fold 5, the age answer (after task 7.1b's age-3 sentence). */
      {
        at: ".kh-faq__a > p",
        was: GUIDE_AGE_ANSWER(AGE_THREE_LINE, "safety page"),
        now: `Kheelu is made for children aged 3 to 7, and it is not a toy for children under 3. ${AGE_THREE_LINE} You enter your child’s age in the parent app, and Kheelu’s AI is given child-safety rules and that age on every conversation. What child-safety groups advise is on our <a href="safety.html">safety page</a>.`,
        inner: true,
      },
    ],
    mockup: [
      "Ask whether you can read every word, and delete it yourself.",
      "A light shows whenever it’s listening, and it switches itself off after about a minute of quiet.",
      "Its answers come from a curated, closed content library, and when it doesn’t know something, it says so.",
      "Delete any of them in one tap.",
      "You enter your child’s age in the parent app, and every reply passes an age-graded safety layer set to that age.",
    ],
    build: [
      "Ask whether you can read every word, and how you delete it.",
      "A light shows whenever it’s listening, and it switches itself off after a couple of minutes of quiet.",
      "Its answers are generated by an AI model.",
      "The model is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      "When it doesn’t know something, it says so.",
      "Removing a chat in the app hides it on that phone.",
      "Deleting your account deletes the conversations and recordings from our servers.",
      "You enter your child’s age in the parent app, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
    ],
    /* Check 4 and the three answers wrap to other heights; the age answer sits in a closed item. */
    hidden: {
      both: [
        'section[aria-labelledby="checks-title"] .kh-step:nth-child(4) .kh-step__body',
        ...[2, 3, 4].map((n) => `section[aria-labelledby="answers-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`),
      ],
      mockup: [],
      build: [],
    },
    reason:
      "the buyer's guide's check 4 and Kheelu's answers in the live team's code-checked words: a couple of minutes, replies generated by an AI model given child-safety rules and the age (no closed library, no age-graded layer), no one-tap delete",
    approvedBy: claimsApproved("V31", "ai-toys-for-kids-in-india.md"),
  },
  store: {
    edits: [
      rewrite(
        "p.mk-agree__fine",
        `${KHEELONA_PLUS.mockup} The price is ₹4,999 (incl. GST) for the first 500 units, and ₹7,999 (incl. GST) once they are gone. Delivery anywhere in India is included, and every order comes with a GST invoice.`,
        `${KHEELONA_PLUS.build} Kheelu’s price is <span data-src="LAUNCH_PRICE">₹4,999</span> (incl. GST) for the first 500 units, and <span data-src="FULL_PRICE">₹7,999</span> (incl. GST) once they are gone. Delivery anywhere in India is included, and every order comes with a GST invoice.`,
      ),
    ],
    /* The text pass splits a sentence after "incl.", so the price sentence's changed part is its first piece. */
    mockup: [KHEELONA_PLUS.mockup, "The price is ₹4,999 (incl."],
    build: [KHEELONA_PLUS.build, "Kheelu’s price is ₹4,999 (incl."],
    /* The small print wraps to another height on a phone. The build names it by its own block class. */
    hidden: { both: [], mockup: [".mk-agree__fine"], build: [".ks-agree__fine"] },
    reason: "the order summary's small print: Kheelona+ as D058 item 3 words it, and Kheelu's price named as Kheelu's (CMO review m10 (a))",
    approvedBy: claimsApproved("V34", "store.md"),
  },
  /* /privacy (after the founder's page facts, V11): the code-checked words, and the parent app's sections of the live
     /privacy (#18; map §1 P3-P12) in the rebuild's voice. */
  privacy: {
    edits: [
      /* The short version, items 2, 3 and 5. */
      swap(".kh-trust__body", "A light shows while it listens, and it switches itself off after about a minute of quiet.", QUIET.from, QUIET.to),
      swap(
        ".kh-trust__body",
        "Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI.",
        `${IN_INDIA},`,
        "",
      ),
      rewrite(".kh-trust__title", "You can read and delete every conversation.", "You can read every conversation."),
      rewrite(
        ".kh-trust__body",
        "Delete any of them in one tap. We delete transcripts automatically after 36 months.",
        "Deleting your account in the parent app deletes them all, with the recordings. We delete transcripts automatically after 36 months.",
      ),
      /* Section 2: the answer-first block (P1), the listening paragraphs, where the voice goes. */
      swap(
        "p",
        "We don’t sell your data. Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply; they don’t keep it or train on it, and our contracts say so. Kheelona’s own model learns from conversations unless you turn this off. Conversations stay in your parent app for 36 months, then they’re deleted automatically.",
        `${IN_INDIA},`,
        "",
      ),
      swap(
        "p",
        "Kheelu has no wake word, so it never listens for one. Its microphone turns on only when someone presses the wake-up button. It stays on while your child talks and switches itself off after about a minute of quiet. A light on Kheelu shows whenever it’s listening. Until the next press, nothing is heard, recorded or sent.",
        QUIET.from,
        QUIET.to,
      ),
      swap(
        "p",
        "While the light is on, Kheelu hears whoever is speaking near it, so a brother, sister, friend or grown-up in the room can end up in a conversation too. You can read and delete any conversation in the parent app.",
        "You can read and delete any conversation",
        "You can read every conversation",
      ),
      {
        at: "p",
        was: "In AI mode, Kheelu uses your home Wi‑Fi. To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so. “Trusted” means we chose them carefully; it is not a certification.",
        now:
          "<p>In AI mode, Kheelu uses your home Wi‑Fi and sends your child’s voice to Kheelona’s servers. To understand and answer your child, Kheelu uses trusted speech and AI providers. They process your child’s voice only to produce Kheelu’s reply. They don’t keep it, and they never use it to train their AI. Our contracts with them say so. “Trusted” means we chose them carefully; it is not a certification.</p>" +
          '<p>Every company that runs Kheelu and the parent app for us is named below, under <a href="#who-else">Everyone who handles your data</a>. Some of them process data outside India.</p>',
      },
      /* Section 2, what we keep (after the page facts' fills): Save voice recordings, the mechanism, the daily summary,
         the child's profile, the account and Kheelu's setup in the live words; then the location paragraph. */
      rewrite(
        "li",
        "Voice recordings: used to train Kheelona’s own model (next section). Besides Kheelu’s reply and that training, we use them for nothing else.",
        '<strong>Voice recordings:</strong> used to train Kheelona’s own model (<a href="#training">next section</a>). Besides Kheelu’s reply and that training, we use them for nothing else. We keep them unless you turn off Save voice recordings in the parent app’s privacy settings; then we keep the text only.',
      ),
      rewrite(
        "li",
        "Your child’s age: you enter it in the parent app when you set Kheelu up, and you can change it later. Every reply passes an age-graded safety layer set to that age.",
        "<strong>Your child’s age:</strong> you enter it in the parent app when you set Kheelu up, and you can change it later. The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      ),
      rewrite(
        "li",
        "The weekly report and the new-word count in the parent app, worked out from your child’s conversations.",
        "<strong>A daily summary</strong> in the parent app, worked out from your child’s conversations.",
      ),
      rewrite(
        "li",
        "Your child’s first name: the parent app asks for it.",
        "<strong>Your child’s profile:</strong> their first name, pronouns and languages, which the parent app asks for so Kheelu can talk with them properly, and a photo only if you add one.",
      ),
      {
        at: "li",
        was: "Your parent-app account and Kheelu’s setup: your phone number. You sign in with it and a one-time code. The account also keeps Kheelu’s serial or device ID, the name of the Wi‑Fi network Kheelu joins (not its password), and your phone’s model and operating system.",
        now:
          "<li><strong>Your parent-app account:</strong> your phone number, which you sign in with using a one-time code, and your name and how you’re related to your child, if you add them.</li>" +
          "<li><strong>Kheelu’s setup:</strong> its serial or device ID, the name you give it, its battery and Wi‑Fi strength, when it was last online, and your phone’s model and operating system.</li>",
      },
      {
        at: "h3",
        was: "Your consent.",
        now:
          "<p>The parent app collects no location. Your phone asks for location permission while you set Kheelu up. That is only because Android and iPhone require it before an app can read the name of your Wi‑Fi network, and that name stays on your phone. Your account doesn’t keep the Wi‑Fi password. The app has no advertising or analytics tools.</p>" +
          '<h3 class="kh-subtitle">Your consent.</h3>',
      },
      /* Section 7: the named processors in one row (D058 item 6), in place of the providers' and Kheelona's rows; phone
         rows, then the laptop table. */
      cutAround("p.kh-label", "Speech and AI providers", "li"),
      {
        at: "p.kh-label",
        was: "Kheelona, on Google Cloud",
        scope: "li",
        inner: true,
        now: `<p class="kh-label">${PROCESSORS.who}</p><p class="kh-body-s"><span class="mk-recips__k">What:</span> ${PROCESSORS.what}</p><p class="kh-body-s"><span class="mk-recips__k">Where:</span> ${PROCESSORS.where}</p>`,
      },
      cutAround("th", "Speech and AI providers", "tr"),
      {
        at: "th",
        was: "Kheelona, on Google Cloud",
        scope: "tr",
        inner: true,
        now: `<th scope="row">${PROCESSORS.who}</th><td>${PROCESSORS.what}</td><td>${PROCESSORS.where}</td>`,
      },
      /* Section 8: the answer-first block (RT1) and the first three rows. */
      rewrite(
        "p",
        `${RETENTION.mockup} The speech and AI providers that help Kheelu reply keep none of it.`,
        `${RETENTION.build} You can read every one of them there, word for word. If you delete your account in the parent app, we delete them sooner, with the voice recordings.`,
      ),
      rewrite(
        "li",
        "Conversation transcripts: 36 months, then deleted automatically, unless you delete them sooner.",
        "<strong>Conversation transcripts:</strong> 36 months, then deleted automatically, unless you delete your account sooner.",
      ),
      rewrite(
        "li",
        "Voice recordings: 36 months, the same as transcripts.",
        "<strong>Voice recordings:</strong> 36 months, the same as transcripts. With Save voice recordings off, we keep the text only.",
      ),
      rewrite(
        "li",
        "If you close your parent-app account: we keep your child’s conversations and recordings until their 36 months end.",
        "<strong>If you delete your parent-app account:</strong> we delete the account, your child’s profile, and their conversations and recordings.",
      ),
      /* Section 9: the app's privacy settings, then what removing a chat and deleting the account do. */
      {
        at: "h3",
        was: "Deleting a conversation.",
        now:
          '<h3 class="kh-subtitle">In the parent app.</h3><p>In the app’s privacy settings, you can:</p>' +
          "<ul><li>turn off Save voice recordings, to keep the text of conversations only;</li><li>download your child’s data;</li><li>delete your account.</li></ul>" +
          '<h3 class="kh-subtitle">Removing a chat, or deleting your account.</h3>',
      },
      {
        at: "p",
        was: "In the parent app, you can delete any conversation in one tap. It disappears from your app straight away. It is not removed from Kheelu’s memory, or from the data our model trains on.",
        now:
          "<p>Removing a chat in the parent app hides it on that phone only. It is not removed from our servers, from Kheelu’s memory, or from the data our model trains on. To delete your child’s conversations, delete your account, or write to us.</p>" +
          "<p>Deleting your account deletes the account, your child’s profile, and their conversations and voice recordings.</p>",
      },
    ],
    mockup: [
      "A light shows while it listens, and it switches itself off after about a minute of quiet.",
      "Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply.",
      "You can read and delete every conversation.",
      "Delete any of them in one tap.",
      "Trusted speech and AI providers, on servers in India, process your child’s voice only to produce Kheelu’s reply; they don’t keep it or train on it, and our contracts say so.",
      "It stays on while your child talks and switches itself off after about a minute of quiet.",
      "You can read and delete any conversation in the parent app.",
      "In AI mode, Kheelu uses your home Wi‑Fi.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers, on servers in India.",
      "Every reply passes an age-graded safety layer set to that age.",
      "The weekly report and the new-word count in the parent app, worked out from your child’s conversations.",
      "Your child’s first name: the parent app asks for it.",
      "Your parent-app account and Kheelu’s setup: your phone number.",
      "You sign in with it and a one-time code.",
      "The account also keeps Kheelu’s serial or device ID, the name of the Wi‑Fi network Kheelu joins (not its password), and your phone’s model and operating system.",
      "Speech and AI providers",
      "Speech and AI providers",
      "What: Turn your child’s voice into Kheelu’s reply",
      "Where: Servers in India",
      "Kheelona, on Google Cloud",
      "Kheelona, on Google Cloud",
      "What: Stores conversations, your child’s age and your parent-app account",
      "Where: India",
      "Turn your child’s voice into Kheelu’s reply",
      "Servers in India",
      "Stores conversations, your child’s age and your parent-app account",
      "India",
      "You can delete any of them sooner, in one tap.",
      "The speech and AI providers that help Kheelu reply keep none of it.",
      "Conversation transcripts: 36 months, then deleted automatically, unless you delete them sooner.",
      "If you close your parent-app account: we keep your child’s conversations and recordings until their 36 months end.",
      "Deleting a conversation.",
      "In the parent app, you can delete any conversation in one tap.",
      "It disappears from your app straight away.",
      "It is not removed from Kheelu’s memory, or from the data our model trains on.",
    ],
    build: [
      "A light shows while it listens, and it switches itself off after a couple of minutes of quiet.",
      "Trusted speech and AI providers process your child’s voice only to produce Kheelu’s reply.",
      "You can read every conversation.",
      "Deleting your account in the parent app deletes them all, with the recordings.",
      "Trusted speech and AI providers process your child’s voice only to produce Kheelu’s reply; they don’t keep it or train on it, and our contracts say so.",
      "It stays on while your child talks and switches itself off after a couple of minutes of quiet.",
      "You can read every conversation in the parent app.",
      "In AI mode, Kheelu uses your home Wi‑Fi and sends your child’s voice to Kheelona’s servers.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      "Every company that runs Kheelu and the parent app for us is named below, under Everyone who handles your data.",
      "Some of them process data outside India.",
      "We keep them unless you turn off Save voice recordings in the parent app’s privacy settings; then we keep the text only.",
      "The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      "A daily summary in the parent app, worked out from your child’s conversations.",
      "Your child’s profile: their first name, pronouns and languages, which the parent app asks for so Kheelu can talk with them properly, and a photo only if you add one.",
      "Your parent-app account: your phone number, which you sign in with using a one-time code, and your name and how you’re related to your child, if you add them.",
      "Kheelu’s setup: its serial or device ID, the name you give it, its battery and Wi‑Fi strength, when it was last online, and your phone’s model and operating system.",
      "The parent app collects no location.",
      "Your phone asks for location permission while you set Kheelu up.",
      "That is only because Android and iPhone require it before an app can read the name of your Wi‑Fi network, and that name stays on your phone.",
      "Your account doesn’t keep the Wi‑Fi password.",
      "The app has no advertising or analytics tools.",
      "Google Cloud, Google’s Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic and Sentry",
      "Google Cloud, Google’s Gemini, Sarvam AI, Twilio, Aiven, Redis, New Relic and Sentry",
      "What: Run Kheelu and the parent app for us, from Kheelu’s replies to storing conversations, your child’s age and your parent-app account",
      "Where: India, and some of them outside India",
      "Run Kheelu and the parent app for us, from Kheelu’s replies to storing conversations, your child’s age and your parent-app account",
      "India, and some of them outside India",
      "You can read every one of them there, word for word.",
      "If you delete your account in the parent app, we delete them sooner, with the voice recordings.",
      "Conversation transcripts: 36 months, then deleted automatically, unless you delete your account sooner.",
      "With Save voice recordings off, we keep the text only.",
      "If you delete your parent-app account: we delete the account, your child’s profile, and their conversations and recordings.",
      "In the parent app.",
      "In the app’s privacy settings, you can:",
      "turn off Save voice recordings, to keep the text of conversations only;",
      "download your child’s data;",
      "delete your account.",
      "Removing a chat, or deleting your account.",
      "Removing a chat in the parent app hides it on that phone only.",
      "It is not removed from our servers, from Kheelu’s memory, or from the data our model trains on.",
      "To delete your child’s conversations, delete your account, or write to us.",
      "Deleting your account deletes the account, your child’s profile, and their conversations and voice recordings.",
    ],
    /* Every block whose words change, on both sides; on the build's side alone the blocks it adds (section 2's two new
       paragraphs; section 9's settings list, its heading and its two paragraphs). Section 7's two lists lose a row.
       Section 8's second row only gains a sentence, so V11's hide of it serves here; its third row and section 9's first
       paragraph are V11's hides too. */
    hidden: {
      both: [
        ...[2, 3].map((n) => `section[aria-labelledby="short-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`),
        'section[aria-labelledby="short-title"] .kh-trust__item:nth-child(5) .kh-trust__title',
        'section[aria-labelledby="short-title"] .kh-trust__item:nth-child(5) .kh-trust__body',
        ...[2, 4, 5, 7].map((n) => `#kheelu > p:nth-child(${n})`),
        "#kheelu > ul",
        "#who-else > ul",
        "#who-else .kh-compare-wrap",
        "#keep > p:nth-child(2)",
        "#keep > ul > li:nth-child(1)",
        "#keep > ul > li:nth-child(3)",
        "#rights > h3:nth-child(2)",
        "#rights > p:nth-child(3)",
      ],
      mockup: [],
      build: ["#kheelu > p:nth-child(8)", "#kheelu > p:nth-child(12)", "#rights > ul:nth-child(4)", "#rights > h3:nth-child(5)", "#rights > p:nth-child(6)", "#rights > p:nth-child(7)"],
    },
    reason:
      "/privacy in the live team's code-checked words, with the parent app's sections of the live /privacy (#18): a couple of minutes, the voice to Kheelona's servers and the processors named (some outside India), Save voice recordings, the child's profile, the account and Kheelu's setup, no location, removing a chat against deleting the account, no one-tap delete",
    approvedBy: claimsApproved("V32", "privacy.md"),
  },
  /* /terms (after the founder's page facts, V14, and task 7.1b's fixes, V21): Kheelona+, the mechanism, and the parent
     app's terms of the live /terms (#18; map §1 T2-T7) in the rebuild's voice. */
  terms: {
    edits: [
      swap(
        "p",
        `In the box: the Kheelu plush toy, a charger and a quick-start card. ${KHEELONA_PLUS.mockup}`,
        KHEELONA_PLUS.mockup,
        KHEELONA_PLUS.build,
      ),
      rewrite(
        "p",
        "When you set Kheelu up, you enter your child’s age in the parent app. Every reply passes an age-graded safety layer set to that age. You can change it later.",
        "When you set Kheelu up, you enter your child’s age in the parent app. You can change it later. The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      ),
      rewrite(
        "p",
        "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account.",
        "The parent app is for parents and guardians. The person who sets it up must be 18 or over and looks after the account. You’re responsible for how your child uses Kheelu.",
      ),
      {
        at: "p",
        was: "In the app, you can read every conversation and delete any of them in one tap. Conversations are deleted automatically after 36 months.",
        now: [
          "In the app, you can read every conversation word for word, a few minutes after it ends, with a daily summary, search, and a look back over the week or the month. Conversations are deleted automatically after 36 months.",
          "The parent app is free. You sign in with your phone number and a one-time code. Keep the code to yourself, and tell us if you think someone else is using your account.",
          "Conversations with Kheelu need your home Wi‑Fi. Stories and songs you’ve downloaded play without it.",
          "Don’t try to break into our systems, copy the service, or use the app or Kheelu to harm anyone. If you do, we can close your account.",
          "You can stop using the app and delete your account at any time, in its privacy settings. That deletes the account, your child’s profile, and their conversations and voice recordings.",
        ]
          .map((text) => `<p>${text}</p>`)
          .join(""),
      },
      {
        at: "p",
        was: "Kheelu uses AI to understand and answer your child. Its stories and answers come from a curated, closed content library, and every reply passes an age-graded safety layer. We test it before launch by trying to make it say unsafe things, and when it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
        now: [
          "Kheelu uses AI to understand and answer your child. The AI model that writes its replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. It cannot browse or search the web.",
          "We test it before launch by trying to make it say unsafe things, and when it isn’t sure, it says it doesn’t know rather than guess. Even so, an answer can sometimes be wrong, so treat its replies as conversation, not advice. Kheelu doesn’t replace you: stay close, and read its conversations in the parent app.",
        ]
          .map((text) => `<p>${text}</p>`)
          .join(""),
      },
    ],
    mockup: [
      "Every Kheelu comes with 6 months of Kheelona+: stories, poems, jingles, languages and the parent app.",
      "Every reply passes an age-graded safety layer set to that age.",
      "In the app, you can read every conversation and delete any of them in one tap.",
      "Its stories and answers come from a curated, closed content library, and every reply passes an age-graded safety layer.",
      "Even so, an answer can sometimes be wrong.",
    ],
    build: [
      "Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app.",
      "The AI model that writes Kheelu’s replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      "You’re responsible for how your child uses Kheelu.",
      "In the app, you can read every conversation word for word, a few minutes after it ends, with a daily summary, search, and a look back over the week or the month.",
      "The parent app is free.",
      "You sign in with your phone number and a one-time code.",
      "Keep the code to yourself, and tell us if you think someone else is using your account.",
      "Conversations with Kheelu need your home Wi‑Fi.",
      "Stories and songs you’ve downloaded play without it.",
      "Don’t try to break into our systems, copy the service, or use the app or Kheelu to harm anyone.",
      "If you do, we can close your account.",
      "You can stop using the app and delete your account at any time, in its privacy settings.",
      "That deletes the account, your child’s profile, and their conversations and voice recordings.",
      "The AI model that writes its replies is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top.",
      "It cannot browse or search the web.",
      "Even so, an answer can sometimes be wrong, so treat its replies as conversation, not advice.",
    ],
    /* Every paragraph whose words change, on both sides, and section 12's second on the build's side alone. Section 10
       (the parent app) is hidden whole: its first paragraph only gains a sentence, and four paragraphs follow. */
    hidden: {
      both: ["#preorder > p:nth-child(3)", "#ages > p:nth-child(3)", "#account", "#toy > p:nth-child(3)"],
      mockup: [],
      build: ["#toy > p:nth-child(4)"],
    },
    reason:
      "/terms with Kheelona+ as D058 item 3 words it, the mechanism in the live team's code-checked words (no closed library, no age-graded layer, no one-tap delete), and the parent app's terms of the live /terms (#18)",
    approvedBy: claimsApproved("V33", "terms.md"),
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type ClaimFixesSlug = keyof typeof CLAIM_FIXES;

/** The edits a page's earlier rules make before task 8b.1's (its page facts, then task 7.1b's copy fixes): the mockup the
 *  claim fixes start from. */
export function editsBeforeClaimFixes(slug: string): readonly FactEdit[] {
  return [...(PAGE_FACTS[slug as PageFactsSlug]?.edits ?? []), ...(COPY_FIXES[slug as CopyFixesSlug]?.edits ?? [])];
}

/* Task 8c.4's FAQ fixes (D061, 2026-10-15; the CMO's review of the advisor's proposal, AP-30; wiki/qa/deviations.md rows
   filed by the main session at the merge): Home's fourth question takes the parent's own words, "What if my child doesn’t
   like it?", its answer unchanged; and the product page answers "Which languages does Kheelu speak?", which no question
   on Home or the product page answered, after the first-week question (facts.md's languages row: the named languages
   and the ceiling from product.ts, switching mid-sentence as D017 approved it, in AI mode as film 6's caption says). The
   founder signs both at Gate B (D015). In page-facts.ts's form, applied after a page's claim fixes (task 8b.1), whose
   first-week answer the new question follows: `edits` turn that mockup into the build, and `mockup` and `build` are the
   sentences they change, for the text pass (faqs.test.ts proves them exactly those). Literal, because Playwright cannot
   load every content module; faqs.test.ts holds each literal to faqs.ts. */

/** Home's fourth question (faqs.ts `not-right-for-us`), in the parent's words; its answer stays word for word. */
export const NOT_RIGHT_QUESTION = {
  mockup: "What if it isn’t right for us?",
  build: "What if my child doesn’t like it?",
} as const;
/** The product page's new question (faqs.ts `languages`), as the page prints it. */
export const LANGUAGES_FAQ = {
  question: "Which languages does Kheelu speak?",
  answer:
    "Kheelu speaks up to 10 languages at launch, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French. In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them. You can watch it happen in the film “Two languages”.",
} as const;
/** The product page's seventh question as task 8b.1's claim fix leaves it (V27, without "or delete"): the new one
 *  follows it, so the speech question and its source stay last, beside the D025 line. */
const FIRST_WEEK = {
  question: "Will my child still play with it after the first week?",
  answer:
    "No toy can promise that. Kheelu remembers earlier conversations, so it can pick up where your child stopped instead of starting over. Story mode adds stories, poems and jingles, with no Wi‑Fi needed. You can read any conversation in the parent app.",
} as const;
/** One closed question of the DS FAQ as the mockups print it (mockup/build.mjs): its words, the plus sign, the answer. */
const faqItem = (question: string, answer: string) =>
  `<details class="kh-faq__item"><summary class="kh-faq__q"><span>${question}</span><span class="kh-faq__sign" aria-hidden="true">${icon("plus")}</span></summary><div class="kh-faq__a"><p>${answer}</p></div></details>`;
/** A page's FAQ item, by its place in the questions fold (both pages, both sides). */
const faqAt = (n: number) => `section[aria-labelledby="faq-title"] .kh-faq__item:nth-child(${n})`;
/** D061 lists both among the main session's rulings, each signed as a deviation row for the founder's information; the
 *  founder signs the rows at Gate B (D015). V41 and V42 are provisional: the main session numbers the rows at the merge
 *  (wiki/qa/deviations.md ends at V37 today) and the product page's test pins the prefix ("deviations.md V4"). */
const faqApproved = (row: string, page: string) =>
  `deviations.md ${row} (the main session's D061 ruling (AP-30), for the founder's signature at Gate B (D015), 2026-10-15; ${page}; CMO review of the advisor's proposal; task 8c.4)`;

export const FAQ_FIXES = {
  home: {
    edits: [rewrite(".kh-faq__q span", NOT_RIGHT_QUESTION.mockup, NOT_RIGHT_QUESTION.build)],
    mockup: [NOT_RIGHT_QUESTION.mockup],
    build: [NOT_RIGHT_QUESTION.build],
    /* The question is three characters longer and may wrap to another height on a phone, moving every chunk below. */
    hidden: { both: [faqAt(4)], mockup: [], build: [] },
    reason: "Home's fourth question in the parent's words, \"What if my child doesn’t like it?\" (AP-30); its answer unchanged",
    approvedBy: faqApproved("V41", "home.md fold 8"),
  },
  "meet-kheelu": {
    edits: [
      {
        at: ".kh-faq__item",
        was: `${FIRST_WEEK.question}${FIRST_WEEK.answer}`,
        now: `${faqItem(FIRST_WEEK.question, FIRST_WEEK.answer)}${faqItem(LANGUAGES_FAQ.question, LANGUAGES_FAQ.answer)}`,
      },
    ],
    mockup: [],
    build: [LANGUAGES_FAQ.question, ...sentences(LANGUAGES_FAQ.answer)],
    /* A ninth question: one more row moves the close below it; the build's alone holds it. */
    hidden: { both: [], mockup: [], build: [faqAt(8)] },
    reason: "the product page answers \"Which languages does Kheelu speak?\" after the first-week question: the named languages and the ceiling, switching mid-sentence in AI mode (facts.md; D017; film 6)",
    approvedBy: faqApproved("V42", "meet-kheelu.md fold 8"),
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type FaqFixesSlug = keyof typeof FAQ_FIXES;
const FAQ_FIXES_WHOSE = "task 8c.4's FAQ fixes (D061)";
/* Task 8c.2's offer additions (D061 item 3, and the main session's D061 ruling on the share link; the CMO's review,
   wiki/qa/cmo-review-advisor-proposal-2026-10-15.md, AP-28). Two lines the frozen mockup (D046) does not have, on both
   offer cards, each a deviation row the main session files in wiki/qa/deviations.md and the founder signs at Gate B
   (D015):
   - the later price, in token mode only, a plain line under the amount in the DS card's later-price place (never struck
     through, no counter, no "save"; PRICE-01, DARK-01): "₹4,999 for the first 500 units. ₹7,999 once they are gone.";
   - "Know a parent who needs this? Share Kheelu on WhatsApp", the live site's label, last in the offer's column: a ghost
     link that opens WhatsApp with the message share.ts holds (tracked `share-whatsapp`, architecture §8.3).
   In page-facts.ts's form, applied after a page's earlier rules (editsBeforeClaimFixes, then CLAIM_FIXES): `edits` add
   the two lines to that mockup (the help line under the card is written out again, the share link after it), the build
   prints four sentences more and none fewer, and the pixels compare each page without the two added blocks on the
   build's side. The text pass reads token mode (no store in the parity build). The share link's address is the offer's
   own (buildOffer, so the rule follows share.ts; src/content/en-IN/share.test.ts holds its words). OfferSection.test.tsx
   proves each page's rule against the mockup. */
const OFFER_LATER = ["₹4,999 for the first 500 units.", "₹7,999 once they are gone."] as const;
const OFFER_SHARE = ["Know a parent who needs this?", "Share Kheelu on WhatsApp"] as const;
const OFFER_ADDITIONS_WHOSE = "task 8c.2's offer additions (D061)";
const OFFER_ADDITIONS_APPROVED =
  "deviations.md rows for task 8c.2, numbered at the merge (founder, D061 item 3, and the main session's D061 ruling on the share link, 2026-10-15; task 8c.2)";
/** Each card's help line as the mockup prints it, then the share link after it (mockup markup: `mk-` names, read as the
 *  build's `ks-` by the comparisons). */
const helpThenShare = (): string =>
  `<p class="kh-body-s mk-help">${icon("whatsapp-logo")} Questions? <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483" class="mk-nowrap">call +91 91875 46483</a></p>` +
  `<div class="kh-section__actions mk-offer-share"><a href="${buildOffer("token").share?.href ?? ""}" class="kh-btn kh-btn--ghost" data-ph-capture-attribute-cta="share-whatsapp"><span>${OFFER_SHARE.join(" ")}</span></a></div>`;
const offerAdditions = (fold: string) => ({
  edits: [
    {
      at: ".kh-offer__prices",
      was: "₹4,999incl. GST",
      now: `<span class="kh-offer__price">₹4,999</span><span class="kh-body-s">incl. GST</span><p class="kh-body-s mk-offer__later">${OFFER_LATER.join(" ")}</p>`,
      inner: true,
    },
    { at: `${fold} .mk-help`, was: "Questions? WhatsApp or call +91 91875 46483", now: helpThenShare() },
  ] satisfies FactEdit[],
  mockup: [],
  build: [...OFFER_LATER, ...OFFER_SHARE],
  /* The later line makes the card taller and the share link the column longer, at every width: each moves what is below
     it. The build's side alone, as nothing on the mockup's stands for them. */
  hidden: { both: [], mockup: [], build: [".ks-offer__later", ".ks-offer-share"] },
  reason: "the later price under the amount while the first-500 price is live, and the share link under the offer card (D061)",
  approvedBy: OFFER_ADDITIONS_APPROVED,
});
export const OFFER_ADDITIONS = {
  home: offerAdditions("#close"),
  "meet-kheelu": offerAdditions("#offer"),
} as const satisfies Readonly<Record<string, PageFacts>>;
export type OfferAdditionsSlug = keyof typeof OFFER_ADDITIONS;
/** The pixels' rows for a page's offer additions: the two added blocks, on the build's side. */
const offerAdditionsHidden = (slug: OfferAdditionsSlug): VisualHide[] =>
  OFFER_ADDITIONS[slug].hidden.build.map((selector) => ({
    side: "build",
    selector,
    reason: `a line ${OFFER_ADDITIONS_WHOSE} add, which the mockup does not have; compared by the text pass`,
    approvedBy: OFFER_ADDITIONS_APPROVED,
  }));

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
   line, replies generated by an AI model given child-safety rules and the age, with Google's safety filters on top, the
   internet item titled "No web browsing." and saying "browse or search" (/safety's and the footer's words since task
   8b.1), and no "Tested by us first" item. Its copy page carries each changed line ("Changes after approval (task 8b.2a)"), passed by
   the CMO's review (wiki/qa/cmo-review-guides-d058-8b.2a-2026-10-14.md); the founder signs them at Gate B (D015). The
   other two approved articles say none of the withdrawn claims. In page-facts.ts's form: `edits` turn the frozen
   mockup's facts into the build's (approved-articles.test.tsx holds the reading column to the mockup with them applied,
   markup and words alike), and `mockup` and `build` are the sentences they change, for the text pass (the same test
   proves them exactly those). The retention line is policies.ts's (task 8b.1 owns its words), so the sentences it
   changes are read from it, against the frozen mockup's (RETENTION.mockup). One rule for the page: task 8b.1's retention
   fix for this guide is part of this one (merge ruling, waves 8b.1 and 8b.2a). The shared lines are task 8b.1's
   (QUIET, IN_INDIA, PROVIDERS, rewrite). */

/** The sentences of `lines` that `not` lacks, in order. */
const sentencesBeyond = (lines: string, not: string) => sentences(lines).filter((line) => !sentences(not).includes(line));
/** One of the article's facts (TrustList `facts`): its bold lead-in, then the body. */
const factBody = (title: string, body: string) => `<strong class="kh-label">${title}</strong> ${body}`;
/** A fact the fixes reword: found by its words, its lead-in kept unless `retitle` gives another. */
const refact = (title: string, was: string, now: string, retitle = title): FactEdit => rewrite(".kh-trust__body", `${title} ${was}`, factBody(retitle, now));

const SAFE_AI_TOY_FACTS = {
  microphone:
    "It turns on only when someone presses the wake-up button, and a light on Kheelu shows whenever it’s listening. It switches itself off after about a minute of quiet. Kheelu has no camera.",
  internet: {
    title: { was: "No open internet.", now: "No web browsing." },
    browse: { was: "Kheelu can’t browse the internet.", now: "Kheelu can’t browse or search the internet." },
    was: "Its answers come from a curated, closed content library, and every reply passes an age-graded safety layer set to the age you enter in the parent app.",
    now: [
      "Its answers are generated by an AI model.",
      "On every conversation, the model is given child-safety rules and the age you enter in the parent app, with Google’s safety filters on top.",
    ],
  },
  tested: ["Tested by us first.", "We attack our own safety layer before every release."],
} as const;
/** Fold 4's third answer (task 8b.1b; the main session's ruling, the CMO's m13 form for the buyer's guide's check 4):
 *  ask how you delete, a bar Kheelu meets by deleting the account, where "delete any of it yourself" set one D058 item 1
 *  withdrew (removing a chat hides it on that phone). The copy page's question 4, applied as (a). */
const DELETION_BAR = {
  answer:
    "You would not leave your child with a babysitter who won’t tell you how the afternoon went. Ask whether you can read every conversation, word for word, and delete any of it yourself, without emailing anyone. A summary is not the conversation.",
  from: "and delete any of it yourself",
  to: "and how you delete it",
} as const;
/** Fold 4's questions, as the visual pass names the reworded answer on both pages (the mockup's `mk-`, the build's
 *  `ks-` block): the third question's paragraph. */
const SAFE_AI_TOY_DELETION_ANSWER = ".mk-questions > p:nth-of-type(3), .ks-questions > p:nth-of-type(3)";
const READ_EVERY = "You can read every conversation in the parent app.";
const DELETE_BY_ACCOUNT = "Delete them all sooner by deleting your account.";
const firstSentenceWith = (text: string, part: string) => sentences(text).find((line) => line.includes(part))!;
/** The safe-AI-toy guide's facts list, as the visual pass names its items on both pages. */
const safeAiToyFact = (n: number) => `.kh-trust > .kh-trust__item:nth-child(${n})`;

export const ARTICLE_CLAIM_FIXES = {
  "story-what-to-look-for-in-a-safe-ai-toy": {
    edits: [
      swap("p", DELETION_BAR.answer, DELETION_BAR.from, DELETION_BAR.to),
      refact("The microphone.", SAFE_AI_TOY_FACTS.microphone, SAFE_AI_TOY_FACTS.microphone.replace(QUIET.from, QUIET.to)),
      refact("Your child’s voice.", PROVIDERS, PROVIDERS.replace(IN_INDIA, "")),
      refact("Every conversation.", `${READ_EVERY} ${RETENTION.mockup}`, `${READ_EVERY} ${RETENTION_LINE} ${DELETE_BY_ACCOUNT}`),
      refact(
        SAFE_AI_TOY_FACTS.internet.title.was,
        `${SAFE_AI_TOY_FACTS.internet.browse.was} ${SAFE_AI_TOY_FACTS.internet.was}`,
        [SAFE_AI_TOY_FACTS.internet.browse.now, ...SAFE_AI_TOY_FACTS.internet.now].join(" "),
        SAFE_AI_TOY_FACTS.internet.title.now,
      ),
      { at: ".kh-trust__body", was: SAFE_AI_TOY_FACTS.tested.join(" "), scope: ".kh-trust__item", now: null },
    ],
    mockup: [
      firstSentenceWith(DELETION_BAR.answer, DELETION_BAR.from),
      firstSentenceWith(SAFE_AI_TOY_FACTS.microphone, QUIET.from),
      firstSentenceWith(PROVIDERS, IN_INDIA),
      ...sentencesBeyond(RETENTION.mockup, RETENTION_LINE),
      SAFE_AI_TOY_FACTS.internet.title.was,
      SAFE_AI_TOY_FACTS.internet.browse.was,
      SAFE_AI_TOY_FACTS.internet.was,
      ...SAFE_AI_TOY_FACTS.tested,
    ],
    build: [
      firstSentenceWith(DELETION_BAR.answer, DELETION_BAR.from).replace(DELETION_BAR.from, DELETION_BAR.to),
      firstSentenceWith(SAFE_AI_TOY_FACTS.microphone, QUIET.from).replace(QUIET.from, QUIET.to),
      firstSentenceWith(PROVIDERS, IN_INDIA).replace(IN_INDIA, ""),
      ...sentencesBeyond(RETENTION_LINE, RETENTION.mockup),
      DELETE_BY_ACCOUNT,
      SAFE_AI_TOY_FACTS.internet.title.now,
      SAFE_AI_TOY_FACTS.internet.browse.now,
      ...SAFE_AI_TOY_FACTS.internet.now,
    ],
    /* Fold 4's reworded answer and the four reworded facts wrap to other heights on both sides (each moves every block
       below it, and from 1200 px a fact moves its row); the fact that came off is hidden on the mockup's side, so the two
       lists hold the same items in the same cells. */
    hidden: {
      both: [SAFE_AI_TOY_DELETION_ANSWER, ...[1, 2, 3, 5].map((n) => `${safeAiToyFact(n)} > .kh-trust__body`)],
      mockup: [safeAiToyFact(8)],
      build: [],
    },
    reason:
      "the guide's facts in the live team's code-checked words (D058): a couple of minutes of quiet, no place on the providers line, deletion by deleting the account, replies generated by an AI model with child-safety rules and Google's safety filters, the internet item in /safety's words (\"No web browsing.\", \"browse or search\"); the \"Tested by us first\" fact comes off; fold 4's third answer asks how you delete (task 8b.1b)",
    approvedBy:
      "deviations.md V37 (founder, D058, 2026-10-14; story-what-to-look-for-in-a-safe-ai-toy.md, \"Changes after approval (task 8b.2a)\" and \"(task 8b.1b)\"; CMO review cmo-review-guides-d058-8b.2a-2026-10-14.md passed; tasks 8b.2a and 8b.1b)",
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

/* Wave 8c, task 8c.3 (D061 item 4 and the main session's rulings on the advisor's proposal, 2026-10-15): blocks the
   approved pages do not have, added on purpose. On Home and the product page, parents' own words under the films (two
   DS quote cards, films.ts `filmQuotes`, each with its "Watch the film" button) and the "Recognised by." strip after the
   films (the /team strip as built, D054 item 20); on the product page, before "How it works", the four steps and the
   labelled example conversation (home.md fold 2 variant b). Nothing of the approved pages changes, so the pixels compare
   each page without them (the build side hides them and every fold below lines up), and the text pass accepts their
   sentences on the build side only: no mockup line is excused. The steps' and the example's words are spelled here
   because Playwright cannot load the product page's module (it imports images); its page.test.tsx holds them to
   products/kheelu/page.ts. The rows themselves are the main session's, in wiki/qa/deviations.md (drafted in the task's
   report). */
export const PROOF_ADDITIONS_APPROVED = "D061 item 4 and the main session's 8c rulings (founder, 2026-10-15; task 8c.3; deviations.md rows to come)";
/** The four steps on the product page (task 8c.3; D018, D017, D036: "remembers" beside the parent's control). */
export const PROOF_STEPS_BUILD = [
  "What happens when your child presses it.",
  "Press and ask.",
  "Your child presses the wake-up button and asks. A light shows Kheelu is listening.",
  "Kheelu answers.",
  "It answers the question first.",
  "Then it asks one back.",
  "A question back, so your child does the thinking.",
  "Next time, it remembers.",
  "It remembers earlier conversations, so it can pick up where your child stopped. You can read every one of them.",
] as const;
/** The example conversation on the product page, word for word as home.md fold 2 variant b, line by line as it shows:
 *  the heading, the label, each speaker and their words, then the line after. */
export const PROOF_EXAMPLE_BUILD = [
  "What asking back sounds like.",
  "Illustrative example, not a recording.",
  "Your child",
  "“Why does the moon follow our car?”",
  "Kheelu",
  "“The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
  "Your child",
  "“My shadow?”",
  "It answers first, then asks a question back. That’s how your child ends up doing the thinking.",
] as const;
/** The strip's words as the page prints them: its heading and the programmes shown as text (the NVIDIA and nasscom
 *  marks carry theirs as alt text; TEAM_STRIP_BUILD, held to team.ts by its parity test). */
const RECOGNITION_BUILD = ["Recognised by.", ...TEAM_STRIP_BUILD] as const;
/** The quotes' words as the page prints them: each quote, its speaker and role, and its button's words. */
const QUOTES_BUILD = [...filmQuotes.items.flatMap((q) => [q.quote, q.name, q.role]), filmQuotes.watch];
/** Each block the task adds, by page: the build-side selectors the pixels hide (each finds one block on its page; the
 *  pages' unit tests check), and the lines it prints. */
export const PROOF_ADDITIONS = {
  home: {
    selectors: [".ks-film-quotes", 'section[aria-labelledby="recognised-title"]'],
    build: [...QUOTES_BUILD, ...RECOGNITION_BUILD],
  },
  "meet-kheelu": {
    selectors: [
      ".ks-film-quotes",
      'section[aria-labelledby="recognised-title"]',
      'section[aria-labelledby="steps-title"]',
      'section[aria-labelledby="example-title"]',
    ],
    /* The steps' numerals are lines of their own in the page's text (kh-step__num, hidden from screen readers only). */
    build: [...QUOTES_BUILD, ...RECOGNITION_BUILD, ...PROOF_STEPS_BUILD, "1", "2", "3", "4", ...PROOF_EXAMPLE_BUILD],
  },
} as const;
type ProofSlug = keyof typeof PROOF_ADDITIONS;
const proofHidden = (slug: ProofSlug): VisualHide[] =>
  PROOF_ADDITIONS[slug].selectors.map((selector) => ({
    side: "build",
    selector,
    reason: "a block task 8c.3 adds (parents' quotes, the recognition strip, the steps, the example); the approved page has none, so the pixels compare without it",
    approvedBy: PROOF_ADDITIONS_APPROVED,
  }));
/** Nothing of the approved page is excused (a regex no sentence matches); the build's added lines are accepted. */
const proofText = (slug: ProofSlug): TextDeviation => ({
  mockup: /(?!)/,
  build: oneOf(PROOF_ADDITIONS[slug].build.flatMap((line) => sentences(line))),
  reason: "the lines of the blocks task 8c.3 adds: parents' quotes, the recognition strip, and on the product page the four steps and the example conversation",
  approvedBy: PROOF_ADDITIONS_APPROVED,
});

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
    /* The order summary's small print (V34, task 8b.1), compared by the text pass. */
    ...factsHidden(CLAIM_FIXES.store, CLAIM_FIXES_WHOSE),
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
  /* The screen-time guide card's line (V18, task 7.1b), then the parent-app bullets and the safety bodies (V26, task 8b.1),
     then the fourth question (task 8c.4, D061), compared by the text pass; then the offer card's later price and the
     share link the build adds (task 8c.2, D061); then the quotes and the strip (task 8c.3). */
  home: [
    ...factsHidden(COPY_FIXES.home, COPY_FIXES_WHOSE),
    ...factsHidden(CLAIM_FIXES.home, CLAIM_FIXES_WHOSE),
    ...factsHidden(FAQ_FIXES.home, FAQ_FIXES_WHOSE),
    ...offerAdditionsHidden("home"),
    ...proofHidden("home"),
  ],
  /* The open FAQ answer (V19, task 7.1b), then the facts, controls and retention card (V28, task 8b.1), compared by the
     text pass. */
  safety: [...factsHidden(COPY_FIXES.safety, COPY_FIXES_WHOSE), ...factsHidden(CLAIM_FIXES.safety, CLAIM_FIXES_WHOSE)],
  /* Check 4 and Kheelu's three answers (V31, task 8b.1), compared by the text pass. */
  "ai-toys-for-kids-in-india": factsHidden(CLAIM_FIXES["ai-toys-for-kids-in-india"], CLAIM_FIXES_WHOSE),
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
    /* Aman's job line and fold 4's keys line (V30, task 8b.1), compared by the text pass. */
    ...factsHidden(CLAIM_FIXES.team, CLAIM_FIXES_WHOSE),
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
    /* The age, languages, button and first-conversation lines (V29, task 8b.1), compared by the text pass. */
    ...factsHidden(CLAIM_FIXES.setup, CLAIM_FIXES_WHOSE),
  ],
  "meet-kheelu": [
    ...pageFactsHidden("meet-kheelu"),
    /* The sources line (V17, task 7.1b), compared by the text pass. */
    ...factsHidden(COPY_FIXES["meet-kheelu"], COPY_FIXES_WHOSE),
    /* The perk, the Good-to-know line, fold 5's words, fold 6's items and the Parent app row (V27, task 8b.1). */
    ...factsHidden(CLAIM_FIXES["meet-kheelu"], CLAIM_FIXES_WHOSE),
    /* The languages question, the build's alone (task 8c.4, D061), compared by the text pass. */
    ...factsHidden(FAQ_FIXES["meet-kheelu"], FAQ_FIXES_WHOSE),
    /* The offer card's later price and the share link the build adds (task 8c.2, D061). */
    ...offerAdditionsHidden("meet-kheelu"),
    /* The quotes, the strip, the steps and the example (task 8c.3). */
    ...proofHidden("meet-kheelu"),
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
    /* D058's claim fixes and the parent app's sections (V32, task 8b.1), compared by the text pass. */
    ...factsHidden(CLAIM_FIXES.privacy, CLAIM_FIXES_WHOSE),
  ],
  refund: pageFactsHidden("refund"),
  shipping: pageFactsHidden("shipping"),
  /* The founder's page facts (V14), then D058's claim fixes and the parent app's terms (V33, task 8b.1). */
  terms: [...pageFactsHidden("terms"), ...factsHidden(CLAIM_FIXES.terms, CLAIM_FIXES_WHOSE)],
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
    /* The order summary's small print (V34, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES.store),
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
     items, which the text pass does not read; Home's unit test holds them. The offer card's later price and the share link
     (task 8c.2, D061): OFFER_ADDITIONS above. The quotes and the strip (task 8c.3): PROOF_ADDITIONS above. Then D058's
     claim fixes (V26, task 8b.1), and the fourth question in the parent's words, which the text pass does read (task 8c.4,
     D061): FAQ_FIXES above. */
  home: [factsRule(COPY_FIXES.home), factsRule(OFFER_ADDITIONS.home), proofText("home"), factsRule(CLAIM_FIXES.home), factsRule(FAQ_FIXES.home)],
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
    /* The offer card's later price and the share link (task 8c.2, D061): OFFER_ADDITIONS above, before D058's claim
       fixes, which stay the page's last rule. */
    factsRule(OFFER_ADDITIONS["meet-kheelu"]),
    /* The quotes, the strip, the steps and the example (task 8c.3): PROOF_ADDITIONS above, before the claim fixes, which
       stay last. */
    proofText("meet-kheelu"),
    /* D058's claim fixes (V27, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES["meet-kheelu"]),
    /* The languages question (task 8c.4, D061): FAQ_FIXES above. Its answer sits in a closed item, which the text pass
       does not read; faqs.test.ts and the route's unit test hold it. */
    factsRule(FAQ_FIXES["meet-kheelu"]),
  ],
  /* The open FAQ answer and the closed one's "At 3:" line (V19, task 7.1b): COPY_FIXES above. */
  safety: [factsRule(COPY_FIXES.safety), factsRule(CLAIM_FIXES.safety)],
  /* The age answer's "At 3" sentence (V22, wave 8 merge): COPY_FIXES above. It sits in a closed item, which the text
     pass does not read; the route's unit test holds it. */
  "ai-toys-for-kids-in-india": [factsRule(COPY_FIXES["ai-toys-for-kids-in-india"]), factsRule(CLAIM_FIXES["ai-toys-for-kids-in-india"])],
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
    /* D058's claim fixes (V30, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES.team),
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
    /* D058's claim fixes (V29, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES.setup),
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
    /* D058's claim fixes and the parent app's sections (V32, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES.privacy),
  ],
  refund: [pageFacts("refund")],
  shipping: [pageFacts("shipping")],
  /* Section 8's refund timing (V21, task 7.1b): COPY_FIXES above. */
  terms: [pageFacts("terms"), factsRule(COPY_FIXES.terms), factsRule(CLAIM_FIXES.terms)],
};
