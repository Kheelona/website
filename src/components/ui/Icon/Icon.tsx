import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { IconRef } from "@/content/types";
import { Glyph } from "./Glyph";
import { SITE_DRAWINGS } from "./site-drawings";

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
 * `Glyph`; `whatsapp-logo` draws the site's WhatsApp logo instead (`SITE_DRAWINGS`, D064 item 3). Server component: it reads the
 * whole icon map (`ICON_PATHS`, about 30 KB), so a client island never imports it; an island draws its own icons with
 * `Glyph` or `IconButton` and the named `ICON_*` constants (task 2.11, `test/guards/client-icons.test.ts`).
 */
export function Icon({ name, label, className }: IconProps) {
  return <Glyph d={SITE_DRAWINGS[name] ?? ICON_PATHS[name]} label={label} className={className} />;
}

/**
 * A content icon (`IconRef`, a string in src/content/types.ts) as the DS `IconName` this file draws. Anything else
 * throws, so the render, and so the build, fails instead of drawing an empty svg: a missing icon is a DS gap (G-12),
 * never a new drawing. The one narrowing every section uses (wave-3 close, "One of each helper"). Server only, like
 * `Icon`: it reads the icon map.
 */
export function asIconName(ref: IconRef): IconName {
  if (!Object.hasOwn(ICON_PATHS, ref)) {
    throw new Error(
      `"${ref}" is not one of the ${Object.keys(ICON_PATHS).length} design-system icons (src/assets/icons.generated.ts); anything else is a DS gap (G-12).`,
    );
  }
  return ref as IconName;
}

export interface ContentIconProps {
  /** The icon as content names it. */
  name: IconRef;
  /** A composition hook after `kh-icon`. */
  className?: string;
}

/** A decorative DS icon named by content: `Icon` after `asIconName`. */
export function ContentIcon({ name, className }: ContentIconProps) {
  return <Icon name={asIconName(name)} className={className} />;
}
