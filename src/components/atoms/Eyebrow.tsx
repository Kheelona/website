import { cn } from "@/lib/cn";

/** Section label. R9 (reviewer + founder: the serif accent retreats to
 *  human-voice quotes only): the eyebrow is a sans kicker, the same register
 *  as the hero chip and the recognition label.
 *
 *  ONE ORANGE (founder, 2026-10-04). The kicker used to be orange-ink
 *  (#b54a0d), a second, darker orange that existed only because brand orange
 *  as 13px text is 2.88:1 and fails AA. The founder dropped the second orange,
 *  so the WORDS are now ink (readable on every wash) and the brand orange is
 *  the short bar in front of them, where it is decoration and needs no
 *  contrast. The kicker keeps its colour identity without a second orange. */
export function Eyebrow({
  color = "text-ink-head",
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
        "mb-3 flex items-center gap-2.5 text-[13px] font-bold uppercase tracking-[0.1em]",
        "before:h-[3px] before:w-5 before:shrink-0 before:rounded-full before:bg-orange before:content-['']",
        color,
        className,
      )}
    >
      {children}
    </span>
  );
}
