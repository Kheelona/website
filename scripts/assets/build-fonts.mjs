#!/usr/bin/env node
// Writes the site's font files and their CSS from the design system's fonts (task 1.2, architecture §10).
//
//   node scripts/assets/build-fonts.mjs           writes every output below
//   node scripts/assets/build-fonts.mjs --check   exits 1 if any committed output differs from a fresh build
//
// Reads the four @font-face rules of design-system/project/tokens.css (family, file, weight, style) and the font
// files they name in design-system/project/fonts/ (read-only). For each face it writes a Latin plus rupee subset,
// and for Baloo 2 also a Devanagari subset, each behind its unicode-range, so a page downloads only the scripts
// it shows. The Devanagari subset holds only the Devanagari the site uses, read from mockup/pages/*.html and every
// non-test, non-story text file under src/ except dot-files (so copy added later in src/content is covered): the
// one-word Hindi chip costs a few KB instead of the 110 KB of the whole script, inside the 130 KB of fonts on first
// view (architecture §12). Any task that adds Devanagari text runs this script again;
// test/guards/generated-css.test.ts names each character the subset lacks, and the file it comes from.
//
// Outputs, all committed and re-derived by test/guards/generated-css.test.ts:
//   public/fonts/<file>-<subset>.woff2         served at /fonts/... (stable URLs, so the preloads match)
//   public/fonts/OFL.txt                       each family's copyright notice, then the SIL Open Font License 1.1
//   src/styles/generated/fonts.css             @font-face rules with the DS family names, weights and styles
//   src/styles/generated/fonts.generated.ts    the three files every hero uses, for the root layout's preloads
//
// Licence (SIL OFL 1.1, design-system/README.md:16): subsetting is a modification, and an OFL font whose
// copyright notice declares a Reserved Font Name may not be modified under that name. Each face's own notice
// (name table IDs 0 and 13) is read first; a face with a Reserved Font Name ships as a byte-identical copy instead.
// Every copy must carry the copyright notice and the licence (OFL condition 2), hence OFL.txt beside the files.

import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TextDecoder } from "node:util";
import { brotliDecompressSync } from "node:zlib";
import subsetFont from "subset-font";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const TOKENS_CSS = "design-system/project/tokens.css";
const DS_FONTS = "design-system/project/fonts";
const PUBLIC_FONTS = "public/fonts";
const OFL_OUT = "OFL.txt";
const FONTS_CSS_OUT = "src/styles/generated/fonts.css";
const PRELOADS_OUT = "src/styles/generated/fonts.generated.ts";

// Google Fonts' "latin" range plus the rupee sign (U+20B9), the subset every face ships.
const LATIN =
  "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+20B9, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD";
/**
 * A run of Devanagari text: a U+0900-097F character followed by more of them, or by the ZWNJ and ZWJ (U+200C-200D)
 * that steer conjuncts. A joiner outside such a run (an emoji sequence, say) is not Devanagari and stays out.
 * Joiners also sit in the Latin range; the Devanagari face is declared after the Latin one, so browsers take them
 * from it and the run shapes in one font.
 */
const DEVANAGARI_RUN = /[\u0900-\u097F][\u0900-\u097F\u200C\u200D]*/gu;
/** Source files that never reach a page: tests and stories. */
const NOT_SHIPPED = /\.(test|spec|stories)\.[^/]+$/;
/** Families that get a Devanagari subset: Baloo 2 is the DS's Devanagari voice (README.md:101). */
const DEVANAGARI_FAMILIES = new Set(["Baloo 2"]);
/**
 * The three preloads (architecture §10, QA N17): the body face, the display face, and the Kalam weight that
 * `kh-hand` sets (bundle.css .kh-hand, font-weight 700), because almost every approved h1 carries a hand accent.
 */
const PRELOADS = [
  { family: "Nunito", weight: "200 1000" },
  { family: "Baloo 2", weight: "400 800" },
  { family: "Kalam", weight: "700" },
];

