import { Shape } from "@/components/atoms/Shapes";
import type { ShapeKind } from "@/lib/shape-paths";
import { cn } from "@/lib/cn";

/** The promise mark (V5-4, from the 2026-07-31 review).
 *
 *  WHY. The four brand blob shapes existed in exactly ONE place on the whole
 *  site — Home's trust room — at 24px in pale tints. The review team spotted it:
 *  good elements, used once, orphaned. The two obvious answers were both wrong.
 *  Deleting them throws away the design system's shape language; scattering them
 *  as background texture makes the site noisier, which the calm law and the
 *  founder's "keep it clean" both refuse.
 *
 *  So they get ONE JOB instead: **a promise mark means "this card is a promise
 *  we are making to you".** It appears on promise/value card groups — Home's
 *  trust room, /safety's promises, /playos's moat, the reserve reassurances —
 *  and nowhere else. A reader who notices it twice has learned what it means.
 *  Law: website-steps §8.23-3 — a brand mark needs a job; decoration is a
 *  review flag.
 *
 *  The rotation is fixed and positional so a group of four never repeats a shape
 *  and the same position always gets the same mark across the site. Opacity is
 *  0.22 rather than the Shape default 0.15: the marks were reading as smudges,
 *  and these are meant to look chosen. They stay `aria-hidden` decoration — the
 *  card's heading carries the meaning, so there is no contrast requirement. */
const MARKS: readonly { kind: ShapeKind; color: string }[] = [
  { kind: "flower5", color: "#29A0D7" },
  { kind: "squircle", color: "#EF762F" },
  { kind: "flower13", color: "#F1A23B" },
  { kind: "polygon", color: "#29A0D7" },
  { kind: "flower4", color: "#EF762F" },
  { kind: "triangle5", color: "#F1A23B" },
] as const;

export const PROMISE_MARK_COUNT = MARKS.length;

export function PromiseMark({
  index,
  className,
  size = "w-9",
}: {
  /** Position in the card group. Wraps, so any group length is safe. */
  index: number;
  className?: string;
  /** Tailwind width; the default 36px is the reviewed size. */
  size?: string;
}) {
  const mark = MARKS[index % MARKS.length];
  return (
    <Shape
      kind={mark.kind}
      color={mark.color}
      opacity={0.22}
      className={cn(size, className)}
    />
  );
}
