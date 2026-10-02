import Link from "next/link";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";
import { GROWTH_ARC } from "@/lib/growth-arc";
import { SHIP_DATE_TEXT } from "@/config/site";

export const metadata = pageMeta({
  title: "How Kheelu helps: serve and return, simply explained",
  description:
    "Young brains grow through back-and-forth conversation. What the research shows and does not, three things that help with no toy at all, and where Kheelu fits.",
  path: "/how",
});

const JSON_LD = pageGraph(breadcrumbs([{ name: "How it helps", path: "/how" }]));

const MOMENTS = [
  { title: "Serve", body: "Your child says something or asks a question." },
  { title: "Return", body: "Someone responds to what they said, instead of just talking at them." },
  { title: "Again", body: "Your child answers back. Each turn strengthens the brain's paths for language and thinking." },
] as const;

/* Both sources are already cited by the journal (lib/stories-expansion.ts),
   and the wording of the second follows the journal's own summary of the
   paper rather than the mockup's draft. */
const RESEARCH = [
  {
    source: "Harvard Center on the Developing Child",
    body: "Back-and-forth “serve and return” interactions help build the architecture of a young child's brain.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    source: "Romeo and colleagues, Psychological Science, 2018",
    body: "In 36 children aged four to six, the number of conversational turns a child had with adults, not the number of words they overheard, tracked with activity in the brain's language region.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
] as const;

const TIPS = [
  { title: "Narrate your day", body: "Talk through what you're doing while you cook, bathe or drive. “Now I'm chopping the onions.”" },
  { title: "Ask open questions", body: "“What do you think will happen?” gets more thinking than a yes or no question." },
  { title: "Wait five seconds", body: "After you ask, stay quiet. Young children need time to find the words." },
] as const;

export default function HowPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />

      <section className="kh-page-hero">
        <div className="kh-wrap">
          <div className="kh-stack max-w-[820px]">
          <span className="kh-kicker">How it helps</span>
          <h1 className="kh-h1">How talking helps a young brain grow.</h1>
          <p className="kh-lead">
            A child&apos;s brain grows fastest in the years before school. In these years, everyday
            back-and-forth conversation does a lot of the work.
          </p>
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-two kh-top">
          <div className="kh-stack">
            <h2 className="kh-h2">What &ldquo;serve and return&rdquo; means</h2>
            <p className="kh-lead">
              Parents do this naturally, but nobody can do it all day. Kheelu adds more of these
              turns when your hands are full.
            </p>
          </div>
          <ol>
            {MOMENTS.map((m, i) => (
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
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">What the research says</h2>
          <div className="kh-grid2">
            {RESEARCH.map((r) => (
              <div key={r.source} className="kh-card">
                <span className="kh-src">{r.source}</span>
                <p className="text-[16px] leading-[1.6] text-ink-head">{r.body}</p>
                <div>
                  <a href={r.href} className="kh-textlink" rel="noopener noreferrer">
                    Read the source
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="kh-card border-transparent bg-lav">
            <b className="text-[17px] text-ink-head">What this research does not show</b>
            <p className="text-[16px] leading-[1.6] text-ink-head">
              These studies are about children talking with people. We have not yet shown that
              talking with Kheelu has the same effect. That is what our pilot is measuring, and we
              will publish the results here, good or bad.
            </p>
          </div>
          <p className="kh-note">
            The longer version, with every source:{" "}
            <Link href="/stories/how-children-learn-by-talking" className="font-semibold underline underline-offset-4">
              How children learn by talking
            </Link>
            .
          </p>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <div className="kh-stack max-w-[720px]">
            <h2 className="kh-h2">Three things that help, no toy needed</h2>
            <p className="kh-lead">These work whether or not you ever buy Kheelu.</p>
          </div>
          <div className="kh-grid3">
            {TIPS.map((t, i) => (
              <div key={t.title} className="kh-card">
                <span className="kh-num" aria-hidden="true">
                  {i + 1}
                </span>
                <h3 className="kh-h3">{t.title}</h3>
                <p className="kh-body">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kh-sec">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Where Kheelu fits</h2>
          <div className="kh-grid2">
            <div className="kh-card">
              <h3 className="kh-h3">What it adds</h3>
              <p className="kh-body">
                More conversation turns during the parts of the day when you can&apos;t talk:
                cooking, chores, the ride home.
              </p>
            </div>
            <div className="kh-card">
              <h3 className="kh-h3">What it doesn&apos;t replace</h3>
              <p className="kh-body">
                You, teachers, grandparents, playmates or doctors. Kheelu is not a medical or
                therapy device.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="kh-sec kh-alt">
        <div className="kh-wrap kh-stack-l">
          <h2 className="kh-h2">Age by age</h2>
          <div className="kh-grid2">
            {GROWTH_ARC.map((s) => (
              <div key={s.kicker} className="kh-card">
                <span className="kh-kicker">{s.kicker}</span>
                <h3 className="kh-h3">{s.title}</h3>
                <p className="kh-body">{s.body}</p>
              </div>
            ))}
          </div>
          <p className="kh-note">Every child grows at their own pace, and Kheelu adjusts to your child&apos;s.</p>
        </div>
      </section>

      <FinaleCTA
        title="Give your child more conversations every day."
        line={`Fully refundable. Ships ${SHIP_DATE_TEXT}.`}
        share={false}
        track="how-foot"
      />
    </>
  );
}
