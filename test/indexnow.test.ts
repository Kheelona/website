import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { changedUrls, ENDPOINT, HOST, payload, readKey, todayIST } from "../scripts/seo/indexnow-ping.mjs";

/* K-206: the IndexNow key file and the ping's URL selection (scripts/seo/indexnow-ping.mjs, .github/workflows/indexnow.yml). */
const ROOT = join(__dirname, "..");
const SITEMAP = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
<loc>https://kheelona.com</loc>
<lastmod>2026-11-24</lastmod>
<priority>1.0</priority>
</url>
<url>
<loc>https://kheelona.com/talking-toys-that-talk-back</loc>
<lastmod>2026-11-27</lastmod>
<priority>0.7</priority>
</url>
<url>
<loc>https://kheelona.com/ai-toys-for-kids-in-india</loc>
<lastmod>2026-11-26</lastmod>
<priority>0.8</priority>
</url>
<url>
<loc>https://kheelona.com/future</loc>
<lastmod>2026-11-28</lastmod>
</url>
<url>
<loc>https://kheelona.com/no-date</loc>
</url>
</urlset>`;

describe("IndexNow key file", () => {
  it("is exactly one public/<32 hex>.txt whose content is its own name", () => {
    const files = readdirSync(join(ROOT, "public")).filter((f) => f.endsWith(".txt"));
    expect(files).toHaveLength(1);
    const key = readKey();
    expect(key).toMatch(/^[0-9a-f]{32}$/);
    expect(readFileSync(join(ROOT, "public", `${key}.txt`), "utf8")).toBe(key);
  });
});

describe("IndexNow URL selection", () => {
  it("takes today and yesterday by default, never a future date or an undated URL", () => {
    expect(changedUrls(SITEMAP, "2026-11-27")).toEqual([
      "https://kheelona.com/talking-toys-that-talk-back",
      "https://kheelona.com/ai-toys-for-kids-in-india",
    ]);
  });

  it("widens with days, and one day means today only", () => {
    expect(changedUrls(SITEMAP, "2026-11-27", 1)).toEqual(["https://kheelona.com/talking-toys-that-talk-back"]);
    expect(changedUrls(SITEMAP, "2026-11-27", 4)).toContain("https://kheelona.com");
  });

  it("dates by India time", () => {
    expect(todayIST(new Date("2026-11-26T18:45:00Z"))).toBe("2026-11-27");
    expect(todayIST(new Date("2026-11-26T18:15:00Z"))).toBe("2026-11-26");
  });
});

describe("IndexNow request", () => {
  it("names the host, the key and its public location, and refuses another host", () => {
    const key = "0123456789abcdef0123456789abcdef";
    expect(payload(key, ["https://kheelona.com/a"])).toEqual({
      host: HOST,
      key,
      keyLocation: `https://kheelona.com/${key}.txt`,
      urlList: ["https://kheelona.com/a"],
    });
    expect(() => payload(key, ["https://store.kheelona.com/"])).toThrow();
    expect(ENDPOINT).toBe("https://api.indexnow.org/indexnow");
  });

  it("the workflow runs only on a successful Production deployment or by hand, with read-only permissions", () => {
    const wf = readFileSync(join(ROOT, ".github/workflows/indexnow.yml"), "utf8");
    expect(wf).toContain("github.event.deployment_status.state == 'success' && github.event.deployment.environment == 'Production'");
    expect(wf).toMatch(/permissions:\n {2}contents: read\n/);
    expect(wf).not.toMatch(/secrets\./);
  });
});
