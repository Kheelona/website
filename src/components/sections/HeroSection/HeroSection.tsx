import clsx from "clsx";
import type { ArtBoardRef } from "@/content/types";
import { ArtBoard } from "@/components/ui/ArtBoard/ArtBoard";
import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { Photo, type MediaRatio } from "@/components/ui/Photo/Photo";
import { cssRatio } from "@/components/ui/Photo/image";
import { RichText } from "@/components/ui/RichText/RichText";
import { Sticker } from "@/components/ui/Sticker/Sticker";
import type { HeroMedia, HeroPhoto, HeroSectionProps } from "./hero-section.types";

export type { HeroPhoto, HeroSectionConfig, HeroSectionProps } from "./hero-section.types";

/** The hero media's width: the narrow column of the 7:5 split from 900 px (480 px at the 1200 px content max), the
 *  full column below, at most 480 px on tablets where the board is clamped. */
const MEDIA_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, calc(100vw - 32px)";
const CLAMPED_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) 480px, calc(100vw - 32px)";
/** D061 item 1: with a phone board, each board asks for its pictures at its own widths only. The phone board is the full
 *  column under 720 px; the approved board shows from 720 px. Where a board is hidden (display: none) its eager LCP
 *  image still loads, so there it asks for the smallest rendition (1 px), never a second full-size picture. */
const PHONE_SIZES = "(min-width: 720px) 1px, calc(100vw - 32px)";
const FROM_TABLET_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) calc(100vw - 32px), 1px";
/** The phone board's ratio: 4:3, the one the approved mockup renders a board at on phones (the buyer's guide's plush
 *  board, ai-toys-for-kids-in-india.css:30, 1:1 from 900 px). The DS recipe's 1:1 or 4:5 board would end 122 or 212 px
 *  below a 390 x 844 screen on Home; at 4:3 Kheelu, placed by the content's `phoneLayers`, ends inside it. */
const PHONE_RATIO = "4 / 3";
/** The hero photo's 4:5 crop (task Q2.1): from 720 px, at most 480 px wide until the split begins at 900 px
 *  (ArtBoard's tablet clamp, `ks-art--clamp`), the split's narrow column from 900 px; 1 px under 720 px. */
const PHOTO_FROM_TABLET_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) 480px, 1px";

/**
 * The first fold of a page (task 3.3; components §2): `Section` (`ks-hero`: the tighter top padding that lands the
 * CTA and the price sentence inside a 360 x 590 screen, mockup.css:16-21) + `Split` + the hero `Heading` (the page's
 * one h1) + the CTA block or an answer + media. Per D049 pick 2 nothing here moves: no `data-reveal`, and the board's
 * doodles are the DS files as still images (`ArtBoard hero`). Home's media is a library photo since task Q2.1 (`photo`,
 * D064 item 4; `HeroPhotos`). The hero's media is the page's LCP image (eager,
 * fetchpriority high; Next 16's deprecated `priority` is never used). Layouts: see hero-section.types.ts. The
 * contact hero's lead links take the DS emphasis weight in a rule scoped to that layout (`ks-hero--contact`,
 * mockup-css-mapping §6.2).
 */
