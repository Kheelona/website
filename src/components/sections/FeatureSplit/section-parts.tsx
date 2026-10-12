import { Button } from "@/components/ui/Button/Button";
import { Heading, type HeadingProps } from "@/components/ui/Heading/Heading";
import type { IconName } from "@/components/ui/Icon/Icon";
import { Actions } from "@/components/ui/Layout/Layout";
import type { Offer } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";

/* The two parts every story section of task 3.3 shares (HeroSection, FilmsStrip, FeatureSplit, ModesSection,
 * TrustSection, CompareByCategory, CardGrid, FaqSection), written once: a fold's heading from its content, and the link
 * row that closes a fold. Kept beside FeatureSplit, the most general of them; a candidate for ui/ once another wave
 * needs the link row (main session). */

/** A fold's heading as content gives it: eyebrow, title (one accent), lead, alignment; the id names the section. */
export type SectionHeading = Pick<HeadingProps, "eyebrow" | "title" | "lead" | "align"> & { readonly id: string };

/** A fold's heading (an h2 in the DS SectionHeading), every string through RichText with the page's offer. */
export function SectionTitle({ heading, offer, align, className }: { heading: SectionHeading; offer?: Offer; align?: "left" | "center"; className?: string }) {
  return (
    <Heading
      eyebrow={heading.eyebrow}
      title={heading.title}
      lead={heading.lead}
      align={align ?? heading.align}
      id={heading.id}
      offer={offer}
      className={className}
    />
  );
}

/**
 * A link that closes a fold, in the DS actions row: a ghost link with its arrow ("See all questions", "How setup
 * works"), another icon after the words with `iconEnd` (the store's "Back to your details", caret up), or, with
 * `icon`, a secondary button with the icon first ("See the full safety facts", shield).
 */
export interface SectionLink {
  readonly label: string;
  readonly href: string;
  /** A secondary CTA value (src/lib/tracking/cta.ts), where the copy tags the link: `faq-more`, `compare-learn`. */
  readonly cta?: CtaId;
  /** Makes the link a secondary button with this icon before the words. */
  readonly icon?: IconName;
  /** The ghost link's icon after the words; the arrow without it. */
  readonly iconEnd?: IconName;
}

export function SectionLinkRow({ link, center }: { link: SectionLink | undefined; center?: boolean }) {
  if (!link) return null;
  return (
    <Actions center={center}>
      {link.icon ? (
        <Button variant="secondary" href={link.href} cta={link.cta} icon={link.icon}>
          {link.label}
        </Button>
      ) : (
        <Button variant="ghost" href={link.href} cta={link.cta} iconEnd={link.iconEnd ?? "arrow-right"}>
          {link.label}
        </Button>
      )}
    </Actions>
  );
}
