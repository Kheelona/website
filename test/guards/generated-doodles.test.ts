// Guard for src/assets/doodles.generated.tsx (task 1.5; D049 pick 3 "doodles draw themselves";
// ADR-010). Each DS doodle the approved pages use becomes one inline SVG component that the
// motion layer can draw (architecture §11.3: `.ks-doodle[data-draw] path:not(.ks-doodle__fill)`, pathLength 1).
//
// The expected markup is derived here from the DS file with the browser's own SVG parser and the
// rules of the task (tasks.md 1.5, acceptance 2), never from the generator's code:
//   root <svg class="ks-doodle" aria-hidden="true" focusable="false"> with the DS viewBox only;
//   <title>, role, aria-label and the per-file <defs> filter gone; filter="url(#chalk)" becomes
//   url(#ks-chalk); pathLength="1" on every stroked path; filled shapes carry ks-doodle__fill;
//   every other element and attribute (paths, colours, widths) verbatim.
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as generated from "@/assets/doodles.generated";
import { DOODLE_FILES, generateDoodles } from "../../scripts/assets/build-doodles.mjs";

const REPO = join(__dirname, "..", "..");
const DOODLES_DIR = join(REPO, "design-system", "project", "assets", "Doodles");
const { DOODLES, DOODLE_NAMES, DoodleChalkFilter } = generated as unknown as {
  DOODLES: Record<string, ComponentType<Record<string, unknown>>>;
  DOODLE_NAMES: readonly string[];
  DoodleChalkFilter: ComponentType;
};

type Node = { tag: string; attrs: Record<string, string> };

function parseSvg(markup: string): Element {
  const doc = new DOMParser().parseFromString(markup, "image/svg+xml");
  const err = doc.querySelector("parsererror");
  if (err) throw new Error(err.textContent ?? "parse error");
  return doc.documentElement;
}

function attrsOf(el: Element): Record<string, string> {
  return Object.fromEntries([...el.attributes].map((a) => [a.name, a.value]));
}

/** Elements in document order below `root`, as tag and attributes. */
function flatten(root: Element): Node[] {
  return [...root.querySelectorAll("*")].map((el) => ({ tag: el.tagName, attrs: attrsOf(el) }));
}

const isSet = (v: string | undefined) => v !== undefined && v !== "none";

/** What the generated component must render for one DS doodle, by the task's rules. */
function expectedFromDs(name: string): { root: Record<string, string>; body: Node[] } {
  const ds = parseSvg(readFileSync(join(DOODLES_DIR, `${name}.svg`), "utf8"));
  for (const drop of ds.querySelectorAll("title, defs")) drop.remove();
  const body = flatten(ds).map(({ tag, attrs }) => {
    const out = { ...attrs };
    if (out.filter) {
      expect(out.filter).toBe("url(#chalk)");
      out.filter = "url(#ks-chalk)";
    }
    if (isSet(attrs.stroke)) out.pathLength = "1";
    if (isSet(attrs.fill)) out.class = "ks-doodle__fill";
    return { tag, attrs: out };
  });
  const root = { class: "ks-doodle", viewBox: ds.getAttribute("viewBox")!, "aria-hidden": "true", focusable: "false" };
  return { root, body };
}

function render(name: string, props: Record<string, unknown> = {}): Element {
  const Doodle = DOODLES[name];
  // React's markup has no xmlns; the namespace is added so the SVG parser accepts it.
  const html = renderToStaticMarkup(createElement(Doodle, props)).replace("<svg ", '<svg xmlns="http://www.w3.org/2000/svg" ');
  return parseSvg(html);
}

const mockupDoodles = (() => {
  const dir = join(REPO, "mockup", "pages");
  const used = new Set<string>();
  for (const f of readdirSync(dir)) {
    for (const m of readFileSync(join(dir, f), "utf8").matchAll(/assets\/Doodles\/([a-z-]+)\.svg/g)) used.add(m[1]);
  }
  return [...used].sort();
})();

