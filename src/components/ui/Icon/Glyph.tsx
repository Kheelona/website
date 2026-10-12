import clsx from "clsx";
import { ICON_VIEWBOX, type IconPath } from "@/assets/icons.generated";

export interface GlyphProps {
  /** A DS icon's path: one of the named `ICON_*` constants of `src/assets/icons.generated.ts`. */
  d: IconPath;
  /** An accessible name: the icon becomes `role="img"`. Without it the icon is decorative and hidden. */
  label?: string;
  /** A composition hook such as `ks-btn__arrow` (D049 pick 6), after `kh-icon`. */
  className?: string;
}

/**
 * The DS Icon markup (design-system/project/components/Icon) drawn from one path constant: a Phosphor Bold path on
 * the shared 256 grid, filled with currentColor and sized in em by `kh-icon`, exactly as `Icon` renders it.
 * Client-safe (task 2.11): it imports only the viewBox, so a client island that draws `ICON_CARET_LEFT` ships that
 * one path, never the whole icon map (`test/guards/client-icons.test.ts`).
 */
export function Glyph({ d, label, className }: GlyphProps) {
  return (
    <svg
      className={clsx("kh-icon", className)}
      viewBox={ICON_VIEWBOX}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      <path d={d} />
    </svg>
  );
}
