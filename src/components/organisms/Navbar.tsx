"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import {
  NAV_LINKS,
  PREORDER_HREF,
  RESERVE_LABEL,
  RESERVE_SHORT_LABEL,
} from "@/config/site";
import { Button } from "@/components/atoms/Button";

/** The mockup's header (redesign 2026-10): serif wordmark, five tabs, one
 *  Reserve CTA. Below 900px the tabs fold into a drop-down panel under the
 *  bar, which closes on navigation and on Escape.
 *
 *  The mockup's Hindi button is deliberately absent: there is no Hindi site,
 *  and a control that only says "coming soon" is a dead end on a phone. */
export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // The panel must not survive into the next page (a back/forward navigation
  // never taps a link). Adjusting state during render on a changed input is
  // React's sanctioned alternative to an effect for exactly this.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isCurrent = (href: string) =>
    pathname === href || (pathname?.startsWith(`${href}/`) ?? false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-bg">
      <div className="kh-wrap flex h-16 items-center justify-between gap-3 min-[900px]:h-[76px]">
        <Link
          href="/"
          className="rounded font-display text-[25px] font-semibold tracking-[-0.2px] text-ink-head no-underline focus-visible:outline-3 focus-visible:outline-accent"
        >
          Kheelona
        </Link>

        <nav aria-label="Main" className="hidden min-[900px]:block">
          <ul className="flex gap-7 text-[16px] font-medium">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isCurrent(l.href) ? "page" : undefined}
                  className="inline-block border-b-2 border-transparent py-2.5 text-ink-head no-underline aria-[current=page]:border-accent hover:border-line"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <Button href={PREORDER_HREF} size="sm" track="navbar">
            {RESERVE_SHORT_LABEL}
          </Button>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-ink-head min-[900px]:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="border-t border-line bg-bg px-5 pb-5 pt-2 min-[900px]:hidden"
      >
        <ul>
          {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={pathname === l.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center border-b border-line text-[19px] font-semibold text-ink-head no-underline"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Button href={PREORDER_HREF} track="navbar-mobile" className="mt-4 w-full">
          {RESERVE_LABEL}
        </Button>
      </nav>
    </header>
  );
}
