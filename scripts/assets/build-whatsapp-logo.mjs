#!/usr/bin/env node
// Writes src/assets/whatsapp-logo.generated.ts: the WhatsApp logo from Wikimedia Commons (task Q2.4, as Q1.6;
// D064 item 3, "the WhatsApp logo from Wikimedia Commons' WhatsApp.svg, adapted as needed").
//
//   node scripts/assets/build-whatsapp-logo.mjs
//
// Source: src/assets/whatsapp-logo.svg, the path data of File:WhatsApp.svg (public domain; WhatsApp's trademark;
// wiki/engineering/assets.md records the original's address, SHA-1 and what was left out). It holds a viewBox (the white
// bubble's own bounding box) and three named paths, and nothing else: `rim` (the white speech bubble), `ground` (the
// green inside it) and `handset` (white). The script refuses anything more (a script, a style, a link, a colour, a
// comment, another element or attribute), so only path data ever reaches a page. Two forms (tasks.md Q1.6):
//   - the full-colour logo, for the WhatsApp bubble (WhatsAppFloat): the three paths verbatim on the asset's viewBox;
//     their colours are the stylesheet's (white and WhatsApp green, whatsapp-float.css), never the file's;
//   - the one-colour glyph, for every WhatsApp link and button (Icon's `whatsapp-logo`): the bubble with the ground cut
//     out of it, then the handset, written absolute and moved onto the DS icon grid (ICON_VIEWBOX, 0 0 256 256) into the
//     square the DS whatsapp-logo glyph fills (20 to 236), so it sits in a line of text as the DS icon did. The bubble
//     and the ground wind opposite ways, so the default nonzero fill leaves a ring; the script checks it.
// test/guards/generated-whatsapp-logo.test.ts regenerates in memory and fails on drift.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SOURCE = join(ROOT, "src", "assets", "whatsapp-logo.svg");
const OUT = join(ROOT, "src", "assets", "whatsapp-logo.generated.ts");

/** The parts, in drawing order. */
const PARTS = ["rim", "ground", "handset"];
/** The square the DS whatsapp-logo glyph fills on the 256 grid (Phosphor Bold: its circle of radius 108 about 128). */
const GLYPH_SQUARE = { min: 20, size: 216 };

const ROOT_TAG = /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="([^"]+)">/;
const PATH_TAG = /<path id="([a-z]+)" d="([^"]+)"\/>/g;

/** The viewBox and the three parts' d; throws on anything that is not path data. */
function readAsset(svg, name) {
  const fail = (why) => {
    throw new Error(`build-whatsapp-logo: ${name}: ${why}; the asset holds path data only (a viewBox and three named paths)`);
  };
  const root = ROOT_TAG.exec(svg);
  if (!root) fail("the root is not <svg xmlns viewBox> alone");
  const viewBox = root[1];
  if (!/^-?[\d.]+ -?[\d.]+ [\d.]+ [\d.]+$/.test(viewBox)) fail(`viewBox "${viewBox}" is not four numbers`);
  const paths = [...svg.matchAll(PATH_TAG)].map(([, id, d]) => [id, d]);
  const rest = svg.slice(root[0].length).replace(PATH_TAG, "").replace(/<\/svg>\s*$/, "");
  if (rest.trim() !== "") fail(`it holds more than paths: "${rest.trim().slice(0, 40)}"`);
  const ids = paths.map(([id]) => id);
  if (ids.join() !== PARTS.join()) fail(`its paths are ${ids.join(", ") || "none"}, not ${PARTS.join(", ")}`);
  return { viewBox, d: Object.fromEntries(paths) };
}

const NUMBER = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/y;
const ARITY = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, A: 7, Z: 0 };

/** A path's commands, as written: [{ cmd, args }]. Throws on a command the logo does not use (Q, T) or bad data. */
function parse(d, part) {
  const out = [];
  let i = 0;
  let cmd = null;
  const fail = (why) => {
    throw new Error(`build-whatsapp-logo: ${part}: ${why} at ${i}`);
  };
  const skip = () => {
    while (i < d.length && /[\s,]/.test(d[i])) i++;
  };
  const num = () => {
    skip();
    NUMBER.lastIndex = i;
    const m = NUMBER.exec(d);
    if (!m) fail("a number expected");
    i = NUMBER.lastIndex;
    return Number(m[0]);
  };
  const flag = () => {
    skip();
    if (d[i] !== "0" && d[i] !== "1") fail("an arc flag expected");
    return Number(d[i++]);
  };
  for (skip(); i < d.length; skip()) {
    if (/[a-zA-Z]/.test(d[i])) {
      cmd = d[i++];
      if (!Object.hasOwn(ARITY, cmd.toUpperCase())) fail(`command ${cmd} is not carried (the logo uses M L H V C S A Z)`);
      if (cmd.toUpperCase() === "Z") {
        out.push({ cmd, args: [] });
        continue;
      }
    } else if (!cmd || cmd.toUpperCase() === "Z") fail("a number without a command");
    const upper = cmd.toUpperCase();
    const args = upper === "A" ? [num(), num(), num(), flag(), flag(), num(), num()] : Array.from({ length: ARITY[upper] }, num);
    out.push({ cmd, args });
    // Numbers after a moveto are linetos (SVG 2, 9.3.3).
    if (cmd === "M") cmd = "L";
    else if (cmd === "m") cmd = "l";
  }
  return out;
}

