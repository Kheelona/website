import { ICON_PATHS, type IconName } from "@/assets/icons.generated";
import type { IconRef } from "@/content/types";

/**
 * A content icon (IconRef, a string until src/content/types.ts takes the generated union) as the DS icon the Icon
 * primitive draws. Anything else throws, so the build fails instead of drawing nothing: a missing icon is a DS gap
 * (G-12), never a new drawing. Server-only use: it reads the icon map, as Icon does.
 */
export function iconName(ref: IconRef): IconName {
  if (!Object.hasOwn(ICON_PATHS, ref)) throw new Error(`"${ref}" is not one of the DS icons (src/assets/icons.generated.ts; DS gap G-12)`);
  return ref as IconName;
}