// The SIL Open Font License 1.1 as google/fonts ships it beside each family, from the line after the copyright
// notice to the end, verbatim; taken with curl on 2026-10-12 from
//   https://raw.githubusercontent.com/google/fonts/90abd17b4f97671435798b6147b698aa9087612f/ofl/kalam/OFL.txt
// (the same bytes as ofl/baloo2/OFL.txt and ofl/nunito/OFL.txt on main). The one trailing space upstream, after
// "embedded,", is written \u0020 so an editor cannot strip it. generated-css.test.ts pins the text's SHA-256.
const OFL_1_1 = `This Font Software is licensed under the SIL Open Font License, Version 1.1.
This license is copied below, and is also available with a FAQ at:
http://scripts.sil.org/OFL


-----------------------------------------------------------
SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
-----------------------------------------------------------

PREAMBLE
The goals of the Open Font License (OFL) are to stimulate worldwide
development of collaborative font projects, to support the font creation
efforts of academic and linguistic communities, and to provide a free and
open framework in which fonts may be shared and improved in partnership
with others.

The OFL allows the licensed fonts to be used, studied, modified and
redistributed freely as long as they are not sold by themselves. The
fonts, including any derivative works, can be bundled, embedded,\u0020
redistributed and/or sold with any software provided that any reserved
names are not used by derivative works. The fonts and derivatives,
however, cannot be released under any other type of license. The
requirement for fonts to remain under this license does not apply
to any document created using the fonts or their derivatives.

DEFINITIONS
"Font Software" refers to the set of files released by the Copyright
Holder(s) under this license and clearly marked as such. This may
include source files, build scripts and documentation.

"Reserved Font Name" refers to any names specified as such after the
copyright statement(s).

"Original Version" refers to the collection of Font Software components as
distributed by the Copyright Holder(s).

"Modified Version" refers to any derivative made by adding to, deleting,
or substituting -- in part or in whole -- any of the components of the
Original Version, by changing formats or by porting the Font Software to a
new environment.

"Author" refers to any designer, engineer, programmer, technical
writer or other person who contributed to the Font Software.

PERMISSION & CONDITIONS
Permission is hereby granted, free of charge, to any person obtaining
a copy of the Font Software, to use, study, copy, merge, embed, modify,
redistribute, and sell modified and unmodified copies of the Font
Software, subject to the following conditions:

1) Neither the Font Software nor any of its individual components,
in Original or Modified Versions, may be sold by itself.

2) Original or Modified Versions of the Font Software may be bundled,
redistributed and/or sold with any software, provided that each copy
contains the above copyright notice and this license. These can be
included either as stand-alone text files, human-readable headers or
in the appropriate machine-readable metadata fields within text or
binary files as long as those fields can be easily viewed by the user.

3) No Modified Version of the Font Software may use the Reserved Font
Name(s) unless explicit written permission is granted by the corresponding
Copyright Holder. This restriction only applies to the primary font name as
presented to the users.

4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
Software shall not be used to promote, endorse or advertise any
Modified Version, except to acknowledge the contribution(s) of the
Copyright Holder(s) and the Author(s) or with their explicit written
permission.

5) The Font Software, modified or unmodified, in part or in whole,
must be distributed entirely under this license, and must not be
distributed under any other license. The requirement for fonts to
remain under this license does not apply to any document created
using the Font Software.

TERMINATION
This license becomes null and void if any of the above conditions are
not met.

DISCLAIMER
THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
DAMAGES, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
OTHER DEALINGS IN THE FONT SOFTWARE.
`;

const hex = (cp) => cp.toString(16).toUpperCase().padStart(4, "0");

/** A CSS unicode-range for a set of code points, consecutive ones merged: "U+0926, U+093F-0940". */
export function unicodeRange(codePoints) {
  const sorted = [...new Set(codePoints)].sort((a, b) => a - b);
  const parts = [];
  for (let i = 0; i < sorted.length; i++) {
    let j = i;
    while (j + 1 < sorted.length && sorted[j + 1] === sorted[j] + 1) j++;
    parts.push(i === j ? `U+${hex(sorted[i])}` : `U+${hex(sorted[i])}-${hex(sorted[j])}`);
    i = j;
  }
  return parts.join(", ");
}

/** A regular file's bytes; null for anything else, or for a file that is gone by the time it is read (ENOENT). */
function readSourceFile(path) {
  try {
    return statSync(path).isFile() ? readFileSync(path) : null;
  } catch (error) {
    if (error?.code === "ENOENT") return null;
    throw error;
  }
}

/**
 * The files whose Devanagari the subset covers, with their bytes: mockup/pages/*.html and every non-test, non-story
 * file in src/. Dot-files are skipped, and so is a file that vanishes between the listing and the read: other
 * processes write in src/ while this scans it (buildComposeCss writes `.compose.css.<pid>-<hex>.tmp` and renames it
 * over the manifest while the guards run). Any other error still throws. test/guards/generated-css.test.ts restates
 * this scan in siteDevanagari(); the two stay identical (task 1.2b).
 */
