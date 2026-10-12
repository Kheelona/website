import { execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, posix } from "node:path";
import { runInThisContext } from "node:vm";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as site from "@/config/site";
import { BETA_HOSTS } from "@/config/env";
import { FREEZE_TAG, ROOT, fixtureName, listFiles, readRepoBytes, readRepoFile, tagBytes, tagText } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";

/* tracking-freeze (task 2.6; ADR-006; architecture §8.1, §8.4; tracking inventory parity row 0).
 *
 * Brief §9.4 makes tracking parity a launch blocker, so the measurement code is frozen against
 * the tag archive/pre-reset-2026-10-10 (production before the reset) and every change is proven:
 *
 * 1. The proven funnel (architecture §8.1 "Frozen, byte-identical") equals the tag byte for byte.
 * 2. The gates and ViewContentTracker moved to src/components/tracking/. GoogleAnalyticsGate and
 *    MetaPixel are byte-identical to their tag files. PostHogGate and ViewContentTracker differ
 *    from theirs by exactly one reviewed patch each, stored in
 *    test/guards/fixtures/tracking-diffs/<new path with "/" as "__">.patch: the D048 beta stamp
 *    and the B46 internal flag; the B9 value from a `valuePaise` prop (ADR-005). The diff between
 *    the tag's file and today's must EQUAL the stored patch, hunk for hunk, so any further edit
 *    turns this red until the patch is regenerated and reviewed. Regenerate a patch with:
 *      git show archive/pre-reset-2026-10-10:<old path> > /tmp/old && \
 *      git diff --no-index --no-color --diff-algorithm=myers -U3 /tmp/old <new path>
 *    and keep the review header above the first "@@" (it must name its decisions).
 * 3. The old copies are gone, and every test the tag ran on these components still runs (titles
 *    kept; one reviewed rename, B2a). No file under src/ imports a gate or the tracker from its old
 *    path, and every import of one names @/components/tracking/<Name> (a scan, so it holds when
 *    task 5.2 deletes the old product route and task 3.1 rewrites the root layout).
 * 4. The tracking constants of src/config/site.ts equal the tag's values, except POSTHOG_HOSTS,
 *    which gains exactly the two beta hosts (architecture §15.3, B2a).
 */

/** Architecture §8.1: the proven funnel, cookies and server events. */
const FUNNEL = [
  "src/features/preorder/lib/analytics.ts",
  "src/lib/fbq.ts",
  "src/lib/posthog.ts",
  "src/lib/campaign.ts",
  "src/lib/click-id.ts",
  "src/proxy.ts",
  "src/lib/store/meta-capi.ts",
  "src/lib/store/fulfil.ts",
];

type Moved = { now: string; then: string; review?: readonly string[] };

/** New path → tag path. `review` lists the decisions a reviewed patch must name; no `review`, no patch. */
const MOVED: readonly Moved[] = [
  { now: "src/components/tracking/GoogleAnalyticsGate.tsx", then: "src/components/molecules/GoogleAnalyticsGate.tsx" },
  { now: "src/components/tracking/MetaPixel.tsx", then: "src/components/molecules/MetaPixel.tsx" },
  {
    now: "src/components/tracking/PostHogGate.tsx",
    then: "src/components/molecules/PostHogGate.tsx",
    review: ["D048", "N3", "B46"],
  },
  {
    now: "src/components/tracking/ViewContentTracker.tsx",
    then: "src/app/(site)/products/kheelu/_components/ViewContentTracker.tsx",
    review: ["B9", "ADR-005"],
  },
];

const MOVED_TESTS: readonly Moved[] = MOVED.map(({ now, then }) => ({
  now: now.replace(/\.tsx$/, ".test.tsx"),
  then: then.replace(/\.tsx$/, ".test.tsx"),
}));

/** Test titles the tag ran that were renamed by a reviewed change: old → new. */
const RENAMED_TESTS: Readonly<Record<string, string>> = {
  // B2a: POSTHOG_HOSTS gains the two beta hosts (architecture §15.3), in the same commit as this test.
  "the PostHog constants > measures exactly the hosts GA4 measures":
    "the PostHog constants > measures the hosts GA4 measures, plus the two beta hosts (D048, B2a)",
};

const DIFF_DIR = "test/guards/fixtures/tracking-diffs";

