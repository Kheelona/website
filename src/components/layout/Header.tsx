"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import CartUI from "../ui/Cart";

const navLinks = [
  { label: "Community", href: "/community" },
  { label: "Blog", href: "/blog" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY <= 10) {
        setIsVisible(true);
        lastScrollY = currentScrollY;
        return;
      }

      if (currentScrollY > lastScrollY + 5) {
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY - 5) {
        setIsVisible(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full px-3 py-4 transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <div className="relative mx-auto flex max-w-350 items-center justify-start md:justify-center rounded-2xl bg-muted-orange h-16.75 md:h-17 px-5">
        {/* Mobile: Hamburger */}
        <div className="flex md:hidden">
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                aria-label="Open menu"
                className="flex items-center justify-center rounded-md p-2 text-white"
              >
                <Menu size={24} />
              </button>
            </Dialog.Trigger>

            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40" />
              <Dialog.Content className="fixed left-0 top-0 z-50 h-full w-70 bg-white p-6 shadow-xl">
                <Dialog.Title className="sr-only">Menu</Dialog.Title>
                <div className="mb-6 flex items-center justify-between">
                  <span className="text-lg font-semibold text-tangerine-500">Menu</span>
                  <Dialog.Close asChild>
                    <button aria-label="Close menu" className="rounded-md p-2 hover:bg-gray-100">
                      <X size={20} />
                    </button>
                  </Dialog.Close>
                </div>

                <nav className="flex flex-col gap-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="text-lg font-medium text-gray-700 transition-all duration-300 hover:text-tangerine hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center justify-center ">
          <Image
            src="/images/logo.png"
            alt="Kheelona"
            width={500}
            height={100}
            priority
            sizes="(max-width: 768px) 116px, 164px"
            className="absolute left-1/2 -translate-x-1/2 md:left-20 md:translate-x-0  w-35 md:h-10 object-cover md:w-35"
            // style={{ filter: "drop-shadow(0px 2.15px 1px #00000040)" }}
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex navbar">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-[20px] text-white transition-all duration-300 hover:opacity-75 hover:scale-105"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Auth + Cart */}
        <div className="absolute right-3 md:right-12 flex items-center gap-3">
          {/* <WixAuthButton /> */}
          <CartUI />
        </div>
      </div>
    </header>
  );
}
