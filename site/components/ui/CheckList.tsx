import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Teal check-bullet list (the in-the-box / safety idiom, copy-pasted 4×
 *  before R11). Items are ReactNodes so a line can carry inline markup. */
export function CheckList({
  items,
  className,
}: {
  items: readonly React.ReactNode[];
  className?: string;
}) {
  return (
    <ul className={cn("space-y-4 text-[17px]", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span
            aria-hidden="true"
            className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-ink-head"
          >
            <Check className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
