"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { text: "Shop", url: "/shop" },
  { text: "Blog", url: "/blog" },
  { text: "About Us", url: "/about" },
  { text: "Contact", url: "/contact" },
  { text: "Privacy Policy", url: "/privacy" },
  { text: "Terms & Conditions", url: "/terms" },
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
      className="bg-tangerine text-white pt-12 md:pt-16 pb-6 mt-2 mb-70 md:mb-26"
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
            <h3 className="font-semibold text-white text-[20px] md:text-[30px]">Quick Links</h3>
            <ul className="flex flex-col gap-2 list-none p-0 m-0">
              {footerLinks.map((link) => (
                <li key={link.text}>
                  <Link
                    href={link.url}
                    className="text-sm text-white text-[14px] md:text-[18px] hover:underline focus:underline"
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
                className="h-15 object-contain drop-shadow-lg"
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
              <h3 className="font-semibold text-white text-[30px] mb-5">Socials</h3>
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

        {/* Copyright Section */}
        <div className="border-t border-white/20 pt-6 mt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-white/80">
              © {new Date().getFullYear()} Kheelona Robotics. All rights reserved.
            </p>
            <p className="text-sm text-white/80">Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
