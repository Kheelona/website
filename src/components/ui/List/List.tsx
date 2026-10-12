import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";

/**
 * The DS List and ListItem (`kh-list`, `kh-listitem`): rows of links or quiet rows. Three approved uses:
 * - the 404's four link rows: icon tile, title, a line under it, chevron (404.html fold 1);
 * - the related guides and "keep reading" rows: title, then the chevron icon straight in the row, without the DS
 *   wrapper (story-*.html; `bareChevron`, styled by RelatedGuides as stories.css:155 does);
 * - the stories hub's rows: an h3 title and a line, as quiet rows or links (stories.html, TopicSection).
 * A row is one tap target (DS rule); the icon tile and chevron are decoration. The list reset is the shared
 * composition class (`ks-list-reset`); each page's wrapping rules are its section's (EmptyState `ks-404__list`,
 * RelatedGuides, TopicSection). Title, line and meta take `RichText`.
 */
export interface ListRow {
  title: ReactNode;
  /** The line under the title (DS `subtitle`). */
  sub?: ReactNode;
  /** Short text at the row's end ("3 min read"). */
  meta?: ReactNode;
  /** Makes the row one link. */
  href?: string;
  /** The icon tile (the `Icon` primitive). */
  icon?: ReactNode;
  tone?: Tone;
}

export interface ListProps {
  items: readonly ListRow[];
  /** The chevron at the end of each link row (the `Icon` primitive, caret-right), in the DS `kh-listitem__chev` span. */
  chevron?: ReactNode;
  /** The chevron icon straight in the row, as the articles' related rows have it (story-*.html). */
  bareChevron?: boolean;
  /** The title element: `span` (default) or `h3` where the page's outline needs row headings (the hub). */
  titleAs?: "span" | "h3";
  /** The list's accessible name, where the page gives one. */
  label?: string;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
}

export function List({ items, chevron, bareChevron = false, titleAs: Title = "span", label, className }: ListProps) {
  return (
    <ul className={clsx("kh-list", "ks-list-reset", className)} aria-label={label}>
      {items.map((row, i) => {
        const rowClass = clsx("kh-listitem", row.tone && `kh-tone-${row.tone}`);
        const tile = row.icon !== undefined && (
          <span className="kh-listitem__icon" aria-hidden="true">
            {row.icon}
          </span>
        );
        const meta = row.meta !== undefined && <span className="kh-listitem__meta">{row.meta}</span>;
        if (row.href === undefined) {
          return (
            <li key={i} className={rowClass}>
              {tile}
              <div className="kh-listitem__text">
                <Title className="kh-listitem__title">{row.title}</Title>
                {row.sub !== undefined && <p className="kh-listitem__sub">{row.sub}</p>}
              </div>
              {meta}
            </li>
          );
        }
        // A heading title needs block wrappers: an h3 is not phrasing content, so it never sits in a span.
        const Text = Title === "h3" ? "div" : "span";
        const Sub = Title === "h3" ? "p" : "span";
        return (
          <li key={i}>
            <Link href={row.href} className={rowClass}>
              {tile}
              <Text className="kh-listitem__text">
                <Title className="kh-listitem__title">{row.title}</Title>
                {row.sub !== undefined && <Sub className="kh-listitem__sub">{row.sub}</Sub>}
              </Text>
              {meta}
              {chevron !== undefined &&
                (bareChevron ? (
                  chevron
                ) : (
                  <span className="kh-listitem__chev" aria-hidden="true">
                    {chevron}
                  </span>
                ))}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
