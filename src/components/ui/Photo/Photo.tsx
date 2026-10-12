import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ImageRef } from "@/content/types";
import { imageSource, loadingFor } from "./image";

/* A photo in the DS frame (task 2.3; DS kh-photo, bundle.css:1150-1155; ADR-010). The approved markup is
 * `<figure class="kh-photo [--wide|--square] [--xl]"><img …><figcaption?></figure>` (home.html:170,
 * meet-kheelu.html:141 and 157, safety.html:15, setup.html:99-102). The DS frame crops to 4:5 unless the variant
 * or `ratio` says otherwise; `ratio` is the DS's own --kh-ratio variable, set inline on the image as the mockup
 * does (setup.html:100), the one inline style a photo may carry (architecture §4.4). */

/** A CSS aspect ratio, "width / height". */
export type MediaRatio = `${number} / ${number}`;

export interface PhotoProps {
  readonly image: ImageRef;
  /** The rendered width at each layout (360, 390 and 1440 px): required, so the phone never fetches a laptop image. */
  readonly sizes: string;
  /** The DS frame: 4:5 by default, `wide` 16:9, `square` 1:1. */
  readonly variant?: "wide" | "square";
  /** The larger DS radius (`kh-photo--xl`). */
  readonly xl?: boolean;
  /** Any other ratio, as the DS --kh-ratio variable. */
  readonly ratio?: MediaRatio;
  readonly caption?: ReactNode;
  /** The page's one LCP image: eager, fetchpriority high. */
  readonly lcp?: boolean;
  /** The fetchpriority attribute of an image that is not the LCP (`low` lets the LCP image's request go first). It
   *  changes nothing else: the image still loads lazily. Ignored with `lcp`, which always asks for high. */
  readonly fetchPriority?: "low" | "auto";
  /** Fades in once on scroll (D049 pick 1); never on the LCP image. */
  readonly reveal?: boolean;
  /** The section's own composition class (`ks-…`). */
  readonly className?: string;
}

export function Photo({ image, sizes, variant, xl, ratio, caption, lcp, fetchPriority, reveal, className }: PhotoProps) {
  if (lcp && reveal) throw new Error("The LCP photo never fades in on scroll (D049 pick 2, architecture §11.2)");
  const load = loadingFor(lcp);
  return (
    <figure className={clsx("kh-photo", variant && `kh-photo--${variant}`, xl && "kh-photo--xl", className)} data-reveal={reveal ? "" : undefined}>
      <Image
        {...imageSource(image)}
        alt={image.alt}
        sizes={sizes}
        loading={load.loading}
        fetchPriority={"fetchPriority" in load ? load.fetchPriority : fetchPriority}
        style={{ "--kh-ratio": ratio } as CSSProperties}
      />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
