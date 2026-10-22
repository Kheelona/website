// The redesign as the marketing site (2026-10-22): prepare its build for `next build`.
//
//   node scripts/site/prepare.mjs            run redesign/tools/build-site.sh, then split redesign/dist (prebuild 40)
//   node scripts/site/prepare.mjs --no-build split an existing dist only (predev 40; a local re-run)
//
// The redesign (redesign/, plain HTML/CSS/JS) builds itself into redesign/dist with its own script, which also runs
// redesign/tools/publish-stories.sh, the journal sync under the live site's BLOG_SYNC rule. This file then:
//   1. copies every page (*.html) and the machine files (sitemap.xml, robots.txt, llms.txt, pricing.md) into
//      build/site/ (git-ignored), where the route handlers read them (src/lib/site-pages/files.ts; traced into the
//      functions by next.config.ts's outputFileTracingIncludes). Never public: a page is served only through its
//      route, which injects the environment, the live offer and the tracking shell (src/lib/site-pages/transform.ts);
//   2. copies everything else (hashed assets, og/, media/, icons, manifest.json) into public/_site/ (git-ignored),
//      served by Vercel's CDN; next.config.ts maps each top-level entry back to its own URL (/assets/* →
//      /_site/assets/*), after the app's own public files, so nothing in public/ is shadowed;
//   3. bundles the tracking shell (src/lib/site-pages/tracking-shell.ts: the app's own gates, IDs and init options)
//      with esbuild into public/_site/_kh/, content-hashed, and records its URL in build/site/site.json;
//   4. writes build/site/site.json: the page routes, the 404 page, the machine files and the shell's URL.
//
// THE STORIES' PUBLISH PATH: a writer publishes or unpublishes in admin.kheelona.com → Blog; the backend
// (backend-service src/services/blog/rebuild.js) POSTs to WEBSITE_DEPLOY_HOOK_URL, which must be a Deploy Hook of THIS
// Vercel project on the branch that serves kheelona.com (Settings → Git → Deploy Hooks); that build runs prebuild 15 (the
// journal sync: BLOG_SYNC=on, or JOURNAL_SOURCE "api" on production, reads the posts API) and then this step, which
// builds the stories from the fresh snapshot. A sync or gate failure fails the build and the last good deployment stays.
//
// KH_SITE_DIST points at another dist (a local check against a quick build). A production build (resolveSiteEnv)
// fails when the 404 page or a machine file is missing; any other environment warns and goes on. Any failure exits 1,
// so `npm run build` stops and Vercel keeps the last good deployment.

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const SERVER_DIR = join("build", "site");
export const PUBLIC_DIR = join("public", "_site");
export const PUBLIC_PREFIX = "/_site";
export const MACHINE_FILES = ["sitemap.xml", "robots.txt", "llms.txt", "pricing.md"];
/** The redesign's build records (redesign/manifest.json `doNotServe`; dist/asset-manifest.json): kept beside the pages
 *  for the checks, never public. */
export const PRIVATE_FILES = ["manifest.json", "asset-manifest.json", "README.md"];
const SHELL_ENTRY = join("src", "lib", "site-pages", "tracking-shell.ts");
const SHELL_OUT = "_kh";

const toPosix = (p) => p.split(sep).join("/");

/** Every file under `dir`, as POSIX paths relative to it, sorted. */
export function walk(dir, base = dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".DS_Store") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full, base));
    else if (entry.isFile()) out.push(toPosix(relative(base, full)));
  }
  return out.sort();
}

/** The URL path a dist HTML file is served at: index.html → "/", a/b/index.html → "/a/b", a/b.html → "/a/b". */
export function routeOf(file) {
  const path = file.replace(/(?:^|\/)index\.html$/, "").replace(/\.html$/, "");
  return `/${path}`.replace(/\/$/, "") || "/";
}

/** Which environment this build is for, read the way next.config.ts reads it (src/config/env.ts: one rule). Run this
 *  file with type stripping (`--experimental-strip-types`, Node 22; built in from Node 23.6), as the step does. */
async function siteEnv() {
  const { resolveSiteEnv } = await import(join(ROOT, "src", "config", "env.ts"));
  return resolveSiteEnv(process.env);
}

function runSiteBuild(root) {
  const script = join(root, "redesign", "tools", "build-site.sh");
  if (!existsSync(script)) throw new Error("redesign/tools/build-site.sh is missing: the redesign cannot be built");
  console.log("[site] bash redesign/tools/build-site.sh");
  /* The journal was synced by prebuild step 15 under the live rule (BLOG_SYNC, JOURNAL_SOURCE; journal-pipeline §2),
     so the redesign builds from that fresh snapshot without asking the API a second time. */
  const env = { ...process.env, BLOG_SYNC: process.env.KH_STEP_HOOK === "prebuild" ? "off" : (process.env.BLOG_SYNC ?? "off") };
  const run = spawnSync("bash", [script], { cwd: join(root, "redesign"), stdio: "inherit", env });
  if (run.status !== 0) throw new Error(`redesign/tools/build-site.sh failed (${run.status ?? run.signal})`);
}

