import { readdirSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import type { Article } from "@/content/types";
import { ARTICLE_SLUGS } from "@/content/en-IN/routes";
import { CTAS } from "@/lib/tracking/cta";
import { ARTICLE_CLOSES, stickyBarPaths } from "./sticky-bar-paths";

/* Where the phone buy bar shows (task 3.1; structure §5 "Sticky bar" column; architecture §8.3 `sticky-bar`). The
 * shell is a layout, so it gives the bar the list of paths it belongs on: the CTA registry's placements for
 * `sticky-bar`, with its "articles-with-close" group resolved from each article's own close (B5). This proves that
 * list equal to every approved mockup page's own "buybar" meta, so the registry, the mockups and the bar agree. */

const paths = stickyBarPaths();

/** Each approved mockup page's URL and "buybar" flag, from its meta comment (mockup/build.mjs). */
const mockupMeta = readdirSync("mockup/pages")
  .filter((f) => f.endsWith(".html") && f !== "index.html")
  .map((f) => {
    const meta = JSON.parse(/^<!--page (\{.*\}) -->/.exec(readFileSync(`mockup/pages/${f}`, "utf8"))![1]) as { url: string; buybar?: boolean };
    return { file: f, url: meta.url, buybar: meta.buybar === true };
  });

describe("stickyBarPaths", () => {
  it("covers exactly the marketing mockup pages whose meta says buybar (the store and the 404 have their own shells)", () => {
    for (const { file, url, buybar } of mockupMeta) {
      if (!url.startsWith("/") || url === "/404") continue;
      expect((paths as readonly string[]).includes(url), `${file} (${url}) buybar ${buybar}`).toBe(buybar);
    }
  });

  it("adds every article whose close carries the pre-order button, and leaves out the keep-reading close (B5)", () => {
    const withClose = ARTICLE_SLUGS.filter((slug) => ARTICLE_CLOSES[slug] === "journal").map((slug) => `/stories/${slug}`);
    expect(paths.filter((p) => p.startsWith("/stories/"))).toEqual(withClose);
    expect(paths).not.toContain("/stories/talking-toys-and-late-talkers");
    expect(paths).toContain("/stories/learning-toys-for-a-three-year-old");
    expect(withClose).toHaveLength(ARTICLE_SLUGS.length - 1);
  });

  it("lists the registry's own page placements for sticky-bar, in its order, each once", () => {
    const pages = CTAS["sticky-bar"].pages.filter((p) => p.startsWith("/"));
    expect(paths.filter((p) => !p.startsWith("/stories/"))).toEqual(pages);
    expect(paths).toEqual([...new Set(paths)]);
  });

  it("reads the close of every article module of the URL plan, and of nothing else", async () => {
    expect(Object.keys(ARTICLE_CLOSES).sort()).toEqual([...ARTICLE_SLUGS].sort());
    for (const slug of ARTICLE_SLUGS) {
      const mod = (await import(`../../content/en-IN/stories/articles/${slug}.ts`)) as { article: Article };
      expect(ARTICLE_CLOSES[slug], slug).toBe(mod.article.close);
    }
  });

  it("refuses a registry placement it cannot place (a group other than articles-with-close)", () => {
    expect(() => stickyBarPaths(["/", "every-marketing-page"])).toThrow(/every-marketing-page/);
  });
});
