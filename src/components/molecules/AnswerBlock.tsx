import { cn } from "@/lib/cn";
import { SectionHeading } from "@/components/molecules/SectionHeading";

/** A question-led heading with its answer in the open (revamp M4).
 *
 *  The AEO contract from `docs/revamp-2026-07/research.md`: parents and answer
 *  engines both ask questions, so the safety and platform pages lead with the
 *  question and answer it in 40 to 60 words of visible copy, right there. The
 *  accordion `Faq` still owns the long question LISTS; this is for the handful
 *  of answers that must be readable without a click (and mirrored in FAQPage
 *  schema, which may only ever describe visible copy).
 *
 *  It composes SectionHeading so there is exactly one type scale on the site:
 *  the question is the heading, the answer is the lede, widened a little
 *  because these paragraphs are the point of the block. `id` gives the answer
 *  a deep-link anchor and clears the sticky navbar via scroll-mt. */
export function AnswerBlock({
  as = "h2",
  level,
  id,
  question,
  answer,
  className,
  answerClassName,
  children,
}: {
  as?: "h2" | "h3";
  /** Defaults from the tag: a standalone h2 question is `minor`, an h3 sitting
   *  under a room heading drops to `nested` so it never competes with it. */
  level?: "section" | "minor" | "nested";
  id?: string;
  question: React.ReactNode;
  answer: React.ReactNode;
  className?: string;
  answerClassName?: string;
  children?: React.ReactNode;
}) {
  return (
    <div id={id} className={cn(id && "scroll-mt-28", className)}>
      <SectionHeading
        as={as}
        level={level ?? (as === "h3" ? "nested" : "minor")}
        title={question}
        titleClassName="mb-4 max-w-[26ch]"
        lede={answer}
        ledeClassName={cn("max-w-[66ch] leading-[1.6]", answerClassName)}
      />
      {children}
    </div>
  );
}
