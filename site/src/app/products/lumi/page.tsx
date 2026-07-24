import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LumiHero } from "./_components/LumiHero";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Button } from "@/components/atoms/Button";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { Card } from "@/components/molecules/Card";
import { StepList } from "@/components/molecules/StepList";
import { CheckList } from "@/components/molecules/CheckList";
import { Reveal } from "@/components/molecules/Reveal";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { KheeluSays } from "@/components/molecules/KheeluSays";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION, LAUNCH_PRICE, LATER_PRICE } from "@/config/site";

export const metadata: Metadata = {
  title: "Lumi: the talking toy that holds a real conversation",
  description:
    "Lumi is a talking robot toy for children aged 3 to 6. Screen-free, in 10 home languages, with a parent app that shows you everything. Reserve at ₹4,999.",
  alternates: { canonical: "/products/lumi" },
};

/* Copy drafted per prompt §5.2 and revised after the independent copy review
   (voice rules §1.6; keywords: talking toys, robot toy, educational toys,
   cognitive development toy for toddlers, voice toy for kids in multiple
   languages). Specs and charger details are PENDING (§1.9); never invent. */

const CONVERSATION = [
  { who: "Your child", text: "Lumi, why is the moon following us?" },
  { who: "Lumi", text: "It looks that way, doesn't it? The moon is very far away. When you move, it seems to move with you. Where are you off to?" },
  { who: "Your child", text: "To grandma's house!" },
  { who: "Lumi", text: "Lucky moon. It gets to come along. What will you do at grandma's?" },
] as const;

/* R5: the sanctioned 15%-alpha tints (design-system decorative recipe, same
   as the team cards) instead of saturated fills — light surfaces carry ink
   text legally, and the row stops shouting next to the calm ambient sky. */
const FEELINGS_DEEP = [
  { name: "Curious", body: "Feeds the why. When your child asks, Lumi answers in words they understand, then wonders with them.", bg: "bg-blue/15", img: "curious" },
  { name: "Grumpy", body: "Takes the storm seriously. Lumi does not scold. It listens until the feeling has room to pass.", bg: "bg-orange/15", img: "grumpy" },
  // R9 re-map (with Home): the serene render reads "stays close"; the old
  // scared pose read panic
  { name: "Sad", body: "Stays close. Some days are heavy. Lumi sits in them with your child, gently.", bg: "bg-purple/15", img: "bliss" },
  { name: "Silly", body: "Plays along. Rhymes, made-up words, giggle games. Laughing together is learning too.", bg: "bg-yellow/15", img: "silly" },
  { name: "Joy", body: "Celebrates out loud. Small wins feel big when a friend cheers.", bg: "bg-teal/15", img: "joy" },
] as const;

/* R11 (founder): the "how it works" steps moved here from /playos — they
   explain the conversation demo directly above them. PlayOS keeps the
   deeper end-to-end technical path. Copy verbatim from the old /playos
   section (drafted per prompt §5.2). */
const HOW_IT_ANSWERS = [
  { n: "01", title: "Your child says the wake word.", body: "Until then, the microphone is off. Lumi starts listening only when it is invited to.", color: "text-blue" },
  { n: "02", title: "The device thinks first.", body: "Speech is processed on the toy before anything goes anywhere. Low latency. No long waits. No sending everything to a distant server.", color: "text-teal" },
  { n: "03", title: "The feeling gets read.", body: "PlayOS hears more than words. Curious, Grumpy, Sad, Silly, Joy: the answer meets the mood.", color: "text-purple" },
  { n: "04", title: "The right response comes back.", body: "Every reply passes through an age-graded safety layer before it is spoken. On-device and cloud filters work together. No open internet. No surprises.", color: "text-orange-deep" },
] as const;

const APP_FEATURES = [
  { title: "A daily summary", body: "One card each evening. What your child talked about, what made them laugh, what they asked." },
  { title: "The full conversation log", body: "Every conversation, word for word. Read it anytime. Delete any of it with one tap." },
  { title: "Topic controls", body: "You choose what is open and what waits. Dinosaurs today, tricky questions when you are ready." },
  { title: "Time and languages", body: "Set quiet hours. Pick the languages you speak at home. Lumi follows your lead." },
] as const;

