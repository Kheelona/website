import { SectionHeading } from "@/components/molecules/SectionHeading";

/** The sources under a journal article (SEO round C2, 2026-09-05).
 *
 *  Rendered from the same `sources` array that feeds the BlogPosting
 *  `citation` node, so what a reader can click and what a crawler is told are
 *  one list by construction (§8.35-c). Every entry is a real document a parent
 *  can open: a guideline, a paper, a published advisory. A source that cannot
 *  be linked is not a source and does not go in the array.
 *
 *  Plain ordered list, no summary or collapse: the FAQ taught this site that
 *  content hidden until JavaScript runs is content an answer engine never sees
 *  (§8.24-6). The host is shown beside each label so the reader knows where a
 *  click goes before taking it. */
export type Source = { label: string; url: string };

export function SourcesList({ sources }: { sources: readonly Source[] }) {
  if (sources.length === 0) return null;
  return (
    <section aria-labelledby="sources-heading" className="mt-10 border-t border-line pt-8">
      <SectionHeading as="h2" level="minor" title="Sources" titleClassName="mb-4" id="sources-heading" />
      <ol className="list-decimal space-y-2 pl-6 text-[16px] leading-[1.6]">
        {sources.map((s) => (
          <li key={s.url}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink-head underline"
            >
              {s.label}
            </a>
            <span className="text-ink-muted"> · {new URL(s.url).hostname.replace(/^www\./, "")}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
