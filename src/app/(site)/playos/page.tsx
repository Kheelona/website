import Image from "next/image";
import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { AnswerBlock } from "@/components/molecules/AnswerBlock";
import { PageHero } from "@/components/templates/PageHero";
import { Card } from "@/components/molecules/Card";
import { Reveal } from "@/components/molecules/Reveal";
import { PromiseMark } from "@/components/molecules/PromiseMark";
import { ArchitectureStack, type ArchLayer } from "@/components/organisms/ArchitectureStack";
import { RecognitionStrip } from "@/components/organisms/RecognitionStrip";
import { graph, faqPage, breadcrumbs, pageMeta } from "@/lib/seo";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { LUMI_AGES } from "@/config/site";

export const metadata = pageMeta({
  title: "PlayOS: one platform for childhood, ages 3+",
  description:
    "The platform under every Kheelona friend: a child-only voice brain, safety on both doors, up to 10 home languages, and one memory that travels from age 3.",
  path: "/playos",
});

/* V4 rebuild (D6, team feedback 2026-07-30): this page now speaks to the VCs
   the founders are reaching out to — the vision, the moat, and the depth of
   the stack — with curious parents welcome second. It supersedes the R11
   parent-voice-only law. Two rules carried over intact: no per-unit pricing
   here, and the kheelona.ai pointer stays the only partner CTA.
   FACTS: every claim is published — on this page's prior version, on
   kheelona.ai, on /team, or in the team's own architecture diagram
   (docs/revamp-2026-07/team-feedback-2026-07-30.pdf, p6). Nothing invented.
   The page shrank from hero + 8 rooms to hero + 4 + finale ("reduce the
   length of this page" was a direct item). */

/* The stack, straight from the team's diagram. One deviation, recorded in
   copy-reference: the diagram's "Age 3+" chip renders from LUMI_AGES —
   ages are locked site-wide to the constants (V3 §1.5). */
const ARCH_ABOVE: readonly ArchLayer[] = [
  {
    id: "companion",
    name: "Physical AI companion",
    blurb:
      "The part your child hugs: a screen-free friend that talks, teaches, and keeps up.",
    chips: [
      "Screen free",
      "Cognitive development",
      "Educational",
      "Endless conversations",
      /* V6 QA N1: the team diagram's bare "WiFi operated" predates the
         mode-precise connectivity law (§8.24-1); aligned so the chip cannot
         read as "dead without WiFi". */
      "AI mode on home WiFi",
      `Ages ${LUMI_AGES}`,
      "Multi-language",
    ],
    tint: "bg-white",
  },
  {
    id: "app",
    name: "Mobile application",
    blurb:
      "The part you hold: every conversation, control, and progress report in one place.",
    chips: [
      "Dashboard",
      "Language packages",
      "Character config",
      "Progress reports",
      "Story library",
      "SOS alerts",
    ],
    tint: "bg-white",
  },
];

const ARCH_BELOW: readonly ArchLayer[] = [
  {
    id: "psychology",
    name: "Psychology and design",
    blurb: "The rules of a good friendship, engineered in.",
    chips: [
      "Emotional intelligence (EQ)",
      "Curiosity-led learning",
      "Age-matched vocabulary",
      "Psychological safety",
      "Turn-taking logic",
      "Frictionless UX",
    ],
    tint: "bg-blue/15",
  },
  {
    id: "cloud",
    name: "Cloud and AI engine",
    blurb: "The brain for the richer turns, with safety checks on both doors.",
    chips: [
      "Voice-to-voice AI",
      "Voice SLM",
      "Compute engine",
      "Content pipeline",
      "OTA updates",
      "Safety filters",
      "Speech analysis",
    ],
    tint: "bg-cool",
  },
  {
    id: "compute",
    name: "Physical compute",
    blurb: "The brain on the toy itself, so answers come fast and work offline.",
    chips: [
      "ESP32 MCU",
      "Microphone array",
      "Amplifier and speaker",
      "LED indicators",
      "Motion sensor (IMU)",
      "Edge AI inference",
      "Motor drivers",
    ],
    tint: "bg-yellow/15",
  },
  {
    id: "hardware",
    name: "Hardware",
    blurb: "The body under the fur: safe power in an enclosure built to be hugged.",
    chips: [
      "Custom PCB",
      "Battery management (BMS)",
      "USB-C charging",
      "Toy enclosure",
      "Antenna design",
      "Thermal protection",
    ],
    tint: "bg-orange/15",
  },
];

/* The moat, in cards. Every line is published fact: the stack (this page),
   the model and consent terms (this page + /privacy), the languages
   (site-wide), the arc (the pipeline fold on every page). */
