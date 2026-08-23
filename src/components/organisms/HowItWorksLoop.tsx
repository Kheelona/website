import { cn } from "@/lib/cn";

export type LoopStep = {
  title: string;
  /** Small label under the title: the step number + the team's product term
   *  (the LumiModes convention — the parent verb leads, the term follows). */
  label: string;
  body: string;
};

/** The How-It-Works cycle (V4, team feedback 2026-07-30: "explain product
 *  behavior and adaptive learning, with a small flow chart").
 *
 *  Three step cards joined by arrows, closed by a return arc — a flowchart
 *  that reads as a LOOP, because the loop is the claim (every round fits the
 *  child better). Zero client JS: the gentle one-at-a-time glow that walks
 *  the cycle is CSS keyframes on an opacity-only overlay (transform/opacity
 *  law), staggered a third of the period per card, and it never hides
 *  content — all three steps are always fully readable, which is also the
 *  reduced-motion and no-JS state. Below md the row stacks vertically with
 *  down arrows and the return note closes the column. */
export function HowItWorksLoop({
  steps,
  repeatNote,
  className,
}: {
  steps: readonly LoopStep[];
  repeatNote: string;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-[980px]", className)}>
      <ol className="grid gap-3 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:items-stretch md:gap-2">
        {steps.map((s, i) => (
          <li key={s.title} className="contents">
            <div
              className="loop-step relative rounded-(--radius-card) border border-line bg-white p-6"
              style={{ "--loop-delay": `${i * 2.5}s` } as React.CSSProperties}
            >
              {/* the walking glow: opacity-only, decorative, motion-gated */}
              <span
                aria-hidden="true"
                className="loop-step-glow pointer-events-none absolute inset-0 rounded-(--radius-card) bg-orange/10 opacity-0 ring-2 ring-inset ring-orange/40"
                style={{ animationDelay: `var(--loop-delay)` }}
              />
              <p className="relative mb-1 font-display text-[21px] font-extrabold text-ink-head">
                {s.title}
              </p>
              {/* V5-5: min-h reserves two lines. "Step 3 · Real-world learning"
                  wraps where steps 1-2 do not, and without the reservation the
                  three body paragraphs started at three different heights. */}
              <p className="relative mb-3 min-h-[2.6em] text-[13px] font-bold uppercase leading-[1.3] tracking-[0.08em] text-orange-ink">
                {s.label}
              </p>
              <p className="relative text-[15px] leading-relaxed">{s.body}</p>
            </div>
            {i < steps.length - 1 && (
              <span
                aria-hidden="true"
                className="grid place-items-center py-1 text-orange md:px-1 md:py-0"
              >
                {/* down arrow stacked, right arrow in the row */}
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 rotate-90 md:rotate-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </span>
            )}
          </li>
        ))}
      </ol>

      {/* the return arc: step three hands back to step one */}
      <div aria-hidden="true" className="mt-2 hidden md:block">
        <svg
          viewBox="0 0 960 56"
          className="h-[56px] w-full text-orange"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M900 4 C 900 44, 60 44, 60 14"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeDasharray="7 7"
            strokeLinecap="round"
          />
          <path
            d="M52 24 L60 10 L69 23"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="mt-3 flex items-center justify-center gap-2 text-center text-[15px] font-semibold text-ink md:mt-1">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4 text-orange md:hidden"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
        {repeatNote}
      </p>
    </div>
  );
}
