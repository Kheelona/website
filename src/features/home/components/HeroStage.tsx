import Image from "next/image";
import { cn } from "@/lib/cn";
import { LUMI_ART } from "@/lib/lumi-art";

/** The hero art stage (revamp M2, founder brief pointer 2).
 *
 *  2026-08-25: LUMI ALONE, and this is an INTERIM state with a known end.
 *  The plush changed from the blue dino to the cream rabbit, and the artwork
 *  that stood here (`/hero/kheelu-lumi.png`) was a single baked render with
 *  Kheelu AND the old Lumi in one PNG, so no file swap could replace half of
 *  it. Extraction was tried and rejected: Kheelu's glasses are blue and the
 *  dino's belly panel and hat are cream, so there is no colour or vertical
 *  seam to cut on. Rather than leave the home page advertising a product that
 *  will not ship, the hero shows the new Lumi by itself while the founder
 *  regenerates the whisper composite from `gemini-handoff/hero-2026-08/`.
 *  When that lands: point `src` back at `/hero/kheelu-lumi.png`, restore
 *  `data-hero-has-kheelu` below, and re-measure the LCP.
 *
 *  THE ORANGE PANEL (founder-directed 2026-08-25, §8.31). A cream plush on the
 *  site's cream wash measured 1.36:1 and read as an outline with no substance;
 *  the blue dino it replaced had contrast for free. The panel is BRAND ORANGE,
 *  chosen by the founder over deeper alternatives, and the arithmetic says that
 *  was right: luminance contrast only reaches 1.99:1, but luminance is a TEXT
 *  metric, and what separates a photographed object from its ground is
 *  perceptual distance. In CIE Lab the plush sits ΔE 67.4 from brand orange,
 *  against ΔE 31.4 for the old blue dino on cream and ΔE 14.3 for this rabbit
 *  on cream. It is more than twice the separation this hero has ever had.
 *
 *  THE PANEL IS BOUNDED TO THIS COLUMN ON PURPOSE. A radial glow was tried
 *  first and rejected on sight: sized large enough to work, it reached into the
 *  copy column and put ink body text on deep orange. Anything that widens this
 *  element has to re-check the copy it can now reach.
 *
 *  `data-hero-has-kheelu` IS DELIBERATELY ABSENT. `KheeluGuide` reads it to
 *  suppress the corner guide while the hero is on screen, because two Kheelus
 *  in one viewport was the craft flaw V5-5 fixed. There is no Kheelu in this
 *  artwork, so the guide should greet normally. Putting the attribute back
 *  without putting Kheelu back would silence the guide for no reason.
 *
 *  LCP LAW (R9/R11, twice re-learned live): this priority image is the hero's
 *  largest element and owns the mobile LCP. No opacity entrance on it, ever.
 *  The rabbit's silhouette is NARROWER than the composite it replaced (0.82
 *  against 0.93), so the heights below were re-measured rather than inherited:
 *  at the old 350px the rendered area fell close to the H1's and put the LCP
 *  back in play, which is exactly the regression that cost two live rounds. */
export function HeroStage({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-end justify-center pb-4", className)}>
      {/* Decorative ground, and nothing ever reads on it: no label goes in
          here, so §8.29's white-on-orange label law has nothing to say about
          it, and the pale-tint carve-out (§8.29-b) does not apply either —
          this is a full fill by design. */}
      <div
        aria-hidden="true"
        data-hero-panel
        className="pointer-events-none absolute inset-y-0 -inset-x-5 rounded-[44px] bg-orange md:-inset-x-2 lg:inset-x-0"
      />
      <Image
        src={LUMI_ART.src}
        alt={LUMI_ART.alt}
        width={LUMI_ART.width}
        height={LUMI_ART.height}
        priority
        sizes="(max-width: 768px) 82vw, 500px"
        className="relative h-[400px] w-auto md:h-[470px] xl:h-[500px]"
      />
    </div>
  );
}
