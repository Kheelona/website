import { SHAPE_PATHS, type ShapeKind } from "@/lib/shape-paths";

/** Brand shape primitives (paths shared with the 3D field via
 *  lib/shape-paths.ts). Inlined SVG because the source files use
 *  fill="currentColor", which <img> cannot color. Most shapes share the
 *  67.064 design-system viewBox; the kheelona.ai kit additions carry
 *  their own. */
const VIEWBOX: Partial<Record<ShapeKind, string>> = {
  triangle5: "0 0 70.365 64.736",
  polygon: "0 0 76.836 76.836",
};

export function Shape({
  kind,
  className,
  color = "currentColor",
  opacity = 0.15,
}: {
  kind: ShapeKind;
  className?: string;
  color?: string;
  opacity?: number;
}) {
  return (
    <svg
      viewBox={VIEWBOX[kind] ?? "0 0 67.064 67.064"}
      aria-hidden="true"
      className={className}
    >
      <path d={SHAPE_PATHS[kind]} fill={color} fillOpacity={opacity} />
    </svg>
  );
}