/** The four moved components; each lives at @/components/tracking/<Name> and nowhere else. */
const MOVED_NAMES: readonly string[] = MOVED.map((m) => m.now.split("/").pop()!.replace(/\.tsx$/, ""));
const newSpec = (name: string) => `@/components/tracking/${name}`;
const TRACKING_DIR = "src/components/tracking/";
const ROOT_LAYOUT = "src/app/layout.tsx";
/** The legacy product route: task 5.2 deletes it (products/[slug]/page.tsx replaces it). */
const LEGACY_PRODUCT_PAGE = "src/app/(site)/products/kheelu/page.tsx";

/** The old import paths as they were written (task 2.6 review). */
const OLD_SPECS: readonly RegExp[] = [
  /^@\/components\/molecules\/(GoogleAnalyticsGate|MetaPixel|PostHogGate)(\.tsx?)?$/,
  /^(\.\/_components|@\/app\/\(site\)\/products\/kheelu\/_components)\/ViewContentTracker(\.tsx?)?$/,
];
/** The old files without extension: a relative or aliased specifier resolving to one is an old path too. */
const OLD_TARGETS: ReadonlySet<string> = new Set(MOVED.map((m) => m.then.replace(/\.tsx$/, "")));

/* ── Instruments ──────────────────────────────────────────────────────────────────────────── */

