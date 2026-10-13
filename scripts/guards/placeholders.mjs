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
// close ruling, task 2.13), whose count is printed on every run. A never-shipped file that shipped
// code imports does ship, so it is scanned and named (its import, export-from, side-effect,
// import() or require() specifier, relative or @/, followed through every hop; the 2.13 review).
// The source scan is the only check of the dynamic routes (/store/*, /api/*): they are never
// prerendered.
// Output scan: everything prerendered, i.e. the prerendered HTML (*.html) and prerendered route
// bodies (*.body: llms.txt, pricing.md, sitemap.xml, robots.txt) under .next/server/app. Binary
// files and dot-files are skipped. A production run with nothing to scan fails: an empty scan
// cannot vouch for a build.
//
// Hidden slots (D054 item 19; task 6.7): an F4 slot (the product's final specs) is hidden, not marked. The content
// layer drops the row or line it is the value of before anything renders (withoutHiddenRows), so the slot may stay in
// the source, where its value lands: the source scan lists it as hidden and never refuses it. Only where it is dropped:
// in a content module (src/content/) and inside one of its withoutHiddenRows( … ) calls, the function imported from
// the placeholder module. Anywhere else an F4 slot would render (and the output scan never reads the dynamic routes,
// /store/* and /api/*), so it is refused like any other. Which items are hidden, how a token's body reads and the
// function's name come from src/lib/content/placeholder.ts (never restated here). A typed marker, a draft and every
// other slot are refused as before, and the output scan stays strict: an F4 slot that reached a page is refused there,
// since nothing of it may render. test/guards/placeholders.test.ts also imports every live module holding a hidden slot
// and checks that none of its exported values still holds one.
//
// The build steps scripts/steps/prebuild/30-placeholders.mjs and
// scripts/steps/postbuild/10-placeholders-html.mjs run this file; test/guards/placeholders.test.ts
// proves it red and green, and runs the source scan in development on every `npm run verify`.

