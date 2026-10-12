import clsx from "clsx";
import { ICON_PATHS, ICON_VIEWBOX, type IconName } from "@/assets/icons.generated";

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
 * DS Icon (design-system/project/components/Icon): a Phosphor Bold path on the shared 256 grid, filled
 * with currentColor and sized in em by `kh-icon`. Markup as mockup/build.mjs inlines `{{icon:…}}`.
 * Server component: the path map is about 30 KB, so a client island should take icons as children
 * rendered on the server rather than import this (assets catalogue, Icons row).
 */
export function Icon({ name, label, className }: IconProps) {
  return (
    <svg
      className={clsx("kh-icon", className)}
      viewBox={ICON_VIEWBOX}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : "true"}
      focusable="false"
    >
      <path d={ICON_PATHS[name]} />
    </svg>
  );
}
