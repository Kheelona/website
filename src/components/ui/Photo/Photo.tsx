import clsx from "clsx";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import type { ImageRef } from "@/content/types";
import { cssRatio, imageSource, loadingFor } from "./image";

/* A photo in the DS frame (task 2.3; DS kh-photo, bundle.css:1150-1155; ADR-010). The approved markup is
 * `<figure class="kh-photo [--wide|--square] [--xl]"><img …><figcaption?></figure>` (home.html:170,
 * meet-kheelu.html:141 and 157, safety.html:15, setup.html:99-102). The DS frame crops to 4:5 unless the variant
 * or `ratio` says otherwise; `ratio` is the DS's own --kh-ratio variable, set inline on the image as the mockup
 * does (setup.html:100), the one inline style a photo may carry (architecture §4.4). */

/** A CSS aspect ratio, "width / height". */
export type MediaRatio = `${number} / ${number}`;

/** What both forms take: the image and Photo's loading and sizes rules. */
interface PhotoImage {
  readonly image: ImageRef;
  /** The rendered width at each layout (360, 390 and 1440 px): required, so the phone never fetches a laptop image. */
  readonly sizes: string;
  /** `true`: the page's one LCP image, eager, fetchpriority high. `"eager"`: a first-screen image that is the LCP at no
   *  width (Home's phone crop, CMO m14), eager with no priority hint, so the browser sets it (`loadingFor`). */
  readonly lcp?: boolean | "eager";
  /** The fetchpriority attribute of an image that is not the LCP (`low` lets the LCP image's request go first). It
   *  changes nothing else: the image still loads lazily, or eagerly with `lcp="eager"`. Ignored with `lcp` true, which
   *  always asks for high. */
  readonly fetchPriority?: "low" | "auto";
  /** The section's own composition class (`ks-…`): on the figure, or on the image in the bare form. */
  readonly className?: string;
}

/** The photo in the DS frame (`kh-photo`). */
interface FramedPhoto extends PhotoImage {
  readonly bare?: false;
  /** The DS frame: 4:5 by default, `wide` 16:9, `square` 1:1. */
  readonly variant?: "wide" | "square";
  /** The larger DS radius (`kh-photo--xl`). */
  readonly xl?: boolean;
  /** Any other ratio, as the DS --kh-ratio variable. */
  readonly ratio?: MediaRatio;
  readonly caption?: ReactNode;
  /** Fades in once on scroll (D049 pick 1); never on the LCP image. */
  readonly reveal?: boolean;
}

/** The bare form (task 3.6; architecture §10): the image alone, with no figure, frame or crop, for a DS raster a
 *  section places with its own class (ModesSection's `ks-know__img`, meet-kheelu.html fold 4). It carries its own
 *  ratio as `--kh-ratio` (`cssRatio`), which the section's class reads as `aspect-ratio: var(--kh-ratio)`, so
 *  next/image's whole-pixel renditions never move the folds below (task 4.6). */
interface BarePhoto extends PhotoImage {
  readonly bare: true;
  readonly variant?: never;
  readonly xl?: never;
  readonly ratio?: never;
  readonly caption?: never;
  readonly reveal?: never;
}

export type PhotoProps = FramedPhoto | BarePhoto;

export function Photo(props: PhotoProps) {
  const { image, sizes, lcp, fetchPriority, className } = props;
  const load = loadingFor(lcp);
  const source = { ...imageSource(image), sizes, loading: load.loading, fetchPriority: "fetchPriority" in load ? load.fetchPriority : fetchPriority };
  if (props.bare) return <Image {...source} alt={image.alt} className={className} style={{ "--kh-ratio": cssRatio(image) } as CSSProperties} />;
  const { variant, xl, ratio, caption, reveal } = props;
  if (lcp && reveal) throw new Error("The LCP photo, or an eager first-screen one, never fades in on scroll (D049 pick 2, architecture §11.2)");
  return (
    <figure className={clsx("kh-photo", variant && `kh-photo--${variant}`, xl && "kh-photo--xl", className)} data-reveal={reveal ? "" : undefined}>
      <Image {...source} alt={image.alt} style={{ "--kh-ratio": ratio } as CSSProperties} />
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
