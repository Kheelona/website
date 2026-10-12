import { clsx } from "clsx";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";

/**
 * The DS quote card (`kh-quote`, Testimonial): the founder's quote on the team page (team.html fold 4). Real words
 * of real people only (DS Testimonial rules); the initials avatar is decoration (`aria-hidden`).
 */
export interface QuoteCite {
  name: ReactNode;
  role?: ReactNode;
  /** The avatar's initials ("AS"); no avatar without them. */
  initials?: string;
}

export interface QuoteProps {
  quote: ReactNode;
  cite: QuoteCite;
  tone?: Tone;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
}

export function Quote({ quote, cite, tone, className }: QuoteProps) {
  return (
    <figure className={clsx("kh-quote", tone && `kh-tone-${tone}`, className)}>
      <blockquote className="kh-quote__text">{quote}</blockquote>
      <figcaption className="kh-quote__who">
        {cite.initials !== undefined && (
          <span className="kh-quote__avatar" aria-hidden="true">
            {cite.initials}
          </span>
        )}
        <span>
          <span className="kh-quote__name">{cite.name}</span>
          {cite.role !== undefined && <span className="kh-quote__role">{cite.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
