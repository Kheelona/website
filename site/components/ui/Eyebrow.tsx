import { cn } from "@/lib/cn";

/** Section label in Instrument Serif, upright (R5: italics are banned
 *  site-wide; the serif face alone carries the accent register).
 *  Used only where the Home content doc prescribes a label. */
/* 24px = WCAG large text, so orange-deep on white (~4:1) passes 3:1.
   PDF label hues (teal/terracotta) fail contrast at label sizes; documented
   deviation in favor of the non-negotiable accessibility gate. */
export function Eyebrow({
  color = "text-orange-deep",
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("mb-3 block font-accent text-[24px]", color)}>
      {children}
    </span>
  );
}