const FAQ_ITEMS: FaqEntry[] = [
  { q: "What is Lumi?", a: "Lumi is a screen-free AI robot toy for children aged 3 to 6. It is a talking toy that holds a real conversation: it listens, answers, then asks the next question." },
  { q: "How is Lumi different from a phone or a tablet?", a: "There is no screen at all. Nothing to watch, nothing to scroll. Lumi is a voice your child talks with, built to reduce screen time, not add to it." },
  { q: "Which languages does Lumi speak?", a: "Ten languages. Lumi is a voice toy that talks with your child in the languages you speak at home, and you choose which ones are on." },
  { q: "Is Lumi always listening?", a: "No. Lumi listens only after your child says the wake word. The microphone is off the rest of the time, and you can read or delete any conversation in the parent app." },
  { q: "Is Lumi safe for a 3 year old?", a: "Lumi is made for ages 3 to 6, inside and out. Every response passes through an age-graded safety layer. There is no open internet and no random content." },
  { q: "How much does Lumi cost?", a: "₹4,999 at launch if you reserve now. ₹9,999 after launch. You pay nothing today. We hold the price, you hold your place. Across ages 3 to 6, that is under ₹4 a day." },
  { q: "Do I have to pay anything now?", a: "No. Reserving holds your price and your place, and it does not commit you to buy. You can leave the list anytime." },
  { q: "When will Lumi ship?", a: "We have not announced a ship date yet. We are finishing Lumi now, and we will not rush it. Everyone on the list hears the date first, and gets Lumi first." },
  { q: "Does Lumi need Wi-Fi?", a: "Lumi thinks on the device first, and its cloud safety filters work behind it. We will publish full connectivity details before Lumi ships." },
  { q: "What does the parent app show me?", a: "Everything. A daily summary, the full conversation log, and complete control over topics, time, and languages." },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Product",
      name: "Lumi",
      brand: { "@type": "Brand", name: "Kheelona" },
      description:
        "A screen-free AI robot toy for children aged 3 to 6 that holds a real conversation in 10 home languages, with a parent app that shows you everything.",
      image: "https://kheelona.com/product/lumi-blue-2.png",
      offers: {
        "@type": "Offer",
        price: "4999",
        priceCurrency: "INR",
        availability: "https://schema.org/PreOrder",
        url: "https://kheelona.com/products/lumi",
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function LumiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero */}
      <Section wash="cream">
        <Container className="grid items-center gap-10 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <Reveal mode="rise">
            <KheeluSays
              line="This is Lumi. I picked the colours myself."
              pose="hero-wink"
            />
            <SectionHeading
              as="h1"
              eyebrow="The talking toy"
              title="Meet Lumi. The friend who listens first."
              titleClassName="mb-5"
              lede="A talking toy for children aged 3 to 6. It listens, answers, then asks the next question. No screen, ever."
              ledeClassName="mb-7 max-w-[58ch]"
            />
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
            {/* R9 trim: the full reassurance line lives at the Home hero and
                finale only (reviewer: ×5 verbatim repeats) */}
            <p className="mt-4 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
          </Reveal>
          <Reveal mode="rise" className="relative flex justify-center">
            {/* soft radial halo instead of a hard-edged disc: the plush sat
                on the circle like an unblended sticker (design panel
                2026-07-10) */}
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.85)_0%,rgba(255,255,255,0.5)_55%,transparent_72%)]"
            />
            <LumiHero className="relative h-[440px] w-full max-w-[420px] md:h-[520px]" />
          </Reveal>
        </Container>
      </Section>

      {/* Conversation demo: storybook dialogue cards (ink text, WCAG-safe) */}
      <Section wash="white">
        <CurveDivider from="cream" />
        <Container className="grid items-center gap-12 py-16 md:grid-cols-[1fr_1.1fr] md:py-20">
          <Reveal>
            <SectionHeading
              title="What talking with Lumi sounds like."
              titleClassName="mb-4 max-w-[16ch]"
              lede="Lumi answers, then asks. That back and forth is how children learn to think. A conversation with Lumi goes somewhere."
              ledeClassName="max-w-[52ch]"
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div
              className="flex flex-col gap-3 rounded-(--radius-card-lg) bg-cool p-7 md:p-9"
              role="log"
              aria-label="A sample conversation between a child and Lumi"
            >
              {CONVERSATION.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[88%] rounded-2xl px-5 py-4 ${m.who === "Lumi" ? "self-end bg-white" : "self-start bg-cream"}`}
                >
                  <p className="mb-1 text-[12px] font-bold uppercase tracking-wider text-ink-muted">
                    {m.who}
                  </p>
                  <p className="text-[16px] text-ink">{m.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* R11: how that answer happens — the steps that explain the demo
          above (moved from /playos, founder direction) */}
      <Section wash="white">
        <Container className="pb-16 pt-2 md:pb-20">
          <Reveal>
            <SectionHeading
              title="From question to answer, in four steps."
              titleClassName="mb-3 max-w-[20ch]"
              lede="Every conversation walks the same guarded path."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <StepList items={HOW_IT_ANSWERS} />
          <Reveal className="mt-8">
            <p className="text-[16px] text-ink-muted">
              The technology behind the talking lives on the{" "}
              <Link href="/playos" className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2">
                PlayOS page
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Five feelings, deeper (approved C-style bold block) */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              eyebrow="Meet the feelings"
              title="Five feelings. One growing brain."
              titleClassName="mb-3"
              lede="Lumi reads how your child feels and meets them there. That is what makes it a cognitive development toy: the learning starts with the heart."
              ledeClassName="mb-11 max-w-[58ch]"
            />
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEELINGS_DEEP.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.05}>
                <Card className={`flex flex-col rounded-(--radius-card-lg) border border-line-soft p-6 ${f.bg}`}>
                  <Image
                    src={`/mascot/mascot-${f.img}.png`}
                    alt=""
                    width={180}
                    height={230}
                    className="mx-auto mb-4 h-[140px] w-auto object-contain"
                  />
                  <h3 className="mb-2 font-display text-[26px] font-extrabold text-ink-head">
                    {f.name}
                  </h3>
                  <p className="text-[15px] leading-snug text-ink-head/85">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* Parent app */}
      <Section wash="cool">
        <CurveDivider from="cream" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="You see everything. You decide everything."
              titleClassName="mb-3"
            />
            {/* R7 lead line adapted from kheelona.ai/lumi; R9: display, not
                serif (bold at 20px+ is WCAG-large, orange-deep passes 3:1) */}
            <p className="mb-3 max-w-[58ch] font-display text-[clamp(20px,2vw,24px)] font-bold text-orange-deep">
              They think they are playing. The app shows you they are growing.
            </p>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              The parent app is your window into every conversation, and your
              hand on every dial: new words, how long you talked, what made
              them laugh.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {APP_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <Card
                  className="p-8"
                  title={f.title}
                  titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
                >
                  <p className="text-[16px]">{f.body}</p>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* In the box (specs honestly deferred, one sentence instead of a wall) */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              level="minor"
              title="What is in the box."
              titleClassName="mb-6"
            />
            <CheckList
              className="mb-8"
              items={[
                "Lumi, ready to talk.",
                "A charger.",
                "A quick-start card. Day one takes minutes.",
              ]}
            />
            {/* TODO(claims-specs): full specs pending from founder. */}
            <p className="max-w-[62ch] text-[16.5px] text-ink-muted">
              We publish the full specs, battery, size, materials, and the wake
              word, before Lumi ships. Reserving now does not commit you to
              buy.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* R7: real early-tester quotes (shared section).
          R11 audit fix: from="white" — the section above is WHITE ("in the
          box"); the old from="cool" painted a visible tinted seam */}
      <ParentQuotes from="white" count={2} eyebrow="From the pilot" title="The first families are already talking." />

      {/* Price block (CMO review: the ₹4-a-day line was buried in the FAQ) */}
      <Section wash="sun">
        <CurveDivider from="white" />
        <Container className="py-14 md:py-16">
          <Reveal>
            <SectionHeading
              level="minor"
              title={`${LAUNCH_PRICE} now. ${LATER_PRICE} after launch.`}
              titleClassName="mb-3 max-w-[20ch]"
              lede="Under ₹4 a day across ages 3 to 6. An educational toy priced like a habit, not a gadget."
              ledeClassName="mb-7 max-w-[46ch]"
            />
            <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section wash="cream">
        <CurveDivider from="sun" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <SectionHeading
              title="Questions parents ask."
              titleClassName="mb-3"
              lede="Honest answers, in plain words. Anything else, ask us anytime."
              ledeClassName="mb-10 max-w-[58ch]"
            />
          </Reveal>
          <Reveal className="mx-auto max-w-[820px]">
            <Faq items={FAQ_ITEMS} />
          </Reveal>
        </Container>
      </Section>

      <FinaleCTA variant="full" from="cream" />
    </>
  );
}
