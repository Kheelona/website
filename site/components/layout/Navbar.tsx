"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NAV_LINKS, PREORDER_HREF } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/40 bg-white/95 backdrop-blur-sm">
      <nav
        aria-label="Main"
        className="mx-auto flex h-[72px] w-full max-w-[1200px] items-center justify-between px-6"
      >
        <Link href="/" aria-label="Kheelona home" className="shrink-0">
          <Image
            src="/brand/logo-wordmark.png"
            alt="Kheelona"
            width={150}
            height={43}
            priority
            className="h-[34px] w-auto"
          />
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[16px] font-medium text-ink transition-colors hover:text-orange"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <Button href={PREORDER_HREF} className="hidden px-5 py-3 text-[15px] sm:inline-flex">
            Join the pre-order list
          </Button>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)}
            className="grid h-11 w-11 place-items-center rounded-full border border-line text-ink-head lg:hidden"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "border-t border-line-soft bg-white lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <ul className="flex flex-col gap-1 px-6 py-4">
          {NAV_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-3 py-3 text-[17px] font-medium text-ink hover:bg-cream"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li className="px-3 pb-2 pt-3 sm:hidden">
            <Button href={PREORDER_HREF} className="w-full">
              Join the pre-order list
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
