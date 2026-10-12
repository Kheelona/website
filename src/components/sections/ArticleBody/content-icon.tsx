import { ICON_PATHS } from "@/assets/icons.generated";
import { Icon, type IconName } from "@/components/ui/Icon/Icon";
import type { IconRef } from "@/content/types";

/**
 * Content names its icons as strings (`IconRef`, src/content/types.ts); the DS `Icon` takes the generated `IconName`
 * union. The support sections (task 3.4: ArticleBody, ProductDetails, EmptyStateSection) narrow each content icon
 * here, so a name that is not one of the DS icons fails the render, and so the build, instead of drawing an empty
 * svg. Server only: it reaches the icon map through `Icon`.
 */
export function asIconName(name: IconRef): IconName {
  if (!Object.hasOwn(ICON_PATHS, name)) {
    throw new Error(
      `"${name}" is not one of the ${Object.keys(ICON_PATHS).length} design-system icons (src/assets/icons.generated.ts); anything else is a DS gap.`,
    );
  }
  return name as IconName;
}

export interface ContentIconProps {
  /** The icon as content names it. */
  name: IconRef;
  /** A composition hook after `kh-icon`. */
  className?: string;
}

/** A decorative DS icon named by content. */
export function ContentIcon({ name, className }: ContentIconProps) {
  return <Icon name={asIconName(name)} className={className} />;
}
