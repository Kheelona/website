// The journal sync, its source switch and the two build steps (task 8b.2b; ADR-014; journal-pipeline §2, §8.2, §12).
//
// scripts/journal/sync-posts.mjs ports main's sync (main:tools/blog/sync.mjs, main:test/blog-sync.test.ts): three tries
// of 20 s with waits of 2, 4 and 6 s, the `data.posts` envelope, the shrink rule and the data compare. It adds the
// mode (§2.1: the API only on a production build with JOURNAL_SOURCE "api", or by hand with BLOG_SYNC=on), the
// snapshot's order, `--check` (prove the import), `--split` (one file per post) and `--pages` (postbuild step 20).
//
// No test here makes a request. The functions take their fetch, sleep and timeout by argument; the spawned script and
// steps run with a fetch stub preloaded (NODE_OPTIONS --import) that logs every call and serves a fixture or throws.
// Every tree is a throwaway folder in the OS temp folder: nothing here writes into the repo.
import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { JOURNAL_API, JOURNAL_IMAGES, JOURNAL_POSTS_PATH, JOURNAL_SNAPSHOT, JOURNAL_SOURCE, VIDEO_STILLS } from "@/config/journal";
import { topics } from "@/content/en-IN/stories/topics";
import {
  BACKOFF_MS,
  fetchPosts,
  REGISTRY,
  resolveMode,
  RULES,
  run,
  syncNote,
  TIMEOUT_MS,
  TRIES,
} from "../scripts/journal/sync-posts.mjs";
import { findBanned } from "./guards/banned-phrases.data";

const REPO = join(__dirname, "..");
const SCRIPT = join(REPO, "scripts/journal/sync-posts.mjs");
const STEP_SYNC = join(REPO, "scripts/steps/prebuild/15-journal-sync.mjs");
const STEP_PAGES = join(REPO, "scripts/steps/postbuild/20-journal-pages.mjs");
const FIXTURE_TEXT = readFileSync(join(REPO, "test/fixtures/journal/posts.fixture.json"), "utf8");
const FIXTURE = JSON.parse(FIXTURE_TEXT) as { generated: string; posts: Post[] };
const POSTS_URL = `${JOURNAL_API}${JOURNAL_POSTS_PATH}`;

type Post = Record<string, unknown> & { slug: string };

/* ── fixtures ─────────────────────────────────────────────────────────────────────────────────────── */

const made: string[] = [];
afterAll(() => {
  for (const dir of made) rmSync(dir, { recursive: true, force: true });
});
afterEach(() => {
  vi.useRealTimers();
});

function tempDir(prefix: string): string {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  made.push(dir);
  return dir;
}

/** A throwaway repo root holding exactly these files (paths relative to the root). */
function tree(files: Record<string, string>): string {
  const root = tempDir("kh-journal-");
  for (const [path, body] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), body);
  }
  return root;
}

const posts = (): Post[] => structuredClone(FIXTURE.posts);

/** n valid posts: the fixture's four, cloned under new slugs (related emptied, which the ring fills). */
function journal(n: number): Post[] {
  return Array.from({ length: n }, (_, i) => {
    const p = structuredClone(FIXTURE.posts[i % FIXTURE.posts.length]);
    return { ...p, slug: `${p.slug}-${i}`, related: [] };
  });
}

const snapshotText = (list: unknown[], note = FIXTURE.generated) => `${JSON.stringify({ generated: note, posts: list }, null, 2)}\n`;

/** A root with the fixture (or the given text) as the committed snapshot. */
const rootWith = (snapshot: string | null = FIXTURE_TEXT, extra: Record<string, string> = {}) =>
  tree({ ...(snapshot === null ? {} : { [JOURNAL_SNAPSHOT]: snapshot }), ...extra });

/** The API's answer: main's envelope, as the live API sends it (journal-pipeline sources: status, data.posts). */
const envelope = (list: unknown) => ({ status: "success", data: { posts: list } });

type Call = { url: string; init: { headers?: Record<string, string>; signal?: unknown } };

/** Everything run() and fetchPosts() reach outside: a fetch that answers from a script, sleeps and timeouts that
 *  only record, and the log. */
function harness(answers: (() => unknown)[] = [], env: Record<string, string> = {}) {
  const calls: Call[] = [];
  const sleeps: number[] = [];
  const timeouts: number[] = [];
  const lines: string[] = [];
  let next = 0;
  const io = {
    env,
    fetch: async (url: string, init: Call["init"]) => {
      calls.push({ url, init });
      const answer = answers[Math.min(next++, answers.length - 1)];
      if (!answer) throw new Error("no network in this test");
      return answer();
    },
    sleep: async (ms: number) => {
      sleeps.push(ms);
    },
    timeout: (ms: number) => {
      timeouts.push(ms);
      return `signal:${ms}`;
    },
    log: (line: string) => lines.push(line),
    error: (line: string) => lines.push(line),
  };
  return { io, calls, sleeps, timeouts, lines, text: () => lines.join("\n") };
}

