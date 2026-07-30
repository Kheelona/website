import type { Metadata } from "next";
import Image from "next/image";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { TiltCard } from "@/components/molecules/TiltCard";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { graph, breadcrumbs } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Team: the parents who build",
  description:
    "Meet the people behind Kheelona and Lumi, the screen-free talking AI toy: a CTO with 14 patents filed, a hardware chief who built at Intel, a marketing head who keeps the story honest, and a CEO who owns the trust.",
  alternates: { canonical: "/team" },
};

/* R7 full-parity rebuild from kheelona.ai/team (founder-published source:
   its content/site.ts TEAM object). Bios adapted to parent voice; facts
   verbatim (14 patents, Intel + Thunderbolt 4/5 compliance, CA + 15 years
   scaling). Pull-quotes verbatim. Colored text stays decorative-only:
   names/titles are ink (contrast).
   Revamp M4 (theme B): hero on the backdrop + rooms; the quotes moved from
   Instrument Serif to the display face (two-font law, P2). */

const FOUNDERS = [
  {
    id: "aman",
    name: "Aman Soni",
    role: "Co-founder and CTO",
    tag: "The brain",
    photo: "/team/aman.jpg",
    tint: "bg-orange/15",
    border: "border-t-orange",
    quoteBorder: "border-l-orange",
    linkedin: "https://www.linkedin.com/in/aman-soni-6b17b6223/",
    bio: "Aman builds the part that thinks. He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name. He owns the backend and the brain: the voice loop your child talks to, the safety filters, and the small language model we train ourselves.",
    quote:
      "A toy that listens has to think on the device, in real time, and never say the wrong thing. That is the hard problem. It is the only one I want to work on.",
  },
  {
    id: "kashyap",
    name: "Kashyap C.R",
    role: "Co-founder and Chief Hardware Officer",
    tag: "The body",
    photo: "/team/kashyap.jpg",
    tint: "bg-blue/15",
    border: "border-t-blue",
    quoteBorder: "border-l-blue",
    linkedin: "https://www.linkedin.com/in/kashyap-c-r-7ba18177/",
    bio: "Kashyap makes Lumi something small hands reach for. Over a decade, including years at Intel leading Thunderbolt 4 and 5 compliance, he took hardware from a blank page to certified products on real shelves. He owns the hardware and the power: the Kheelona Magic Box, the battery that lasts, and the unglamorous work of making it safe to hug.",
    quote:
      "Anyone can build a demo. Shipping a safe, certified toy by the thousand is a different sport. I have played it for ten years.",
  },
  {
    // R10 (founder 2026-07-11): Ria joins between Kashyap and Apoorva.
    // Bio facts from her published profile; quote drafted from her own
    // published line ("most businesses don't have a marketing problem, they
    // have a clarity problem") — founder-approved via the R10 plan, Ria's
    // personal sign-off flagged in FOUNDER-TODO. R11: the founder's source
    // PNG had a BAKED checkerboard (fake transparency) — re-cut with
    // tools/cutout (Vision) and composited on flat pale lavender #F1ECFB,
    // matching the set (each photo bg echoes its card tint family).
    id: "ria",
    name: "Ria Mangala Rewari",
    role: "Head of Marketing",
    tag: "The voice",
    photo: "/team/ria.jpg",
    tint: "bg-blue/15",
    border: "border-t-blue",
    quoteBorder: "border-l-blue",
    linkedin: "https://www.linkedin.com/in/ria-mangala/",
    bio: "Ria owns how Kheelona speaks to the world. She co-founded a marketing agency and ran it for seven years, and has trained more than 1,000 students and entrepreneurs in digital marketing. She owns the story: where Lumi shows up, how it speaks, and why it never overpromises.",
    quote:
      "Most brands do not have a marketing problem. They have a clarity problem. My job is to keep this one clear and honest.",
  },
  {
    id: "apoorva",
    name: "Apoorva Sahu",
    role: "Co-founder and CEO",
    tag: "The business and the trust",
    photo: "/team/apoorva.jpg",
    tint: "bg-yellow/15",
    border: "border-t-yellow",
    quoteBorder: "border-l-yellow",
    linkedin: "https://www.linkedin.com/in/sahu-apoorva/",
    bio: "Apoorva grew up inside education businesses: his family runs the pre-school where he was the first student, in 1994, and he helped run his father's coaching centre as a teenager. Fifteen years in finance and company-building later, he is a Chartered Accountant who learned to ship AI. He owns the frontend, the firmware, and the promise this brand makes to your family.",
    quote:
      "The hard part of AI for children is not the model. It is the trust. So we build that first, and everything else second.",
  },
] as const;

