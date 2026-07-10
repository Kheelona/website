import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { TiltCard } from "@/components/ui/TiltCard";
import { MascotScene } from "@/components/mascot/MascotScene";
import { RecognitionStrip } from "@/components/sections/shared/RecognitionStrip";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
import { StageGate } from "@/components/three/StageGate";

export const metadata: Metadata = {
  title: "Team: the parents who build",
  description:
    "Meet the people behind Kheelona and Lumi, the screen-free AI robot toy: a CTO with 14 patents filed, a hardware chief who built at Intel, a marketing head who keeps the story honest, and a CEO who owns the trust.",
  alternates: { canonical: "/team" },
};

/* R7 full-parity rebuild from kheelona.ai/team (founder-published source:
   its content/site.ts TEAM object). Bios adapted to parent voice; facts
   verbatim (14 patents, Intel + Thunderbolt 4/5 compliance, CA + 15 years
   scaling). Pull-quotes verbatim, upright serif (zero-italics law).
   Colored text stays decorative-only: names/titles are ink (contrast). */

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
    bio: "Aman builds the part that thinks. He studied AI, shipped machine learning in production, and holds 14 patents filed in his own name. He owns PlayOS: the voice engine, the on-device safety filters, and the model that gets gentler and smarter with every conversation.",
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
    bio: "Kashyap makes Lumi something small hands reach for. Over a decade, including years at Intel leading Thunderbolt 4 and 5 compliance, he took hardware from a blank page to certified products on real shelves. He owns the Kheelona Magic Box and the unglamorous work of making it safe to hug.",
    quote:
      "Anyone can build a demo. Shipping a safe, certified toy by the thousand is a different sport. I have played it for ten years.",
  },
  {
    // R10 (founder 2026-07-11): Ria joins between Kashyap and Apoorva.
    // Photo from the founder (transparent PNG, cropped square); bio facts
    // from her published profile; quote drafted from her own published line
    // ("most businesses don't have a marketing problem, they have a clarity
    // problem") — founder-approved via the R10 plan, Ria's personal sign-off
    // flagged in FOUNDER-TODO.
    id: "ria",
    name: "Ria Mangala Rewari",
    role: "Head of Marketing",
    tag: "The voice",
    photo: "/team/ria.png",
    tint: "bg-purple/15",
    border: "border-t-purple",
    quoteBorder: "border-l-purple",
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
    tint: "bg-teal/15",
    border: "border-t-teal",
    quoteBorder: "border-l-teal",
    linkedin: "https://www.linkedin.com/in/sahu-apoorva/",
    bio: "Apoorva spent fifteen years in finance and company-building, including a decade as a director scaling a global tech firm of around 500 people. He is a Chartered Accountant who learned to ship AI. He owns the part you care about most: safety, privacy, and the promise this brand makes to your family.",
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
      {/* Manifesto hero (kheelona.ai framing, parent voice) */}
      <Section wash="cream">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <Reveal mode="rise">
            <Eyebrow>Why we built Kheelona</Eyebrow>
            <h1 className="mb-5 max-w-[18ch] font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Every object a child holds is about to wake up.
            </h1>
            <p className="mb-4 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              The plush, the crib, the night-light. Within a few years each one
              will listen, answer, and remember the child who loves it. Someone
              has to build the mind that wakes them, and build it safely. That
              is the whole reason Kheelona exists.
            </p>
            <p className="max-w-[58ch] text-[17px] text-ink-muted">
              We are parents who build. We watched our own children reach for
              screens and felt the same knot you feel. Between the four of us
              we cover the four things a safe talking toy actually needs: a
              brain, a body, a business, and a voice.
            </p>
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="silly" width={300} parallax={34} priority />
          </Reveal>
        </Container>
      </Section>

      {/* Founder cards (full parity: photo, tag, bio, pull-quote, LinkedIn) */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              A brain, a body, a business, and a voice.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              You are trusting us near your child. You should know who we are.
            </p>
          </Reveal>
          <div className="flex flex-col gap-6">
            {FOUNDERS.map((f, i) => (
              <Reveal key={f.id} delay={i * 0.06}>
                <TiltCard
                  maxTilt={2}
                  className={`rounded-(--radius-card) border border-line-soft border-t-4 bg-white p-7 ${f.border}`}
                >
                  <div className="flex flex-wrap items-start gap-7">
                    <div className={`shrink-0 rounded-[18px] p-2 ${f.tint}`}>
                      <Image
                        src={f.photo}
                        alt={`${f.name}, ${f.role} at Kheelona`}
                        width={480}
                        height={480}
                        sizes="160px"
                        className="block h-[150px] w-[150px] rounded-xl object-cover"
                      />
                    </div>
                    <div className="min-w-[280px] flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-display text-[26px] font-extrabold text-ink-head">
                          {f.name}
                        </h3>
                        <a
                          href={f.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${f.name} on LinkedIn`}
                          className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-head transition-colors hover:bg-cream"
                        >
                          <LinkedInIcon />
                        </a>
                      </div>
                      <p className="mt-1 text-[13.5px] font-bold uppercase tracking-[0.05em] text-ink-muted">
                        {f.role} <span className="font-semibold">· {f.tag}</span>
                      </p>
                      <p className="mt-3 max-w-[68ch] text-[16px] leading-relaxed">
                        {f.bio}
                      </p>
                      <p
                        className={`mt-4 max-w-[62ch] border-l-[3px] pl-4 font-accent text-[19px] leading-[1.4] text-ink-head ${f.quoteBorder}`}
                      >
                        {f.quote}
                      </p>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* What we believe */}
      <Section wash="cool">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-11 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              What we believe.
            </h2>
          </Reveal>
          <ol className="border-t border-line">
            {BELIEFS.map((b, i) => (
              <Reveal as="li" key={b} className="grid items-center gap-4 border-b border-line py-7 md:grid-cols-[80px_1fr]">
                  {/* orange-deep: the normalized numeral accent (design panel
                      re-review; text-blue washed out on the cool wash) */}
                  <span aria-hidden="true" className="font-display text-4xl font-extrabold text-orange-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-display text-[clamp(20px,2.2vw,26px)] font-extrabold text-ink-head">
                    {b}
                  </p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </Section>

      {/* Recognition (closes the old claims-backed-by TODO: these programs
          are founder-published on kheelona.ai) */}
      <RecognitionStrip label="Backed by" />

      {/* Gentle close */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-14 md:py-16">
          <Reveal>
            <p className="max-w-[52ch] text-[clamp(19px,1.8vw,23px)]">
              If you have read this far, you care the way we care. Save your
              place in line, and grow with us.
            </p>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="cream" />
      <StageGate stage="ambient" />
    </>
  );
}
