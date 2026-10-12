import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";

/**
 * The DS StepLoop (`kh-steps`, `kh-step`): numbered steps with the DS's drawn arrows between them. Three approved
 * layouts:
 * - `loop` (default): the DS as delivered, three in a row from 720 px (store-confirmation.html "What happens next");
 * - `checks`: the buyer's guide's five checks (ai-toys-for-kids-in-india.html fold 2): no arrows (they are checks,
 *   not a sequence), the numeral beside its check on phones, two columns from 720 px, all five in one row from
 *   1200 px (the DS content-max; mockup-css-mapping §4.2, media exception `content-max-1200`);
 * - `four`: setup's four steps (setup.html fold 3): two by two from 720 px, four in a row from 1024 px.
 * The number is decoration (`aria-hidden`); the ordered list carries the order. Title and body take `RichText`.
 */
export interface StepLoopStep {
  title: ReactNode;
  body: ReactNode;
  tone?: Tone;
}

export type StepLoopVariant = "loop" | "checks" | "four";

export interface StepLoopProps {
  steps: readonly StepLoopStep[];
  variant?: StepLoopVariant;
  reveal?: boolean;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
}

export function StepLoop({ steps, variant = "loop", reveal = false, className }: StepLoopProps) {
  if (variant === "four" && steps.length !== 4) {
    throw new Error(`StepLoop variant "four" lays out exactly four steps (two by two, then one row); got ${steps.length}`);
  }
  return (
    <ol className={clsx("kh-steps", variant !== "loop" && `ks-steps--${variant}`, className)} data-reveal={reveal ? "" : undefined}>
      {steps.map((step, i) => (
        <li key={i} className={clsx("kh-step", step.tone && `kh-tone-${step.tone}`)}>
          <span className="kh-step__num" aria-hidden="true">
            {i + 1}
          </span>
          <h3 className="kh-step__title">{step.title}</h3>
          <p className="kh-step__body">{step.body}</p>
        </li>
      ))}
    </ol>
  );
}