function devanagariSources(root) {
  const pages = existsSync(join(root, "mockup/pages"))
    ? readdirSync(join(root, "mockup/pages")).filter((f) => f.endsWith(".html")).map((f) => `mockup/pages/${f}`)
    : [];
  const src = readdirSync(join(root, "src"), { recursive: true, encoding: "utf8" })
    .map((f) => `src/${f}`)
    .filter((f) => !NOT_SHIPPED.test(f));
  return [...pages, ...src]
    .filter((f) => !basename(f).startsWith("."))
    .sort()
    .flatMap((file) => {
      const bytes = readSourceFile(join(root, file));
      return bytes ? [{ file, bytes }] : [];
    });
}

/** Every Devanagari code point the site's sources use, ascending, each with the first file that uses it. */
export function collectDevanagari(root = ROOT) {
  const utf8 = new TextDecoder("utf-8", { fatal: true });
  const used = new Map();
  for (const { file, bytes } of devanagariSources(root)) {
    if (bytes.includes(0)) continue; // binary: fonts, images
    let text;
    try {
      text = utf8.decode(bytes);
    } catch {
      continue; // not UTF-8 text
    }
    for (const run of text.match(DEVANAGARI_RUN) ?? []) {
      for (const ch of run) if (!used.has(ch.codePointAt(0))) used.set(ch.codePointAt(0), file);
    }
  }
  return new Map([...used].sort(([a], [b]) => a - b));
}

/** The faces of tokens.css, each with the subsets the site serves; Baloo 2 adds Devanagari for these code points. */
export function fontPlan(tokensCss, devanagari = []) {
  const faces = [
    ...tokensCss.matchAll(
      /^@font-face \{ font-family: "([^"]+)"; src: url\("fonts\/([^"]+)"\) format\("woff2"\); font-weight: ([^;]+); font-style: ([^;]+); font-display: ([^;]+); \}$/gm,
    ),
  ].map((m) => ({ family: m[1], source: m[2], weight: m[3], style: m[4] }));
  if (faces.length !== 4) throw new Error(`tokens.css: expected 4 @font-face rules, found ${faces.length}`);
  const devanagariRange = unicodeRange(devanagari);
  return faces.map((face) => {
    const stem = face.source.replace(/\.woff2$/, "").toLowerCase();
    const subsets = [{ name: "latin", unicodeRange: LATIN }];
    if (DEVANAGARI_FAMILIES.has(face.family) && devanagariRange) subsets.push({ name: "devanagari", unicodeRange: devanagariRange });
    return { ...face, subsets: subsets.map((s) => ({ ...s, file: `${stem}-${s.name}.woff2` })) };
  });
}

export function renderFontsCss(plan) {
  const out = [
    `/* GENERATED by scripts/assets/build-fonts.mjs, do not edit; source ${DS_FONTS}/ and the @font-face rules of ${TOKENS_CSS}.\n`,
    "   Same family names, weights and styles as tokens.css; Latin plus rupee subsets, and Baloo 2 Devanagari (only the\n",
    "   characters the site uses), by unicode-range. */\n",
  ];
  for (const face of plan) {
    for (const s of face.subsets) {
      out.push(
        `@font-face { font-family: "${face.family}"; src: url("/fonts/${s.file}") format("woff2"); font-weight: ${face.weight}; font-style: ${face.style}; font-display: swap; unicode-range: ${s.unicodeRange}; }\n`,
      );
    }
  }
  return out.join("");
}

export function renderPreloads(plan) {
  const rows = PRELOADS.map((p) => {
    const face = plan.find((f) => f.family === p.family && f.weight === p.weight);
    if (!face) throw new Error(`no DS face ${p.family} ${p.weight} to preload`);
    const latin = face.subsets.find((s) => s.name === "latin");
    return `  { href: "/fonts/${latin.file}", family: "${face.family}", weight: "${face.weight}", type: "font/woff2" },\n`;
  });
  return [
    `// GENERATED by scripts/assets/build-fonts.mjs, do not edit; source ${DS_FONTS}/.\n`,
    "// The three Latin font files every hero uses, preloaded by the root layout (architecture §10; QA N17).\n\n",
    'export type FontPreload = { href: string; family: string; weight: string; type: "font/woff2" };\n\n',
    "export const FONT_PRELOADS: readonly FontPreload[] = [\n",
    ...rows,
    "];\n",
  ].join("");
}