const ok = (body: unknown) => () => ({ ok: true, status: 200, json: async () => body });
const status = (code: number) => () => ({ ok: false, status: code, json: async () => ({}) });
const down = () => () => {
  throw new TypeError("fetch failed");
};

const readSnapshot = (root: string) => readFileSync(join(root, JOURNAL_SNAPSHOT), "utf8");
const mtime = (root: string) => statSync(join(root, JOURNAL_SNAPSHOT)).mtimeMs;

/* ── src/config/journal.ts and src/lib/journal/validate.ts import nothing ─────────────────────────── */

/* next.config.ts imports journal.ts by relative path, where Next resolves no `@/` alias, and the sync script imports
   both files with Node's type stripping: an import, an enum or a namespace in either breaks both (as env.ts). */
describe.each(["src/config/journal.ts", "src/lib/journal/validate.ts"])("%s stays importable from anywhere", (path) => {
  const source = readFileSync(join(REPO, path), "utf8");

  it("has no imports", () => {
    expect(source).not.toMatch(/^\s*import\b/m);
    expect(source).not.toMatch(/\bfrom\s+["']/);
    expect(source).not.toMatch(/\brequire\(/);
    expect(source).not.toMatch(/\bimport\(/);
  });

  it("loads in plain Node 24 with type stripping, with nothing but the file", () => {
    const script = [
      `const m = await import(${JSON.stringify(join(REPO, path))});`,
      `process.stdout.write(JSON.stringify(Object.keys(m).sort()));`,
    ].join("\n");
    const out = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "--eval", script], {
      encoding: "utf8",
      env: { PATH: process.env.PATH ?? "", NODE_ENV: "test" as const },
    });
    expect(out.stderr).toBe("");
    expect(JSON.parse(out.stdout).length).toBeGreaterThan(3);
  });
});

describe("src/config/journal.ts: the source switch", () => {
  /* The flip is one commit, with the founder's OK, after the import is proven (journal-pipeline §9.1 step 8, D059
     item 3); that commit changes this line too. */
  it('is "api": the 20 guides were imported and --check proved them unchanged', () => {
    expect(JOURNAL_SOURCE).toBe("api");
  });

  it("names the API, its posts and image paths, the video stills and the snapshot", () => {
    expect(JOURNAL_API).toBe("https://api.kheelona.com/v1");
    expect(POSTS_URL).toBe("https://api.kheelona.com/v1/public/blog/posts");
    expect(JOURNAL_IMAGES).toBe("https://api.kheelona.com/v1/public/blog/images/");
    expect(VIDEO_STILLS).toBe("https://i.ytimg.com/vi/");
    expect(JOURNAL_SNAPSHOT).toBe("src/content/en-IN/stories/posts.generated.json");
  });

  it("feeds the script's rules: the topic titles, the image folder, the banned list", () => {
    expect(RULES.themes).toEqual(topics.map((t) => t.title));
    expect(RULES.imagesBase).toBe(JOURNAL_IMAGES);
    expect(RULES.findBanned).toBe(findBanned);
  });
});

/* ── the mode table (journal-pipeline §2.1), every row ───────────────────────────────────────────── */

const VERCEL = {
  production: { VERCEL: "1", VERCEL_ENV: "production", VERCEL_GIT_COMMIT_REF: "main" },
  beta: { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "beta" },
  preview: { VERCEL: "1", VERCEL_ENV: "preview", VERCEL_GIT_COMMIT_REF: "reset/website-v2" },
};

describe("the mode: where the journal comes from (journal-pipeline §2.1)", () => {
  const ROWS: [string, Record<string, string>, "snapshot" | "api", "snapshot" | "api"][] = [
    ["npm run verify (Vitest, local and CI)", { NODE_ENV: "test" }, "snapshot", "snapshot"],
    ["npm run dev and Storybook", { NODE_ENV: "development" }, "snapshot", "snapshot"],
    ["npm run verify:e2e (a local production build)", { NODE_ENV: "production" }, "snapshot", "snapshot"],
    ["the Gate B dry run, before the flip", { KH_SITE_ENV: "production" }, "snapshot", "snapshot"],
    ["the Gate B dry run after the flip, offline (BLOG_SYNC=off)", { KH_SITE_ENV: "production", BLOG_SYNC: "off" }, "api", "snapshot"],
    ["beta, before the flip", VERCEL.beta, "snapshot", "snapshot"],
    ["beta, after the flip (beta shows what Gate B ships)", VERCEL.beta, "api", "snapshot"],
    ["a preview, after the flip", VERCEL.preview, "api", "snapshot"],
    ["a local build after the flip", {}, "api", "snapshot"],
    ["production, before the flip", VERCEL.production, "snapshot", "snapshot"],
    ["production, after the flip", VERCEL.production, "api", "api"],
    ["production after the flip, BLOG_SYNC=off for one urgent deploy", { ...VERCEL.production, BLOG_SYNC: "off" }, "api", "snapshot"],
    ["by hand: refresh the committed file (BLOG_SYNC=on), locally", { BLOG_SYNC: "on" }, "snapshot", "api"],
    ["by hand: BLOG_SYNC=on on any build", { ...VERCEL.beta, BLOG_SYNC: "on" }, "snapshot", "api"],
  ];

  it.each(ROWS)("%s", (_row, env, source, mode) => {
    expect(resolveMode(env, source).mode).toBe(mode);
  });

  it("makes no request on any build while the committed source is the snapshot (BLOG_SYNC=on aside)", () => {
    for (const [row, env] of ROWS) {
      if (env.BLOG_SYNC === "on") continue;
      expect(resolveMode(env, "snapshot").mode, row).toBe("snapshot");
    }
  });

  it("says why, in the build log's words", () => {
    expect(resolveMode({ BLOG_SYNC: "off" }, "api").why).toBe("BLOG_SYNC=off");
    expect(resolveMode({ BLOG_SYNC: "on" }, "snapshot").why).toBe("BLOG_SYNC=on");
    expect(resolveMode(VERCEL.production, "api").why).toBe('a production build with JOURNAL_SOURCE "api"');
    expect(resolveMode(VERCEL.production, "snapshot").why).toMatch(/^a production build with JOURNAL_SOURCE "snapshot"/);
    expect(resolveMode(VERCEL.beta, "api").why).toBe("a beta build: only production reads the API");
  });

  it.each(["yes", "true", "OFF", "1"])("refuses BLOG_SYNC=%s rather than guess", (value) => {
    expect(() => resolveMode({ BLOG_SYNC: value })).toThrow(/BLOG_SYNC is ".*": use "on" or "off", or leave it unset/);
  });

  it("reads an empty BLOG_SYNC as unset", () => {
    expect(resolveMode({ ...VERCEL.production, BLOG_SYNC: "" }, "api").mode).toBe("api");
  });

  it("refuses to guess on Vercel with the system variables off, as next.config.ts does", () => {
    expect(() => resolveMode({ VERCEL: "1" }, "api")).toThrow(/system environment variables are off/i);
  });

  /* dev and Storybook run the predev steps; CI runs `npm ci` and `npm run verify`, no build: none syncs. */
  it("no predev step and no CI step runs the sync", () => {
    const predev = join(REPO, "scripts/steps/predev");
    for (const f of readdirSync(predev)) expect(readFileSync(join(predev, f), "utf8"), f).not.toMatch(/journal|sync-posts/);
    const ci = readFileSync(join(REPO, ".github/workflows/verify.yml"), "utf8");
    expect(ci).not.toMatch(/journal|sync-posts|BLOG_SYNC|run build/);
  });
});

/* ── fetching: main's three tries (main:tools/blog/sync.mjs:38-55) ───────────────────────────────── */

describe("fetchPosts: three tries of 20 s, waits of 2, 4 and 6 s, the data.posts envelope", () => {
  it("pins main's numbers", () => {
    expect([TRIES, TIMEOUT_MS, BACKOFF_MS]).toEqual([3, 20_000, [2_000, 4_000, 6_000]]);
  });

  it("reads data.posts on the first try, asking for JSON with a 20 s timeout", async () => {
    const h = harness([ok(envelope(FIXTURE.posts))]);
    await expect(fetchPosts(POSTS_URL, h.io)).resolves.toEqual(FIXTURE.posts);
    expect(h.calls).toEqual([{ url: POSTS_URL, init: { headers: { accept: "application/json" }, signal: "signal:20000" } }]);
    expect(h.sleeps).toEqual([]);
  });

  it("retries a failure after 2 s and takes the second answer", async () => {
    const h = harness([down(), ok(envelope(FIXTURE.posts))]);
    await expect(fetchPosts(POSTS_URL, h.io)).resolves.toHaveLength(4);
    expect(h.calls).toHaveLength(2);
    expect(h.sleeps).toEqual([2_000]);
  });

  it("fails after three tries, having waited 2, 4 and 6 s, each try with its own 20 s timeout", async () => {
    const h = harness([down()]);
    await expect(fetchPosts(POSTS_URL, h.io)).rejects.toThrow("fetch failed");
    expect(h.calls).toHaveLength(3);
    expect(h.sleeps).toEqual([2_000, 4_000, 6_000]);
    expect(h.timeouts).toEqual([20_000, 20_000, 20_000]);
  });

  it("treats a non-2xx answer as a failure", async () => {
    const h = harness([status(503)]);
    await expect(fetchPosts(POSTS_URL, h.io)).rejects.toThrow("HTTP 503");
    expect(h.calls).toHaveLength(3);
  });

  it("treats an answer that is not JSON as a failure", async () => {
    const h = harness([() => ({ ok: true, status: 200, json: async () => JSON.parse("<html>") })]);
    await expect(fetchPosts(POSTS_URL, h.io)).rejects.toThrow(SyntaxError);
  });

  it("returns what is not there as undefined, for the gate to refuse", async () => {
    await expect(fetchPosts(POSTS_URL, harness([ok({ status: "success", data: {} })]).io)).resolves.toBeUndefined();
    await expect(fetchPosts(POSTS_URL, harness([ok(null)]).io)).resolves.toBeUndefined();
  });

  it("waits for real between tries when no sleep is given (2, 4, 6 s on the clock)", async () => {
    vi.useFakeTimers();
    const h = harness([down()]);
    const result = fetchPosts(POSTS_URL, { fetch: h.io.fetch, timeout: h.io.timeout });
    result.catch(() => {});
    await vi.advanceTimersByTimeAsync(0);
    expect(h.calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1_999);
    expect(h.calls).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(1);
    expect(h.calls).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(3_999);
    expect(h.calls).toHaveLength(2);
    await vi.advanceTimersByTimeAsync(1);
    expect(h.calls).toHaveLength(3);
    await vi.advanceTimersByTimeAsync(6_000);
    await expect(result).rejects.toThrow("fetch failed");
  });
});

/* ── the sync from the API: production after the flip, or BLOG_SYNC=on ───────────────────────────── */

describe("syncing from the API", () => {
  const sync = (root: string, answers: (() => unknown)[], env: Record<string, string> = {}) => {
    const h = harness(answers, { BLOG_SYNC: "on", ...env });
    return { h, code: run(["--root", root], h.io) };
  };

  it("writes the snapshot when the data changed: posts by slug, keys in the contract's order, the sync's note", async () => {
    const root = rootWith(snapshotText(journal(4)));
    const shuffled = posts().reverse().map((p) => Object.fromEntries(Object.entries(p).reverse()));
    const { h, code } = sync(root, [ok(envelope(shuffled))]);
    expect(await code, h.text()).toBe(0);
    expect(h.calls.map((c) => c.url)).toEqual([POSTS_URL]);
    expect(readSnapshot(root)).toBe(snapshotText(FIXTURE.posts, syncNote(JOURNAL_API)));
    expect(h.text()).toMatch(/journal-sync: 4 posts \(snapshot updated\)/);
  });

  it("leaves the file untouched when the data is unchanged, whatever order the API returns (jsonb)", async () => {
    const root = rootWith();
    const before = mtime(root);
    const shuffled = posts().reverse().map((p) => Object.fromEntries(Object.entries(p).reverse()));
    const { h, code } = sync(root, [ok(envelope(shuffled))]);
    expect(await code, h.text()).toBe(0);
    expect(readSnapshot(root)).toBe(FIXTURE_TEXT);
    expect(mtime(root)).toBe(before);
    expect(h.text()).toMatch(/journal-sync: 4 posts \(unchanged\)/);
  });

  it("writes the first snapshot when there is none yet", async () => {
    const root = rootWith(null);
    const { h, code } = sync(root, [ok(envelope(posts()))]);
    expect(await code, h.text()).toBe(0);
    expect(readSnapshot(root)).toBe(snapshotText(FIXTURE.posts, syncNote(JOURNAL_API)));
  });

  it("reads BLOG_API_URL, a trailing slash trimmed", async () => {
    const root = rootWith();
    const { h, code } = sync(root, [ok(envelope(posts()))], { BLOG_API_URL: "https://staging.example.org/v1/" });
    expect(await code, h.text()).toBe(0);
    expect(h.calls.map((c) => c.url)).toEqual(["https://staging.example.org/v1/public/blog/posts"]);
  });

  /* §2.3, each row red. */
  it("fails when the API cannot be reached, and leaves the last snapshot as it was", async () => {
    const root = rootWith();
    const { h, code } = sync(root, [down()]);
    expect(await code).toBe(1);
    expect(h.calls).toHaveLength(3);
    expect(h.text()).toMatch(/journal-sync: FAILED: could not reach https:\/\/api\.kheelona\.com\/v1\/public\/blog\/posts \(fetch failed\)/);
    expect(h.text()).toMatch(/BLOG_SYNC=off/);
    expect(readSnapshot(root)).toBe(FIXTURE_TEXT);
  });

  it("fails on a non-2xx answer", async () => {
    const { h, code } = sync(rootWith(), [status(500)]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/could not reach .* \(HTTP 500\)/);
  });

  it("fails when the answer holds no data.posts list", async () => {
    const root = rootWith();
    const { h, code } = sync(root, [ok({ status: "success", data: { items: [] } })]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/the posts are not a list \(rule 1\)/);
    expect(readSnapshot(root)).toBe(FIXTURE_TEXT);
  });

  it("fails on a post that breaks a build rule, naming the post and the rule, and writes nothing", async () => {
    const root = rootWith();
    const bad = posts();
    bad[2].theme = "Screen-free living";
    const { h, code } = sync(root, [ok(envelope(bad))]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/post "fixture-screen-time-guide": theme "Screen-free living" is not a topic title .*\(rule 10\)/);
    expect(readSnapshot(root)).toBe(FIXTURE_TEXT);
  });

  it.each([
    [22, 0, 1],
    [22, 10, 1],
    [22, 11, 0],
    [22, 25, 0],
  ])("the shrink rule: %i posts last time, %i now, exit %i", async (last, now, exit) => {
    const root = rootWith(snapshotText(journal(last)));
    const { h, code } = sync(root, [ok(envelope(journal(now)))]);
    expect(await code, h.text()).toBe(exit);
    if (exit) expect(h.text()).toMatch(now < 4 ? /it needs at least 4|BLOG_ALLOW_SHRINK/ : /BLOG_ALLOW_SHRINK=1 for one build/);
  });

  it("accepts the drop for one build with BLOG_ALLOW_SHRINK=1", async () => {
    const root = rootWith(snapshotText(journal(22)));
    const { h, code } = sync(root, [ok(envelope(journal(10)))], { BLOG_ALLOW_SHRINK: "1" });
    expect(await code, h.text()).toBe(0);
    expect((JSON.parse(readSnapshot(root)) as { posts: unknown[] }).posts).toHaveLength(10);
  });

  it.each([0, 3])("refuses %i posts always, BLOG_ALLOW_SHRINK or not", async (n) => {
    const root = rootWith(snapshotText(journal(22)));
    const { h, code } = sync(root, [ok(envelope(journal(n)))], { BLOG_ALLOW_SHRINK: "1" });
    expect(await code).toBe(1);
    expect(h.text()).toMatch(new RegExp(`has ${n} posts; it needs at least 4`));
  });

  it("prints an editorial fault as a warning and goes on", async () => {
    const root = rootWith();
    const warned = posts();
    warned[0].answer = null;
    const { h, code } = sync(root, [ok(envelope(warned))]);
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/journal-sync: warning: post "fixture-ai-safety-guide": no answer card .*\(rule 22\)/);
    expect(h.text()).toMatch(/snapshot updated/);
  });

  it("names a post that left the API (add a redirect if it was renamed)", async () => {
    const root = rootWith(snapshotText([...posts(), ...journal(1)]));
    const { h, code } = sync(root, [ok(envelope(posts()))]);
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/journal-sync: warning: post "fixture-ai-safety-guide-0" is no longer published; add a redirect if it was renamed/);
  });
});

