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
};

/** The style the visual pass adds to one side of a page's comparison: its hidden selectors, or "" when it has none. */
export function hiddenCss(slug: string, side: VisualHide["side"]): string {
  const selectors = (VISUAL_HIDDEN[slug] ?? []).filter((rule) => rule.side === side).map((rule) => rule.selector);
  return selectors.length ? `${selectors.join(", ")} { display: none !important; }` : "";
}

/** Hides one side's approved elements on the page (before it is settled and measured) and prints each rule it applies. */
export async function hideDeviations(page: Page, slug: string, side: VisualHide["side"]): Promise<void> {
  const css = hiddenCss(slug, side);
  if (!css) return;
  await page.addStyleTag({ content: css });
  for (const rule of (VISUAL_HIDDEN[slug] ?? []).filter((r) => r.side === side)) {
    console.log(`[visual-parity] ${slug}: ${rule.selector} hidden in the ${side} (${rule.approvedBy}): ${rule.reason}`);
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
};
