import type { ReactNode } from "react";
import { Card } from "@/components/ui/Card/Card";
import { Heading } from "@/components/ui/Heading/Heading";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Actions, Container, Section, Split } from "@/components/ui/Layout/Layout";
import type { MediaRatio } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import type { ArtBoardRef } from "@/content/types";
import { CtaBlock, SecondaryLink } from "../CtaBlock/CtaBlock";
import type { CtaBlockConfig, SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";
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
          <BesideArt heading={props.heading} cta={props.cta} context={context} art={props.art} clamp={props.artClamp} />
        </CloseFold>
      );
    case "journal":
      return (
        <CloseFold className="ks-close-journal">
          <BesideArt
            heading={props.heading}
            cta={{ ...props.cta, layout: "journal" }}
            context={context}
            art={props.art}
            ratio="4 / 3"
            artClassName="ks-close-journal__art"
          />
        </CloseFold>
      );
    case "guide":
      return (
        <CloseFold>
          <Card as="div" variant="tint" tone={props.tone} className="ks-gd-close">
            <BesideArt heading={props.heading} cta={props.cta} context={context} art={props.art} clamp />
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
            <HelpLine size="body-l" contact={<RichText text={props.contact} offer={offer} />} className="ks-setup-help" />
          </CloseHeading>
          <Actions center>
            <SecondaryLink link={props.action} />
          </Actions>
          <HelpLine
            size="body"
            lead={<RichText text={props.meet.lead} offer={offer} />}
            contact={<RichText text={props.meet.link} offer={offer} />}
            className="ks-setup-meet"
          />
        </CloseFold>
      );
  }
}

/** The close's section and container: `#close` named by `#close-title` (`#help` on /setup). */
function CloseFold({ id = "close", className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <Section id={id} labelledBy={`${id}-title`} className={className}>
      <Container>{children}</Container>
    </Section>
  );
}

interface BesideArtProps {
  heading: SellingHeading;
  cta: Omit<CtaBlockConfig, "align">;
  context: SellingContext;
  art: ArtBoardRef;
  clamp?: boolean;
  ratio?: MediaRatio;
  artClassName?: string;
}

/** The heading and the CTA block in the first column of a split, the art board in the second. */
function BesideArt({ heading, cta, context, art, clamp, ratio, artClassName }: BesideArtProps) {
  return (
    <Split>
      <div>
        <CloseHeading heading={heading} context={context} />
        <CtaBlock {...cta} {...context} />
      </div>
      <CloseArt art={art} clamp={clamp} ratio={ratio} className={artClassName} />
    </Split>
  );
}

interface CloseHeadingProps {
  heading: SellingHeading;
  context: SellingContext;
  center?: boolean;
  id?: string;
  children?: ReactNode;
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
