import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import { Glyph } from "./Glyph";

export type { IconName };

export interface IconProps {
  /** One of the 76 DS icons; anything else is a DS gap (G-12). */
  name: IconName;
  /** An accessible name: the icon becomes `role="img"`. Without it the icon is decorative and hidden. */
  label?: string;
  /** A composition hook such as `ks-btn__arrow` (D049 pick 6), after `kh-icon`. */
  className?: string;
}

/**
 * DS Icon (design-system/project/components/Icon) by name: a Phosphor Bold path on the shared 256 grid, filled
 * with currentColor and sized in em by `kh-icon`. Markup as mockup/build.mjs inlines `{{icon:…}}`, drawn by
 * `Glyph`. Server component: it reads the whole icon map (`ICON_PATHS`, about 30 KB), so a client island never
 * imports it; an island draws its own icons with `Glyph` or `IconButton` and the named `ICON_*` constants
 * (task 2.11, `test/guards/client-icons.test.ts`).
 */
export function Icon({ name, label, className }: IconProps) {
  return <Glyph d={ICON_PATHS[name]} label={label} className={className} />;
}