/** public/fonts/OFL.txt: each family with its files and its DS font's copyright notice, then the licence. */
export function renderOfl(plan, notices) {
  const out = ["The font files in this folder are made from the fonts below, each under the SIL Open Font License 1.1 that follows.", ""];
  for (const family of new Set(plan.map((f) => f.family))) {
    const files = plan.filter((f) => f.family === family).flatMap((f) => f.subsets.map((s) => s.file));
    const copyrights = new Set(notices.filter((n) => n.family === family).map((n) => n.copyright));
    out.push(`${family}: ${files.join(", ")}`, ...copyrights, "");
  }
  return `${out.join("\n")}\n${OFL_1_1}`;
}

/** True when an OFL copyright or licence notice declares a Reserved Font Name. */
export function hasReservedFontName(notice) {
  return /reserved\s+font\s+names?/i.test(notice);
}

/** Every code point of a CSS unicode-range list, as a string for the subsetter. */
function rangeText(range) {
  let text = "";
  for (const part of range.split(",").map((p) => p.trim().replace(/^U\+/i, ""))) {
    const [from, to = from] = part.split("-").map((h) => parseInt(h, 16));
    for (let cp = from; cp <= to; cp++) text += String.fromCodePoint(cp);
  }
  return text;
}

/** WOFF2's known-table index (W3C WOFF 2.0, "Known Table Tags"): a directory entry's flags name its tag by position. */
const WOFF2_TAGS = [
  "cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post", "cvt ", "fpgm", "glyf", "loca", "prep", "CFF ", "VORG", "EBDT",
  "EBLC", "gasp", "hdmx", "kern", "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "BASE", "GDEF", "GPOS", "GSUB", "EBSC", "JSTF", "MATH",
  "CBDT", "CBLC", "COLR", "CPAL", "SVG ", "sbix", "acnt", "avar", "bdat", "bloc", "bsln", "cvar", "fdsc", "feat", "fmtx", "fvar",
  "gvar", "hsty", "just", "lcar", "mort", "morx", "opbd", "prop", "trak", "Zapf", "Silf", "Glat", "Gloc", "Feat", "Sill",
];

/**
 * The tables of a WOFF2 font by tag, decompressed with Node's own Brotli: no wasm, so it also runs inside the jsdom
 * test environment. glyf, loca and hmtx come back in their WOFF2-transformed form; this reader serves cmap and name.
 */
function woff2Tables(woff2) {
  const font = Buffer.isBuffer(woff2) ? woff2 : Buffer.from(woff2);
  if (font.toString("latin1", 0, 4) !== "wOF2") throw new Error("not a WOFF2 font");
  if (font.toString("latin1", 4, 8) === "ttcf") throw new Error("WOFF2 font collections are not supported");
  const tableCount = font.readUInt16BE(12);
  const compressedLength = font.readUInt32BE(20);
  let pos = 48; // end of the WOFF2 header
  const uintBase128 = () => {
    let value = 0;
    for (let i = 0; i < 5; i++) {
      const byte = font[pos++];
      if (i === 0 && byte === 0x80) throw new Error("WOFF2: UIntBase128 with a leading zero");
      value = value * 128 + (byte & 0x7f);
      if ((byte & 0x80) === 0) return value;
    }
    throw new Error("WOFF2: UIntBase128 longer than 5 bytes");
  };
  const directory = [];
  for (let i = 0; i < tableCount; i++) {
    const flags = font[pos++];
    let tag = WOFF2_TAGS[flags & 0x3f];
    if ((flags & 0x3f) === 0x3f) {
      tag = font.toString("latin1", pos, pos + 4);
      pos += 4;
    }
    const version = flags >> 6;
    const length = uintBase128();
    // glyf and loca are transformed unless version 3; every other table only with a non-zero version.
    const transformed = tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
    directory.push({ tag, length: transformed ? uintBase128() : length });
  }
  const data = brotliDecompressSync(font.subarray(pos, pos + compressedLength));
  const tables = new Map();
  let offset = 0;
  for (const { tag, length } of directory) {
    tables.set(tag, data.subarray(offset, offset + length));
    offset += length;
  }
  if (offset !== data.length) throw new Error(`WOFF2: the directory spans ${offset} bytes of a ${data.length}-byte table stream`);
  return tables;
}