/* ── the committed snapshot: every build before the flip, dev, e2e, beta ─────────────────────────── */

describe("checking the committed snapshot (no request)", () => {
  const check = (root: string, env: Record<string, string> = {}) => {
    const h = harness([], env);
    return { h, code: run(["--root", root], h.io) };
  };

  it("passes a valid snapshot without a request", async () => {
    const { h, code } = check(rootWith(), VERCEL.beta);
    expect(await code, h.text()).toBe(0);
    expect(h.calls).toEqual([]);
    expect(h.text()).toMatch(/journal-sync: 4 posts in src\/content\/en-IN\/stories\/posts\.generated\.json pass; no request \(a beta build: only production reads the API\)/);
  });

  it("holds the committed file to the same build rules: a refused post fails the build", async () => {
    const bad = posts();
    bad[1].hero = "/stories/fixture-learning-guide.jpg";
    // Production with BLOG_SYNC=off: since the flip, the one production build that reads the committed file.
    const { h, code } = check(rootWith(snapshotText(bad)), { ...VERCEL.production, BLOG_SYNC: "off" });
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/post "fixture-learning-guide": hero "\/stories\/fixture-learning-guide\.jpg" is a site path.*\(rule 13\)/);
    expect(h.calls).toEqual([]);
  });

  it("fails on fewer than 4 posts", async () => {
    const { h, code } = check(rootWith(snapshotText(posts().slice(0, 3))));
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/has 3 posts; it needs at least 4/);
  });

  it("fails on a file that is not JSON", async () => {
    const { h, code } = check(rootWith("{ not json"));
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/posts\.generated\.json is not JSON/);
  });

  it("passes, saying so, before the switch: no snapshot and no registry yet (task 8b.2e writes both)", async () => {
    const { h, code } = check(rootWith(null));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/no snapshot yet; the journal is still the article modules until task 8b\.2e: nothing to check, no request/);
  });

  it("fails when the registry reads a snapshot that is missing", async () => {
    const { h, code } = check(rootWith(null, { [REGISTRY]: "export {};\n" }));
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/src\/content\/en-IN\/stories\/journal\.ts reads src\/content\/en-IN\/stories\/posts\.generated\.json, which is missing/);
  });

  it("prints editorial faults as warnings and goes on", async () => {
    const warned = posts();
    (warned[3].sources as unknown[]).push({ label: "Uncited", url: "https://example.org/uncited" });
    const { h, code } = check(rootWith(snapshotText(warned)));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/warning: post "fixture-talking-guide": source 2 is never cited/);
  });

  it("warns when the file is not in the sync's order (it was edited by hand)", async () => {
    const { h, code } = check(rootWith(snapshotText(posts().reverse())));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/warning: .*posts\.generated\.json is not in the sync's order/);
  });
});

