import type { Metadata } from "next";
import Image from "next/image";
import { LumiHero } from "@/components/product/LumiHero";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq, type FaqEntry } from "@/components/ui/Faq";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
import { PREORDER_HREF } from "@/lib/site";

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

/* Saturated feeling cards keep ink text: white fails WCAG on blue/teal/yellow,
   and a single text rule keeps the row coherent (design review). */
const FEELINGS_DEEP = [
  { name: "Curious", body: "Feeds the why. When your child asks, Lumi answers in words they understand, then wonders with them.", bg: "bg-blue", img: "curious" },
  { name: "Grumpy", body: "Takes the storm seriously. Lumi does not scold. It listens until the feeling has room to pass.", bg: "bg-orange", img: "grumpy" },
  { name: "Sad", body: "Stays close. Some days are heavy. Lumi sits in them with your child, gently.", bg: "bg-purple", img: "sad" },
  { name: "Silly", body: "Plays along. Rhymes, made-up words, giggle games. Laughing together is learning too.", bg: "bg-yellow", img: "silly" },
  { name: "Joy", body: "Celebrates out loud. Small wins feel big when a friend cheers.", bg: "bg-teal", img: "joy" },
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
      image: "https://kheelona.com/product/lumi-blue.png",
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
            <Eyebrow>The talking toy</Eyebrow>
            <h1 className="mb-5 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Meet Lumi. The friend who listens first.
            </h1>
            <p className="mb-7 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              A talking toy for children aged 3 to 6. It listens, answers, then
              asks the next question. No screen, ever.
            </p>
            <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
            <p className="mt-4 text-[15px] text-ink-muted">
              ₹9,999 after launch. No payment now. We hold the price, you hold
              your place.
            </p>
          </Reveal>
          <Reveal mode="rise" className="relative flex justify-center">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
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
            <h2 className="mb-4 max-w-[16ch] font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              What talking with Lumi sounds like.
            </h2>
            <p className="max-w-[52ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi answers, then asks. That back and forth is how children
              learn to think. A conversation with Lumi goes somewhere.
            </p>
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
                  <p className="text-[16.5px] text-ink">{m.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Five feelings, deeper (approved C-style bold block) */}
      <Section wash="cream">
        <CurveDivider from="white" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <Eyebrow>Meet the feelings</Eyebrow>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Five feelings. One growing brain.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi reads how your child feels and meets them there. That is
              what makes it a cognitive development toy: the learning starts
              with the heart.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEELINGS_DEEP.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.05}>
                <div className={`flex h-full flex-col rounded-(--radius-card-lg) p-6 ${f.bg}`}>
                  <Image
                    src={`/mascot/mascot-${f.img}.png`}
                    alt=""
                    width={180}
                    height={230}
                    className="mx-auto mb-4 h-[140px] w-auto object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]"
                  />
                  <h3 className="mb-2 font-display text-[26px] font-extrabold text-ink-head">
                    {f.name}
                  </h3>
                  <p className="text-[15px] leading-snug text-ink-head/85">{f.body}</p>
                </div>
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
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              You see everything. You decide everything.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              The parent app is your window into every conversation, and your
              hand on every dial.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {APP_FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="h-full rounded-(--radius-card) bg-white p-8">
                  <h3 className="mb-2 font-display text-[24px] font-extrabold text-ink-head">{f.title}</h3>
                  <p className="text-[16.5px]">{f.body}</p>
                </div>
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
            <h2 className="mb-6 font-display text-[clamp(28px,3vw,40px)] font-extrabold text-ink-head">
              What is in the box.
            </h2>
            <ul className="mb-8 space-y-4 text-[17px]">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-ink-head">✓</span>
                Lumi, ready to talk.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-ink-head">✓</span>
                A charger.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-ink-head">✓</span>
                A quick-start card. Day one takes minutes.
              </li>
            </ul>
            {/* TODO(claims-specs): full specs pending from founder. */}
            <p className="max-w-[62ch] text-[16.5px] text-ink-muted">
              We publish the full specs, battery, size, materials, and the wake
              word, before Lumi ships. Reserving now does not commit you to
              buy.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Price block (CMO review: the ₹4-a-day line was buried in the FAQ) */}
      <Section wash="sun">
        <CurveDivider from="white" />
        <Container className="py-14 text-center md:py-16">
          <Reveal>
            <h2 className="mx-auto mb-3 max-w-[20ch] font-display text-[clamp(30px,3.4vw,44px)] font-extrabold leading-[1.1] text-ink-head">
              ₹4,999 now. ₹9,999 after launch.
            </h2>
            <p className="mx-auto mb-7 max-w-[46ch] text-[clamp(18px,1.6vw,21px)]">
              Under ₹4 a day across ages 3 to 6. An educational toy priced like
              a habit, not a gadget.
            </p>
            <Button href={PREORDER_HREF}>Reserve Lumi at ₹4,999</Button>
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section wash="cream">
        <CurveDivider from="sun" />
        <Container className="py-16 md:py-20">
          <Reveal>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold text-ink-head">
              Questions parents ask.
            </h2>
            <p className="mb-10 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Honest answers, in plain words. Anything else, ask us anytime.
            </p>
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