/** The code points a cmap table maps to a glyph, from its Unicode subtables (formats 4 and 12), ascending. */
function cmapCodePoints(cmap) {
  const mapped = new Set();
  const read = new Set();
  for (let i = 0; i < cmap.readUInt16BE(2); i++) {
    const record = 4 + i * 8;
    const [platform, encoding, at] = [cmap.readUInt16BE(record), cmap.readUInt16BE(record + 2), cmap.readUInt32BE(record + 4)];
    if (!(platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10))) || read.has(at)) continue;
    read.add(at);
    const format = cmap.readUInt16BE(at);
    if (format === 4) {
      const segments = cmap.readUInt16BE(at + 6) / 2;
      const ends = at + 14;
      const starts = ends + segments * 2 + 2;
      const deltas = starts + segments * 2;
      const rangeOffsets = deltas + segments * 2;
      for (let s = 0; s < segments; s++) {
        const [end, start] = [cmap.readUInt16BE(ends + s * 2), cmap.readUInt16BE(starts + s * 2)];
        const [delta, rangeOffset] = [cmap.readUInt16BE(deltas + s * 2), cmap.readUInt16BE(rangeOffsets + s * 2)];
        for (let cp = start; cp <= end && cp !== 0xffff; cp++) {
          let glyph = rangeOffset === 0 ? cp : cmap.readUInt16BE(rangeOffsets + s * 2 + rangeOffset + (cp - start) * 2);
          if (rangeOffset === 0 || glyph !== 0) glyph = (glyph + delta) & 0xffff;
          if (glyph !== 0) mapped.add(cp);
        }
      }
    } else if (format === 12) {
      const groups = cmap.readUInt32BE(at + 12);
      for (let g = 0; g < groups; g++) {
        const group = at + 16 + g * 12;
        const [start, end, glyph] = [cmap.readUInt32BE(group), cmap.readUInt32BE(group + 4), cmap.readUInt32BE(group + 8)];
        for (let cp = start; cp <= end; cp++) if (glyph + (cp - start) !== 0) mapped.add(cp);
      }
    }
  }
  return [...mapped].sort((a, b) => a - b);
}

/** Every code point a WOFF2 font maps to a glyph, ascending. */
export function fontCodePoints(woff2) {
  const cmap = woff2Tables(woff2).get("cmap");
  return cmap ? cmapCodePoints(cmap) : [];
}

/** Name table records (Windows Unicode, Unicode or Mac Roman), by name ID. */
function nameRecords(name) {
  const count = name.readUInt16BE(2);
  const strings = name.readUInt16BE(4);
  const out = {};
  for (let i = 0; i < count; i++) {
    const record = 6 + i * 12;
    const [platform, , , id, length, offset] = [0, 2, 4, 6, 8, 10].map((o) => name.readUInt16BE(record + o));
    const bytes = name.subarray(strings + offset, strings + offset + length);
    let text = "";
    if (platform === 3 || platform === 0) for (let j = 0; j + 1 < bytes.length; j += 2) text += String.fromCharCode((bytes[j] << 8) | bytes[j + 1]);
    else if (platform === 1) text = bytes.toString("latin1");
    if (text && !out[id]) out[id] = text;
  }
  return out;
}

/** The face's own copyright (name ID 0) and licence description (name ID 13), read from its WOFF2 bytes. */
export function licenceNotice(woff2) {
  const name = woff2Tables(woff2).get("name");
  const names = name ? nameRecords(name) : {};
  return { copyright: names[0] ?? "", licence: names[13] ?? "" };
}

