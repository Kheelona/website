import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { STORIES } from "@/lib/stories";

/**
 * Search results clip what they display. A title past roughly 60 characters and
 * a description past roughly 160 get cut with an ellipsis, which costs
 * click-through on a site whose whole job is turning a parent into a
 * reservation. Ahrefs flagged five of each on 2026-08-12.
 *
 * Four of the five long titles were long for one silly reason: they printed the
 * brand twice, once by hand and once from the root layout's `%s · Kheelona`
 * template. This guard exists so that never comes back, and so a new page
 * cannot quietly ship a 200-character description again.
 *
 * Titles and descriptions are read out of the page sources as text, the same
 * way `redirects-vs-assets.test.ts` reads the redirect config: importing a page
 * module would drag in React and the Next runtime for two strings, and text
 * keeps the guard honest about what a reviewer actually sees in the file.
 */

const ROOT = process.cwd();

/** The root layout appends this to every CHILD segment's title. */
const SUFFIX = " · Kheelona";
const TITLE_CAP = 65; // ~60 of content plus the dot separator
const DESCRIPTION_CAP = 160;

/** Root-segment pages do NOT receive their own layout's title template, so they
 *  write the brand themselves and must not have the suffix added twice here. */
const ROOT_SEGMENT = new Set(["src/app/page.tsx"]);

/** Home is over the cap on purpose (founder, 2026-08-12): its title is one of
 *  exactly four sanctioned homes for the tutor narrative and carries the head
 *  keywords, and truncation costs click-through rather than rank. Recorded as a
 *  decision rather than left as a silent gap. */
const TITLE_EXEMPT = new Set(["src/app/page.tsx"]);

const PAGES = [
  "src/app/page.tsx",
  "src/app/products/lumi/page.tsx",
  "src/app/playos/page.tsx",
  "src/app/safety/page.tsx",
  "src/app/setup/page.tsx",
  "src/app/team/page.tsx",
  "src/app/stories/page.tsx",
  "src/app/contact/page.tsx",
  "src/app/privacy/page.tsx",
  "src/app/terms/page.tsx",
];

/** Pulls the first `title:` / `description:` string literal out of a page's
 *  `pageMeta({ ... })` call. Both are single-line double-quoted strings. */
function readMeta(file: string) {
  const src = readFileSync(join(ROOT, file), "utf8");
  const title = src.match(/\btitle:\s*("(?:[^"\\]|\\.)*")/)?.[1];
  const description = src.match(/\bdescription:\s*\n?\s*("(?:[^"\\]|\\.)*")/)?.[1];
  return {
    title: title ? (JSON.parse(title) as string) : undefined,
    description: description ? (JSON.parse(description) as string) : undefined,
  };
}

describe("search-result metadata stays inside what Google displays", () => {
  it("finds a title and a description on every page", () => {
    for (const file of PAGES) {
      const { title, description } = readMeta(file);
      expect(title, `${file} has no title`).toBeTruthy();
      expect(description, `${file} has no description`).toBeTruthy();
    }
  });

  it.each(PAGES)("%s has a title that fits", (file) => {
    const { title } = readMeta(file);
    const rendered = ROOT_SEGMENT.has(file) ? title! : title! + SUFFIX;
    if (TITLE_EXEMPT.has(file)) {
      expect(rendered.length).toBeLessThanOrEqual(80);
      return;
    }
    expect(rendered.length).toBeLessThanOrEqual(TITLE_CAP);
  });

  it.each(PAGES)("%s has a description that fits", (file) => {
    const { description } = readMeta(file);
    expect(description!.length).toBeLessThanOrEqual(DESCRIPTION_CAP);
  });

  it("never prints the brand twice in one title", () => {
    for (const file of PAGES) {
      const { title } = readMeta(file);
      const rendered = ROOT_SEGMENT.has(file) ? title! : title! + SUFFIX;
      const brandCount = rendered.split("Kheelona").length - 1;
      expect(brandCount, `${file}: "${rendered}"`).toBeLessThanOrEqual(1);
    }
  });

  /* Article headlines get a looser cap than marketing-page titles, and the
     difference is deliberate. A page title above is mine to shape, and four of
     the five long ones were long only because they printed the brand twice —
     free to fix. A story's `title` is its published headline AND the H1 on the
     page AND the label on its journal card, so trimming one for search display
     rewrites approved editorial copy and can cost the head keyword
     ("brain development toys" is the whole point of that piece). Same call the
     founder made for Home on 2026-08-12: truncation costs click-through, not
     rank. Three sit between 65 and 80 today; the cap stops a fourth from
     drifting further. */
  const STORY_TITLE_CAP = 80;

  it("keeps every journal article inside the editorial budget", () => {
    for (const story of STORIES) {
      expect(
        (story.title + SUFFIX).length,
        `story title too long: ${story.slug}`,
      ).toBeLessThanOrEqual(STORY_TITLE_CAP);
      expect(
        story.description.length,
        `story description too long: ${story.slug}`,
      ).toBeLessThanOrEqual(DESCRIPTION_CAP);
    }
  });
});
