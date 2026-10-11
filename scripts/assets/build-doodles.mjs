#!/usr/bin/env node
// Writes src/assets/doodles.generated.tsx: one inline SVG component per DS doodle the pages use,
// ready to draw itself (D049 pick 3; ADR-010; architecture §10 and §11.3; task 1.5).
//
//   node scripts/assets/build-doodles.mjs
//
// Source: design-system/project/assets/Doodles/<name>.svg for each name in DOODLE_FILES, read-only.
// Per doodle, the DS drawing is kept verbatim (paths, colours, stroke widths, the grain groups) and:
//   - the root becomes <svg class="ks-doodle" aria-hidden="true" focusable="false"> with the DS
//     viewBox only (no width, height, role, aria-label; <title> dropped): doodles are decorative,
//     and the page sizes them as it sized the <img> they replace;
//   - every stroked path gets pathLength="1" (motion.css draws `path[pathLength]` from 1 to 0);
//   - every filled shape gets class ks-doodle__fill (it fades in when the lines are drawn);
//   - the per-file <defs> grain filter (id "chalk", identical in every DS doodle) is dropped and
//     filter="url(#chalk)" points at the one shared filter, #ks-chalk, exported here as
//     DoodleChalkFilter and rendered once per page by ui/Doodle/DoodleDefs.
// The script stops on anything it cannot carry faithfully: a doodle whose filter differs from the
// shared one, a stroked shape that is not a path, an unknown element or attribute.
// test/guards/generated-doodles.test.ts regenerates in memory and fails on drift.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DOODLES_DIR = join(ROOT, "design-system", "project", "assets", "Doodles");
const OUT = join(ROOT, "src", "assets", "doodles.generated.tsx");

/** The DS doodles the approved pages place (assets.md §1). A new one: add its file name here. */
export const DOODLE_FILES = [
  "chalk-heart",
  "chalk-planet",
  "chalk-question-mark",
  "chalk-spark-lines",
  "chalk-speech-bubble",
  "chalk-star",
  "chalk-thought-cloud",
  "ink-heart",
  "ink-question-mark",
  "ink-spark-lines",
  "ink-star",
];

const SHARED_FILTER_ID = "ks-chalk";

// Attributes each element may carry, with their JSX names. Anything else stops the script.
const SHAPE = { d: "d", cx: "cx", cy: "cy", r: "r", fill: "fill", stroke: "stroke", "stroke-width": "strokeWidth", "stroke-linecap": "strokeLinecap", "stroke-linejoin": "strokeLinejoin" };
const ALLOWED = {
  svg: { xmlns: null, viewBox: null, width: null, height: null, role: null, "aria-label": null },
  title: {},
  defs: {},
  filter: { id: "id", x: "x", y: "y", width: "width", height: "height", "color-interpolation-filters": "colorInterpolationFilters" },
  feTurbulence: { type: "type", baseFrequency: "baseFrequency", numOctaves: "numOctaves", seed: "seed", result: "result" },
  feColorMatrix: { in: "in", type: "type", values: "values", result: "result" },
  feComposite: { in: "in", in2: "in2", operator: "operator" },
  g: { filter: "filter" },
  path: SHAPE,
  circle: SHAPE,
};

const TOKEN = /<!--[\s\S]*?-->|<\?[\s\S]*?\?>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[\w:-]+="[^"]*")*)\s*(\/?)>|([^<]+)/y;

/** A strict parser for the DS doodle SVGs: elements, attributes, text; nothing skipped silently. */
function parse(file, src) {
  const root = { tag: "#root", attrs: [], children: [] };
  const stack = [root];
  TOKEN.lastIndex = 0;
  while (TOKEN.lastIndex < src.length) {
    const at = TOKEN.lastIndex;
    const m = TOKEN.exec(src);
    if (!m) throw new Error(`build-doodles: ${file}: cannot parse at offset ${at}`);
    const [, close, open, attrText, selfClose, text] = m;
    const top = stack[stack.length - 1];
    if (open) {
      const attrs = [...attrText.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]);
      const el = { tag: open, attrs, children: [] };
      top.children.push(el);
      if (!selfClose) stack.push(el);
    } else if (close) {
      if (close !== top.tag) throw new Error(`build-doodles: ${file}: </${close}> closes <${top.tag}>`);
      stack.pop();
    } else if (text !== undefined) {
      if (text.trim()) top.children.push({ tag: "#text", text });
    }
  }
  if (stack.length !== 1) throw new Error(`build-doodles: ${file}: <${stack[stack.length - 1].tag}> is never closed`);
  const svgs = root.children.filter((c) => c.tag === "svg");
  if (svgs.length !== 1) throw new Error(`build-doodles: ${file}: expected one <svg>`);
  return svgs[0];
}

