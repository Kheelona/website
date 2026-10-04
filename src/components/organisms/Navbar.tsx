"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu } from "lucide-react";
import { NAV_LINKS, PREORDER_HREF, RESERVE_LABEL, RESERVE_SHORT_LABEL } from "@/config/site";
import { Button } from "@/components/atoms/Button";
import { Sheet } from "@/components/molecules/Sheet";
import { PRESS_TINT } from "@/lib/interactions";

/** A tab is current on its own page and on anything under it (a journal
 *  article keeps "Stories" marked). Home is never a tab, so "/" never matches. */
function isCurrent(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    // Opaque on purpose: at 95% + blur the compare table's saturated orange
    // column reads through the header when it scrolls underneath.
    <header className="sticky top-0 z-50 border-b border-line/40 bg-white">
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6"
      >
        <Link href="/" aria-label="Kheelona home" className="shrink-0">
          {/* The v3 wordmark (CS3, 2026-08-23): lowercase sticker lettering,
              served as the SVG copied verbatim from the design system. A
              local SVG through next/image ships unoptimized and static,
              which is exactly right for a 27KB vector. */}
          <Image
            src="/brand/kheelona-wordmark.svg"
            alt="Kheelona"
            width={152}
            height={50}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              {/* R11: py enlarges the hit area past the 24px target-size
                  floor (bar height is fixed by the h-[72px] flex, so the
                  padding is invisible); shared brand focus ring */}
              <Link
                href={l.href}
                aria-current={isCurrent(pathname, l.href) ? "page" : undefined}
                className="inline-block rounded py-2.5 text-[16px] font-medium text-ink transition-colors hover:text-orange aria-[current=page]:font-bold aria-[current=page]:text-ink-head focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          {/* display gate on a wrapper by convention (R4); cn() now merges
              conflicts (R6, clsx+twMerge), but wrappers keep display
              responsibility out of shared components */}
          <div className="hidden sm:block">
            {/* The short form: six tabs and the long label do not share a
                72px bar at lg (CMO merge, 2026-10-04). */}
            <Button href={PREORDER_HREF} track="navbar" className="px-5 py-3 text-[15px]">
              {RESERVE_SHORT_LABEL}
            </Button>
          </div>
          <div className="lg:hidden">
            <Sheet
              open={open}
              onOpenChange={setOpen}
              title="Menu"
              trigger={
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-head"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                </button>
              }
            >
              <ul className="flex flex-col gap-1 px-6 pb-8 pt-2">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={isCurrent(pathname, l.href) ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={`block rounded-xl px-3 py-3 text-[17px] font-medium text-ink hover:bg-cream ${PRESS_TINT}`}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
                <li className="px-3 pb-2 pt-3">
                  <Button href={PREORDER_HREF} track="navbar-mobile" className="w-full">
                    {RESERVE_LABEL}
                  </Button>
                </li>
              </ul>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
