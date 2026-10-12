import type { Copy, IconRef, SitePath, Tone } from "@/content/types";

/** One way on from the empty state: a DS list row with its icon tile in a tone. */
export interface EmptyStateLink {
  readonly icon: IconRef;
  readonly tone?: Tone;
  readonly title: string;
  readonly sub?: string;
  readonly href: SitePath;
}

/**
 * EmptyStateSection's configuration (the 404, pages/not-found.ts): the icon in the circle, the page's one heading
 * (eyebrow, h1, lead) and the labelled ways on.
 */
export interface EmptyStateSectionConfig {
  readonly icon: IconRef;
  readonly tone?: Tone;
  readonly eyebrow?: Copy;
  readonly title: Copy;
  readonly lead?: Copy;
  readonly nav: { readonly label: string; readonly links: readonly EmptyStateLink[] };
  /** The h1's id, which names the section ("nf-title" by default). */
  readonly id?: string;
}
