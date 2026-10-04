import Link from "next/link";
import { Room } from "@/components/atoms/Room";
import { RoomsTrack } from "@/components/atoms/RoomsTrack";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { StepList } from "@/components/molecules/StepList";
import { Card } from "@/components/molecules/Card";
import { Reveal } from "@/components/molecules/Reveal";
import { PageHero } from "@/components/templates/PageHero";
import { GrowthArc } from "@/components/organisms/GrowthArc";
import { FinaleCTA } from "@/components/organisms/FinaleCTA";
import { pageGraph, breadcrumbs, pageMeta, jsonLd } from "@/lib/seo";

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
  {
    title: "Again",
    body: "Your child answers back. Each turn helps build and strengthen the brain's connections for language and thinking.",
  },
] as const;

/* Both sources are already cited by the journal (lib/stories-expansion.ts).
   The Harvard line was checked against the page itself on 2026-10-04: it
   defines serve and return as exchanges "between a young child and a caring
   adult" and says they "play a key role in shaping brain architecture", so
   that is what this card says, adult included. The Romeo line is the
   journal's own published summary of the paper. */
const RESEARCH = [
  {
    source: "Harvard Center on the Developing Child",
    body: "Back-and-forth “serve and return” exchanges between a young child and a caring adult play a key role in shaping the architecture of the developing brain.",
    href: "https://developingchild.harvard.edu/key-concept/serve-and-return/",
  },
  {
    source: "Romeo and colleagues, Psychological Science, 2018",
    body: "In 36 children aged four to six, the number of conversational turns a child had with adults, not the number of words they overheard, tracked with activity in the brain's language region.",
    href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC5945324/",
  },
] as const;

/* The mockup's tips, in the site's voice. Its "Wait five seconds" became the
   journal's published advice to pause longer than feels natural: the number
   was the mockup's own, with no source behind it. */
const TIPS = [
  {
    title: "Narrate your day",
    body: "Talk through what you are doing while you cook, bathe or drive. “Now I am chopping the onions.”",
  },
  {
    title: "Ask open questions",
    body: "“What do you think will happen?” gets more thinking than a yes or no question.",
  },
  {
    title: "Wait a little longer",
    body: "After you ask, pause longer than feels natural. Young children need time to find the words.",
  },
] as const;

const LINK =
  "rounded font-semibold text-ink-head underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2";

/* /how, "How it helps" (CMO merge, 2026-10-04): the mockup's new page, on
   the room grammar. It is the honest half of the brain claim the rest of the
   site makes (founder decision 4, research-anchored): it says what the
   research found, and in so many words what it does NOT show, which is the
   sentence that keeps Home and the Kheelu page from overclaiming. The
   mockup's promise to publish pilot results "good or bad" was not carried: a
   public commitment nobody has signed. */
export default function HowPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(JSON_LD) }} />

      <PageHero>
        <SectionHeading
          as="h1"
          eyebrow="How it helps"
          title="How talking helps a young brain grow."
          titleClassName="mb-5 max-w-[18ch]"
          lede="A child's brain grows fastest in the years before school. In these years, everyday back-and-forth conversation does a lot of the work."
          ledeClassName="max-w-[58ch]"
        />
      </PageHero>

      <RoomsTrack>
        <Room fill="white" id="serve-and-return" reveal="left">
          <div className="grid gap-10 md:grid-cols-[1fr_1.2fr]">
            <Reveal>
              <SectionHeading
                title="What “serve and return” means."
                titleClassName="mb-4 max-w-[16ch]"
                lede="Parents do this naturally, but nobody can do it all day. Kheelu adds more of these turns when your hands are full."
                ledeClassName="max-w-[46ch]"
              />
            </Reveal>
            <StepList
              items={MOMENTS}
              columns="md:grid-cols-[60px_0.6fr_1.4fr]"
              rowClassName="items-start gap-4 py-6 md:gap-6"
            />
          </div>
        </Room>

        <Room fill="cream" id="research" reveal="right">
          <Reveal>
            <SectionHeading title="What the research says." titleClassName="mb-10" />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            {RESEARCH.map((r, i) => (
              <Reveal key={r.source} delay={i * 0.05}>
                <Card className="h-full border border-line bg-white p-7" tilt={false}>
                  <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.08em] text-orange-ink">
                    {r.source}
                  </p>
                  <p className="mb-5 text-[16.5px] leading-relaxed text-ink-head">{r.body}</p>
                  <a href={r.href} target="_blank" rel="noopener noreferrer" className={LINK}>
                    Read the source
                  </a>
                </Card>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-5">
            <Card className="border border-line bg-white p-7" tilt={false}>
              <h3 className="mb-2 font-display text-[20px] font-extrabold text-ink-head">
                What this research does not show
              </h3>
              <p className="max-w-[70ch] text-[16.5px] leading-relaxed text-ink-head">
                These studies are about children talking with people. We have not yet shown that
                talking with Kheelu has the same effect.
              </p>
            </Card>
          </Reveal>
          <Reveal className="mt-6">
            <p className="text-[16px] text-ink">
              The longer version, with every source:{" "}
              <Link href="/stories/how-children-learn-by-talking" className={LINK}>
                How children learn by talking
              </Link>
              .
            </p>
          </Reveal>
        </Room>

        <Room fill="white" id="no-toy-needed" reveal="left">
          <Reveal>
            <SectionHeading
              title="Three things that help, no toy needed."
              titleClassName="mb-3 max-w-[20ch]"
              lede="These work whether or not you ever buy Kheelu."
              ledeClassName="mb-10"
            />
          </Reveal>
          <StepList items={TIPS} />
        </Room>

        <Room fill="cool" id="where-kheelu-fits" reveal="right">
          <Reveal>
            <SectionHeading title="Where Kheelu fits." titleClassName="mb-10" />
          </Reveal>
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <Card
                className="h-full bg-white p-8"
                title="What it adds"
                titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
              >
                <p className="text-[16px]">
                  More conversation turns during the parts of the day when you cannot talk: cooking,
                  chores, the ride home.
                </p>
              </Card>
            </Reveal>
            <Reveal delay={0.05}>
              <Card
                className="h-full bg-white p-8"
                title="What it does not replace"
                titleClassName="mb-2 font-display text-[24px] font-extrabold text-ink-head"
              >
                <p className="text-[16px]">
                  You, teachers, grandparents, playmates or doctors. Kheelu is not a medical or
                  therapy device.
                </p>
              </Card>
            </Reveal>
          </div>
        </Room>

        <Room fill="cream" id="age-by-age" reveal="left">
          <Reveal>
            <SectionHeading title="Age by age." titleClassName="mb-10" />
          </Reveal>
          {/* The full published arc, without its tutor closing line: Home's
              how-it-works room carries that, and V6 keeps it to four places. */}
          <GrowthArc closing={false} />
        </Room>

        <Room fill="white" id="reserve" reveal="pop" className="overflow-x-clip">
          <FinaleCTA bare title="Give your child more conversations every day." share={false} />
        </Room>
      </RoomsTrack>
    </>
  );
}
