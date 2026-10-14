import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import type { ImageRef, SitePath } from "@/content/types";
import { articleGraph, articleMeta } from "@/layouts/ArticleTemplate/article-page";
import { buildOffer } from "@/lib/offer/offer";
import { absoluteUrl } from "@/lib/seo/urls";
import { ROOT } from "../../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../../organization";
import { hubPage } from "../hub";
import { articles } from "./index";

/* Task 7.1f (CMO review B m4): a guide shared on WhatsApp previews its own head photo, never the studio product shot.
 * Each guide's share card is its head photo cut to 1200 x 630 by scripts/assets/build-og.mjs (public/og/<photo>.jpg,
 * named for the DS photo without "-web.webp"; guides with the same head photo share its one card, since a second copy
 * of the same bytes is refused by test/guards/asset-dupes.test.ts), with the head photo's one alt. The card is the
 * page's og:image and Twitter image (pageMeta) and the BlogPosting's image (articleGraph). The hub and every other
 * page keep DEFAULT_OG (public/og.png). test/guards/generated-icons.test.ts checks the cards themselves. */

/** The photo's file name, read from the module's image (Vitest loads it as an address; the build as an import). */
function photoFile(image: ImageRef): string {
  const src = image.src as unknown;
  return decodeURIComponent(typeof src === "string" ? src : (src as { src: string }).src)
    .split("/")
    .pop()!
    .split("?")[0];
}

const OFFER = buildOffer("full");
const GUIDES = Object.entries(articles);

describe.each(GUIDES)("the guide %s", (_slug, article) => {
  const head = article.head.image!;
  const card: SitePath = `/og/${photoFile(head).replace(/-web\.webp$/, "")}.jpg`;

  it("has a DS photo-library head photo, the source its card is cut from", () => {
    expect(photoFile(head)).toMatch(/^[a-z]+-\d{2}-[a-z-]+-web\.webp$/);
  });

  it("shares its head photo's card, with the head photo's words", () => {
    expect(article.meta.og).toEqual({ image: card, alt: head.alt });
    expect(existsSync(join(ROOT, "public", card)), card).toBe(true);
  });

  it("never shares the product shot (P19: the talking guides carry no pitch)", () => {
    expect(article.meta.og.image).not.toBe(DEFAULT_OG.image);
  });

  it("gives the card to share tools and to search engines: og:image, the Twitter image and the BlogPosting image", () => {
    const meta = articleMeta(article);
    expect(meta.openGraph?.images).toEqual([{ url: card, width: 1200, height: 630, alt: head.alt }]);
    expect(meta.twitter?.images).toEqual([{ url: card, alt: head.alt }]);
    const posting = articleGraph(article, OFFER)["@graph"].find((node) => node["@type"] === "BlogPosting");
    expect(posting?.image).toBe(absoluteUrl(card));
  });
});

describe("the share cards of the journal", () => {
  it("cover every guide: 20 guides, one card per distinct head photo", () => {
    expect(GUIDES).toHaveLength(20);
    const heads = new Set(GUIDES.map(([, a]) => photoFile(a.head.image!)));
    const cards = new Set(GUIDES.map(([, a]) => a.meta.og.image));
    expect(cards.size).toBe(heads.size);
  });

  it("leave the hub on the default card", () => {
    expect(hubPage.meta.og).toBe(DEFAULT_OG);
  });
});
