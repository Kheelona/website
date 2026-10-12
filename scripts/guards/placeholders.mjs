// The placeholder build guard (task 2.9; architecture §6.2 and §14; ADR-004; QA review N25).
//
//   node scripts/guards/placeholders.mjs --source [--root <dir>]   src/, before next build
//   node scripts/guards/placeholders.mjs --html   [--root <dir>]   .next/server/app, after it
//
// An open placeholder is a fact the founder has not supplied yet: the inline token, the data
// helper's call, the visible marker it renders, or a legal document still in draft. Production
// must never ship one; beta shows every one in place so the founder can see what is missing.
// So a PRODUCTION build (resolveSiteEnv(process.env), imported from src/config/env.ts: the one
// rule, never restated here) exits 1 on any finding. Beta, preview and development print the
// count and the list and exit 0.
//
// Source scan: every text file under src/, comments included (the token in a comment is still
// the token; write "the ph token" instead), except the two files that define the syntax (N25) and
// the files that never ship (tests, specs, type tests, stories, snapshots and fixtures: the wave-2
// close ruling, task 2.13), whose count is printed on every run. Nothing that ships escapes: the
// output scan below reads everything the build prerendered.
// Output scan: the prerendered HTML (*.html) and prerendered route bodies (*.body: llms.txt,
// pricing.md, sitemap.xml, robots.txt) under .next/server/app. Binary files and dot-files are
// skipped. A production run with nothing to scan fails: an empty scan cannot vouch for a build.
//
// The build steps scripts/steps/prebuild/30-placeholders.mjs and
// scripts/steps/postbuild/10-placeholders-html.mjs run this file; test/guards/placeholders.test.ts
// proves it red and green, and runs the source scan in development on every `npm run verify`.

import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

/** The two files that define the syntax, by exact repo path (QA review N25). Printed every run. */
export const EXCLUDED = Object.freeze(["src/lib/content/placeholder.ts", "src/content/types.ts"]);

/** Files that never ship, by repo path: tests, specs, type tests and stories by name, snapshots and
 *  fixtures by folder (wave-2 close ruling, task 2.13). Not scanned; their count is printed. */
