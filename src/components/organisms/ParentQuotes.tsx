"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/* PLACEHOLDER TESTIMONIALS — GATE V3-a (founder, 2026-07-27).
 *
 * The founder named the three pilot parents (Shweta, Priyamvada, Gaurav) and
 * asked for placeholder words until the real quotes and consent arrive. These
 * three `text` values are DRAFTED, not spoken — they ship on the preview only
 * and must be replaced verbatim before this branch merges to main. The names
 * are real; the words are not yet. Do not add a fourth, and do not restore the
 * old anonymous "Parent of a 4-year-old" set: the founder retired every
 * pilot-count and anonymous-tester claim in V3 (no "ten families" anywhere). */
const QUOTES = [
  {
    text: "The first thing she does after school is tell Kheelu about her day. I listen from the kitchen and learn things she forgets to tell me.",
    who: "Shweta",
    title: "She tells Kheelu about her day",
    meta: "Pilot parent",
  },
  {
    text: "It sings the same rhymes my mother sang to me, and then it asks him questions about them. He answers before I can.",
    who: "Priyamvada",
    title: "Rhymes across generations",
    meta: "Pilot parent",
  },
  {
    text: "We wanted less screen time without a fight. This is the first thing that worked without one.",
    who: "Gaurav",
    title: "Less screen time, no fight",
    meta: "Pilot parent",
  },
] as const;

/** Pilot parents' words (the mockup's testimonial row, redesign 2026-10):
 *  a swipe row with dots on phones, three cards side by side on desktop.
 *  The headline over each quote is drawn from the quote itself and claims
 *  nothing more. The mockup's pilot statistics row is deliberately absent:
 *  pilot counts were retired in V3 (see the note above). */
export function ParentQuotes() {
  const row = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = row.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    const i = Math.round(el.scrollLeft / (card.offsetWidth + 14));
    setActive(Math.max(0, Math.min(QUOTES.length - 1, i)));
  };

  return (
    <div>
      <div
        ref={row}
        onScroll={onScroll}
        tabIndex={0}
        aria-label="Pilot parent testimonials"
        className="kh-snap"
      >
        {QUOTES.map((q) => (
          <figure
            key={q.who}
            className="m-0 flex flex-col gap-3.5 rounded-3xl border border-line bg-bg p-6 min-[900px]:p-8"
          >
            <span
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-accent font-display text-[20px] font-semibold text-on-accent"
            >
              {q.who[0]}
            </span>
            <h3 className="kh-h3">{q.title}</h3>
            <blockquote className="m-0 grow font-display text-[20px] leading-[1.45] text-ink-head min-[900px]:text-[22px]">
              &ldquo;{q.text}&rdquo;
            </blockquote>
            <figcaption className="flex flex-col gap-0.5 text-[14px] text-ink-muted">
              <b className="text-[16px] text-ink-head">{q.who}</b>
              <span>{q.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="kh-dots mt-1.5 flex justify-center gap-2" aria-hidden="true">
        {QUOTES.map((q, i) => (
          <span
            key={q.who}
            className={cn(
              "h-2 rounded-full transition-[width] duration-200",
              i === active ? "w-[22px] bg-ink-head" : "w-2 bg-line",
            )}
          />
        ))}
      </div>
    </div>
  );
}
