/** The outcome promise, in its two halves (the hero renders them as two
 *  coloured lines, PacePanel joins them into one sentence). ONE source since
 *  the 2026-08-23 repositioning: the V6 law that the promise is said
 *  identically on both pages is now enforced by construction rather than by
 *  two files agreeing. Founder decision #8 (migration-to-new-dsx.md): the
 *  site says "3+" everywhere, so the promise anchors at 3 and points at
 *  school instead of naming a ceiling. */
export const HERO_PROMISE: readonly [string, string] = [
  "A best friend at 3.",
  "A head start for school.",
];

export type GrowthStage = {
  /** "At 3 years" … "Every year after" — the year marker, rendered as the
   *  card kicker. The unit is spelled out (founder, 2026-07-31): a standalone
   *  "AT 3" label has no sentence around it to say 3 of what. */
  kicker: string;
  title: string;
  body: string;
};

/** The year-by-year answer to "what will a kid who gets Kheelu at 3 have by
 *  school" (the parent feedback that drove BUILD-V6, re-anchored at 3 by the
 *  founder's ages-3+ decision of 2026-08-23 — that decision IS the spec change
 *  BUILD-V6 D2 requires). Every claim traces to published copy; the 5-years
 *  card carries the founder-licensed soft school frame, and the last card is
 *  deliberately open-ended because the published age range now is. */
export const GROWTH_ARC: readonly GrowthStage[] = [
  {
    kicker: "At 3 years",
    title: "Asking why, and why again.",
    body: "Why is the sky blue? Kheelu answers the fourth why with the same patience as the first, then asks one back. Every answered why teaches your child that asking is worth it.",
  },
  {
    kicker: "At 4 years",
    title: "Playing with ideas.",
    body: "Thinking games, counting the apples a squirrel ran off with, naming a big feeling instead of hiding it. Kheelu remembers where your child stopped yesterday and starts one small step further.",
  },
  {
    kicker: "At 5 years",
    title: "Words, numbers, confidence.",
    body: "Serve and return, day after day, adds up: the words, the numbers, and the confidence of a child who expects to be heard. All of it walks into their first classroom with them.",
  },
  {
    kicker: "Every year after",
    title: "Growing right alongside.",
    body: "The questions grow up, and Kheelu grows with them: longer stories, bigger ideas, the next language. It remembers the child it met at 3, and keeps starting one small step further.",
  },
];

/** Pre-empts the skeptical parent's "every child is different". */
export const GROWTH_HEDGE =
  "Every child grows at their own pace. Kheelu follows theirs.";

/** The old hero's idea, de-confused and re-homed (BUILD-V6 §1). */
export const GROWTH_CLOSING =
  "A best friend the whole way. A tutor whenever they need one.";
