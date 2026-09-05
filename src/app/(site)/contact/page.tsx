import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { Reveal } from "@/components/molecules/Reveal";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, breadcrumbs, SITE_URL, pageMeta, jsonLd } from "@/lib/seo";
import {
  PREORDER_HREF,
  PREORDER_LABEL,
  CONTACT_EMAIL,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
  LEGAL_ENTITY,
  GSTIN,
  REGISTERED_ADDRESS_LINE,
  TOKEN_PRICE,
} from "@/config/site";

export const metadata = pageMeta({
  title: "Contact: how to reach the team behind Lumi",
  description:
    "How to reach Kheelona about a Lumi pre-order, a partnership, or a safety question. We are a small team in Bengaluru and we answer our own messages.",
  path: "/contact",
});

/* /contact (2026-07-28, founder-requested: the legacy site had this route and
   it must keep working).
 *
 * `CONTACT_EMAIL` is the founder-confirmed monitored inbox (2026-07-28). The
 * old Wix phone number beside it ("+91 98765 43210", the canonical fake Indian
 * number) was scaffold copy and is never published (see config/site).
 *
 * A contact page that routes a worried parent to a dead inbox is worse than one
 * that routes them somewhere a human actually is. So every route below is one
 * we can stand behind today. */

const ROUTES = [
  {
    title: "Pre-ordering Lumi",
    body: `A refundable ${TOKEN_PRICE} reserves one. We write to you on WhatsApp and by email about your own order, and nothing else.`,
    cta: { label: PREORDER_LABEL, href: PREORDER_HREF },
  },
  {
    title: "About an order you have placed",
    body: `Message us on WhatsApp at ${SUPPORT_WHATSAPP_DISPLAY}, or reply to your confirmation email. Change your address, ask where yours is, or cancel for a full refund before it ships.`,
    external: { label: "Message us on WhatsApp", href: SUPPORT_WHATSAPP_HREF },
  },
  {
    title: "Refunds and delivery",
    body: "Your money back at any time before dispatch, in plain words, plus where we deliver and what it costs. Which is nothing extra.",
    link: { label: "Read the refund terms", href: "/refund" },
  },
  {
    title: "A question about safety or privacy",
    body: "Most of it is already answered in plain words, including what the microphone does, where a child's voice goes, and what you can delete. If your question is not there, send it to us and we will answer it on that page.",
    link: { label: "Read the safety page", href: "/safety" },
  },
  {
    title: "Partners, retailers and investors",
    body: "Kheelona's platform story, the technology behind PlayOS, and partnership enquiries all live on our sister site.",
    external: { label: "kheelona.ai", href: "https://kheelona.ai" },
  },
] as const;

const CONTACT_JSON_LD = pageGraph(
  {
    "@type": "ContactPage",
    name: "Contact Kheelona",
    url: `${SITE_URL}/contact`,
    /* The Organization node carries the confirmed email and the WhatsApp
       number, so this page points at it rather than restating them. */
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  },
  breadcrumbs([{ name: "Contact", path: "/contact" }]),
);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(CONTACT_JSON_LD) }}
      />

      <PageHero guide="curious" say="Ask us anything. A person reads it.">
        <div className="max-w-[760px]">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Talk to us."
            titleClassName="mb-4"
            lede="We are a small team in Bengaluru, and we answer our own messages. Here is the quickest route for each kind of question."
            ledeClassName="max-w-[58ch]"
          />
        </div>
      </PageHero>

      <RoomsTrack>
        <Room fill="white">
          {/* An h2 belongs here: the cards are h3s, and without it the page
              jumped h1 to h3, which axe flags and screen-reader users feel. */}
          <Reveal>
            <SectionHeading
              title="Pick the route that fits."
              titleClassName="mb-10"
            />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {ROUTES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <Card
                  className="h-full border border-line bg-cream"
                  title={r.title}
                  titleClassName="mb-2 font-display text-[22px] font-extrabold text-ink-head"
                >
                  <p className="mb-4 text-[16px]">{r.body}</p>
                  {"cta" in r && r.cta ? (
                    <Button href={r.cta.href}>{r.cta.label}</Button>
                  ) : null}
                  {"link" in r && r.link ? (
                    <Link
                      href={r.link.href}
                      className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                    >
                      {r.link.label}
                    </Link>
                  ) : null}
                  {"external" in r && r.external ? (
                    <a
                      href={r.external.href}
                      className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                    >
                      {r.external.label}
                    </a>
                  ) : null}
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        <Room fill="cool" reveal="left">
          <Reveal>
            <SectionHeading
              level="minor"
              title="Where we are."
              titleClassName="mb-3"
              lede="The toy is designed and built here, by parents who use it at home. This is also the company you are buying from, in full."
              ledeClassName="max-w-[54ch]"
            />
            {/* The seller of record, published 2026-08-22 when the store began
                taking money (§8.25-d). Same details as /refund, /shipping and
                /terms, from the same constants, so the four can never drift. A
                parent about to pay ₹499 should be able to see exactly who is
                asking, without hunting for it. */}
            <address className="mt-6 max-w-[52ch] text-[17px] not-italic leading-[1.65]">
              <span className="font-semibold text-ink-head">{LEGAL_ENTITY}</span>
              <br />
              {REGISTERED_ADDRESS_LINE}
              <br />
              GSTIN {GSTIN}
            </address>
            <p className="mt-5 text-[17px]">
              <a
                href={SUPPORT_WHATSAPP_HREF}
                className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                WhatsApp {SUPPORT_WHATSAPP_DISPLAY}
              </a>{" "}
              takes messages, not calls, because messages are how we can answer
              you properly.
            </p>
            {CONTACT_EMAIL ? (
              <p className="mt-3 text-[17px]">
                Or write to us at{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
                >
                  {CONTACT_EMAIL}
                </a>
                .
              </p>
            ) : null}
          </Reveal>
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
          say="Save your spot. I'll mind Lumi till launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