describe("doodles.generated.tsx: the DS doodles the approved pages use", () => {
  it("covers every doodle the approved mockup pages place (11), each a DS file", () => {
    expect(mockupDoodles).toHaveLength(11);
    expect([...DOODLE_NAMES].sort()).toEqual(expect.arrayContaining(mockupDoodles));
    const ds = readdirSync(DOODLES_DIR);
    for (const name of DOODLE_NAMES) expect(ds, name).toContain(`${name}.svg`);
    expect(Object.keys(DOODLES).sort()).toEqual([...DOODLE_NAMES].sort());
  });

  it.each(mockupDoodles)("%s renders the DS drawing, decorative and drawable", (name) => {
    const { root, body } = expectedFromDs(name);
    const svg = render(name);
    const rootAttrs = attrsOf(svg);
    delete rootAttrs.xmlns;
    expect(rootAttrs).toEqual(root);
    expect(flatten(svg)).toEqual(body);
  });

  it("puts pathLength on every stroked path and nothing else, so the draw covers each line once", () => {
    for (const name of mockupDoodles) {
      const svg = render(name);
      const stroked = [...svg.querySelectorAll("[stroke]")].filter((el) => el.getAttribute("stroke") !== "none");
      expect(stroked.length, name).toBeGreaterThan(0);
      for (const el of stroked) {
        expect(el.tagName, name).toBe("path");
        expect(el.getAttribute("pathLength"), name).toBe("1");
      }
      expect(svg.querySelectorAll("[pathLength]").length, name).toBe(stroked.length);
    }
  });

  it("passes layout and motion props to the root and keeps it hidden from assistive tech", () => {
    const svg = render("chalk-planet", {
      className: "kh-imagine__doodle",
      "data-draw": "",
      "data-draw-order": "2",
      style: { left: "4%", top: "30%", width: "20%" },
      "aria-hidden": false,
      role: "img",
    });
    expect(svg.getAttribute("class")).toBe("ks-doodle kh-imagine__doodle");
    expect(svg.getAttribute("data-draw")).toBe("");
    expect(svg.getAttribute("data-draw-order")).toBe("2");
    expect(svg.getAttribute("style")).toContain("left:4%");
    expect(svg.getAttribute("aria-hidden")).toBe("true");
    expect(svg.getAttribute("focusable")).toBe("false");
    expect(svg.hasAttribute("role")).toBe(false);
  });

  it("DoodleChalkFilter renders the DS grain filter once, as #ks-chalk", () => {
    const html = renderToStaticMarkup(createElement("svg", null, createElement("defs", null, createElement(DoodleChalkFilter))));
    const filter = parseSvg(html.replace("<svg>", '<svg xmlns="http://www.w3.org/2000/svg">')).querySelector("filter")!;
    const ds = parseSvg(readFileSync(join(DOODLES_DIR, "ink-heart.svg"), "utf8")).querySelector("filter")!;
    expect(attrsOf(filter)).toEqual({ ...attrsOf(ds), id: "ks-chalk" });
    expect(flatten(filter)).toEqual(flatten(ds));
  });

  it("renders no element id at all, so a page with many doodles has no duplicate ids", () => {
    for (const name of DOODLE_NAMES) expect(render(name).querySelectorAll("[id]").length, name).toBe(0);
  });

  it("is up to date: regenerating in memory gives the committed file", () => {
    expect(generateDoodles()).toBe(readFileSync(join(REPO, "src/assets/doodles.generated.tsx"), "utf8"));
  });

  it("carries the generated-file header naming its script and source", () => {
    const first = readFileSync(join(REPO, "src/assets/doodles.generated.tsx"), "utf8").split("\n")[0];
    expect(first).toMatch(/^\/\/ GENERATED by scripts\/assets\/build-doodles\.mjs, do not edit; source design-system\/project\/assets\/Doodles\//);
  });
});

describe("build-doodles.mjs refuses what would change the look", () => {
  let dir: string;
  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), "ks-doodles-"));
    for (const name of DOODLE_FILES) writeFileSync(join(dir, `${name}.svg`), readFileSync(join(DOODLES_DIR, `${name}.svg`)));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  it("generates from an untouched copy of the DS files (the baseline for the planted cases)", () => {
    const body = (s: string) => s.slice(s.indexOf("\n"));
    expect(body(generateDoodles({ doodlesDir: dir }))).toBe(body(generateDoodles()));
  });

  it("fails when one doodle's grain filter differs from the shared one", () => {
    const f = join(dir, "chalk-star.svg");
    writeFileSync(f, readFileSync(f, "utf8").replace('seed="7"', 'seed="8"'));
    expect(() => generateDoodles({ doodlesDir: dir })).toThrow(/chalk-star\.svg: .*filter differs/);
  });

  it("fails on a stroked shape that is not a path (the draw animates paths only)", () => {
    const f = join(dir, "ink-heart.svg");
    writeFileSync(f, readFileSync(f, "utf8").replace("</g>", '<circle cx="1" cy="1" r="2" fill="none" stroke="#2a2118"></circle></g>'));
    expect(() => generateDoodles({ doodlesDir: dir })).toThrow(/ink-heart\.svg: stroked <circle>/);
  });

  it("fails on an element it does not know how to carry", () => {
    const f = join(dir, "ink-star.svg");
    writeFileSync(f, readFileSync(f, "utf8").replace("</g>", '<polygon points="0,0 1,1 1,0" fill="#2a2118"></polygon></g>'));
    expect(() => generateDoodles({ doodlesDir: dir })).toThrow(/ink-star\.svg: unsupported element <polygon>/);
  });
});