/* ── --check: prove the import (journal-pipeline §9.1 step 7) ─────────────────────────────────────── */

describe("--check: compare the API with the committed file, never write", () => {
  const check = (root: string, answers: (() => unknown)[], env: Record<string, string> = {}) => {
    const h = harness(answers, env);
    return { h, code: run(["--check", "--root", root], h.io) };
  };

  it("exits 0 when the API returns the file's data, in any order", async () => {
    const root = rootWith();
    const before = mtime(root);
    const { h, code } = check(root, [ok(envelope(posts().reverse()))]);
    expect(await code, h.text()).toBe(0);
    expect(h.calls).toHaveLength(1);
    expect(h.text()).toMatch(/journal-sync --check: identical \(4 posts\)/);
    expect(mtime(root)).toBe(before);
  });

  it("makes its one request even under BLOG_SYNC=off (it is run by hand to prove the import)", async () => {
    const { h, code } = check(rootWith(), [ok(envelope(posts()))], { BLOG_SYNC: "off" });
    expect(await code).toBe(0);
    expect(h.calls).toHaveLength(1);
  });

  it("exits 1 on any difference, listed by post and field, and writes nothing", async () => {
    const root = rootWith();
    const api = posts();
    api[0].title = "Another title";
    api[0].lead = "Another lead";
    api.splice(3, 1);
    api.push(...journal(1));
    const { h, code } = check(root, [ok(envelope(api))]);
    expect(await code).toBe(1);
    expect(h.text()).toContain('only in the API: "fixture-ai-safety-guide-0" (published since the export? bring it to the contract before the flip)');
    expect(h.text()).toContain('only in the file: "fixture-talking-guide"');
    expect(h.text()).toContain('"fixture-ai-safety-guide": title, lead differ');
    expect(h.text()).toMatch(/journal-sync --check: 3 differences; the import is not proven/);
    expect(readSnapshot(root)).toBe(FIXTURE_TEXT);
  });

  it("exits 1 when the API's posts would not pass the gate, listing why", async () => {
    const api = posts();
    api[0].author = "";
    const { h, code } = check(rootWith(), [ok(envelope(api))]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/post "fixture-ai-safety-guide": missing author \(rule 3\)/);
  });

  it("exits 1 when the API cannot be reached", async () => {
    const { h, code } = check(rootWith(), [down()]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/could not reach/);
  });

  it("exits 1 when there is no committed file to compare", async () => {
    const { h, code } = check(rootWith(null), [ok(envelope(posts()))]);
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/no snapshot at src\/content\/en-IN\/stories\/posts\.generated\.json to compare/);
  });
});

