/** The Kheelu product artwork, in ONE place.
 *
 *  Until 2026-08-25 the same asset was described independently at ten call
 *  sites: a hard-coded `src`, a hard-coded `width`/`height` pair, and a
 *  differently-worded `alt` at each one. That is why changing what the product
 *  LOOKS like was a ten-file job with ten chances to leave one behind, and why
 *  nine alt strings still said "sky blue" and "striped party hat" for a plush
 *  that is neither.
 *
 *  Kheelu is a ROTATING SKU (brand law, founder 2026-07-10): its look changes
 *  post-launch by design. So the art needs the same treatment prices, CTA
 *  labels and ages already get in `@/config/site` — one source, never inlined.
 *  The next plush change is an edit to this file plus a new PNG.
 *
 *  THE ROTATION IS NEVER PUBLISHED ON-SITE. The new Kheelu simply appears; no
 *  page explains that it replaced anything.
 *
 *  WIDTH AND HEIGHT ARE THE REAL PIXELS OF THE SHIPPED FILE. Next computes the
 *  layout box from them, so a stale pair is a CLS bug, not a cosmetic one.
 *  `test/kheelu-art.test.ts` reads the PNG header and fails if they drift. */
export const KHEELU_ART = {
  src: "/product/lumi.png",
  width: 1111,
  height: 1362,
  /** The ONE description of what Kheelu looks like. Every alt on the site is
   *  this string or `kheeluAlt()` of it. Voice: plain, no hype, no em-dash. */
  alt: "Kheelu, the cream talking plush rabbit with a speaker in its tummy and rainbow-lined ears",
  /** Just the subject, for composing a contextual alt. */
  subject: "Kheelu, the cream talking plush rabbit",
} as const;

/** A contextual alt for the same artwork, so a page can say what the plush is
 *  DOING in that spot without restating what it looks like:
 *
 *    kheeluAlt("sitting calmly") -> "Kheelu, the cream talking plush rabbit, sitting calmly"
 *
 *  Callers pass the clause alone, never a trailing full stop: alt text is not a
 *  sentence and a screen reader announces the punctuation as a pause. */
export function kheeluAlt(clause: string): string {
  return `${KHEELU_ART.subject}, ${clause}`;
}
