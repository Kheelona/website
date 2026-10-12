import type { StaticImageData } from "next/image";
import type { ImageRef } from "@/content/types";

/* Raster helpers shared by the media primitives, the only components that render next/image (task 2.3; ADR-010,
 * architecture §10): Photo, ArtBoard, ImaginationFrame, AppScreens and Avatar. */

/** next/image's source props for an image: a static import carries its own size; a site path states it. */
export function imageSource(ref: ImageRef): { src: StaticImageData | string; width?: number; height?: number } {
  return "width" in ref ? { src: ref.src, width: ref.width, height: ref.height } : { src: ref.src };
}

/** The image's height over its width. */
export function imageRatio(ref: ImageRef): number {
  const { width, height } = "width" in ref ? ref : ref.src;
  return height / width;
}

/**
 * Loading hints. The one LCP image of a page loads eagerly at high priority; everything else is lazy. Never
 * `priority` or `preload`: Next 16 deprecates `priority` and its docs prefer these two attributes in most cases
 * (node_modules/next/dist/docs/01-app/03-api-reference/02-components/image.md, "preload" and "priority"; N12).
 */
export function loadingFor(lcp: boolean | undefined): { loading: "eager"; fetchPriority: "high" } | { loading: "lazy" } {
  return lcp ? { loading: "eager", fetchPriority: "high" } : { loading: "lazy" };
}

/** `s` split at each `sep` outside parentheses; throws on unbalanced parentheses. */
function splitTopLevel(s: string, sep: RegExp): string[] {
  const out: string[] = [];
  let depth = 0;
  let from = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(") depth++;
    else if (ch === ")") {
      if (--depth < 0) throw new Error(`Unbalanced parentheses in sizes "${s}"`);
    } else if (depth === 0 && sep.test(ch)) {
      out.push(s.slice(from, i));
      from = i + 1;
    }
  }
  if (depth !== 0) throw new Error(`Unbalanced parentheses in sizes "${s}"`);
  out.push(s.slice(from));
  return out;
}

/**
 * A `sizes` value scaled by `factor`: each entry's length becomes `calc(length * factor)`, its media condition
 * unchanged. An art-board layer is `width`% of its board, and a zoomed photo is painted larger than its frame,
 * so each asks for its share of the layout's own `sizes` (ADR-010: every call site passes the layout's sizes).
 */
export function scaleSizes(sizes: string, factor: number): string {
  if (!(factor > 0) || !Number.isFinite(factor)) throw new Error(`A sizes factor must be a positive number, not ${factor}`);
  const entries = splitTopLevel(sizes, /,/).map((e) => e.trim());
  if (!entries.length || entries.some((e) => !e)) throw new Error(`Empty entry in sizes "${sizes}"`);
  if (factor === 1) return entries.join(", ");
  const f = String(Math.round(factor * 1e4) / 1e4);
  return entries
    .map((entry) => {
      const words = splitTopLevel(entry, /\s/).filter(Boolean);
      const length = words.pop()!;
      const inner = /^calc\(.*\)$/i.test(length) ? `(${length.slice(5, -1)})` : length;
      return [...words, `calc(${inner} * ${f})`].join(" ");
    })
    .join(", ");
}
