import { Mic, WifiOff, ShieldCheck, MessageSquareText, MessageCircle } from "lucide-react";
import { Button } from "@/components/atoms/Button";
import { Faq, type FaqEntry } from "@/components/molecules/Faq";
import { pageGraph, faqPage, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { SUPPORT_WHATSAPP_HREF } from "@/config/site";

export const metadata = pageMeta({
  title: "Are AI toys safe? How Kheelu is built to be",
  description:
    "How Kheelu answers the questions the AI-toy investigations raised: wake-word mic, on-device thinking, no open internet, and a parent app that shows every word.",
  path: "/safety",
});

/* Redesign 2026-10: the mockup's safety page, built only from mechanisms
   this page already published. Three of the mockup's blocks are absent on
   purpose, each because no published fact backs it yet: how Kheelu handles a
   mumbled question, how it answers a "big" question, and an independent
   test. The "a toy, not a person" answer stays out too; it was drafted and
   never signed off. All four are listed in Technical-Todo.md. */

/* Status-honest (§1.9): never upgrade a status here (claims gate). */
const STANDARDS = [
  { name: "Toy-safety certification", status: "In progress" },
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

/* The questions, in plain words. They live in one place because the FAQPage
   graph below must mirror the visible copy exactly, and all of it renders. */
const ANSWERS = {
  flagship: {
    q: "Are AI toys safe for children?",
    /* V5-3: 85 words → 57. This is the page's primary citable answer and answer
       engines quote 40 to 60 words, so length was costing us the citation. The
       independent-testing context moved into the page body where it belongs; the
       mechanisms and the closing challenge — the strongest line here — stay. */
    a: "Not all of them, and the difference is in the mechanisms. Kheelu's mic wakes to a word and is off otherwise. The first thinking happens on the device. Replies come from a closed library, never the open internet. Every conversation is readable and deletable by you. You do not have to trust a badge. You can check.",
  },
  listening: {
    q: "Is Kheelu always listening?",
    a: "No. Kheelu listens only after your child says the wake word. The rest of the time the microphone is off, not muted. Off. Nothing is recorded before the wake word, and every conversation after it is readable in the parent app, where you can delete any of it.",
  },
  voice: {
    q: "Where does my child's voice go?",
    a: "Almost nowhere. The first thinking happens on the toy. What travels goes to Kheelona's own voice brain, stays in your region, and is never sold. Nothing is collected without your consent, and any conversation can be deleted in one tap from the parent app.",
  },
  wrong: {
    q: "Could Kheelu say something wrong?",
    a: "Every reply passes an age-graded safety layer before it is spoken, on the device and in the cloud, and Kheelu cannot reach the open internet to find something it should not. We attack our own safety layer before every release. If something still slips, one tap from you stops everything.",
  },
  delete: {
    q: "Can I delete everything?",
    a: "Yes. The parent app holds the full conversation log, word for word, and any conversation goes with one tap. The log is private to you, it is never used to sell your child anything, and your child's voice data is never sold. Nothing is kept that you cannot delete.",
  },
} as const;

const SAFETY_FAQ: FaqEntry[] = [
  /* V6 D7: the old first entry near-duplicated the flagship AnswerBlock (the
     padding §8.23-4 warns against). Replaced with the dependence anxiety no
     page answered — built entirely from published facts. */
  { q: "Will Kheelu replace time with me?", a: "No, and it is not built to. Kheelu is for the moments your hands are full, not the ones they are not. The parent app gives you one simple thing to do together each day, quiet hours are yours to set, and the grown-up holds the keys, always." },
  { q: "Does Kheelu reduce screen time?", a: "That is the point. Kheelu has no screen at all. It is a toy that helps you cut screen time: your child talks, listens, and imagines instead of watching." },
  { q: "Can Kheelu reach the open internet?", a: "No. Kheelu cannot browse or search. Answers come from a closed library built for children, so there are no random videos, no endless detours, and no strangers." },
  /* SEO round 2026-08-12: the checklist restates the published what-to-look-for
     criteria (the journal's safe-AI-toy piece and the ANSWERS mechanisms above)
     — nothing here is a new claim. Carries "smart toys for toddlers" and
     "educational toys for kids" in one parents'-voice entry. */
  { q: "What should I look for in smart toys for toddlers?", a: "Five things: a microphone that sleeps until a wake word, answers from a closed library instead of the open internet, a conversation log you can read, voice data that stays in your region and is never sold, and replies graded for the age. The same checklist works for educational toys for kids at any age." },
  /* Status-exact, never upgraded: mirrors the STANDARDS chips above. */
  /* The standards FAQ entry was REMOVED 2026-07-31 (founder: no certificate
     received yet, keep it off the FAQ; the status-honest standards room below
     stays). Reinstate when the first certificate lands. */
];

const ALL_QUESTIONS: FaqEntry[] = [
  ...Object.values(ANSWERS).map((x) => ({ q: x.q, a: x.a })),
  ...SAFETY_FAQ,
];

const SAFETY_JSON_LD = pageGraph(
  faqPage(ALL_QUESTIONS),
  breadcrumbs([{ name: "Safety", path: "/safety" }]),
);

const RULES = [
  { Icon: Mic, title: "It only listens when called", body: "Kheelu listens only after your child says the wake word. The rest of the time, the microphone is off. Not muted. Off." },
  { Icon: WifiOff, title: "It can't go on the internet", body: "Kheelu cannot browse, search, or stumble. No random videos, no endless detours, no strangers. Ever." },
  { Icon: ShieldCheck, title: "Answers are checked for age", body: "Replies pass through a safety layer tuned to your child's age before Kheelu speaks. On-device and cloud filters work together." },
  { Icon: MessageSquareText, title: "You can read everything", body: "Every conversation is in the parent app, word for word. Delete anything with one tap." },
] as const;

const VOICE_PATH = [
  { title: "On the toy", body: "Kheelu hears the wake word, and the first safety checks happen on the toy itself, before anything travels anywhere." },
  { title: "Our own servers, in your region", body: "Open conversation uses your home WiFi and Kheelona's own voice brain. Your family's conversations stay in your region." },
  { title: "Back to you", body: "The conversation appears in your app. It is never sold, and never used to sell your child anything." },
] as const;

export default function SafetyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SAFETY_JSON_LD) }}
      />

      <section className="kh-page-hero">
        <div className="kh-wrap">
          <div className="kh-stack max-w-[820px]">
          <span className="kh-kicker">Safety</span>
          <h1 className="kh-h1">Built for small children. Checked by you.</h1>
          <p className="kh-lead">
            You&apos;re trusting a talking toy near your child. Here is exactly what Kheelu does
            and doesn&apos;t do, in plain words.
          </p>
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-grid2">
          {RULES.map(({ Icon, title, body }) => (
            <div key={title} className="kh-card">
              <span className="kh-ic">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="kh-h3">{title}</h2>
              <p className="kh-body">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-two kh-top">
          <h2 className="kh-h2">Where your child&apos;s voice goes</h2>
          <div>
            <ol>
              {VOICE_PATH.map((m, i) => (
                <li key={m.title} className="kh-moment">
                  <span className="kh-num" aria-hidden="true">
                    {i + 1}
                  </span>
                  <div>
                    <b>{m.title}</b>
                    <span className="kh-body">{m.body}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="kh-note mt-2">
              Nothing leaves without consent. Nothing stays that you cannot delete.
            </p>
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">Certificates: what&apos;s done and what&apos;s next</h2>
            <p className="kh-lead">
              We are completing formal toy-safety testing now. No badge appears here before it is
              earned.
            </p>
          </div>
          <div className="kh-tbl" role="region" aria-label="Certificates" tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">Standard</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {STANDARDS.map((s) => (
                  <tr key={s.name}>
                    <td>{s.name}</td>
                    <td>
                      <span
                        className={`kh-status ${s.status === "In progress" ? "kh-st-prog" : "kh-st-plan"}`}
                      >
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-two kh-top">
          <h2 className="kh-h2">What if Kheelona ever shuts down?</h2>
          <div className="kh-stack">
            <p className="kh-lead">We plan to be here for years. But you deserve a straight answer.</p>
            <p className="kh-body">
              Story-mode stories and lessons play offline, and Bluetooth music needs only a paired
              phone.
            </p>
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">The parent holds the keys</h2>
            <p className="kh-lead">
              Kheelu never decides what is right for your family. You do.
            </p>
          </div>
          <div className="kh-grid2">
            {PARENT_KEYS.map((k) => {
              const [title, ...rest] = k.split(": ");
              return (
                <div key={k} className="kh-card">
                  <h3 className="kh-h3">{title}</h3>
                  <p className="kh-body">
                    {rest.join(": ").replace(/^./, (c) => c.toUpperCase())}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="questions" className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">The questions we would ask too</h2>
          <Faq items={ALL_QUESTIONS} name="safety-faq" />
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap">
          <div className="kh-final">
            <h2 className="kh-h2">Still have a safety question?</h2>
            <p className="text-[17px]">A real person answers, on WhatsApp.</p>
            <Button href={SUPPORT_WHATSAPP_HREF} variant="onDark">
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Ask us on WhatsApp
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
