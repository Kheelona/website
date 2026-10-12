import type { Copy, RichTextString, SitePath, Tone } from "@/content/types";

/** One step: its title and line, and the numeral circle's tone where the page gives one. */
export interface StepsSectionStep {
  readonly title: RichTextString;
  readonly body: RichTextString;
  readonly tone?: Tone;
}

/** What every placement shares: the heading over the steps and the section's anchor. */
interface StepsSectionBase {
  readonly heading: {
    readonly eyebrow?: Copy;
    readonly title: Copy;
    readonly lead?: Copy;
    /** The heading's id, which names the section ("checks-title", "connect-title", "next-title" by default). */
    readonly id?: string;
  };
  /** The section's anchor (setup's "connect"). */
  readonly id?: string;
}

/** The full-width placements (`checks`, `four`): a DS section that may sit on the cream band and end on a ghost link. */
interface StepsSectionFull extends StepsSectionBase {
  /** A ghost link after the steps (the guide's "Read more"). */
  readonly action?: { readonly label: string; readonly href: SitePath };
  /** The cream band. */
  readonly band?: boolean;
}

/** `checks`: the buyer's guide's five checks (ai-toys-for-kids-in-india.html fold 2), revealed once on scroll as
 *  approved, with an optional ghost link after them. */
export interface StepsSectionChecks extends StepsSectionFull {
  readonly variant: "checks";
  readonly steps: readonly StepsSectionStep[];
}

/** `four`: setup's four steps (setup.html fold 3), exactly four (StepLoop's two-by-two layout also refuses others). */
export interface StepsSectionFour extends StepsSectionFull {
  readonly variant: "four";
  readonly steps: readonly [StepsSectionStep, StepsSectionStep, StepsSectionStep, StepsSectionStep];
}

/** `thanks`: the confirmation's next steps (store-confirmation.html fold 4), a plain section in its column under the
 *  store's own heading style: no band and no ghost link, so neither can be passed. */
export interface StepsSectionThanks extends StepsSectionBase {
  readonly variant: "thanks";
  readonly steps: readonly StepsSectionStep[];
  readonly action?: never;
  readonly band?: never;
}

/**
 * StepsSection's configuration: numbered steps under their heading, one type per approved placement (a discriminated
 * union on `variant`), so a placement takes only what it renders.
 */
export type StepsSectionConfig = StepsSectionChecks | StepsSectionFour | StepsSectionThanks;
