import { Button } from "@/components/atoms/Button";
import { TextLink } from "@/components/molecules/TextLink";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { StepList, type Step } from "@/components/molecules/StepList";
import { AgeTabs } from "./AgeTabs";
import { GROWTH_CLOSING } from "@/lib/growth-arc";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION } from "@/config/site";

/** The mockup's four steps (CMO merge, 2026-10-04), each with the sample line
 *  the mockup drew under it. The mockup's fourth step, "Kheelu adapts", was
 *  flagged unconfirmed, so step four is the PUBLISHED "Kheelu remembers"
 *  wording from the retired how-it-works loop. */
export const HOW_STEPS: readonly Step[] = [
  {
    title: "Your child asks",
    body: "Any question, in their own words. “Why do I have to sleep?”",
  },
  {
    title: "Kheelu answers",
    body: "In simple words, pitched at their age. “Your body fixes itself while you rest.”",
  },
  {
    title: "Kheelu asks back",
    body: "A question keeps them thinking and talking. “What do you dream about?”",
  },
  {
    title: "Kheelu remembers",
    body: "It keeps track of the words your child knows, what they love, and the pace they learn at.",
  },
];

/** Research-anchored (founder decision 4, 2026-10-04): the TURNS are what the
 *  research links to a growing brain, and Kheelu adds turns. The /how page
 *  says plainly that nobody has yet shown Kheelu has the same effect, so this
 *  copy must never claim it does. */
export const HOW_LEDE =
  "Scientists call it serve and return: your child speaks, someone answers, and your child answers back. Research links these turns to how language and thinking grow. Kheelu adds more of them to your child's day.";

/** The Harvard line, checked against the cited page on 2026-10-04
 *  (developingchild.harvard.edu/key-concept/serve-and-return): it defines the
 *  exchanges as being "between a young child and a caring adult", and says
 *  they "play a key role in shaping brain architecture". The mockup's
 *  "building block" paraphrase is not on that page, and naming the adult is
 *  the honest half of the sentence. */
export const WHY_CONVERSATION =
  "Harvard's Center on the Developing Child says back-and-forth exchanges between a young child and a caring adult play a key role in shaping the brain. Our How it helps page explains what the research found, and where it stops.";

/** Home's how-it-works fold (CMO merge, 2026-10-04): the mockup's steps,
 *  age tabs and "Why conversation?", composed from StepList and Tabs. It
 *  closes on GROWTH_CLOSING, one of the four places the tutor line is allowed
 *  (V6), and carries the reserve CTA the old growth room carried, under the
 *  same `home-arc` cta value so PostHog insights keep their history. */
export function HowItWorks() {
  return (
    <>
      <Reveal>
        <SectionHeading
          eyebrow="How it works"
          title="The back-and-forth that helps a brain grow."
          titleClassName="mb-3 max-w-[20ch]"
          lede={HOW_LEDE}
          ledeClassName="mb-10 max-w-[62ch]"
        />
      </Reveal>
      <StepList
        items={HOW_STEPS}
        columns="md:grid-cols-[70px_0.8fr_1.4fr]"
        rowClassName="items-start gap-4 py-6 md:gap-7"
      />
      <div className="mt-12 grid gap-10 md:grid-cols-2">
        <Reveal>
          <h3 className="mb-5 font-display text-[clamp(21px,2.2vw,26px)] font-extrabold text-ink-head">
            What it looks like at each age
          </h3>
          <AgeTabs />
        </Reveal>
        <Reveal>
          <h3 className="mb-5 font-display text-[clamp(21px,2.2vw,26px)] font-extrabold text-ink-head">
            Why conversation?
          </h3>
          <p className="mb-6 max-w-[58ch] text-[16px]">{WHY_CONVERSATION}</p>
          <TextLink href="/how">Read the research</TextLink>
        </Reveal>
      </div>
      <Reveal className="mt-12 border-t border-line pt-8">
        <p className="mb-6 max-w-[30ch] font-display text-[clamp(22px,2.4vw,28px)] font-extrabold leading-tight text-ink-head">
          {GROWTH_CLOSING}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
          <Button href={PREORDER_HREF} track="home-arc">
            {RESERVE_LABEL}
          </Button>
          <p className="text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
        </div>
      </Reveal>
    </>
  );
}
