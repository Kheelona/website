/* Approved deviations from the mockup (tasks.md SPA 1 and 2).
 *
 * A page task that exceeds the parity tolerance lists each exceeding chunk or text difference in
 * its report with the reason (a founder decision after Gate A, a corrected defect, the D044
 * screenshot edits, a resolved placeholder). Only the main session adds a row here, after it has
 * accepted that reason; every row names the decision or review that approved it. The specs print
 * every deviation they apply, so none is silent.
 */

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
  reason: string;
  approvedBy: string;
};

export const VISUAL_DEVIATIONS: Readonly<Record<string, readonly VisualDeviation[]>> = {};

export const TEXT_DEVIATIONS: Readonly<Record<string, readonly TextDeviation[]>> = {
  "meet-kheelu": [
    {
      /* The product details fold without JavaScript (wiki/qa/deviations.md V3): the tab row stays hidden and the three
         panels stack under their headings, so against the approved (tabbed) text the build lacks the tab label "Specs"
         (the panel's heading stays) and adds the In the box and Safety panels' lines. Applied by text-parity.spec.ts and,
         for the build's own JavaScript-on and -off texts, by no-js.spec.ts. */
      mockup: /^Specs$/,
      build:
        /^(?:Kheelu plush toy|Charger|Quick-start card|Every reply passes an age-graded safety layer, set to the age you enter in the parent app\.|Tested before launch by trying to make it say unsafe things\.|Toy-safety certification \(BIS\): applied for, not yet granted\.|We show no mark until it is granted\.|Age grading and warnings: \[PLACEHOLDER F4: toy-safety age grading and any required warnings\]|Battery safety: \[PLACEHOLDER F4: battery safety certification\])$/,
      reason: "details fold without JavaScript: the tab row hidden, the three panels stacked (the approved tabs with JavaScript; P1, N21 corrected)",
      approvedBy: "deviations.md V3 (main session, 2026-10-13; task 5.2)",
    },
  ],
};
