import type { Metadata } from "next";
import Image from "next/image";
import {
  LEGAL_ENTITY,
  GSTIN,
  REGISTERED_ADDRESS_LINE,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
  CONTACT_EMAIL,
} from "@/config/site";

/** The store's own chrome (§8.25-v).
 *
 *  Deliberately not the marketing navbar. A parent on this page has already
 *  decided; five nav tabs are five ways to leave, and a checkout that offers
 *  distractions converts worse. What replaces them is the only thing a person
 *  actually needs mid-payment: proof of who they are paying, and a way to reach
 *  a human.
 *
 *  NOINDEX, and not by accident. The store is a transactional endpoint, and
 *  letting it into the index would put a thin checkout page into competition
 *  with /products/lumi, which is the page a year of SEO went into. The policy
 *  links below point at the marketing site for the same reason: one canonical
 *  copy of each policy, on the domain that ranks.
 *
 *  This route group sits under the root layout, so the fonts, the tokens and all
 *  three analytics tools are already in place. Nothing is duplicated here. */
export const metadata: Metadata = {
  title: "Pre-order Lumi",
  robots: { index: false, follow: false },
};

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-line/40 bg-white">
        <div className="mx-auto flex h-[72px] w-full max-w-[1100px] items-center justify-between px-6">
          <a href="https://kheelona.com" aria-label="Kheelona home" className="shrink-0">
            <Image
              src="/brand/kheelona-wordmark.svg"
              alt="Kheelona"
              width={152}
              height={50}
              priority
              className="h-[32px] w-auto"
            />
          </a>
          <a
            href={SUPPORT_WHATSAPP_HREF}
            className="rounded text-[14px] font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Need help? WhatsApp us
          </a>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-line/40 bg-white">
        <div className="mx-auto w-full max-w-[1100px] px-6 py-10">
          <nav aria-label="Policies" className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              ["Pre-order terms", "/terms"],
              ["Refunds and cancellation", "/refund"],
              ["Shipping and delivery", "/shipping"],
              ["Privacy", "/privacy"],
              ["Contact", "/contact"],
            ].map(([label, path]) => (
              <a
                key={path}
                href={`https://kheelona.com${path}`}
                className="rounded text-[15px] font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* The seller of record, on the page where money changes hands. Same
              constants as the four policy pages, so the five can never drift. */}
          <address className="mt-6 text-[14px] not-italic leading-[1.6] text-ink-muted">
            <span className="font-semibold text-ink-head">{LEGAL_ENTITY}</span>
            <br />
            {REGISTERED_ADDRESS_LINE}
            <br />
            GSTIN {GSTIN}
            <br />
            WhatsApp {SUPPORT_WHATSAPP_DISPLAY}, which takes messages and not
            calls, or {CONTACT_EMAIL}
          </address>
        </div>
      </footer>
    </div>
  );
}
