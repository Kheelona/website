import clsx from "clsx";
import type { Source } from "@/content/types";
import { RichText } from "../RichText/RichText";
import { sourceId } from "./SourceMarker";

/** A source as a section's note shows it: the citation, its address and, if the site's name is not enough,
 *  the link's own label. */
export interface SourceNoteItem extends Source {
  /** The visible link; defaults to the address's host name ("developingchild.harvard.edu"). */
  label?: string;
}

export interface SourcesNoteProps {
  /** The bold word that opens the note, "Sources"; from content. */
  label: string;
  /** In marker order: source n answers `[^n]`. */
  sources: readonly SourceNoteItem[];
  /** A composition hook on each caption. */
  className?: string;
}

/**
 * The "Sources" note under a sourced section (D026; DS gap G-18, composed): one `kh-caption` per source, each
 * the target of its markers (`#src-n`), the first opening with the bold label. As the mockup's Home, guide and
 * product notes; articles list their sources in SourcesSection instead.
 */
export function SourcesNote({ label, sources, className }: SourcesNoteProps) {
  return (
    <>
      {sources.map((source, i) => {
        const n = i + 1;
        return (
          <p key={n} className={clsx("kh-caption", className)} id={sourceId(n)}>
            {i === 0 && (
              <>
                <strong>{label}</strong>{" "}
              </>
            )}
            {`[${n}] `}
            <RichText text={source.citation} /> <a href={source.href}>{source.label ?? new URL(source.href).hostname}</a>
          </p>
        );
      })}
    </>
  );
}
