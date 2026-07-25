import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { AnswerBlock } from "@/components/molecules/AnswerBlock";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { Reveal } from "@/components/molecules/Reveal";
import { PhoneFrame } from "@/components/molecules/PhoneFrame";
import { FamilyGrid } from "@/components/organisms/FamilyGrid";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";

export const metadata: Metadata = {
  title: "PlayOS by Kheelona: the parent app and the brain behind Lumi",
  description:
    "One friend, many bodies. PlayOS gives every Kheelona companion its voice, keeps answers right for your child's age, and shows you everything in the parent app.",
  alternates: { canonical: "/playos" },
};

/* R11 rebuild (founder): the tab is now PlayOS, and the page tells the
   PLATFORM story — content and flow mirror the founder-published
   kheelona.ai/playos, adapted to parent voice for the .com audience
   (parents first, investors welcome). Per the approved plan: NO per-unit
   pricing, NO partnership CTAs (one pointer to kheelona.ai), and the old
   4-step "path of one sentence" moved to /products/lumi. Every fact here is
   published on kheelona.ai — nothing invented (provenance:
   copy-reference.md R11).
   Revamp M4 (theme B): hero + room track, guide narration, and the
   parent-app room opens with the question parents actually search
   ("parental controls AI toy" is the page's new primary term, research.md).
   Ages now 3 to 10 (locked, wireframe round). */

/* Family lineup shared with the Home family room (lib/family, FamilyGrid). */

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
  { n: "02", title: "The voice is captured.", body: "The mic array picks up your child's voice, and the device trims the silence before anything travels.", color: "text-blue-ink" },
  { n: "03", title: "The right brain answers.", body: "Light turns run on the module itself. Richer turns go to the PlayOS cloud. The device decides, turn by turn.", color: "text-orange-ink" },
  { n: "04", title: "Voice to voice.", body: "The reply comes back as a voice, with no text step in the middle. That is what keeps an answer quick enough for a three year old.", color: "text-orange-deep" },
  { n: "05", title: "Safety on every turn.", body: "On-device filters and cloud guardrails check what goes in and what comes out, grade the answer to your child's age, and keep it off the open internet.", color: "text-blue" },
  { n: "06", title: "The toy speaks.", body: "In the language your family speaks at home, remembering what was said a minute, or a week, ago.", color: "text-blue-ink" },
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
  { title: "Age-graded responses", body: "Answers tuned for ages 3 to 10, not shrunk from adult AI." },
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

/* The parent-app answer, mirrored into FAQPage schema below (schema may only
   ever describe copy a parent can read on the page). */
const APP_ANSWER =
  "Everything the toy said and heard. The parent app gives you a summary of the day, the full conversation log word for word, topic filters that decide what is open and what waits, and one note about your family's language, culture, and values that shapes every conversation after it. One app covers every Kheelona friend.";

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What can you see in the parent app?",
      acceptedAnswer: { "@type": "Answer", text: APP_ANSWER },
    },
  ],
};

