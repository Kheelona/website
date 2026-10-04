import Image from "next/image";
import { TextLink } from "@/components/molecules/TextLink";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { TiltCard } from "@/components/molecules/TiltCard";
import { Card } from "@/components/molecules/Card";
import { PromiseMark } from "@/components/molecules/PromiseMark";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { FOUNDERS, BELIEFS } from "@/lib/team";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

export const metadata = pageMeta({
  /* CMO merge (2026-10-04): the mockup's "Our story" label, which is now
     the nav tab, on the URL that stays /team. The SEO round's keyword
     placement survives: "smart toys for toddlers" in the title (62 with the
     suffix, under the 65 guard), "AI educational toy" in the description. */
  title: "Our story: parents building smart toys for toddlers",
  description:
    "Why we built Kheelu, the AI educational toy, and who we are: a CTO with 14 patents, an Intel hardware chief, a marketing head, and a CEO who owns trust.",
  path: "/team",
});

/* Card colours per person, by id, exactly as the old /team page had them.
   Design lives here, beside the layout; the facts live in lib/team.ts, shared
   with Home's team strip. */
const CARD_TINT: Record<string, { tint: string; border: string; quoteBorder: string }> = {
  aman: { tint: "bg-orange/15", border: "border-t-orange", quoteBorder: "border-l-orange" },
  kashyap: { tint: "bg-blue/15", border: "border-t-blue", quoteBorder: "border-l-blue" },
  ria: { tint: "bg-blue/15", border: "border-t-blue", quoteBorder: "border-l-blue" },
  apoorva: { tint: "bg-yellow/15", border: "border-t-yellow", quoteBorder: "border-l-yellow" },
};

/* The mockup's three promises, minus its automatic late refund, which is not
   a published policy (/refund). Each line below is already published. They
   are promises, so they carry the promise marks (§8.23-3). */
const PROMISES = [
  "You can read every conversation your child has with Kheelu.",
  "We never sell your child's data.",
  "Your token comes back in full, any time before we ship.",
] as const;

/* LinkedIn glyph from the kheelona.ai team page (lucide dropped brand
   icons); rendered at 16px inside the bordered chip. */
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="currentColor" aria-hidden="true">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/* THE CMO MERGE (2026-10-04): the mockup's "Our story" page, built on the URL
   Google already has (/team; the founders' schema @ids live here too). The
   mockup's headline leads and main's manifesto line opens the lede, so the
   page keeps its strongest sentence. Every card carries the element id its
   Person @id points at, so `/team#apoorva-sahu` finally lands on the person. */
