import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { CurveDivider } from "@/components/layout/CurveDivider";
import { Button } from "@/components/ui/Button";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Faq, type FaqEntry } from "@/components/ui/Faq";
import { MascotScene } from "@/components/mascot/MascotScene";
import { FinaleCTA } from "@/components/sections/home/FinaleCTA";
import { PREORDER_HREF } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lumi: the talking toy that holds a real conversation",
  description:
    "Lumi is a talking robot toy for children aged 3 to 6. Screen-free, in 10 home languages, with a parent app that shows you everything. Reserve at ₹4,999.",
  alternates: { canonical: "/products/lumi" },
};

/* Copy drafted per prompt §5.2 (voice rules §1.6, keywords: talking toys,
   robot toy, cognitive development toy for toddlers, developmental toys).
   Specs and charger details are PENDING (§1.9); never invent. */

const CONVERSATION = [
  { who: "child", text: "Lumi, why is the moon following us?" },
  { who: "lumi", text: "It looks that way, doesn't it? The moon is very far away. When you move, it seems to move with you. Where are you off to?" },
  { who: "child", text: "To grandma's house!" },
  { who: "lumi", text: "Lucky moon. It gets to come along. What will you do at grandma's?" },
] as const;

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
  { q: "What is Lumi?", a: "Lumi is a screen-free AI robot toy for children aged 3 to 6. It is a soft talking toy that holds a real conversation: it listens, answers, then asks the next question." },
  { q: "How is Lumi different from a phone or a tablet?", a: "There is no screen at all. Nothing to watch, nothing to scroll. Lumi is a voice your child talks with, built to reduce screen time, not add to it." },
  { q: "Which languages does Lumi speak?", a: "Ten languages. Lumi talks with your child in the languages you speak at home, and you choose which ones are on." },
  { q: "Is Lumi always listening?", a: "No. Lumi listens only after your child says the wake word. The microphone is off the rest of the time, and you can read or delete any conversation in the parent app." },
  { q: "Is Lumi safe for a 3 year old?", a: "Lumi is made for ages 3 to 6, inside and out. Every response passes through an age-graded safety layer. There is no open internet and no random content." },
  { q: "How much does Lumi cost?", a: "₹4,999 at launch if you reserve now. ₹9,999 after launch. You pay nothing today. We hold the price, you hold your place. Across ages 3 to 6, that is under ₹4 a day." },
  { q: "When will Lumi ship?", a: "We are finishing Lumi right now. Reserve today and you will be the first to know the ship date, and first in line when it arrives." },
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
          <Reveal>
            <Eyebrow color="text-orange-deep">The talking toy</Eyebrow>
            <h1 className="mb-5 font-display text-[clamp(38px,4.5vw,58px)] font-extrabold leading-[1.08] text-ink-head">
              Meet Lumi. The friend who listens first.
            </h1>
            <p className="mb-7 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              A talking toy for children aged 3 to 6. It listens, answers, then
              asks the next question. No screen, ever.
            </p>
            <Button href={PREORDER_HREF}>Reserve yours at ₹4,999</Button>
            <p className="mt-4 text-[15px] text-ink-muted">
              ₹9,999 after launch. No payment now. We hold the price, you hold
              your place.
            </p>
          </Reveal>
          <Reveal className="relative flex justify-center">
            <div
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70"
            />
            <Image
              src="/product/lumi-blue.png"
              alt="Lumi, a soft blue talking toy with a striped party hat"
              width={584}
              height={843}
              priority
              className="relative w-full max-w-[360px] drop-shadow-[0_20px_26px_rgba(41,160,215,0.2)]"
            />
          </Reveal>
        </Container>
      </Section>

      {/* Conversation demo */}
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
            <div className="flex flex-col gap-3 rounded-(--radius-card-lg) bg-cool p-7 md:p-9" role="log" aria-label="A sample conversation between a child and Lumi">
              {CONVERSATION.map((m, i) => (
                <p
                  key={i}
                  className={
                    m.who === "child"
                      ? "max-w-[85%] self-start rounded-2xl rounded-bl-md bg-white px-5 py-3 text-[16.5px]"
                      : "max-w-[85%] self-end rounded-2xl rounded-br-md bg-blue px-5 py-3 text-[16.5px] text-white"
                  }
                >
                  {m.text}
                </p>
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
            <Eyebrow color="text-orange-deep">Meet the feelings</Eyebrow>
            <h2 className="mb-3 font-display text-[clamp(32px,4vw,50px)] font-extrabold leading-[1.08] text-ink-head">
              Five feelings. One growing brain.
            </h2>
            <p className="mb-11 max-w-[58ch] text-[clamp(18px,1.6vw,21px)]">
              Lumi reads how your child feels and meets them there. That is
              what makes the talking work: a cognitive development toy that
              starts with the heart.
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {FEELINGS_DEEP.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.05}>
                <div className={`flex h-full flex-col rounded-(--radius-card-lg) p-6 ${f.bg} ${f.bg === "bg-yellow" ? "text-ink-head" : "text-white"}`}>
                  <Image
                    src={`/mascot/mascot-${f.img}.png`}
                    alt=""
                    width={180}
                    height={230}
                    className="mx-auto mb-4 h-[140px] w-auto object-contain drop-shadow-[0_14px_18px_rgba(0,0,0,0.18)]"
                  />
                  <h3 className="mb-2 font-display text-[26px] font-extrabold">{f.name}</h3>
                  <p className={`text-[15px] leading-snug ${f.bg === "bg-yellow" ? "text-[#3D2A10]" : "text-white/92"}`}>
                    {f.body}
                  </p>
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

      {/* In the box + specs (PENDING) */}
      <Section wash="white">
        <CurveDivider from="cool" />
        <Container className="grid gap-10 py-16 md:grid-cols-2 md:py-20">
          <Reveal>
            <h2 className="mb-6 font-display text-[clamp(28px,3vw,40px)] font-extrabold text-ink-head">
              What is in the box.
            </h2>
            <ul className="space-y-4 text-[17px]">
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-teal">✓</span>
                Lumi, ready to talk.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-teal">✓</span>
                A charger.
              </li>
              <li className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-teal/15 text-teal">✓</span>
                A quick-start card. Day one takes minutes.
              </li>
            </ul>
          </Reveal>
          <Reveal delay={0.08}>
            {/* TODO(claims-specs): battery life, dimensions, materials, wake word
                pending from founder. Rendered as honest "coming soon", never invented. */}
            <div className="h-full rounded-(--radius-card) bg-cream p-8">
              <h3 className="mb-4 font-display text-[24px] font-extrabold text-ink-head">
                The practical details
              </h3>
              <dl className="space-y-3 text-[16px]">
                {["Battery life", "Size and weight", "Materials", "The wake word"].map((k) => (
                  <div key={k} className="flex items-center justify-between gap-4 border-b border-line-soft pb-3 last:border-0">
                    <dt className="font-semibold text-ink-head">{k}</dt>
                    <dd className="text-ink-muted">Final specs coming soon</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Safety strip (short, links to /safety) */}
      <Section wash="teal">
        <Container className="grid items-center gap-8 py-14 md:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            <h2 className="mb-4 max-w-[20ch] font-display text-[clamp(28px,3vw,40px)] font-extrabold leading-[1.1] text-white">
              Safe in their hands. Careful with their words.
            </h2>
            <p className="mb-6 max-w-[56ch] text-[17px] text-white/95">
              Wake-word listening, an age-graded safety layer, no open
              internet, and a parent who sees everything. Safety is not a
              feature of Lumi. It is the whole product.
            </p>
            <Button href="/safety" variant="teal">Read how we built safety in</Button>
          </Reveal>
          <Reveal className="hidden justify-center md:flex">
            <MascotScene pose="bliss" width={220} parallax={24} />
          </Reveal>
        </Container>
      </Section>

      {/* FAQ */}
      <Section wash="cream">
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

      <FinaleCTA />
    </>
  );
}
