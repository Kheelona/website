import clsx from "clsx";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { Icon, type IconName } from "../Icon/Icon";

interface Common {
  icon: IconName;
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
 * gives one only to the drawer's close button. Server component; handlers work when a client component
 * renders it.
 */
export function IconButton(props: IconButtonProps) {
  const { icon, label, variant, size, title, className, ...rest } = props;
  const cls = clsx(
    "kh-iconbtn",
    variant && variant !== "ghost" && `kh-iconbtn--${variant}`,
    size && size !== "m" && `kh-iconbtn--${size}`,
    className,
  );
  const glyph = <Icon name={icon} />;
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