/** Bundles the tracking shell (one ES module plus PostHog's lazily imported chunk), named by content hash. */
async function bundleShell(root, publicDir) {
  const { build } = await import("esbuild");
  const outdir = join(publicDir, SHELL_OUT);
  const result = await build({
    absWorkingDir: root,
    entryPoints: { tracking: SHELL_ENTRY },
    bundle: true,
    splitting: true,
    format: "esm",
    platform: "browser",
    target: ["es2020"],
    minify: true,
    outdir,
    entryNames: "[name]-[hash]",
    chunkNames: "[name]-[hash]",
    tsconfig: join(root, "tsconfig.json"),
    /* The same production values the Next bundles inline: SITE_ENV for the beta stamp's host list and the Vercel
       Analytics SDK's mode. */
    define: {
      "process.env.NODE_ENV": JSON.stringify("production"),
      "process.env.KH_SITE_ENV": JSON.stringify(await siteEnv()),
    },
    metafile: true,
    logLevel: "warning",
    legalComments: "none",
  });
  const entry = Object.entries(result.metafile.outputs).find(([, o]) => o.entryPoint === toPosix(SHELL_ENTRY));
  if (!entry) throw new Error("esbuild wrote no entry for the tracking shell");
  return `${PUBLIC_PREFIX}/${toPosix(relative(publicDir, join(root, entry[0])))}`;
}

export async function prepare({ root = ROOT, build = true, dist } = {}) {
  const env = await siteEnv();
  const strict = env === "production";
  if (build && !dist) runSiteBuild(root);
  const from = dist ?? join(root, "redesign", "dist");
  if (!existsSync(join(from, "index.html"))) throw new Error(`${from}/index.html is missing: build the redesign first`);

  const serverDir = join(root, SERVER_DIR);
  const publicDir = join(root, PUBLIC_DIR);
  rmSync(serverDir, { recursive: true, force: true });
  rmSync(publicDir, { recursive: true, force: true });
  mkdirSync(join(serverDir, "pages"), { recursive: true });
  mkdirSync(publicDir, { recursive: true });

  const pages = [];
  const machine = [];
  let assets = 0;
  for (const file of walk(from)) {
    const src = join(from, file);
    if (file.endsWith(".html")) {
      cpSync(src, join(serverDir, "pages", file));
      if (file !== "404.html") pages.push({ path: routeOf(file), file: `pages/${file}` });
    } else if (MACHINE_FILES.includes(file)) {
      cpSync(src, join(serverDir, file));
      machine.push(file);
    } else if (PRIVATE_FILES.includes(file)) {
      cpSync(src, join(serverDir, file));
    } else {
      mkdirSync(dirname(join(publicDir, file)), { recursive: true });
      cpSync(src, join(publicDir, file));
      assets++;
    }
  }

  /* A dist file whose URL public/ or an app file convention (icon.png, apple-icon.png) already answers, with other
     bytes: the redesign's wins (one source for the marketing site's files), through an exact beforeFiles rewrite that
     next.config.ts reads from site.json's `overrides`. Same bytes needs nothing. */
  const overrides = walk(publicDir).filter((file) => {
    const other = [join(root, "public", file), join(root, "src", "app", file)].find((p) => existsSync(p));
    return other && !readFileSync(other).equals(readFileSync(join(publicDir, file)));
  });
  for (const file of overrides) console.log(`[site] /${file}: the redesign's file replaces the app's`);

  const problems = [];
  if (!existsSync(join(serverDir, "pages", "404.html"))) problems.push("dist/404.html is missing");
  for (const f of MACHINE_FILES) if (!machine.includes(f)) problems.push(`dist/${f} is missing`);
  const paths = new Set(pages.map((p) => p.path));
  if (paths.size !== pages.length) problems.push("two dist files map to one route");
  /* The SEO manifest's route list (redesign/manifest.json `routes`) and the pages built must agree. */
  const seoManifest = join(serverDir, "manifest.json");
  if (existsSync(seoManifest)) {
    const listed = new Set(
      JSON.parse(readFileSync(seoManifest, "utf8"))
        .routes.filter((r) => r.type !== "404")
        .map((r) => r.path),
    );
    for (const p of paths) if (!listed.has(p)) problems.push(`${p} is built but not in manifest.json routes`);
    for (const p of listed) if (!paths.has(p)) problems.push(`${p} is in manifest.json routes but not built`);
  }
  for (const p of problems) console[strict ? "error" : "warn"](`[site] ${strict ? "" : "warning: "}${p}`);
  if (strict && problems.length) throw new Error(`${problems.length} problem(s) in the redesign build (production)`);

  const tracking = await bundleShell(root, publicDir);
  const manifest = {
    env,
    pages: pages.sort((a, b) => a.path.localeCompare(b.path)),
    notFound: existsSync(join(serverDir, "pages", "404.html")) ? "pages/404.html" : null,
    machine: machine.sort(),
    tracking,
    overrides,
    /* What the redesign itself shipped, by content: changes whenever the build does (a cache key, a log line). */
    digest: createHash("sha256")
      .update(pages.map((p) => readFileSync(join(serverDir, p.file))).join("\0"))
      .digest("hex")
      .slice(0, 12),
  };
  writeFileSync(join(serverDir, "site.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  const kb = Math.round(walk(publicDir).reduce((n, f) => n + statSync(join(publicDir, f)).size, 0) / 1024);
  console.log(
    `[site] ${env}: ${pages.length} pages, 404 ${manifest.notFound ? "yes" : "NO"}, machine files ${machine.length}/4, ` +
      `${assets} public files (${kb} KB), tracking shell ${tracking}`,
  );
  return manifest;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const build = !process.argv.includes("--no-build") && !process.env.KH_SITE_DIST;
  prepare({ build, dist: process.env.KH_SITE_DIST || undefined }).catch((e) => {
    console.error(`[site] ${e.message}`);
    process.exit(1);
  });
}
