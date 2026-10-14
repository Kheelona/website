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
import { product } from "@/content/en-IN/products/kheelu/product";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { paymentsLine } from "@/content/en-IN/store/payments-line";
import { toPlainText } from "@/lib/content/plain-text";
import { PAGE_FACTS, type PageFactsSlug } from "./page-facts";
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

/** The founder's page facts on one page (task 6.7; D055, D054 items 12 and 19): each placeholder he filled and each line
 *  he ruled off, the sentences listed in page-facts.ts (each page's parity-deviations unit test proves them exactly the
 *  ones its facts change). */
const pageFacts = (slug: PageFactsSlug): TextDeviation => ({
  mockup: oneOf(PAGE_FACTS[slug].mockup),
  build: oneOf(PAGE_FACTS[slug].build),
  reason: PAGE_FACTS[slug].reason,
  approvedBy: PAGE_FACTS[slug].approvedBy,
});

/** The blocks the founder's page facts change, hidden for the pixels: on both sides where the words reflow, on the
 *  mockup's alone where a row or line came off (page-facts.ts; each page's parity-deviations test checks every selector
 *  finds one changed block on its side). Their words are compared by the text pass (pageFacts, above). */
const pageFactsHidden = (slug: PageFactsSlug): VisualHide[] => {
  const { hidden, approvedBy } = PAGE_FACTS[slug];
  const rule = (side: VisualHide["side"], selector: string, reason: string): VisualHide => ({ side, selector, reason, approvedBy });
  return [
    ...(["mockup", "build"] as const).flatMap((side) =>
      hidden.both.map((selector) => rule(side, selector, "a block the founder's page facts reword, compared by the text pass")),
    ),
    ...hidden.mockup.map((selector) => rule("mockup", selector, "a block the founder's page facts take off, or its approved form")),
    ...hidden.build.map((selector) => rule("build", selector, "the founder's page facts in a block the build words differently")),
  ];
};

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
const IN_APP_ONLY = "D056 item 3 (founder, 2026-10-14; task 7.1c): the note ships, shown only in the in-app browsers";
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
  ],
  "meet-kheelu": pageFactsHidden("meet-kheelu"),
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

/** The style the visual pass adds to one side of a page's comparison: its hidden selectors, or "" when it has none. */
export function hiddenCss(slug: string, side: VisualHide["side"]): string {
  const selectors = (VISUAL_HIDDEN[slug] ?? []).filter((rule) => rule.side === side).map((rule) => rule.selector);
  return selectors.length ? `${selectors.join(", ")} { display: none !important; }` : "";
}

/** Hides one side's approved elements on the page (before it is settled and measured) and prints each rule it applies
 *  under `label`, the calling spec's name ("visual-parity", "thanks-paid"; task 4.9 item 6). */
export async function hideDeviations(page: Page, slug: string, side: VisualHide["side"], label: string): Promise<void> {
  const css = hiddenCss(slug, side);
  if (!css) return;
  await page.addStyleTag({ content: css });
  for (const rule of (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.side === side)) {
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
  stories: [
    {
      /* The 3-6-9-12 card's title and summary (stories.html fold 2), missing from the build; nothing replaces them. */
      mockup: oneOf(sentences(`${STORIES_REMOVED_CARD.title}\n${STORIES_REMOVED_CARD.summary}`)),
      reason: "the 3-6-9-12 guide left the journal (D053), so its card left the screen-time topic",
      approvedBy: STORIES_V9,
    },
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
      /* Each founder's initials badge reads as a line of its own; the build's badges hold the photos. The quote's "AS"
         (fold 4) is on both sides, so only the founders' three go missing (the V7 unit test holds the build to that one badge). */
      mockup: /^(?:AS|KC)$/,
      reason: "the founders' initials badges, replaced by their live photos (D054 item 20; B24)",
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
  terms: [pageFacts("terms")],
};