const attr = (el, name) => el.attrs.find(([k]) => k === name)?.[1];
const isSet = (v) => v !== undefined && v !== "none";

/** A stable text form of an element subtree, to compare the filters of different files. */
const canonical = (el) =>
  el.tag === "#text" ? el.text.trim() : `<${el.tag}${el.attrs.map(([k, v]) => ` ${k}="${v}"`).join("")}>${el.children.map(canonical).join("")}</${el.tag}>`;

function checkAttrs(file, el) {
  const allowed = ALLOWED[el.tag];
  if (!allowed) throw new Error(`build-doodles: ${file}: unsupported element <${el.tag}>`);
  for (const [k, v] of el.attrs) {
    if (!(k in allowed)) throw new Error(`build-doodles: ${file}: unsupported attribute ${k} on <${el.tag}>`);
    if (/[&{}<>]/.test(v)) throw new Error(`build-doodles: ${file}: attribute ${k} on <${el.tag}> holds a character JSX would change`);
  }
}

function jsxAttrs(file, el, extra = []) {
  checkAttrs(file, el);
  const map = ALLOWED[el.tag];
  return [...extra, ...el.attrs.map(([k, v]) => `${map[k]}="${v}"`)].join(" ");
}

/** JSX for one element of the drawing (below the root and outside <defs>). */
function drawing(file, el, filterRef, depth) {
  const pad = "  ".repeat(depth);
  if (el.tag === "#text") throw new Error(`build-doodles: ${file}: unexpected text "${el.text.trim()}"`);
  checkAttrs(file, el);
  const extra = [];
  let attrs = el.attrs;
  if (el.tag === "g") {
    const ref = attr(el, "filter");
    if (ref !== undefined && ref !== `url(#${filterRef})`) throw new Error(`build-doodles: ${file}: filter="${ref}" is not the file's grain filter`);
    attrs = attrs.map(([k, v]) => (k === "filter" ? [k, `url(#${SHARED_FILTER_ID})`] : [k, v]));
  } else if (el.tag === "path" || el.tag === "circle") {
    if (isSet(attr(el, "fill"))) extra.push('className="ks-doodle__fill"');
    if (isSet(attr(el, "stroke"))) {
      if (el.tag !== "path") throw new Error(`build-doodles: ${file}: stroked <${el.tag}>; the draw animates path[pathLength] only`);
      extra.push("pathLength={1}");
    }
    if (el.children.length) throw new Error(`build-doodles: ${file}: <${el.tag}> has children`);
  } else {
    throw new Error(`build-doodles: ${file}: unsupported element <${el.tag}> in the drawing`);
  }
  const open = `<${el.tag} ${jsxAttrs(file, { ...el, attrs }, extra)}`.trimEnd();
  if (!el.children.length) return `${pad}${open} />`;
  return [`${pad}${open}>`, ...el.children.map((c) => drawing(file, c, filterRef, depth + 1)), `${pad}</${el.tag}>`].join("\n");
}

/** JSX for the shared filter, from the first doodle's <filter>. */
function filterJsx(file, el, depth) {
  const pad = "  ".repeat(depth);
  if (el.tag === "#text") throw new Error(`build-doodles: ${file}: unexpected text in <filter>`);
  const attrs = el.tag === "filter" ? el.attrs.map(([k, v]) => (k === "id" ? [k, SHARED_FILTER_ID] : [k, v])) : el.attrs;
  const open = `<${el.tag} ${jsxAttrs(file, { ...el, attrs })}`;
  if (!el.children.length) return `${pad}${open} />`;
  return [`${pad}${open}>`, ...el.children.map((c) => filterJsx(file, c, depth + 1)), `${pad}</${el.tag}>`].join("\n");
}