const BELIEFS = [
  "Screen-free is not nostalgia. It is the next product.",
  "Safety is not a feature. It is the whole product.",
  "A toy should be kept, not outgrown.",
  "The parent holds the keys. Always.",
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

export default function TeamPage() {
  return (
    <>
      {/* The founders are already entities in the Organization node (lib/seo),
          so this page just declares itself as the about page for them. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            graph(
              { "@type": "AboutPage", name: "The people who build Kheelona", url: "https://kheelona.com/team" },
              breadcrumbs([{ name: "Team", path: "/team" }]),
            ),
          ),
        }}
      />
      {/* Manifesto hero (kheelona.ai framing, parent voice). Copy-only: the
          four founder photos below are this page's picture. */}
      <PageHero
        guide="silly"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="My people. They made me, then Lumi."
      >
        <SectionHeading
          as="h1"
          eyebrow="Why we built Kheelona"
          title="Every object a child holds is about to wake up."
          titleClassName="mb-5 max-w-[18ch]"
          lede="The plush, the crib, the night-light. Within a few years each one will listen, answer, and remember the child who loves it. Someone has to build the mind that wakes them, and build it safely. That is the whole reason Kheelona exists."
          ledeClassName="mb-4 max-w-[58ch]"
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
        <Room fill="white" reveal="left">
          <Reveal>
            <SectionHeading
              title="A brain, a body, a business, and a voice."
              titleClassName="mb-3"
              lede="You are trusting us near your child. You should know who we are."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="flex flex-col gap-6">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06}>
                <TiltCard
                  maxTilt={2}
                  className={`rounded-(--radius-card) border border-line-soft border-t-4 bg-cream p-7 ${f.border}`}
                >
                  <div className="flex flex-wrap items-start gap-7">
                    <div className={`shrink-0 rounded-2xl p-2 ${f.tint}`}>
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
                        screens, but below sm it must yield: 280px does not fit
                        a room's content box on a 320px phone (M4 mobile pass) */}
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
                      <p className="mt-1 text-[13px] font-bold uppercase tracking-[0.05em] text-ink-muted">
                        {f.role} <span className="font-semibold">· {f.tag}</span>
                      </p>
                      <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed">
                        {f.bio}
                      </p>
                      <p
                        className={`mt-4 max-w-[62ch] border-l-[3px] pl-4 font-display text-[19px] leading-[1.4] text-ink-head ${f.quoteBorder}`}
                      >
                        {f.quote}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Room>

        <Room fill="cool" reveal="right">
          <Reveal>
            <SectionHeading title="What we believe." titleClassName="mb-11" />
          </Reveal>
          {/* orange-deep numerals: the normalized accent (design panel
              re-review; text-blue washed out on the cool wash) */}
          <StepList
            items={BELIEFS.map((b) => ({ title: b }))}
            columns="md:grid-cols-[80px_1fr]"
            rowClassName="items-center gap-4 py-7"
            titleClassName="font-display text-[clamp(20px,2.2vw,26px)] font-extrabold text-ink-head"
          />
        </Room>

        {/* Recognition (these programs are founder-published on kheelona.ai) */}
        <Room fill="white" reveal="left">
          <RecognitionStrip bare label="Backed by" />
        </Room>

        <Room fill="cream" reveal="right">
          <Reveal>
            <p className="max-w-[52ch] text-[clamp(19px,1.8vw,23px)]">
              If you have read this far, you care the way we care. Save your
              place in line, and grow with us.
            </p>
          </Reveal>
        </Room>

        <Room
          fill="white"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
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
