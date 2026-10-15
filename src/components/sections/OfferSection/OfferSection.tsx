import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { ContentIcon } from "@/components/ui/Icon/Icon";
import { Actions, Container, Section, SectionHead, Split } from "@/components/ui/Layout/Layout";
import { OfferCard } from "@/components/ui/OfferCard/OfferCard";
import { Photo } from "@/components/ui/Photo/Photo";
import { PreorderButton } from "@/components/ui/PreorderButton/PreorderButton";
import { RichText } from "@/components/ui/RichText/RichText";
import type { OfferCardPlacement } from "@/content/types";
import { CloseArt } from "../CloseSection/close-art";
import { SellingTrustLine } from "../CtaBlock/selling-lines";
import type { OfferSectionProps } from "./offer-section.types";

/** Whose perks the card lists (content/en-IN/offer.ts; one list for both since task Q2.9). */
const PLACEMENT: Record<OfferSectionProps["variant"], OfferCardPlacement> = { photo: "product", home: "home" };

/** The product photo beside the card: 256 px on phones (meet-kheelu.css:22), at most 512 px from 900 px (:27). */
const OFFER_PHOTO_SIZES = "(min-width: 1024px) 512px, (min-width: 900px) 480px, 256px";

/**
 * Everything a parent needs to say yes in one place (architecture §5.2; meet-kheelu.md fold 3; the D2C plan v2 §2 fold 7
 * and §3 fold 3): the centred heading, section `#offer` (the fragment other pages link to), the DS OfferCard for the live
 * mode (G-08: no split in full mode) and the linked trust row under it, beside the product photo (the product page) or
 * the art board (Home's offer, moved up to fold 7 by task Q2.9). The card's button is the placement's `PreorderButton`.
 * Server component; never revealed on arrival (the offer card and the price, §11.2).
 *
 * Since task 8c.2 (D061, after Gate A): the card prints the later price in token mode (OfferCard), and the column ends
 * with the share link, "Know a parent who needs this? Share Kheelu on WhatsApp", for both placements, from the offer's
 * `share` (content/en-IN/share.ts through src/lib/offer/offer.ts), never from the page files.
 *
 * Since task Q2.13 (the D2C plan v2 §2 fold 7 and §3 fold 3; the CMO's m9) both cards alike: the page's note (the
 * Kheelona+ line, offer.ts `PLUS_NOTE`) inside the card after the perks and before the button; the price printed once,
 * in the card's price block (no fine print: "not repeated"); under the button only the trust row (the trust line and the
 * card's third row) and the share link, no help line (the closes and the store carry it, plan §1.1; the WhatsApp bubble
 * everywhere). Home's close (the `close` variant) left: Home's close is a CloseSection since task Q2.9.
 */
export function OfferSection(props: OfferSectionProps) {
  const { variant, heading, cta, trust, third, note, offer, ctaLabel } = props;
  const card = (
    <OfferCard
      offer={offer}
      perks={offer.card.perks[PLACEMENT[variant]].map((perk) => ({
        icon: <ContentIcon name={perk.icon} />,
        text: <RichText text={perk.text} offer={offer} />,
      }))}
      note={<RichText text={note} offer={offer} />}
      action={<PreorderButton cta={cta} label={ctaLabel} size="l" block />}
      label={props.variant === "home" ? props.cardLabel : undefined}
      fine={false}
    />
  );
  /* The share link, last in the column under both cards (D061; task 8c.2): a ghost link through Button, never chilli
     and never the bubble's green (D050), tracked `share-whatsapp`. Its words and its message come with the offer. It
     opens WhatsApp in a new tab with rel="noopener", as the D050 bubble does (task 8c.5). */
  const share = offer.share && (
    <Actions className="ks-offer-share">
      <Button variant="ghost" href={offer.share.href} cta="share-whatsapp" target="_blank">
        {offer.share.label}
      </Button>
    </Actions>
  );
  return (
    <Section id="offer" labelledBy="offer-title">
      <Container>
        <SectionHead>
          <Heading align="center" eyebrow={heading.eyebrow} title={heading.title} lead={heading.lead} id="offer-title" offer={offer} />
        </SectionHead>
        {/* One composition for both cards (task Q2.15; the consistency review's CON-3, QAL-2, CMO-2): the column (the card,
            the trust line, the card's third row, the share link) against its picture, top-aligned from 900 px (D064
            item 5): Home's board (task Q2.9's offer, the D2C plan v2 §2 fold 7) or the product photo. */}
        <Split className="ks-offer-split">
          <div className="ks-offer-col">
            {card}
            <SellingTrustLine items={trust} offer={offer} />
            <SellingTrustLine items={third} offer={offer} className="ks-offer-third" />
            {share}
          </div>
          {props.variant === "home" ? (
            <CloseArt art={props.art} className="ks-offer-art" />
          ) : (
            <Photo image={props.photo} sizes={OFFER_PHOTO_SIZES} variant="square" xl className="ks-offer-photo" />
          )}
        </Split>
      </Container>
    </Section>
  );
}
