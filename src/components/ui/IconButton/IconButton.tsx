import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import type { IconPath } from "@/assets/icons.generated";
import { Glyph } from "../Icon/Glyph";

interface Common {
  /** A named DS icon constant (`ICON_CARET_LEFT`, `ICON_X`) from `src/assets/icons.generated.ts`. */
  icon: IconPath;
  /** Required accessible name (DS rule); the icon itself is hidden. From content. */
  label: string;
  /** ghost (default), outline (the films controls), primary (the play button). */
  variant?: "ghost" | "outline" | "primary";
  /** s = 40 px with a 48 px tap area, m = 48 px (default), l = 56 px. */
  size?: "s" | "m" | "l";
  /** A native tooltip; the mockup gives one to the drawer's close button only. */
  title?: string;
  /** Composition hooks (`ks-film__play`, `ks-wa`), after the DS classes. */
  className?: string;
}

type Shared = keyof Common | "children" | "aria-label";
type AsButton = Common & Omit<ButtonHTMLAttributes<HTMLButtonElement>, Shared> & { href?: undefined };
type AsLink = Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, Shared> & { href: string };
export type IconButtonProps = AsButton | AsLink;

/**
 * DS IconButton (design-system/project/components/IconButton): a round, icon-only `kh-iconbtn` for actions
 * everyone knows from the icon (close, menu, play, previous, next). A `<button type="button">`, or an `<a>`
 * when it has an address. Unlike the DS helper it adds no `title` by itself, because the approved mockup
 * gives one only to the drawer's close button. Client-safe (task 2.11): it draws its icon with `Glyph` from the
 * one constant it is given and never imports the icon map, so a client island (the films controls, the drawer)
 * may render it with its handlers (`test/guards/client-icons.test.ts`). Rendered by a server component, it is
 * a server component.
 */
export function IconButton(props: IconButtonProps) {
  const { icon, label, variant, size, title, className, ...rest } = props;
  const cls = clsx(
    "kh-iconbtn",
    variant && variant !== "ghost" && `kh-iconbtn--${variant}`,
    size && size !== "m" && `kh-iconbtn--${size}`,
    className,
  );
  const glyph = <Glyph d={icon} />;
  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={cls} aria-label={label} title={title}>
        {glyph}
      </a>
    );
  }
  return (
    <button type="button" {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)} className={cls} aria-label={label} title={title}>
      {glyph}
    </button>
  );
}
