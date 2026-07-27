import { Button } from "@/components/atoms/Button";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";
import { ChatDemo, type ChatTurn } from "@/components/molecules/ChatDemo";
import { PREORDER_HREF, RESERVE_LABEL, PRICE_CAPTION, LUMI_AGES, PLATFORM_AGES } from "@/config/site";

/** Home's learning room (V3, new fold — the education 40%).
 *
 *  The category's failure the founder's positioning exploits: every AI toy
 *  claims learning in adjectives ("STEM", "builds critical thinking") and
 *  shows no mechanism, so parents cannot tell a tutor from a talking speaker
 *  (benchmarks-v3.md, Miko + MyWonder gaps). This room shows the loop instead
 *  of naming it: Lumi reads a story, the child interrupts, Lumi asks one back.
 *  That is Kheelu mode, and the demo IS the proof.
 *
 *  It also carries a Reserve button: this is the strongest new argument on the
 *  page, so it gets a buy path rather than making the reader scroll back. */
const KHEELU_MODE_DEMO: readonly ChatTurn[] = [
  {
    who: "lumi",
    text: "And the slow tortoise crossed the line first. Why do you think the hare lost?",
  },
  { who: "child", text: "He went to sleep!" },
  { who: "lumi", text: "He did. If you were the hare, what would you do?" },
] as const;

const CHIPS = [
  "New words, counted in the app",
  "Numbers and rhymes",
  "Feelings, named",
] as const;

export function LearningRoom() {
  return (
    <div className="grid items-start gap-10 md:grid-cols-[1fr_1.05fr]">
      <Reveal>
        <SectionHeading
          eyebrow="The learning, built in"
          title="Your child hears a story. Lumi asks what happens next."
          titleClassName="mb-4 max-w-[22ch]"
          lede="Every Lumi carries stories and lessons your child can interrupt, question, and be quizzed on. Lumi reads, your child asks why, and Lumi asks one back. That is Kheelu mode, and it feels like a game."
          ledeClassName="mb-6 max-w-[54ch]"
        />
        <ul className="flex flex-wrap gap-2.5">
          {CHIPS.map((c) => (
            <li
              key={c}
              className="rounded-full border border-line-soft bg-cream px-4 py-2 text-[15px] font-medium text-ink-head"
            >
              {c}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.08}>
        <ChatDemo turns={KHEELU_MODE_DEMO} />
        <p className="mt-5 max-w-[46ch] text-[16px] text-ink-muted">
          Lessons follow your child&apos;s age, from {LUMI_AGES} today, and grow
          with the family of friends to {PLATFORM_AGES.split(" to ")[1]}.
        </p>
        <div className="mt-6">
          <Button href={PREORDER_HREF}>{RESERVE_LABEL}</Button>
          <p className="mt-3 text-[15px] text-ink-muted">{PRICE_CAPTION}</p>
        </div>
      </Reveal>
    </div>
  );
}