import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { dirname, join, posix as posixPath, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import {
  HIDDEN_ITEMS,
  isHiddenPlaceholder,
  parsePlaceholderToken,
  placeholder,
  withoutHiddenRows,
} from "../../src/lib/content/placeholder.ts";

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
/** The content modules, by repo path: the only place a hidden slot may stay, since only the content layer drops it. */
const HIDDEN_SLOT_DIR = `${SOURCE_DIR}/content/`;
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

/** The module specifiers a source text names: import and export-from declarations (multi-line
 *  too), side-effect imports, import() and require() with a literal. Comments are read as code,
 *  as everywhere in this scan, so a commented-out import still pulls its file in. */
const SPECIFIERS = [
  /\bfrom\s*["']([^"'\n]+)["']/g,
  /\bimport\s*["']([^"'\n]+)["']/g,
  /\bimport\s*\(\s*["'`]([^"'`\n]+)["'`]\s*\)/g,
  /\brequire\s*\(\s*["']([^"'\n]+)["']\s*\)/g,
];
const CODE_FILE = /\.(?:[cm]?[jt]sx?)$/;
const RESOLVE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".mts", ".cts", ".json"];

/**
 * The repo file (posix) a relative or @/ specifier resolves to, as the bundler would: the exact
 * path, then each extension, then the folder's index; null for a package or a missing file.
 * @param {string} from  the importing file, a repo path
 * @param {string} spec
 * @param {Set<string>} known  every file under src/, as repo paths
 */
function resolveSpecifier(from, spec, known) {
  const path = spec.replace(/[?#].*$/, "");
  let target;
  if (path.startsWith("@/")) target = `${SOURCE_DIR}/${path.slice(2)}`;
  else if (path.startsWith("./") || path.startsWith("../")) target = posixPath.join(posixPath.dirname(from), path);
  else return null;
  const candidates = [
    target,
    ...RESOLVE_EXTENSIONS.map((ext) => `${target}${ext}`),
    ...RESOLVE_EXTENSIONS.map((ext) => `${target}/index${ext}`),
  ];
  return candidates.find((c) => known.has(c)) ?? null;
}

/** A helper call's first argument, a quoted id or null: `placeholder("F4", …)`. */
const HELPER_ID = /^placeholder\(\s*(?:(["'`])([^"'`\n]*)\1|null)\s*,/;

/**
 * True when a source finding is a hidden slot (D054 item 19): an inline token or a helper call whose open item
 * placeholder.ts hides. A typed marker or a draft never is (a marker in the source renders as it is). The scan asks
 * only of a content module's findings (HIDDEN_SLOT_DIR), and keeps one as hidden only inside a dropSpans call.
 * @param {string} text
 * @param {{ pattern: string, index: number, end: number }} hit
 */
function isHiddenSlot(text, hit) {
  try {
    if (hit.pattern === "token") {
      const close = text.indexOf("}", hit.end);
      return close !== -1 && isHiddenPlaceholder(parsePlaceholderToken(text.slice(hit.end, close)));
    }
    if (hit.pattern === "helper") {
      const id = HELPER_ID.exec(text.slice(hit.index, hit.index + 200));
      return id !== null && id[2] !== undefined && isHiddenPlaceholder(placeholder(id[2], "a hidden slot"));
    }
  } catch {
    // A slot the syntax refuses is no hidden slot: it stays a finding.
  }
  return false;
}

/** The function that drops a hidden slot's row or line (src/lib/content/placeholder.ts), by its own name. */
const DROP = withoutHiddenRows.name;
/** A module's own import of it, not renamed, from the placeholder module (by the @/ alias or a relative path). */
const DROP_IMPORT = new RegExp(
  String.raw`\bimport\s*\{[^}]*\b${DROP}\b(?!\s+as\b)[^}]*\}\s*from\s*(["'])(?:@\/|(?:\.\.?\/)+)lib\/content\/placeholder(?:\.ts)?\1`,
);
const IDENT_CHAR = /[\w$]/;
const SPACE = /\s/;

/** The plain name called by the "(" at index `open` (a member call such as `x.name(` is none), or null. */
function calleeAt(text, open) {
  let end = open;
  while (end > 0 && SPACE.test(text[end - 1])) end--;
  let start = end;
  while (start > 0 && IDENT_CHAR.test(text[start - 1])) start--;
  if (start === end) return null;
  let before = start;
  while (before > 0 && SPACE.test(text[before - 1])) before--;
  return text[before - 1] === "." ? null : { name: text.slice(start, end), start };
}

/**
 * The spans [start, end) of a module's withoutHiddenRows( … ) calls, the only places a hidden slot is dropped before it
 * renders; none when the module does not import the function from the placeholder module. Read off the code alone:
 * strings, template literals (their ${ … } read as code) and comments are skipped, so a bracket or the name inside one
 * opens or closes nothing. A call that never closes spans nothing, so a slot the reading cannot place inside a closed
 * call is refused.
 * @param {string} text
 * @returns {Array<[number, number]>}
 */
function dropSpans(text) {
  if (!DROP_IMPORT.test(text)) return [];
  const spans = [];
  const parens = []; // per open "(": where its call starts when it calls DROP, else -1
  const braces = []; // per open "{": true when it opens a template literal's ${ … }
  const n = text.length;
  /** From just inside a template literal: past its closing backtick, or past the next "${" (then read as code). */
  const template = (from) => {
    for (let j = from; j < n; j++) {
      if (text[j] === "\\") j++;
      else if (text[j] === "`") return j + 1;
      else if (text[j] === "$" && text[j + 1] === "{") {
        braces.push(true);
        return j + 2;
      }
    }
    return n;
  };
  let i = 0;
  while (i < n) {
    const c = text[i];
    if (c === "/" && text[i + 1] === "/") {
      const end = text.indexOf("\n", i);
      i = end === -1 ? n : end;
    } else if (c === "/" && text[i + 1] === "*") {
      const end = text.indexOf("*/", i + 2);
      i = end === -1 ? n : end + 2;
    } else if (c === '"' || c === "'") {
      let j = i + 1;
      while (j < n && text[j] !== c && text[j] !== "\n") j += text[j] === "\\" ? 2 : 1;
      i = j + 1;
    } else if (c === "`") {
      i = template(i + 1);
    } else if (c === "}" && braces.pop()) {
      i = template(i + 1);
    } else {
      if (c === "{") braces.push(false);
      else if (c === "(") {
        const callee = calleeAt(text, i);
        parens.push(callee?.name === DROP ? callee.start : -1);
      } else if (c === ")") {
        const start = parens.pop();
        if (start !== undefined && start !== -1) spans.push([start, i + 1]);
      }
      i++;
    }
  }
  return spans;
}

/**
 * Scans src/ under root, minus EXCLUDED and the files that never ship (counted in `notShipped`).
 * A never-shipped file that a shipped file imports ships after all: it is scanned and listed in
 * `importedNeverShipped` with the first file that pulled it in.
 * @param {string} [root]
 */
export function scanSource(root = REPO) {
  const dir = join(root, SOURCE_DIR);
  const base = { kind: "source", target: `${SOURCE_DIR}/`, excluded: [...EXCLUDED] };
  if (!isDir(dir)) return { ...base, missing: true, files: 0, notShipped: 0, importedNeverShipped: [], findings: [], hidden: [] };
  const all = walk(dir).map((path) => ({ path, file: posix(relative(root, path)) }));
  const known = new Set(all.map((f) => f.file));
  const byFile = new Map(all.map((f) => [f.file, f.path]));
  const texts = new Map();
  const textOf = (file) => {
    if (!texts.has(file)) texts.set(file, readText(byFile.get(file)));
    return texts.get(file);
  };

  // Shipped: everything but the syntax files and the never-shipped ones, plus every never-shipped
  // file a shipped file imports, hop after hop.
  const shipped = new Set(all.map((f) => f.file).filter((file) => !EXCLUDED.includes(file) && !isNeverShipped(file)));
  const importedNeverShipped = [];
  const queue = [...shipped];
  while (queue.length > 0) {
    const from = queue.shift();
    if (!CODE_FILE.test(from)) continue;
    const text = textOf(from);
    if (text === null) continue;
    for (const re of SPECIFIERS) {
      for (const m of text.matchAll(re)) {
        const target = resolveSpecifier(from, m[1], known);
        if (target === null || shipped.has(target) || EXCLUDED.includes(target)) continue;
        shipped.add(target);
        importedNeverShipped.push({ file: target, by: from });
        queue.push(target);
      }
    }
  }

  let files = 0;
  let notShipped = 0;
  const findings = [];
  const hidden = [];
  for (const { file } of all) {
    if (EXCLUDED.includes(file)) continue;
    if (!shipped.has(file)) {
      notShipped++;
      continue;
    }
    const text = textOf(file);
    if (text === null) continue;
    files++;
    let spans = null; // read once, on the file's first hidden-slot candidate
    for (const hit of findPlaceholders(text)) {
      const finding = { file, line: hit.line, pattern: hit.pattern, label: hit.label, excerpt: lineExcerpt(text, hit.index) };
      const dropped =
        file.startsWith(HIDDEN_SLOT_DIR) &&
        isHiddenSlot(text, hit) &&
        (spans ??= dropSpans(text)).some(([start, end]) => hit.index > start && hit.end <= end);
      (dropped ? hidden : findings).push(finding);
    }
  }
  return { ...base, missing: false, files, notShipped, importedNeverShipped, findings, hidden };
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
  return { ...base, missing: pages === 0, files, findings, hidden: [] };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** One line per distinct finding; repeats on the same line or page are counted, not repeated. */
function listLines(scan, findings = scan.findings) {
  const counts = new Map();
  for (const f of findings) {
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
  const hidden = scan.hidden ?? [];
  const hiddenFiles = [...new Set(hidden.map((h) => h.file))];
  const hiddenLines = hidden.length
    ? [
        `${tag} hidden until their value arrives, never rendered (D054 item 19): ${plural(hidden.length, `${HIDDEN_ITEMS.join(", ")} slot`)} in ${plural(hiddenFiles.length, "file")} (${hiddenFiles.join(", ")})`,
        ...(production ? [] : listLines(scan, hidden)),
      ]
    : [];
  const excludedLine = [
    ...(scan.excluded.length ? [`${tag} not scanned, they define the syntax: ${scan.excluded.join(", ")}`] : []),
    ...(scan.kind === "source"
      ? [`${tag} not scanned (never shipped): ${plural(scan.notShipped ?? 0, "file")} (tests, specs, type tests, stories, snapshots, fixtures)`]
      : []),
    ...(scan.importedNeverShipped?.length
      ? [
          `${tag} scanned as shipped (shipped code imports them): ${scan.importedNeverShipped
            .map((x) => `${x.file} (from ${x.by})`)
            .join(", ")}`,
        ]
      : []),
    ...hiddenLines,
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
