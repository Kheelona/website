import { LUMI_AGES } from "@/config/site";

/** The LUMI_AGES endpoints ("2 to 5" → ["2", "5"]). The hero H1, the arc
 *  eyebrow, and the stage kickers all render from these, so the band is a
 *  one-constant edit (BUILD-V6 §3.1). */
export function lumiAgeEndpoints(): [string, string] {
  const [start, end] = LUMI_AGES.split(" to ");
  return [start!, end!];
}

const [AGE_START, AGE_END] = lumiAgeEndpoints();

export type GrowthStage = {
  /** "At 2 years" … "By 5 years" — the year marker, rendered as the card
   *  kicker. The unit is spelled out (founder, 2026-07-31): a standalone
   *  "AT 2" label has no sentence around it to say 2 of what. */
  kicker: string;
  title: string;
  body: string;
};

/** The year-by-year answer to "what will a kid who gets Lumi at 2 have at 5"
 *  (the parent feedback that drove BUILD-V6). Every claim traces to published
 *  copy; the By-5 card carries the founder-licensed soft school frame. Copy is
 *  spec-verbatim (BUILD-V6 D2) — do not edit here without a spec change. */
export const GROWTH_ARC: readonly GrowthStage[] = [
  {
    kicker: `At ${AGE_START} years`,
    title: "Naming the world.",
    body: "Your child points, names, and repeats. Lumi answers in short words they already own, sings the rhymes you grew up with, and starts remembering which words they know.",
  },
  {
    kicker: "At 3 years",
    title: "Asking why, and why again.",
    body: "Why is the sky blue? Lumi answers the fourth why with the same patience as the first, then asks one back. Every answered why teaches your child that asking is worth it.",
  },
  {
    kicker: "At 4 years",
    title: "Playing with ideas.",
    body: "Thinking games, counting the apples a squirrel ran off with, naming a big feeling instead of hiding it. Lumi remembers where your child stopped yesterday and starts one small step further.",
  },
  {
    kicker: `By ${AGE_END} years`,
    title: "Words, numbers, confidence.",
    body: "Three years of serve and return add up: the words, the numbers, and the confidence of a child who expects to be heard. All of it walks into their first classroom with them.",
  },
];

/** Pre-empts the skeptical parent's "every child is different". */
export const GROWTH_HEDGE =
  "Every child grows at their own pace. Lumi follows theirs.";

/** The old hero's idea, de-confused and re-homed (BUILD-V6 §1). */
export const GROWTH_CLOSING =
  "A best friend the whole way. A tutor whenever they need one.";
