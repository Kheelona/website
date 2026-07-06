import { cn } from "@/lib/cn";

/** Section label in Instrument Serif italic (design-system accent register).
 *  Used only where the Home content doc prescribes a label. */
export function Eyebrow({
  color = "text-ink",
  children,
}: {
  color?: string;
  children: React.ReactNode;
}) {
  return (
    <span className={cn("mb-3 block font-accent text-[21px] italic", color)}>
      {children}
    </span>
  );
}