export async function buildFonts({ root = ROOT, write = true, log = () => {} } = {}) {
  const tokensCss = readFileSync(join(root, TOKENS_CSS), "utf8");
  const devanagari = collectDevanagari(root);
  const plan = fontPlan(tokensCss, devanagari.keys());
  const files = {};
  const notices = [];
  for (const face of plan) {
    const source = readFileSync(join(root, DS_FONTS, face.source));
    const notice = licenceNotice(source);
    if (!notice.copyright) throw new Error(`${DS_FONTS}/${face.source}: no copyright notice (name ID 0), which every copy must carry (OFL condition 2)`);
    const reserved = hasReservedFontName(`${notice.copyright}\n${notice.licence}`);
    notices.push({ family: face.family, source: face.source, ...notice, reserved });
    for (const s of face.subsets) {
      if (reserved) {
        files[s.file] = Buffer.from(source); // byte-identical copy: a Reserved Font Name forbids a modified version under that name
        log(`${face.family} ${face.weight}: Reserved Font Name in its notice; ${s.file} is a byte-identical copy`);
        continue;
      }
      const bytes = Buffer.from(await subsetFont(source, rangeText(s.unicodeRange), { targetFormat: "woff2" }));
      if (s.name === "devanagari") {
        // unicode-range must list exactly what the file maps, so a character it cannot draw falls back without a fetch.
        const kept = fontCodePoints(bytes);
        if (unicodeRange(kept) !== s.unicodeRange) {
          const lacking = [...devanagari].filter(([cp]) => !kept.includes(cp)).map(([cp, file]) => `U+${hex(cp)} (${file})`);
          throw new Error(`${s.file} maps ${unicodeRange(kept) || "nothing"}, not ${s.unicodeRange}; ${face.family} has no glyph for ${lacking.join(", ")}`);
        }
      }
      files[s.file] = bytes;
    }
  }
  files[OFL_OUT] = Buffer.from(renderOfl(plan, notices));
  const generated = { [FONTS_CSS_OUT]: renderFontsCss(plan), [PRELOADS_OUT]: renderPreloads(plan) };
  if (write) {
    mkdirSync(join(root, PUBLIC_FONTS), { recursive: true });
    for (const [file, bytes] of Object.entries(files)) writeFileSync(join(root, PUBLIC_FONTS, file), bytes);
    for (const [path, text] of Object.entries(generated)) {
      mkdirSync(dirname(join(root, path)), { recursive: true });
      writeFileSync(join(root, path), text);
    }
  }
  return { plan, files, generated, notices, devanagari };
}

/** Paths (public/fonts/... and src/styles/generated/...) whose committed bytes differ from a fresh build. */
export async function fontDrift({ root = ROOT } = {}) {
  const { files, generated } = await buildFonts({ root, write: false });
  const drift = [];
  const expected = new Set(Object.keys(files));
  for (const [file, bytes] of Object.entries(files)) {
    let current = null;
    try { current = readFileSync(join(root, PUBLIC_FONTS, file)); } catch { /* missing */ }
    if (!current || Buffer.compare(current, bytes) !== 0) drift.push(`${PUBLIC_FONTS}/${file}`);
  }
  for (const file of readdirSync(join(root, PUBLIC_FONTS))) if (!file.startsWith(".") && !expected.has(file)) drift.push(`${PUBLIC_FONTS}/${file} (not generated)`);
  for (const [path, text] of Object.entries(generated)) {
    let current = null;
    try { current = readFileSync(join(root, path), "utf8"); } catch { /* missing */ }
    if (current !== text) drift.push(path);
  }
  return drift;
}

if (process.argv[1] === fileURLToPath(import.meta.url) && process.argv.includes("--check")) {
  // node scripts/assets/build-fonts.mjs --check   exits 1 if any committed font output differs from a fresh build
  const drift = await fontDrift();
  if (drift.length > 0) {
    console.error(`Font outputs are stale; run node scripts/assets/build-fonts.mjs:\n  ${drift.join("\n  ")}`);
    process.exit(1);
  }
  console.log("Font outputs match a fresh build.");
} else if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { plan, files, notices, devanagari } = await buildFonts({ log: (m) => console.warn(m) });
  for (const n of notices) {
    console.log(`${n.family} (${n.source}): Reserved Font Name ${n.reserved ? "DECLARED" : "none"}; copyright notice: ${JSON.stringify(n.copyright)}`);
  }
  const text = String.fromCodePoint(...devanagari.keys());
  console.log(`Devanagari kept: ${JSON.stringify(text)} = ${unicodeRange(devanagari.keys()) || "none"}, from ${[...new Set(devanagari.values())].join(", ") || "no file"}`);
  for (const [file, bytes] of Object.entries(files)) console.log(`public/fonts/${file}  ${bytes.length} bytes`);
  const preload = PRELOADS.map((p) => plan.find((f) => f.family === p.family && f.weight === p.weight).subsets[0].file);
  const total = preload.reduce((sum, f) => sum + files[f].length, 0);
  console.log(`preloads: ${preload.join(", ")} = ${total} bytes (budget 130,000)`);
  const deva = plan.flatMap((f) => f.subsets.filter((s) => s.name === "devanagari").map((s) => files[s.file].length));
  if (deva.length > 0) console.log(`a page that shows Devanagari: preloads + Devanagari = ${total + deva[0]} bytes (budget 130,000)`);
}
