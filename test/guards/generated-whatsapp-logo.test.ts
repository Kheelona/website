// Guard for the WhatsApp logo (task Q2.4, as Q1.6; D064 item 3: "the WhatsApp logo from Wikimedia Commons'
// WhatsApp.svg, adapted as needed").
//
//   1. src/assets/whatsapp-logo.svg holds only path data: a viewBox and three named paths (the white speech bubble,
//      the green ground inside it, the white handset), each `d` exactly the original file's (no script, no style, no
//      link, no colour, nothing else).
//   2. src/assets/whatsapp-logo.generated.ts (scripts/assets/build-whatsapp-logo.mjs) is never stale; it carries the
//      full-colour logo as the asset draws it (the WhatsApp bubble) and the one-colour glyph on the DS icon grid
//      (every WhatsApp link and button, through Icon's `whatsapp-logo`), in the square the DS glyph filled.
//
// Expectations come from the original file (its digests, below) and the DS icon, never from the script.
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ICON_VIEWBOX } from "@/assets/icons.generated";
import { WHATSAPP_GLYPH, WHATSAPP_LOGO_GROUND, WHATSAPP_LOGO_HANDSET, WHATSAPP_LOGO_RIM, WHATSAPP_LOGO_VIEWBOX } from "@/assets/whatsapp-logo.generated";
import { generateWhatsAppLogo } from "../../scripts/assets/build-whatsapp-logo.mjs";

const REPO = join(__dirname, "..", "..");
const ASSET = "src/assets/whatsapp-logo.svg";
const OUT = "src/assets/whatsapp-logo.generated.ts";
const read = (p: string) => readFileSync(join(REPO, p), "utf8");
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

/* SHA-256 of the `d` attribute of the original's 2nd, 4th and 5th paths (the white bubble, the green ground filled by
   its gradient #b, the handset), upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg, SHA-1 e110e162c96cb014763e841bad3615da27348073,
   fetched 2026-10-15. Left out: the 1st path (a grey copy of the bubble blurred into a shadow by an SVG filter; the
   bubble takes the DS shadow instead) and the 3rd (a second ground whose fill names a gradient the file does not
   define, so it never draws). */
const ORIGINAL_D_SHA256 = {
  rim: "ed011c1e26d66751cb57f15e32ca2cecf220aeaa28c7e0b94eebb374bccffbc6",
  ground: "3c0fd66e631961520a588d3160363ebeb980742c0e6b16f2a53244c6c26ffa94",
  handset: "c65a89c40a4c0af26aad319e369af9a2397723a309e7caefffa545fa4430c7c9",
} as const;

/** The bounding box of the white bubble in the original's coordinates (Chromium getBBox, 2026-10-15). */
const RIM_BOX = "12.966 12.802 147.773 148.436";

/** The square the DS whatsapp-logo glyph fills on ICON_VIEWBOX (Phosphor Bold: its circle of radius 108 about 128). */
const DS_SQUARE = { min: 20, max: 236 };

/** An absolute path the generator writes (M, L, C, A, Z only) as its subpaths' on-curve points and control points. */
function subpaths(d: string): { points: [number, number][]; onCurve: [number, number][] }[] {
  const out: { points: [number, number][]; onCurve: [number, number][] }[] = [];
  for (const [, cmd, body] of d.matchAll(/([MLCAZ])([^MLCAZ]*)/g)) {
    const n = body.split(",").filter(Boolean).map(Number);
    const arity = { M: 2, L: 2, C: 6, A: 7, Z: 0 }[cmd]!;
    expect(n.length, `${cmd}${body}`).toBe(arity);
    if (cmd === "M") out.push({ points: [], onCurve: [] });
    const sub = out[out.length - 1];
    const pairs: [number, number][] = cmd === "A" ? [[n[5], n[6]]] : Array.from({ length: n.length / 2 }, (_, i) => [n[2 * i], n[2 * i + 1]]);
    sub.points.push(...pairs);
    if (pairs.length) sub.onCurve.push(pairs[pairs.length - 1]);
  }
  return out;
}

/** Twice the signed area of a polygon (screen coordinates: positive is clockwise). */
const area2 = (pts: [number, number][]) => pts.reduce((sum, [x, y], i) => {
  const [nx, ny] = pts[(i + 1) % pts.length];
  return sum + x * ny - nx * y;
}, 0);

describe("whatsapp-logo.svg: the Wikimedia logo, path data only", () => {
  const svg = read(ASSET);

  it("is a viewBox and three named paths, nothing else", () => {
    const rest = svg
      .replace(/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="[^"]+">/, "")
      .replace(/<path id="(?:rim|ground|handset)" d="[^"]+"\/>/g, "")
      .replace(/<\/svg>\n?$/, "");
    expect(rest.trim()).toBe("");
    expect([...svg.matchAll(/<path id="([a-z]+)"/g)].map((m) => m[1])).toEqual(["rim", "ground", "handset"]);
    for (const banned of [/<script/i, /href/i, /url\(/i, /style/i, /fill/i, /\son\w+=/i, /<!--/]) expect(svg).not.toMatch(banned);
  });

  it("carries each kept path of the original exactly", () => {
    for (const [id, digest] of Object.entries(ORIGINAL_D_SHA256)) {
      const d = new RegExp(`<path id="${id}" d="([^"]+)"/>`).exec(svg)?.[1];
      expect(d && sha256(d), id).toBe(digest);
    }
  });

  it("is cropped to the bubble: its viewBox is the white bubble's bounding box (the original's shadow margin dropped)", () => {
    expect(/viewBox="([^"]+)"/.exec(svg)?.[1]).toBe(RIM_BOX);
  });
});