/** The unified diff from `before` to the file at `path`, from its first hunk (headers dropped). */
function hunks(before: string, path: string): string {
  const dir = mkdtempSync(join(tmpdir(), "tracking-freeze-"));
  try {
    const old = join(dir, "old");
    writeFileSync(old, before);
    let out = "";
    try {
      out = execFileSync(
        "git",
        ["diff", "--no-index", "--no-color", "--no-ext-diff", "--diff-algorithm=myers", "-U3", old, join(ROOT, path)],
        { cwd: ROOT, encoding: "utf8" },
      );
    } catch (e) {
      // git diff --no-index exits 1 when the files differ; its stdout is the diff.
      const err = e as { status?: number; stdout?: string };
      if (err.status !== 1 || typeof err.stdout !== "string") throw e;
      out = err.stdout;
    }
    return fromFirstHunk(out);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function fromFirstHunk(patch: string): string {
  const at = patch.search(/^@@ /m);
  return at < 0 ? "" : patch.slice(at).replace(/\s+$/, "\n");
}

function reviewHeader(patch: string): string {
  const at = patch.search(/^@@ /m);
  return at < 0 ? patch : patch.slice(0, at);
}

/** Every describe/it/test title in the file, as "outer > inner > title". */
function testTitles(path: string, text: string): string[] {
  const sf = parseSource(path, text);
  const out: string[] = [];
  const callee = (c: ts.CallExpression): string | null => {
    let e: ts.Expression = c.expression;
    if (ts.isCallExpression(e)) e = e.expression; // it.each([...])("title", …)
    if (ts.isPropertyAccessExpression(e)) e = e.expression; // it.skip, describe.each
    return ts.isIdentifier(e) ? e.text : null;
  };
  const visit = (node: ts.Node, trail: string[]) => {
    if (ts.isCallExpression(node)) {
      const name = callee(node);
      const first = node.arguments[0];
      if (name && ["describe", "it", "test"].includes(name) && first && ts.isStringLiteralLike(first)) {
        const here = [...trail, first.text];
        if (name !== "describe") out.push(here.join(" > "));
        node.arguments.slice(1).forEach((a) => visit(a, here));
        return;
      }
    }
    ts.forEachChild(node, (child) => visit(child, trail));
  };
  visit(sf, []);
  return out;
}

/** Every `.skip`, `.only`, `.todo`, `.fails` or `.skipIf`/`.runIf` on describe/it/test, by line. */
function disabledTests(path: string, text: string): string[] {
  const sf = parseSource(path, text);
  const out: string[] = [];
  const visit = (node: ts.Node) => {
    if (
      ts.isPropertyAccessExpression(node) &&
      ts.isIdentifier(node.expression) &&
      ["describe", "it", "test"].includes(node.expression.text) &&
      ["skip", "only", "todo", "fails", "skipIf", "runIf"].includes(node.name.text)
    ) {
      out.push(`${node.getText(sf)} at line ${sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1}`);
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

type ModuleRef = { spec: string; names: string[]; line: number };

/** Every module a file names, comments excluded: import and export-from declarations (with the
 *  names they bind, by their exported name), and import(), require() and vi.mock()-style calls. */
function moduleRefs(path: string, text: string): ModuleRef[] {
  const sf = parseSource(path, text);
  const out: ModuleRef[] = [];
  const lineOf = (n: ts.Node) => sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1;
  const visit = (node: ts.Node): void => {
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const names: string[] = [];
      if (ts.isImportDeclaration(node) && node.importClause) {
        const clause = node.importClause;
        if (clause.name) names.push(clause.name.text);
        if (clause.namedBindings && ts.isNamedImports(clause.namedBindings)) {
          for (const e of clause.namedBindings.elements) names.push((e.propertyName ?? e.name).text);
        }
      }
      if (ts.isExportDeclaration(node) && node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const e of node.exportClause.elements) names.push((e.propertyName ?? e.name).text);
      }
      out.push({ spec: node.moduleSpecifier.text, names, line: lineOf(node) });
    } else if (ts.isCallExpression(node)) {
      const first = node.arguments[0];
      const dynamicImport = node.expression.kind === ts.SyntaxKind.ImportKeyword;
      const loader = /^(require|vi\.(mock|doMock|unmock|doUnmock|importActual|importMock))$/.test(node.expression.getText(sf));
      if (first && ts.isStringLiteralLike(first) && (dynamicImport || loader)) {
        out.push({ spec: first.text, names: [], line: lineOf(node) });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** The repo path a specifier names, without extension ("@/x" is src/x; "./x" sits beside the
 *  importer); null for a package. */
function resolveSpec(from: string, spec: string): string | null {
  let target: string;
  if (spec.startsWith("@/")) target = `src/${spec.slice(2)}`;
  else if (spec.startsWith("./") || spec.startsWith("../")) target = posix.join(posix.dirname(from), spec);
  else return null;
  return target.replace(/\.(tsx?|jsx?)$/, "");
}

/** (a) Every import of a gate or the tracker from its old path. */
function oldPathImports(path: string, refs: readonly ModuleRef[]): string[] {
  return refs
    .filter((r) => OLD_SPECS.some((re) => re.test(r.spec)) || OLD_TARGETS.has(resolveSpec(path, r.spec) ?? ""))
    .map((r) => `${path}:${r.line} "${r.spec}"`);
}

/** (b) Every import of a moved name, or from a module named after one, that does not come from
 *  @/components/tracking/<Name>. A colocated file in src/components/tracking/ may use ./<Name>. */
function offPathImports(path: string, refs: readonly ModuleRef[]): string[] {
  const out: string[] = [];
  for (const r of refs) {
    const target = r.spec.split("/").pop()!.replace(/\.(tsx?|jsx?)$/, "");
    const named = new Set([...r.names, target].filter((n) => MOVED_NAMES.includes(n)));
    for (const name of named) {
      const ok = r.spec === newSpec(name) || (path.startsWith(TRACKING_DIR) && r.spec === `./${name}`);
      if (!ok) out.push(`${path}:${r.line} ${name} from "${r.spec}"`);
    }
  }
  return out;
}

/** The tag's version of a module with no imports, evaluated (the way test/env.test.ts loads it). */
function loadTagModule(path: string): Record<string, unknown> {
  const { outputText } = ts.transpileModule(tagText(path) ?? "", {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  });
  const loaded = { exports: {} as Record<string, unknown> };
  const wrapped = runInThisContext(`(function (module, exports, require) {\n${outputText}\n})`, {
    filename: `${FREEZE_TAG}:${path}`,
  }) as (m: typeof loaded, e: typeof loaded.exports, r: (id: string) => unknown) => void;
  wrapped(loaded, loaded.exports, (id) => {
    throw new Error(`${FREEZE_TAG}:${path} imports ${id}; this loader wires none`);
  });
  return loaded.exports;
}

/* ── Self-tests: the instruments record ───────────────────────────────────────────────────── */

describe("tracking-freeze instruments", () => {
  it("diffs a file against a text and drops the headers", () => {
    const path = "src/lib/fbq.ts";
    const now = readRepoFile(path);
    expect(hunks(now, path)).toBe("");
    const d = hunks(now.replace("purchase_", "purchase-"), path);
    expect(d).toMatch(/^@@ -\d+,\d+ \+\d+,\d+ @@/);
    expect(d).toContain('-  return `purchase-${orderRef}`;');
    expect(d).toContain('+  return `purchase_${orderRef}`;');
  });

  it("reads describe and it titles, nested, including it.each", () => {
    const src = `describe("a", () => { it("b", () => {}); it.each([1])("c %s", () => {}); describe("d", () => { test("e", () => {}); }); });`;
    expect(testTitles("x.test.ts", src)).toEqual(["a > b", "a > c %s", "a > d > e"]);
  });

  it("finds a skipped, focused or deferred test, and nothing in a plain one", () => {
    const src = `describe("a", () => { it.skip("b", () => {}); test.only("c", () => {}); it.todo("d"); it("e", () => {}); });`;
    expect(disabledTests("x.test.ts", src)).toEqual(["it.skip at line 1", "test.only at line 1", "it.todo at line 1"]);
    expect(disabledTests("x.test.ts", `it("e", () => {}); it.each([1])("f", () => {});`)).toEqual([]);
  });

  it("loads the tag's site.ts and sees its money and IDs", () => {
    const tag = loadTagModule("src/config/site.ts");
    expect(tag.LAUNCH_AMOUNT_PAISE).toBe(499_900);
    expect(tag.META_PIXEL_ID).toBe("1051265191046395");
  });

  it.each([
    ["src/app/layout.tsx", `import { PostHogGate } from "@/components/molecules/PostHogGate";`],
    ["src/app/layout.tsx", `import { MetaPixel } from "../components/molecules/MetaPixel";`],
    ["src/app/(site)/products/kheelu/page.tsx", `import { ViewContentTracker } from "./_components/ViewContentTracker";`],
    ["src/app/(site)/page.tsx", `import { ViewContentTracker } from "@/app/(site)/products/kheelu/_components/ViewContentTracker";`],
    ["src/lib/x.ts", `export { GoogleAnalyticsGate } from "@/components/molecules/GoogleAnalyticsGate";`],
    ["src/lib/x.ts", `export const m = () => import("@/components/molecules/GoogleAnalyticsGate.tsx");`],
    ["src/lib/x.test.ts", `vi.mock("@/components/molecules/MetaPixel", () => ({}));`],
  ])("finds an old-path import in %s: %s", (path, src) => {
    expect(oldPathImports(path, moduleRefs(path, src))).toHaveLength(1);
  });

  it.each([
    ["src/app/(site)/products/[slug]/page.tsx", `import { ViewContentTracker } from "./_components/ViewContentTracker";`],
    ["src/app/(site)/page.tsx", `import { ViewContentTracker } from "./ViewContentTracker";`],
    ["src/app/layout.tsx", `import { PostHogGate as Gate } from "@/components/analytics";`],
    ["src/app/layout.tsx", `import { shouldLoadGa4 } from "@/components/molecules/GoogleAnalyticsGate";`],
    ["src/app/layout.tsx", `import { MetaPixel } from "@/components/tracking/PostHogGate";`],
  ])("finds an import off @/components/tracking/<Name> in %s: %s", (path, src) => {
    expect(offPathImports(path, moduleRefs(path, src))).toHaveLength(1);
  });

  it.each([
    ["src/app/layout.tsx", `import { PostHogGate } from "@/components/tracking/PostHogGate";`],
    ["src/app/layout.tsx", `import {\n  GoogleAnalyticsGate,\n} from "@/components/tracking/GoogleAnalyticsGate";`],
    ["src/components/tracking/PostHogGate.test.tsx", `import { PostHogGate } from "./PostHogGate"; vi.mock("./PostHogGate");`],
    ["src/test.ts", `export const m = () => import("@/components/tracking/PostHogGate");`],
    ["src/app/layout.tsx", `// was: import { MetaPixel } from "@/components/molecules/MetaPixel";\nconst s = "@/components/molecules/MetaPixel";`],
    ["src/app/layout.tsx", `import { ViewContentTrackerProps } from "@/lib/x"; import { fbTrack } from "@/lib/fbq";`],
  ])("passes a clean file %s: %s", (path, src) => {
    const refs = moduleRefs(path, src);
    expect([...oldPathImports(path, refs), ...offPathImports(path, refs)]).toEqual([]);
  });
});

/* ── 1. The funnel ────────────────────────────────────────────────────────────────────────── */

describe(`tracking-freeze: the proven funnel equals ${FREEZE_TAG} byte for byte`, () => {
  it.each(FUNNEL)("%s", (path) => {
    expect(existsSync(join(ROOT, path)), `${path} was deleted`).toBe(true);
    const then = tagBytes(path);
    expect(then, `${path} is not in ${FREEZE_TAG}`).not.toBeNull();
    expect(readRepoBytes(path).equals(then!), `${path} differs from ${FREEZE_TAG}: the funnel is frozen (ADR-006)`).toBe(
      true,
    );
  });
});

/* ── 2. The moved gates ───────────────────────────────────────────────────────────────────── */

describe("tracking-freeze: the gates moved to src/components/tracking/ with only the reviewed diffs", () => {
  it.each(MOVED.map((m) => [m.now, m] as const))("%s", (_now, m) => {
    expect(existsSync(join(ROOT, m.now)), `${m.now} is missing`).toBe(true);
    const then = tagText(m.then);
    expect(then, `${m.then} is not in ${FREEZE_TAG}`).not.toBeNull();
    const patchPath = `${DIFF_DIR}/${fixtureName(m.now)}.patch`;
    const actual = hunks(then!, m.now);

    if (!m.review) {
      expect(existsSync(join(ROOT, patchPath)), `${m.now} takes no patch: its body is frozen (architecture §8.1)`).toBe(
        false,
      );
      expect(actual, `${m.now} differs from ${FREEZE_TAG}:${m.then}; its body must stay byte-identical`).toBe("");
      return;
    }

    const stored = existsSync(join(ROOT, patchPath)) ? readRepoFile(patchPath) : "";
    expect(
      actual,
      `${m.now} differs from ${FREEZE_TAG}:${m.then} by something other than its reviewed patch ${patchPath}`,
    ).toBe(fromFirstHunk(stored));
    if (stored) {
      const header = reviewHeader(stored);
      for (const id of m.review) expect(header, `${patchPath} must name ${id} in its review header`).toContain(id);
    }
  });

  it("stores reviewed patches only for the two reviewed gates", () => {
    const allowed = new Set(MOVED.filter((m) => m.review).map((m) => `${DIFF_DIR}/${fixtureName(m.now)}.patch`));
    const stray = listFiles([DIFF_DIR]).filter((p) => !allowed.has(p));
    expect(stray, `patches for files outside the reviewed list: ${stray.join(", ")}`).toEqual([]);
  });
});

/* ── 3. No copy left behind; every tag test still runs ────────────────────────────────────── */

describe("tracking-freeze: the old copies are gone and the tag's tests moved with them", () => {
  it("leaves no gate or tracker at its old path (no second copy, structure §1)", () => {
    const left = listFiles(["src/components/molecules", "src/app/(site)/products/kheelu/_components"]).filter((p) =>
      /\/(GoogleAnalyticsGate|MetaPixel|PostHogGate|ViewContentTracker)\.[^/]+$/.test(p),
    );
    expect(left).toEqual([]);
  });

  /* A scan, not a list of files (task 2.6 review): task 5.2 deletes the legacy product route and
     task 3.1 rewrites the root layout, and neither may turn this red by doing its own work. */
  const scanned = () =>
    listFiles(["src"])
      .filter((p) => /\.(ts|tsx)$/.test(p))
      .map((p) => [p, moduleRefs(p, readRepoFile(p))] as const);

  it("no .ts or .tsx file under src/ imports a gate or the tracker from its old path", () => {
    const files = scanned();
    expect(files.length).toBeGreaterThan(0);
    expect(files.flatMap(([p, refs]) => oldPathImports(p, refs))).toEqual([]);
  });

  it("every import of a gate or the tracker comes from @/components/tracking/<Name>", () => {
    expect(scanned().flatMap(([p, refs]) => offPathImports(p, refs))).toEqual([]);
  });

  it("the root layout imports the three gates from @/components/tracking/<Name>", () => {
    const refs = moduleRefs(ROOT_LAYOUT, readRepoFile(ROOT_LAYOUT));
    for (const name of ["GoogleAnalyticsGate", "MetaPixel", "PostHogGate"]) {
      expect(refs.some((r) => r.spec === newSpec(name)), `${ROOT_LAYOUT} has no import from "${newSpec(name)}"`).toBe(true);
    }
  });

  const legacyPageStands = existsSync(join(ROOT, LEGACY_PRODUCT_PAGE)) && isStillLegacy(LEGACY_PRODUCT_PAGE);
  it.runIf(legacyPageStands)(`${LEGACY_PRODUCT_PAGE}, while it stands as legacy (until task 5.2), imports ViewContentTracker from the new path`, () => {
    const refs = moduleRefs(LEGACY_PRODUCT_PAGE, readRepoFile(LEGACY_PRODUCT_PAGE));
    expect(refs.some((r) => r.spec === newSpec("ViewContentTracker") && r.names.includes("ViewContentTracker"))).toBe(true);
  });

  it.each(MOVED_TESTS.map((m) => [m.now, m] as const))("%s keeps every test the tag ran", (_now, m) => {
    const then = testTitles(m.then, tagText(m.then) ?? "");
    expect(then.length, `${m.then} has no tests at ${FREEZE_TAG}`).toBeGreaterThan(0);
    const now = new Set(testTitles(m.now, readRepoFile(m.now)));
    const lost = then.filter((t) => !now.has(RENAMED_TESTS[t] ?? t));
    expect(lost, `tests dropped from ${m.now}: ${lost.join("; ")}`).toEqual([]);
  });

  it.each(MOVED_TESTS.map((m) => [m.now, m] as const))("%s skips, focuses or defers nothing", (_now, m) => {
    expect(disabledTests(m.now, readRepoFile(m.now))).toEqual([]);
  });
});

/* ── 4. The tracking constants ────────────────────────────────────────────────────────────── */

describe("tracking-freeze: the IDs, host lists and paths of src/config/site.ts equal the tag's", () => {
  const tag = loadTagModule("src/config/site.ts");
  const now = site as unknown as Record<string, unknown>;
  const SAME = [
    "GA4_MEASUREMENT_ID",
    "GA4_HOSTS",
    "META_PIXEL_ID",
    "META_PIXEL_HOSTS",
    "AHREFS_ANALYTICS_KEY",
    "POSTHOG_KEY",
    "POSTHOG_API_HOST",
    "POSTHOG_ASSET_HOST",
    "POSTHOG_PROXY_PATH",
    "POSTHOG_ASSET_PROXY_PATH",
    "POSTHOG_UI_HOST",
    "POSTHOG_REPLAY_DENY_PATHS",
  ];

  it.each(SAME)("%s is unchanged", (name) => {
    expect(tag[name], `${name} is not exported at ${FREEZE_TAG}`).toBeDefined();
    expect(now[name]).toEqual(tag[name]);
  });

  it("POSTHOG_HOSTS is the tag's list plus exactly the two beta hosts (architecture §15.3, B2a)", () => {
    expect(site.POSTHOG_HOSTS).toEqual([...(tag.POSTHOG_HOSTS as string[]), ...BETA_HOSTS]);
  });

  it("the gate predicates answer as the tag's do on every host and path, beta hosts apart", () => {
    const hosts = [
      "kheelona.com",
      "www.kheelona.com",
      "store.kheelona.com",
      "STORE.KHEELONA.COM",
      "localhost",
      "store.localhost",
      "127.0.0.1",
      "website-hdn2.vercel.app",
      "kheelona.ai",
      "kheelona.com.evil.example",
    ];
    const shouldLoad = tag.shouldLoadPostHog as (h: string) => boolean;
    for (const h of hosts) expect(site.shouldLoadPostHog(h), h).toBe(shouldLoad(h));
    for (const h of BETA_HOSTS) {
      expect(shouldLoad(h), `${h} at the tag`).toBe(false);
      expect(site.shouldLoadPostHog(h), `${h} now (D048)`).toBe(true);
    }
    const paths = ["/", "/thanks", "/thanks/", "/store/thanks", "/store/thanks/x", "/store", "/store/thanksgiving", "/ingest", "/ingest/e/", "/ingest-assets/x", "/ingestion"];
    const replay = tag.replayAllowedOnPath as (p: string) => boolean;
    const proxy = tag.isPostHogProxyPath as (p: string) => boolean;
    for (const p of paths) {
      expect(site.replayAllowedOnPath(p), p).toBe(replay(p));
      expect(site.isPostHogProxyPath(p), p).toBe(proxy(p));
    }
  });
});
