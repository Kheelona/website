import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ImageRef } from "@/content/types";
import { cssRatio, imageSource, loadingFor } from "@/components/ui/Photo/image";

/* Real parent-app screens in the DS Device frame (task 2.3; kh-device, bundle.css:1169-1174; D044, D046).
 *
 * Approved markup: `<figure class="mk-shots"><div class="mk-shots__row">` with one `kh-device mk-shot` per screen,
 * then the caption (home.html:219-225, 246-249; meet-kheelu.html:215-221, 245-248). The DS frame is 390 × 844 (gap
 * G-04), so app-screens.css sizes it to its column instead. Home and the product page styled the block differently
 * (mockup-css-mapping §6.2), hence the two variants:
 * - `home`: one phone sits in the same two-column row, marked `--one`, so it is exactly as wide as each of two
 *   (founder, D046: the same phone size in the parent-app and safety folds);
 * - `product`: a narrower row, a thicker frame from 720 px, and one phone stands alone (`--solo`, no row), as the
 *   product page shows it;
 * - `safety`: the safety page's one phone (safety.html:87-93, safety.css:25-29): the DS frame as it is, with no
 *   compact `ks-shot` frame and no row, 272 px wide, 300 from 900 px. */

type AppScreensBase = {
  /** One phone screen's rendered width at each layout. */
  readonly sizes: string;
  readonly caption?: ReactNode;
  /** Fades in once on scroll (D049 pick 1). */
  readonly reveal?: boolean;
  /** The section's own composition class (`ks-…`). */
  readonly className?: string;
};

/** Each screen's alt text describes the scene (never "real conversations", D046 risk). */
export type AppScreensProps = AppScreensBase &
  (
    | { readonly variant: "home" | "product"; readonly screens: readonly [ImageRef] | readonly [ImageRef, ImageRef] }
    | { readonly variant: "safety"; readonly screens: readonly [ImageRef] }
  );

/** One screen in its frame. The screenshot carries its own ratio (`--kh-ratio`, read as its aspect-ratio by
 *  app-screens.css), so next/image's whole-pixel renditions never change its height and move the folds below (task 4.6). */
function Device({ screen, sizes, compact }: { readonly screen: ImageRef; readonly sizes: string; readonly compact: boolean }) {
  return (
    <div className={clsx("kh-device", compact && "ks-shot")}>
      <div className="kh-device__screen">
        <Image {...imageSource(screen)} alt={screen.alt} sizes={sizes} {...loadingFor(false)} style={{ "--kh-ratio": cssRatio(screen) } as CSSProperties} />
      </div>
    </div>
  );
}

export function AppScreens({ screens, variant, sizes, caption, reveal, className }: AppScreensProps) {
  const safety = variant === "safety";
  const solo = variant === "product" && screens.length === 1;
  const devices = screens.map((screen, i) => <Device key={i} screen={screen} sizes={sizes} compact={!safety} />);
  return (
    <figure
      className={clsx("ks-shots", variant === "product" && "ks-shots--product", safety && "ks-shots--safety", solo && "ks-shots--solo", className)}
      data-reveal={reveal ? "" : undefined}
    >
      {solo || safety ? devices : <div className={clsx("ks-shots__row", screens.length === 1 && "ks-shots__row--one")}>{devices}</div>}
      {caption ? <figcaption className="kh-caption">{caption}</figcaption> : null}
    </figure>
  );
}
