import { cn } from "@/lib/cn";
import { TiltCard } from "@/components/molecules/TiltCard";

/** The standard card shell — token radius, wash fill, padding, optional
 *  display title — extracted in R11 (the same shell was hand-typed on ~20
 *  surfaces). Tilt is on by default (non-interactive surfaces only — the
 *  R10 hard rule lives in TiltCard); pass tilt={false} for cards that hold
 *  links or when a grid cell should stay static.
 *  R11 law (§8.19): new card surfaces use this component. */
export function Card({
  tilt = true,
  maxTilt,
  className,
  title,
  titleClassName = "mb-2 font-display text-[22px] font-extrabold text-ink-head",
  children,
}: {
  tilt?: boolean;
  maxTilt?: number;
  /** Fill/border/padding overrides (literal Tailwind); defaults below. */
  className?: string;
  title?: React.ReactNode;
  titleClassName?: string;
  children: React.ReactNode;
}) {
  const shell = cn("h-full rounded-(--radius-card) bg-white p-7", className);
  const body = (
    <>
      {title ? <h3 className={titleClassName}>{title}</h3> : null}
      {children}
    </>
  );
  if (!tilt) return <div className={shell}>{body}</div>;
  return (
    <TiltCard className={shell} {...(maxTilt !== undefined ? { maxTilt } : {})}>
      {body}
    </TiltCard>
  );
}
