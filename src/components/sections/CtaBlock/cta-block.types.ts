import type { Copy, IconRef, Offer, SitePath, TrustItem } from "@/content/types";
import type { CtaId } from "@/lib/tracking/cta";

/**
 * Config types of the selling sections (task 3.2; structure §2: a section's config type lives in name.types.ts).
 * A section never imports content/en-IN (structure §6): the page's content module writes a config, and the section
 * registry (task 4.1) adds the page's selling context.
 */

/** The help line beside a CTA (content/en-IN/seller.ts `help`): a short lead, then the ways to reach a person. */
export interface CtaHelp {
  /** "Questions?" */
  readonly lead: Copy;
  /** The WhatsApp and call links, in the content's inline syntax. */
  readonly contact: Copy;
}

/**
 * What every selling section needs from its page, the same for every placement on it: the live offer (ADR-005),
 * the one CTA label (D041, content/en-IN/cta.ts) and the help line (content/en-IN/seller.ts).
 */
export interface SellingContext {
  readonly offer: Offer;
  /** "Pre-order Kheelu". */
  readonly ctaLabel: string;
  readonly help: CtaHelp;
}

/** A selling section's heading (DS SectionHeading): eyebrow, title with at most one accent, lead. */
export interface SellingHeading {
  readonly eyebrow?: Copy;
  readonly title: Copy;
  readonly lead?: Copy;
}

/** The link under a CTA block: a ghost or secondary button (never chilli), tracked when the copy names a value. */
export interface CtaSecondary {
  readonly label: string;
  /** A site path, an outside address, or a fragment on the page (task Q2.9: Home's hero link to film 1 in the strip,
   *  `#learning-by-asking`, which the strip plays in place). */
  readonly href: SitePath | `https://${string}` | `#${string}`;
  /** A secondary value of the CTA registry (`hero-learn`, …); the closes' "See how it works" links carry none. */
  readonly cta?: CtaId;
  /** The mockup's look: `ghost` (Home folds 1 and 2, the closes) or `secondary` (the safety folds). */
  readonly variant: "ghost" | "secondary";
  /** An icon before the label (the safety folds' shield). */
  readonly icon?: IconRef;
  /** An icon after the label (the ghost links' arrow). */
  readonly iconEnd?: IconRef;
  /** `laptop`: shown from 900 px only (task Q2.9: Home's hero link, which phones do not show; the D2C plan v2 §2.0). The
   *  link stays in the HTML at every width; cta-block.css hides its row below 900 px. */
  readonly from?: "laptop";
}

/**
 * How the lines under the button sit, each as the approved mockup lays it out:
 * - `beside` (default): price sentence, trust line and help line grouped (`ks-beside`, mockup.css:27): every close but
 *   the journal's (the product close too since task Q2.15, CON-2: its "full" block left), and the blocks inside pages;
 * - `journal`: price sentence and trust line grouped, the help line after the group: the stories hub and article
 *   closes (stories.html, the article mockups);
 * - `stack`: no group, every line straight after the button: the Home and product heroes (the hero section spaces
 *   them, mockup.css:16-19).
 */
export type CtaBlockLayout = "beside" | "journal" | "stack";

/** One CTA block as a page's content gives it. */
export interface CtaBlockConfig {
  /** The chilli button's value: a pre-order value of the CTA registry (architecture §8.3), refused otherwise. */
  readonly cta: CtaId;
  /** The nudging arrow (D049 pick 6, D064 item 10). On by default: every CTA block's button has it (task Q2.15, the
   *  consistency review's R2), so a page's content never sets it. */
  readonly arrow?: boolean;
  /** Full width on phones, inline from 720 px (DS 10-pages; CMO M4; cta-block.css). On by default: every CTA block's
   *  button is full width on phones (task Q2.15, R2), so a page's content never sets it. */
  readonly block?: boolean;
  /** The button's id: only the Home hero's `hero-cta`, which the sticky bar watches. */
  readonly id?: string;
  /** The price sentence's id: only the Home hero's `hero-price`. */
  readonly priceId?: string;
  /** `center` for the centred blocks (Home folds 2 and 6, product fold 6, the team, contact and 404 closes). */
  readonly align?: "start" | "center";
  readonly layout?: CtaBlockLayout;
  /** The trust items, in order (content/en-IN/trust.ts: the compact pair, or a full row). */
  readonly trust: readonly TrustItem[];
  /** Ends the lines with the help line (WhatsApp or call); the contact close and Home folds 2 and 6 have none. */
  readonly helpLine?: boolean;
  readonly secondary?: CtaSecondary;
}

export type CtaBlockProps = CtaBlockConfig & SellingContext;