export const NEVER_SHIPPED = Object.freeze([/\.(?:test|test-d|spec|stories)\.[^/]+$/, /(?:^|\/)__(?:snapshots|fixtures)__\//]);

/** True when the file at this repo path (posix separators) never ships. */
export function isNeverShipped(file) {
  return NEVER_SHIPPED.some((re) => re.test(file));
}

/** What counts as an open placeholder. The literals are task 1.6's syntax
 *  (src/lib/content/placeholder.ts); the draft form also matches a template literal, JSON and
 *  escaped flight data. */
export const PATTERNS = Object.freeze([
  { id: "token", label: "{ph:} token", re: /\{ph:/g },
  { id: "helper", label: "placeholder() call", re: /placeholder\(/g },
  { id: "marker", label: "[PLACEHOLDER marker", re: /\[PLACEHOLDER/g },
  { id: "draft", label: "draft legal document", re: /status\\?["']?\s*:\s*\\?["'`]draft\\?["'`]/g },
]);

const SOURCE_DIR = "src";
const BUILD_DIR = join(".next", "server", "app");
const BUILD_FILE = /\.(?:html|body)$/;

/**
 * Every open placeholder in one text, in order of position.
 * @param {string} text
 * @returns {{ pattern: string, label: string, index: number, end: number, line: number }[]}
 */
export function findPlaceholders(text) {
  const hits = [];
  for (const { id, label, re } of PATTERNS) {
    for (const m of text.matchAll(re)) {
      hits.push({ pattern: id, label, index: m.index, end: m.index + m[0].length, line: lineAt(text, m.index) });
    }
  }
  return hits.sort((a, b) => a.index - b.index);
}

function lineAt(text, index) {
  let line = 1;
  for (let i = text.indexOf("\n"); i !== -1 && i < index; i = text.indexOf("\n", i + 1)) line++;
  return line;
}

/** Files under dir (recursive), skipping dot-files and dot-folders, tolerating a file or folder
 *  that vanishes while it is listed (a concurrent temp file, task 1.2b). */
function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    if (e.code === "ENOENT") return [];
    throw e;
  }
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

/** The file as text, or null when it is binary (a NUL byte) or has vanished. */
function readText(path) {
  let bytes;
  try {
    bytes = readFileSync(path);
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
  return bytes.includes(0) ? null : bytes.toString("utf8");
}

const posix = (p) => p.split(sep).join("/");

function isDir(path) {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
}

/** The source line holding the match, trimmed, windowed around it when long. */
function lineExcerpt(text, index) {
  const start = text.lastIndexOf("\n", index - 1) + 1;
  const stop = text.indexOf("\n", index);
  const line = text.slice(start, stop === -1 ? text.length : stop);
  const col = index - start;
  if (line.length <= 160) return line.trim();
  const from = Math.max(0, col - 40);
  return `${from > 0 ? "…" : ""}${line.slice(from, from + 160).trim()}…`;
}

/** The match and what follows, up to the end of the marker or token (HTML is one long line). */
function outputExcerpt(text, hit) {
  const cap = Math.min(text.length, hit.end + 80);
  let stop = cap;
  for (let i = hit.end; i < cap; i++) {
    const c = text[i];
    if (c === "]" || c === "}") {
      stop = i + 1;
      break;
    }
    if (c === "<" || c === "\n") {
      stop = i;
      break;
    }
  }
  return text.slice(hit.index, stop);
}

/**
 * Scans src/ under root, minus EXCLUDED and the files that never ship (counted in `notShipped`).
 * @param {string} [root]
 */
export function scanSource(root = REPO) {
  const dir = join(root, SOURCE_DIR);
  const base = { kind: "source", target: `${SOURCE_DIR}/`, excluded: [...EXCLUDED] };
  if (!isDir(dir)) return { ...base, missing: true, files: 0, notShipped: 0, findings: [] };
  let files = 0;
  let notShipped = 0;
  const findings = [];
  for (const path of walk(dir)) {
    const file = posix(relative(root, path));
    if (EXCLUDED.includes(file)) continue;
    if (isNeverShipped(file)) {
      notShipped++;
      continue;
    }
    const text = readText(path);
    if (text === null) continue;
    files++;
    for (const hit of findPlaceholders(text)) {
      findings.push({ file, line: hit.line, pattern: hit.pattern, label: hit.label, excerpt: lineExcerpt(text, hit.index) });
    }
  }
  return { ...base, missing: false, files, notShipped, findings };
}

/**
 * Scans the prerendered HTML and route bodies in .next/server/app under root.
 * React's empty text separator (<!-- -->) is removed first, so a split marker still reads whole.
 * @param {string} [root]
 */
export function scanBuild(root = REPO) {
  const dir = join(root, BUILD_DIR);
  const base = { kind: "build", target: `${posix(BUILD_DIR)}/`, excluded: [] };
  let files = 0;
  let pages = 0;
  const findings = [];
  for (const path of walk(dir)) {
    if (!BUILD_FILE.test(path)) continue;
    const raw = readText(path);
    if (raw === null) continue;
    files++;
    if (path.endsWith(".html")) pages++;
    const text = raw.replaceAll("<!-- -->", "");
    const file = posix(relative(dir, path));
    for (const hit of findPlaceholders(text)) {
      findings.push({ file, line: hit.line, pattern: hit.pattern, label: hit.label, excerpt: outputExcerpt(text, hit) });
    }
  }
  return { ...base, missing: pages === 0, files, findings };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** One line per distinct finding; repeats on the same line or page are counted, not repeated. */
function listLines(scan) {
  const counts = new Map();
  for (const f of scan.findings) {
    const where = scan.kind === "source" ? `${f.file}:${f.line}` : f.file;
    const key = `  ${where}  ${f.label}  ${f.excerpt}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts].map(([key, n]) => (n > 1 ? `${key}  (x${n})` : key));
}

/**
 * What a run does in this environment: the exit code and the lines for stdout and stderr.
 * @param {"production" | "beta" | "preview" | "development"} siteEnv
 * @param {ReturnType<typeof scanSource> | ReturnType<typeof scanBuild>} scan
 * @returns {{ code: number, out: string[], err: string[] }}
 */
export function decide(siteEnv, scan) {
  const production = siteEnv === "production";
  const tag = "[placeholders]";
  const what = scan.kind === "source" ? "files scanned" : "prerendered files scanned";
  const excludedLine = [
    ...(scan.excluded.length ? [`${tag} not scanned, they define the syntax: ${scan.excluded.join(", ")}`] : []),
    ...(scan.kind === "source"
      ? [`${tag} not scanned (never shipped): ${plural(scan.notShipped ?? 0, "file")} (tests, specs, type tests, stories, snapshots, fixtures)`]
      : []),
  ];

  if (scan.missing) {
    const note =
      scan.kind === "source"
        ? `${tag} ${scan.target}: nothing to scan (no ${scan.target} folder)`
        : `${tag} ${scan.target}: nothing to scan (no prerendered HTML; run after next build)`;
    if (production) {
      return { code: 1, out: [], err: [note, `${tag} production build stops: an empty scan cannot vouch for it.`] };
    }
    return { code: 0, out: [note, `${tag} ${siteEnv}: skipped.`], err: [] };
  }

  const files = new Set(scan.findings.map((f) => f.file)).size;
  const n = scan.findings.length;
  if (n === 0) {
    return {
      code: 0,
      out: [`${tag} ${scan.target}: no open placeholders (${scan.files} ${what}; SITE_ENV=${siteEnv})`, ...excludedLine],
      err: [],
    };
  }

  const report = [
    `${tag} ${scan.target}: ${plural(n, "open placeholder")} in ${plural(files, "file")} (${scan.files} ${what}; SITE_ENV=${siteEnv})`,
    ...listLines(scan),
    ...excludedLine,
  ];
  if (production) {
    return {
      code: 1,
      out: [],
      err: [
        ...report,
        `${tag} production build refused: answer each placeholder or cut its sentence (architecture §6.2, ADR-004).`,
      ],
    };
  }
  return {
    code: 0,
    out: [...report, `${tag} ${siteEnv}: listed for the founder; the build continues. A production build stops on any of these.`],
    err: [],
  };
}

async function siteEnvFromProcess() {
  let env;
  try {
    env = await import(new URL("../../src/config/env.ts", import.meta.url).href);
  } catch (e) {
    throw new Error(
      `cannot import src/config/env.ts (Node 24 type stripping is required): ${e instanceof Error ? e.message : e}`,
    );
  }
  return env.resolveSiteEnv(process.env);
}

function parseArgs(argv) {
  const modes = argv.filter((a) => a === "--source" || a === "--html");
  const at = argv.indexOf("--root");
  const root = at === -1 ? REPO : argv[at + 1];
  const known = new Set(["--source", "--html", "--root", root]);
  const unknown = argv.filter((a) => !known.has(a));
  if (modes.length !== 1 || !root || unknown.length) return null;
  return { mode: modes[0], root };
}

async function main(argv) {
  const args = parseArgs(argv);
  if (!args) {
    console.error("usage: node scripts/guards/placeholders.mjs (--source | --html) [--root <dir>]");
    return 2;
  }
  let siteEnv;
  try {
    siteEnv = await siteEnvFromProcess();
  } catch (e) {
    console.error(`[placeholders] ${e instanceof Error ? e.message : e}`);
    return 1;
  }
  const scan = args.mode === "--source" ? scanSource(args.root) : scanBuild(args.root);
  const { code, out, err } = decide(siteEnv, scan);
  for (const line of out) console.log(line);
  for (const line of err) console.error(line);
  return code;
}

/* Run as a script (the build steps spawn it), not when a test imports it. realpath, because the
   loader resolves symlinks in import.meta.url and argv[1] keeps them: a mismatch would skip main()
   and pass silently. */
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await main(process.argv.slice(2));
}
