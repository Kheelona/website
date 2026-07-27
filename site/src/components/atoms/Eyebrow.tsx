import { cn } from "@/lib/cn";

/** Section label. R9 (reviewer + founder: the serif accent retreats to
 *  human-voice quotes only): the eyebrow is now a sans kicker — the same
 *  register as the hero chip and the recognition label, so the page keeps
 *  two type moods (display + sans).
 *  Color is orange-ink (#b54a0d): 13px is normal-size text, so it needs
 *  4.5:1 on EVERY wash it sits on (white 5.3, cream 5.0, cool 4.8, sun
 *  4.8) — orange-deep and orange-cta only clear white. */
export function Eyebrow({
  color = "text-orange-ink",
  className,
  children,
}: {
  color?: string;
  /** R11: spacing overrides for inline meta-label uses (cn merges last-wins). */
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "mb-3 block text-[13px] font-bold uppercase tracking-[0.1em]",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}
