import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/molecules/Reveal";
import { SectionHeading } from "@/components/molecules/SectionHeading";

/** Home's brain-development room (V3, new fold — the 20% between fun and
 *  education).
 *
 *  Why it earns a room: the education fold above shows WHAT Lumi teaches, and
 *  a parent's next question is whether talking to a toy counts at all. This
 *  answers with the mechanism researchers actually point at (serve and return)
 *  in plain words, then hands off to the journal article that carries the
 *  depth. No statistics are quoted here on purpose — the numbers we could cite
 *  belong to the sourced article, not to a marketing fold.
 *
 *  Visual anchor (BUILD-V3 §5.1): the journal's own storytelling photograph,
 *  already on disk, lazy and below the fold. */
export function BrainRoom() {
  return (
    <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
      <Reveal>
        <SectionHeading
          eyebrow="Why talking works"
          title="Back and forth is how a brain gets built."
          titleClassName="mb-4 max-w-[20ch]"
          lede="Researchers call it serve and return. Your child serves a question, someone returns it with an answer and a new question. Every loop builds language and thinking at once, in the years the brain grows fastest. Lumi keeps the loop going when your hands are full."
          ledeClassName="mb-6 max-w-[56ch]"
        />
        <p className="text-[16px] text-ink-muted">
          <Link
            href="/stories/how-children-learn-by-talking"
            className="rounded font-semibold text-ink-head underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            Read the science in the journal
          </Link>
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <Image
          src="/stories/how-children-learn-by-talking.jpg"
          alt="A grandmother telling a story to two small children on a terrace at night"
          width={1440}
          height={803}
          sizes="(max-width: 768px) 90vw, 520px"
          className="h-auto w-full rounded-(--radius-card-lg)"
        />
      </Reveal>
    </div>
  );
}