export function HeroSection(props: HeroSectionProps) {
  const { heading, offer } = props;
  const wordsOnly = props.variant === "hub" || (props.variant === "answer" && !props.media);
  const title = (
    <Heading
      eyebrow={heading.eyebrow}
      title={heading.title}
      lead={heading.lead}
      level={1}
      hero
      id={heading.id}
      offer={offer}
      className={wordsOnly ? "ks-hero-words" : undefined}
    />
  );

  switch (props.variant) {
    case "art":
    case "product": {
      return (
        <Section className="ks-hero" labelledBy={heading.id}>
          <Container>
            <Split wide="start">
              <div>
                {title}
                {props.cta}
              </div>
              {props.photo ? (
                <HeroPhotos photo={props.photo} />
              ) : (
                <>
                  {/* D061 item 1: the phone board first; hero-section.css shows it under 720 px, under the trust line.
                      Its word sticker sits top left on both pages, out of the column the WhatsApp bubble covers (D050). */}
                  {props.phoneLayers && (
                    <HeroBoard
                      art={{ ...props.art, layers: props.phoneLayers }}
                      sizes={PHONE_SIZES}
                      ratio={PHONE_RATIO}
                      stickerClass="ks-hero-sticker"
                      className="ks-hero__phone-art"
                    />
                  )}
                  <HeroBoard
                    art={props.art}
                    sizes={props.phoneLayers ? FROM_TABLET_SIZES : undefined}
                    stickerClass={props.variant === "product" ? "ks-hero-sticker" : undefined}
                  />
                </>
              )}
            </Split>
          </Container>
        </Section>
      );
    }
    case "answer":
      return (
        <Section className="ks-hero" labelledBy={heading.id}>
          <Container>
            {props.media ? (
              <Split wide="start">
                {title}
                <AnswerMedia media={props.media} />
              </Split>
            ) : (
              title
            )}
          </Container>
        </Section>
      );
    case "contact":
      return (
        <Section className="ks-hero ks-hero--contact" labelledBy={heading.id}>
          <Container>
            <Split wide="start">
              {title}
              {/* The sticky bar stays hidden while #hero-cta is on screen (StickyBuyBar, task 3.1), so it never covers
                  the WhatsApp button at load (contact.html fold 1). */}
              <div className="ks-contact-ways" id="hero-cta">
                {props.ways.map((way) => (
                  <Button key={way.href} variant="secondary" block href={way.href} icon={way.icon}>
                    {way.label}
                  </Button>
                ))}
              </div>
            </Split>
          </Container>
        </Section>
      );
    case "hub": {
      const { topics } = props;
      return (
        <Section band className="ks-hero ks-journal-intro" labelledBy={heading.id}>
          <Container>
            {title}
            {props.written !== undefined && <RichText as="p" className="kh-body-s ks-written" text={props.written} offer={offer} />}
            <nav className="ks-topics" aria-labelledby={topics.id}>
              <p className="kh-label-s ks-topics__label" id={topics.id}>
                {topics.label}
              </p>
              <ul>
                {topics.links.map((link) => (
                  <li key={link.href}>
                    <a className="kh-tag" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </Container>
        </Section>
      );
    }
  }
}

interface HeroBoardProps {
  readonly art: ArtBoardRef;
  readonly stickerClass?: string;
  readonly clamp?: boolean;
  /** The board's own widths, when it shows at some widths only (D061 item 1); else the hero media's. */
  readonly sizes?: string;
  readonly ratio?: MediaRatio;
  readonly className?: string;
}

/** The scrapbook board on the first screen: still doodles, the LCP raster, the word sticker last. */
function HeroBoard({ art, stickerClass, clamp, sizes, ratio, className }: HeroBoardProps) {
  return (
    <ArtBoard
      tone={art.tone}
      label={art.label}
      layers={art.layers}
      sizes={sizes ?? (clamp ? CLAMPED_SIZES : MEDIA_SIZES)}
      sticker={art.sticker && <Sticker {...art.sticker} className={stickerClass} />}
      hero
      lcp
      ratio={ratio}
      clamp={clamp}
      className={className}
    />
  );
}

/**
 * The hero's library photo (task Q2.1, D064 item 4): its phone crop first, in the phone board's place
 * (`ks-hero__phone-art`: under 720 px right under the trust line, hero-section.css), then its 4:5 crop from 720 px
 * (`ks-hero-photo`; 480 px wide at most between 720 and 899 px, where it follows the words in one column: ArtBoard's
 * tablet clamp, `ks-art--clamp`, as the buyer's guide's hero board). Each is a crop cut to the shape it shows at, so its DS frame takes the crop's own ratio and shows it
 * whole (`cssRatio`). Each holds the LCP image at its own widths, asking for 1 px where it is hidden (D061 item 1's rule
 * for the two boards). Still, as every hero picture (D049 pick 2).
 */
function HeroPhotos({ photo }: { photo: HeroPhoto }) {
  return (
    <>
      <Photo image={photo.phone} sizes={PHONE_SIZES} ratio={cssRatio(photo.phone)} xl lcp className="ks-hero__phone-art" />
      <Photo image={photo.image} sizes={PHOTO_FROM_TABLET_SIZES} ratio={cssRatio(photo.image)} xl lcp className="ks-hero-photo ks-art--clamp" />
    </>
  );
}

function AnswerMedia({ media }: { media: HeroMedia }) {
  if (media.kind === "photo") {
    return <Photo image={media.image} sizes={MEDIA_SIZES} variant={media.variant} xl={media.xl} lcp />;
  }
  return <HeroBoard art={media.art} clamp={media.clamp} className={clsx(media.stacked && "ks-team-board")} />;
}
