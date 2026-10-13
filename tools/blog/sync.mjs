#!/usr/bin/env node
/** Journal sync (2026-10-13): pull every published post from the dashboard's blog API
 *  into src/lib/stories.data.json, which `src/lib/stories.ts` reads. Runs before
 *  `next build` (package.json), so every article is still a fully static page.
 *
 *  Writers draft in the admin dashboard (admin.kheelona.com → Blog), an admin
 *  publishes, and publishing triggers a Vercel deploy hook, whose build runs this.
 *
 *  FAILS THE BUILD rather than shipping a wrong journal: when the API cannot be
 *  reached, returns a malformed post, or suddenly returns far fewer posts than the
 *  last build had. Vercel then keeps the previous deployment live.
 *
 *  BLOG_SYNC=off           use the committed snapshot as it is (no network)
 *  BLOG_API_URL            default https://api.kheelona.com/v1
 *  BLOG_ALLOW_SHRINK=1     accept a large drop in the number of posts, once
 *
 *  Run by hand: node tools/blog/sync.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { shrinkProblem, validatePosts } from "./validate.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SNAPSHOT = join(root, "src/lib/stories.data.json");
const API = (process.env.BLOG_API_URL || "https://api.kheelona.com/v1").replace(
  /\/$/,
  "",
);

if (process.env.BLOG_SYNC === "off") {
  console.log(
    "blog-sync: skipped (BLOG_SYNC=off), using the committed snapshot",
  );
  process.exit(0);
}

async function fetchPosts() {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      const res = await fetch(`${API}/public/blog/posts`, {
        headers: { accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      return body?.data?.posts;
    } catch (err) {
      lastError = err;
      await new Promise((r) => setTimeout(r, attempt * 2000));
    }
  }
  throw lastError;
}

const fail = (message) => {
  console.error(`blog-sync: FAILED — ${message}`);
  process.exit(1);
};

let posts;
try {
  posts = await fetchPosts();
} catch (err) {
  fail(`could not reach ${API}/public/blog/posts (${err.message})`);
}

const problems = validatePosts(posts);
if (problems.length) fail(problems.join("; "));

const previous = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const shrink = shrinkProblem(previous.length, posts.length);
if (shrink && process.env.BLOG_ALLOW_SHRINK !== "1") fail(shrink);

/* Compare DATA, not text: Postgres jsonb returns object keys in its own order, so a
   text compare would rewrite the whole file on every build with nothing changed. */
const canonical = (v) =>
  Array.isArray(v)
    ? `[${v.map(canonical).join(",")}]`
    : v && typeof v === "object"
      ? `{${Object.keys(v)
          .sort()
          .map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`)
          .join(",")}}`
      : JSON.stringify(v);
const changed = canonical(posts) !== canonical(previous);
if (changed) writeFileSync(SNAPSHOT, `${JSON.stringify(posts, null, 2)}\n`);
console.log(
  `blog-sync: ${posts.length} posts${changed ? " (snapshot updated)" : " (unchanged)"}`,
);
