#!/usr/bin/env node
// Wiki lint (KICKOFF.md section 5, "Lint" at the end of every phase).
//
//   node scripts/wiki-lint.mjs
//
// Checks every page under wiki/ (except the immutable wiki/raw/):
//   1. front matter exists and has title, type, updated and sources;
//   2. every relative link resolves to a file, and every #anchor to a heading in it
//      (GitHub-style slugs, code fences and inline code ignored).
// Exits 1 on any problem. Contradictions, stale claims and open TODOs still need a reader.

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(fileURLToPath(import.meta.url), "..", "..", "wiki");
const REQUIRED = ["title", "type", "updated", "sources"];

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) return p === join(ROOT, "raw") ? [] : walk(p);
    return p.endsWith(".md") ? [p] : [];
  });

const slug = (heading) =>
  heading
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*]/g, "")
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\-_ ]/gu, "")
    .replace(/ /g, "-");

/** Lines outside code fences, with their 1-based numbers. */
function* prose(text) {
  let fenced = false;
  for (const [i, line] of text.split("\n").entries()) {
    if (line.trim().startsWith("```")) { fenced = !fenced; continue; }
    if (!fenced) yield [i + 1, line];
  }
}

const anchorCache = new Map();
function anchors(file) {
  if (anchorCache.has(file)) return anchorCache.get(file);
  const seen = new Map();
  const out = new Set();
  for (const [, line] of prose(readFileSync(file, "utf8"))) {
    const m = /^#{1,6}\s+(.*?)\s*#*\s*$/.exec(line);
    if (m) {
      const s = slug(m[1]);
      const n = seen.get(s);
      out.add(n === undefined ? s : `${s}-${n + 1}`);
      seen.set(s, n === undefined ? 0 : n + 1);
    }
    for (const a of line.matchAll(/<a\s+(?:name|id)="([^"]+)"/g)) out.add(a[1]);
  }
  anchorCache.set(file, out);
  return out;
}

const problems = [];
const pages = walk(ROOT).sort();
for (const page of pages) {
  const rel = relative(ROOT, page);
  const text = readFileSync(page, "utf8");

  const fm = /^---\n([\s\S]*?)\n---\n/.exec(text);
  if (!fm) problems.push(`${rel}: no front matter`);
  else for (const key of REQUIRED) {
    if (!new RegExp(`^${key}:`, "m").test(fm[1])) problems.push(`${rel}: front matter lacks "${key}"`);
  }

  for (const [n, line] of prose(text)) {
    const bare = line.replace(/`[^`]*`/g, "");
    for (const m of bare.matchAll(/(?<!!)\[[^\]]*\]\(<?([^)\s>]+)>?(?:\s+"[^"]*")?\)/g)) {
      const target = m[1];
      if (/^[a-z]+:/i.test(target) || target.startsWith("//")) continue;
      const [path, frag] = target.split("#");
      const file = path ? normalize(join(dirname(page), decodeURIComponent(path))) : page;
      if (!existsSync(file)) { problems.push(`${rel}:${n} -> ${target} (missing file)`); continue; }
      if (frag && file.endsWith(".md") && !anchors(file).has(frag)) {
        problems.push(`${rel}:${n} -> ${target} (missing anchor)`);
      }
    }
  }
}

if (problems.length) {
  console.error(`wiki lint: ${problems.length} problem(s) in ${pages.length} pages\n${problems.join("\n")}`);
  process.exit(1);
}
console.log(`wiki lint: ${pages.length} pages, front matter complete, every link resolves`);
