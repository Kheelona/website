"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ICON_LIST } from "@/assets/icons.generated";
import { Glyph } from "@/components/ui/Icon/Glyph";
import { usePagePath } from "@/lib/page-path";

/* The NavBar's two client parts (task 3.1). The shell is a layout and cannot know its page, so the current link is
 * read from the path here (usePagePath: usePathname() with Vercel's "/index" for Home folded to "/", task 8c.7), and the
 * menu button opens the drawer dialog it names. Neither imports Icon or Button (test/guards/client-icons.test.ts): the
 * menu icon is the one named constant drawn by Glyph. */

export interface NavLinkItem {
  readonly label: string;
  /** A site path. */
  readonly href: string;
}

/** True on the link's own page and on the pages under it (an article is under Stories). */
export function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/** The four laptop links (`kh-nav__links`), the current page's marked `aria-current="page"` (mockup/build.mjs). */
export function NavBarLinks({ links }: { links: readonly NavLinkItem[] }) {
  const pathname = usePagePath();
  return (
    <div className="kh-nav__links">
      {links.map((link) => (
        <Link
          key={link.href}
          className="kh-nav__link"
          href={link.href}
          aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}

export interface NavMenuButtonProps {
  /** "Menu": the button's name. */
  label: string;
  /** The id of the drawer `<dialog>` it opens. */
  controls: string;
}

/**
 * The phone menu button (`kh-nav__menu`, hidden from 1024 px by bundle.css): opens the drawer as a modal dialog
 * (`showModal()`, so focus moves inside and the page behind goes inert) and reports `aria-expanded` until the dialog
 * closes, however it closes (Escape, the close button, the backdrop, a link).
 */
export function NavMenuButton({ label, controls }: NavMenuButtonProps) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const dialog = document.getElementById(controls);
    if (!(dialog instanceof HTMLDialogElement)) return;
    const collapse = () => setExpanded(false);
    dialog.addEventListener("close", collapse);
    return () => dialog.removeEventListener("close", collapse);
  }, [controls]);

  function open() {
    const dialog = document.getElementById(controls);
    if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
    dialog.showModal();
    setExpanded(true);
  }

  return (
    <button type="button" className="kh-nav__menu" aria-label={label} aria-expanded={expanded} aria-controls={controls} onClick={open}>
      <Glyph d={ICON_LIST} />
    </button>
  );
}
