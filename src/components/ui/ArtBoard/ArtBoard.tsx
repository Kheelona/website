import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ArtLayer, ImageRef, Tone } from "@/content/types";
import { asDoodleName, Doodle } from "@/components/ui/Doodle/Doodle";
import { svgSrc } from "@/components/ui/Doodle/doodle-files";
import { type LayerPlacement, resolvePlacement, SvgLayer } from "@/components/ui/Doodle/layer";
import { imageRatio, imageSource, loadingFor, scaleSizes } from "@/components/ui/Photo/image";
import type { MediaRatio } from "@/components/ui/Photo/Photo";

/* The DS scrapbook board (task 2.3; kh-art, bundle.css:1164-1166; DS 10-pages.md:42-52; ADR-010).
 *
 * Approved markup (home.html:22-26, meet-kheelu.html:19-25): `<div class="kh-art kh-tone-…" role="img"
 * aria-label="…">` holding `kh-art__layer` images placed in % (a shape behind, the cast and Kheelu stickers, one
 * doodle), then an optional word sticker. Rasters go through next/image, each asking for its share of the board's
 * `sizes`; DS shapes (SVG) stay plain <img> (next/image does not optimise SVG); doodles go through Doodle, still
 * in a hero (D049 pick 2) and drawn below the first screen (pick 3). */

/**
 * The board's props without its loading pair (`hero`, `lcp`). A wrapper that renders a board of its own (a section's
 * hero art, a close's art) takes these and passes `hero` and `lcp` literally (`<ArtBoard {...props} hero lcp />`, or
 * neither below the first screen): the pair is a union (`HeroLoading`), so the wrapper decides where its board sits
 * and its caller cannot hand it an LCP hint for a board below the fold (task 3.6; ArtBoard.test-d.tsx).
 */
export interface ArtBoardBase {
  readonly tone: Tone;
  /** The board's accessible name (role="img"); omit when the board only decorates. */
  readonly label?: string;
  /** In order, back to front (DS 10-pages.md:46-52). */
  readonly layers: readonly ArtLayer[];
  /** The board's own rendered width at each layout; each raster layer takes its `width` share of it. */
  readonly sizes: string;
  /** A word sticker (ui/Sticker), last on the board. */
  readonly sticker?: ReactNode;
  /** A fixed ratio other than the DS 1:1, as the DS --kh-ratio variable (refund.css:14, stories.css:47). */
  readonly ratio?: MediaRatio;
  /** At most 480 px wide between 720 and 899 px (ks-art--clamp; mockup-css-mapping §6.7). */
  readonly clamp?: boolean;
  /** Fades in once on scroll (D049 pick 1); never in a hero. */
  readonly reveal?: boolean;
  /** The section's own composition class (`ks-…`). */
  readonly className?: string;
}

/** The LCP image is on the first screen, so only a hero board may hold it (task 2.12). */
type HeroLoading =
  | {
      /** On the first screen: doodles stay still (pick 2), shapes and still doodles load eagerly at low priority
       *  (the LCP raster alone is high), nothing reveals. */
      readonly hero: true;
      /** The board holds the page's LCP image: its largest raster loads eagerly at high priority. */
      readonly lcp?: boolean;
    }
  | { readonly hero?: false; readonly lcp?: false };

export type ArtBoardProps = ArtBoardBase & HeroLoading;

type RasterLayerProps = { readonly image: ImageRef; readonly placement: LayerPlacement; readonly sizes: string; readonly lcp: boolean };

/** An SVG file, which next/image does not optimise: served as a .svg URL (Next), or inlined as an SVG data URI where
 *  the bundler inlines small assets (Vite, in Storybook). */
const isSvg = (ref: ImageRef) => /\.svg(?:[?#]|$)|^data:image\/svg\+xml[,;]/i.test(svgSrc(ref.src));

/** The raster with the largest rendered area (width share squared times the image's own ratio), or -1. */
function largestRaster(layers: readonly ArtLayer[]): number {
  let best = -1;
  let bestArea = 0;
  layers.forEach((layer, i) => {
    if (!layer.image || isSvg(layer.image)) return;
    const area = (layer.width / 100) ** 2 * imageRatio(layer.image);
    if (area > bestArea) [best, bestArea] = [i, area];
  });
  return best;
}

function RasterLayer({ image, placement, sizes, lcp }: RasterLayerProps) {
  const p = resolvePlacement(placement);
  const props = { ...imageSource(image), className: "kh-art__layer", sizes: scaleSizes(sizes, p.width / 100), ...loadingFor(lcp) };
  return p.top !== undefined ? (
    <Image {...props} alt={image.alt} style={{ left: `${p.left}%`, width: `${p.width}%`, top: `${p.top}%`, transform: `rotate(${p.rotate}deg)` }} />
  ) : (
    <Image {...props} alt={image.alt} style={{ left: `${p.left}%`, width: `${p.width}%`, bottom: `${p.bottom}%`, transform: `rotate(${p.rotate}deg)` }} />
  );
}

export function ArtBoard({ tone, label, layers, sizes, sticker, hero, lcp, ratio, clamp, reveal, className }: ArtBoardProps) {
  // The type refuses lcp without hero; this catches props that reach the board untyped (content cast at run time).
  if (lcp && !hero) throw new Error("ArtBoard: lcp only together with hero (the LCP image is on the first screen)");
  // A hero, and so the board holding the LCP image, never fades in.
  if (hero && reveal) throw new Error("A hero art board never fades in on scroll (D049 pick 2, architecture §11.2)");
  const lcpAt = lcp ? largestRaster(layers) : -1;
  return (
    <div
      className={clsx("kh-art", `kh-tone-${tone}`, clamp && "ks-art--clamp", className)}
      role={label ? "img" : undefined}
      aria-label={label}
      data-reveal={reveal ? "" : undefined}
      style={{ "--kh-ratio": ratio } as CSSProperties}
    >
      {layers.map((layer, i) => {
        if (layer.doodle) {
          const { name, draw, order } = layer.doodle;
          return <Doodle key={i} name={asDoodleName(name)} draw={!hero && draw !== false} order={order} className="kh-art__layer" placement={layer} lazy={!hero} />;
        }
        if (isSvg(layer.image)) return <SvgLayer key={i} src={svgSrc(layer.image.src)} className="kh-art__layer" placement={layer} lazy={!hero} />;
        return <RasterLayer key={i} image={layer.image} placement={layer} sizes={sizes} lcp={i === lcpAt} />;
      })}
      {sticker}
    </div>
  );
}
