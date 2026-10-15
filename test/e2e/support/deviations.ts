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
import { SITE_DRAWINGS } from "@/components/ui/Icon/site-drawings";
import { HOSTS } from "@/config/env";
import { CONTACT_EMAIL, SUPPORT_WHATSAPP_HREF } from "@/config/site";
import { expertClip, expertFold } from "@/content/en-IN/expert-video";
import { filmQuotes } from "@/content/en-IN/films";
import { faqs } from "@/content/en-IN/faqs";
import { navigation } from "@/content/en-IN/navigation";
import { RETENTION_LINE, RETENTION_MONTHS } from "@/content/en-IN/policies";
import { product } from "@/content/en-IN/products/kheelu/product";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { MOCKUP_SLUGS, type MockupSlug } from "./mockup-text";
import { PAGE_FACTS, type FactEdit, type PageFacts, type PageFactsSlug } from "./page-facts";
import { sentences } from "./parity";
import { readRepoFile } from "./repo";
import { sellerFactsHidden, sellerFactsText } from "./seller-facts";

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
  /** The media query the hide applies under, for a change that shows at some widths only (the hero's phone board, D061
   *  item 1: "(max-width: 719px)"); without it, every width. */
  media?: string;
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

/** The DS icon as the mockups print it inline (mockup/build.mjs), for an item the fixes add; a drawing the site replaces
 *  (`SITE_DRAWINGS`: the WhatsApp logo, D064 item 3, task Q2.4) as the build draws it, as the comparison harness reads
 *  the mockup's own (test/support/mockup-compare.ts `parseMockup`). */
const icon = (name: IconName) =>
  `<svg class="kh-icon" viewBox="0 0 256 256" aria-hidden="true" focusable="false"><path d="${SITE_DRAWINGS[name] ?? ICON_PATHS[name]}"></path></svg>`;
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
      /* Section 9: the app's privacy settings, then what removing a chat and deleting the account do. Since G26 (D065
         item 7; task Q2.14) the settings list names "delete all chats, which deletes them from our servers;" and the way to
         delete a child's conversations starts with it; the block hides already serve (the list, the paragraph). */
      {
        at: "h3",
        was: "Deleting a conversation.",
        now:
          '<h3 class="kh-subtitle">In the parent app.</h3><p>In the app’s privacy settings, you can:</p>' +
          "<ul><li>turn off Save voice recordings, to keep the text of conversations only;</li><li>download your child’s data;</li><li>delete all chats, which deletes them from our servers;</li><li>delete your account.</li></ul>" +
          '<h3 class="kh-subtitle">Removing a chat, or deleting your account.</h3>',
      },
      {
        at: "p",
        was: "In the parent app, you can delete any conversation in one tap. It disappears from your app straight away. It is not removed from Kheelu’s memory, or from the data our model trains on.",
        now:
          "<p>Removing a chat in the parent app hides it on that phone only. It is not removed from our servers, from Kheelu’s memory, or from the data our model trains on. To delete your child’s conversations, use “Delete all chats” in the app, delete your account, or write to us.</p>" +
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
      "delete all chats, which deletes them from our servers;",
      "delete your account.",
      "Removing a chat, or deleting your account.",
      "Removing a chat in the parent app hides it on that phone only.",
      "It is not removed from our servers, from Kheelu’s memory, or from the data our model trains on.",
      "To delete your child’s conversations, use “Delete all chats” in the app, delete your account, or write to us.",
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
      "/privacy in the live team's code-checked words, with the parent app's sections of the live /privacy (#18): a couple of minutes, the voice to Kheelona's servers and the processors named (some outside India), Save voice recordings, the child's profile, the account and Kheelu's setup, no location, removing a chat against deleting the account, no one-tap delete; then “Delete all chats”, which deletes them from our servers (G26, D065 item 7; task Q2.14)",
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
   load every content module; faqs.test.ts holds each literal to faqs.ts.
   Task 8c.8 (the CMO's review of wave 8c, m7 and m8; the main session's rulings, 2026-10-15) adds to the product page's
   rule: its sixth question takes Home's words with its own second half, "What if my child doesn’t like it, or it stops
   working?" (the answer unchanged), and the languages answer's film name links to that film's tile in the strip (the words
   unchanged). */

/** Home's fourth question (faqs.ts `not-right-for-us`), in the parent's words; its answer stays word for word. */
export const NOT_RIGHT_QUESTION = {
  mockup: "What if it isn’t right for us?",
  build: "What if my child doesn’t like it?",
} as const;
/** The product page's sixth question (faqs.ts `returns-and-warranty`) in Home's words since task 8c.8 (m7), its second
 *  half kept; the answer stays as P15 left it (V6). */
export const RETURNS_QUESTION = {
  mockup: "What if it isn’t right for us, or stops working?",
  build: "What if my child doesn’t like it, or it stops working?",
} as const;
/** The product page's new question (faqs.ts `languages`), as the page prints it. Since task 8c.8 (m8) the film's name is
 *  an in-page link to film 6's tile, which carries the film's id; the strip's island plays the film when it is pressed. */
export const LANGUAGES_FAQ = {
  question: "Which languages does Kheelu speak?",
  answer:
    "Kheelu speaks up to 10 languages at launch, including English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French. In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them. You can watch it happen in the film “Two languages”.",
  film: { name: "“Two languages”", href: "#a-story-in-two-languages" },
} as const;
/** The languages answer as the page marks it up: the film's name a link to its tile (task 8c.8). */
const LANGUAGES_ANSWER_MARKUP = LANGUAGES_FAQ.answer.replace(LANGUAGES_FAQ.film.name, `<a href="${LANGUAGES_FAQ.film.href}">${LANGUAGES_FAQ.film.name}</a>`);
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
 *  (wiki/qa/deviations.md ends at V37 today) and the product page's test pins the prefix ("deviations.md V4"). Task 8c.8's
 *  two changes amend V42's row (m7, m8: the main session's rulings on the CMO's wave 8c review), named after it. */
const faqApproved = (row: string, page: string, more = "") =>
  `deviations.md ${row} (the main session's D061 ruling (AP-30), for the founder's signature at Gate B (D015), 2026-10-15; ${page}; CMO review of the advisor's proposal; task 8c.4${more})`;

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
      rewrite(".kh-faq__q span", RETURNS_QUESTION.mockup, RETURNS_QUESTION.build),
      {
        at: ".kh-faq__item",
        was: `${FIRST_WEEK.question}${FIRST_WEEK.answer}`,
        now: `${faqItem(FIRST_WEEK.question, FIRST_WEEK.answer)}${faqItem(LANGUAGES_FAQ.question, LANGUAGES_ANSWER_MARKUP)}`,
      },
    ],
    mockup: [RETURNS_QUESTION.mockup],
    build: [RETURNS_QUESTION.build, LANGUAGES_FAQ.question, ...sentences(LANGUAGES_FAQ.answer)],
    /* The sixth question (task 8c.8) is six characters longer and may wrap to another height, moving every row below it:
       both sides. A ninth question: one more row moves the close below it; the build's alone holds it. */
    hidden: { both: [faqAt(6)], mockup: [], build: [faqAt(8)] },
    reason:
      "the product page answers \"Which languages does Kheelu speak?\" after the first-week question: the named languages and the ceiling, switching mid-sentence in AI mode (facts.md; D017; film 6), the film's name a link that plays it (task 8c.8); and its sixth question in Home's words, \"What if my child doesn’t like it, or it stops working?\" (task 8c.8, the CMO's wave 8c review m7)",
    approvedBy: faqApproved("V42", "meet-kheelu.md fold 8", "; amended by task 8c.8 (CMO wave 8c review m7, m8)"),
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type FaqFixesSlug = keyof typeof FAQ_FIXES;
const FAQ_FIXES_WHOSE = "task 8c.4's FAQ fixes (D061)";
/* The offer additions: task 8c.2's (D061 item 3, and the main session's D061 ruling on the share link; the CMO's review,
   wiki/qa/cmo-review-advisor-proposal-2026-10-15.md, AP-28) and task 8c.5's (D061 item 10, confirming D034). Three lines
   the frozen mockup (D046) does not have, on both offer cards, each a deviation row the main session files in
   wiki/qa/deviations.md and the founder signs at Gate B (D015):
   - the later price, in token mode only, a plain line under the amount in the DS card's later-price place (never struck
     through, no counter, no "save"; PRICE-01, DARK-01): "₹4,999 for the first 500 units. ₹7,999 once they are gone.";
   - "Made in India", the seller's origin line (seller.ts `origin.line`; the footer and the product page's Country of
     origin say it already), last among the card's perks in both modes, with the DS house icon (map-pin is the delivery
     perk's) (task 8c.5; row V47);
   - "Know a parent who needs this? Share Kheelu on WhatsApp", the live site's label, last in the offer's column: a ghost
     link that opens WhatsApp with the message share.ts holds (tracked `share-whatsapp`, architecture §8.3), in a new tab
     with rel="noopener", as the D050 bubble does (task 8c.5, the 8c merge's follow-up).
   In page-facts.ts's form, applied after a page's earlier rules (editsBeforeClaimFixes, then CLAIM_FIXES): `edits` add
   the three lines to that mockup (the last perk and the help line under the card are written out again, the new perk
   and the share link after them), the build prints five sentences more and none fewer, and the pixels compare each page
   without the three added blocks on the build's side. The text pass reads token mode (no store in the parity build). The share link's address is the offer's
   own (buildOffer, so the rule follows share.ts; src/content/en-IN/share.test.ts holds its words). OfferSection.test.tsx
   proves each page's rule against the mockup. */
const OFFER_LATER = ["₹4,999 for the first 500 units.", "₹7,999 once they are gone."] as const;
const OFFER_SHARE = ["Know a parent who needs this?", "Share Kheelu on WhatsApp"] as const;
/** The perk task 8c.5 adds last on both cards: the seller's origin line (src/lib/offer/offer.test.ts holds it equal to
 *  seller.ts `origin.line`, and offer.ts's perk to it), with its DS icon. */
export const OFFER_ORIGIN_PERK = "Made in India";
/** The approved card's last perk (both cards end with it). It left both cards with task Q2.9's one perk list. */
const OFFER_LAST_PERK = "A GST invoice with every order";
/* Task Q2.9 (the selling update; the D2C plan v2 §2 fold 7, the CMO's m8; D065 items 3 and 6): one perk list on both offer
   cards, Home's order, read from the offer (offer.ts, through buildOffer, so the rule follows the content; offer.test.ts
   pins its words to the plan): the delivery line with the dispatch order first, the box, delivery anywhere, Kheelona+ with
   "Nothing renews without you.", Made in India last (task 8c.5's perk, now in the list itself). The frozen mockups' two
   lists (Home's four perks; the product page's five, its Kheelona+ perk in D058's words after task 8b.1's claim fix) are
   written out below, and the edit replaces each card's list whole. */
export const ONE_PERK_LIST = {
  /** Each frozen card's perks, in order, as the claim fixes leave them. */
  mockup: {
    home: ["Deliveries start mid-November", "In the box: Kheelu plush toy, charger and quick-start card", "Delivery anywhere in India, included", OFFER_LAST_PERK],
    "meet-kheelu": [
      "In the box: Kheelu plush toy, charger and quick-start card",
      KHEELONA_PLUS.build,
      "Delivery anywhere in India, included",
      "Deliveries start mid-November",
      OFFER_LAST_PERK,
    ],
  },
  /** The one list as the cards print it (token mode), with each perk's DS icon. */
  build: buildOffer("token").card.perks.home.map((perk) => ({ icon: perk.icon as IconName, text: toPlainText(perk.text, buildOffer("token")) })),
  approvedBy: "the D2C plan v2 §2 fold 7 and the CMO's m8 (founder's D065 items 3 and 6, the main session's rulings of the selling update, 2026-10-15; task Q2.9; its deviations.md row is the main session's)",
} as const;
const OFFER_ADDITIONS_WHOSE = "the offer additions of tasks 8c.2 and 8c.5 (D061), and task Q2.9's one perk list";
const OFFER_ADDITIONS_APPROVED =
  "deviations.md rows for task 8c.2, numbered at the merge (founder, D061 item 3, and the main session's D061 ruling on the share link, 2026-10-15; task 8c.2), and V47 for the Made in India perk (founder, D061 item 10, confirming D034; task 8c.5); then task Q2.9's one perk list (the D2C plan v2 §2 fold 7, CMO m8)";
/** The sentences of `lines` (each line a block of its own, as the text pass reads a list) that `not` lacks, counted. */
const linesBeyond = (lines: readonly string[], not: readonly string[]): string[] => {
  const left = not.flatMap((line) => sentences(line));
  return lines.flatMap((line) => sentences(line)).filter((s) => {
    const at = left.indexOf(s);
    if (at < 0) return true;
    left.splice(at, 1);
    return false;
  });
};
/** Each card's help line as the mockup prints it, then the share link after it (mockup markup: `mk-` names, read as the
 *  build's `ks-` by the comparisons). */
const helpThenShare = (): string =>
  `<p class="kh-body-s mk-help">${icon("whatsapp-logo")} Questions? <a href="https://wa.me/919187546483">WhatsApp</a> or <a href="tel:+919187546483" class="mk-nowrap">call +91 91875 46483</a></p>` +
  `<div class="kh-section__actions mk-offer-share"><a href="${buildOffer("token").share?.href ?? ""}" class="kh-btn kh-btn--ghost" data-ph-capture-attribute-cta="share-whatsapp" target="_blank" rel="noopener"><span>${OFFER_SHARE.join(" ")}</span></a></div>`;
const offerAdditions = (slug: keyof typeof ONE_PERK_LIST.mockup, fold: string) => {
  const was = ONE_PERK_LIST.mockup[slug];
  const now = ONE_PERK_LIST.build.map((perk) => perk.text);
  return {
    edits: [
      {
        /* The amount alone: its "incl. GST" note is task Q2.8's to take off (PRICE_LINE, below), before these edits. */
        at: ".kh-offer__prices",
        was: "₹4,999",
        now: `<span class="kh-offer__price">₹4,999</span><p class="kh-body-s mk-offer__later">${OFFER_LATER.join(" ")}</p>`,
        inner: true,
      },
      {
        /* Task Q2.9's one perk list, in place of the card's own (Made in India, task 8c.5's perk, its last item). */
        at: ".kh-offer__list",
        was: was.join(" "),
        now: ONE_PERK_LIST.build.map((perk) => `<li>${icon(perk.icon)}<span>${perk.text}</span></li>`).join(""),
        inner: true,
      },
      { at: `${fold} .mk-help`, was: "Questions? WhatsApp or call +91 91875 46483", now: helpThenShare() },
    ] satisfies FactEdit[],
    mockup: linesBeyond(was, now),
    build: [...OFFER_LATER, ...linesBeyond(now, was), ...OFFER_SHARE],
    /* The later line and the new list make the card taller and the share link the column longer, at every width: each
       moves what is below it. The build's side alone, as nothing on the mockup's stands for them (one offer card a page). */
    hidden: { both: [], mockup: [], build: [".ks-offer__later", ".kh-offer__list", ".ks-offer-share"] },
    reason:
      "the later price under the amount while the first-500 price is live, the one perk list (Made in India last, no GST invoice), and the share link under the offer card (D061; task Q2.9)",
    approvedBy: OFFER_ADDITIONS_APPROVED,
  };
};
export const OFFER_ADDITIONS = {
  home: offerAdditions("home", "#close"),
  "meet-kheelu": offerAdditions("meet-kheelu", "#offer"),
} as const satisfies Readonly<Record<string, PageFacts>>;
export type OfferAdditionsSlug = keyof typeof OFFER_ADDITIONS;
/** The pixels' rows for a page's offer additions: the three added blocks, on the build's side. */
const offerAdditionsHidden = (slug: OfferAdditionsSlug): VisualHide[] =>
  OFFER_ADDITIONS[slug].hidden.build.map((selector) => ({
    side: "build",
    selector,
    reason: `a line ${OFFER_ADDITIONS_WHOSE} add, which the mockup does not have; compared by the text pass`,
    approvedBy: OFFER_ADDITIONS_APPROVED,
  }));

