import { describe, expect, it } from "vitest";
// @ts-expect-error: a plain .mjs build tool, imported for its pure functions
import { shrinkProblem, validatePosts } from "../tools/blog/validate.mjs";
import data from "@/lib/stories.data.json";

/** The journal is written in the admin dashboard and pulled in before every build by
 *  tools/blog/sync.mjs (2026-10-13). These guard the gate that decides whether a build
 *  may ship what the API returned: a broken post or a gutted journal must fail the
 *  build, so Vercel keeps the last good deployment live. */
describe("blog sync gate", () => {
  it("passes the committed snapshot", () => {
    expect(validatePosts(data)).toEqual([]);
    expect((data as unknown[]).length).toBeGreaterThanOrEqual(22);
  });

  it("refuses a post the pages could not render", () => {
    const good = (data as Record<string, unknown>[])[0];
    expect(validatePosts([{ ...good, slug: "Bad Slug" }])[0]).toMatch(/bad slug/);
    expect(validatePosts([{ ...good, updated: "2020-01-01" }])[0]).toMatch(/updated before published/);
    expect(validatePosts([{ ...good, pose: "angry" }])[0]).toMatch(/unknown pose/);
    expect(validatePosts([{ ...good, body: { type: "doc", content: [{ type: "script" }] } }])[0]).toMatch(/unknown block/);
    expect(validatePosts([good, good])[0]).toMatch(/duplicate slug/);
    expect(validatePosts({ posts: [] })).toEqual(["the blog API did not return a list of posts"]);
  });

  it("refuses a journal that suddenly lost half its articles", () => {
    expect(shrinkProblem(22, 0)).toMatch(/returned 0 posts where the last build had 22/);
    expect(shrinkProblem(22, 10)).toMatch(/BLOG_ALLOW_SHRINK/);
    expect(shrinkProblem(22, 11)).toBeNull();
    expect(shrinkProblem(22, 25)).toBeNull();
  });
});
