import clsx from "clsx";
import type { ArtBoardRef } from "@/content/types";
import { ArtBoard } from "@/components/ui/ArtBoard/ArtBoard";
import { Button } from "@/components/ui/Button/Button";
import { Heading } from "@/components/ui/Heading/Heading";
import { Container, Section, Split } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import { Sticker } from "@/components/ui/Sticker/Sticker";
import type { HeroMedia, HeroSectionProps } from "./hero-section.types";

export type { HeroSectionConfig, HeroSectionProps } from "./hero-section.types";

/** The hero media's width: the narrow column of the 7:5 split from 900 px (480 px at the 1200 px content max), the
 *  full column below, at most 480 px on tablets where the board is clamped. */
const MEDIA_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, calc(100vw - 32px)";
const CLAMPED_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, (min-width: 720px) 480px, calc(100vw - 32px)";

/**
 * The first fold of a page (task 3.3; components §2): `Section` (`ks-hero`: the tighter top padding that lands the
 * CTA and the price sentence inside a 360 x 590 screen, mockup.css:16-21) + `Split` + the hero `Heading` (the page's
 * one h1) + the CTA block or an answer + media. Per D049 pick 2 nothing here moves: no `data-reveal`, and the board's
 * doodles are the DS files as still images (`ArtBoard hero`). The hero's media is the page's LCP image (eager,
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
    case "product":
      return (
        <Section className="ks-hero" labelledBy={heading.id}>
          <Container>
            <Split wide="start">
              <div>
                {title}
                {props.cta}
              </div>
              <HeroBoard art={props.art} stickerClass={props.variant === "product" ? "ks-hero-sticker" : undefined} />
            </Split>
          </Container>
        </Section>
      );
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

/** The scrapbook board on the first screen: still doodles, the LCP raster, the word sticker last. */
function HeroBoard({ art, stickerClass, clamp, className }: { art: ArtBoardRef; stickerClass?: string; clamp?: boolean; className?: string }) {
  return (
    <ArtBoard
      tone={art.tone}
      label={art.label}
      layers={art.layers}
      sizes={clamp ? CLAMPED_SIZES : MEDIA_SIZES}
      sticker={art.sticker && <Sticker {...art.sticker} className={stickerClass} />}
      hero
      lcp
      clamp={clamp}
      className={className}
    />
  );
}

function AnswerMedia({ media }: { media: HeroMedia }) {
  if (media.kind === "photo") {
    return <Photo image={media.image} sizes={MEDIA_SIZES} variant={media.variant} xl={media.xl} lcp />;
  }
  return <HeroBoard art={media.art} clamp={media.clamp} className={clsx(media.stacked && "ks-team-board")} />;
}