describe("whatsapp-logo.generated.ts", () => {
  const svg = read(ASSET);
  const d = (id: string) => new RegExp(`<path id="${id}" d="([^"]+)"/>`).exec(svg)![1];

  it("is up to date: regenerating in memory gives the committed file", () => {
    expect(generateWhatsAppLogo()).toBe(read(OUT));
  });

  it("is byte-stable: two runs give the same text", () => {
    expect(generateWhatsAppLogo()).toBe(generateWhatsAppLogo());
  });

  it("carries the generated-file header naming its script and source", () => {
    expect(read(OUT).split("\n")[0]).toBe(
      "// GENERATED by scripts/assets/build-whatsapp-logo.mjs, do not edit; source src/assets/whatsapp-logo.svg",
    );
  });

  it("gives the bubble the full-colour logo: the three paths as the asset draws them, on its viewBox", () => {
    expect(WHATSAPP_LOGO_VIEWBOX).toBe(RIM_BOX);
    expect(WHATSAPP_LOGO_RIM).toBe(d("rim"));
    expect(WHATSAPP_LOGO_GROUND).toBe(d("ground"));
    expect(WHATSAPP_LOGO_HANDSET).toBe(d("handset"));
  });

  it("gives the links the one-colour glyph on the DS icon grid, filling the square the DS glyph filled", () => {
    expect(ICON_VIEWBOX).toBe("0 0 256 256");
    const all = subpaths(WHATSAPP_GLYPH).flatMap((s) => s.points);
    const xs = all.map(([x]) => x);
    const ys = all.map(([, y]) => y);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(DS_SQUARE.min - 0.01);
    expect(Math.max(...xs)).toBeLessThanOrEqual(DS_SQUARE.max + 0.01);
    // The bubble is a little taller than wide: its height spans the square, its width sits centred in it.
    expect(Math.min(...ys)).toBeCloseTo(DS_SQUARE.min, 1);
    expect(Math.max(...ys)).toBeCloseTo(DS_SQUARE.max, 1);
    expect((Math.min(...xs) + Math.max(...xs)) / 2).toBeCloseTo((DS_SQUARE.min + DS_SQUARE.max) / 2, 0);
  });

  it("draws a ring and the handset: the bubble and the ground wind opposite ways, so the nonzero rule cuts the ground out", () => {
    const [rim, ground, handset] = subpaths(WHATSAPP_GLYPH);
    expect(subpaths(WHATSAPP_GLYPH)).toHaveLength(3);
    expect(Math.sign(area2(rim.onCurve))).toBe(-Math.sign(area2(ground.onCurve)));
    // The handset lies inside the ground's hole.
    const gx = ground.points.map(([x]) => x);
    const gy = ground.points.map(([, y]) => y);
    for (const [x, y] of handset.points) {
      expect(x).toBeGreaterThan(Math.min(...gx));
      expect(x).toBeLessThan(Math.max(...gx));
      expect(y).toBeGreaterThan(Math.min(...gy));
      expect(y).toBeLessThan(Math.max(...gy));
    }
  });
});

describe("build-whatsapp-logo.mjs refuses anything but path data", () => {
  let dir: string;
  let file: string;
  const asset = read(ASSET);
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "ks-whatsapp-"));
    file = join(dir, "whatsapp-logo.svg");
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));
  const generate = (text: string) => {
    writeFileSync(file, text);
    return generateWhatsAppLogo({ source: file });
  };

  it("accepts the asset as it is (the same module below the header, which names the file it read)", () => {
    const body = (text: string) => text.split("\n").slice(1).join("\n");
    expect(body(generate(asset))).toBe(body(generateWhatsAppLogo()));
  });

  it.each([
    ["a script", asset.replace("</svg>", "<script>alert(1)</script></svg>")],
    ["a link", asset.replace('<path id="rim"', '<path href="https://example.com/x.svg" id="rim"')],
    ["a style", asset.replace('<path id="rim"', '<path style="fill:red" id="rim"')],
    ["a fill", asset.replace('<path id="ground"', '<path fill="#25D366" id="ground"')],
    ["a comment", asset.replace("</svg>", "<!-- x --></svg>")],
    ["a fourth path", asset.replace("</svg>", '<path id="extra" d="M0,0Z"/></svg>')],
    ["a missing part", asset.replace(/<path id="handset" d="[^"]+"\/>/, "")],
    ["a root attribute besides xmlns and viewBox", asset.replace("<svg ", '<svg onload="x()" ')],
  ])("fails on %s", (_name, text) => {
    expect(() => generate(text)).toThrow(/build-whatsapp-logo: .*path data only/);
  });

  it("fails on a path command it does not carry (Q or T: the logo has none)", () => {
    expect(() => generate(asset.replace(/(<path id="handset" d=")[^"]+/, "$1M60,60Q70,70 80,60Z"))).toThrow(/build-whatsapp-logo: handset: .*Q/);
  });

  it("fails when the ground winds the same way as the bubble (the glyph would fill solid, with no ring)", () => {
    const square = asset
      .replace(/viewBox="[^"]+"/, 'viewBox="0 0 10 10"')
      .replace(/(<path id="rim" d=")[^"]+/, "$1M0,0H10V10H0Z")
      .replace(/(<path id="handset" d=")[^"]+/, "$1M4,4H6V6H4Z");
    expect(() => generate(square.replace(/(<path id="ground" d=")[^"]+/, "$1M2,2H8V8H2Z"))).toThrow(/build-whatsapp-logo: .*wind/);
    expect(() => generate(square.replace(/(<path id="ground" d=")[^"]+/, "$1M2,2V8H8V2Z"))).not.toThrow();
  });
});
