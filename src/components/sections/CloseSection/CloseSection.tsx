import { Card } from "@/components/ui/Card/Card";
import { HelpLine } from "@/components/ui/HelpLine/HelpLine";
import { Actions, Split } from "@/components/ui/Layout/Layout";
import type { MediaRatio } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import type { ArtBoardRef } from "@/content/types";
import { CtaBlock, SecondaryLink } from "../CtaBlock/CtaBlock";
import type { CtaBlockConfig, SellingContext, SellingHeading } from "../CtaBlock/cta-block.types";
import { CloseArt } from "./close-art";
import { CenterClose, CloseFold, CloseHeading } from "./close-fold";
import type { CloseSectionProps } from "./close-section.types";

/**
 * A page's last fold (architecture §5.1; components §2): the heading and one calm next step. Every close of the
 * approved mockup, by variant (close-section.types.ts): the CTA block beside an art board (`split`, `journal`), in a
 * tinted card (`guide`), centred without art (`center`), or /setup's contact links with no chilli button (`links`).
 * The fold, the heading and the centred close live in close-fold.tsx, which never reaches the art board, so a page that
 * renders only the centred close (the 404) can load it without next/image (task 4.9).
 * Server component; never revealed on arrival: the mockup reveals no close, and each holds a chilli button and the
 * price (architecture §11.2).
 */
export function CloseSection(props: CloseSectionProps) {
  const { offer, ctaLabel, help } = props;
  const context: SellingContext = { offer, ctaLabel, help };
  switch (props.variant) {
    case "split":
      return (
        <CloseFold band={props.band}>
          <BesideArt heading={props.heading} cta={props.cta} context={context} art={props.art} clamp={props.artClamp} />
        </CloseFold>
      );
    case "journal":
      return (
        <CloseFold band={props.band} className="ks-close-journal">
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
      /* The words in the DS's wide start column from 900 px (7:5; task Q2.15, the consistency review's CON-11): half the
         tinted card was too narrow for the trust line's two items on one row, as every other split close keeps them. */
      return (
        <CloseFold band={props.band}>
          <Card as="div" variant="tint" tone={props.tone} className="ks-gd-close">
            <BesideArt heading={props.heading} cta={props.cta} context={context} art={props.art} clamp wide="start" />
          </Card>
        </CloseFold>
      );
    case "center":
      return <CenterClose {...props} />;
    case "links":
      return (
        <CloseFold id="help" band={props.band}>
          <CloseHeading heading={props.heading} context={context} center id="help-title">
            <HelpLine size="body-l" contact={<RichText text={props.contact} offer={offer} />} className="ks-setup-help" />
          </CloseHeading>
          <Actions center>
            <SecondaryLink link={props.action} />
          </Actions>
          {props.meet && (
            <HelpLine
              size="body"
              lead={<RichText text={props.meet.lead} offer={offer} />}
              contact={<RichText text={props.meet.link} offer={offer} />}
              className="ks-setup-meet"
            />
          )}
        </CloseFold>
      );
  }
}

interface BesideArtProps {
  heading: SellingHeading;
  cta: Omit<CtaBlockConfig, "align">;
  context: SellingContext;
  art: ArtBoardRef;
  clamp?: boolean;
  ratio?: MediaRatio;
  artClassName?: string;
  /** The split's wider column from 900 px (the DS's `kh-split--wide-start`); equal columns without it. */
  wide?: "start";
}

/** The heading and the CTA block in the first column of a split, the art board in the second. */
function BesideArt({ heading, cta, context, art, clamp, ratio, artClassName, wide }: BesideArtProps) {
  return (
    <Split wide={wide}>
      <div>
        <CloseHeading heading={heading} context={context} />
        <CtaBlock {...cta} {...context} />
      </div>
      <CloseArt art={art} clamp={clamp} ratio={ratio} className={artClassName} />
    </Split>
  );
}
