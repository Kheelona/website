"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "#contact" },
  { label: "About", href: "#about" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      {/* Skip link */}
      <Link
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
      >
        Skip to main content
      </Link>

      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-3 md:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="Kheelona Logo"
            width={150}
            height={50}
            priority
            className="h-auto w-auto max-h-[50px] object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-lg font-medium text-gray-600 transition hover:text-orange-500"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA + Mobile menu */}
        <div className="flex items-center gap-3">
          <Link
            href="/product"
            className="rounded-full bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 md:px-6 md:py-3 md:text-base"
          >
            Pre-Order now
          </Link>

          {/* Mobile menu */}
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className="flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              >
                <Menu size={24} />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed right-0 top-0 h-full w-[300px] bg-white shadow-xl">
                <div className="flex items-center justify-between border-b px-4 py-4">
                  <Dialog.Title className="text-lg font-bold text-orange-500">Menu</Dialog.Title>
                  <Dialog.Close asChild>
                    <button aria-label="Close menu" className="rounded-md p-2 hover:bg-gray-100">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-4 px-4 py-6">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="py-2 text-xl font-medium text-gray-600 transition hover:text-orange-500"
                    >
                      {link.label}
                    </Link>
                  ))}

                  <Link
                    href="/product"
                    onClick={() => setOpen(false)}
                    className="mt-4 rounded-full bg-orange-500 px-6 py-3 text-center font-semibold text-white transition hover:bg-orange-600"
                  >
                    Pre-Order now
                  </Link>
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