/* ── --split: one file per post, for an import tool that wants them (journal-pipeline §9.3) ───────── */

describe("--split <dir>: one <slug>.json per post from the committed file", () => {
  it("writes each post as the snapshot holds it, without a request", async () => {
    const out = join(tempDir("kh-split-"), "posts");
    const h = harness();
    expect(await run(["--split", out, "--root", rootWith()], h.io), h.text()).toBe(0);
    expect(h.calls).toEqual([]);
    expect(readdirSync(out).sort()).toEqual(FIXTURE.posts.map((p) => `${p.slug}.json`));
    for (const p of FIXTURE.posts) expect(readFileSync(join(out, `${p.slug}.json`), "utf8")).toBe(`${JSON.stringify(p, null, 2)}\n`);
    expect(h.text()).toMatch(/journal-sync --split: 4 posts written to .*; never commit them/);
  });

  it("refuses a folder inside the repository (the repo is public; the files are never committed)", async () => {
    const h = harness();
    expect(await run(["--split", join(REPO, "tmp-split"), "--root", rootWith()], h.io)).toBe(1);
    expect(h.text()).toMatch(/write the files outside the repository/);
    expect(existsSync(join(REPO, "tmp-split"))).toBe(false);
  });

  it("refuses to split a snapshot the gate refuses", async () => {
    const bad = posts();
    bad[0].slug = "Bad Slug";
    const h = harness();
    expect(await run(["--split", join(tempDir("kh-split-"), "x"), "--root", rootWith(snapshotText(bad))], h.io)).toBe(1);
    expect(h.text()).toMatch(/bad slug/);
  });
});

