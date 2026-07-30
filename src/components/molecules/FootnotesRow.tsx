import { cn } from "@/lib/cn";

/** Footnotes, Apple-style (V3 Apple-tier pass).
 *
 *  The reason this exists: our two softest claims are "up to 10 languages" and
 *  "6 months of Kheelona+ included". Both are true and both invite a follow-up
 *  question, and the category's habit is to leave that question hanging (or to
 *  bury the answer in a subscription page nobody reads). Naming the limit in
 *  small print is a trust signal, not a legal chore — precision reads as
 *  honesty, which is this brand's whole differentiator.
 *
 *  Contract: `<Footnote n={1} />` renders the superscript marker inline in copy
 *  and links to the matching note; `<FootnotesRow>` renders the ordered list
 *  once per page, as the last content of the room before the finale. Keep the
 *  numbering in sync by hand — two notes site-wide, listed in BUILD-V3 §2.6. */
export type FootnoteItem = { id: string; text: string };

export function Footnote({ n, id }: { n: number; id: string }) {
  return (
    <a
      href={`#${id}`}
      aria-label={`Footnote ${n}`}
      className="ml-0.5 rounded align-super text-[0.62em] font-bold text-ink-muted underline decoration-dotted underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
    >
      {n}
    </a>
  );
}

export function FootnotesRow({
  items,
  className,
}: {
  items: readonly FootnoteItem[];
  className?: string;
}) {
  return (
    <ol className={cn("space-y-1.5 text-[13px] leading-snug text-ink-muted", className)}>
      {items.map((f, i) => (
        <li key={f.id} id={f.id} className="scroll-mt-28">
          <span aria-hidden="true" className="mr-1.5 font-bold">
            {i + 1}
          </span>
          {f.text}
        </li>
      ))}
    </ol>
  );
}

/** The two site-wide notes (V3). Home and /products/lumi mount these; no other
 *  page has a claim that needs one. Adding a third means a new claim — check it
 *  against the never-invent-claims law first. */
export const V3_FOOTNOTES: readonly FootnoteItem[] = [
  {
    id: "fn-languages",
    /* Founder cleared the named list 2026-07-31; the ceiling stays "up to 10"
       so two more can land without a copy change. */
    text: "Up to 10 languages at launch. Announced so far: English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French.",
  },
  {
    id: "fn-kheelona-plus",
    text: "Kheelona+: included free for 6 months with every Lumi; pricing after that is announced soon. Lumi's smart features are yours for life, and nothing renews without you.",
  },
];
