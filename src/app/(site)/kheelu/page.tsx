import Image from "next/image";
import { MessagesSquare, BookOpen, Music } from "lucide-react";
import { ViewContentTracker } from "@/components/molecules/ViewContentTracker";
import { Button } from "@/components/atoms/Button";
import { ComparisonTable } from "@/components/organisms/ComparisonTable";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { KHEELU_ART } from "@/lib/kheelu-art";
import { KHEELU_FACTS } from "@/lib/product-facts";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  PRICE_CAPTION,
  LAUNCH_PRICE,
  FULL_PRICE,
  CAP_UNITS_TEXT,
  SHIP_DATE_TEXT,
  TOKEN_PRICE,
  BALANCE_PRICE,
  KHEELU_AGES,
} from "@/config/site";

export const metadata = pageMeta({
  /* Moved from /products/kheelu in the 2026-10 redesign (the old URL 308s
     here). The title is the brand sentence; the template appends the brand. */
  title: "Meet Kheelu: the talking toy that teaches, ages 3+",
  description:
    "A screen-free AI educational toy for ages 3+. Kheelu listens, answers, then asks the next question, slipping learning into play. ₹499 reserves yours at ₹4,999.",
  path: "/kheelu",
});

/* FAQ v2 (copy-v2): seed answers + the honest existing ship/payment answers.
   Subscription and camera questions are GATED (REV-b) and absent until the
   founder confirms the facts. */
