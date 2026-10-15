import clsx from "clsx";
import { SectionTitle } from "@/components/sections/FeatureSplit/section-parts";
import { Container, Section } from "@/components/ui/Layout/Layout";
import { Photo } from "@/components/ui/Photo/Photo";
import { RichText } from "@/components/ui/RichText/RichText";
import type { Offer } from "@/content/types";
import { StickyScrollIsland } from "./StickyScroll.client";
import type { StickyScrollExample, StickyScrollPicture, StickyScrollProps } from "./sticky-scroll.types";

export type { StickyScrollConfig, StickyScrollPoint, StickyScrollProps } from "./sticky-scroll.types";

/** The stage's picture: the narrow column of the 5:7 split from 900 px (480 px at the 1200 px content max); 1 px below,
 *  where the stage is not shown. */
const STAGE_SIZES = "(min-width: 1296px) 480px, (min-width: 900px) 40vw, 1px";
/** A point's own small picture on phones and tablets (96 px, --space-9); 1 px from 900 px, where the stage shows it. */
const THUMB_SIZES = "(min-width: 900px) 1px, 96px";

/**
 * What Kheelu is and what a child gets, point by point (task Q2.9; the D2C plan v2 §1.6 and §2 fold 5; D064 items 7 and
 * 10). A plain section named by its h2. Under 900 px the points stack, each with its own small picture beside its title
 * and words (the picture carries the alt). From 900 px it is a 5:7 split: the heading, the stage and the progress line
 * stay in view on the left (`position: sticky`, under the laptop's sticky nav: --ks-nav-clearance) while the points
 * scroll on the right; the stage shows the picture of the point being read, crossfading, and the progress line fills one
 * step per point (StickyScroll.client.tsx marks them; sticky-scroll.css draws them). The stage repeats the points'
 * pictures for sighted readers only: it is hidden from screen readers and its images carry no alt. A point may hold a
 * small written example, labelled above it. Then one line, not a heading, and the page's CTA block (`cta`). Nothing in
 * it sells inside a reveal: the CTA block is outside the points. Reduced motion: no fill and no crossfade.
 */
export function StickyScroll({ id, band, heading, points, line, offer, cta }: StickyScrollProps) {
  return (
    <Section id={id} band={band} labelledBy={heading.id} className="ks-sticky">
      <Container>
        <StickyScrollIsland>
          <div className="ks-sticky__aside">
            <SectionTitle heading={heading} offer={offer} />
            <div className="ks-sticky__stage" data-stage="" aria-hidden="true">
              {points.map((point, i) => (
                <StagePicture key={i} picture={point.picture} on={i === 0} />
              ))}
            </div>
            <ol className="ks-sticky__progress ks-list-reset" data-progress="" aria-hidden="true">
              {points.map((_, i) => (
                <li key={i} data-on={i === 0 ? "" : undefined} />
              ))}
            </ol>
          </div>
          <div className="ks-sticky__main">
            <ol className="ks-sticky__points ks-list-reset" role="list">
              {points.map((point, i) => (
                <li key={i} className="ks-sticky__point" data-point="" data-reveal="">
                  <Thumb picture={point.picture} />
                  <RichText as="h3" className="kh-title ks-sticky__title" text={point.title} offer={offer} />
                  <RichText as="p" className="kh-body ks-sticky__body" text={point.body} offer={offer} />
                  {point.example && <Example example={point.example} id={`${heading.id}-example-${i + 1}`} offer={offer} />}
                </li>
              ))}
            </ol>
            {line !== undefined && <RichText as="p" className="kh-title ks-sticky__line" text={line} offer={offer} />}
            {cta}
          </div>
        </StickyScrollIsland>
      </Container>
    </Section>
  );
}

/** A picture on the stage: decorative there (the point's own picture carries the alt), 4:3, shown when `data-on`. */
function StagePicture({ picture, on }: { picture: StickyScrollPicture; on: boolean }) {
  return (
    <div className={clsx("ks-sticky__pic", picture.fit === "contain" && "ks-sticky__pic--contain")} data-on={on ? "" : undefined}>
      <Photo image={{ ...picture.image, alt: "" }} sizes={STAGE_SIZES} ratio="4 / 3" xl />
    </div>
  );
}

/** A point's own small picture, beside its words on phones and tablets: the one that carries the alt. */
function Thumb({ picture }: { picture: StickyScrollPicture }) {
  return <Photo image={picture.image} sizes={THUMB_SIZES} ratio="1 / 1" className={clsx("ks-sticky__thumb", picture.fit === "contain" && "ks-sticky__thumb--contain")} />;
}

/** The small written example under a point: the label above it names the exchange, each line led by who says it. */
function Example({ example, id, offer }: { example: StickyScrollExample; id: string; offer: Offer | undefined }) {
  if (!example.note.trim()) throw new Error("StickyScroll: a written example needs its label (\"Illustrative example, not a recording.\")");
  return (
    <div className="kh-card ks-sticky__example">
      <p className="kh-label-s" id={id}>
        {example.note}
      </p>
      <ol className="ks-sticky__exchange ks-list-reset" role="list" aria-labelledby={id}>
        {example.lines.map((exchange, i) => (
          <li key={i} className="kh-body-s">
            <span className="kh-label-s">{exchange.who}</span> <RichText text={exchange.text} offer={offer} />
          </li>
        ))}
      </ol>
    </div>
  );
}
