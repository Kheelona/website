import type { SitePath } from "@/content/types";
import { CANONICAL_ORIGIN } from "@/config/env";
import { isSitePath } from "@/lib/links";

/**
 * Absolute URLs and stable entity ids for structured data (ADR-012, architecture §9.2).
 *
 * JSON-LD needs absolute URLs, and they always name the production site: a beta page's graph
 * describes kheelona.com, never itself (`CANONICAL_ORIGIN`, D048).
 */

/** `/products/kheelu` → `https://kheelona.com/products/kheelu`; the home page is the bare origin,
 *  as the live graph has always written it. In-page anchors are kept. Anything but a site path
 *  (`isSitePath`: `//host` and `/\host` are another site) throws. */
export function absoluteUrl(path: SitePath): string {
  if (!isSitePath(path)) {
    throw new Error(`absoluteUrl takes a site path such as "/products/kheelu", not "${path}"`);
  }
  return path === "/" ? CANONICAL_ORIGIN : `${CANONICAL_ORIGIN}${path}`;
}

/*
 * The entity ids. Opaque identifiers, not links: consumers that already know these entities match
 * them by the exact string, so they are written out in full and never derived from a value that
 * could move (lessons §6).
 */

/** The publisher. The site shell declares it once; every other node points at it. */
export const ORGANIZATION_ID = "https://kheelona.com/#organization";

export const WEBSITE_ID = "https://kheelona.com/#website";

/**
 * Kheelu. It deliberately still says `lumi` after the 2026-09-05 rename and must never be "fixed"
 * to match the route: it is how every consumer recognises the renamed product as the same one
 * (architecture §9.2). The navigable address is the Offer's `url`. Never shown in the UI.
 */
export const KHEELU_PRODUCT_ID = "https://kheelona.com/products/lumi#product";

/** A person's id: a fragment of the team page made from their name, exactly the ids the live
 *  graph published ("Kashyap C.R" → `…/team#kashyap-c-r`), so author links keep resolving. */
export function personId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  if (slug === "") throw new Error(`personId needs a name with letters or digits, not "${name}"`);
  return `${absoluteUrl("/team")}#${slug}`;
}
