import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PageHero } from "@/components/ui/PageHero";
import { Card } from "@/components/ui/Card";
import { CheckList } from "@/components/ui/CheckList";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";
import { Button } from "@/components/ui/Button";
import { Faq, type FaqEntry } from "@/components/ui/Faq";
import { FinaleCTA } from "@/components/sections/shared/FinaleCTA";
import { StageGate } from "@/components/three/StageGate";

export const metadata: Metadata = {
  title: "Safety: how we built a safe AI toy",
  description:
    "How Lumi keeps children safe: wake-word-only listening, an age-graded safety layer, no open internet, and a parent who sees everything. Safe AI toys, explained plainly.",
  alternates: { canonical: "/safety" },
};

/* Copy drafted per prompt §5.2: calm, specific, reassuring. Keywords: AI toys,
   safe AI toy, toy to reduce screen time for toddlers in India.
   Toy-safety standards and certifications are PENDING (§1.9): never invented,
   shown as "in progress" honestly. */

const WORD_RULES = [
  { title: "Listening starts with the wake word.", body: "Lumi listens only after your child says the wake word. The rest of the time, the microphone is off. Not muted. Off." },
  { title: "Filters live on the device.", body: "The first safety checks happen on the toy itself, before anything travels anywhere." },
  { title: "Every answer is age-graded.", body: "Replies pass through a safety layer tuned for ages 3 to 6. On-device and cloud filters work together." },
  { title: "There is no open internet.", body: "Lumi cannot browse, search, or stumble. No random videos, no rabbit holes, no strangers. Ever." },
] as const;

const VOICE_RULES = [
  { title: "Region-pinned", body: "Conversations stay in your region." },
  { title: "Parent-consented", body: "Nothing is collected without your say-so." },
  { title: "Deletable in one tap", body: "Read any conversation. Delete any conversation." },
  { title: "Never sold", body: "Your child's voice data is never sold." },
] as const;

/* Safety FAQ: question-led for answer engines (CMO review); answers reuse
   already-linted claims only. */
const SAFETY_FAQ: FaqEntry[] = [
  { q: "Is Lumi always listening to my child?", a: "No. Lumi listens only after your child says the wake word. The rest of the time the microphone is off, and you can read or delete any conversation in the parent app." },
  { q: "Is an AI toy safe for a 3 year old?", a: "A safe AI toy needs three things: no open internet, age-graded answers, and a parent who sees everything. Lumi is built on all three, for ages 3 to 6 exactly." },
  { q: "Does Lumi reduce screen time?", a: "That is the point. Lumi has no screen at all. It is a toy to reduce screen time for toddlers: your child talks, listens, and imagines instead of watching." },
  { q: "Where does my child's voice data go?", a: "It stays in your region, nothing is collected without your consent, you can delete any conversation in one tap, and it is never sold." },
];

/* R7: the custody-chain steps, adapted to parent voice from the
   kheelona.ai/safety data-flow diagram (founder-published). */
const VOICE_PATH = [
  { title: "Lumi hears the wake word", body: "Until your child says it, the microphone is off. Not muted. Off." },
  { title: "The device checks first", body: "The first safety filters run on the toy itself, before anything travels anywhere." },
  { title: "The voice brain answers", body: "Every reply passes an age-graded safety layer tuned for ages 3 to 6." },
  { title: "It all lands in your app", body: "You can read the conversation, and delete any of it with one tap." },
] as const;

/* R7: standards, status-for-status as published on kheelona.ai/safety.
   Never upgrade a status here (claims gate). */
const STANDARDS = [
  { name: "COPPA (2026)", status: "Designed for" },
  { name: "GDPR-K", status: "Designed for" },
  { name: "India DPDP", status: "Designed for" },
  { name: "ISO 27001", status: "In progress" },
] as const;

const PARENT_KEYS = [
  "Topics: you choose what is open and what waits.",
  "Time: quiet hours are yours to set.",
  "Languages: pick the ones you speak at home.",
  "The log: every conversation, readable and deletable.",
] as const;

