import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { CTAS, CTA_IDS, CTA_VALUES, RESERVED_CTA_VALUES } from "@/lib/tracking/cta";
import { FREEZE_TAG, ROOT, git, isTestOrStory, listFiles, readRepoFile } from "../e2e/support/repo";
import { jsxAttributes, parseSource } from "../e2e/support/source";
import { isStillLegacy } from "./legacy-paths";

/* cta-registry (task 2.6; ADR-006; architecture §8.3; tracking inventory §6 and parity row 15).
 *
 * PostHog promotes `data-ph-capture-attribute-cta` to the top-level `cta` property of every
 * $autocapture, and the founder's insights count by it. So:
 *
 * 1. The eight values production sends are kept byte for byte: pinned here, equal to the
 *    registry's existing values, and equal to the values the tag's own code writes (`track="…"`
 *    on the legacy Button), so they are proven from production code, not retyped.
 * 2. `home-arc` and `compare` are reserved: registered, never a CtaId, never written by new code.
 * 3. Legacy code still writes only the eight; new code writes only registered, non-reserved
 *    values, and only the Button primitive writes the attribute from a variable (its typed
 *    `cta: CtaId` prop); any other writer must use a literal the registry knows. A write is the
 *    attribute in JSX, the attribute's name as an object key (spread onto an element, the way the
 *    Button writes it) or as any other string (a DOM call, a constant used as a key), in any
 *    shipped `.ts` or `.tsx` file under src/.
 * 4. `Button` with `variant="cta"` refuses to compile without a CtaId (architecture §8.3; the
 *    Button is task 2.2's): checked by compiling probes against src/components/ui/Button/Button.tsx
 *    once it exists. The probe instrument is proven on every run against two stand-ins, a strict
 *    one typed as the catalogue says and a lax one, so it is trusted before the Button lands.
 */

/** Inventory §6: the eight values on production. Byte for byte; never edited. */
const EXISTING_EIGHT = ["hero", "home-arc", "compare", "navbar", "navbar-mobile", "finale", "product-top", "product-foot"];
const RESERVED = ["home-arc", "compare"];
const ATTRIBUTE = "data-ph-capture-attribute-cta";
/** The only files that may write the attribute from a non-literal value (ADR-006). */
const VARIABLE_WRITERS = ["src/components/ui/Button/Button.tsx"];
const BUTTON = "src/components/ui/Button/Button.tsx";

/* ── 1-2. The values ──────────────────────────────────────────────────────────────────────── */

