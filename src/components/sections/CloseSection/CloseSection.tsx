import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Actions, Container, Section, Split } from "@/components/ui/Layout/Layout";
import { RichText } from "@/components/ui/RichText/RichText";
import { CtaBlock, SecondaryLink } from "../CtaBlock/CtaBlock";
import type { SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";
import { CloseArt } from "./close-art";
import type { CloseSectionProps } from "./close-section.types";

/**
 * A page's last fold (architecture §5.1; components §2): the heading and one calm next step. Every close of the
 * approved mockup, by variant (close-section.types.ts): the CTA block beside an art board (`split`, `journal`), in a
 * tinted card (`guide`), centred without art (`center`), or /setup's contact links with no chilli button (`links`).
 * Server component; never revealed on arrival: the mockup reveals no close, and each holds a chilli button and the
 * price (architecture §11.2).
 */
export function CloseSection(props: CloseSectionProps) {
  const { offer, ctaLabel, help } = props;
  const context: SellingContext = { offer, ctaLabel, help };
  switch (props.variant) {
    case "split":
      return (
        <CloseFold>
          <Split>
            <div>
              <CloseHeading heading={props.heading} context={context} />
              <CtaBlock {...props.cta} {...context} />
            </div>
            <CloseArt art={props.art} clamp={props.artClamp} />
          </Split>
        </CloseFold>
      );
    case "journal":
      return (
        <CloseFold className="ks-close-journal">
          <Split>
            <div>
              <CloseHeading heading={props.heading} context={context} />
              <CtaBlock {...props.cta} layout="journal" {...context} />
            </div>
            <CloseArt art={props.art} ratio="4 / 3" className="ks-close-journal__art" />
          </Split>
        </CloseFold>
      );
    case "guide":
      return (
        <CloseFold>
          <Card as="div" variant="tint" tone={props.tone} className="ks-gd-close">
            <Split>
              <div>
                <CloseHeading heading={props.heading} context={context} />
                <CtaBlock {...props.cta} {...context} />
              </div>
              <CloseArt art={props.art} clamp />
            </Split>
          </Card>
        </CloseFold>
      );
    case "center":
      return (
        <CloseFold>
          <CloseHeading heading={props.heading} context={context} center />
          <CtaBlock {...props.cta} align="center" {...context} />
        </CloseFold>
      );
    case "links":
      return (
        <CloseFold id="help">
          <CloseHeading heading={props.heading} context={context} center id="help-title">
            <HelpLine size="body-l" contact={<RichText text={props.contact} />} className="ks-setup-help" />
          </CloseHeading>
          <Actions center>
            <SecondaryLink link={props.action} />
          </Actions>
          <HelpLine size="body" lead={<RichText text={props.meet.lead} />} contact={<RichText text={props.meet.link} />} className="ks-setup-meet" />
        </CloseFold>
      );
  }
}

/** The close's section and container: `#close` named by `#close-title` (`#help` on /setup). */
function CloseFold({ id = "close", className, children }: { id?: string; className?: string; children: React.ReactNode }) {
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
  children?: React.ReactNode;
}

function CloseHeading({ heading, context, center, id = "close-title", children }: CloseHeadingProps) {
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
