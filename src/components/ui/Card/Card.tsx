import { clsx } from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";
import type { Tone } from "@/content/types";

/**
 * The 19 DS type styles, as the generated `ks-type-*` classes (src/styles/generated/type-steps.css, from the kh-
 * type classes in tokens.css). A step on an element replaces a pixel size the mockup restated (mockup-css-mapping
 * §5 rule 2), for example a hub card title (rows 63-64) or a fact's body (rows 76-77).
 */
export const TYPE_STEPS = [
  "display-xl",
  "display-l",
  "display-m",
  "headline",
  "title",
  "subtitle",
  "lead",
  "body-l",
  "body",
  "body-s",
  "caption",
  "label-l",
  "label",
  "label-s",
  "eyebrow",
  "price",
  "hand-l",
  "hand-m",
  "note",
] as const;

export type TypeStep = (typeof TYPE_STEPS)[number];

/** The class of a DS type step. */
export const typeStepClass = (step: TypeStep | undefined): string | undefined => (step ? `ks-type-${step}` : undefined);

export interface CardLink {
  href: string;
  label: ReactNode;
  /** The arrow after the words (the `Icon` primitive). */
  icon?: ReactNode;
  /** An accessible name of its own, where the copy gives one (contact.html route cards). */
  ariaLabel?: string;
  /**
   * The full 44 px tap target for a card link (DS gap G-01): `ks-card__link--tap`, the rule the contact, team and
   * hub pages share (contact.css:21, team.css:23, stories.css:28). Off by default: Home's guide cards have none.
   */
  tap?: boolean;
}

export interface CardProps {
  /** The element the mockup uses: `article` (default), `li` in a guides list, `section` or `div`. */
  as?: "article" | "div" | "li" | "section";
  tone?: Tone;
  /**
   * DS FeatureCard variants: `plain` (default), `tint`, `block`. No approved page uses `block`; on Chilli or Kheelu
   * Blue it sets white text on the fill, which fails AA contrast (DS gap G-02), so only Sunshine passes axe.
   */
  variant?: "plain" | "tint" | "block";
  /** The DS icon in its circle (the `Icon` primitive). */
  icon?: ReactNode;
  /** A photo above everything else (the stories hub's guide card: `Photo`). */
  media?: ReactNode;
  title?: ReactNode;
  titleAs?: "h2" | "h3";
  titleId?: string;
  /** A DS type step on the title (`subtitle` on the hub's guide cards; mockup-css-mapping §3.5). */
  titleType?: TypeStep;
  body?: ReactNode;
  /** One link straight in the card, last before `after` (Home's guide cards, the hub, the founder cards). */
  link?: CardLink;
  /**
   * A row of links at the card's foot instead: the contact route cards (contact.html fold 2: `p` wrapper, one or two
   * links each, contact.css:20-21). Every link in the row is a full tap target (G-01). Use `link` or `links`, not both.
   */
  links?: readonly Omit<CardLink, "tap">[];
  /**
   * Wraps the title, body and children in one `<div>` beside the icon: the product page's compact mode rows
   * (meet-kheelu.html fold 4, styled by ModesSection).
   */
  groupText?: boolean;
  /** The group's composition class: the Good to know card's text column (`mk-know__text`, meet-kheelu.html fold 4). */
  groupClassName?: string;
  /** The id of the heading that names the card (aria-labelledby). */
  labelledBy?: string;
  reveal?: boolean;
  /** The parent's composition class, added after the DS classes. */
  className?: string;
  /** Anything after the body and before the link (a tick list, the comparison lines, a section's own markup). */
  children?: ReactNode;
  /** Last, after the link: the Good to know card's photo beside its text (`mk-know__img`, meet-kheelu.html fold 4). */
  after?: ReactNode;
}

export function Card({
  as: Root = "article",
  tone,
  variant = "plain",
  icon,
  media,
  title,
  titleAs: Title = "h3",
  titleId,
  titleType,
  body,
  link,
  links,
  groupText = false,
  groupClassName,
  labelledBy,
  reveal = false,
  className,
  children,
  after,
}: CardProps) {
  if (groupClassName !== undefined && !groupText) {
    throw new Error(`Card: groupClassName "${groupClassName}" names the text group, so it needs groupText`);
  }
  if (link !== undefined && links !== undefined) {
    throw new Error("Card: pass link and links one at a time (a single link, or the contact cards' links row)");
  }
  const words = (
    <>
      {title !== undefined && (
        <Title id={titleId} className={clsx("kh-card__title", typeStepClass(titleType))}>
          {title}
        </Title>
      )}
      {body !== undefined && <p className="kh-card__body">{body}</p>}
      {children}
    </>
  );
  return (
    <Root
      className={clsx("kh-card", variant !== "plain" && `kh-card--${variant}`, tone && `kh-tone-${tone}`, className)}
      aria-labelledby={labelledBy}
      data-reveal={reveal ? "" : undefined}
    >
      {media}
      {icon !== undefined && <span className="kh-card__icon">{icon}</span>}
      {groupText ? <div className={groupClassName}>{words}</div> : words}
      {link && <CardAnchor link={link} />}
      {links !== undefined && links.length > 0 && (
        <p className="ks-card-links">
          {links.map((l, i) => (
            // Position and address: two links to one address never share a key.
            <CardAnchor key={`${i}:${l.href}`} link={{ ...l, tap: true }} />
          ))}
        </p>
      )}
      {after}
    </Root>
  );
}

/** A card link: the label, then the arrow (`kh-card__link`, with the G-01 tap target when asked). */
function CardAnchor({ link }: { link: CardLink }) {
  return (
    <Link href={link.href} className={clsx("kh-card__link", link.tap && "ks-card__link--tap")} aria-label={link.ariaLabel}>
      {link.label}
      {link.icon}
    </Link>
  );
}
