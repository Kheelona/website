import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { MascotScene } from "@/components/organisms/MascotScene";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { StageGate } from "@/features/ambient-stage";

export const metadata: Metadata = {
  title: "PlayOS: one soul, many bodies",
  description:
    "PlayOS is the one mind behind every Kheelona friend: Lumi today, Lori and more to follow. On-device first, age-graded safety on every reply, and a parent app that shows you everything.",
  alternates: { canonical: "/playos" },
};

/* R11 rebuild (founder): the tab is now PlayOS, and the page tells the
   PLATFORM story — content and flow mirror the founder-published
   kheelona.ai/playos, adapted to parent voice for the .com audience
   (parents first, investors welcome). Per the approved plan: NO per-unit
   pricing, NO partnership CTAs (one pointer to kheelona.ai), and the old
   4-step "path of one sentence" moved to /products/lumi. Every fact here is
   published on kheelona.ai — nothing invented (provenance:
   copy-reference.md R11). */

const FAMILY = [
  {
    name: "Lumi",
    note: "Here first. The friend who listens.",
    img: "/product/lumi-blue-2.png",
    alt: "Lumi, the sky blue talking plush toy, wearing its striped party hat",
    w: 1113,
    h: 1600,
    tint: "bg-blue/15",
  },
  {
    name: "Lori",
    note: "The baby-care companion. It watches over sleep, and knows hungry from sleepy.",
    img: "/products/lori.png",
    alt: "Lori, the white baby monitor with a camera, temperature display, and fabric speaker",
    w: 900,
    h: 900,
    tint: "bg-purple/15",
  },
  {
    name: "Lua",
    note: "A puppy on a leash. In the workshop.",
    img: "/products/lua.png",
    alt: "Lua, the golden plush puppy with a glowing collar and a leash controller",
    w: 900,
    h: 900,
    tint: "bg-yellow/15",
  },
  {
    name: "Robu",
    note: "The robot friend. Worth the wait.",
    img: "/products/robu.png",
    alt: "Robu, a small friendly white and orange robot waving hello",
    w: 900,
    h: 900,
    tint: "bg-teal/15",
  },
] as const;

const APP_FEATURES = [
  { title: "Summary and notifications", body: "An actionable summary of the day, and a nudge the moment something matters." },
  { title: "The conversation log", body: "Every conversation, in full. You read exactly what your child talked about, anytime." },
  { title: "Topic filters", body: "You choose what the toy talks about, and what it never will." },
  { title: "Your culture, woven in", body: "Ask for your family's language, culture, and values to be part of the play." },
  { title: "One prompt, your way", body: "Align the whole toy to how you parent, in a single line of text." },
] as const;

/* The end-to-end voice path (kheelona.ai/playos, parent voice). */
const VOICE_PATH = [
  { n: "01", title: "Wake, or press.", body: "The device listens only on the wake word or a button. The rest of the time, the microphones are off. Better for privacy, better for battery.", color: "text-blue" },
  { n: "02", title: "The voice is captured.", body: "The mic array picks up your child's voice, and the device trims the silence before anything travels.", color: "text-teal" },
  { n: "03", title: "The right brain answers.", body: "Light turns run on the module itself. Richer turns go to the PlayOS cloud. The device decides, turn by turn.", color: "text-purple" },
  { n: "04", title: "Voice to voice.", body: "The reply comes back as a voice, with no text step in the middle. That is what keeps an answer quick enough for a three year old.", color: "text-orange-deep" },
  { n: "05", title: "Safety on every turn.", body: "On-device filters and cloud guardrails check what goes in and what comes out, grade the answer to your child's age, and keep it off the open internet.", color: "text-blue" },
  { n: "06", title: "The toy speaks.", body: "In the language your family speaks at home, remembering what was said a minute, or a week, ago.", color: "text-teal" },
] as const;

const STACK = [
  { title: "The firmware", body: "The audio pipeline, the safety filters, and updates that arrive over the air. It ships certified, in every friend." },
  { title: "The cloud brain", body: "The voice engine and the content pipeline behind the richer conversations, with safety checks on both doors." },
  { title: "The hardware", body: "A custom board with a far-field mic array, a speaker, a battery, and USB-C charging." },
  { title: "The parent app", body: "Setup, progress, topic controls, and the conversation log. One app for every Kheelona friend." },
] as const;