const FAQ_ITEMS: FaqEntry[] = [
  { q: "Is Kheelu safe for my child?", a: "Kheelu wakes to a word, thinks on the device first, and answers from a closed library. There is a safety check on every reply, and you can read or delete anything. The five checks worth applying to any AI toy, including this one, are set out in our guide to choosing one." },
  /* V6 D4b (founder-licensed fact): mode-precise. */
  { q: "Does Kheelu need the internet?", a: "Only for open conversation: AI mode runs on your home WiFi. Story-mode stories and lessons work offline, and Bluetooth music needs only a paired phone. New content and updates download when you choose." },
  { q: "What languages does Kheelu speak?", a: "English, Hindi, Bengali, Telugu, Tamil, Kannada, Spanish, and French, with up to ten at launch. Kheelu switches mid-sentence, in the languages you speak at home." },
  /* SEO round 2026-08-12: the "5 6 year olds" keyword hangs off the family
     arc at the founder's direction — Kheelu's own band (3+ since 2026-08-23)
     covers it directly now, and the phrase also describes the published
     pipeline (Kheelu Speaker, ages 5+). */
  { q: "What ages is Kheelu for?", a: "Ages 3+. Kheelu meets your child where they are, and the family that follows brings learning toys for 5 and 6 year olds onward, growing right alongside." },
  /* SEO round 2026-08-12, founder decision: "best" lives in the parents'-voice
     QUESTION only — the answer makes no best claim, it says what to look for
     and where Kheelu fits. It also carries "AI educational toy" for this page. */
  { q: "What are the best learning toys for 3-year-olds?", a: "Look for a toy that answers back. At 3, children learn through back-and-forth conversation: questions, stories they can interrupt, words that build on yesterday's words. Kheelu is an AI educational toy built around exactly that loop, and it grows with your child from 3 up." },
  { q: "Can I read the conversations?", a: "Yes. The full log stays private to you, in the parent app." },
  { q: "Do you sell our data?", a: "No. Never sold, never used to sell your child anything. That is the whole point." },
  { q: "What if my child breaks it?", a: "Kheelu is built for small hands and rough days. Warranty details land closer to launch." },
  { q: "When will Kheelu ship?", a: `Shipping starts ${SHIP_DATE_TEXT}. Pre-orders are served first, in the order they were placed.` },
  { q: "How much does Kheelu cost?", a: `${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT}, and ${FULL_PRICE} once they are gone. A refundable ${TOKEN_PRICE} reserves yours, and the ${BALANCE_PRICE} balance is due only when it ships.` },
  /* CORRECTED 2026-09-05. This answer said "No. Reserving holds your price and
     your place, and it does not commit you to buy. You can leave the list
     anytime." That was true of the free Tally list and became false on
     2026-08-22, when the store started taking a real ₹499 through Razorpay. It
     shipped for two weeks as visible copy AND inside the FAQPage JSON-LD, so
     answer engines were being told the pre-order is free.
     The retired wording is pinned as banned in test/preorder-copy.test.ts. */
  { q: "Do I have to pay anything now?", a: `Yes. A refundable ${TOKEN_PRICE} reserves your Kheelu and holds the ${LAUNCH_PRICE} price. The ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship, and the ${TOKEN_PRICE} comes back in full if you ask before we dispatch.` },
  /* THE RENAME, ANSWERED IN VISIBLE COPY (2026-09-11, §8.36-a).
     Not housekeeping: a parent who met this product as Lumi in the Play Store,
     on LinkedIn or in a directory listing needs to know they are in the right
     place, and as of 2026-09-11 every one of those still says Lumi. It sits in
     the FAQ because FAQPage schema may only ever describe visible copy, and
     this is the answer an engine most needs to be able to quote. */
  { q: "Is Kheelu the same as Lumi?", a: "Yes. Kheelu is the same toy. It was called Lumi until September 2026, when it took the name of the character who narrates this site. Nothing else changed: same product, same price, same ship date. Older listings and articles still say Lumi, and they are describing this." },
  { q: "What is PlayOS?", a: "The platform Kheelu runs on. It gives each character a voice and a personality, and keeps every answer right for your child's age." },
  { q: "Can Kheelu play music?", a: "Yes. Pair a phone over Bluetooth and Kheelu becomes the speaker in the room, for your playlist, rhymes, or an audiobook. That is one of its three modes, alongside conversation and Story mode stories." },
  { q: "Does Kheelu need a subscription?", a: "Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Kheelu's smart features are yours for life, Kheelona+ pricing is announced soon, and nothing renews without you." },
  { q: "What is Kheelona+?", a: "The content and the controls: stories, lessons, language packs, and the parent app that shows you the learning. It is included free for the first 6 months with every Kheelu." },
  { q: "Why pre-order now?", a: `The price is ${LAUNCH_PRICE} for the ${CAP_UNITS_TEXT} and ${FULL_PRICE} once they are gone. The ${TOKEN_PRICE} you pay today is fully refundable until we ship.` },
  /* SEO round 2026-08-12, founder decision: the agency's gendered gift keyword
     is NEUTRALISED — the site says "your child" everywhere, so the phrase here
     is "a unique birthday gift", never "for daughter". "Unique" is grounded in
     one specific, published mechanism (it changes as the child grows), not
     puffery. */
  { q: "Is Kheelu a good birthday gift?", a: `It is a unique birthday gift in one specific way: it keeps changing. Kheelu learns your child's words and grows with them, so the toy at 5 is not the toy they unwrapped at 3. Reserving now holds the ${LAUNCH_PRICE} price.` },
];

const JSON_LD = pageGraph(
  KHEELU_PRODUCT,
  faqPage(FAQ_ITEMS),
  breadcrumbs([{ name: "Meet Kheelu", path: "/kheelu" }]),
);

/* Three ways to play, in the content doc's short lines (v7, incorporated
   2026-10-02). Each line restates a published fact: AI mode on home WiFi,
   Story mode offline, Bluetooth mode as a speaker. */
const WAYS = [
  { Icon: MessagesSquare, title: "Talk", body: "Your child asks anything. Kheelu answers and asks one back. Uses your home WiFi." },
  { Icon: BookOpen, title: "Stories", body: "Stories your child can interrupt and ask about. Work offline, on trains and in cars." },
  { Icon: Music, title: "Music", body: "Connect your phone over Bluetooth and play your own songs and rhymes." },
] as const;

/* The mockup's day, each line checked against what the site publishes:
   Story mode is offline, quiet hours exist, the log is readable. */
