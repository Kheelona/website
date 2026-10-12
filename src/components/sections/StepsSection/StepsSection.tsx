import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { Actions, Container, Section, SectionHead } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { StepLoop } from "@/components/ui/StepLoop/StepLoop";
import type { Copy, Offer } from "@/content/types";
import type { StepsSectionConfig } from "./steps-section.types";

/**
 * Numbered steps under their heading (task 3.4): the DS StepLoop (ui/StepLoop holds the three layouts) in the three
 * approved placements. `checks` (the guide) and `four` (setup) are full sections with the DS section heading; the
 * guide's checks reveal once on scroll, as the mockup marks them, and may end on a ghost link. `thanks` is the
 * confirmation's plain section inside its column, headed in the store's `ks-h2` style (StoreDetails, task 5.15).
 * Server component.
 */
export type StepsSectionProps = StepsSectionConfig & {
  /** For an amount in a step (the confirmation's balance). */
  offer?: Offer;
};

const TITLE_IDS = { checks: "checks-title", four: "connect-title", thanks: "next-title" } as const;

export function StepsSection({ variant, heading, steps, action, band, id, offer }: StepsSectionProps) {
  const titleId = heading.id ?? TITLE_IDS[variant];
  const loop = (
    <StepLoop
      variant={variant === "thanks" ? "loop" : variant}
      className={variant === "thanks" ? "ks-thanks__steps" : undefined}
      reveal={variant === "checks"}
      steps={steps.map((step) => ({
        tone: step.tone,
        title: <RichText text={step.title} offer={offer} />,
        body: <RichText text={step.body} offer={offer} />,
      }))}
    />
  );
  if (variant === "thanks") {
    return (
      <section id={id} aria-labelledby={titleId}>
        <RichText as="h2" className="kh-title ks-h2" id={titleId} text={heading.title} offer={offer} />
        {loop}
      </section>
    );
  }
  return (
    <Section id={id} band={band} labelledBy={titleId}>
      <Container>
        <SectionHead>
          <Heading eyebrow={heading.eyebrow} title={heading.title} lead={heading.lead} id={titleId} offer={offer} />
        </SectionHead>
        {loop}
        {action && (
          <Actions>
            <Button variant="ghost" href={action.href} iconEnd="arrow-right">
              {action.label}
            </Button>
          </Actions>
        )}
      </Container>
    </Section>
  );
}

export interface StepsTipProps {
  /** The tip, from content. */
  text: Copy;
  offer?: Offer;
}

/**
 * Setup's Wi-Fi tip (setup.html fold 2; setup.css:9), a large bold line kept to a reading measure. It closes the
 * "Before you start" fold, above the steps, so it is its own part: the page composes it into that fold.
 */
export function StepsTip({ text, offer }: StepsTipProps) {
  return <RichText as="p" className="kh-body-l ks-setup-tip" text={text} offer={offer} />;
}
