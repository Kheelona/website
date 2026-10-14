import { STORYBOOK_PORT } from "./support/env";
import { expect, requiresServer, settle, test } from "./support/fixtures";
import { APPROVED_WIDTHS } from "./support/viewports";

/* A journal photo inside a part (task 8b.2d, the hand-off from 8b.2c; journal-pipeline §5.1): the adapter keeps a photo
 * among a part's paragraphs inside the part, and the reading column gives it the space below its caption that a
 * paragraph has (article-body.css, `--space-4`), so the next paragraph never sits on the caption. The DS frame's own
 * margin is zero (bundle.css:1150). Measured on the fixture post kind-images, rendered through the adapter in the static
 * Storybook (ArticleBody.journal.stories.tsx, "Photos"), at the three approved widths; the photo between two parts keeps
 * the column's part spacing (`--space-7`), unchanged.
 *
 * Runs in the "site" project and opens the Storybook server Playwright starts beside the site (playwright.config.ts,
 * KH_STORYBOOK_PORT), as legal-template.spec.ts does. Prove it red by removing the `.ks-part > .kh-photo` rule from
 * src/components/sections/ArticleBody/article-body.css. */

const STORY = `http://localhost:${STORYBOOK_PORT}/iframe.html?id=sections-articlebody-journal-fixtures--photos&viewMode=story`;

requiresServer();

for (const vp of APPROVED_WIDTHS) {
  test(`a photo inside a part keeps the column's space below its caption: ${vp.name}`, async ({ harness }) => {
    const context = await harness.context(vp);
    const page = await context.newPage();
    await page.goto(STORY, { waitUntil: "load" });
    await page.locator("#storybook-root .ks-story-body .ks-part > figure.kh-photo").waitFor();
    await settle(page);

    const m = await page.evaluate(() => {
      /** A DS space token in pixels, as the page resolves it. */
      const space = (token: string) => {
        const probe = document.createElement("div");
        probe.style.height = `var(${token})`;
        document.body.append(probe);
        const height = probe.getBoundingClientRect().height;
        probe.remove();
        return height;
      };
      const box = (el: Element) => el.getBoundingClientRect();
      const inside = document.querySelector(".ks-story-body .ks-part > figure.kh-photo")!;
      const caption = inside.querySelector("figcaption")!;
      const before = inside.previousElementSibling!;
      const after = inside.nextElementSibling!;
      const between = document.querySelector(".ks-story-body .ks-prose > figure.kh-photo")!;
      return {
        s4: space("--space-4"),
        s7: space("--space-7"),
        tags: [before.tagName, after.tagName],
        captionText: caption.textContent,
        captionInFigure: box(caption).bottom <= box(inside).bottom + 0.5,
        above: box(inside).top - box(before).bottom,
        below: box(after).top - box(inside).bottom,
        betweenAbove: box(between).top - box(between.previousElementSibling!).bottom,
        betweenBelow: box(between.nextElementSibling!).top - box(between).bottom,
      };
    });

    expect(m.s4, "--space-4 resolves").toBeGreaterThan(0);
    expect(m.tags, "the photo sits between two paragraphs of its part").toEqual(["P", "P"]);
    expect(m.captionText).toBe("Stories at bedtime.");
    expect(m.captionInFigure, "the caption is inside the figure").toBe(true);
    expect(Math.round(m.below), `${vp.name}: the space below the caption`).toBe(Math.round(m.s4));
    expect(Math.round(m.above), `${vp.name}: the paragraph above keeps its own space`).toBe(Math.round(m.s4));
    expect([Math.round(m.betweenAbove), Math.round(m.betweenBelow)], `${vp.name}: the photo between parts keeps the parts' spacing`).toEqual([
      Math.round(m.s7),
      Math.round(m.s7),
    ]);
    console.log(`[journal-figure] ${vp.name}: below the caption ${m.below} px (--space-4 ${m.s4} px); between parts ${m.betweenAbove}/${m.betweenBelow} px`);
  });
}
