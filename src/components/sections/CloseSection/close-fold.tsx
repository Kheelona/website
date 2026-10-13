import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { CtaBlock } from "../CtaBlock/CtaBlock";
import type { SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";
import type { CloseSectionProps } from "./close-section.types";

/* The parts every close shares, and the centred close itself, in a module that never reaches the art board (task 4.9
 * item 4): CloseSection's art variants import close-art.tsx, and through ArtBoard next/image, whose client code would
 * ship with any page that loads CloseSection. The 404 renders only the centred close and sits outside every layout, so
 * whatever it loads is its own chunk: it loads this module, not CloseSection. */

/** The close's section and container: `#close` named by `#close-title` (`#help` on /setup). */
export function CloseFold({ id = "close", className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <Section id={id} labelledBy={`${id}-title`} className={className}>
      <Container>{children}</Container>
    </Section>
  );
}

interface CloseHeadingProps {
  heading: SellingHeading;
  context: SellingContext;
  center?: boolean;
  id?: string;
  children?: ReactNode;
}

/** The close's heading: eyebrow, title and lead from the close's config, worded with the live offer. */
export function CloseHeading({ heading, context, center, id = "close-title", children }: CloseHeadingProps) {
  return (
    <Heading
      align={center ? "center" : undefined}
      eyebrow={heading.eyebrow}
      title={heading.title}
      lead={heading.lead}
      id={id}
      offer={context.offer}
    >
      {children}
    </Heading>
  );
}

/** The centred close (CloseSection's `center` variant: the team, contact and 404 closes): the heading and the CTA block,
 *  centred, no art. CloseSection renders it for `center`; the 404 renders it directly. Server component. */
export function CenterClose(props: Extract<CloseSectionProps, { variant: "center" }>) {
  const { offer, ctaLabel, help } = props;
  const context: SellingContext = { offer, ctaLabel, help };
  return (
    <CloseFold>
      <CloseHeading heading={props.heading} context={context} center />
      <CtaBlock {...props.cta} align="center" {...context} />
    </CloseFold>
  );
}
