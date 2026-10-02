import Image from "next/image";
import Link from "next/link";
import {
  Check,
  MapPin,
  RotateCcw,
  MessageCircle,
  CalendarDays,
  Mic,
  WifiOff,
  MessageSquareText,
  ShieldCheck,
  ArrowRight,
  Play,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { VideoWall } from "@/components/organisms/VideoWall";
import { ParentQuotes } from "@/components/organisms/ParentQuotes";
import { AgeTabs } from "@/components/organisms/AgeTabs";
import { TwoReasons } from "@/components/organisms/TwoReasons";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { ViewContentTracker } from "@/components/molecules/ViewContentTracker";
import { pageGraph, faqPage, breadcrumbs, KHEELU_PRODUCT, pageMeta, jsonLd } from "@/lib/seo";
import { VIDEO_MOMENTS, hasVideoMoments, videoLede } from "@/lib/video-moments";
import { KHEELU_ART } from "@/lib/kheelu-art";
import { FOUNDERS } from "@/lib/team";
import {
  PREORDER_HREF,
  RESERVE_LABEL,
  PRICE_CAPTION,
  TOKEN_PRICE,
  BALANCE_PRICE,
  CAP_UNITS_TEXT,
  FULL_PRICE,
  LAUNCH_PRICE,
  SHIP_DATE_TEXT,
  KHEELU_AGES,
  KHEELU_LANGUAGES,
  KHEELONA_PLUS_LINE,
  TAX_LINE,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";

export const metadata = pageMeta({
  /* The bare title: the root layout's `%s · Kheelona` template adds the brand
     exactly once (route groups are metadata segments, 2026-09-05). */
  title: "Kheelu: the screen-free AI toy with a tutor inside, ages 3+",
  description:
    "Screens make children watch. Kheelu makes them think: a screen-free AI toy that answers, asks back, and grows with your child. ₹499 reserves yours at ₹4,999.",
  path: "/",
});

/* The mockup's six home questions, answered in the site's PUBLISHED words
   (redesign 2026-10). Two of the mockup's questions are not here because no
   published answer exists yet: whether Kheelu understands a 3-year-old first
   time (needs a pilot number) and whether a child's voice trains the model
   (needs the vendor terms read). They are in Technical-Todo.md. The full set
   lives on /faq. Every answer is visible, so FAQPage may describe it. */
const HOME_FAQ: FaqEntry[] = [
  {
    q: "What is Kheelu?",
    a: "Kheelu is a screen-free toy that talks with children aged 3 and up: your child speaks to it and it answers, tells stories, sings, and asks questions back. It is an interactive AI toy with no screen at all, it cannot reach the open internet, and every conversation is readable by you in the parent app.",
  },
  {
    q: "Is an AI toy safe for a small child?",
    a: "Not all of them are, and what makes a safe toy is how it is built. Kheelu wakes to a word and the microphone is off the rest of the time, the first thinking happens on the toy, answers come from a closed library rather than the open internet, and you can read or delete every conversation.",
  },
  {
    q: "Is there a subscription?",
    a: "Every Kheelu includes 6 months of Kheelona+, the stories, lessons, languages, and the parent app. Kheelu's smart features are yours for life, Kheelona+ pricing is announced soon, and nothing renews without you.",
  },
  {
    q: `Can I get my ${TOKEN_PRICE} back?`,
    a: `Yes, in full, any time before we dispatch your Kheelu. The ${BALANCE_PRICE} balance is due only when your Kheelu is ready to ship.`,
  },
  {
    q: "When does Kheelu ship?",
    a: `Shipping starts ${SHIP_DATE_TEXT}. Pre-ordering now holds the ${LAUNCH_PRICE} price and your place in line for a refundable ${TOKEN_PRICE}, and pre-orders are served first.`,
  },
  {
    q: "Does Kheelu need the internet to work?",
    a: "For open conversation, yes: AI mode runs on your home WiFi. For everything else, no: Story-mode stories and lessons play offline, and Bluetooth music needs only a paired phone.",
  },
];

const HOME_JSON_LD = pageGraph(KHEELU_PRODUCT, faqPage(HOME_FAQ), breadcrumbs([]));

const TICKS = [
  "No screen, ever",
  `${KHEELU_LANGUAGES.length} home languages`,
  "No open internet",
  "Parents see everything",
] as const;

const STEPS = [
  { title: "Your child asks", body: "Any question, in their own words.", eg: "“Why do I have to sleep?”" },
  { title: "Kheelu answers", body: "In simple words, pitched at their age.", eg: "“Your body fixes itself while you rest.”" },
  { title: "Kheelu asks back", body: "A question keeps them thinking and talking.", eg: "“What do you dream about?”" },
  /* The mockup's "Kheelu adapts" was flagged unconfirmed; this is the
     published step-2 wording from the how-it-works loop. */
  { title: "Kheelu remembers", body: "It keeps track of the words your child knows, what they love, and the pace they learn at." },
] as const;

/* Safety in four cards. The mockup's fourth ("never pretends to be alive")
   sits in copy that is still awaiting founder sign-off on /safety, so the
   published never-sold promise takes its place. */
const SAFETY = [
  { Icon: Mic, title: "It only listens when called", body: "The microphone turns on when your child says the wake word. The rest of the time it is off. Not muted. Off." },
  { Icon: WifiOff, title: "It can't go on the internet", body: "Kheelu cannot browse or search. No random videos, no endless detours, no strangers." },
  { Icon: MessageSquareText, title: "You can read every conversation", body: "Word for word, in the parent app. Delete anything with one tap." },
  { Icon: ShieldCheck, title: "Your child's voice is never sold", body: "Never sold, and never used to sell your child anything." },
] as const;

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(HOME_JSON_LD) }}
      />
      {/* Meta ViewContent on Home too (founder, 2026-10-02): since the
          redesign Home carries the product, the price and the reserve CTA,
          so a home visit is a product view. Same payload as /kheelu; it
          renders nothing and no-ops off the production hosts. Note for
          Ads Manager: ViewContent counts rise from this date, and are not
          comparable with the weeks before it. */}
      <ViewContentTracker />

      {/* Hero. The image owns LCP, so it is `priority` and nothing hides it. */}
      <section className="pb-9 pt-5 min-[900px]:pb-14 min-[900px]:pt-[60px]">
        <div className="kh-wrap grid gap-[22px] min-[900px]:grid-cols-[1fr_1.05fr] min-[900px]:items-center min-[900px]:gap-14">
          <div className="flex flex-col gap-[18px] min-[900px]:order-1">
            <span className="kh-pill">AI toy for growing minds · Ages {KHEELU_AGES}</span>
            <h1 className="kh-h1">Screens make children watch. Kheelu makes them think.</h1>
            <p className="kh-lead">
              Kheelu is a screen-free AI toy that answers your child&apos;s questions, asks one
              back, and helps their brain grow through real conversation.
            </p>
            <div className="kh-cta-row">
              <Button href={PREORDER_HREF} track="hero">
                {RESERVE_LABEL}
              </Button>
              {hasVideoMoments() ? (
                <Button href="#watch" variant="ghost">
                  <Play className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true" />
                  Watch a child meet Kheelu
                </Button>
              ) : null}
            </div>
            <p className="kh-note">{PRICE_CAPTION} Ships {SHIP_DATE_TEXT}.</p>
            <ul className="grid grid-cols-2 gap-2.5">
              {TICKS.map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-[14px] font-medium text-ink-head"
                >
                  <Check className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          {/* The mockup draws a photo of a child hugging Kheelu here. Until a
              consented still exists, the product art stands in on a warm tint
              (Technical-Todo.md). */}
          <figure className="relative m-0 -order-1 flex h-[250px] items-center justify-center overflow-hidden rounded-3xl bg-blush min-[900px]:order-2 min-[900px]:h-[520px]">
            <Image
              src={KHEELU_ART.src}
              alt={KHEELU_ART.alt}
              width={KHEELU_ART.width}
              height={KHEELU_ART.height}
              sizes="(max-width: 900px) 60vw, 440px"
              priority
              className="h-[88%] w-auto object-contain"
            />
          </figure>
        </div>
      </section>

      {/* Trust strip */}
      <div className="border-y border-line bg-surface">
        <ul className="kh-wrap grid grid-cols-2 gap-x-4 gap-y-1 py-3.5 min-[900px]:grid-cols-4 min-[900px]:py-4">
          <li className="flex min-h-11 items-center gap-2.5 text-[14px] font-semibold text-ink-head">
            <MapPin className="h-[18px] w-[18px] shrink-0 text-green" aria-hidden="true" />
            Team based in Bengaluru
          </li>
          <li className="flex min-h-11 items-center gap-2.5 text-[14px] font-semibold text-ink-head">
            <RotateCcw className="h-[18px] w-[18px] shrink-0 text-green" aria-hidden="true" />
            Refundable until we ship
          </li>
          <li>
            <a
              href={SUPPORT_WHATSAPP_HREF}
              className="flex min-h-11 items-center gap-2.5 text-[14px] font-semibold text-ink-head underline-offset-4 hover:underline"
            >
              <MessageCircle className="h-[18px] w-[18px] shrink-0 text-green" aria-hidden="true" />
              A real person on WhatsApp
            </a>
          </li>
          <li className="flex min-h-11 items-center gap-2.5 text-[14px] font-semibold text-ink-head">
            <CalendarDays className="h-[18px] w-[18px] shrink-0 text-green" aria-hidden="true" />
            Ships {SHIP_DATE_TEXT}
          </li>
        </ul>
      </div>

      {/* Real families on film (§8.37). Zero films renders nothing at all,
          heading included: a heading promising films above no films is a lie
          the page tells by itself (§8.37-d). */}
      {hasVideoMoments() ? (
        <section id="watch" className="kh-sec scroll-mt-20">
          <div className="kh-wrap kh-stack-l">
            <div className="kh-stack max-w-[720px]">
              <h2 className="kh-h2">Watch a child meet Kheelu.</h2>
              <p className="kh-lead">{videoLede()}</p>
            </div>
            <VideoWall moments={VIDEO_MOMENTS} />
          </div>
        </section>
      ) : null}

      <section id="parent-voices" className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">The first families are already talking.</h2>
            <p className="kh-lead">Words from parents in our pilot.</p>
          </div>
          <ParentQuotes />
        </div>
      </section>

      <section id="how-it-works" className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <span className="kh-kicker">How it works</span>
            <h2 className="kh-h2">How Kheelu helps the brain grow</h2>
            <p className="kh-lead">
              Scientists call it serve and return: your child speaks, someone answers, and your
              child answers back. Every turn builds the brain&apos;s connections for language and
              thinking. Kheelu adds more of these turns to your child&apos;s day.
            </p>
          </div>
          <ol className="grid gap-3.5 min-[900px]:grid-cols-4">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-2.5 rounded-[22px] bg-surface p-5">
                <span className="kh-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="kh-h3">{s.title}</h3>
                <p className="kh-body">{s.body}</p>
                {"eg" in s ? (
                  <p className="rounded-xl bg-soft px-3 py-2.5 text-[15px] italic leading-snug text-ink-head">
                    {s.eg}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <div className="kh-two kh-top">
            <div className="kh-stack">
              <h3 className="kh-h3">What it looks like at each age</h3>
              <AgeTabs />
            </div>
            <div className="kh-stack">
              <h3 className="kh-h3">Why conversation?</h3>
              <p className="kh-body">
                Harvard&apos;s Center on the Developing Child describes back-and-forth exchanges as
                a building block of early brain development. We explain what that research shows,
                and what it doesn&apos;t, on one page.
              </p>
              <div>
                <Button href="/how" variant="ghost" size="sm">
                  Read the science, simply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <span className="kh-kicker">Safety</span>
            <h2 className="kh-h2">Built for small children. Checked by you.</h2>
            <p className="kh-lead">
              Before anything else, here is exactly what Kheelu can and can&apos;t do.
            </p>
          </div>
          <div className="kh-grid2">
            {SAFETY.map(({ Icon, title, body }) => (
              <div key={title} className="kh-card">
                <span className="kh-ic">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="kh-h3">{title}</h3>
                <p className="kh-body">{body}</p>
              </div>
            ))}
          </div>
          <div className="kh-stack">
            <span className="text-[15px] font-bold text-ink-head">
              Where your child&apos;s voice goes
            </span>
            <div className="kh-path">
              <span className="kh-n">On the toy</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="kh-n">Our own servers, in your region</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
              <span className="kh-n">Your app</span>
            </div>
            <p className="kh-note">Never sold. Story mode works fully offline.</p>
          </div>
          <div>
            <Button href="/safety" variant="ghost">
              See exactly how safety works
            </Button>
          </div>
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <span className="kh-kicker">Two more reasons</span>
            <h2 className="kh-h2">Made for Indian homes. Made for parents.</h2>
          </div>
          <TwoReasons />
        </div>
      </section>

      <section id="price" className="kh-sec kh-alt">
        <div className="kh-wrap grid gap-7 min-[900px]:grid-cols-2 min-[900px]:items-start min-[900px]:gap-14">
          <div className="kh-stack">
            <h2 className="kh-h2">
              {TOKEN_PRICE} today. Nothing more until it ships.
            </h2>
            <dl className="kh-ptable">
              <div className="kh-prow">
                <dt>Launch price ({CAP_UNITS_TEXT})</dt>
                <dd>{LAUNCH_PRICE}</dd>
              </div>
              <div className="kh-prow">
                <dt>Pay today</dt>
                <dd>{TOKEN_PRICE}</dd>
              </div>
              <div className="kh-prow">
                <dt>Pay on dispatch</dt>
                <dd>{BALANCE_PRICE}</dd>
              </div>
              <div className="kh-prow">
                <dt>Once the first units are gone</dt>
                <dd>{FULL_PRICE}</dd>
              </div>
              <div className="kh-prow">
                <dt>Kheelona+</dt>
                <dd>6 months included</dd>
              </div>
            </dl>
            <p className="kh-note">{KHEELONA_PLUS_LINE}</p>
          </div>
          <div className="flex flex-col gap-[18px]">
            <p className="kh-promise">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>
                <b>Change your mind?</b> Get your {TOKEN_PRICE} back, in full, any time before we
                ship.
              </span>
            </p>
            <p className="kh-promise">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>
                <b>No extras at checkout.</b> Delivery is included anywhere in India. {TAX_LINE}
              </span>
            </p>
            <p className="kh-promise">
              <Check className="h-5 w-5" aria-hidden="true" />
              <span>
                <b>First in line.</b> Pre-orders are served first, in the order they were placed.
              </span>
            </p>
            <Button href={PREORDER_HREF} track="home-reserve" className="w-full">
              {RESERVE_LABEL}
            </Button>
            <p className="kh-note text-center">
              Reserving opens our store, where Razorpay takes the payment securely. It takes about
              a minute.
            </p>
          </div>
        </div>
      </section>

      <section id="team" className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">Made by parents in Bengaluru</h2>
            <p className="kh-lead">
              You&apos;re trusting us near your child, so here&apos;s who we are.
            </p>
          </div>
          <ul className="grid grid-cols-2 gap-4 min-[900px]:grid-cols-4 min-[900px]:gap-6">
            {FOUNDERS.map((f) => (
              <li key={f.id} className="flex flex-col gap-1.5">
                <Image
                  src={f.photo}
                  alt={f.name}
                  width={400}
                  height={400}
                  sizes="(max-width: 900px) 45vw, 260px"
                  className="h-[140px] w-full rounded-[18px] bg-soft object-cover min-[900px]:h-[220px]"
                />
                <b className="text-[16px] text-ink-head">{f.name}</b>
                <span className="text-[14px] leading-[1.45] text-ink-muted">{f.short}</span>
              </li>
            ))}
          </ul>
          <div className="kh-cta-row">
            <Button href={SUPPORT_WHATSAPP_HREF} variant="green">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Ask us on WhatsApp
            </Button>
            <Link href="/story" className="kh-textlink">
              Our story
            </Link>
          </div>
          <p className="text-[14px] leading-[1.6] text-ink-muted">
            Supported by NVIDIA Inception, nasscom, Karnataka Elevate and Founders Inc.
          </p>
        </div>
      </section>

      <section id="questions" className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Questions parents ask</h2>
          <Faq items={HOME_FAQ} />
          <div>
            <Link href="/faq" className="kh-textlink">
              See all questions
            </Link>
          </div>
        </div>
      </section>

      <FinaleCTA />
    </>
  );
}
