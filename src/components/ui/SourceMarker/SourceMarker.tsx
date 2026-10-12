import clsx from "clsx";

/** The id of source n on its page, shared by the marker's link and the note it points at (`#src-1`). */
export function sourceId(n: number): string {
  return `src-${n}`;
}

export interface SourceMarkerProps {
  /** The source's number, counting from 1, as `[^n]` in the content string. */
  n: number;
  /** The word before the number in the accessible name ("Source" makes "Source 1"), from content. */
  label: string;
  /** Articles keep the marker on one line (the article stylesheet's nowrap). */
  variant?: "article";
}

/**
 * A source marker after a sourced line (D026; DS gap G-18, composed): a short linked "[n]" with a 44 px tap
 * area that does not move the line, pointing at the section's sources note. Rendered by `RichText` for every
 * `[^n]` token; ported from the mockup's source-marker block.
 */
export function SourceMarker({ n, label, variant }: SourceMarkerProps) {
  return (
    <a className={clsx("ks-src", variant === "article" && "ks-src--article")} href={`#${sourceId(n)}`} aria-label={`${label} ${n}`}>
      {`[${n}]`}
    </a>
  );
}
