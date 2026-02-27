"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { text: "FAQ", url: "/faq" },
  { text: "Blogs", url: "/blog" },
  { text: "Our Story", url: "/about" },
  { text: "Contact", url: "/contact" },
  { text: "Privacy Policy", url: "/privacy" },
  { text: "Terms of Service", url: "/terms" },
];

const socialLinks = [
  {
    name: "Linkedin",
    url: "https://www.linkedin.com/company/kheelona/",
    icon: "/images/social/in.png",
    bg: "#ffffff",
  },
  {
    name: "Instagram",
    url: "https://instagram.com/kheelona",
    icon: "/images/social/ig.png",
    bg: "#ffffff",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/kheelona",
    icon: "/images/social/fb.png",
    bg: "#3974BC,",
  },
];

export function Footer() {
  return (
    <footer
      className="relative bg-tangerine text-white pt-12 md:pt-16 pb-6 mt-2 mb-70 md:mb-26"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div className="mx-auto max-w-350 px-4 md:px-8">
        <div className="flex justify-between flex-col md:flex-row gap-10 md:gap-0 mb-10">
          {/* Mobile Social Links */}
          <div className="block md:hidden">
            <h3 className="font-semibold text-white text-[20px] mb-5">Socials</h3>
            <nav aria-label="Social media links">
              <ul className="flex gap-4 list-none p-0 m-0">
                {socialLinks.map(({ name, url, bg, icon }) => (
                  <li key={name}>
                    <Link
                      href={url}
                      aria-label={`Follow us on ${name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ backgroundColor: bg }}
                      className="flex h-10 w-10 items-center justify-center rounded-md overflow-hidden text-xl transition hover:opacity-80"
                    >
                      <Image
                        src={icon}
                        alt=""
                        width={20}
                        height={20}
                        className="h-10 w-10"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Footer Navigation */}
          <nav className="flex flex-col items-start gap-4" aria-label="Footer navigation">
            <p className="font-medium text-white text-[20px] md:text-[24px]">Grown Ups Stuff</p>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {footerLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="text-sm text-white text-[14px] md:text-[16px] hover:underline focus:underline"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Logo Section */}
          <div className="relative flex items-center justify-center">
            <Link href="/" className="inline-block" aria-label="Go to homepage">
              <Image
                src="/images/logo.png"
                alt="Kheelona - Smartest Playmates for Brightest Minds"
                width={180}
                height={60}
                loading="lazy"
                className="h-15 object-contain drop-shadow-xl"
                // style={{ filter: "drop-shadow(0px 4px 2px #00000055)" }}
              />
              <Image
                src="/images/hero-girl.webp"
                alt=""
                width={250}
                height={100}
                loading="lazy"
                className="absolute -bottom-86 left-14 md:-bottom-42 md:left-0 h-100 md:h-75 object-cover object-top drop-shadow-lg"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Desktop Social Links */}
          <div className="hidden md:flex items-center">
            <div>
              <p className="font-medium text-white text-[24px] mb-5">Socials</p>
              <nav aria-label="Social media links">
                <ul className="flex gap-4 list-none p-0 m-0">
                  {socialLinks.map(({ name, url, bg, icon }) => (
                    <li key={name}>
                      <Link
                        href={url}
                        aria-label={`Follow us on ${name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ backgroundColor: bg }}
                        className="flex h-10 w-10 items-center justify-center rounded-md overflow-hidden text-xl transition hover:opacity-80"
                      >
                        <Image
                          src={icon}
                          alt=""
                          width={20}
                          height={20}
                          className="h-10 w-10"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-70 md:-bottom-26 -left-1 w-full text-end text-[12px]">
          <p className="text-black">© {new Date().getFullYear()} by Kheelona</p>
        </div>

        {/* Copyright Section */}
      </div>
    </footer>
  );
}
