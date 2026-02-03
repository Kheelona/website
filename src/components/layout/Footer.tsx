"use client";

import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { text: "FAQ", url: "/faq" },
  { text: "Blogs", url: "/blogs" },
  { text: "Our Story", url: "/our-story" },
  { text: "Contact Us", url: "/contact-us" },
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Terms & Conditions", url: "/terms-conditions" },
  // { text: "Accessibility Statement", url: "/accessibility" },
  // { text: "Shipping Policy", url: "/shipping-policy" },
  // { text: "Refund Policy", url: "/refund-policy" },
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
    <footer className="bg-tangerine text-white pt-12 md:pt-16 pb-6 mt-2 mb-70 md:mb-26">
      <div className="mx-auto max-w-350 px-4 md:px-8">
        <div className="flex justify-between flex-col md:flex-row gap-10 md:gap-0 mb-10">
          <div className="block md:hidden">
            <h3 className=" font-semibold text-white  text-[20px] mb-5">Socials</h3>
            <div className="flex gap-4">
              {socialLinks.map(({ name, url, bg, icon }) => (
                <Link
                  key={name}
                  href={url}
                  aria-label={name}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: bg }}
                  className={`flex h-10 w-10 items-center justify-center rounded-md overflow-hidden text-xl transition`}
                >
                  <Image src={icon} alt={name} width={20} height={20} className="h-10 w-10" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start gap-4">
            <h3 className=" font-semibold text-white  text-[20px] md:text-[30px]">
              Grown Ups Stuff
            </h3>
            <div className="flex flex-col gap-2">
              {footerLinks.map((link) => (
                <Link
                  key={link.text}
                  href={link.url}
                  className="text-sm text-white  text-[14px] md:text-[18px]"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Kheelona Logo"
                width={180}
                height={60}
                loading="lazy"
                className="h-15 object-contain drop-shadow-lg"
              />
              <Image
                src="/images/hero-girl.webp"
                alt="Kheelona Logo"
                width={250}
                height={100}
                loading="lazy"
                className="absolute -bottom-86 left-14 md:-bottom-42 md:left-0 h-100 md:h-75  object-cover object-top drop-shadow-lg"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center">
            <div className="">
              <h3 className="font-semibold text-white  text-[30px] mb-5">Socials</h3>
              <div className="flex gap-4">
                {socialLinks.map(({ name, url, bg, icon }) => (
                  <Link
                    key={name}
                    href={url}
                    aria-label={name}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: bg }}
                    className={`flex h-10 w-10 items-center justify-center rounded-md overflow-hidden text-xl transition`}
                  >
                    <Image src={icon} alt={name} width={20} height={20} className="h-10 w-10" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">© 2026 by Kheelona. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ in India</p>
          </div>
        </div> */}
      </div>
    </footer>
  );
}