/** The commands made absolute, with H and V as L and S as C (its first control point reflected), so the path keeps
 *  only M, L, C, A and Z. A path's opening relative moveto starts from 0,0, so it is absolute already. */
function absolute(commands) {
  let [x, y, sx, sy] = [0, 0, 0, 0];
  let lastControl = null;
  return commands.map(({ cmd, args }) => {
    const rel = cmd !== cmd.toUpperCase();
    const [ox, oy] = rel ? [x, y] : [0, 0];
    const at = (k) => [args[k] + ox, args[k + 1] + oy];
    let out;
    switch (cmd.toUpperCase()) {
      case "M":
        out = { cmd: "M", args: at(0) };
        [sx, sy] = out.args;
        break;
      case "L":
        out = { cmd: "L", args: at(0) };
        break;
      case "H":
        out = { cmd: "L", args: [args[0] + (rel ? x : 0), y] };
        break;
      case "V":
        out = { cmd: "L", args: [x, args[0] + (rel ? y : 0)] };
        break;
      case "C":
        out = { cmd: "C", args: [...at(0), ...at(2), ...at(4)] };
        break;
      case "S": {
        const first = lastControl ? [2 * x - lastControl[0], 2 * y - lastControl[1]] : [x, y];
        out = { cmd: "C", args: [...first, ...at(0), ...at(2)] };
        break;
      }
      case "A":
        out = { cmd: "A", args: [...args.slice(0, 5), ...at(5)] };
        break;
      default:
        out = { cmd: "Z", args: [] };
        [x, y] = [sx, sy];
    }
    lastControl = out.cmd === "C" ? out.args.slice(2, 4) : null;
    if (out.cmd !== "Z") [x, y] = out.args.slice(-2);
    return out;
  });
}

/** Two decimals, no trailing zeros, no negative zero (0.005 of a unit on the 256 grid draws nothing). */
const fmt = (n) => String(Math.round(n * 100) / 100 + 0);

/** The absolute commands scaled by `s` and moved by (tx, ty), written compactly. */
function write(commands, s, tx, ty) {
  return commands
    .map(({ cmd, args }) => {
      let moved;
      if (cmd === "A") moved = [args[0] * s, args[1] * s, args[2], args[3], args[4], args[5] * s + tx, args[6] * s + ty];
      else moved = args.map((v, k) => (k % 2 === 0 ? v * s + tx : v * s + ty));
      return `${cmd}${moved.map(fmt).join(",")}`;
    })
    .join("");
}

/** Twice the signed area of the on-curve points (screen coordinates: positive is clockwise). */
function winding(commands) {
  const pts = commands.filter(({ cmd }) => cmd !== "Z").map(({ args }) => args.slice(-2));
  return pts.reduce((sum, [x, y], k) => {
    const [nx, ny] = pts[(k + 1) % pts.length];
    return sum + x * ny - nx * y;
  }, 0);
}

/** The content of whatsapp-logo.generated.ts for the asset at `source`. */
export function generateWhatsAppLogo({ source = SOURCE } = {}) {
  const name = relative(ROOT, source).split("\\").join("/");
  const { viewBox, d } = readAsset(readFileSync(source, "utf8"), name);
  const abs = Object.fromEntries(PARTS.map((part) => [part, absolute(parse(d[part], part))]));
  if (Math.sign(winding(abs.rim)) === Math.sign(winding(abs.ground))) {
    throw new Error(`build-whatsapp-logo: ${name}: the bubble and the ground wind the same way, so the glyph would fill solid with no ring`);
  }
  const [vx, vy, vw, vh] = viewBox.split(" ").map(Number);
  const s = GLYPH_SQUARE.size / Math.max(vw, vh);
  const tx = GLYPH_SQUARE.min + (GLYPH_SQUARE.size - vw * s) / 2 - vx * s;
  const ty = GLYPH_SQUARE.min + (GLYPH_SQUARE.size - vh * s) / 2 - vy * s;
  const glyph = PARTS.map((part) => write(abs[part], s, tx, ty)).join("");
  return [
    `// GENERATED by scripts/assets/build-whatsapp-logo.mjs, do not edit; source ${name}`,
    "// (Wikimedia Commons File:WhatsApp.svg, public domain, WhatsApp's trademark; path data only). Regenerate: node scripts/assets/build-whatsapp-logo.mjs",
    'import type { IconPath } from "./icons.generated";',
    "",
    "/** The full-colour logo's viewBox: the white bubble's bounding box, so the logo fills the round WhatsApp bubble. */",
    `export const WHATSAPP_LOGO_VIEWBOX = ${JSON.stringify(viewBox)};`,
    "/** The white speech bubble (the logo's rim, under the ground). */",
    `export const WHATSAPP_LOGO_RIM = ${JSON.stringify(d.rim)};`,
    "/** The green ground inside the bubble. */",
    `export const WHATSAPP_LOGO_GROUND = ${JSON.stringify(d.ground)};`,
    "/** The white handset. */",
    `export const WHATSAPP_LOGO_HANDSET = ${JSON.stringify(d.handset)};`,
    "",
    "/** The one-colour logo on the DS icon grid (ICON_VIEWBOX), for Glyph and Icon: the bubble's ring and the handset, in",
    " *  currentColor, in the square the DS whatsapp-logo glyph fills. */",
    `export const WHATSAPP_GLYPH = ${JSON.stringify(glyph)} as IconPath;`,
    "",
  ].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  writeFileSync(OUT, generateWhatsAppLogo());
  console.log(`build-whatsapp-logo: wrote ${relative(ROOT, OUT)}`);
}
