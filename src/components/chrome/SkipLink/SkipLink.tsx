import { Button } from "@/components/ui/Button/Button";

export interface SkipLinkProps {
  /** "Skip to content": content/en-IN/navigation.ts `labels.skip`. */
  label: string;
}

/**
 * The skip link (WCAG 2.4.1), first in every page's body as the approved mockup puts it (mockup/build.mjs): the DS
 * secondary button to `#main`, waiting above the screen until it takes keyboard focus (skip-link.css, ported from
 * mockup.css:11-12 as `ks-skip`). The page's smooth anchor glide is motion.css's (`html[data-scroll-behavior]`).
 */
export function SkipLink({ label }: SkipLinkProps) {
  return (
    <Button href="#main" variant="secondary" className="ks-skip">
      {label}
    </Button>
  );
}