const MOAT = [
  {
    title: "Own the stack",
    body: "Custom board, firmware, cloud brain, and the parent app, built by one team. Nothing rented that matters.",
  },
  {
    title: "Own the model",
    body: "A small voice model trained only for children, not shrunk from adult AI. It learns from conversations families separately opt into, and nothing is ever sold.",
  },
  {
    title: "Own the languages",
    body: "Up to 10 home languages, built for India first. A child who can wonder in their own words wonders more.",
  },
  {
    title: "Own the years",
    /* SEO round 2026-08-12: "AI educational toy" names Lumi, the published
       first body — the speaker and books keep their own plain names. */
    body: "One friend from age 3 up: the AI educational toy, then the speaker, then books that answer back. The memory travels, so families stay.",
  },
] as const;

/* The parent-app answer, mirrored into FAQPage schema below (schema may only
   ever describe copy a parent can read on the page). */
const APP_ANSWER =
  "Everything the toy said and heard. The parent app gives you a summary of the day, the full conversation log word for word, and topic filters that decide what is open and what waits. It counts the new words your child learned and gives you one simple thing to do together each day. One app covers every Kheelona friend.";

const JSON_LD = graph(
  faqPage([{ q: "What can you see in the parent app?", a: APP_ANSWER }]),
  breadcrumbs([{ name: "PlayOS", path: "/playos" }]),
);

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
          title="The operating system for childhood."
          titleClassName="mb-5"
          lede="PlayOS is the platform under every Kheelona friend: one safe voice brain, one memory of your child, many bodies as they grow. Lumi is the first body. It will not be the last."
        />
      </PageHero>

      <RoomsTrack>
        {/* Why this wins */}
        <Room fill="white" reveal="left">
          <Reveal>
            <SectionHeading
              title="The moat, in plain words."
              titleClassName="mb-3"
              lede="Four things we own that a feature list cannot copy."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {MOAT.map((m, i) => (
              <Reveal key={m.title} delay={i * 0.05}>
                <Card className="h-full border border-line-soft bg-cream">
                  <PromiseMark index={i} className="mb-3" />
                  <h3 className="mb-2 font-display text-[21px] font-extrabold text-ink-head">
                    {m.title}
                  </h3>
                  <p className="text-[15.5px]">{m.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Room>

        {/* The stack, openable (the team's iceberg, rebuilt as brand UI) */}
        <Room
          fill="cream"
          guide="silly"
          /* GATED:kheelu-line (shortened per §5.1) */
          say="My friends built this. I asked the first why."
          reveal="right"
        >
          <Reveal>
            <SectionHeading
              title="Above the water, a toy. Below it, a platform."
              titleClassName="mb-3 max-w-[22ch]"
              lede="Tap a layer to open it. The smart toy your child hugs is the smallest part of what we build."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal>
            <ArchitectureStack above={ARCH_ABOVE} below={ARCH_BELOW} />
          </Reveal>
        </Room>

        {/* The flywheel + the credibility */}
        <Room fill="cool" reveal="left">
          <Reveal>
            <SectionHeading
              title="The brain keeps growing."
              titleClassName="mb-3 max-w-[20ch]"
              lede="Kheelona trains its own child-safe voice model, made for developmental toys instead of borrowed from chatbots. It learns only from conversations families separately opt into, every family can withdraw with one tap, and nothing is ever sold. Each consented conversation makes every friend a little smarter."
              ledeClassName="mb-8 max-w-[62ch]"
            />
            <p className="mb-8 max-w-[58ch] text-[16px] text-ink">
              The brain has a builder: a CTO with 14 patents filed in his own
              name.{" "}
              <Link
                href="/team"
                className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                Meet the team
              </Link>
            </p>
          </Reveal>
          <Reveal className="mb-2">
            <RecognitionStrip bare />
          </Reveal>
          <Reveal className="mt-8">
            {/* `ink` not `ink-muted`: this room is the cool wash, where muted
                measures 4.37:1 and fails AA. There is no compliant muted ink
                for a tinted wash (the palette is ink / ink-head / ink-muted),
                so the B2B aside loses a little de-emphasis and keeps its
                readers. Same call V6 made on /products/lumi. */}
            <p className="text-[16px] text-ink">
              Building on PlayOS, or looking deeper?{" "}
              <a
                href="https://kheelona.ai"
                className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
              >
                kheelona.ai
              </a>{" "}
              is where partners and investors get the full story.
            </p>
          </Reveal>
        </Room>

        {/* The parent bridge: the platform answers to the family */}
        <Room fill="sun" id="parent-app" reveal="right">
          <Reveal>
            <SectionHeading
              eyebrow="For the grown-ups"
              title="Parents hold the keys."
              titleClassName="mb-3 max-w-[20ch]"
              lede="Every PlayOS friend answers to the same parent app. The deep dives live with the product."
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
          <Reveal className="flex flex-wrap gap-3">
            <Button href="/products/lumi" variant="ghost">
              Meet Lumi, the first friend
            </Button>
            <Button href="/safety" variant="ghost">
              Read how safety is built in
            </Button>
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
