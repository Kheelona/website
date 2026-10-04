import { cn } from "@/lib/cn";
import { TiltCard } from "@/components/molecules/TiltCard";
import { PRESS_LIFT } from "@/lib/interactions";

/** The standard card shell — token radius, wash fill, padding, optional
 *  display title — extracted in R11 (the same shell was hand-typed on ~20
 *  surfaces). Tilt is on by default (non-interactive surfaces only — the
 *  R10 hard rule lives in TiltCard); pass tilt={false} for cards that hold
 *  links or when a grid cell should stay static.
 *  R11 law (§8.19): new card surfaces use this component.
 *
 *  V5-1: `interactive` is for a card that is ITSELF tappable (inside a link, or
 *  carrying an onClick). It swaps tilt for the shared PRESS_LIFT contract, so
 *  the surface answers a touch as well as a cursor — tilt is desktop-only and
 *  left mobile with no feedback at all. The two are mutually exclusive by
 *  construction: tilt moves the surface under the cursor and drops clicks
 *  (R10). A card that does nothing when tapped must NOT be `interactive` —
 *  faking an affordance is worse than having none. */
export function Card({
  tilt = true,
  interactive = false,
  maxTilt,
  className,
  title,
  titleClassName = "mb-2 font-display text-[22px] font-extrabold text-ink-head",
  children,
}: {
  tilt?: boolean;
  /** The card is tappable: shared press + lift, and never tilt. */
  interactive?: boolean;
  maxTilt?: number;
  /** Fill/border/padding overrides (literal Tailwind); defaults below. */
  className?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  children: React.ReactNode;
}) {
  const shell = cn(
    "h-full rounded-(--radius-card) bg-white p-7",
    interactive && PRESS_LIFT,
    className,
  );
  const body = (
    <>
      {title ? <h3 className={titleClassName}>{title}</h3> : null}
      {children}
    </>
  );
  if (!tilt || interactive) return <div className={shell}>{body}</div>;
  return (
    <TiltCard className={shell} {...(maxTilt !== undefined ? { maxTilt } : {})}>
      {body}
    </TiltCard>
  );
}