/* ── --pages: postbuild step 20, one prerendered page per post (§8.2 row 26) ──────────────────────── */

const PAGE_DIR = ".next/server/app/stories";
const manifest = (redirects: Record<string, unknown>[] = []) => JSON.stringify({ version: 3, redirects });
/** A built tree: the snapshot, the routes manifest and a prerendered page per slug given. */
const built = (slugs: string[], redirects: Record<string, unknown>[] = [], snapshot: string | null = FIXTURE_TEXT) =>
  rootWith(snapshot, {
    ".next/routes-manifest.json": manifest(redirects),
    ...Object.fromEntries(slugs.map((s) => [`${PAGE_DIR}/${s}.html`, `<!DOCTYPE html><title>${s}</title>`])),
  });
const ALL = FIXTURE.posts.map((p) => p.slug);

describe("--pages: every post became a prerendered page", () => {
  const pages = (root: string) => {
    const h = harness();
    return { h, code: run(["--pages", "--root", root], h.io) };
  };

  it("passes when every post has its page", async () => {
    const { h, code } = pages(built(ALL));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/journal-pages: 4 posts, 4 prerendered pages/);
  });

  it("fails on a post that did not become a page, naming it", async () => {
    const { h, code } = pages(built(ALL.slice(1)));
    expect(await code).toBe(1);
    expect(h.text()).toContain(
      'journal-pages: FAILED: no prerendered page for "fixture-ai-safety-guide" (stories/fixture-ai-safety-guide.html under .next/server/app/ or .next/server/route-cache/)',
    );
  });

  /* Vercel's layout (scripts/prerendered.mjs): its adapter makes next build write each page under
     .next/server/route-cache/APP_PAGE/<hash of the source route>/$/ and leave no HTML in .next/server/app. The beta
     deploy of 2026-10-14 failed here: every page was built, and this step looked only in .next/server/app. */
  const vercelBuilt = (slugs: string[]) =>
    rootWith(FIXTURE_TEXT, {
      ".next/routes-manifest.json": manifest(),
      ".next/server/app/(site)/stories/[slug]/page.js": "",
      ...Object.fromEntries(
        slugs.map((s) => [`.next/server/route-cache/APP_PAGE/${"d".repeat(64)}/$/stories/${s}.html`, `<!DOCTYPE html><title>${s}</title>`]),
      ),
    });

  it("finds every page in Vercel's layout", async () => {
    const { h, code } = pages(vercelBuilt(ALL));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/journal-pages: 4 posts, 4 prerendered pages/);
  });

  it("still fails in Vercel's layout on a post that did not become a page", async () => {
    const { h, code } = pages(vercelBuilt(ALL.slice(1)));
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/no prerendered page for "fixture-ai-safety-guide"/);
  });

  it("fails on an empty page", async () => {
    const root = built(ALL);
    writeFileSync(join(root, PAGE_DIR, `${ALL[0]}.html`), "");
    const { code } = pages(root);
    expect(await code).toBe(1);
  });

  it("expects no page for a post whose slug is a redirect source: the redirect wins (§10)", async () => {
    const five = [...posts(), ...journal(1)];
    const redirect = { source: "/stories/fixture-ai-safety-guide-0", destination: "/stories", statusCode: 308 };
    const { h, code } = pages(built(ALL, [redirect], snapshotText(five)));
    expect(await code, h.text()).toBe(0);
    expect(h.text()).toMatch(/journal-pages: note: "fixture-ai-safety-guide-0" is a redirect source; the redirect wins, no page expected/);
  });

  it("counts a redirect only on the apex: a www-only rule leaves the page expected", async () => {
    const www = { source: `/stories/${ALL[0]}`, destination: "https://kheelona.com/stories", has: [{ type: "host", value: "www\\.kheelona\\.com" }], statusCode: 308 };
    const { code } = pages(built(ALL.slice(1), [www]));
    expect(await code).toBe(1);
  });

  it("fails when fewer than 4 pages are expected", async () => {
    const redirect = { source: `/stories/${ALL[0]}`, destination: "/stories", statusCode: 308 };
    const { h, code } = pages(built(ALL, [redirect]));
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/3 journal pages; at least 4/);
  });

  it("fails when there is no build to check", async () => {
    const { h, code } = pages(rootWith());
    expect(await code).toBe(1);
    expect(h.text()).toMatch(/\.next\/routes-manifest\.json is missing: run after next build/);
  });

  it("passes before the switch (no snapshot, no registry), and fails when the registry's snapshot is missing", async () => {
    expect(await pages(built([], [], null)).code).toBe(0);
    expect(await pages(rootWith(null, { [REGISTRY]: "export {};\n" })).code).toBe(1);
  });
});

