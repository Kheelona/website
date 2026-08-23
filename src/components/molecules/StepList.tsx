import { cn } from "@/lib/cn";
import { Reveal } from "@/components/molecules/Reveal";

export type Step = {
  /** Explicit numeral ("01"); omit everywhere to auto-number. */
  n?: string;
  title: string;
  /** Optional — two-cell rows (numeral + statement) when absent. */
  body?: string;
  /** Numeral color class; falls back to `numberColor`. */
  color?: string;
};

/** Numbered border-row list — the setup steps / voice path / beliefs
 *  pattern, extracted in R11 (three hand-rolled near-twins before).
 *  Rows sit on a shared top border and each closes with a bottom border;
 *  the numeral is decorative (aria-hidden) so screen readers hear the
 *  ordered list's own numbering. */
export function StepList({
  items,
  as: Tag = "h3",
  numberColor = "text-orange-ink",
  columns = "md:grid-cols-[90px_1fr_1.4fr]",
  rowClassName = "items-start gap-5 py-8 md:gap-7",
  titleClassName = "font-display text-[24px] font-extrabold leading-tight text-ink-head",
  bodyClassName = "text-[16px]",
  className,
}: {
  items: readonly Step[];
  /** Heading tag for step titles — match the page's outline (a page whose
   *  steps sit directly under the h1 passes "h2"). */
  as?: "h2" | "h3";
  numberColor?: string;
  /** Literal Tailwind grid template for each row. */
  columns?: string;
  rowClassName?: string;
  titleClassName?: string;
  bodyClassName?: string;
  className?: string;
}) {
  return (
    <ol className={cn("border-t border-line", className)}>
      {items.map((s, i) => (
        <Reveal
          as="li"
          key={s.title}
          className={cn("grid border-b border-line", columns, rowClassName)}
        >
          <span
            aria-hidden="true"
            className={cn(
              "font-display text-4xl font-extrabold",
              s.color ?? numberColor,
            )}
          >
            {s.n ?? String(i + 1).padStart(2, "0")}
          </span>
          {/* bodyless rows are standalone statements (team beliefs), not
              section subheadings — keep them out of the heading outline */}
          {s.body ? (
            <>
              <Tag className={titleClassName}>{s.title}</Tag>
              <p className={bodyClassName}>{s.body}</p>
            </>
          ) : (
            <p className={titleClassName}>{s.title}</p>
          )}
        </Reveal>
      ))}
    </ol>
  );
}
