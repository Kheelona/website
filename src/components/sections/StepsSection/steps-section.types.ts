import type { Copy, RichTextString, SitePath, Tone } from "@/content/types";

/** One step: its title and line, and the numeral circle's tone where the page gives one. */
export interface StepsSectionStep {
  readonly title: RichTextString;
  readonly body: RichTextString;
  readonly tone?: Tone;
}

/**
 * StepsSection's configuration: numbered steps under their heading, in one of the three approved placements:
 * - `checks`: the buyer's guide's five checks (ai-toys-for-kids-in-india.html fold 2), revealed once on scroll as
 *   approved, with an optional ghost link after them;
 * - `four`: setup's four steps (setup.html fold 3), exactly four;
 * - `thanks`: the confirmation's next steps (store-confirmation.html fold 4), a plain section in its column under the
 *   store's own heading style.
 */
export interface StepsSectionConfig {
  readonly variant: "checks" | "four" | "thanks";
  readonly heading: {
    readonly eyebrow?: Copy;
    readonly title: Copy;
    readonly lead?: Copy;
    /** The heading's id, which names the section ("checks-title", "connect-title", "next-title" by default). */
    readonly id?: string;
  };
  readonly steps: readonly StepsSectionStep[];
  /** A ghost link after the steps (the guide's "Read more"). */
  readonly action?: { readonly label: string; readonly href: SitePath };
  /** The cream band. */
  readonly band?: boolean;
  /** The section's anchor (setup's "connect"). */
  readonly id?: string;
}