describe("usage", () => {
  it.each([[["--nope"]], [["--split"]], [["--check", "--pages"]], [["--root"]]])("refuses %j with exit 2", async (argv) => {
    const h = harness();
    expect(await run(argv, h.io)).toBe(2);
    expect(h.text()).toMatch(/^usage: node scripts\/journal\/sync-posts\.mjs/m);
  });
});

/* ── the script and the steps as the deploy runs them, a fetch stub proving no request ────────────── */

const STUB_DIR = tempDir("kh-fetch-stub-");
const STUB = join(STUB_DIR, "fetch-stub.mjs");
writeFileSync(
  STUB,
  [
    'import { appendFileSync, readFileSync } from "node:fs";',
    "globalThis.fetch = async (url) => {",
    "  appendFileSync(process.env.KH_TEST_FETCH_LOG, `${url}\\n`);",
    "  const body = process.env.KH_TEST_FETCH_BODY;",
    '  if (!body) throw new Error("no network in this test");',
    '  const text = readFileSync(body, "utf8");',
    "  return { ok: true, status: 200, json: async () => JSON.parse(text) };",
    "};",
    "",
  ].join("\n"),
);

/** Runs a script under exactly these variables (the parent's are not inherited) with the fetch stub preloaded into it
 *  and every Node process it starts. Returns the exit code, the output and every URL fetched. */
