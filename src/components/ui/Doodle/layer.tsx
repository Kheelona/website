/* Placing a layer on an art board or an imagination frame (DS 10-pages.md:50: "Place every layer with left,
   top or bottom and width in %, so the board scales with its column").
 *
 * The inline style is the one the architecture allows (§4.4): percent positions and a rotation, written as
 * template literals so test/guards/no-off-token.test.ts can check their shape. A right anchor (the content
 * model allows one, src/content/types.ts ArtPlacement) becomes the same left edge, 100 - right - width: every
 * percentage here is of the board's width, so the box and its rotation centre do not move. The rotation is
 * always written (rotate(0deg) when there is none): an identity transform paints the same pixels and keeps
 * one style shape per vertical anchor.
 */

/** Where a layer sits, in percent of its board (the shape of an `ArtLayer`'s placement in the content model). */
export interface LayerPlacement {
  readonly left?: number;
  readonly right?: number;
  readonly top?: number;
  readonly bottom?: number;
  readonly width: number;
  /** Degrees. */
  readonly rotate?: number;
}

type Edge = { readonly left: number; readonly width: number; readonly rotate: number };
/** A placement with one horizontal edge (left) and exactly one vertical edge. */
export type ResolvedPlacement = Edge &
  ({ readonly top: number; readonly bottom?: undefined } | { readonly bottom: number; readonly top?: undefined });

const isNumber = (n: number | undefined): n is number => typeof n === "number" && Number.isFinite(n);
const round = (n: number) => Math.round(n * 1e4) / 1e4;

export function resolvePlacement(p: LayerPlacement): ResolvedPlacement {
  const describe = () => JSON.stringify(p);
  if (!isNumber(p.width)) throw new Error(`An art-board layer needs a width in percent: ${describe()}`);
  if (isNumber(p.left) === isNumber(p.right)) {
    throw new Error(`An art-board layer needs exactly one of left or right: ${describe()}`);
  }
  if (isNumber(p.top) === isNumber(p.bottom)) {
    throw new Error(`An art-board layer needs exactly one of top or bottom: ${describe()}`);
  }
  const edge: Edge = {
    left: isNumber(p.left) ? p.left : round(100 - (p.right as number) - p.width),
    width: p.width,
    rotate: p.rotate ?? 0,
  };
  return isNumber(p.top) ? { ...edge, top: p.top } : { ...edge, bottom: p.bottom as number };
}

export interface SvgLayerProps {
  /** The SVG file's URL (a static import's `src`). */
  readonly src: string;
  /** The board's layer class: `kh-art__layer` or `kh-imagine__doodle`. */
  readonly className: string;
  readonly placement: LayerPlacement;
  /** Below the first screen: `loading="lazy"`, as the approved mockup marks those layers. On the first screen the
   *  layer loads eagerly, as in the mockup, at `fetchPriority="low"`: React's server renderer hoists a
   *  `<link rel="preload" as="image">` into <head> for every <img> that is neither lazy nor low priority, and a
   *  decorative shape or still doodle must not compete with the page's one LCP image (tasks.md 2.3, architecture §10). */
  readonly lazy?: boolean;
}

/** A decorative SVG file (a DS shape, or a doodle that stays still) as a plain `<img>`: `next/image` does not
 *  optimise SVG (ADR-010). */
export function SvgLayer({ src, className, placement, lazy }: SvgLayerProps) {
  const p = resolvePlacement(placement);
  const load = lazy ? ({ loading: "lazy" } as const) : ({ fetchPriority: "low" } as const);
  return p.top !== undefined ? (
    // eslint-disable-next-line @next/next/no-img-element -- ADR-010: SVG is a plain <img>; next/image does not optimise it
    <img className={className} src={src} alt="" {...load} style={{ left: `${p.left}%`, width: `${p.width}%`, top: `${p.top}%`, transform: `rotate(${p.rotate}deg)` }} />
  ) : (
    // eslint-disable-next-line @next/next/no-img-element -- ADR-010: SVG is a plain <img>; next/image does not optimise it
    <img className={className} src={src} alt="" {...load} style={{ left: `${p.left}%`, width: `${p.width}%`, bottom: `${p.bottom}%`, transform: `rotate(${p.rotate}deg)` }} />
  );
}
