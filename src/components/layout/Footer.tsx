"use client";

import Link from "next/link";
import Image from "next/image";

const footerLinks = [
  { text: "Privacy Policy", url: "/privacy-policy" },
  { text: "Accessibility Statement", url: "/accessibility" },
  { text: "Shipping Policy", url: "/shipping-policy" },
  { text: "Terms & Conditions", url: "/terms-conditions" },
  { text: "Refund Policy", url: "/refund-policy" },
];

const socialLinks = [
  { name: "Instagram", url: "https://instagram.com/kheelona", icon: "📸" },
  { name: "Facebook", url: "https://facebook.com/kheelona", icon: "📘" },
  { name: "Twitter", url: "https://twitter.com/kheelona", icon: "🐦" },
];

export function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-white pt-12 md:pt-16 pb-6">
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr] mb-12">
          {/* Logo + description */}
          <div className="flex flex-col items-start gap-6">
            <Link href="/" className="inline-block">
              <Image
                src="/images/logo.png"
                alt="Kheelona Logo"
                width={180}
                height={60}
                loading="lazy"
                className="h-[60px] w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="max-w-[300px] text-sm text-gray-400">
              Kheelona creates AI-powered educational toys that help children learn, grow, and
              develop essential skills through play.
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xl transition hover:bg-white/20"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xl font-semibold text-orange-500">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {footerLinks.slice(0, 3).map((link) => (
                <Link
                  key={link.text}
                  href={link.url}
                  className="text-sm text-gray-400 transition hover:text-sky-400"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xl font-semibold text-orange-500">Legal</h3>
            <div className="flex flex-col gap-2">
              {footerLinks.slice(3).map((link) => (
                <Link
                  key={link.text}
                  href={link.url}
                  className="text-sm text-gray-400 transition hover:text-sky-400"
                >
                  {link.text}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col items-start gap-4">
            <h3 className="text-xl font-semibold text-orange-500">Subscribe to Our Newsletter</h3>

            <div className="flex w-full flex-col gap-3">
              <input
                type="email"
                placeholder="Enter Your Email"
                className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:bg-white/20 focus:ring-1 focus:ring-sky-400"
              />
              <button className="w-full rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600">
                Subscribe
              </button>
            </div>

            <div className="mt-4 flex flex-col gap-2 text-sm text-gray-400">
              <p>Contact Us: +91 9896597969</p>
              <p>
                Mail ID:{" "}
                <Link href="mailto:connect@kheelona.com" className="text-sky-400 hover:underline">
                  connect@kheelona.com
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-sm text-gray-500">© 2026 by Kheelona. All rights reserved.</p>
            <p className="text-sm text-gray-500">Made with ❤️ in India</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