function spawn(script: string, args: string[], vars: Record<string, string> = {}, body?: unknown) {
  const log = join(tempDir("kh-fetch-log-"), "calls.log");
  writeFileSync(log, "");
  const bodyFile = body === undefined ? undefined : join(dirname(log), "body.json");
  if (bodyFile) writeFileSync(bodyFile, JSON.stringify(body));
  const r = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8",
    env: {
      PATH: process.env.PATH ?? "",
      NODE_ENV: "test" as const,
      NODE_OPTIONS: `--import=${pathToFileURL(STUB).href}`,
      KH_TEST_FETCH_LOG: log,
      ...(bodyFile ? { KH_TEST_FETCH_BODY: bodyFile } : {}),
      ...vars,
    },
  });
  return { code: r.status, all: `${r.stdout}${r.stderr}`, fetched: readFileSync(log, "utf8").split("\n").filter(Boolean) };
}

describe("prebuild step 15 and postbuild step 20, spawned as `npm run build` runs them", () => {
  const NO_REQUEST_ROWS: [string, Record<string, string>][] = [
    ["a local build, verify:e2e", {}],
    ["the Gate B dry run, offline (BLOG_SYNC=off since the flip)", { KH_SITE_ENV: "production", BLOG_SYNC: "off" }],
    ["a beta build", VERCEL.beta],
    ["a preview build", VERCEL.preview],
    ["production with BLOG_SYNC=off", { ...VERCEL.production, BLOG_SYNC: "off" }],
  ];

  it("step 15 on production, since the flip, makes exactly one request, to the posts API, and syncs", () => {
    const root = rootWith(snapshotText(journal(4)));
    const r = spawn(STEP_SYNC, ["--root", root], VERCEL.production, envelope(posts()));
    expect(r.code, r.all).toBe(0);
    expect(r.fetched).toEqual([POSTS_URL]);
    expect(readSnapshot(root)).toBe(snapshotText(FIXTURE.posts, syncNote(JOURNAL_API)));
  });

  it.each(NO_REQUEST_ROWS)("step 15 on %s: the committed snapshot passes and no request is made", (_row, vars) => {
    const r = spawn(STEP_SYNC, ["--root", rootWith()], vars);
    expect(r.code, r.all).toBe(0);
    expect(r.fetched).toEqual([]);
    expect(r.all).toMatch(/journal-sync: 4 posts in .* pass; no request/);
    expect(r.all).not.toMatch(/MODULE_TYPELESS_PACKAGE_JSON|ExperimentalWarning/);
  });

  it("step 15 is red on a planted post that breaks a build rule, naming the post and the rule", () => {
    const bad = posts();
    bad[2].body = { type: "doc", content: [{ type: "script" }] };
    const r = spawn(STEP_SYNC, ["--root", rootWith(snapshotText(bad))], VERCEL.beta);
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/post "fixture-screen-time-guide": body\[0\]: unknown block "script" \(rule 4\)/);
  });

  it("step 15 with BLOG_SYNC=on makes exactly one request, to the posts API, and syncs", () => {
    const root = rootWith(snapshotText(journal(4)));
    const r = spawn(STEP_SYNC, ["--root", root], { BLOG_SYNC: "on" }, envelope(posts()));
    expect(r.code, r.all).toBe(0);
    expect(r.fetched).toEqual([POSTS_URL]);
    expect(readSnapshot(root)).toBe(snapshotText(FIXTURE.posts, syncNote(JOURNAL_API)));
  });

  it("step 15 passes on this repository's own tree under a beta build, with no request", () => {
    const r = spawn(STEP_SYNC, [], VERCEL.beta);
    expect(r.code, r.all).toBe(0);
    expect(r.fetched).toEqual([]);
  });

  it("step 20 passes on a built tree and is red on a planted missing page", () => {
    expect(spawn(STEP_PAGES, ["--root", built(ALL)]).code).toBe(0);
    const r = spawn(STEP_PAGES, ["--root", built(ALL.slice(0, 3))]);
    expect(r.code).toBe(1);
    expect(r.all).toMatch(/no prerendered page for "fixture-talking-guide"/);
    expect(r.fetched).toEqual([]);
  });

  it("the script runs as a CLI too, with the same answer", () => {
    const r = spawn(SCRIPT, ["--root", rootWith()], { ...VERCEL.production, BLOG_SYNC: "off" });
    expect(r.code, r.all).toBe(0);
    expect(r.fetched).toEqual([]);
  });
});