export default function TeamPage() {
  return (
    <>
      {/* The founders are already entities in the Organization node (lib/seo),
          so this page just declares itself as the about page for them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd(
            pageGraph(
              { "@type": "AboutPage", name: "The people who build Kheelona", url: "https://kheelona.com/team" },
              breadcrumbs([{ name: "Our story", path: "/team" }]),
            ),
          ),
        }}
      />

      {/* Copy-only hero: the four founder photos below are this page's picture. */}
      <PageHero>
        <SectionHeading
          as="h1"
          eyebrow="Our story"
          title="Why we built Kheelu."
          titleClassName="mb-5 max-w-[18ch]"
          lede="Every object a child holds is about to wake up. The plush, the crib, the night-light: within a few years each one will listen, answer, and remember the child who loves it. Someone has to build the mind that wakes them, and build it safely. That is the whole reason Kheelona exists."
          ledeClassName="mb-4 max-w-[60ch]"
        />
        <p className="max-w-[58ch] text-[17px] text-ink-muted">
          We are parents who build. We watched our own children reach for
          screens and felt the same knot you feel. Between the four of us we
          cover the four things a safe talking toy actually needs: a brain, a
          body, a business, and a voice. And education runs in the family: the
          first school Apoorva attended was the one his family runs, and he has
          been enrolling friends into classrooms since he was a teenager.
        </p>
      </PageHero>

      <RoomsTrack>
        {/* Founder cards (full parity: photo, tag, bio, pull-quote, LinkedIn) */}
        <Room fill="white" id="the-team" reveal="left">
          <Reveal>
            <SectionHeading
              title="A brain, a body, a business, and a voice."
              titleClassName="mb-3"
              lede="You are trusting us near your child. You should know who we are."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="flex flex-col gap-6">
            {FOUNDERS.map((f, i) => {
              const look = CARD_TINT[f.id]!;
              return (
                <Reveal key={f.id} delay={i * 0.06}>
                  <div id={f.anchor} className="scroll-mt-24">
                    <TiltCard
                      maxTilt={2}
                      className={`rounded-(--radius-card) border border-line border-t-4 bg-cream p-7 ${look.border}`}
                    >
                      <div className="flex flex-wrap items-start gap-7">
                        <div className={`shrink-0 rounded-2xl p-2 ${look.tint}`}>
                          <Image
                            src={f.photo}
                            alt={`${f.name}, ${f.role} at Kheelona`}
                            width={480}
                            height={480}
                            sizes="160px"
                            className="block h-[150px] w-[150px] rounded-xl object-cover"
                          />
                        </div>
                        {/* the min-width keeps the bio beside the photo on real
                            screens, but below sm it must yield (M4 mobile pass) */}
                        <div className="flex-1 sm:min-w-[280px]">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="font-display text-[26px] font-extrabold text-ink-head">
                              {f.name}
                            </h3>
                            <a
                              href={f.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`${f.name} on LinkedIn`}
                              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-head transition-colors hover:bg-white"
                            >
                              <LinkedInIcon />
                            </a>
                          </div>
                          <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.05em] text-ink-head">
                            {f.role} <span className="font-semibold">· {f.tag}</span>
                          </p>
                          <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed">{f.bio}</p>
                          <p
                            className={`mt-4 max-w-[62ch] border-l-[3px] pl-4 font-editorial text-[20px] italic leading-[1.45] text-ink-head ${look.quoteBorder}`}
                          >
                            {f.quote}
                          </p>
                        </div>
                      </div>
                    </TiltCard>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </Room>

        <Room fill="cool" reveal="right">
          <Reveal>
            <SectionHeading title="What we believe." titleClassName="mb-11" />
          </Reveal>
          <StepList
            items={BELIEFS.map((b) => ({ title: b }))}
            columns="md:grid-cols-[80px_1fr]"
            rowClassName="items-center gap-4 py-7"
            titleClassName="font-display text-[clamp(20px,2.2vw,26px)] font-extrabold text-ink-head"
          />
        </Room>

        <Room fill="cream" id="promises" reveal="left">
          <Reveal>
            <SectionHeading title="Three promises." titleClassName="mb-10" />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {PROMISES.map((p, i) => (
              <Reveal key={p} delay={i * 0.05}>
                <Card className="h-full border border-line bg-white p-7" tilt={false}>
                  <PromiseMark index={i} className="mb-3" />
                  <p className="font-display text-[20px] font-extrabold leading-snug text-ink-head">
                    {p}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* Recognition (founder-published programs). "Recognised by", never
            "Backed by" or "Supported by": those read as investment claims. */}
        <Room fill="white" reveal="right">
          <RecognitionStrip bare />
        </Room>

        {/* The mockup's "Talk to us", kept short: the full routes, the address
            and the seller of record live on /contact, which stays a page. */}
        <Room fill="cream" id="talk" reveal="left">
          <Reveal>
            <SectionHeading
              level="minor"
              title="Talk to us."
              titleClassName="mb-3"
              lede="We are a small team in Bengaluru, and a real person answers."
              ledeClassName="mb-6 max-w-[52ch]"
            />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Button href={SUPPORT_WHATSAPP_HREF} variant="ghost">
                Message us on WhatsApp
              </Button>
              <TextLink href="/contact">Every way to reach us</TextLink>
            </div>
            <p className="mt-8 max-w-[52ch] text-[clamp(19px,1.8vw,23px)]">
              If you have read this far, you care the way we care. Save your
              place in line, and grow with us.
            </p>
          </Reveal>
        </Room>

        <Room fill="white" id="reserve" reveal="pop" className="overflow-x-clip">
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
