import { STORE_URL } from "@/config/site";
import type { CtaId } from "@/lib/tracking/cta";
import { Button } from "../Button/Button";

export interface PreorderButtonProps {
  /** Where on the site this button is (architecture §8.3): a pre-order value of the CTA registry. */
  cta: CtaId;
  /** The one CTA label, "Pre-order Kheelu" (D041), from content/en-IN/cta.ts; ui never imports content,
   *  so the section passes it. */
  label: string;
  size?: "s" | "m" | "l";
  /** Full width (the DS phone layout); sections make it inline from 720 px with their own class. */
  block?: boolean;
  /** Only the Home hero carries one: `hero-cta`. */
  id?: string;
  /** The nudging arrow (D049 pick 6): Home and product heroes, and the guide, safety, stories and article closes. */
  arrow?: boolean;
  /** Composition hooks (`ks-nav-cta`, …). */
  className?: string;
}

/**
 * Every "Pre-order Kheelu" button: the Chilli `Button` linking to the store of this build (`STORE_URL`, the
 * beta store on beta, D048), with the CTA value that tells PostHog which button it was.
 */
export function PreorderButton({ cta, label, size, block, id, arrow, className }: PreorderButtonProps) {
  const common = { size, block, id, className, cta, href: STORE_URL } as const;
  return arrow ? (
    <Button variant="cta" {...common} arrow>
      {label}
    </Button>
  ) : (
    <Button variant="cta" {...common}>
      {label}
    </Button>
  );
}
