import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { FOUNDERS, BELIEFS } from "@/lib/team";
import {
  CONTACT_EMAIL,
  LEGAL_ENTITY,
  REGISTERED_ADDRESS_LINE,
  GSTIN,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

export const metadata = pageMeta({
  /* Moved from /team in the 2026-10 redesign, which also folded /contact in
     (both 308 here). The two SEO keywords stay in the metadata, where the
     2026-08-12 round put them, not in the manifesto copy. */
  title: "Our story: parents building smart toys for toddlers",
  description:
    "Why we built Kheelu, the AI educational toy, and who we are: a CTO with 14 patents, an Intel hardware chief, a marketing head, and a CEO who owns trust.",
  path: "/story",
});

/* The founders are already entities in the Organization node (lib/seo), with
   opaque `/team#…` @ids that stay put; this page declares itself the about
   page for them. */
const JSON_LD = pageGraph(
  { "@type": "AboutPage", name: "The people who build Kheelona", url: "https://kheelona.com/story" },
  breadcrumbs([{ name: "Our story", path: "/story" }]),
);

/* The mockup's three promises, minus the automatic late refund, which is not
   a published policy (/refund). Each line below is. */
const PROMISES = [
  "You can read every conversation your child has with Kheelu.",
  "We never sell your child's data.",
  "Your token comes back in full, any time before we ship.",
] as const;

export default function StoryPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />

      {/* The mockup leaves a founder-story scaffold here. Until a founder has
          written that paragraph, the published "why" from the old team page
          stands in, verbatim. */}
      <section className="kh-page-hero">
        <div className="kh-wrap">
          <div className="kh-stack max-w-[820px]">
          <span className="kh-kicker">Our story</span>
          <h1 className="kh-h1">Why we built Kheelu.</h1>
          <p className="kh-lead">
            The plush, the crib, the night-light. Within a few years each one will listen, answer,
            and remember the child who loves it. Someone has to build the mind that wakes them, and
            build it safely. That is the whole reason Kheelona exists.
          </p>
          </div>
        </div>
      </section>

      <section id="team" className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">The team</h2>
            <p className="kh-lead">You are trusting us near your child. You should know who we are.</p>
          </div>
          <div className="kh-grid2">
            {FOUNDERS.map((f) => (
              <article key={f.id} id={f.id} className="kh-card scroll-mt-24">
                <Image
                  src={f.photo}
                  alt={f.name}
                  width={600}
                  height={600}
                  sizes="(max-width: 700px) 90vw, 520px"
                  className="h-[200px] w-full rounded-[22px] bg-soft object-cover min-[900px]:h-[260px]"
                />
                <h3 className="kh-h3">
                  {f.name}, {f.role}
                </h3>
                <p className="kh-body">{f.bio}</p>
                <blockquote className="m-0 border-l-2 border-accent pl-4 font-display text-[18px] leading-[1.45] text-ink-head">
                  &ldquo;{f.quote}&rdquo;
                </blockquote>
                <a
                  href={f.linkedin}
                  rel="noopener noreferrer"
                  className="kh-textlink self-start"
                >
                  {f.name.split(" ")[0]} on LinkedIn
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-two kh-top">
          <h2 className="kh-h2">What we believe</h2>
          <div>
            {BELIEFS.map((b) => (
              <p key={b} className="kh-promise-card">
                {b}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-two kh-top">
          <h2 className="kh-h2">Three promises</h2>
          <div>
            {PROMISES.map((p) => (
              <p key={p} className="kh-promise-card">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section id="talk" className="kh-sec scroll-mt-20">
        <div className="kh-wrap kh-two kh-top">
          <div className="kh-stack">
            <h2 className="kh-h2">Talk to us</h2>
            <p className="kh-lead">
              We are a small team in Bengaluru, and a real person answers.
            </p>
            <div>
              <Button href={SUPPORT_WHATSAPP_HREF} variant="green">
                <MessageCircle className="h-5 w-5" aria-hidden="true" />
                Message us on WhatsApp
              </Button>
            </div>
          </div>
          <div className="kh-stack">
            <dl className="kh-ptable">
              <div className="kh-prow">
                <dt>WhatsApp</dt>
                <dd>
                  <a href={SUPPORT_WHATSAPP_HREF} className="underline underline-offset-4">
                    {SUPPORT_WHATSAPP_DISPLAY}
                  </a>{" "}
                  <span className="font-normal text-ink-muted">(messages only)</span>
                </dd>
              </div>
              {CONTACT_EMAIL ? (
                <div className="kh-prow">
                  <dt>Email</dt>
                  <dd>
                    <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                      {CONTACT_EMAIL}
                    </a>
                  </dd>
                </div>
              ) : null}
              <div className="kh-prow max-[600px]:flex-col max-[600px]:gap-1">
                <dt>Company</dt>
                <dd className="max-w-[40ch] min-[601px]:text-right">
                  {LEGAL_ENTITY}, {REGISTERED_ADDRESS_LINE}. GSTIN {GSTIN}
                </dd>
              </div>
            </dl>
            <p className="text-[14px] leading-[1.6] text-ink-muted">
              Supported by NVIDIA Inception, nasscom, Karnataka Elevate and Founders Inc. Partners
              and investors:{" "}
              <a href="https://kheelona.ai" className="underline underline-offset-4">
                kheelona.ai
              </a>
            </p>
          </div>
        </div>
      </section>

      <FinaleCTA />
    </>
  );
}
