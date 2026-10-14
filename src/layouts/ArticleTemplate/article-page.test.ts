import { describe, expect, expectTypeOf, it } from "vitest";
import { JOURNAL_IMAGES } from "@/config/journal";
import type { Article } from "@/content/types";
import { getArticle } from "@/content/en-IN/stories/articles";
import { uploadCardSize, uploadCardUrl } from "@/lib/journal/to-article";
import type { OgImage } from "@/lib/seo/metadata";
import { articleMeta } from "./article-page";

/* The article page's metadata (task 4.2; ADR-014, journal-pipeline §6; the hand-off of task 8b.2d's review to 8b.2e): a
 * journal post's share card is its DS photo's 1200 x 630 card, or, for a post with an uploaded cover and no DS photo, the
 * cover through this site's optimiser at the size it serves. `Article.meta.og` is an `OgImage`, so that size reaches
 * pageMeta typed, and share tools are told the size they will get. */

const COVER = `${JOURNAL_IMAGES}a-cover.jpg`;

/** A published guide with its share card replaced by an uploaded cover's, as the adapter writes it (to-article.ts). */
function withCover(width: number, height: number): Article {
  const guide = getArticle("learning-toys-for-a-three-year-old");
  if (guide === undefined) throw new Error("the registry has no learning-toys guide");
  const alt = "A child reads a picture book with a parent on a sofa.";
  return { ...guide, meta: { ...guide.meta, og: { image: uploadCardUrl(COVER), alt, ...uploadCardSize(width, height) } } };
}

describe("articleMeta", () => {
  it("types an article's share card as an OgImage: an optional size beside the image and its words", () => {
    expectTypeOf<Article["meta"]["og"]>().toEqualTypeOf<OgImage>();
  });

  it("tells share tools an uploaded cover's own size, served by this site's optimiser", () => {
    const meta = articleMeta(withCover(1440, 810));
    const card = { url: `/_next/image?url=${encodeURIComponent(COVER)}&w=1200&q=75`, width: 1200, height: 675, alt: "A child reads a picture book with a parent on a sofa." };
    expect(meta.openGraph?.images).toEqual([card]);
    expect(meta.twitter?.images).toEqual([{ url: card.url, alt: card.alt }]);
  });

  it("never enlarges a narrow cover: its own width and height", () => {
    expect(articleMeta(withCover(800, 600)).openGraph?.images).toEqual([expect.objectContaining({ width: 800, height: 600 })]);
  });

  it("keeps the cut cards' 1200 x 630 for a guide headed by a DS photo", () => {
    const guide = getArticle("learning-toys-for-a-three-year-old")!;
    expect(articleMeta(guide).openGraph?.images).toEqual([{ url: guide.meta.og.image, width: 1200, height: 630, alt: guide.meta.og.alt }]);
  });
});
