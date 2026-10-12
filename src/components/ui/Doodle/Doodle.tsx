import { DOODLE_NAMES, DOODLES, type DoodleName } from "@/assets/doodles.generated";
import type { DrawOrder } from "@/content/types";
import { doodleSrc } from "./doodle-files";
import { type LayerPlacement, resolvePlacement, SvgLayer } from "./layer";

/* A DS doodle on a board (task 2.3; D049 picks 2 and 3, ADR-010, architecture §11.2 row 3 and §11.3).
 *
 * - Still (`draw` false): the DS file as a plain decorative <img>, as the approved mockup shows every doodle.
 *   Heroes always use this: nothing on the first screen moves (pick 2).
 * - Drawn (`draw` true, below the first screen only): the generated inline SVG (src/assets/doodles.generated.tsx)
 *   with `data-draw` and `data-draw-order`. motion.css strokes `.ks-doodle[data-draw] path:not(.ks-doodle__fill)`
 *   from offset 1 to 0 once MotionController marks it `.is-in`, `order` 2 to 5 starting 400 ms steps later;
 *   without JavaScript or with reduced motion it is simply drawn. Its grain filter is the page's one shared
 *   `#ks-chalk` (DoodleDefs).
 */

export interface DoodleProps {
  readonly name: DoodleName;
  /** The inline SVG that draws itself; false for a still <img> (always false in a hero). */
  readonly draw: boolean;
  /** The draw step, 1 to 5 (default 1). Drawn doodles only. */
  readonly order?: DrawOrder;
  /** The board's layer class: `kh-art__layer` or `kh-imagine__doodle`. */
  readonly className: string;
  readonly placement: LayerPlacement;
  /** A still doodle below the first screen: `loading="lazy"`. */
  readonly lazy?: boolean;
}

/** A content string as a `DoodleName`; a name the DS does not have stops the render (and so the build). */
export function asDoodleName(name: string): DoodleName {
  if ((DOODLE_NAMES as readonly string[]).includes(name)) return name as DoodleName;
  throw new Error(`"${name}" is not a design-system doodle (one of: ${DOODLE_NAMES.join(", ")})`);
}

export function Doodle({ name, draw, order = 1, className, placement, lazy }: DoodleProps) {
  if (!draw) return <SvgLayer src={doodleSrc(name)} className={className} placement={placement} lazy={lazy} />;
  const Svg = DOODLES[name];
  const p = resolvePlacement(placement);
  return p.top !== undefined ? (
    <Svg className={className} data-draw="" data-draw-order={order} style={{ left: `${p.left}%`, width: `${p.width}%`, top: `${p.top}%`, transform: `rotate(${p.rotate}deg)` }} />
  ) : (
    <Svg className={className} data-draw="" data-draw-order={order} style={{ left: `${p.left}%`, width: `${p.width}%`, bottom: `${p.bottom}%`, transform: `rotate(${p.rotate}deg)` }} />
  );
}