const SAFETY_LAYERS = [
  { title: "On-device safety filter", body: "The first check happens on the toy, before anything travels." },
  { title: "Cloud guardrail", body: "A second, independent check on every reply." },
  { title: "Age-graded responses", body: "Answers tuned for ages 3 to 6, not shrunk from adult AI." },
  { title: "No open internet", body: "No browsing, no search, no rabbit holes. Ever." },
  { title: "Red-team tested", body: "We attack our own safety layer before every release." },
  { title: "A parent kill switch", body: "One tap from you stops everything, instantly." },
] as const;

const PRIVACY_CARDS = [
  { title: "Region-pinned", body: "Your family's conversations stay in your region." },
  { title: "Parent-consented", body: "Nothing is collected without your say-so. If you have not said yes, it does not happen." },
  { title: "Deletable in one tap", body: "Any conversation, gone the moment you decide." },
  { title: "Never sold", body: "Your child's voice data is never sold. Full stop." },
] as const;

export default function PlayOSPage() {
  return (
    <>
      {/* Hero */}
      <Section wash="cool">
        <PageHero
          media={<MascotScene pose="curious" width={320} parallax={36} priority />}
        >
          <SectionHeading
            as="h1"
            eyebrow="PlayOS"
            title="One soul. Many bodies."
            titleClassName="mb-5"
            lede="PlayOS is Kheelona's own mind for children aged 3 to 6: one voice engine, one set of safety rules, one parent app. Lumi is the first body it lives in. It will not be the last."
          />
        </PageHero>
      </Section>

      {/* The family: bigger than one toy */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Made to be kept, not outgrown."
              titleClassName="mb-3 max-w-[18ch]"
              lede="Every friend that follows Lumi runs on the same PlayOS soul, learns the same safety rules, and grows with your child instead of gathering dust. When PlayOS gets smarter, every friend does."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FAMILY.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <Card tilt={false} className="overflow-hidden border border-line-soft p-0">
                  <div className={`grid h-[200px] place-items-center p-5 ${m.tint}`}>
                    <Image
                      src={m.img}
                      alt={m.alt}
                      width={m.w}
                      height={m.h}
                      sizes="(max-width: 640px) 70vw, 240px"
                      className="h-[160px] w-auto object-contain"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="mb-1 font-display text-[24px] font-extrabold text-ink-head">
                      {m.name}
                    </h3>
                    <p className="text-[15px] text-ink-head/85">{m.note}</p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* The Magic Box */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="grid items-center gap-12 py-16 md:grid-cols-[0.9fr_1.1fr] md:py-20">
          <Reveal className="flex justify-center">
            <Image
              src="/products/magic-box.png"
              alt="The Kheelona Magic Box module, opened up: the case, circuit board, microphone, and speaker laid out in a row"
              width={900}
              height={900}
              sizes="(max-width: 768px) 85vw, 460px"
              className="h-auto w-full max-w-[460px]"
            />
          </Reveal>
          <Reveal>
            <SectionHeading
              eyebrow="The Kheelona Magic Box"
              title="One module, every shell."
              titleClassName="mb-5 max-w-[14ch]"
              lede="Inside every Kheelona friend sits the same palm-sized module. Drop it into a body and the body comes alive: it hears, thinks, and talks. This is the real one, opened up."
              ledeClassName="mb-6 max-w-[54ch]"
            />
            <ul className="flex max-w-[560px] flex-wrap gap-2.5">
              {[
                "Palm-sized",
                "Far-field microphones",
                "A real speaker",
                "Thinks on the device",
                "USB-C",
                "Updates over the air",
              ].map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-line-soft bg-white px-4 py-2 text-[15px] font-medium text-ink-head"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </Section>

      {/* Parent app, platform-wide */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="For the grown-ups"
              title="Parents see everything. That is why families keep it."
              titleClassName="mb-3 max-w-[22ch]"
              lede="Every PlayOS friend ships with the same parent app. It is how you know the toy is helping, not just talking."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mb-12 flex flex-wrap items-start justify-center gap-8 md:justify-start">
            <PhoneFrame
              src="/app/onboarding.png"
              alt="The parent app onboarding screen, choosing your role to your child"
              width={220}
            />
            <PhoneFrame
              src="/app/dashboard.png"
              alt="The parent app dashboard showing a child's interests and weekly activity"
              width={220}
            />
            <PhoneFrame
              src="/app/profile.png"
              alt="The parent app profile screen with caregiver and child details"
              width={220}
            />
          </Reveal>
          <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {APP_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card className="border border-line-soft" title={f.title}>
                  <p className="text-[15px]">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          {/* the one-prompt difference (band + the published example) */}
          <Reveal>
            <div className="items-center gap-8 rounded-(--radius-card-lg) border border-line-soft bg-cream p-7 md:flex md:p-9">
              <p className="mb-4 max-w-[14ch] shrink-0 font-display text-[26px] font-extrabold leading-[1.15] text-ink-head md:mb-0">
                Your parenting philosophy,{" "}
                <span className="text-orange-deep">in one prompt</span>
              </p>
              <div>
                <p className="mb-4 max-w-[58ch] text-[17px]">
                  In the parent app you write one note about how your family
                  talks: what you celebrate, what waits until later, which
                  languages live at home. PlayOS follows your lead in every
                  conversation after that.
                </p>
                <p className="max-w-[48ch] border-l-[3px] border-orange pl-4 font-accent text-[18px] leading-[1.4] text-ink-head">
                  Tell stories where patience wins, and make my child the
                  hero.
                </p>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* The voice path, end to end */}
      <Section wash="cool">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <KheeluSays
              line="My friends built this brain. I asked it the first why."
              pose="silly"
            />
            <SectionHeading
              title="The voice path, end to end."
              titleClassName="mb-3"
              lede="A child speaks. The toy answers. Here is the whole path in between, in six careful steps."
              ledeClassName="mb-12 max-w-[58ch]"
            />
          </Reveal>
          <StepList items={VOICE_PATH} />
        </Container>
      </Section>

      {/* Under the hood */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Under the hood."
              titleClassName="mb-3"
              lede="The full stack, in plain words. Four parts, one promise: it works the same in every friend."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STACK.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <Card className="border border-line-soft" title={s.title} titleClassName="mb-2 font-display text-[21px] font-extrabold text-ink-head">
                  <p className="text-[15px]">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Safety, six layers */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Built in, not bolted on."
              titleClassName="mb-3 max-w-[16ch]"
              lede="Six things stand between a child and a bad answer. A small brain built for children has far less room to go wrong than a big one, and it never talks to the open web."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {SAFETY_LAYERS.map((l, i) => (
              <Reveal key={l.title} delay={i * 0.04}>
                <Card title={l.title} titleClassName="mb-2 font-display text-[21px] font-extrabold text-ink-head">
                  <p className="text-[15px]">{l.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-[16px] text-ink-muted">
              The full picture, including how we built the safety layer, lives
              on the <Link href="/safety" className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">Safety page</Link>.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Data & privacy */}
      <Section wash="cool">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Where a child's voice goes."
              titleClassName="mb-3"
              lede="Short answer: almost nowhere. And never anywhere you did not approve."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRIVACY_CARDS.map((c) => (
              <Reveal key={c.title}>
                <Card title={c.title}>
                  <p className="text-[15px]">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* The brain keeps growing (Voice SLM, parent-framed) + partners */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="pb-14 pt-4 md:pb-16">
          <Reveal>
            <div className="items-center gap-8 rounded-(--radius-card-lg) border border-line-soft bg-cream p-7 md:flex md:p-9">
              <p className="mb-4 max-w-[12ch] shrink-0 font-display text-[26px] font-extrabold leading-[1.15] text-ink-head md:mb-0">
                The brain keeps{" "}
                <span className="text-orange-deep">growing</span>
              </p>
              <p className="max-w-[58ch] text-[17px]">
                Kheelona is building its own child-safe voice model, made for
                toys instead of borrowed from chatbots. It learns only from
                conversations families separately opt into, every family can
                withdraw with one tap, and nothing is ever sold. Each consented
                conversation makes every friend a little smarter.
              </p>
            </div>
          </Reveal>
          <Reveal className="mt-8">
            <p className="text-[16px] text-ink-muted">
              Building on PlayOS, or looking deeper?{" "}
              <a href="https://kheelona.ai" className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">
                kheelona.ai
              </a>{" "}
              is where partners and investors get the full story.
            </p>
          </Reveal>
          <Reveal className="mt-8">
            <Button href="/products/lumi" variant="ghost">
              Meet Lumi, the first friend
            </Button>
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="compact" from="white" />
      <StageGate stage="ambient" />
    </>
  );
}
