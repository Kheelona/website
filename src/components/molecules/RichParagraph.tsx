import Link from "next/link";
import { cn } from "@/lib/cn";

/** A journal paragraph that can carry links (SEO round C2, 2026-09-05).
 *
 *  WHY. Article bodies were plain strings, so no piece could link the WHO
 *  guideline it quoted, the Safety page it pointed at, or a sibling article.
 *  Cited sources are the single largest measured lift in whether an answer
 *  engine quotes a page (the Princeton GEO study, +40%), and a paragraph that
 *  says "the WHO recommends" without a link is a claim a parent cannot check.
 *
 *  The syntax is the one everybody already knows: `[label](url)`. Nothing else
 *  is parsed: no emphasis, no headings, no HTML. A paragraph stays a string in
 *  `lib/stories`, so the copy laws (banned phrases, voice lint, word count) keep
 *  reading it as prose, and `wordCount` counts the label, not the address.
 *
 *  Internal links (`/path`) render through `next/link`; external ones open in a
 *  new tab with `rel="noopener noreferrer"`. Both use the same underline the
 *  article's closing links already use, so a reader learns one link style. */
export type RichRun =
  | { type: "text"; value: string }
  | { type: "link"; label: string; href: string };

/* Root-relative means ONE leading slash: `//host/path` is protocol-relative and
   would send a reader off-site while looking internal (the test caught it). */
const LINK = /\[([^\]]+)\]\(((?:\/(?!\/)|https?:\/\/)[^)\s]+)\)/g;

export function parseRichText(text: string): RichRun[] {
  const runs: RichRun[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0;
    if (index > last) runs.push({ type: "text", value: text.slice(last, index) });
    runs.push({ type: "link", label: match[1], href: match[2] });
    last = index + match[0].length;
  }
  if (last < text.length) runs.push({ type: "text", value: text.slice(last) });
  return runs;
}

/** The links a paragraph carries, for the guards in test/internal-links. */
export function linksIn(text: string): { label: string; href: string }[] {
  return parseRichText(text).flatMap((run) => (run.type === "link" ? [run] : []));
}

const LINK_CLASS = "font-semibold text-ink-head underline";

export function RichParagraph({ text, className }: { text: string; className?: string }) {
  return (
    <p className={cn(className)}>
      {parseRichText(text).map((run, i) =>
        run.type === "text" ? (
          run.value
        ) : run.href.startsWith("/") ? (
          <Link key={i} href={run.href} className={LINK_CLASS}>
            {run.label}
          </Link>
        ) : (
          <a key={i} href={run.href} className={LINK_CLASS} target="_blank" rel="noopener noreferrer">
            {run.label}
          </a>
        ),
      )}
    </p>
  );
}