const pascal = (name) => name.replace(/(^|-)([a-z])/g, (_, __, c) => c.toUpperCase());

/** The content of doodles.generated.tsx for `names` read from `doodlesDir`. */
export function generateDoodles({ doodlesDir = DOODLES_DIR, names = DOODLE_FILES } = {}) {
  const sorted = [...names].sort();
  let shared;
  const components = sorted.map((name) => {
    const file = `${name}.svg`;
    const svg = parse(file, readFileSync(join(doodlesDir, file), "utf8"));
    checkAttrs(file, svg);
    const viewBox = attr(svg, "viewBox");
    if (!viewBox) throw new Error(`build-doodles: ${file}: no viewBox`);
    const defs = svg.children.filter((c) => c.tag === "defs");
    const filters = defs.flatMap((d) => d.children);
    if (defs.length !== 1 || filters.length !== 1 || filters[0].tag !== "filter") {
      throw new Error(`build-doodles: ${file}: expected one <defs> holding one <filter>`);
    }
    const filter = filters[0];
    if (!shared) shared = { file, filter, text: canonical({ ...filter, attrs: filter.attrs.filter(([k]) => k !== "id") }) };
    else if (canonical({ ...filter, attrs: filter.attrs.filter(([k]) => k !== "id") }) !== shared.text) {
      throw new Error(`build-doodles: ${file}: the grain filter differs from ${shared.file}'s; one shared #${SHARED_FILTER_ID} filter would change its look`);
    }
    const body = svg.children
      .filter((c) => c.tag !== "title" && c.tag !== "defs")
      .map((c) => drawing(file, c, attr(filter, "id"), 3));
    return [
      `export function ${pascal(name)}({ className, ...props }: DoodleProps) {`,
      "  return (",
      `    <svg {...props} className={rootClass(className)} viewBox="${viewBox}" role={undefined} aria-label={undefined} aria-hidden="true" focusable="false">`,
      ...body,
      "    </svg>",
      "  );",
      "}",
    ].join("\n");
  });
  const source = relative(ROOT, doodlesDir).split("\\").join("/");
  const union = sorted.map((name, i) => `  | ${JSON.stringify(name)}${i === sorted.length - 1 ? ";" : ""}`);
  return [
    `// GENERATED by scripts/assets/build-doodles.mjs, do not edit; source ${source}/{${sorted.join(",")}}.svg`,
    "// (D049 pick 3: inline doodles that draw themselves; ADR-010). Regenerate: node scripts/assets/build-doodles.mjs",
    'import type { ReactElement, SVGProps } from "react";',
    "",
    "/** A DS doodle the pages use. To add one, list its file in DOODLE_FILES of build-doodles.mjs. */",
    "export type DoodleName =",
    ...union,
    "",
    "export const DOODLE_NAMES: readonly DoodleName[] = [",
    ...sorted.map((name) => `  ${JSON.stringify(name)},`),
    "];",
    "",
    "/** The one shared chalk grain filter every doodle points at. */",
    `export const DOODLE_FILTER_ID = ${JSON.stringify(SHARED_FILTER_ID)};`,
    "",
    "/** Layout and motion props for the root (className, style, data-draw, data-draw-order). Doodles are decorative. */",
    'export type DoodleProps = Omit<SVGProps<SVGSVGElement>, "children" | "viewBox" | "role" | "aria-hidden" | "aria-label" | "focusable">;',
    "",
    'const rootClass = (className: string | undefined) => (className ? `ks-doodle ${className}` : "ks-doodle");',
    "",
    `/** The DS grain filter (${shared.file}, identical in every doodle) as #${SHARED_FILTER_ID}. Render once per page, inside <defs>. */`,
    "export function DoodleChalkFilter() {",
    "  return (",
    filterJsx(shared.file, shared.filter, 2),
    "  );",
    "}",
    "",
    components.join("\n\n"),
    "",
    "export const DOODLES: Readonly<Record<DoodleName, (props: DoodleProps) => ReactElement>> = {",
    ...sorted.map((name) => `  ${JSON.stringify(name)}: ${pascal(name)},`),
    "};",
    "",
  ].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeFileSync(OUT, generateDoodles());
  console.log(`build-doodles: wrote ${relative(ROOT, OUT)}`);
}