/* Task Q2.8 (D065 item 3, the founder, 2026-10-15: GST and the payment breakdown only at checkout, "no need to mention
   about GST and other technical things at all places"; the main session's ruling 3 of the selling update): what the
   frozen mockup (D046) prints beside every "Pre-order Kheelu" on the selling pages, and what the build prints instead.
   - D028's long sentence (the heroes' and the CTA blocks' `mk-price`, the drawer's first note, the offer cards' fine
     print) becomes the short price line;
   - the "incl. GST" note beside the offer cards' amount comes off (the split's two rows keep their amounts);
   - the buy bar's small line says "in total", without GST;
   - the returns promise in the compact trust line (a trust line of exactly the delivery line and that promise: beside
     every button, and on the store's first screen, which may take it) and in the drawer's second note becomes the one
     risk-reversal line, in the same words everywhere it shows, and leads the line, the delivery line second (the D2C
     plan v2 §1.1: the trust line's item 1 and item 2);
   - since the task's review, the rows under the other buttons too (the plan's Home fold 7, product folds 3 and 12): the
     offer cards' rows (Home's close card: returns, warranty, paying, delivery included; the product page's: returns,
     warranty, paying) become the trust line, then the card's third row (warranty, paying), and the product close's
     five-item row becomes the trust line.
   The checkout keeps D028's sentence (the store's first screen, `#store-price`, and the form's `mk-price`) and its full
   trust row beside the pay button, returns promise and all. Literal, as the rest of this file (Playwright loads it):
   src/lib/offer/offer.test.ts and src/content/en-IN/trust.test.ts hold each line to the content. The mockup comparison
   harness applies these to every mockup a unit test reads (test/support/mockup-compare.ts `withPriceLine`); the text
   pass excuses them on every page, and the offer rows' words on the two pages that have them (PRICE_LINE_TEXT,
   PRICE_LINE_ROWS_TEXT, priceLineText), and the pixels hide the reflowed lines on both sides (PRICE_LINE_HIDDEN,
   visualHidden). The main session files the deviations.md row at the merge; the founder signs the
   words at Gate B (D015). Full mode, which no mockup shows, is the content's (offer.ts). */
export const PRICE_LINE_APPROVED =
  "D065 item 3 and the main session's ruling 3 of the selling update (founder, 2026-10-15; task Q2.8; deviations.md row to come)";
export const PRICE_LINE = {
  /** Beside every button outside the checkout: D028's sentence, then the short price line. */
  sentence: {
    mockup: "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    build: "₹499 today, refundable. ₹4,999 in total.",
  },
  /** Beside the offer cards' amount; it comes off. */
  cardNote: "incl. GST",
  /** The buy bar's small line. */
  bar: { mockup: "refundable · ₹4,999 total (incl. GST)", build: "refundable · ₹4,999 in total" },
  /** The compact trust line's returns promise, the mockup's second item, then the risk-reversal line, the build's first. */
  returns: { mockup: "7-day returns, no questions asked", build: "Full refund until dispatch · 7-day returns" },
  /** The compact trust line's delivery line, which stays: the mockup's first item, the build's second (in the drawer's
   *  second note too). */
  delivery: "Deliveries start mid-November",
  /** The full rows' other items: the offer cards' third row (warranty, paying) and the item that leaves them. */
  rows: { warranty: "6-month warranty", payment: "UPI, card or net banking", deliveryIncluded: "Delivery included anywhere in India" },
  reason:
    "the short price line beside every button, no GST note on the offer cards, the buy bar's line in total, and the one risk-reversal line first in the compact trust line and the drawer (D065 item 3: GST and the breakdown only at checkout; D2C plan v2 §1.1)",
  approvedBy: PRICE_LINE_APPROVED,
} as const;

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

/* Task Q2.11, /safety in the selling update (the D2C plan v2 §4, checked by the guard and the CMO; D064 item 2, D065
   items 5 and 7; the CMO's m6): what the page says and shows beyond the approved mockup with the page's earlier rules
   applied (task 7.1b's copy fixes, then task 8b.1's claim fixes):
   - fold 2: the third fact takes G26's deletion line ("Delete all chats" now deletes from the servers, D065 item 7), and
     a CTA block follows the four facts (`safety-facts`, with the short price line and the trust line, task Q2.8's);
   - fold 3: a sixth item, "No talking all day." (G28's daily limit, D065 item 5, in the CMO's m6 words; nobody is said
     to set it);
   - a new fold 4, "Every conversation, word for word.", moved from the product page (its words, screens, alts and
     caption, meet-kheelu.md fold 5 as task 8b.1 left it); its caption moves there from the parent controls, which keep
     no second copy of it (no line twice on the page), and the controls lose "See what the app shows you" (its target
     left the product page) and take G26's alt (the privacy centre's button to delete all chats named again);
   - the retention card's sentence about removing a single chat comes off (plan §14: not on file since the app changed).
   In page-facts.ts's form, applied after the claim fixes: `edits` turn that mockup into the build (the facts' list and
   the "never" fold rebuilt whole, because a fact edit replaces an element and these folds gain blocks), and `mockup` and
   `build` are the sentences they change, for the text pass (src/content/en-IN/pages/safety.test.ts proves them exactly
   those, and the route's test holds the build to the edited mockup). Before the claim fixes in the page's text rules, as
   Home's Q2.1 rule is, because only the FAQ fixes may follow those (pages/parity-deviations.test.ts). Literal, because
   Playwright cannot load the page module (it imports images); safety.test.ts holds each literal to pages/safety.ts. The
   deviations.md rows are the main session's, drafted in the task's report; the founder signs the words at Gate B
   (D015). */
const SAFETY_SELLING_APPROVED =
  "D064 item 2, D065 items 5 and 7 and the D2C plan v2 §4 (founder, 2026-10-15; CMO review of the plan v2, m6; task Q2.11; deviations.md rows to come)";
/** One DS trust item as the mockups print it (safety.html), its icon inlined. */
const trustLi = (name: IconName, title: string, body: string) =>
  `<li class="kh-trust__item"><span class="kh-trust__icon">${icon(name)}</span><div><h3 class="kh-trust__title">${title}</h3><p class="kh-trust__body">${body}</p></div></li>`;
/** The parent app's caption, on every page that shows its real screens (D044, D046). */
const APP_CAPTION = "The Kheelona app is live on Apple’s App Store and the Google Play Store.";
export const SAFETY_SELLING_LINES = {
  /** Fold 2, the third fact: G26's line in place of task 8b.1's "Delete them all by deleting your account." */
  readEvery: {
    was: "Yes, in the parent app, word for word, a few minutes after each one ends. Delete them all by deleting your account.",
    now: "Yes, in the parent app, word for word, a few minutes after each one ends. “Delete all chats” in the app deletes them from our servers.",
  },
  /** Fold 3's sixth item (G28; the CMO's m6). */
  dailyLimit: { title: "No talking all day.", body: "Each Kheelu has a daily limit on how long it talks." },
  /** Fold 4, from the product page (meet-kheelu.md fold 5 as task 8b.1 left it). */
  app: {
    eyebrow: "The parent app",
    title: "Every conversation, word for word.",
    accent: "word for word.",
    lead: "Each one appears in the parent app a few minutes after it ends. Search them, read a daily summary, or look back over the week or the month.",
    transcriptAlt: "A real parent-app screen showing a child’s conversation with Kheelu word for word, in Hindi and English.",
    activityAlt:
      "A real parent-app activity screen: a child’s talking time, chats and questions asked today, and each conversation listed by its first words.",
    caption: APP_CAPTION,
  },
  /** Fold 5's privacy screen, its alt as G26 has it (the plan v2 §4 fold 5); the months read from policies.ts, as the page's do. */
  privacyAlt:
    `A real screen from the Kheelu parent app: the privacy centre. Chats are kept for ${RETENTION_MONTHS} months, with a switch to save voice recordings and buttons to download your child’s data and to delete all chats.`,
  /** The controls' link that goes (its target, the product page's app fold, has left). */
  appLink: "See what the app shows you",
  /** Fold 6's second paragraph: task 8b.1's two sentences, then the second alone. */
  deleteAccount: {
    was: DELETE_ACCOUNT,
    now: "Deleting your account deletes your child’s profile, conversations and recordings from our servers.",
  },
} as const;
const L = SAFETY_SELLING_LINES;
/** Fold 2's four facts as the claim fixes left them, the third with G26's line, then its CTA block. */
const SAFETY_FACTS_LIST = [
  trustLi(
    "microphone",
    "Is Kheelu always listening?",
    "No. Kheelu has no wake word to listen for. Its microphone turns on only when someone presses the wake-up button. It stays on while your child is talking and switches itself off after a couple of minutes of quiet. Until the next press, nothing is heard, recorded or sent. A light on Kheelu shows whenever it’s listening.",
  ),
  trustLi("lock-simple", "How does Kheelu understand and answer my child?", PROVIDERS.replace(IN_INDIA, "")),
  trustLi("eye", "Can I read every conversation?", L.readEvery.now),
  trustLi("hand-heart", "Do you sell my child’s data?", "No. We don’t sell your data, and your child’s data is never used to advertise to them."),
].join("");
const SAFETY_FACTS_CTA =
  `<div class="kh-section__actions"><a href="store.html" class="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="safety-facts"><span>Pre-order Kheelu</span></a></div>` +
  `<div class="mk-beside"><p class="kh-body-s mk-price">${PRICE_LINE.sentence.build}</p><ul class="kh-trustline mk-trust">` +
  `<li><a href="refund.html#before-dispatch">${icon("arrow-counter-clockwise")}${PRICE_LINE.returns.build}</a></li>` +
  `<li><a href="shipping.html#when">${icon("truck")}<span>${PRICE_LINE.delivery}</span></a></li></ul></div>`;
/** Fold 3 with its sixth item, then the new fold 4. */
const SAFETY_NEVER_AND_APP =
  `<section class="kh-section" aria-labelledby="never-title"><div class="kh-container"><div class="kh-section__head"><header class="kh-heading"><p class="kh-eyebrow">Never</p><h2 class="kh-heading__title" id="never-title">What you <span class="kh-mark">won’t</span> find in Kheelu.</h2></header></div>` +
  `<ul class="kh-trust mk-sf-never" data-reveal>${[
    trustLi("eye-slash", "No camera.", "It can’t see your child or your home."),
    trustLi("speaker-high", "No screen.", "Your child talks and listens instead of watching."),
    trustLi("wifi-slash", "No web browsing.", "It can’t browse or search the web."),
    trustLi("x", "No ads.", "Not in the toy, and not in the parent app."),
    trustLi("smiley", "No secrets.", "It never asks your child to keep one from you."),
    trustLi("clock", L.dailyLimit.title, L.dailyLimit.body),
  ].join("")}</ul>` +
  `<div class="kh-section__actions"><a href="ai-toys-for-kids-in-india.html" class="kh-btn kh-btn--ghost"><span>How to choose an AI toy: five checks</span>${icon("arrow-right")}</a></div></div></section>` +
  `<section class="kh-section kh-section--band" aria-labelledby="app-title"><div class="kh-container"><div class="kh-split mk-app-split"><div><header class="kh-heading">` +
  `<p class="kh-eyebrow">${L.app.eyebrow}</p><h2 class="kh-heading__title" id="app-title">${L.app.title.replace(L.app.accent, `<span class="kh-hand">${L.app.accent}</span>`)}</h2>` +
  `<p class="kh-heading__lead">${L.app.lead}</p></header></div>` +
  `<figure class="mk-shots" data-reveal><div class="mk-shots__row">` +
  `<div class="kh-device mk-shot"><div class="kh-device__screen"><img loading="lazy" src="assets/app/app-transcript.webp" width="576" height="1209" alt="${L.app.transcriptAlt}"></div></div>` +
  `<div class="kh-device mk-shot"><div class="kh-device__screen"><img loading="lazy" src="assets/app/app-activity.webp" width="576" height="1209" alt="${L.app.activityAlt}"></div></div>` +
  `</div><figcaption class="kh-caption">${L.app.caption}</figcaption></figure></div></div></section>`;
export const SAFETY_SELLING: PageFacts = {
  edits: [
    { at: ".kh-trust__title", was: "Do you sell my child’s data?", scope: "ol", now: `<ol class="kh-trust mk-sf-list">${SAFETY_FACTS_LIST}</ol>${SAFETY_FACTS_CTA}` },
    { at: ".kh-heading__title", was: "What you won’t find in Kheelu.", scope: "section", now: SAFETY_NEVER_AND_APP },
    cutAround(".kh-btn", L.appLink, ".kh-section__actions"),
    cut('section[aria-labelledby="controls-title"] figcaption', APP_CAPTION),
    {
      at: 'img[src="assets/app/app-privacy.webp"]',
      was: "",
      now: `<img loading="lazy" src="assets/app/app-privacy.webp" width="576" height="1209" alt="${L.privacyAlt}">`,
    },
    rewrite("p.kh-body-l", L.deleteAccount.was, L.deleteAccount.now),
  ],
  mockup: ["Delete them all by deleting your account.", L.appLink, "Removing a chat in the app hides it on that phone."],
  build: [
    "“Delete all chats” in the app deletes them from our servers.",
    "Pre-order Kheelu",
    ...sentences(PRICE_LINE.sentence.build),
    PRICE_LINE.returns.build,
    PRICE_LINE.delivery,
    L.dailyLimit.title,
    L.dailyLimit.body,
    L.app.eyebrow,
    L.app.title,
    ...sentences(L.app.lead),
  ],
  /* Fold 2's CTA block and the new fold 4 on the build's side alone; the controls' link row on the mockup's alone. */
  hidden: {
    both: [],
    mockup: ['section[aria-labelledby="controls-title"] .kh-section__actions'],
    build: ["#facts .kh-section__actions", "#facts .ks-beside", 'section[aria-labelledby="app-title"]'],
  },
  reason:
    "/safety sells (the D2C plan v2 §4): a button after the four facts, G26's deletion line, the daily limit among the nevers, every conversation word for word moved here from the product page with the app's caption, the controls without their link to it and with G26's alt, and the retention card without the single-chat sentence",
  approvedBy: SAFETY_SELLING_APPROVED,
};
const SAFETY_SELLING_WHOSE = "task Q2.11's selling update";
/** The blocks the selling update moves without rewording, which no sentence rule can name (hiddenProblems needs a changed
 *  sentence inside): the "never" list, whose six items lay out three and three where the approved five lay out three and
 *  two (and the fifth runs full width from 720 px), on both sides; and the controls' caption, which moved to fold 4, on
 *  the mockup's side. Each finds one element on its side (safety.test.ts, the route's test). */
