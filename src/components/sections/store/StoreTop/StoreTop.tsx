import { Heading } from "@/components/ui/Heading/Heading";
import { ContentIcon } from "@/components/ui/Icon/Icon";
import { Photo } from "@/components/ui/Photo/Photo";
import { PriceSentence } from "@/components/ui/PriceSentence/PriceSentence";
import { RichText } from "@/components/ui/RichText/RichText";
import { TrustLine } from "@/components/ui/TrustLine/TrustLine";
import { MARKETING_ORIGIN } from "@/config/env";
import type { Offer, TrustItem } from "@/content/types";
import type { StoreTopConfig } from "./store-top.types";

export type { StoreTopConfig } from "./store-top.types";

/** The small Kheelu: 96 px on phones, 128 from 720 px (store.css:46, 78: space-9, space-10). */
const IMAGE_SIZES = "(min-width: 720px) 128px, 96px";

export interface StoreTopProps {
  readonly content: StoreTopConfig;
  /** The store's offer for the live mode: the price sentence (D028) and the delivery line. */
  readonly offer: Offer;
  /** Read after each trust link, which opens its terms in a new tab so a half-filled form survives. */
  readonly newTabNote: string;
  /** The film the small Kheelu opens (D070 / C1, K-176): an in-page link to that film's tile in the page's strip
   *  (FilmsStrip `anchored`, which plays it there), named by the film's own play label. Without it the image is a plain
   *  image, as on the event pages and in the approved mockup. */
  readonly film?: { readonly id: string; readonly label: string };
}

/**
 * A store trust line's items: each promise opens its terms on the marketing site of this build (`MARKETING_ORIGIN`, as
 * the store footer's policy links do: one canonical copy of each policy, on the domain that ranks), with its DS icon and
 * its words from content.
 */
export function storeTrustItems(items: readonly TrustItem[], offer: Offer) {
  return items.map((item) => ({
    icon: <ContentIcon name={item.icon} />,
    label: <RichText text={item.label} offer={offer} />,
    href: `${MARKETING_ORIGIN}${item.href}`,
  }));
}

/**
 * The store's first screen (task 5.15; store.md fold 1; mockup/store.html `mk-store-top`): the eyebrow and the page's
 * one h1 beside a small Kheelu (small on purpose, so the form stays high on a phone), then the price sentence and the
 * compact trust line under both; from 720 px Kheelu sits beside the whole block. The first screen never moves on
 * arrival (D049 pick 2), so nothing here takes a reveal. On the store page the small Kheelu is a link to the first film
 * (`film`; visitors already tap it, D070 / C1); the image keeps its size, its place and its loading. Server component.
 */
export function StoreTop({ content, offer, newTabNote, film }: StoreTopProps) {
  const image = <Photo bare lcp image={content.image} sizes={IMAGE_SIZES} className="ks-store-top__img" />;
  return (
    <section className="ks-store-top" aria-labelledby={content.titleId}>
      <Heading level={1} eyebrow={content.eyebrow} title={content.title} id={content.titleId} offer={offer} className="ks-store-top__head" />
      {film ? (
        <a href={`#${film.id}`} className="ks-store-top__film" aria-label={film.label}>
          {image}
        </a>
      ) : (
        image
      )}
      <PriceSentence offer={offer} variant="store" id={content.priceId} className="ks-store-top__price" />
      <TrustLine items={storeTrustItems(content.trust, offer)} newTabNote={newTabNote} className="ks-store-top__trust" />
    </section>
  );
}
