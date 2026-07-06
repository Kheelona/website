import type { Metadata } from "next";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { MascotScene } from "@/components/mascot/MascotScene";
import { Button } from "@/components/ui/Button";
import { Faq, type FaqEntry } from "@/components/ui/Faq";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";

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
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.2fr_0.8fr] md:py-20">
          <Reveal>
            <Eyebrow color="text-ink-head/80">Safety</Eyebrow>
            <h1 className="mb-5 max-w-[16ch] font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Safe in their hands. Careful with their words.
            </h1>
            <p className="max-w-[58ch] text-[clamp(18px,1.6vw,21px)] text-ink-head/90">
              You are not buying a gadget. You are trusting a friend near your
              child. Here is everything that friend will and will not do,
              in plain words.
            </p>
          </Reveal>
          <Reveal className="flex justify-center">
            <MascotScene pose="bliss" width={260} parallax={30} />
          </Reveal>
        </Container>
      </Section>

      {/* The body */}
      <Section wash="white">
        <CurveDivider from="teal" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-4 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Safe in their hands.
            </h2>
            {/* TODO(claims-certs): exact toy-safety standards and certificate
                references pending from founder. No physical claims before
                certification (copy-review verdict); launch gate needs the list. */}
            <p className="max-w-[62ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi is designed for small hands and big feelings. We are
              completing formal toy-safety testing now. The exact materials,
              standards, and certificates will be listed here, in full, before
              Lumi ships.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* The words */}
      <Section wash="cool">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Careful with their words.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Four rules govern every word Lumi hears and says. They are not
              settings. They are how it is built.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {WORD_RULES.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.05}>
                <div className="h-full rounded-(--radius-card) bg-white p-8">
                  <h3 className="mb-2 font-display text-[24px] font-extrabold text-ink-head">{r.title}</h3>
                  <p className="text-[16.5px]">{r.body}</p>
                </div>
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
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Where a child&apos;s voice goes.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              A child&apos;s voice is precious cargo. We treat it that way.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {VOICE_RULES.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.05}>
                <div className="h-full rounded-(--radius-card) bg-white p-7">
                  <h3 className="mb-2 font-display text-[22px] font-extrabold text-ink-head">{c.title}</h3>
                  <p className="text-[15.5px]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* The grown-up holds the keys */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1fr_1fr] md:py-20">
          <Reveal>
            <h2 className="mb-4 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              The grown-up holds the keys.
            </h2>
            <p className="mb-6 max-w-[54ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi never decides what is right for your family. You do. The
              parent app is where you turn the keys:
            </p>
            <ul className="space-y-3 text-[17px]">
              {PARENT_KEYS.map((k) => (
                <li key={k} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-teal">✓</span>
                  {k}
                </li>
              ))}
            </ul>
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
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold text-ink-head">
              The questions we would ask too.
            </h2>
            <p className="mb-10 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Straight answers about AI toys and your child.
            </p>
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={SAFETY_FAQ} />
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="cream" />
    </>
  );
}
