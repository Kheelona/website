import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading/Heading";
import { Icon } from "@/components/ui/Icon/Icon";
import { Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { OfferCard } from "@/components/ui/OfferCard/OfferCard";
import { Photo } from "@/components/ui/Photo/Photo";
import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { RichText } from "@/components/ui/RichText/RichText";
import type { OfferCardPlacement } from "@/content/types";
import { CloseArt } from "../CloseSection/close-art";
import { iconName } from "../CtaBlock/icon-name";
import { SellingHelpLine, SellingTrustLine } from "../CtaBlock/selling-lines";
import type { OfferSectionProps } from "./offer-section.types";

/** The section ids and its heading ids, as the approved mockup has them (fragments other pages link to). */
const IDS = { close: { section: "close", title: "close-title" }, photo: { section: "offer", title: "offer-title" } } as const;
/** Whose perks the card lists (content/en-IN/offer.ts). */
const PLACEMENT: Record<OfferSectionProps["variant"], OfferCardPlacement> = { close: "home", photo: "product" };

/** The product photo beside the card: 256 px on phones (meet-kheelu.css:22), at most 512 px from 900 px (:27). */
const OFFER_PHOTO_SIZES = "(min-width: 1024px) 512px, (min-width: 900px) 480px, 256px";

/**
 * Everything a parent needs to say yes in one place (architecture §5.2; home.md fold 9; meet-kheelu.md fold 3): the
 * centred heading, the DS OfferCard for the live mode (G-08: no split in full mode), the linked trust row and the help
 * line, beside the art board (Home's close) or the product photo (the product page). The card's button is the
 * placement's `PreorderButton`. Server component; never revealed on arrival (the offer card and the price, §11.2).
 */
export function OfferSection(props: OfferSectionProps) {
  const { variant, heading, cta, trust, offer, ctaLabel, help } = props;
  const ids = IDS[variant];
  const card = (
    <OfferCard
      offer={offer}
      perks={offer.card.perks[PLACEMENT[variant]].map((perk) => ({
        icon: <Icon name={iconName(perk.icon)} />,
        text: <RichText text={perk.text} offer={offer} />,
      }))}
      action={<PreorderButton cta={cta} label={ctaLabel} size="l" block />}
      label={props.variant === "close" ? props.cardLabel : undefined}
      id={variant === "close" ? "offer" : undefined}
    />
  );
  const lines = (
    <>
      <SellingTrustLine items={trust} offer={offer} />
      <SellingHelpLine help={help} />
    </>
  );
  let body: ReactNode;
  if (props.variant === "close") {
    body = (
      <Split>
        <div>
          {card}
          <RichText as="p" className="kh-body-s" text={offer.plus} offer={offer} />
          {lines}
        </div>
        <CloseArt art={props.art} />
      </Split>
    );
  } else {
    body = (
      <Split className="ks-offer-split">
        <div className="ks-offer-col">
          {card}
          {lines}
        </div>
        <Photo image={props.photo} sizes={OFFER_PHOTO_SIZES} variant="square" xl className="ks-offer-photo" />
      </Split>
    );
  }
  return (
    <Section id={ids.section} labelledBy={ids.title}>
      <Container>
        <SectionHead>
          <Heading align="center" eyebrow={heading.eyebrow} title={heading.title} lead={heading.lead} id={ids.title} offer={offer} />
        </SectionHead>
        {body}
      </Container>
    </Section>
  );
}