const SAFETY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: SAFETY_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function SafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SAFETY_JSON_LD) }}
      />
      {/* Hero */}
      <Section wash="teal">
        <PageHero
          ratio="md:grid-cols-[1.2fr_0.8fr]"
          media={<MascotScene pose="bliss" width={260} parallax={30} priority />}
        >
          {/* R9: full-white kicker — 13px normal-size text needs 4.5:1 on
              teal-deep (white = 5.47:1; white/85 dipped under) */}
          <SectionHeading
            as="h1"
            tone="white"
            eyebrow="Safety"
            eyebrowColor="text-white"
            title="Safe in their hands. Careful with their words."
            titleClassName="mb-5 max-w-[16ch]"
            lede="You are not buying a gadget. You are trusting a friend near your child. Here is everything that friend will and will not do, in plain words."
            ledeClassName="max-w-[58ch] text-white"
          />
        </PageHero>
      </Section>

      {/* The body */}
      <Section wash="white">
        <CurveDivider from="teal" />
        <Container className="py-16 md:py-20">
          <Reveal>
            {/* TODO(claims-certs): exact toy-safety standards and certificate
                references pending from founder. No physical claims before
                certification (copy-review verdict); launch gate needs the list. */}
            <SectionHeading
              title="Safe in their hands."
              titleClassName="mb-4"
              lede="Lumi is designed for small hands and big feelings. We are completing formal toy-safety testing now. The exact materials, standards, and certificates will be listed here, in full, before Lumi ships."
              ledeClassName="max-w-[62ch]"
            />
          </Reveal>
        </Container>
      </Section>

      {/* The words */}
      <Section wash="cool">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Careful with their words."
              titleClassName="mb-3"
              lede="Four rules govern every word Lumi hears and says. They are not settings. They are how it is built."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WORD_RULES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <Card
                  className="p-8"
                  title={r.title}
                  titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{r.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Where the voice goes */}
      <Section wash="cream">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Where a child's voice goes."
              titleClassName="mb-3"
              lede="A child's voice is precious cargo. We treat it that way. Here is the whole journey, in order:"
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          {/* R7: the custody chain, step by step */}
          <ol className="mb-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VOICE_PATH.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.05}>
                <Card tilt={false} className="border border-line-soft bg-white/70 p-6">
                  <span aria-hidden="true" className="font-display text-3xl font-extrabold text-orange-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-[19px] font-extrabold text-ink-head">{s.title}</h3>
                  <p className="mt-1 text-[15px]">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </ol>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VOICE_RULES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <Card title={c.title}>
                  <p className="text-[15px]">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            {/* R11 voice-lint: "can't" de-contracted — the .ai line arrived
                verbatim, but the contraction gate outranks the reference
                (founder can revert on live read; copy-reference R11) */}
            <p className="mt-10 max-w-[40ch] font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-[1.25] text-ink-head">
              Nothing leaves without consent. Nothing stays that you cannot
              delete.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* The grown-up holds the keys */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-20">
          <Reveal>
            <SectionHeading
              title="The grown-up holds the keys."
              titleClassName="mb-4"
              lede="Lumi never decides what is right for your family. You do. The parent app is where you turn the keys:"
              ledeClassName="mb-6 max-w-[54ch]"
            />
            <CheckList items={PARENT_KEYS} className="space-y-3" />
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="joy" width={300} parallax={34} />
          </Reveal>
        </Container>
        <Container className="pb-16">
          <Reveal>
            <Button href="/products/lumi" variant="ghost">
              See the parent app on the Lumi page
            </Button>
          </Reveal>
        </Container>
      </Section>

      {/* Safety questions (AEO) */}
      {/* R7: standards, honest and status-exact (source: kheelona.ai/safety).
          Toy-safety testing status is already stated in plain words above. */}
      <Section wash="white">
        <Container className="pb-16 pt-2 md:pb-20">
          <Reveal>
            <SectionHeading
              level="minor"
              title="The standards we build against."
              titleClassName="mb-3"
              lede="These are the children's privacy frameworks Lumi is designed for, and where our certifications stand today. No badge appears here before it is earned."
              ledeClassName="mb-8 max-w-[58ch] text-[17px]"
            />
          </Reveal>
          <ul className="flex flex-wrap gap-3">
            {STANDARDS.map((s) => (
              <li
                key={s.name}
                className="flex items-center gap-3 rounded-full border border-line-soft bg-white px-5 py-2.5"
              >
                <span className="text-[16px] font-semibold text-ink-head">{s.name}</span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wide ${
                    s.status === "In progress" ? "bg-yellow/15 text-ink-head" : "bg-teal/15 text-ink-head"
                  }`}
                >
                  {s.status}
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="The questions we would ask too."
              titleClassName="mb-3"
              lede="Straight answers about AI toys and your child."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={SAFETY_FAQ} />
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="cream" />
      <StageGate stage="ambient" />
    </>
  );
}
