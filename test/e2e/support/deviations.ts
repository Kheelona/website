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
export const TEAM_LEAD_BUILD = "Kheelona’s founders are parents in Bengaluru, building Kheelu: a screen-free plush toy that talks, for children aged 3 to 7.";
export const SETUP_STEP_BUILD = [
  "Press and hold Kheelu’s setup button.",
  "[PLACEHOLDER: which button and where; the app’s own screen still shows “[back]”]",
  "Hold it for 3 seconds, until its light starts pulsing.",
] as const;
/* The build's words for the privacy rule (V10): the B11 events of task 6.2 named in the policy, in the words the founder
   approved after Gate A (D054 item 10). Literals for the same reason; src/content/en-IN/legal/parity-deviations.test.ts
   holds them to privacy.ts. */
export const PRIVACY_B11_BUILD = [
  "Counts visits and the steps of a pre-order: starting the form, being asked to correct an answer (which answers, never what you typed), opening and closing the payment window, a payment that fails (with Razorpay’s code for why), paying, and saving your address.",
  "It is told the same steps of a pre-order as Google Analytics.",
] as const;
const PRIVACY_V10 = "deviations.md V10 (founder, D054 item 10, 2026-10-14; task 6.2)";

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

const TEAM_V7 = "deviations.md V7 (main session, 2026-10-14, M1; task 5.7, CMO M-T1, D038)";

export const VISUAL_HIDDEN: Readonly<Record<string, readonly VisualHide[]>> = {
  store: [
    {
      /* The in-app browser note is built but off (N7), so the store shows no fold 2 and every chunk below the first
         screen would move up by the note's height (without these hides the store is 3 to 5 percent shorter than
         the mockup at the three widths, task 4.8). */
      side: "mockup",
      selector: ".mk-inapp",
      reason: "the in-app browser note (fold 2) is built but off until QA's device check (N7), so the store shows no fold 2",
      approvedBy: "deviations.md V4 (main session, 2026-10-14, wave 5 part B2 merge; task 4.8)",
    },
    ...paymentsHidden,
  ],
  "store-confirmation": paymentsHidden,
  team: [
    {
      side: "mockup",
      selector: ".mk-founder__bg",
      reason: "the founders' background lines are proof-gated slots that render nothing until F11's proof is filed (D038)",
      approvedBy: TEAM_V7,
    },
    {
      side: "mockup",
      selector: 'section[aria-labelledby="recognised-title"]',
      reason: "fold 5, \"Recognised by.\", is hidden in the build until a programme's proof is filed (D038, F11; the mockup's own fold comment)",
      approvedBy: TEAM_V7,
    },
    /* The hero lead is the CMO's M-T1 wording on one side and the mockup's on the other; on phones it wraps to a
       different number of lines and every chunk below would shift, so the pixels compare the page without it on both
       sides, and its words are compared by the text pass (TEXT_DEVIATIONS). */
    ...(["mockup", "build"] as const).map((side) => ({
      side,
      selector: "#hero-title ~ .kh-heading__lead",
      reason: "the hero lead (CMO fix M-T1 in the build), compared by the text pass; hidden on both sides so the chunks below line up",
      approvedBy: TEAM_V7,
    })),
  ],
  setup: (["mockup", "build"] as const).map((side) => ({
    /* Step 2 is CMO fix M-S1 in the build (no place, no light colour; an open placeholder for the place), so it wraps
       differently and moves every step below it; the pixels compare the page without step 2 on both sides, and its
       words are compared by the text pass (TEXT_DEVIATIONS). */
    side,
    selector: ".kh-steps > .kh-step:nth-child(2)",
    reason: "step 2 (CMO fix M-S1 in the build, with its open placeholder), compared by the text pass; hidden on both sides so the steps below line up",
    approvedBy: "deviations.md V8 (main session, 2026-10-14, M1; task 5.8, CMO M-S1)",
  })),
  /* The Google Analytics block's paragraph and the PostHog block's first one say more in the build (V10), so they wrap
     to more lines and every block below would shift; the pixels compare the page without the two paragraphs on both
     sides, and their words are compared by the text pass (TEXT_DEVIATIONS). Third and sixth tools, as privacy.ts
     and the mockup order them (parity-deviations.test.ts checks the headings). */
  privacy: (["mockup", "build"] as const).flatMap((side) => {
    const tool = side === "mockup" ? "mk-tool" : "ks-tool";
    return [`.${tool}s > .${tool}:nth-child(3) > p`, `.${tool}s > .${tool}:nth-child(6) > p:first-of-type`].map((selector) => ({
      side,
      selector,
      reason: "the Google Analytics and PostHog paragraphs name the B11 events (D054 item 10), compared by the text pass; hidden on both sides so the blocks below line up",
      approvedBy: PRIVACY_V10,
    }));
  }),
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
      reason: "the in-app browser note (fold 2) is built but off until QA's device check (N7), so its lines are missing",
      approvedBy: "deviations.md V4 (main session, 2026-10-14, wave 5 part B2 merge; task 4.8)",
    },
    paymentsMoved,
  ],
  "store-confirmation": [paymentsMoved],
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
  ],
  team: [
    {
      /* CMO fix M-T1 (task 5.7): the hero lead says what Kheelu is, for whom, and the search term (team.ts). */
      mockup: /^Kheelu is designed by parents in Bengaluru\.$/,
      build: oneOf([TEAM_LEAD_BUILD]),
      reason: "CMO fix M-T1: the hero lead names the product, the age band and the search term",
      approvedBy: "deviations.md V7 (main session, 2026-10-14, M1; task 5.7)",
    },
    {
      /* The proof-gated lines (D038, F11): the three founders' backgrounds and fold 5's programmes, with its heading. */
      mockup: /^(?:\[PLACEHOLDER F11: .+\]|Recognised by\.)$/,
      reason: "proof-gated slots that render nothing until F11's proof is filed (D038); fold 5 is hidden with them",
      approvedBy: "deviations.md V7 (main session, 2026-10-14, M1; task 5.7)",
    },
  ],
  setup: [
    {
      /* CMO fix M-S1 (task 5.8): step 2 names no place and no light colour for the setup button (the app's own screen
         bracketed both); its place is an open placeholder (setup.ts). */
      mockup: oneOf(["Press and hold the button on Kheelu’s back.", "Hold it for 3 seconds, until the light starts pulsing blue."]),
      build: oneOf(SETUP_STEP_BUILD),
      reason: "CMO fix M-S1: no unconfirmed place or light colour for the setup button; its place is a placeholder until confirmed",
      approvedBy: "deviations.md V8 (main session, 2026-10-14, M1; task 5.8)",
    },
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
  ],
};