const MOMENTS = [
  { title: "While you cook", body: "Your child plays and talks with Kheelu instead of watching a screen." },
  { title: "After playschool", body: "They tell Kheelu about their day. You can read it later." },
  { title: "In the car or on a train", body: "Story-mode stories, no signal needed." },
  { title: "With grandparents", body: "Rhymes and stories in your family's language." },
  { title: "At bedtime", body: "One last story, then quiet hours switch Kheelu off." },
] as const;

export default function KheeluPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />
      {/* Meta ViewContent, the top of the advertising funnel (§8.30-j). Renders
          nothing, and no-ops entirely off the production hosts. */}
      <ViewContentTracker />

      <section className="kh-page-hero">
        <div className="kh-wrap kh-two">
          <div className="kh-stack">
            <span className="kh-kicker">Meet Kheelu</span>
            <h1 className="kh-h1">An AI toy that supports your child&apos;s brain development.</h1>
            <p className="kh-lead">
              Kheelu is a soft, screen-free rabbit. It answers your child&apos;s questions, tells
              stories and plays music, and helps their brain grow through conversation.
            </p>
            <div className="kh-cta-row">
              <Button href={PREORDER_HREF} track="product-top">
                {RESERVE_LABEL}
              </Button>
            </div>
            <p className="kh-note">{PRICE_CAPTION}</p>
          </div>
          <div className="flex h-[300px] items-center justify-center rounded-[22px] bg-blush min-[900px]:h-[380px]">
            <Image
              src={KHEELU_ART.src}
              alt={KHEELU_ART.alt}
              width={KHEELU_ART.width}
              height={KHEELU_ART.height}
              sizes="(max-width: 900px) 50vw, 300px"
              priority
              className="h-[86%] w-auto object-contain"
            />
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Three ways to play</h2>
          <div className="kh-grid3">
            {WAYS.map(({ Icon, title, body }) => (
              <div key={title} className="kh-card">
                <span className="kh-ic">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="kh-h3">{title}</h3>
                <p className="kh-body">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-two kh-top">
          <h2 className="kh-h2">When parents reach for Kheelu</h2>
          <ul>
            {MOMENTS.map((m) => (
              <li key={m.title} className="kh-moment">
                <div>
                  <b>{m.title}</b>
                  <span className="kh-body">{m.body}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What is free and what is paid, in the ONLY sanctioned Kheelona+
          wording (KHEELONA_PLUS_LINE): smart features for life, six months of
          Kheelona+ included, its price announced soon. The mockup's split
          (log and controls free forever) was a policy proposal, not policy. */}
      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">What&apos;s included, and what comes later</h2>
          <div className="kh-tbl" role="region" aria-label="What is included" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Kheelu&apos;s smart features</td>
                  <td className="kh-yes">Yours for life</td>
                </tr>
                <tr>
                  <td>Kheelona+: stories, lessons, languages and the parent app</td>
                  <td className="kh-yes">First 6 months included</td>
                </tr>
                <tr>
                  <td>Kheelona+ after six months</td>
                  <td>Pricing announced soon</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="kh-note">Nothing renews without you.</p>
        </div>
      </section>

      {/* One source for the spec (lib/product-facts.ts, §8.36): the same rows
          feed Product.additionalProperty. Pending rows say so in words. */}
      <section id="specs" className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Specs</h2>
          <dl className="kh-ptable">
            {KHEELU_FACTS.map((f) => (
              <div key={f.name} className="kh-prow max-[600px]:flex-col max-[600px]:gap-1">
                <dt>{f.name}</dt>
                <dd className="max-w-[60ch] font-medium min-[601px]:text-right">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">How Kheelu compares</h2>
            <p className="kh-lead">
              They all talk or play. This is how they differ for a child aged {KHEELU_AGES}.
            </p>
          </div>
          <ComparisonTable />
        </div>
      </section>

      <section id="faq" className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Questions about Kheelu</h2>
          <Faq items={FAQ_ITEMS} openFirst={false} />
        </div>
      </section>

      <FinaleCTA
        title="Reserve your Kheelu."
        line={`Fully refundable. Ships ${SHIP_DATE_TEXT}.`}
        track="product-foot"
      />
    </>
  );
}
