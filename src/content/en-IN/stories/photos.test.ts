import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { describe, expect, it } from "vitest";
import type { Article, ImageRef } from "@/content/types";
import { ROOT } from "../../../../test/e2e/support/repo";
import { articles } from "./articles";
import { photos } from "./photos";

/* The journal's photo table (ADR-014; journal-pipeline §6, §8.2 rows 12 and 21): every DS image a post may name by key,
 * with its one alt, its share card if it can head a guide, and its shape. A post names a photo; the site supplies the
 * picture, the words for it and the card, so one image never carries two alts (rule 21, by construction). */

/** The image's DS file, as a path from the repo root (Vitest loads an image import as its address). */
const fileOf = (image: ImageRef) => decodeURIComponent(String(image.src)).replace(/^\//, "").split("?")[0];
const entries = Object.entries(photos);
const heads = entries.filter(([, p]) => "card" in p);

/** Every DS image the 20 guide modules use (task 8b.2e exports them as keys): the head photo, a body photo, the
 *  facts list's photo. */
const used = (Object.values(articles) as Article[]).flatMap((a) => [
  a.head.image!,
  ...a.body.flatMap((b) =>
    b.kind === "figure" ? [b.image] : b.kind === "part" ? b.blocks.flatMap((x) => (x.kind === "figure" ? [x.image] : x.kind === "facts" && x.figure ? [x.figure] : [])) : [],
  ),
]);
const keyOf = (image: ImageRef) => entries.find(([, p]) => p.image.src === image.src)?.[0];

describe("the journal's photo table", () => {
  it("lists the 13 head photos that have share cards, and the DS images the guides' bodies use (journal-pipeline §13)", () => {
    expect(heads.map(([key]) => key).sort()).toEqual([
      "advik-01-counting-carriages",
      "advik-04-floor-train",
      "ira-01-story-on-the-bed",
      "ira-02-drawing-the-dragon",
      "ira-04-paper-crown",
      "kabir-02-block-rocket",
      "kabir-03-homework-desk",
      "kabir-04-planet-book",
      "myra-04-drawing-at-home",
      "tara-01-naming-feelings",
      "tara-02-evening-with-amma",
      "tara-03-bedtime-with-baba",
      "tara-04-reading-nook",
    ]);
    expect(entries.filter(([, p]) => !("card" in p)).map(([key]) => key)).toEqual(["kheelu-belly-module"]);
  });

  it("names each image by its DS file: a photo-library web file, or the Kheelu render", () => {
    for (const [key, { image }] of entries) {
      expect([`design-system/project/assets/Photo library/${key}-web.webp`, `design-system/project/assets/Kheelu/${key}.png`], key).toContain(fileOf(image));
      expect(existsSync(join(ROOT, fileOf(image))), key).toBe(true);
    }
  });

  it("gives every head photo its card, cut by scripts/assets/build-og.mjs: /og/<key>.jpg, and no other card exists", () => {
    for (const [key, photo] of heads) {
      expect("card" in photo && photo.card, key).toBe(`/og/${key}.jpg`);
      expect(existsSync(join(ROOT, "public", `/og/${key}.jpg`)), key).toBe(true);
    }
    const cards = readdirSync(join(ROOT, "public/og")).filter((f) => f !== "kheelu.jpg");
    expect(cards.sort()).toEqual(heads.map(([key]) => `${key}.jpg`).sort());
  });

  it("marks wide exactly the photos 1.6 or more times as wide as tall (a body photo's 16:9 frame, §5.1)", async () => {
    for (const [key, photo] of entries) {
      const { width, height } = await sharp(join(ROOT, fileOf(photo.image))).metadata();
      expect("wide" in photo && photo.wide === true, `${key} ${width} x ${height}`).toBe(width! / height! >= 1.6);
    }
  });

  it("words each image once, in plain text (no inline syntax: an alt is read aloud as written)", () => {
    for (const [key, { image }] of entries) {
      expect(image.alt.length, key).toBeGreaterThan(20);
      expect(image.alt, key).not.toMatch(/[{}[\]]/);
    }
  });
});

describe("the guides against the table (rule 21: one alt per DS image)", () => {
  it("use no DS image the table does not list", () => {
    expect(used.filter((image) => keyOf(image) === undefined).map(fileOf)).toEqual([]);
  });

  it("word every image as the table does", () => {
    for (const image of used) expect(image.alt, keyOf(image)).toBe(photos[keyOf(image) as keyof typeof photos].image.alt);
  });

  it("head every guide with a photo that has a card, and share that card", () => {
    for (const article of Object.values(articles) as Article[]) {
      const key = keyOf(article.head.image!)!;
      const photo = photos[key as keyof typeof photos];
      expect("card" in photo && photo.card, article.slug).toBe(article.meta.og.image);
      expect(article.meta.og.alt, article.slug).toBe(photo.image.alt);
    }
  });
});
