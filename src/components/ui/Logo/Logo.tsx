import clsx from "clsx";
import type { StaticImageData } from "next/image";
import Link from "next/link";
import logoFile from "@ds/assets/Logo/kheelona-logo.svg";

/** The logo's height on every approved page (partials/nav.html, drawer.html, footer.html; store.html), the HTML
 *  attribute the mockup sets; the DS minimum is 20 px. */
const LOGO_HEIGHT = 30;

/**
 * The DS logo file as a URL, with the width that keeps its proportions at `height` when the bundler knows the
 * file's size (Next's static import), so the browser reserves the box before the file arrives. Vite (Storybook,
 * Vitest) gives a bare URL; the browser then sizes it on load, as the mockup's height-only image does.
 */
export function logoImage(file: string | StaticImageData, height: number): { src: string; width: number | undefined } {
  if (typeof file === "string") return { src: file, width: undefined };
  return { src: file.src, width: Math.round((file.width * height) / file.height) };
}

export interface LogoProps {
  /** The image's text: "Kheelona, home" in a home link, "Kheelona" otherwise; from content. */
  alt: string;
  /** Makes it a `kh-logo-link`: a site path through next/link, another host (the store's link home) a plain `<a>`. */
  href?: string;
  /** A name on the link itself, as the store header has ("Kheelona home"). */
  linkLabel?: string;
  height?: number;
  className?: string;
}

/**
 * DS Logo (design-system/project/assets/Logo/kheelona-logo.svg, referenced from this one place): a plain `<img>`
 * of the DS file (architecture §10: DS SVGs as images from static imports), never retyped, optionally in the DS
 * logo link with its 48 px tap height.
 */
export function Logo({ alt, href, linkLabel, height = LOGO_HEIGHT, className }: LogoProps) {
  const { src, width } = logoImage(logoFile as string | StaticImageData, height);
  // A DS SVG as a plain <img>: next/image would add nothing to a vector (architecture §10).
  // eslint-disable-next-line @next/next/no-img-element
  const img = <img className={clsx("kh-logo", className)} src={src} alt={alt} width={width} height={height} />;
  if (href === undefined) return img;
  return href.startsWith("/") ? (
    <Link className="kh-logo-link" href={href} aria-label={linkLabel}>
      {img}
    </Link>
  ) : (
    <a className="kh-logo-link" href={href} aria-label={linkLabel}>
      {img}
    </a>
  );
}