describe("cta-registry: the eight existing values, byte for byte", () => {
  it("the registry's existing values are exactly the eight (inventory §6)", () => {
    const existing = CTA_VALUES.filter((v) => CTAS[v].status === "existing");
    expect([...existing].sort()).toEqual([...EXISTING_EIGHT].sort());
    for (const v of EXISTING_EIGHT) expect(CTA_VALUES, `"${v}" is missing or altered`).toContain(v);
  });

  it(`they are exactly the values the code at ${FREEZE_TAG} writes`, () => {
    const out = git(["grep", "-h", "-o", "-E", 'track="[^"]+"', FREEZE_TAG, "--", "src/*.tsx"]);
    const atTag = [...new Set(out.split("\n").filter(Boolean).map((l) => l.replace(/^.*track="([^"]+)"$/, "$1")))];
    expect(atTag.sort()).toEqual([...EXISTING_EIGHT].sort());
  });

  it("home-arc and compare are reserved: registered, never a CtaId", () => {
    expect([...RESERVED_CTA_VALUES].sort()).toEqual([...RESERVED].sort());
    for (const v of RESERVED) expect(CTA_IDS).not.toContain(v);
    expect(CTA_IDS.length).toBe(CTA_VALUES.length - RESERVED.length);
  });
});

/* ── 3. Who writes which value ────────────────────────────────────────────────────────────── */

type Write = { path: string; line: number; attr: string; value: string | null; at: number };

/** A string literal's text (plain or template without substitutions), else null. */
function literalText(e: ts.Node | undefined): string | null {
  return e && (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) ? e.text : null;
}

/** The attribute's name used outside JSX attribute syntax: as an object key, quoted or computed
 *  (`{ "data-ph-capture-attribute-cta": cta }`, spread onto an element), or as any other string
 *  (`setAttribute("data-ph-capture-attribute-cta", v)`, a constant later used as a key). The value
 *  is known only for an object key with a literal value; everything else is a variable write. */
function attributeNameWrites(path: string, sf: ts.SourceFile): Write[] {
  const out: Write[] = [];
  const at = (n: ts.Node) => ({ line: sf.getLineAndCharacterOfPosition(n.getStart(sf)).line + 1, at: n.getStart(sf) });
  const visit = (node: ts.Node): void => {
    if (ts.isPropertyAssignment(node)) {
      const key = ts.isComputedPropertyName(node.name) ? node.name.expression : node.name;
      if (literalText(key) === ATTRIBUTE) {
        out.push({ path, attr: ATTRIBUTE, value: literalText(node.initializer), ...at(node) });
        visit(node.initializer);
        return;
      }
    } else if (literalText(node) === ATTRIBUTE && !ts.isImportDeclaration(node.parent)) {
      out.push({ path, attr: ATTRIBUTE, value: null, ...at(node) });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** Every CTA write in a file, in source order: the attribute itself (in JSX, as an object key or
 *  any other string), a `cta` prop, and the legacy `track` prop. */
function ctaWrites(path: string, text: string): Write[] {
  const sf = parseSource(path, text);
  const jsx = jsxAttributes(sf)
    .filter((a) => a.name === ATTRIBUTE || a.name === "cta" || a.name === "track")
    .map((a) => ({ path, line: a.line, attr: a.name, value: a.value, at: a.node.getStart(sf) }));
  return [...jsx, ...attributeNameWrites(path, sf)].sort((a, b) => a.at - b.at);
}

/** The files the scan reads: shipped TypeScript, `.ts` as well as `.tsx`, because a `.ts` module
 *  can hold the attribute as an object key that a component spreads onto an element. */
function isScanned(path: string): boolean {
  return /\.(ts|tsx)$/.test(path) && !isTestOrStory(path);
}

describe("cta-registry: every value written is registered", () => {
  it("records: reads literal and variable writes of all three forms", () => {
    const src = `const a = <a ${ATTRIBUTE}="hero" />; const b = <Button cta={id} />; const c = <Button track="finale" />;`;
    expect(ctaWrites("x.tsx", src).map((w) => [w.attr, w.value])).toEqual([
      [ATTRIBUTE, "hero"],
      ["cta", null],
      ["track", "finale"],
    ]);
  });

  /* The attribute can also reach the DOM through a spread object (the way the Button primitive
     writes it) or a DOM call, so the attribute's name as an object key or any other string is a
     write too; only a literal value next to it counts as a known value. */
  it("records: an object key (quoted or computed) and any other use of the attribute's name", () => {
    const src = [
      `const d = { "${ATTRIBUTE}": cta };`,
      `const e = { ["${ATTRIBUTE}"]: "finale" };`,
      `const f = <a {...{ "${ATTRIBUTE}": "hero" }} />;`,
      `el.setAttribute("${ATTRIBUTE}", v);`,
      `const g = { label: "${ATTRIBUTE} is promoted to cta" };`,
    ].join("\n");
    expect(ctaWrites("x.tsx", src).map((w) => [w.attr, w.value, w.line])).toEqual([
      [ATTRIBUTE, null, 1],
      [ATTRIBUTE, "finale", 2],
      [ATTRIBUTE, "hero", 3],
      [ATTRIBUTE, null, 4],
    ]);
  });

  /* Task 2.6 review: a `.ts` module exporting `{ "data-ph-capture-attribute-cta": "buy-now" }`
     for a component to spread was invisible while the scan read `.tsx` files only. */
  it.each([
    ["src/components/sections/Probe/attrs.ts", true],
    ["src/components/sections/Probe/Probe.tsx", true],
    ["src/lib/tracking/cta.ts", true],
    ["src/components/sections/Probe/Probe.test.tsx", false],
    ["src/components/sections/Probe/Probe.stories.tsx", false],
    ["src/lib/tracking/track.test.ts", false],
    ["src/components/sections/Probe/Probe.css", false],
  ] as const)("records: scans %s: %s", (path, expected) => {
    expect(isScanned(path)).toBe(expected);
  });

  it("records: a .ts module's object key is a write, with its literal value", () => {
    const src = `export const attrs = { "${ATTRIBUTE}": "buy-now" } as const;`;
    expect(ctaWrites("src/components/sections/Probe/attrs.ts", src).map((w) => [w.attr, w.value, w.line])).toEqual([
      [ATTRIBUTE, "buy-now", 1],
    ]);
  });

  const files = listFiles(["src"]).filter(isScanned);
  const writes = files.flatMap((p) => ctaWrites(p, readRepoFile(p)));
  const legacy = writes.filter((w) => isStillLegacy(w.path));
  const fresh = writes.filter((w) => !isStillLegacy(w.path));

  it("legacy code still writes only the eight existing values", () => {
    const bad = legacy.filter((w) => w.attr === "track" && (w.value === null || !EXISTING_EIGHT.includes(w.value)));
    console.log(`[cta-registry] ${legacy.length} legacy write(s), ${fresh.length} new write(s).`);
    expect(bad.map((w) => `${w.path}:${w.line} ${w.attr}=${w.value}`)).toEqual([]);
  });

  it("new code writes only registered, non-reserved values", () => {
    const bad = fresh.filter((w) => w.value !== null && !(CTA_IDS as readonly string[]).includes(w.value));
    expect(bad.map((w) => `${w.path}:${w.line} ${w.attr}="${w.value}"`)).toEqual([]);
  });

  it("only the Button primitive writes the attribute from a variable (ADR-006)", () => {
    const bad = fresh.filter((w) => w.attr === ATTRIBUTE && w.value === null && !VARIABLE_WRITERS.includes(w.path));
    expect(bad.map((w) => `${w.path}:${w.line}`)).toEqual([]);
  });

  it("new code never uses the legacy track prop", () => {
    expect(fresh.filter((w) => w.attr === "track").map((w) => `${w.path}:${w.line}`)).toEqual([]);
  });
});

/* ── 4. Button refuses a cta variant without a CtaId ──────────────────────────────────────── */

const PROBES = {
  good: `<Button variant="cta" cta="hero" href="https://store.kheelona.com">Pre-order Kheelu</Button>`,
  missing: `<Button variant="cta" href="https://store.kheelona.com">Pre-order Kheelu</Button>`,
  reserved: `<Button variant="cta" cta="home-arc" href="https://store.kheelona.com">Pre-order Kheelu</Button>`,
  unregistered: `<Button variant="cta" cta="buy-now" href="https://store.kheelona.com">Pre-order Kheelu</Button>`,
} as const;
type Probe = keyof typeof PROBES;

const STAND_INS = {
  strict: `import type { ReactNode } from "react";
import type { CtaId } from "@/lib/tracking/cta";
type Common = { href?: string; children?: ReactNode };
type Props = (Common & { variant: "cta"; cta: CtaId }) | (Common & { variant?: "primary" | "secondary" | "ghost" | "danger"; cta?: never });
export function Button(props: Props) { return props.children ?? null; }`,
  lax: `import type { ReactNode } from "react";
type Props = { variant?: string; cta?: string; href?: string; children?: ReactNode };
export function Button(props: Props) { return props.children ?? null; }`,
};

/** Compiles every probe against each Button module in one program; returns error messages by file. */
function compileProbes(targets: Record<string, string>, virtual: Record<string, string>): Record<string, string[]> {
  const configPath = join(ROOT, "tsconfig.json");
  const config = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, ROOT);
  const options: ts.CompilerOptions = { ...parsed.options, noEmit: true, incremental: false, plugins: [] };
  const files: Record<string, string> = { ...virtual };
  const roots: string[] = [];
  for (const [target, buttonModule] of Object.entries(targets)) {
    for (const [probe, jsx] of Object.entries(PROBES)) {
      const file = resolve(ROOT, `${target}.${probe}.probe.tsx`);
      const dir = target.slice(0, target.lastIndexOf("/") + 1);
      const specifier = `./${buttonModule.slice(dir.length).replace(/\.tsx$/, "")}`;
      files[file] = `import { Button } from "${specifier}";\nexport const probe = ${jsx};\n`;
      roots.push(file);
    }
  }
  const host = ts.createCompilerHost(options);
  const read = host.readFile.bind(host);
  const exists = host.fileExists.bind(host);
  const getSource = host.getSourceFile.bind(host);
  const virtualDirs = new Set(Object.keys(files).map((f) => f.slice(0, f.lastIndexOf("/"))));
  const dirExists = host.directoryExists?.bind(host);
  host.readFile = (f) => files[resolve(f)] ?? read(f);
  host.fileExists = (f) => resolve(f) in files || exists(f);
  host.directoryExists = (d) => virtualDirs.has(resolve(d)) || (dirExists ? dirExists(d) : ts.sys.directoryExists(d));
  host.getSourceFile = (f, lang, onError, create) =>
    resolve(f) in files ? ts.createSourceFile(f, files[resolve(f)], lang, true, ts.ScriptKind.TSX) : getSource(f, lang, onError, create);
  const program = ts.createProgram(roots, options, host);
  const out: Record<string, string[]> = {};
  for (const root of roots) {
    const sf = program.getSourceFile(root)!;
    out[root.slice(ROOT.length + 1)] = ts
      .getPreEmitDiagnostics(program, sf)
      .map((d) => ts.flattenDiagnosticMessageText(d.messageText, " "));
  }
  return out;
}

describe("cta-registry: Button refuses a cta variant without a CtaId", () => {
  const STRICT = "test/guards/__cta_probe__/strict/Button.tsx";
  const LAX = "test/guards/__cta_probe__/lax/Button.tsx";
  const hasButton = existsSync(join(ROOT, BUTTON));
  const targets: Record<string, string> = {
    "test/guards/__cta_probe__/strict/probe": STRICT,
    "test/guards/__cta_probe__/lax/probe": LAX,
    ...(hasButton ? { "src/components/ui/Button/probe": BUTTON } : {}),
  };
  const results = compileProbes(targets, {
    [resolve(ROOT, STRICT)]: STAND_INS.strict,
    [resolve(ROOT, LAX)]: STAND_INS.lax,
  });
  const errorsOf = (target: string, probe: Probe) => results[`${target}.${probe}.probe.tsx`];

  it("records: a Button typed as the catalogue says accepts a CtaId and refuses the rest", () => {
    const t = "test/guards/__cta_probe__/strict/probe";
    expect(errorsOf(t, "good")).toEqual([]);
    for (const p of ["missing", "reserved", "unregistered"] as const) expect(errorsOf(t, p).length, p).toBeGreaterThan(0);
  });

  it("records: a lax Button (cta?: string) lets all of them through, so the probes can tell", () => {
    const t = "test/guards/__cta_probe__/lax/probe";
    for (const p of Object.keys(PROBES) as Probe[]) expect(errorsOf(t, p), p).toEqual([]);
  });

  it.skipIf(!hasButton)(`${BUTTON}: compiles with a CtaId, refuses none, reserved and unregistered values`, () => {
    const t = "src/components/ui/Button/probe";
    expect(errorsOf(t, "good"), "the catalogue's call must compile").toEqual([]);
    for (const p of ["missing", "reserved", "unregistered"] as const) {
      expect(errorsOf(t, p).length, `Button accepts the ${p} probe: ${PROBES[p]}`).toBeGreaterThan(0);
    }
  });

  it("reports whether the real Button was checked", () => {
    console.log(
      hasButton
        ? `[cta-registry] ${BUTTON} checked against the probes.`
        : `[cta-registry] ${BUTTON} does not exist yet (task 2.2, same wave): checked at wave close.`,
    );
    expect(readFileSync(join(ROOT, "src/lib/tracking/cta.ts"), "utf8")).toContain("export type CtaId");
  });
});
