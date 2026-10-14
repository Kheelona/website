import { clsx } from "clsx";
import type { ReactNode } from "react";
import { Avatar } from "@/components/ui/Avatar/Avatar";
import type { ImageRef, Tone } from "@/content/types";

/**
 * The DS quote card (`kh-quote`, Testimonial): the founder's quote on the team page (team.html fold 4). Real words
 * of real people only (DS Testimonial rules); the initials avatar is decoration (`aria-hidden`). Given the person's
 * photo, the avatar is the DS Avatar holding it (`kh-avatar`, 48 px, the size of the quote's own avatar), its alt empty
 * beside the printed name, as the founders' cards show theirs (task 7.1a; CMO built-page review A, M10: initials under
 * the founders' photo cards read as a placeholder).
 */
export interface QuoteCite {
  name: ReactNode;
  role?: ReactNode;
  /** The avatar's initials ("AS"); no avatar without them or a photo. */
  initials?: string;
  /** The person's photo, in the avatar's place (it wins over the initials); its alt empty beside the visible name. */
  photo?: ImageRef;
}

export interface QuoteProps {
  quote: ReactNode;
  cite: QuoteCite;
  tone?: Tone;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
}

/** The avatar's rendered width (DS Avatar m, the quote avatar's 48 px), for the photo's responsive sizes. */
const AVATAR_SIZES = "48px";

export function Quote({ quote, cite, tone, className }: QuoteProps) {
  return (
    <figure className={clsx("kh-quote", tone && `kh-tone-${tone}`, className)}>
      <blockquote className="kh-quote__text">{quote}</blockquote>
      <figcaption className="kh-quote__who">
        {cite.photo !== undefined ? (
          <Avatar image={cite.photo} sizes={AVATAR_SIZES} />
        ) : (
          cite.initials !== undefined && (
            <span className="kh-quote__avatar" aria-hidden="true">
              {cite.initials}
            </span>
          )
        )}
        <span>
          <span className="kh-quote__name">{cite.name}</span>
          {cite.role !== undefined && <span className="kh-quote__role">{cite.role}</span>}
        </span>
      </figcaption>
    </figure>
  );
}
