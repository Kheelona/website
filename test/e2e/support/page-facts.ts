/* The founder's page facts against the frozen mockups (task 6.7; D055, D054 items 12 and 19).
 *
 * mockup/ keeps its Gate A text (D046), so every placeholder the founder filled, every line he ruled off and every
 * approved phrase his answers changed is an accepted parity deviation (deviations.ts header: a resolved placeholder,
 * a founder decision after Gate A). This file lists them once per page, in two forms:
 *
 * - `edits`: the changes as test/support/mockup-facts.ts applies them to a clone of the mockup's <main>. The route's
 *   unit test holds the build to that clone, markup and words alike, so every literal here is what the content module
 *   renders, and nothing else differs.
 * - `mockup` and `build`: the sentences that differ, as the text-parity spec reads a page, for deviations.ts's rules.
 *   The page's parity-deviations unit test proves them exactly the sentences the edits change.
 *
 * Literal and data-only, because Playwright loads deviations.ts and cannot load the content modules (they import
 * images). Only the main session accepts a deviation: these rows are filed in wiki/qa/deviations.md at the merge.
 */

/** One accepted change to a mockup element. */
export interface FactEdit {
  /** The mockup element the change starts from: a selector and its words (white space collapsed). The first such
   *  element that no earlier edit used, in document order. */
  readonly at: string;
  readonly was: string;
  /** The element around it that changes instead (its closest ancestor), when the change is wider than the match. */
  readonly scope?: string;
  /** The build's markup in its place (its children's, when `inner`), or null when it comes off. */
  readonly now: string | null;
  readonly inner?: true;
}

/** The accepted changes to one page, and the sentences they change. */
export interface PageFacts {
  readonly edits: readonly FactEdit[];
  /** Sentences of the mockup the build no longer prints. */
  readonly mockup: readonly string[];
  /** Sentences the build prints in their place. */
  readonly build: readonly string[];
  readonly reason: string;
  readonly approvedBy: string;
}

const MARKER = ".mk-placeholder";

/** A placeholder the founder filled: its marker becomes these words (inline markup allowed), or nothing. */
const fill = (marker: string, now: string): FactEdit => ({ at: MARKER, was: marker, now });

/** A row or line ruled off whole: the element around the marker (`scope`) comes off. */
const hide = (marker: string, scope: string): FactEdit => ({ at: MARKER, was: marker, scope, now: null });

/** An approved element whose words change: its children become this markup. */
const reword = (at: string, was: string, now: string): FactEdit => ({ at, was, now, inner: true });

const F4 = (note: string) => `[PLACEHOLDER F4: ${note}]`;

/** The parent app's two listings, as the live site links them (D055 item 26; llms.txt at the tag
 *  archive/pre-reset-2026-10-10, lines 86-87). */
export const APP_STORE = "https://apps.apple.com/in/app/kheelona/id6792490581";
export const GOOGLE_PLAY = "https://play.google.com/store/apps/details?id=com.kheelona.toyapp";

const MEET_KHEELU_REASON =
  "the parent app's phones filled (D055 item 26); the rows and lines still waiting on an F4 value hidden, the box contents kept (D054 item 19)";

export const PAGE_FACTS = {
  "meet-kheelu": {
    edits: [
      /* Fold 4, Good to know: the charging line keeps its confirmed half. */
      fill(F4("battery life per charge and charging time"), ""),
      /* Fold 7, Specs. */
      fill("[PLACEHOLDER: which phones the parent app runs on]", "On iPhone and Android."),
      hide(F4("size and weight"), "dl > div"),
      hide(F4("outer fabric and filling"), "dl > div"),
      hide(F4("battery type, life per charge and charging time"), "dl > div"),
      hide(F4("charger type and its BIS registration number"), "dl > div"),
      /* Fold 7, Safety. */
      hide(F4("toy-safety age grading and any required warnings"), "li"),
      hide(F4("battery safety certification"), "li"),
      /* Fold 7, Declarations. */
      hide(F4("net quantity"), "dl > div"),
      hide(F4("month and year of manufacture"), "dl > div"),
    ],
    mockup: [
      F4("battery life per charge and charging time"),
      "[PLACEHOLDER: which phones the parent app runs on]",
      "Size and weight",
      F4("size and weight"),
      "Materials",
      F4("outer fabric and filling"),
      "Battery",
      F4("battery type, life per charge and charging time"),
      "Charger",
      F4("charger type and its BIS registration number"),
      `Age grading and warnings: ${F4("toy-safety age grading and any required warnings")}`,
      `Battery safety: ${F4("battery safety certification")}`,
      "Net quantity",
      F4("net quantity"),
      "Month and year of manufacture",
      F4("month and year of manufacture"),
    ],
    build: ["On iPhone and Android."],
    reason: MEET_KHEELU_REASON,
    approvedBy: "deviations.md V16 (founder, D055 item 26 and D054 item 19, 2026-10-14; task 6.7)",
  },
  setup: {
    edits: [
      /* Fold 2: the charger's F4 slot hidden (D055 item 27, D054 item 19); the parent app named and linked (item 26). */
      fill(F4("the charger type, and how long a full charge takes"), ""),
      fill(
        "[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]",
        `It’s called the Kheelona app: get it on the <a href="${APP_STORE}">App Store</a> for iPhone, or on <a href="${GOOGLE_PLAY}">Google Play</a> for Android.`,
      ),
      /* Fold 5: where the wake-up button is (item 25). Step 2's light colour is deviation V8 (deviations.ts). */
      fill("[PLACEHOLDER: where the wake-up button sits on Kheelu]", "It’s the button on Kheelu’s back, the one you held during setup."),
    ],
    mockup: [
      F4("the charger type, and how long a full charge takes"),
      "[PLACEHOLDER C6: where to get the parent app: App Store and Google Play links, and the listing name]",
      "[PLACEHOLDER: where the wake-up button sits on Kheelu]",
    ],
    build: [
      "It’s called the Kheelona app: get it on the App Store for iPhone, or on Google Play for Android.",
      "It’s the button on Kheelu’s back, the one you held during setup.",
    ],
    reason:
      "the charger's F4 slot hidden (D055 item 27, D054 item 19); the parent app named and linked on both stores (item 26); the wake-up button's place (item 25)",
    approvedBy: "deviations.md V15 (founder, D055 items 25-27 and D054 item 19, 2026-10-14; task 6.7)",
  },
} as const satisfies Readonly<Record<string, PageFacts>>;

export type PageFactsSlug = keyof typeof PAGE_FACTS;
