import { RichText } from "@/components/ui/RichText/RichText";
import { sourceId } from "@/components/ui/SourceMarker/SourceMarker";
import { SourcesNote } from "@/components/ui/SourceMarker/SourcesNote";
import type { SourcesSectionConfig } from "./sources-section.types";

/**
 * A page's numbered sources (task 3.4; D026, DS gap G-18 composed), each note the target of its markers (`#src-n`).
 * `article`: a section under a hairline at the foot of the reading column (pass it to ArticleBody as `after`), a
 * subtitle, then an ordered list of notes (`ks-notes`: the number, the citation, the full address). `inline`: the
 * buyer's guide's captions (`ks-gd-sources` around ui/SourcesNote). Renders nothing without sources. Server component.
 */
export type SourcesSectionProps = SourcesSectionConfig;

export function SourcesSection({ variant, label, sources, id = "sources-title" }: SourcesSectionProps) {
  if (sources.length === 0) return null;
  if (variant === "inline") {
    return (
      <div className="ks-gd-sources">
        <SourcesNote label={label} sources={sources} />
      </div>
    );
  }
  return (
    <section className="ks-sources" aria-labelledby={id}>
      <h2 className="kh-subtitle" id={id}>
        {label}
      </h2>
      <ol className="ks-notes kh-body-s">
        {sources.map((source, i) => (
          <li key={i} id={sourceId(i + 1)}>
            <span className="ks-notes__n">{`[${i + 1}]`}</span>
            <span>
              <RichText text={source.citation} /> <a href={source.href}>{source.href}</a>
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
