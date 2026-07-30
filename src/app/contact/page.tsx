import type { Metadata } from "next";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { Reveal } from "@/components/molecules/Reveal";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { graph, breadcrumbs, SITE_URL } from "@/lib/seo";
import { PREORDER_HREF, RESERVE_LABEL, CONTACT_EMAIL } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Kheelona: how to reach the team behind Lumi",
  description:
    "How to reach Kheelona about a Lumi reservation, a partnership, or a question about safety and privacy. We are a small team in Bengaluru and we answer our own messages.",
  alternates: { canonical: "/contact" },
};

/* /contact (2026-07-28, founder-requested: the legacy site had this route and
   it must keep working).
 *
 * Written around a hard constraint: the ONLY contact email we have is the one
 * the old Wix site published, and it sat directly beside "+91 98765 43210" —
 * the canonical fake Indian phone number. That tells us the block was scaffold
 * copy, not verified detail, so neither the number nor the address is repeated
 * here on trust. `CONTACT_EMAIL` in config/site is null until the founder
 * confirms which inbox is actually monitored (gate claims-contact); the page is
 * built to light up the moment it is set, and reads correctly without it.
 *
 * A contact page that routes a worried parent to a dead inbox is worse than one
 * that routes them somewhere a human actually is. So every route below is one
 * we can stand behind today. */

const ROUTES = [
  {
    title: "Reserving Lumi",
    body: "Join the pre-order list. You pay nothing, and we write to you about your reservation by email, and on WhatsApp if you say yes to that.",
    cta: { label: RESERVE_LABEL, href: PREORDER_HREF },
  },
  {
    title: "Already on the list",
    body: "Reply to any message we have sent you. Ask us anything, change your details, or leave the list. Leaving takes one message and we delete your details on request.",
    link: { label: "What we hold and why", href: "/privacy" },
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

const CONTACT_JSON_LD = graph(
  {
    "@type": "ContactPage",
    name: "Contact Kheelona",
    url: `${SITE_URL}/contact`,
    /* No telephone and no email until the founder confirms a monitored one:
       schema must never promise a channel that does not answer. */
    mainEntity: { "@id": `${SITE_URL}/#organization` },
  },
  breadcrumbs([{ name: "Contact", path: "/contact" }]),
);

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_JSON_LD) }}
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
                  className="h-full border border-line-soft bg-cream"
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
              lede="Kheelona Robotics Pvt Ltd, Bengaluru, Karnataka, India. The toy is designed and built here, by parents who use it at home."
              ledeClassName="max-w-[54ch]"
            />
            {/* TODO(claims-contact): the founder confirms which inbox is
                monitored and this becomes a real mailto. Until then the page
                deliberately offers no email rather than a dead one. */}
            {CONTACT_EMAIL ? (
              <p className="mt-6 text-[17px]">
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