export const SAFETY_SELLING_LAYOUT_HIDDEN: readonly VisualHide[] = [
  ...(["mockup", "build"] as const).map((side) => ({
    side,
    selector: 'section[aria-labelledby="never-title"] .kh-trust',
    reason: "the \"never\" list: six items (the daily limit added, D065 item 5) lay out three and three; compared by the text pass",
    approvedBy: SAFETY_SELLING_APPROVED,
  })),
  {
    side: "mockup",
    selector: 'section[aria-labelledby="controls-title"] figcaption',
    reason: "the parent app's caption, moved to fold 4 with the screens it names (no line twice on the page)",
    approvedBy: SAFETY_SELLING_APPROVED,
  },
];

/* Task Q2.12, the selling update's closes (D064, D065; the D2C plan v2 §5-§10, wiki/site/d2c-conversion-plan-2026-10-15.md,
   with the CMO's conditions, wiki/qa/cmo-review-d2c-plan-v2-2026-10-15.md; the main session's rulings on §13 items 4
   and 5): every page that is not Home, the product page or /safety closes the way they do, with the same button, short
   price line and risk-reversal line (task Q2.8's CtaBlock and PriceSentence), and the plan's words change a few approved
   lines.
   - /setup: fold 6 drops G27's deletion sentences (§13 item 4 (a)); fold 7 drops "Don’t have Kheelu yet? Meet Kheelu";
     a new fold 8 closes the page: "Pre-order", "Don’t have Kheelu yet?", the lead, the button (`finale`, its placement
     registered under D065), the price line and the trust line, no help line, no picture;
   - the buyer's guide: fold 3's "Every conversation" answer in G26's words and its "Open internet" answer's last sentence
     as D065 item 8 confirms it, then a button after the fold (`guide-answers`), the price line and the trust line; fold 5's
     price question is Home's rewritten one (no GST, no first 500, no balance), faqs.ts `price-and-advance` (Home's own
     entry since task Q2.13, as the plan's §6 names it; the guide's copy of its words, `price-in-total`, left);
   - /team: fold 4's keys line in G26's words, and the close's new lead "Designed by parents in Bengaluru. Made in India.";
   - the journal: the close by topic (§7), so the safe-AI-toy guide (AI toys and safety) closes on "A toy you can check."
     (the hub and the learning guides keep the built close; the talking guides keep their keep-reading close, D054 item
     16, §13 item 5 (a));
   - the store's first screen: the eyebrow "Screen-free AI toy · Ages 3 to 7" (D065 item 1), and the films fold's heading
     and lead without "in real homes" (D057 item 2).
   /contact needed no change: its close already has the button, the price line and the trust line (task Q2.8), and its
   GSTIN went with task Q2.3. In page-facts.ts's form, applied after each page's earlier rules (its page facts and copy
   fixes, then its claim fixes): `edits` turn that mockup into the build, and `mockup` and `build` are the sentences they
   change, for the text pass (each page's parity-deviations unit test proves them exactly those). Literal, because
   Playwright cannot load every content module; each page's content test holds every literal to its module. The
   deviations.md rows are the main session's (the plan's §12 lists them); the founder signs the words at Gate B (D015). */
export const SELLING_CLOSES_APPROVED =
  "D065 and the D2C plan v2 §5-§10 (founder, 2026-10-15; the main session's rulings on §13 items 4-5; the CMO's review of v2; task Q2.12; deviations.md rows to come)";
const SELLING_CLOSES_WHOSE = "task Q2.12's selling closes (D065)";

/** The one price line, the risk-reversal line and the delivery line beside every button since task Q2.8, as the mockups
 *  read once the comparison harness has applied them (test/support/mockup-compare.ts `withPriceLine`): the lines a new
 *  CTA block prints. */
const SELLING_LINES = [...sentences(PRICE_LINE.sentence.build), PRICE_LINE.returns.build, PRICE_LINE.delivery] as const;
/** A CTA block as the approved mockups print one (mockup.css:27-28; the team and guide closes), with task Q2.8's lines:
 *  the chilli button, then the price line and the trust line (the risk-reversal line first), grouped. The store's address
 *  is the mockup's `store.html`; the trust links read their parts of /refund and /shipping by their words (the harness's
 *  `trustLinkHref`). */
const ctaBlockMarkup = ({ cta, center = false, arrow = false, block = false }: { cta: string; center?: boolean; arrow?: boolean; block?: boolean }) =>
  `<div class="kh-section__actions${center ? " kh-section__actions--center" : ""}">` +
  `<a href="store.html" class="kh-btn kh-btn--cta kh-btn--l${block ? " kh-btn--block" : ""}" data-ph-capture-attribute-cta="${cta}"><span>Pre-order Kheelu</span>${arrow ? icon("arrow-right") : ""}</a></div>` +
  `<div class="mk-beside${center ? " mk-beside--center" : ""}"><p class="kh-body-s mk-price">${PRICE_LINE.sentence.build}</p>` +
  `<ul class="kh-trustline mk-trust"><li><a href="refund.html">${icon("arrow-counter-clockwise")}${PRICE_LINE.returns.build}</a></li>` +
  `<li><a href="shipping.html">${icon("truck")}${PRICE_LINE.delivery}</a></li></ul></div>`;

/** /setup's new close (the plan's §5 fold 8): centred, no picture, no help line (fold 7 is the help). */
export const SETUP_CLOSE = {
  eyebrow: "Pre-order",
  title: { text: "Don’t have Kheelu yet?", markup: 'Don’t have Kheelu <span class="kh-hand">yet?</span>' },
  lead: "Day one takes your phone, the parent app and your home Wi‑Fi password.",
} as const;
/** /setup's fold 6, second paragraph: D058's claim-fixed words (V29), then the words G27's answer leaves (§13 item 4 (a)). */
export const SETUP_TALK_LINE = {
  claimFixed: "Later, open the parent app to read every word of it. Removing a chat in the app hides it on that phone. Deleting your account deletes every conversation and recording.",
  build: "Later, open the parent app to read every word of it.",
} as const;
/** /setup's fold 7 line that leaves (the plan's §5 fold 7: fold 8 does its job). */
const SETUP_MEET = "Don’t have Kheelu yet? Meet Kheelu";
/** /setup's fold 7 contact line: the approved one (with the call, which D063 item 2 took off: seller-facts.ts), then the
 *  plan's §5 fold 7 words, "Message us on WhatsApp" (the help line's verb, §1.1) or the email, no number. */
export const SETUP_CONTACT = {
  mockup:
    "WhatsApp or call us on +91 91875 46483, or email hello@kheelona.com. Tell us your order number, and what you see on Kheelu and in the app.",
  build: `Message us on WhatsApp or email ${CONTACT_EMAIL}. Tell us your order number, and what you see on Kheelu and in the app.`,
  markup: `<a href="${SUPPORT_WHATSAPP_HREF}">Message us on WhatsApp</a> or email <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Tell us your order number, and what you see on Kheelu and in the app.`,
} as const;
/** /setup's fold 7 as the approved mockup prints it, without that line, read from the frozen file so the contact line
 *  stays the mockup's own (task Q2.3's rules then read it as the build prints it). */
const SETUP_HELP_WITHOUT_MEET = (() => {
  const help = /<section class="kh-section" id="help"[\s\S]*?<\/section>/.exec(readRepoFile("mockup/setup.html"))?.[0];
  if (!help) throw new Error("mockup/setup.html: no section#help");
  const meet = /\s*<p class="kh-body mk-help mk-setup-meet">[\s\S]*?<\/p>/;
  if (!meet.test(help)) throw new Error("mockup/setup.html: no Meet Kheelu line in section#help");
  return help.replace(meet, "");
})();
const SETUP_CLOSE_MARKUP =
  `<section class="kh-section" id="close" aria-labelledby="close-title"><div class="kh-container">` +
  `<header class="kh-heading kh-heading--center"><p class="kh-eyebrow">${SETUP_CLOSE.eyebrow}</p>` +
  `<h2 class="kh-heading__title" id="close-title">${SETUP_CLOSE.title.markup}</h2><p class="kh-heading__lead">${SETUP_CLOSE.lead}</p></header>` +
  `${ctaBlockMarkup({ cta: "finale", center: true })}</div></section>`;

/** The buyer's guide's fold 3 answers, D058's claim-fixed words (V31), then the plan's §6 (G26; D065 items 7-8). */
export const GUIDE_ANSWERS = {
  conversation: {
    claimFixed: "Yes, in the parent app, word for word. Removing a chat in the app hides it on that phone. Deleting your account deletes the conversations and recordings from our servers.",
    build: "Yes, in the parent app, word for word. “Delete all chats” in the app deletes them from our servers.",
  },
  internet: {
    claimFixed:
      "It can’t browse the internet. Its answers are generated by an AI model. The model is given child-safety rules and your child’s age on every conversation, with Google’s safety filters on top. When it doesn’t know something, it says so.",
    from: "it says so.",
    to: "it says so instead of guessing.",
  },
} as const;
/** The guide's fold 3 link row as the approved mockup prints it; the new CTA block follows it. */
const GUIDE_SAFETY_LINK = `<div class="kh-section__actions"><a href="safety.html" class="kh-btn kh-btn--secondary">${icon("shield-check")}<span>See the full safety facts</span></a></div>`;
/** The guide's fifth question: the approved one (faqs.ts `how-much`, as the mockup prints it), then Home's rewritten price
 *  answer (the plan's §2 fold 10 question 3 and §6 fold 5; faqs.ts `price-and-advance`, Home's entry, since task Q2.13),
 *  in token mode. */
export const GUIDE_PRICE_FAQ = {
  mockup: {
    question: "How much is Kheelu?",
    answer:
      "Kheelu is ₹4,999 (incl. GST) for the first 500 units, with delivery anywhere in India included. A refundable ₹499 advance reserves yours today, and the remaining ₹4,500 is due before delivery. After the first 500, it is ₹7,999 (incl. GST), paid in full. You can pay by UPI, card or net banking, and you get a GST invoice.",
  },
  build: {
    question: "How much is Kheelu, and how does the advance work?",
    answer:
      "Kheelu is ₹4,999 in total, with delivery anywhere in India included. A refundable ₹499 reserves yours today, and the rest is due before delivery, by a payment link we send you. You can pay by UPI, card or net banking.",
  },
} as const;

/** /team's fold 4 keys line: D058's claim-fixed words (V30), then G26's (the plan's §8 fold 4; D065 item 7). */
export const TEAM_KEYS_LINE = {
  claimFixed:
    "And you hold the keys. You can read every conversation in the parent app, and delete them all by deleting your account. You set your child’s age, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
  build:
    "And you hold the keys. You can read every conversation in the parent app, and “Delete all chats” there deletes them from our servers. You set your child’s age, and Kheelu’s AI is given child-safety rules and that age on every conversation.",
} as const;
/** /team's close lead (the plan's §8 fold 6; D034, the footer's line). */
export const TEAM_CLOSE_LEAD = "Designed by parents in Bengaluru. Made in India.";

/** The journal close of the AI toys and safety topic (the plan's §7), against the built close every article shares. */
export const JOURNAL_SAFETY_CLOSE = {
  mockup: {
    title: "A toy that asks back.",
    lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It answers your child, then asks a question back.",
  },
  build: {
    title: { text: "A toy you can check.", markup: 'A toy you can <span class="kh-hand">check.</span>' },
    lead: "Kheelu by Kheelona is a screen-free plush toy for ages 3 to 7. It has no camera and can’t browse the internet, and you can read every conversation in the parent app.",
  },
} as const;

/** The store's first-screen eyebrow (D065 item 1) and its films fold's heading and lead (the plan's §10; D057 item 2). The
 *  eyebrow keeps the age band whole when it wraps beside the small Kheelu on a phone, as the event page's does (7.1c). */
export const STORE_WORDS = {
  eyebrow: {
    mockup: "Ages 3 to 7",
    build: "Screen-free AI toy · Ages 3 to 7",
    markup: 'Screen-free AI toy · <span class="mk-nowrap">Ages 3 to 7</span>',
  },
  filmsTitle: { mockup: "See Kheelu ask, in real homes.", build: "See Kheelu ask.", markup: 'See Kheelu <span class="kh-hand">ask.</span>' },
  filmsLead: { mockup: "Real children in real homes. Press play on any of them.", build: "Real children, real families. Press play on any of them." },
} as const;

/** Fold 3 of the guide and the FAQ's fifth item, by what both pages share (the build's CTA block by its place after the
 *  link row: the second actions row of the fold, and its group). */
const guideAnswer = (n: number) => `section[aria-labelledby="answers-title"] .kh-trust__item:nth-child(${n}) .kh-trust__body`;