export default function PlayOSPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <PageHero
        ratio="md:grid-cols-[1.05fr_0.95fr]"
        guide="curious"
        /* GATED:kheelu-line — founder sign-off before merge to master */
        say="PlayOS is the part of me you can't hug."
        media={
          <Image
            src="/products/magic-box.png"
            alt="The Kheelona Magic Box module, opened up: the case, circuit board, microphone, and speaker laid out in a row"
            width={900}
            height={900}
            sizes="(max-width: 768px) 85vw, 440px"
            priority
            className="h-auto w-full max-w-[440px]"
          />
        }
      >
        <SectionHeading
          as="h1"
          eyebrow="PlayOS"
          title="One soul. Many bodies."
          titleClassName="mb-5"
          lede="PlayOS is the friend inside every Kheelona companion. It remembers, speaks your languages, and answers to you. Lumi is the first body it lives in. It will not be the last."
        />
      </PageHero>

      <RoomsTrack>
        {/* The family: bigger than one toy */}
        <Room fill="white" reveal="left">
          <Reveal>
            <SectionHeading
              title="The same friend, in every body."
              titleClassName="mb-3 max-w-[18ch]"
              lede="Every friend that follows Lumi runs on the same PlayOS soul, learns the same safety rules, and grows with your child instead of gathering dust. When PlayOS gets smarter, every friend does."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <FamilyGrid />
        </Room>

        {/* The Magic Box (the photo now opens the page, so this room is the
            plain-words explanation next to it) */}
        <Room fill="cream" reveal="right">
          <Reveal>
            <SectionHeading
              eyebrow="The Kheelona Magic Box"
              title="The brain, in a box you can hold."
              titleClassName="mb-5 max-w-[16ch]"
              lede="Inside every Kheelona friend sits the same palm-sized module, the one opened up at the top of this page. Drop it into a body and the body comes alive: it hears, thinks, and talks."
              ledeClassName="mb-7 max-w-[54ch]"
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
        </Room>

        {/* Parent app, platform-wide */}
        <Room fill="white" id="parent-app" reveal="left">
          <Reveal>
            <SectionHeading
              eyebrow="For the grown-ups"
              title="You are the other half of PlayOS."
              titleClassName="mb-3 max-w-[22ch]"
              lede="Every PlayOS friend ships with the same parent app. It is how you know the toy is helping, not just talking."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mb-10">
            <AnswerBlock
              as="h3"
              question="What can you see in the parent app?"
              answer={APP_ANSWER}
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
                <Card className="border border-line-soft bg-cream" title={f.title}>
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
                <p className="max-w-[48ch] border-l-[3px] border-orange pl-4 font-display text-[18px] leading-[1.4] text-ink-head">
                  Tell stories where patience wins, and make my child the
                  hero.
                </p>
              </div>
            </div>
          </Reveal>
        </Room>

        {/* The voice path, end to end */}
        <Room fill="cool" guide="silly" say="My friends built this brain. I asked it the first why." reveal="right">
          <Reveal>
            <SectionHeading
              title="The voice path, end to end."
              titleClassName="mb-3"
              lede="A child speaks. The toy answers. Here is the whole path in between, in six careful steps."
              ledeClassName="mb-12 max-w-[58ch]"
            />
          </Reveal>
          <StepList items={VOICE_PATH} />
        </Room>

        {/* Under the hood */}
        <Room fill="white" reveal="left">
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
                <Card
                  className="border border-line-soft bg-cream"
                  title={s.title}
                  titleClassName="mb-2 font-display text-[21px] font-extrabold text-ink-head"
                >
                  <p className="text-[15px]">{s.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* Safety, six layers */}
        <Room fill="cream" reveal="right">
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
                <Card
                  className="bg-white"
                  title={l.title}
                  titleClassName="mb-2 font-display text-[21px] font-extrabold text-ink-head"
                >
                  <p className="text-[15px]">{l.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-[16px] text-ink-muted">
              The full picture, including how we built the safety layer, lives
              on the{" "}
              <Link
                href="/safety"
                className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                Safety page
              </Link>
              .
            </p>
          </Reveal>
        </Room>

        {/* Data & privacy */}
        <Room fill="cool" reveal="left">
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
                <Card className="bg-white" title={c.title}>
                  <p className="text-[15px]">{c.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* The brain keeps growing (Voice SLM, parent-framed) + partners */}
        <Room fill="white" reveal="right">
          <Reveal>
            <SectionHeading
              title="The brain keeps growing."
              titleClassName="mb-3 max-w-[20ch]"
              lede="Kheelona is building its own child-safe voice model, made for toys instead of borrowed from chatbots. It learns only from conversations families separately opt into, every family can withdraw with one tap, and nothing is ever sold. Each consented conversation makes every friend a little smarter."
              ledeClassName="mb-8 max-w-[62ch]"
            />
            <p className="mb-8 text-[16px] text-ink-muted">
              Building on PlayOS, or looking deeper?{" "}
              <a
                href="https://kheelona.ai"
                className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                kheelona.ai
              </a>{" "}
              is where partners and investors get the full story.
            </p>
            <Button href="/products/lumi" variant="ghost">
              Meet Lumi, the first friend
            </Button>
          </Reveal>
        </Room>

        <Room
          fill="orange"
          id="reserve"
          guide="silly"
          /* GATED:kheelu-line */
          say="Save your spot. I'll keep Lumi company until launch."
          reveal="pop"
          className="overflow-x-clip"
        >
          <FinaleCTA bare variant="compact" />
        </Room>
      </RoomsTrack>
    </>
  );
}