export const SELLING_CLOSES = {
  setup: {
    edits: [
      rewrite("p.kh-body-l", SETUP_TALK_LINE.claimFixed, SETUP_TALK_LINE.build),
      { at: "p.mk-setup-meet", was: SETUP_MEET, scope: "section", now: `${SETUP_HELP_WITHOUT_MEET}${SETUP_CLOSE_MARKUP}` },
      rewrite("p.mk-setup-help", SETUP_CONTACT.mockup, SETUP_CONTACT.markup),
    ],
    mockup: [
      ...sentencesBeyond(SETUP_TALK_LINE.claimFixed, SETUP_TALK_LINE.build),
      ...sentencesBeyond(SETUP_CONTACT.mockup, SETUP_CONTACT.build),
      "Meet Kheelu",
    ],
    build: [...sentencesBeyond(SETUP_CONTACT.build, SETUP_CONTACT.mockup), SETUP_CLOSE.eyebrow, SETUP_CLOSE.lead, "Pre-order Kheelu", ...SELLING_LINES],
    /* Fold 6's paragraph is shorter at every width; the meet line comes off the mockup's fold 7; the new close is the
       build's alone. */
    hidden: { both: ['[aria-labelledby="talk-title"] .kh-body-l:nth-child(2)'], mockup: [".mk-setup-meet"], build: ["section#close"] },
    reason:
      "/setup's fold 6 without the deletion sentences (G27, §13 item 4 (a)), fold 7 in the plan's words (\"Message us on WhatsApp\") without its Meet Kheelu line, and a close of its own: the button, the price line and the trust line (D065; the D2C plan v2 §5)",
    approvedBy: SELLING_CLOSES_APPROVED,
  },
  "ai-toys-for-kids-in-india": {
    edits: [
      swap(".kh-trust__body", GUIDE_ANSWERS.internet.claimFixed, GUIDE_ANSWERS.internet.from, GUIDE_ANSWERS.internet.to),
      rewrite(".kh-trust__body", GUIDE_ANSWERS.conversation.claimFixed, GUIDE_ANSWERS.conversation.build),
      {
        at: 'section[aria-labelledby="answers-title"] .kh-section__actions',
        was: "See the full safety facts",
        now: `${GUIDE_SAFETY_LINK}${ctaBlockMarkup({ cta: "guide-answers", arrow: true, block: true })}`,
      },
      {
        at: ".kh-faq__item",
        was: `${GUIDE_PRICE_FAQ.mockup.question}${GUIDE_PRICE_FAQ.mockup.answer}`,
        now: faqItem(GUIDE_PRICE_FAQ.build.question, GUIDE_PRICE_FAQ.build.answer),
      },
    ],
    mockup: [
      ...sentencesBeyond(GUIDE_ANSWERS.internet.claimFixed, GUIDE_ANSWERS.internet.claimFixed.replace(GUIDE_ANSWERS.internet.from, GUIDE_ANSWERS.internet.to)),
      ...sentencesBeyond(GUIDE_ANSWERS.conversation.claimFixed, GUIDE_ANSWERS.conversation.build),
      GUIDE_PRICE_FAQ.mockup.question,
      ...sentences(GUIDE_PRICE_FAQ.mockup.answer),
    ],
    build: [
      ...sentencesBeyond(GUIDE_ANSWERS.internet.claimFixed.replace(GUIDE_ANSWERS.internet.from, GUIDE_ANSWERS.internet.to), GUIDE_ANSWERS.internet.claimFixed),
      ...sentencesBeyond(GUIDE_ANSWERS.conversation.build, GUIDE_ANSWERS.conversation.claimFixed),
      "Pre-order Kheelu",
      ...SELLING_LINES,
      GUIDE_PRICE_FAQ.build.question,
      ...sentences(GUIDE_PRICE_FAQ.build.answer),
    ],
    /* The two answers wrap to other heights; the new CTA block is the build's alone (its row after the link row, and its
       group); the fifth question is longer and may wrap. */
    hidden: {
      both: [guideAnswer(3), guideAnswer(4), 'section[aria-labelledby="faq-title"] .kh-faq__item:nth-child(5)'],
      mockup: [],
      build: [
        'section[aria-labelledby="answers-title"] .kh-section__actions + .kh-section__actions',
        'section[aria-labelledby="answers-title"] .ks-beside',
      ],
    },
    reason:
      "the guide's answers on deleting (G26) and on not knowing (D065 item 8), a button after them with the price line and the trust line, and Home's rewritten price question in place of the one with GST, the first 500 and the balance (D065 items 3-4; the D2C plan v2 §6)",
    approvedBy: SELLING_CLOSES_APPROVED,
  },
  team: {
    edits: [
      rewrite("p.kh-body-l", TEAM_KEYS_LINE.claimFixed, TEAM_KEYS_LINE.build),
      {
        at: "#close-title",
        was: "Bring Kheelu home.",
        now: `<h2 class="kh-heading__title" id="close-title">Bring Kheelu <span class="kh-hand">home.</span></h2><p class="kh-heading__lead">${TEAM_CLOSE_LEAD}</p>`,
      },
    ],
    mockup: sentencesBeyond(TEAM_KEYS_LINE.claimFixed, TEAM_KEYS_LINE.build),
    build: [...sentencesBeyond(TEAM_KEYS_LINE.build, TEAM_KEYS_LINE.claimFixed), ...sentences(TEAM_CLOSE_LEAD)],
    /* The keys line wraps to another height; the close's lead is the build's alone. */
    hidden: { both: ['[aria-labelledby="why-title"] .kh-body-l:nth-child(3)'], mockup: [], build: ["#close .kh-heading__lead"] },
    reason: "/team's keys line in G26's words, and the close's lead, Designed by parents in Bengaluru. Made in India. (D065 item 7, D034; the D2C plan v2 §8)",
    approvedBy: SELLING_CLOSES_APPROVED,
  },
  "story-what-to-look-for-in-a-safe-ai-toy": {
    edits: [
      rewrite("#close-title", JOURNAL_SAFETY_CLOSE.mockup.title, JOURNAL_SAFETY_CLOSE.build.title.markup),
      rewrite(".kh-heading__lead", JOURNAL_SAFETY_CLOSE.mockup.lead, JOURNAL_SAFETY_CLOSE.build.lead),
    ],
    mockup: [JOURNAL_SAFETY_CLOSE.mockup.title, ...sentencesBeyond(JOURNAL_SAFETY_CLOSE.mockup.lead, JOURNAL_SAFETY_CLOSE.build.lead)],
    build: [JOURNAL_SAFETY_CLOSE.build.title.text, ...sentencesBeyond(JOURNAL_SAFETY_CLOSE.build.lead, JOURNAL_SAFETY_CLOSE.mockup.lead)],
    /* The close's heading and lead wrap to other heights. */
    hidden: { both: ["#close .kh-heading"], mockup: [], build: [] },
    reason: "the AI toys and safety guides' close: \"A toy you can check.\", with no camera, no browsing and every conversation in the parent app (claims §1; the D2C plan v2 §7)",
    approvedBy: SELLING_CLOSES_APPROVED,
  },
  store: {
    edits: [
      rewrite(".kh-eyebrow", STORE_WORDS.eyebrow.mockup, STORE_WORDS.eyebrow.markup),
      rewrite("#ask-title", STORE_WORDS.filmsTitle.mockup, STORE_WORDS.filmsTitle.markup),
      rewrite(".kh-heading__lead", STORE_WORDS.filmsLead.mockup, STORE_WORDS.filmsLead.build),
    ],
    mockup: [STORE_WORDS.eyebrow.mockup, STORE_WORDS.filmsTitle.mockup, ...sentencesBeyond(STORE_WORDS.filmsLead.mockup, STORE_WORDS.filmsLead.build)],
    build: [STORE_WORDS.eyebrow.build, STORE_WORDS.filmsTitle.build, ...sentencesBeyond(STORE_WORDS.filmsLead.build, STORE_WORDS.filmsLead.mockup)],
    /* The longer eyebrow may wrap beside the small Kheelu; the films heading is shorter. */
    hidden: { both: ['section[aria-labelledby="store-title"] .kh-eyebrow', 'section[aria-labelledby="ask-title"] .kh-heading'], mockup: [], build: [] },
    reason: "the store's first-screen eyebrow (D065 item 1) and its films fold without \"in real homes\" (D057 item 2; the D2C plan v2 §10); the checkout unchanged",
    approvedBy: SELLING_CLOSES_APPROVED,
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type SellingClosesSlug = keyof typeof SELLING_CLOSES;

/** The passes a page's earlier rules make before task Q2.12's, each a pass of its own because each rewrites words an
 *  earlier one wrote: its page facts and copy fixes, then its claim fixes (an approved article's own), then its FAQ fixes.
 *  The mockup the selling closes start from is the frozen one through every pass. */
export function passesBeforeSellingCloses(slug: string): readonly (readonly FactEdit[])[] {
  const claims = CLAIM_FIXES[slug as ClaimFixesSlug]?.edits ?? ARTICLE_CLAIM_FIXES[slug as keyof typeof ARTICLE_CLAIM_FIXES]?.edits ?? [];
  return [editsBeforeClaimFixes(slug), claims, FAQ_FIXES[slug as FaqFixesSlug]?.edits ?? []].filter((pass) => pass.length > 0);
}

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
 *  the heading, the label, each speaker and their words. Since task 8c.8 (the CMO's wave 8c review, m11) without variant
 *  b's closing sentence, which step 3 already says (V46 amended). */
export const PROOF_EXAMPLE_BUILD = [
  "What asking back sounds like.",
  "Illustrative example, not a recording.",
  "Your child",
  "“Why does the moon follow our car?”",
  "Kheelu",
  "“The moon is very, very far away. So when the trees zoom past, the moon seems to stay with you. What else looks like it follows you?”",
  "Your child",
  "“My shadow?”",
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
/* Wave 8c, task 8c.6 (D061 items 12-13, the founder after the CMO's and the claims review's proposals): the expert clip,
   a fold the approved page does not have, on the product page right after the offer card and before task 8c.3's steps:
   the eyebrow, the heading, the poster with its chip and play control, then the credit and the disclosure. Nothing of
   the approved page changes, so the pixels compare the page without it (the build side hides it and every fold below
   lines up), and the text pass accepts its lines on the build side only. Its words are read from its content module
   (content/en-IN/expert-video.ts imports no image, so Playwright loads it); the eyebrow renders in capitals, as the
   browser reports it. The deviations.md row (V48) is the main session's, drafted in the task's report. */
export const EXPERT_CLIP_APPROVED = "D061 items 12-13 (founder, 2026-10-15; task 8c.6; deviations.md V48 to come)";
/** The fold, by its heading, and every line it prints, in order. */
export const EXPERT_CLIP = {
  selector: 'section[aria-labelledby="expert-title"]',
  build: [expertFold.heading.eyebrow, toPlainText(expertFold.heading.title), expertClip.chip, expertClip.credit, expertClip.disclosure],
} as const;
/** The clip's two rules, for the page that shows it: since task Q2.10 no longer the product page (task Q2.9 takes the
 *  clip to Home, D064 item 8). */
export const EXPERT_CLIP_HIDDEN: VisualHide = {
  side: "build",
  selector: EXPERT_CLIP.selector,
  reason: "the expert clip task 8c.6 adds after the offer card (D061 items 12-13); the approved page has none, so the pixels compare without it",
  approvedBy: EXPERT_CLIP_APPROVED,
};
/** Nothing of the approved page is excused (a regex no sentence matches); the fold's lines are accepted. */
export const EXPERT_CLIP_TEXT: TextDeviation = {
  mockup: /(?!)/,
  build: oneOf([expertFold.heading.eyebrow.toUpperCase(), ...EXPERT_CLIP.build.flatMap((line) => sentences(line))]),
  reason: "the lines of the expert clip task 8c.6 adds: its eyebrow, heading, chip, credit and disclosure",
  approvedBy: EXPERT_CLIP_APPROVED,
};
/* Kheelu on the first phone screen (D061 item 1, task 8c.1): under 720 px the hero's art is the board's phone
   composition, 4:3 right under the trust line (the help line and the secondary link follow it), where the approved
   page has the 1:1 board after them. Its words are the approved board's (the text pass compares them); its place and
   picture are new, so the visual pass compares the product page's phone hero without its art on both sides, and every
   fold below lines up again. Phones only: from 720 px the approved board shows, compared as before. (Home's hero had
   the same rule until task Q2.1 gave it the Kabir photo at every width: HOME_HERO_PHOTO.)
   The first screen itself (Kheelu, h1, button, price sentence; the WhatsApp bubble clear of Kheelu and the sticker) is
   test/e2e/first-screen.spec.ts's. */
const HERO_PHONE_ART_BY = "D061 item 1 (founder, 2026-10-15; task 8c.1; its deviations.md row is the main session's)";
const HERO_PHONE_ART: readonly VisualHide[] = [
  {
    side: "mockup",
    selector: ".mk-hero .kh-art",
    media: "(max-width: 719px)",
    reason: "the approved 1:1 hero board, after the help line and the secondary link: the build shows its phone composition under the trust line instead",
    approvedBy: HERO_PHONE_ART_BY,
  },
  {
    side: "build",
    selector: ".ks-hero .kh-art",
    media: "(max-width: 719px)",
    reason: "the hero board's phone composition (4:3, under the trust line, so Kheelu is on the first screen): new art in a new place, its words compared by the text pass",
    approvedBy: HERO_PHONE_ART_BY,
  },
];

/* Home's hero picture is the DS photo library's "Kabir · block rocket" (D064 item 4, task Q2.1), one of the DS web-hero
   photos (design-system 10-pages.md), where the approved page has the scrapbook board: two crops of it, the 4:5 from
   720 px and a 16:10 band under 720 px in the phone board's place under the trust line (D061 item 1). Another picture at
   every width, so the visual pass compares Home's hero without its picture on both sides at every width (the words
   column, button, price sentence, trust and help lines still compared); the first phone screen with the photo (Kheelu,
   h1, button, price sentence; the WhatsApp bubble clear of Kheelu and the boy's head) is test/e2e/first-screen.spec.ts's.
   A photo carries no board, so the board's word sticker ("It asks." / "They think.") went with it: the text pass's rule. */
export const HOME_HERO_PHOTO = {
  mockup: ".mk-hero .kh-art",
  build: ".ks-hero .kh-photo",
  /** The board's word sticker, its two lines as the text pass reads them. */
  sticker: ["It asks.", "They think."],
  approvedBy: "D064 item 4 (founder, 2026-10-15; task Q2.1; its deviations.md row is the main session's)",
} as const;
const HOME_HERO_PHOTO_HIDDEN: readonly VisualHide[] = [
  {
    side: "mockup",
    selector: HOME_HERO_PHOTO.mockup,
    reason: "the approved hero board, at every width: Home's hero picture is the Kabir photo in the build",
    approvedBy: HOME_HERO_PHOTO.approvedBy,
  },
  {
    side: "build",
    selector: HOME_HERO_PHOTO.build,
    reason: "the hero photo's two crops (4:5 from 720 px, 16:10 under the trust line on phones): a new picture, its alt compared by the unit tests",
    approvedBy: HOME_HERO_PHOTO.approvedBy,
  },
];
const HOME_HERO_PHOTO_TEXT: TextDeviation = {
  mockup: oneOf(HOME_HERO_PHOTO.sticker),
  reason: "the hero board's word sticker went with the board: Home's hero picture is the Kabir photo, which carries no sticker",
  approvedBy: HOME_HERO_PHOTO.approvedBy,
};

/* Home's films in the founder's order (D064 item 1, task Q2.1): the films list's 1, 4, 7, 2, 5, 6, 3 on Home's strip (the
   2nd film replaced by the 4th, the 3rd by the 7th); the list, and so the product page's and the store's strips, keep the
   approved order. The same seven films in other places: the text pass reads sentences in any order and needs no rule,
   and the visual pass compares Home's films fold without its strip of films on both sides (its heading, controls,
   proof line and CTA block still compared; the tiles themselves are the product page's to compare). */
export const HOME_FILMS_ORDER = {
  mockup: ".mk-films-wrap [data-films]",
  build: ".ks-films-wrap [data-films]",
  approvedBy: "D064 item 1 (founder, 2026-10-15; task Q2.1; its deviations.md row is the main session's)",
} as const;
const HOME_FILMS_ORDER_HIDDEN: readonly VisualHide[] = (["mockup", "build"] as const).map((side) => ({
  side,
  selector: HOME_FILMS_ORDER[side],
  reason: "Home's strip shows the films in the founder's order (the list's 1, 4, 7, 2, 5, 6, 3): the same films in other places",
  approvedBy: HOME_FILMS_ORDER.approvedBy,
}));

/* Task Q2.9, Home end to end (the selling update: D064, D065 and the main session's rulings of 2026-10-15; the copy: the
   D2C plan v2 §2, checked by the claims guard and the CMO): eleven folds in a new order, every one changed from the
   approved Gate A page (D046), and four approved folds gone (What is Kheelu?, the parent app, the comparison, the
   guides). No edit of the frozen mockup can turn it into this page, so Home's rules are fold by fold, one per deviation
   row (the rows are the main session's, numbered at the merge; the founder signs the words at Gate B, D015):
   - the pixels compare Home without its folds, on both sides: each approved fold is hidden on the mockup's side and
     each fold of the build on the build's (the selector names the fold by its heading), so the visual pass compares the
     nav and the footer, and nothing of a fold against another fold. The page itself is held by its unit test
     (src/content/en-IN/pages/home.test.tsx: every line, picture, button and link as the plan's v2), the first phone
     screen by test/e2e/first-screen.spec.ts, the layout by the sideways, axe and tap-target specs;
   - the text pass excuses, fold by fold, the approved sentences the fold no longer prints and accepts the sentences it
     prints instead (as the browser reads them at 390 px, eyebrows in capitals; the earlier Home rules above still excuse
     their own lines). Literal, as the rest of this file (Playwright cannot load the page module, which imports images);
     home.test.tsx holds every listed sentence to the approved page or to the page as it renders. */
export const HOME_SELLING_APPROVED =
  "D064, D065 and the D2C plan v2 §2 (founder, 2026-10-15; the main session's rulings of the selling update; CMO review of the plan v2; task Q2.9; deviations.md rows to come, one per fold)";
export type HomeSellingFold = {
  /** The approved fold it replaces (its heading's id on the mockup), if any. */
  readonly mockupFolds: readonly string[];
  /** The build's fold (its heading's id), if any. */
  readonly buildFold?: string;
  /** Approved sentences this fold no longer prints, and the sentences it prints instead (eyebrows in content case). */
  readonly mockup: readonly string[];
  readonly build: readonly string[];
  readonly reason: string;
};
export const HOME_SELLING = {
  hero: {
    mockupFolds: ["hero-title"],
    buildFold: "hero-title",
    mockup: ["Ages 3 to 7", "Kheelu answers every why.", "Then it asks one back.", "A screen-free plush toy by Kheelona.", "It answers your child first, then asks a question back, so they do the thinking.", "Questions?"],
    build: ["Screen-free AI toy · Ages 3 to 7", "The AI toy that answers every why, then asks your child one back.", "Kheelu by Kheelona is a soft plush rabbit.", "You can read every chat."],
    reason: "Fold 1, the hero: the founder's eyebrow and h1 (D065 item 1), the lead naming Kheelu and the brand, no help line (plan §1.1), the film link on laptops only (CMO M1, M2), the Kabir photo kept out of the bubble's column (ruling (a))",
  },
  films: {
    mockupFolds: ["ask-title"],
    buildFold: "films-title",
    mockup: ["See it ask", "Watch them think.", "Press play on any of them.", "See what else it does"],
    build: ["Seven films", "Watch the children do the thinking.", "Then hear from two of their parents."],
    reason: "Fold 2, the films: the product page's built heading (\"Real children, real families.\"), posters lazy (ruling 9), no CTA block and no link (fold 3's button is one screen below, DS 07-selling)",
  },
  recognised: {
    mockupFolds: [],
    buildFold: "recognised-title",
    mockup: [],
    build: ["Recognised by"],
    reason: "Fold 2's foot: \"Recognised by\" as a small label under the quotes, on the films' band (ruling 1; CMO m10)",
  },
  why: {
    mockupFolds: ["why-title"],
    buildFold: "why-title",
    mockup: ["Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain.", "They also support the early language and social skills that later, more complex thinking builds on.[1]", "You can do it anywhere, too: answer your child, then ask one back.", "why does the moon follow our car?", "Read more: how children learn by talking"],
    build: ["Harvard’s Center on the Developing Child says back-and-forth “serve and return” exchanges between a young child and a caring adult help build and strengthen neural connections in the child’s brain.[1]", "It doesn’t replace that time with you.", "Pre-order Kheelu"],
    reason: "Fold 3, why it matters: the Harvard sentence alone, the card's second sentence (faqs.ts speech), no Kabir frame (Kabir is the hero: one appearance a page), no link, and the button home-why",
  },
  languages: {
    mockupFolds: [],
    buildFold: "languages-title",
    mockup: [],
    build: ["Languages", "Kheelu speaks up to 10 languages at launch.", "Eight today: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish and French.", "In AI mode, it can switch between them mid-sentence: when your child changes language, Kheelu changes with them.", "Two languages · 0:31", "In AI mode, Arha switches to English, and Kheelu switches with her."],
    reason: "Fold 4, languages (D064 item 9): the ceiling, the eight languages and the switching line, the chips, and film 6 played in place",
  },
  asks: {
    mockupFolds: ["what-title"],
    buildFold: "asks-title",
    mockup: ["Modes and languages", "Kheelu by Kheelona is a screen-free plush rabbit that talks with children aged 3 to 7.", "It answers your child, then asks a question back.", "It has three modes: AI mode for open conversation on home Wi‑Fi, Story mode for stories, poems and jingles with no Wi‑Fi needed, and Bluetooth mode, which makes it a speaker for your phone.", "AI mode", "Open conversation, on your home Wi‑Fi.", "Story mode", "Stories, poems and jingles your child enjoys and learns from.", "No Wi‑Fi needed.", "Bluetooth mode", "Pair your phone and use it as a speaker.", "Up to 10 languages at launch", "It can switch between them mid-sentence.", "See what each mode does"],
    build: ["How it works", "Your child thinks.", "A soft plush rabbit.", "No screen.", "Kheelu is a cream plush rabbit with a speaker in its tummy.", "Your child talks and listens instead of watching.", "Press and ask.", "Your child presses the wake-up button and asks.", "A light shows Kheelu is listening.", "It answers, then asks one back.", "It answers the question first.", "Then it asks your child a question back, so they do the thinking.", "Illustrative example, not a recording.", "Your child", "“Why does the moon follow our car?”", "Kheelu", "“The moon is very, very far away.", "So when the trees zoom past, the moon seems to stay with you.", "What else looks like it follows you?”", "“My shadow?”", "And when it doesn’t know something, it says so instead of guessing.", "You read every conversation.", "Each one appears in the parent app, word for word, a few minutes after it ends.", "Kheelu remembers them too, so it can pick up where your child stopped.", "From age 3.", "Still asking back at 7.", "Made for children aged 3 to 7.", "It is not a toy for children under 3.", "You set your child’s age in the parent app, and Kheelu’s AI is given child-safety rules for that age.", "Pre-order Kheelu"],
    reason: "Fold 5, Kheelu asks (D064 items 7 and 10): six points in a sticky scroll in \"What is Kheelu?\"'s place (its answer is the FAQ's first), the labelled example under point 3, the line under the points, home-asks and home-asks-learn",
  },
  expert: {
    mockupFolds: [],
    buildFold: "expert-title",
    mockup: [],
    build: ["A video from an expert", "Watching isn’t talking.", "0:34", "Chaitra, therapist and developmental coach", "Kheelona made this video with Chaitra and compensated her for it."],
    reason: "Fold 6, the expert clip moved here from the product page (D064 item 8; D061 items 12-13), on the band",
  },
  offer: {
    mockupFolds: ["close-title"],
    buildFold: "offer-title",
    mockup: ["Questions?"],
    build: ["Pre-order", "There every day at home, with no screen to switch off.", "Kheelona+ is our paid subscription, on top of the free parent app."],
    reason: "Fold 7, the offer card moved up from the close (plan fold 7): the lead (CMO M4), the one perk list (CMO m8), the Kheelona+ note, no help line, home-offer",
  },
  safety: {
    mockupFolds: ["see-title", "safety-title"],
    buildFold: "safety-title",
    mockup: ["The parent app", "You see every conversation.", "Read every conversation in the parent app, word for word.", "Your child’s conversations stay in your parent app for 36 months, then they’re deleted automatically.", "See what the app shows you", "You’ll always see when it’s listening.", "Its microphone turns on only when someone presses the wake-up button.", "A light on Kheelu shows whenever it’s listening.", "Left alone, it hears nothing and sends nothing.", "How it understands and answers.", "They process your child’s voice only to produce Kheelu’s reply.", "They don’t keep it, and they never use it to train their AI.", "Our contracts with them say so.", "You can read every conversation.", "In the parent app.", "Your child’s data is never used to advertise to them.", "No camera", "It can’t browse the internet", "It says it’s a toy, and never asks your child to keep a secret from you"],
    build: ["It listens only after someone presses the wake-up button.", "No web browsing.", "You read every conversation in the parent app.", "Each Kheelu has a daily limit on how long it talks."],
    reason: "Fold 8, safety compact (D064 item 2): the parent-app fold and the safety fold merged into five one-line promises beside the privacy screen (G26's alt, D065 item 7; the daily limit, D065 item 5); the facts line and the app link gone",
  },
  day: {
    mockupFolds: [],
    buildFold: "day-title",
    mockup: [],
    build: ["Little moments", "A day with Kheelu, sunrise to bedtime.", "Not all day.", "A few moments, wherever the day goes.", "Breakfast", "The first ‘why’ of the day.", "Kheelu answers, then asks one back.", "AI mode · home Wi‑Fi", "After school", "Yesterday’s question, picked up where your child stopped: Kheelu remembers earlier conversations.", "While you cook", "A question to think about, not a cartoon to watch.", "At Nani’s", "Stories, poems and jingles in Story mode, with no Wi‑Fi needed.", "Story mode · no Wi‑Fi needed", "Bedtime", "One last story, lights low.", "In the parent app, you can see how long your child talked each day.", "Each Kheelu has a daily limit on how long it talks."],
    reason: "Fold 9, a day with Kheelu (plan fold 9; D065 item 5, D044): five moments and their modes, the closing line, the activity screen",
  },
  faq: {
    mockupFolds: ["faq-title"],
    buildFold: "faq-title",
    mockup: ["See all questions"],
    build: ["Isn’t this just screen time in disguise?"],
    reason: "Fold 10, the questions: the eight in the plan's order, \"What is Kheelu?\" first and \"Isn’t this just screen time in disguise?\" new, the price answer without GST (D065 items 3-4); no \"See all questions\" (ruling 1)",
  },
  close: {
    mockupFolds: [],
    buildFold: "close-title",
    mockup: [],
    build: ["For your own child, or as a gift for a 3 to 7 year old in the family."],
    reason: "Fold 11, the close: \"It asks. They think.\" with the product page's built lead, finale, a board with no cast child",
  },
  compare: {
    mockupFolds: ["compare-title"],
    mockup: ["Compare", "Thinking out loud, not tapping on a screen.", "Screen-free", "Kheelu: Yes", "Puzzles and activity books: yes", "Learning apps and videos: no", "Smart speakers and chatbots: varies", "Holds a back-and-forth conversation", "Puzzles and activity books: no", "Learning apps and videos: rarely, mostly tapping and watching", "Smart speakers and chatbots: yes", "Asks your child a question back", "Kheelu: Yes, after it answers", "Learning apps and videos: some ask quiz questions", "Smart speakers and chatbots: usually just answer", "You can read every conversation", "Kheelu: Yes, in the parent app", "Puzzles and activity books: nothing to read", "Learning apps and videos: nothing to read", "Kinds of products, not brands: what each one usually does.", "How to choose an AI toy"],
    build: [],
    reason: "The comparison leaves Home for the product page (ruling 1; task Q2.10)",
  },
  guides: {
    mockupFolds: ["guides-title"],
    mockup: ["Guides for parents", "How we can help, from 3 to 7.", "Short, sourced guides from the Kheelona team, for the questions every parent of a young child asks.", "Screen time", "Read the screen-time guides", "Talking and language", "Getting your child talking, late talkers, new words and two languages at home.", "Read the talking guides", "Learning and play", "What a young child is working on, and the toys and habits that serve it.", "Read the learning guides"],
    build: [],
    reason: "\"How we can help, from 3 to 7\" leaves Home (ruling 1: three links away)",
  },
} as const satisfies Readonly<Record<string, HomeSellingFold>>;
/** Each fold of either side hidden for the pixels, with its fold's reason. */
export const HOME_SELLING_HIDDEN: readonly VisualHide[] = Object.values(HOME_SELLING as Readonly<Record<string, HomeSellingFold>>).flatMap((fold) => [
  ...fold.mockupFolds.map((id) => ({ side: "mockup" as const, selector: `main > section[aria-labelledby="${id}"]`, reason: fold.reason, approvedBy: HOME_SELLING_APPROVED })),
  ...(fold.buildFold === undefined
    ? []
    : [{ side: "build" as const, selector: `main > section[aria-labelledby="${fold.buildFold}"]`, reason: fold.reason, approvedBy: HOME_SELLING_APPROVED }]),
]);
/** One text rule a fold: its approved lines excused, its new lines accepted, each also in capitals (an eyebrow). */
export const HOME_SELLING_TEXT: readonly TextDeviation[] = Object.values(HOME_SELLING as Readonly<Record<string, HomeSellingFold>>).map((fold) => ({
  mockup: fold.mockup.length ? oneOf([...fold.mockup, ...fold.mockup.map((line) => line.toUpperCase())]) : /(?!)/,
  build: fold.build.length ? oneOf([...fold.build, ...fold.build.map((line) => line.toUpperCase())]) : undefined,
  reason: fold.reason,
  approvedBy: HOME_SELLING_APPROVED,
}));

/* Home's close board top-aligned with the offer card on laptops (D064 item 5, task Q2.1): from 900 px, where the split
   begins, the board (the girl in the mustard frock beside Kheelu) starts level with the card's top instead of centred
   beside the taller column. The same board in another place, from 900 px only (below it the columns stack, as
   approved): the visual pass compares the close without its board on both sides there; the text pass needs no rule. */
export const HOME_OFFER_ART = {
  mockup: "#close .kh-split > .kh-art",
  build: "#close .kh-split > .kh-art",
  approvedBy: "D064 item 5 (founder, 2026-10-15; task Q2.1; its deviations.md row is the main session's)",
} as const;
const HOME_OFFER_ART_HIDDEN: readonly VisualHide[] = (["mockup", "build"] as const).map((side) => ({
  side,
  selector: HOME_OFFER_ART[side],
  media: "(min-width: 900px)",
  reason: "the close's board starts level with the offer card's top on laptops, where the approved split centres it",
  approvedBy: HOME_OFFER_ART.approvedBy,
}));

/* The selling update on the product page (task Q2.10; D064 items 2 and 8, D065 items 1, 3-6 and 8, the main session's
   rulings of 2026-10-15; the copy: the D2C plan v2 §3, checked by the claims guard and the CMO). Two groups, as the
   tasks before it split theirs:
   - SELLING_UPDATE, in page-facts.ts's form, applied after the page's earlier rules (its page facts, task 7.1b's copy
     fixes, task 8b.1's claim fixes, the offer additions, then task 8c.4's FAQ fixes): `edits` turn that mockup into the
     build, and `mockup` and `build` are the sentences they change (the route's unit test proves them exactly those):
     the hero's eyebrow and lead (D065 item 1; §3 fold 1) without the help line (§1.1: closes and the store only); the
     offer photo's alt with the page's keyword; Good to know's second line "instead of guessing" (D065 item 8) and a new
     fourth, the daily limit (D065 item 5); the parent-app fold and the safety fold off the page (D064 item 2: their
     words move to /safety, task Q2.11); the price answer with the total and no GST, balance or first 500 (D065 items
     3-4); "When does delivery start?" off (the offer card and the trust line carry the date) and "Will Kheelona+ charge me
     after the 6 months?" after the first-week question (D065 item 6, the CMO's M5). Then task Q2.13 (the follow-ups of
     the q2b merge): the offer card as both cards print it (PRODUCT_OFFER_CARD: the Kheelona+ note in the card, the price
     once, no help line; §3 fold 3, the CMO's m9), and Home's "Isn’t this just screen time in disguise?" fifth, in the
     delivery question's place (§3 fold 11, question 5).
   - SELLING_ADDITIONS: the blocks the approved page has nothing for, added on the build's side alone: the comparison
     moved from Home (§3 fold 8) and the safety line pointing to /safety (fold 9). The three sample chats (fold 6) are
     task 8c.3's example fold on tabs (ExampleConversation, task Q2.10), which PROOF_ADDITIONS already hides; their new
     lines are accepted here, and since task Q2.13 the recognition strip's label as Home's (§3 fold 4).
   The expert clip (task 8c.6) left the page for Home (task Q2.9), so its rules left this page's lists. Literal, as the
   rest of this file (Playwright loads it): the route's unit test (products/kheelu/page.test.tsx) holds every literal to
   the content modules. The deviations.md rows are the main session's, drafted in the task's report. */
export const SELLING_UPDATE_APPROVED =
  "D064 items 2 and 8, D065 items 1, 3-6 and 8, and the main session's rulings of the selling update (founder, 2026-10-15; the D2C plan v2 §3; task Q2.10; deviations.md rows to come)";
const SELLING_UPDATE_WHOSE = "task Q2.10's selling update (D064, D065)";
/** The product hero's words (§3 fold 1): the eyebrow as Home's (D065 item 1), the lead in the founder's words. */
export const PRODUCT_HERO = {
  eyebrow: { mockup: "Ages 3 to 7", build: "Screen-free AI toy · Ages 3 to 7" },
  lead: {
    mockup: "A screen-free plush toy from Kheelona. It answers your child, then asks a question back, so they do the thinking.",
    build: "A soft plush rabbit that answers every why, then asks one back.",
  },
  /** The approved help line under the hero's trust line, which §1.1 keeps to the closes and the store. */
  help: "Questions? WhatsApp or call +91 91875 46483",
} as const;
/** The offer photo's alt with the page's keyword, true of the picture (§3 fold 3). */
export const PRODUCT_OFFER_ALT = {
  mockup: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.",
  build: "Kheelu by Kheelona, the cream plush rabbit that talks back, with rainbow ears and a speaker in its tummy.",
} as const;
/** Good to know (§3 fold 7): the second line takes "instead of guessing" (D065 item 8), and the daily limit (D065 item 5)
 *  follows the wake-up line, which task 8b.1's claim fix left at "a couple of minutes". */
export const PRODUCT_KNOW = {
  browse: {
    mockup: "It can’t browse the internet. When it doesn’t know something, it says so.",
    build: "It can’t browse the internet. When it doesn’t know something, it says so instead of guessing.",
  },
  wake: "Each conversation starts with a press of the wake-up button. It switches itself off after a couple of minutes of quiet.",
  limit: "Each Kheelu has a daily limit on how long it talks.",
} as const;
/** The price question's answer (faqs.ts `cost-and-advance`, token mode): with the total, without "incl. GST", the balance
 *  or the first 500 (D065 items 3-4; §3 fold 11). The question stays. */
export const PRODUCT_PRICE_ANSWER = {
  mockup:
    "Kheelu is ₹4,999 (incl. GST) for the first 500 units, with delivery anywhere in India included. The ₹499 is a refundable advance to reserve yours; the remaining ₹4,500 is due before delivery. After the first 500, it is ₹7,999 (incl. GST), paid in full. Pay by UPI, card or net banking, with no payment fees, and get a GST invoice.",
  build:
    "Kheelu is ₹4,999 in total, with delivery anywhere in India included. The ₹499 is a refundable advance that reserves yours; the rest is due before delivery. Pay by UPI, card or net banking, with no payment fees.",
} as const;
/** The question that leaves (faqs.ts `delivery-start`; §3 fold 11), and the new one after the first-week question
 *  (faqs.ts `after-six-months`; D065 item 6, the CMO's M5). */
export const PRODUCT_DELIVERY_QUESTION = "When does delivery start?";
export const AFTER_SIX_MONTHS = {
  question: "Will Kheelona+ charge me after the 6 months?",
  answer:
    "No, not unless you sign up for it yourself. Every Kheelu comes with 6 months of Kheelona+, our paid subscription, on top of the free parent app. Nothing renews without you.",
} as const;
/** Home's fourth question (faqs.ts `screen-time-in-disguise`, task Q2.9), the product page's fifth since task Q2.13 (the
 *  D2C plan v2 §3 fold 11, question 5: "As Home's question 4"), after the price question, in the delivery question's
 *  place. The one entry, so the words are Home's on both pages. */
export const SCREEN_TIME_FAQ = {
  question: "Isn’t this just screen time in disguise?",
  answer:
    "No. There’s no screen to watch: your child talks, listens and does the thinking. Each Kheelu has a daily limit on how long it talks, and in the parent app you can see how long your child talked each day.",
} as const;
/** The recognition strip's label on the product page since task Q2.13 (the D2C plan v2 §3 fold 4, the CMO's m10): Home's
 *  small label, no heading, no full stop (the team page's heading keeps "Recognised by."). */
export const PRODUCT_RECOGNISED = "Recognised by";
/** That answer's first and last sentences: the page prints the middle one already (the claim-fixed Kheelona+ line). */
const AFTER_SIX_MONTHS_LINES = {
  no: sentences(AFTER_SIX_MONTHS.answer)[0],
  renews: sentences(AFTER_SIX_MONTHS.answer).at(-1)!,
} as const;
/** The delivery question's answer's first sentence (the approved page's), which the offer card's delivery perk prints
 *  too (the one perk list), so the page loses it once. */
const PRODUCT_DELIVERY_ANSWER_FIRST = "Deliveries start mid-November.";
/** The safety line and its link (§3 fold 9; the built label, `product-safety-learn`, which the safety fold carried). */
export const PRODUCT_SAFETY_LINE = {
  line: "When the microphone is on, how Kheelu answers, and what you can read and delete, fact by fact:",
  link: "See how we built safety in",
} as const;
/** The note both offer cards print since task Q2.13 (offer.ts `PLUS_NOTE`; the D2C plan v2 §2 fold 7 and §3 fold 3: "the
 *  same note under the perks"). */
export const OFFER_NOTE = "Kheelona+ is our paid subscription, on top of the free parent app.";
/** The product page's offer card as both cards print it since task Q2.13 (the D2C plan v2 §2 fold 7 and §3 fold 3; the
 *  CMO's m9): the Kheelona+ note inside the card, after the perks and before the button (ui/OfferCard's `note`); the price
 *  printed once, as Home's card prints it (the card's fine print off: the price block stands in for the price line); and
 *  no help line under the card (§1.1: the closes and the store only; the WhatsApp bubble and the page's close carry it).
 *  Under the button: the trust line, the card's third row and the share link. The edits read the card as the offer
 *  additions leave it (OFFER_ADDITIONS: its help line rewritten, still in the mockup's words, D063's rule applying after
 *  every edit, seller-facts.ts); OfferSection.test.tsx applies them to the fold. */
export const PRODUCT_OFFER_CARD = [
  {
    at: "#offer .kh-offer > .kh-btn--cta",
    was: "Pre-order Kheelu",
    now:
      `<p class="kh-body-s mk-offer__note">${OFFER_NOTE}</p>` +
      `<a href="store.html" class="kh-btn kh-btn--cta kh-btn--l kh-btn--block" data-ph-capture-attribute-cta="product-offer"><span>Pre-order Kheelu</span></a>`,
  },
  cut("#offer .kh-offer__fine", PRICE_LINE.sentence.build),
  cut("#offer .mk-help", PRODUCT_HERO.help),
] as const satisfies readonly FactEdit[];
export const SELLING_UPDATE = {
  "meet-kheelu": {
    edits: [
      /* Fold 1: the eyebrow and the lead; no help line under the hero's trust line (§1.1). */
      rewrite(".mk-hero .kh-eyebrow", PRODUCT_HERO.eyebrow.mockup, PRODUCT_HERO.eyebrow.build),
      rewrite(".mk-hero .kh-heading__lead", PRODUCT_HERO.lead.mockup, PRODUCT_HERO.lead.build),
      cut(".mk-hero .mk-help", PRODUCT_HERO.help),
      /* Fold 3: the photo's alt. */
      {
        at: ".mk-offer-photo img",
        was: "",
        now: `<img loading="lazy" src="../design-system/project/assets/Kheelu/kheelu-on-fur.jpg" width="1600" height="1600" alt="${PRODUCT_OFFER_ALT.build}">`,
      },
      /* Fold 3: the card as both cards print it since task Q2.13: the Kheelona+ note before the button, the price once,
         no help line. */
      ...PRODUCT_OFFER_CARD,
      /* Fold 4 (How it works): Good to know's second line, then the daily limit after the wake-up line. */
      rewrite("li > span", PRODUCT_KNOW.browse.mockup, PRODUCT_KNOW.browse.build),
      {
        at: "#know-title ~ ul > li",
        was: PRODUCT_KNOW.wake,
        now: `<li>${icon("microphone")}<span>${PRODUCT_KNOW.wake}</span></li><li>${icon("clock")}<span>${PRODUCT_KNOW.limit}</span></li>`,
      },
      /* Folds 5 and 6, the parent app and the safety fold, off the page (D064 item 2; task Q2.11 takes their words to /safety). */
      cutAround("#app-title", "Every conversation, word for word.", "section"),
      cutAround("#safety-title", "Safety you can check.", "section"),
      /* Fold 8: the price answer; in the delivery question's place, Home's screen-time question (task Q2.13); the Kheelona+
         question after the first-week one. */
      rewrite(".kh-faq__a > p", PRODUCT_PRICE_ANSWER.mockup, PRODUCT_PRICE_ANSWER.build),
      {
        at: ".kh-faq__q span",
        was: PRODUCT_DELIVERY_QUESTION,
        scope: ".kh-faq__item",
        now: faqItem(SCREEN_TIME_FAQ.question, SCREEN_TIME_FAQ.answer),
      },
      {
        at: ".kh-faq__item",
        was: `${FIRST_WEEK.question}${FIRST_WEEK.answer}`,
        now: `${faqItem(FIRST_WEEK.question, FIRST_WEEK.answer)}${faqItem(AFTER_SIX_MONTHS.question, AFTER_SIX_MONTHS.answer)}`,
      },
    ] satisfies FactEdit[],
    /* In order of first appearance on the page (a sentence that goes more than once is listed as often, where it first
       shows): the hero's words; the button, the price line, the risk-reversal line and the delivery line of the safety
       fold's CTA block, the price line twice (the offer card's fine print too, task Q2.13), all first printed by the hero;
       the help line twice, the hero's and the offer card's (task Q2.13); the delivery question's first sentence, first
       printed by the card's delivery perk; Good to know's line; the parent-app fold and the safety fold whole (its link,
       which the build prints again in the safety line); the price answer, then the delivery question. */
    mockup: [
      PRODUCT_HERO.eyebrow.mockup,
      ...sentences(PRODUCT_HERO.lead.mockup),
      "Pre-order Kheelu",
      ...sentences(PRICE_LINE.sentence.build).flatMap((line) => [line, line]),
      PRICE_LINE.returns.build,
      PRICE_LINE.delivery,
      ...sentences(PRODUCT_HERO.help).flatMap((line) => [line, line]),
      PRODUCT_DELIVERY_ANSWER_FIRST,
      sentences(PRODUCT_KNOW.browse.mockup)[1],
      "The parent app",
      "Every conversation, word for word.",
      "Each one appears in the parent app a few minutes after it ends.",
      "Search them, read a daily summary, or look back over the week or the month.",
      "The Kheelona app is live on Apple’s App Store and the Google Play Store.",
      "The Kheelona app is live on Apple’s App Store and the Google Play Store.",
      "See what we keep, and for how long",
      "Safety",
      "Safety you can check.",
      "You’ll always see when it’s listening.",
      "Its microphone turns on only when someone presses the wake-up button.",
      "It stays on while your child talks and switches itself off after a couple of minutes of quiet.",
      "A light on Kheelu shows whenever it’s listening.",
      "Left alone, it hears nothing and sends nothing.",
      "How it understands and answers.",
      "To understand and answer your child, Kheelu uses trusted speech and AI providers.",
      "They process your child’s voice only to produce Kheelu’s reply.",
      "They don’t keep it, and they never use it to train their AI.",
      "Our contracts with them say so.",
      "You can read every conversation.",
      RETENTION.build,
      ...sentences(DELETE_ACCOUNT),
      "We don’t sell your data.",
      "Your child’s data is never used to advertise to them.",
      "No camera",
      "It can’t browse the internet",
      "It says it’s a toy, and never asks your child to keep a secret from you",
      PRODUCT_SAFETY_LINE.link,
      ...sentences(PRODUCT_PRICE_ANSWER.mockup),
      PRODUCT_DELIVERY_QUESTION,
      "Orders are sent in the order they were placed, and you get a tracking link when yours leaves us.",
      "Delivery is included anywhere in India, with nothing to pay at the door; we don’t ship outside India.",
      "A reserved Kheelu is sent once the rest of the price is paid.",
    ],
    /* In order of first appearance: the hero's words; the Kheelona+ question's last sentence, first printed by the card's
       Kheelona+ perk (the one perk list), then the card's note (task Q2.13); Good to know's two lines; the screen-time
       answer's "No.", first printed by the first question's answer (task Q2.13); the price answer; the screen-time
       question and the rest of its answer (task Q2.13); the Kheelona+ question and its first sentence (its second is the
       card's Kheelona+ line, on the page before). */
    build: [
      PRODUCT_HERO.eyebrow.build,
      PRODUCT_HERO.lead.build,
      AFTER_SIX_MONTHS_LINES.renews,
      OFFER_NOTE,
      sentences(PRODUCT_KNOW.browse.build)[1],
      PRODUCT_KNOW.limit,
      sentences(SCREEN_TIME_FAQ.answer)[0],
      ...sentences(PRODUCT_PRICE_ANSWER.build),
      SCREEN_TIME_FAQ.question,
      ...sentences(SCREEN_TIME_FAQ.answer).slice(1),
      AFTER_SIX_MONTHS.question,
      AFTER_SIX_MONTHS_LINES.no,
    ],
    /* The eyebrow, the lead and Good to know (a line reworded, a line added) wrap to other heights: both sides. The
       questions' list loses one question and gains one (closed items, compared by the text pass): both sides, so the
       help line and the close below line up. The two folds that leave: the mockup's side. The card's note (task Q2.13)
       makes the card taller: the build's side (the fine print and the help line it loses are hidden on both sides by the
       shared rules and D063's). */
    hidden: {
      both: [
        /* The hero's eyebrow and lead, named by the page's one h1 beside them, so the hero's own rules (HERO_PHONE_ART, the
           phone board) stay the only ones that name the hero (HeroSection.test.tsx). */
        ".kh-eyebrow:has(~ h1)",
        "h1 ~ .kh-heading__lead",
        /* Good to know whole: the daily limit's new fourth line moves every later line one place down, so the earlier
           rules' line hides (V16's fifth, the charging line) would find another line on the build's side. */
        "#know-title ~ ul",
        'section[aria-labelledby="faq-title"] .kh-faq',
      ],
      mockup: ["#app", "#safety"],
      build: [".ks-offer__note"],
    },
    reason:
      "the selling update on the product page: the hero's eyebrow and lead, no help line in the hero; the offer card with the Kheelona+ note, the price once and no help line under it (task Q2.13); the parent-app and safety folds moved to /safety; Good to know with \"instead of guessing\" and the daily limit; the price answer with the total and no GST; the delivery question off, Home's screen-time question in its place (task Q2.13) and the Kheelona+ question on (D064, D065; the D2C plan v2 §3)",
    approvedBy: SELLING_UPDATE_APPROVED,
  },
} as const satisfies Readonly<Record<string, PageFacts>>;
export type SellingUpdateSlug = keyof typeof SELLING_UPDATE;

/** The comparison moved from Home (§3 fold 8; home.md fold 7's words), as its phone cards print it. */
export const PRODUCT_COMPARE = {
  eyebrow: "Compare",
  title: "Other AI gives answers. Kheelu asks questions.",
  lead: "Thinking out loud, not tapping on a screen.",
  rows: [
    {
      label: "Screen-free",
      us: "Kheelu: Yes",
      others: ["Puzzles and activity books: yes", "Learning apps and videos: no", "Smart speakers and chatbots: varies"],
    },
    {
      label: "Holds a back-and-forth conversation",
      us: "Kheelu: Yes",
      others: ["Puzzles and activity books: no", "Learning apps and videos: rarely, mostly tapping and watching", "Smart speakers and chatbots: yes"],
    },
    {
      label: "Asks your child a question back",
      us: "Kheelu: Yes, after it answers",
      others: ["Puzzles and activity books: no", "Learning apps and videos: some ask quiz questions", "Smart speakers and chatbots: usually just answer"],
    },
    {
      label: "You can read every conversation",
      us: "Kheelu: Yes, in the parent app",
      others: ["Puzzles and activity books: nothing to read", "Learning apps and videos: nothing to read", "Smart speakers and chatbots: varies"],
    },
  ],
  caption: "Kinds of products, not brands: what each one usually does.",
} as const;
/** The sample chats' new lines (§3 fold 6): the tabs' words, the two new exchanges and the line under the tabs. The
 *  moon exchange, the label and the speakers are task 8c.3's (PROOF_EXAMPLE_BUILD). */
export const PRODUCT_CHATS = {
  tabs: ["The moon", "The dosa pan", "Spider legs"],
  dosa: [
    "“Why does the dosa pan sizzle?”",
    "“The pan is very hot, and the batter has water in it. When the water touches the hot pan, it turns into steam, and that’s the sizzle. Why do you think the pan has to be hot first?”",
    "“So the dosa gets crispy?”",
  ],
  spider: [
    "“How many legs does a spider have?”",
    "“Eight. That’s two more than an ant, which has six. What else do you know that has more than four legs?”",
    "“A centipede?”",
  ],
  after: "Hear it in two languages: watch “Two languages”.",
} as const;
export const SELLING_ADDITIONS = {
  "meet-kheelu": {
    selectors: ['section[aria-labelledby="compare-title"]', 'section[aria-labelledby="safety-line"]'],
    build: [
      PRODUCT_COMPARE.eyebrow,
      PRODUCT_COMPARE.title,
      PRODUCT_COMPARE.lead,
      ...PRODUCT_COMPARE.rows.flatMap((row) => [row.label, row.us, ...row.others]),
      PRODUCT_COMPARE.caption,
      PRODUCT_SAFETY_LINE.line,
      PRODUCT_SAFETY_LINE.link,
      ...PRODUCT_CHATS.tabs,
      ...PRODUCT_CHATS.dosa,
      ...PRODUCT_CHATS.spider,
      PRODUCT_CHATS.after,
      /* The recognition strip's label since task Q2.13 (Home's label strip, §3 fold 4; the strip is task 8c.3's block,
         PROOF_ADDITIONS, whose heading was "Recognised by."). */
      PRODUCT_RECOGNISED,
    ],
  },
} as const;
const sellingAdditionsHidden = (slug: keyof typeof SELLING_ADDITIONS): VisualHide[] =>
  SELLING_ADDITIONS[slug].selectors.map((selector) => ({
    side: "build",
    selector,
    reason: "a fold task Q2.10 adds (the comparison moved from Home, the safety line to /safety); the approved page has neither, so the pixels compare without it",
    approvedBy: SELLING_UPDATE_APPROVED,
  }));
/** Nothing of the approved page is excused (a regex no sentence matches); the added lines are accepted, the eyebrow in
 *  capitals too. */
const sellingAdditionsText = (slug: keyof typeof SELLING_ADDITIONS): TextDeviation => {
  const lines = SELLING_ADDITIONS[slug].build.flatMap((line) => sentences(line));
  return {
    mockup: /(?!)/,
    build: oneOf([...lines, PRODUCT_COMPARE.eyebrow.toUpperCase()]),
    reason:
      "the lines of the folds and tabs task Q2.10 adds: the comparison, the safety line, the sample chats' tabs and their two new exchanges; and the recognition strip's label as Home's (task Q2.13)",
    approvedBy: SELLING_UPDATE_APPROVED,
  };
};

/** The sample chats without JavaScript (task Q2.10), for the JavaScript-off run only (no-js.spec.ts), as the details
 *  fold's V3: the three chats stand stacked under their tabs' words, so the second and third chats' lines (each speaker,
 *  the label, the words) show only then; with JavaScript the first tab's words are read twice (its tab, and its panel's
 *  heading kept for screen readers). */
const SELLING_CHATS_JS_OFF: TextDeviation = {
  mockup: oneOf([PRODUCT_CHATS.tabs[0]]),
  build: oneOf([
    "Your child",
    "Kheelu",
    PROOF_EXAMPLE_BUILD[1],
    ...[...PRODUCT_CHATS.dosa, ...PRODUCT_CHATS.spider].flatMap((line) => sentences(line)),
  ]),
  jsOff: true,
  reason: "the sample chats without JavaScript: the tab row hidden, the three chats stacked under their tabs' words (the tabs with JavaScript, as the details fold's V3)",
  approvedBy: SELLING_UPDATE_APPROVED,
};

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
    /* The first screen's eyebrow and the films heading (task Q2.12, D065). */
    ...factsHidden(SELLING_CLOSES.store, SELLING_CLOSES_WHOSE),
  ],
  "store-confirmation": paymentsHidden,
  /* The safe-AI-toy guide's reworded facts and the one that came off (task 8b.2a, D058), compared by the text pass. */
  "story-what-to-look-for-in-a-safe-ai-toy": [
    ...factsHidden(ARTICLE_CLAIM_FIXES["story-what-to-look-for-in-a-safe-ai-toy"], ARTICLE_CLAIM_FIXES_WHOSE),
    /* The close of the AI toys and safety topic (task Q2.12, D065). */
    ...factsHidden(SELLING_CLOSES["story-what-to-look-for-in-a-safe-ai-toy"], SELLING_CLOSES_WHOSE),
  ],
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
     share link the build adds (task 8c.2, D061); then the quotes and the strip (task 8c.3); then the hero's picture, the
     Kabir photo at every width (task Q2.1, D064 item 4, in place of task 8c.1's phone-board rule); then the films' order
     and, from 900 px, the close's board (task Q2.1, D064 items 1 and 5). */
  home: [
    /* Task Q2.9: every fold of both sides (HOME_SELLING above); the earlier rules below hide parts of them again. */
    ...HOME_SELLING_HIDDEN,
    ...factsHidden(COPY_FIXES.home, COPY_FIXES_WHOSE),
    ...factsHidden(CLAIM_FIXES.home, CLAIM_FIXES_WHOSE),
    ...factsHidden(FAQ_FIXES.home, FAQ_FIXES_WHOSE),
    ...offerAdditionsHidden("home"),
    ...proofHidden("home"),
    ...HOME_HERO_PHOTO_HIDDEN,
    ...HOME_FILMS_ORDER_HIDDEN,
    ...HOME_OFFER_ART_HIDDEN,
  ],
  /* The open FAQ answer (V19, task 7.1b), then the facts, controls and retention card (V28, task 8b.1), compared by the
     text pass; then the selling update's blocks (task Q2.11): fold 2's CTA block and the new fold 4 (the build's), the
     controls' link (the mockup's), the six-item "never" list (both) and the controls' moved caption (the mockup's). */
  safety: [
    ...factsHidden(COPY_FIXES.safety, COPY_FIXES_WHOSE),
    ...factsHidden(CLAIM_FIXES.safety, CLAIM_FIXES_WHOSE),
    ...factsHidden(SAFETY_SELLING, SAFETY_SELLING_WHOSE),
    ...SAFETY_SELLING_LAYOUT_HIDDEN,
  ],
  /* Check 4 and Kheelu's three answers (V31, task 8b.1), compared by the text pass; then two answers, the button after
     them and the price question (task Q2.12, D065). */
  "ai-toys-for-kids-in-india": [
    ...factsHidden(CLAIM_FIXES["ai-toys-for-kids-in-india"], CLAIM_FIXES_WHOSE),
    ...factsHidden(SELLING_CLOSES["ai-toys-for-kids-in-india"], SELLING_CLOSES_WHOSE),
  ],
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
    /* The keys line in G26's words and the close's lead (task Q2.12, D065). */
    ...factsHidden(SELLING_CLOSES.team, SELLING_CLOSES_WHOSE),
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
    /* Fold 6 without the deletion sentences, fold 7 without Meet Kheelu, and the new close (task Q2.12, D065). */
    ...factsHidden(SELLING_CLOSES.setup, SELLING_CLOSES_WHOSE),
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
    /* The quotes, the strip, the steps and the example, on tabs since task Q2.10 (task 8c.3). The expert clip (task 8c.6)
       left the page for Home (task Q2.9). */
    ...proofHidden("meet-kheelu"),
    /* The hero's phone art (D061 item 1, task 8c.1), under 720 px only. */
    ...HERO_PHONE_ART,
    /* The selling update (task Q2.10): the hero's words, Good to know, the questions, the two folds that leave; then the
       comparison and the safety line it adds. */
    ...factsHidden(SELLING_UPDATE["meet-kheelu"], SELLING_UPDATE_WHOSE),
    ...sellingAdditionsHidden("meet-kheelu"),
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

/* Task Q2.8's lines (PRICE_LINE, above), on every page that sells: the short price line is a line or two shorter than
   D028's sentence, and the risk-reversal line wraps the compact trust line otherwise, so every chunk below each button
   would shift. The pixels compare the pages without them, on both sides: the price line beside each button and the
   trust line right after it, the offer cards' fine print and the trust row after each card (the trust line and the
   card's third row since the task's review), the store's first-screen trust line (the store's price stays
   D028's), and the phone buy bar's small line, which fits on one line at 390 px where the mockup's wraps to two, so the
   bar (and the page's foot, which keeps clear of it) would sit lower in the mockup in every chunk that shows it. The
   checkout's form keeps its sentence and its full row, so nothing inside a form is hidden. Their words are compared by
   the text pass (PRICE_LINE_TEXT) and the unit tests through the mockup comparison harness (the bar's, which sits outside
   main, by the shell's). One shared rule for every page, as the tap areas', never a row per page key. */
const PRICE_LINE_HIDDEN_REASON = "a line task Q2.8 rewords (D065 item 3), compared by the text pass; hidden on both sides so the chunks below line up";
export const PRICE_LINE_HIDDEN: readonly VisualHide[] = (["mockup", "build"] as const).map((side) => {
  const p = side === "mockup" ? "mk" : "ks";
  return {
    side,
    selector: `.${p}-price:not(form *), .${p}-price:not(form *) + .${p}-trust, .kh-offer__fine, .kh-offer ~ .${p}-trust, #store-price + .${p}-trust, .kh-buybar__small`,
    reason: PRICE_LINE_HIDDEN_REASON,
    approvedBy: PRICE_LINE_APPROVED,
  };
});

/* The footer's link rows (V54, task Q2.4, D064 item 6: 44 px rows on touch; V64, task Q2.12, the main session's ruling of
   the selling update: 32 px rows with a fine pointer), on every marketing page: the footer is 44, 32 and about 80 px
   shorter than the approved mockup's at 360, 390 and 1440, so every page's last chunk (and at 1440 its height) would
   differ by the columns alone. The pixels compare each page without the columns, on both sides; the footer's words and
   links are in no page's text pass (the footer is outside main), so chrome.spec.ts compares the footer itself, columns
   included, against mockup/home.html with the approved rows given to the mockup (FOOTER_ROWS). One shared rule for
   every page, as the tap areas' and the price lines', never a row per page key (Home had its own until task Q2.14). */
const FOOTER_ROWS_APPROVED =
  "deviations.md V54 (founder, D064 item 6, 2026-10-15; task Q2.4) and V64 (main session, the selling update, 2026-10-15; task Q2.12); one shared rule since task Q2.14";
export const FOOTER_COLS_HIDDEN: readonly VisualHide[] = (["mockup", "build"] as const).map((side) => ({
  side,
  selector: "footer.kh-footer .kh-footer__cols",
  reason:
    "the footer's link columns, in shorter rows than the mockup's (44 px on touch, 32 px with a fine pointer), compared by chrome.spec.ts with the approved rows; hidden on both sides so each page's last chunk lines up",
  approvedBy: FOOTER_ROWS_APPROVED,
}));
/** The footer's approved link rows (V54, V64) as CSS for the mockup's footer, so chrome.spec.ts compares the columns'
 *  pixels with the rows as approved: footer.css's two `.kh-footer__col a` rules, rule for rule (e2e-harness.test.ts holds
 *  them equal). `touch` and `fine` are the rows' heights in px (a 24 px line and its padding), as the spec measures them. */
export const FOOTER_ROWS = {
  css:
    ".kh-footer__col a { padding-block: calc(var(--space-2) + var(--space-1) / 2); }\n" +
    "@media (hover: hover) and (pointer: fine) { .kh-footer__col a { padding-block: var(--space-1); } }",
  touch: 44,
  fine: 32,
  approvedBy: FOOTER_ROWS_APPROVED,
} as const;

/* The footer's legal row (task Q2.16, the consistency review's QAL-1), on every marketing page: the contact line and the
   grievance officer link are one group (SellerLines' footer `links`, `span.ks-footer__links`), so they wrap together,
   and each link keeps its 48 px tap target in its own padding instead of mockup.css:126's inline-flex box, so the links
   share the copyright's and the address's line. The pages' visual pass already hides the legal row on both sides
   (seller-facts.ts, D063); the chrome's parity tests compare it, so they give the mockup's footer the build's row: its
   spans grouped (groupFooterLinks; SiteShell.test.tsx and not-found.test.tsx element by element, chrome.spec.ts pixel
   by pixel) and, in chrome.spec.ts, footer.css's two rules after undoing mockup.css:126's 48 px box (FOOTER_LEGAL).
   One shared rule for every page, as the footer's rows are. */
const FOOTER_LEGAL_APPROVED =
  "tasks.md Q2.16 (main session, 2026-10-15; the consistency review's QAL-1, wf_78365aa5-dfe); its deviations.md row is the main session's";
/** The build's legal-row rules for the mockup's footer (chrome.spec.ts): footer.css's own, rule for rule (Footer.test.tsx
 *  holds them equal), after `undo`, the part of mockup.css:126 footer.css no longer sets. */
export const FOOTER_LEGAL = {
  rules:
    ".kh-footer__legal a { display: inline-block; padding-block: var(--space-4); margin-block: calc(var(--space-4) * -1); color: var(--link); }\n" +
    ".ks-footer__links { display: flex; flex-wrap: wrap; gap: var(--space-6) var(--space-4); padding-bottom: var(--space-4); }",
  undo: ".kh-footer__legal a { min-height: 0; }",
  approvedBy: FOOTER_LEGAL_APPROVED,
} as const;

/** Groups the last two spans of each footer legal row under `root` (the mockup's contact line, then its grievance
 *  officer span) as the build prints them: one `span.ks-footer__links` holding the contact's span and the grievance
 *  officer's link. Returns `root`. Self-contained, so a spec can hand it to the browser (`page.evaluate(groupFooterLinks)`
 *  groups the open page's document); the unit tests call it on a clone. A row of any other shape throws. */
export function groupFooterLinks<T extends ParentNode>(root: T): T;
export function groupFooterLinks(): Document;
export function groupFooterLinks(root?: ParentNode): ParentNode {
  const scope = root ?? document;
  for (const row of Array.from(scope.querySelectorAll(".kh-footer__legal"))) {
    const spans = Array.from(row.children);
    if (spans.length !== 4 || spans.some((el) => el.tagName !== "SPAN") || !spans[3].querySelector("a")) {
      throw new Error(`groupFooterLinks: a .kh-footer__legal of ${spans.length} children, not the mockup's four spans (the last a link)`);
    }
    const [contact, grievance] = spans.slice(2);
    const group = row.ownerDocument.createElement("span");
    group.className = "ks-footer__links";
    contact.before(group);
    group.append(contact, ...Array.from(grievance.childNodes));
    grievance.remove();
  }
  return scope;
}

/* The store header's row (task Q2.16, the consistency review's QAP-5), on the store and /thanks: the logo keeps the DS's
   96 x 30 at every width (its link, a flex item, gave way to the help line on phones: 86.6 px wide at 360) and the help
   line's link stays whole, so a phone reads "Questions?" / "Message us on WhatsApp." instead of a split link.
   chrome.spec.ts compares the header with mockup/store.html's, so the mockup's header takes the same two rules first,
   store-header.css's own with the mockup's block name (StoreHeader.test.tsx holds them equal). */
const STORE_HEAD_ROW_APPROVED =
  "tasks.md Q2.16 (main session, 2026-10-15; the consistency review's QAP-5, wf_78365aa5-dfe); its deviations.md row is the main session's";
export const STORE_HEAD_ROW = {
  css: ".mk-store-head__in > .kh-logo-link { flex: none; }\n.mk-store-head__help a { white-space: nowrap; }",
  approvedBy: STORE_HEAD_ROW_APPROVED,
} as const;

/** The rules every page shares, in order: the tap areas' (task 7.1a), task Q2.8's price lines, then the footer's
 *  columns (V54, V64; task Q2.14). */
export const SHARED_HIDDEN: readonly VisualHide[] = [...TAP_AREA_HIDDEN, ...PRICE_LINE_HIDDEN, ...FOOTER_COLS_HIDDEN];

/** Every rule the visual pass applies to one page: the rules every page shares (SHARED_HIDDEN), then the page's own,
 *  then D063's for that page (task Q2.3; seller-facts.ts). */
export function visualHidden(slug: string): readonly VisualHide[] {
  return [...SHARED_HIDDEN, ...(VISUAL_HIDDEN[slug] ?? []), ...sellerHidden(slug)];
}

const hidingStyle = (rules: readonly VisualHide[], side: VisualHide["side"]): string => {
  const mine = rules.filter((rule) => rule.side === side);
  const block = (list: readonly VisualHide[]) => (list.length ? `${list.map((rule) => rule.selector).join(", ")} { display: none !important; }` : "");
  // A rule with a media query hides under it only (HERO_PHONE_ART): one @media block per query, after the rest.
  const scoped = [...new Set(mine.flatMap((rule) => (rule.media ? [rule.media] : [])))].map(
    (media) => `@media ${media} { ${block(mine.filter((rule) => rule.media === media))} }`,
  );
  return [block(mine.filter((rule) => !rule.media)), ...scoped].filter(Boolean).join("\n");
};

/** The style of the rules every page shares (SHARED_HIDDEN) on one side. */
export function sharedHiddenCss(side: VisualHide["side"]): string {
  return hidingStyle(SHARED_HIDDEN, side);
}

/** The style the visual pass adds to one side of a page's comparison for the page's own rules: its hidden selectors, or
 *  "" when it has none. */
export function hiddenCss(slug: string, side: VisualHide["side"]): string {
  return hidingStyle(VISUAL_HIDDEN[slug] ?? [], side);
}

/** The style of D063's rules for one page on one side (task Q2.3), or "" on a page the ruling does not change. */
export function sellerHiddenCss(slug: string, side: VisualHide["side"]): string {
  return hidingStyle(sellerHidden(slug), side);
}

/** Hides one side's approved elements on the page (before it is settled and measured): the rules every page shares,
 *  then the page's own, then D063's, each as a style of its own; prints each rule it applies under `label`, the calling
 *  spec's name ("visual-parity", "thanks-paid"; task 4.9 item 6). */
export async function hideDeviations(page: Page, slug: string, side: VisualHide["side"], label: string): Promise<void> {
  for (const css of [sharedHiddenCss(side), hiddenCss(slug, side), sellerHiddenCss(slug, side)]) if (css) await page.addStyleTag({ content: css });
  for (const rule of visualHidden(slug).filter((r) => r.side === side)) {
    console.log(`[${label}] ${slug}: ${rule.selector} hidden in the ${side}${rule.media ? ` at ${rule.media}` : ""} (${rule.approvedBy}): ${rule.reason}`);
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
    /* The first screen's eyebrow and the films heading (task Q2.12, D065): SELLING_CLOSES above. */
    factsRule(SELLING_CLOSES.store),
  ],
  "store-confirmation": [paymentsMoved],
  /* The safe-AI-toy guide's facts in the code-checked words (task 8b.2a, D058): ARTICLE_CLAIM_FIXES above. */
  "story-what-to-look-for-in-a-safe-ai-toy": [
    factsRule(ARTICLE_CLAIM_FIXES["story-what-to-look-for-in-a-safe-ai-toy"]),
    /* The close of the AI toys and safety topic (task Q2.12, D065): SELLING_CLOSES above. */
    factsRule(SELLING_CLOSES["story-what-to-look-for-in-a-safe-ai-toy"]),
  ],
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
  home: [
    factsRule(COPY_FIXES.home),
    factsRule(OFFER_ADDITIONS.home),
    proofText("home"),
    /* The hero board's word sticker, gone with the board (task Q2.1, D064 item 4): HOME_HERO_PHOTO above. Before the
       claim fixes, which only the FAQ fix may follow (pages/parity-deviations.test.ts). */
    HOME_HERO_PHOTO_TEXT,
    /* Task Q2.9, fold by fold (HOME_SELLING above), before the claim fixes, which only the FAQ fix may follow. */
    ...HOME_SELLING_TEXT,
    factsRule(CLAIM_FIXES.home),
    factsRule(FAQ_FIXES.home),
  ],
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
    /* The selling update (task Q2.10): SELLING_UPDATE and SELLING_ADDITIONS above. Before the claim fixes, which only the
       FAQ fix may follow (pages/parity-deviations.test.ts), though its edits apply after both. The expert clip's lines
       (task 8c.6) left with the clip (task Q2.9 takes it to Home). */
    factsRule(SELLING_UPDATE["meet-kheelu"]),
    sellingAdditionsText("meet-kheelu"),
    SELLING_CHATS_JS_OFF,
    /* D058's claim fixes (V27, task 8b.1): CLAIM_FIXES above. */
    factsRule(CLAIM_FIXES["meet-kheelu"]),
    /* The languages question (task 8c.4, D061): FAQ_FIXES above. Its answer sits in a closed item, which the text pass
       does not read; faqs.test.ts and the route's unit test hold it. */
    factsRule(FAQ_FIXES["meet-kheelu"]),
  ],
  /* The open FAQ answer and the closed one's "At 3:" line (V19, task 7.1b): COPY_FIXES above. The selling update (task
     Q2.11): SAFETY_SELLING above, before D058's claim fixes, which only the FAQ fixes may follow
     (pages/parity-deviations.test.ts); the text pass applies the rules in any order. */
  safety: [factsRule(COPY_FIXES.safety), factsRule(SAFETY_SELLING), factsRule(CLAIM_FIXES.safety)],
  /* The age answer's "At 3" sentence (V22, wave 8 merge): COPY_FIXES above. It sits in a closed item, which the text
     pass does not read; the route's unit test holds it. */
  "ai-toys-for-kids-in-india": [
    factsRule(COPY_FIXES["ai-toys-for-kids-in-india"]),
    factsRule(CLAIM_FIXES["ai-toys-for-kids-in-india"]),
    /* Two answers, the button after them and the price question (task Q2.12, D065): SELLING_CLOSES above. */
    factsRule(SELLING_CLOSES["ai-toys-for-kids-in-india"]),
  ],
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
    /* The keys line in G26's words and the close's lead (task Q2.12, D065): SELLING_CLOSES above. */
    factsRule(SELLING_CLOSES.team),
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
    /* Fold 6, fold 7 and the new close (task Q2.12, D065): SELLING_CLOSES above. */
    factsRule(SELLING_CLOSES.setup),
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

/** Task Q2.8's lines (PRICE_LINE, above) as the text pass reads a page's main: D028's sentence and the offer card's note
 *  in their pieces (the pass splits after "incl."), and the compact line's returns promise, go; the short price line's
 *  two sentences and the risk-reversal line come. The store's form and price keep D028's sentence, which the pass then
 *  finds on both sides, so nothing is excused there. The drawer and the buy bar sit outside main (the shell's tests hold
 *  them through the harness). */
export const PRICE_LINE_TEXT: TextDeviation = {
  mockup: oneOf([...sentences(PRICE_LINE.sentence.mockup), ...sentences(PRICE_LINE.cardNote), PRICE_LINE.returns.mockup]),
  build: oneOf([...sentences(PRICE_LINE.sentence.build), PRICE_LINE.returns.build]),
  reason: PRICE_LINE.reason,
  approvedBy: PRICE_LINE.approvedBy,
};

/** The offer rows' words (PRICE_LINE, the task's review): under the offer cards' buttons the trust line, then the card's
 *  third row, and on the product close the trust line. Home's card row loses "Delivery included anywhere in India" (the
 *  card's perk "Delivery anywhere in India, included" keeps the promise) and gains the delivery line; the product page's
 *  card row gains the delivery line, and its close loses the warranty, the ways to pay and that line, which its card row
 *  keeps (but the last). Only on those two pages (PRICE_LINE_ROWS_SLUGS). */
export const PRICE_LINE_ROWS_TEXT: TextDeviation = {
  mockup: oneOf([PRICE_LINE.rows.warranty, PRICE_LINE.rows.payment, PRICE_LINE.rows.deliveryIncluded]),
  build: oneOf([PRICE_LINE.delivery]),
  reason:
    "the one risk-reversal line under every button: the offer cards' rows are the trust line, then the card's third row (warranty, the ways to pay), and the product close's the trust line (D2C plan v2 §1.1)",
  approvedBy: PRICE_LINE.approvedBy,
};
const PRICE_LINE_ROWS_SLUGS: readonly string[] = ["home", "meet-kheelu"];

/** Task Q2.8's rules for one page: the rule every page shares (PRICE_LINE_TEXT), then, on the two pages with an offer
 *  card, the offer rows' (PRICE_LINE_ROWS_TEXT). */
export function priceLineText(slug: string): readonly TextDeviation[] {
  return PRICE_LINE_ROWS_SLUGS.includes(slug) ? [PRICE_LINE_TEXT, PRICE_LINE_ROWS_TEXT] : [PRICE_LINE_TEXT];
}

/* D063 items 2-3 (task Q2.3; seller-facts.ts): the GSTIN off the website and the number only on /contact and the legal
   pages. One shared ruling, as TAP_AREA_HIDDEN is: never a row per page key. Its rules for one page are read from the
   frozen mockup as the ruling rewrites it, and applied after the page's own. */
const isMockupSlug = (slug: string): slug is MockupSlug => (MOCKUP_SLUGS as readonly string[]).includes(slug);
const sellerText = (slug: string): readonly TextDeviation[] => (isMockupSlug(slug) ? sellerFactsText(slug) : []);
const sellerHidden = (slug: string): readonly VisualHide[] => (isMockupSlug(slug) ? sellerFactsHidden(slug) : []);

/** Every rule the text pass applies to one page: task Q2.8's (priceLineText), then the page's own (TEXT_DEVIATIONS),
 *  then D063's. */
export function textDeviations(slug: string): readonly TextDeviation[] {
  return [...priceLineText(slug), ...(TEXT_DEVIATIONS[slug] ?? []), ...sellerText(slug)];
}
