import { readFileSync } from "node:fs";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import * as generated from "@/assets/icons.generated";
import { ALERT_TONE_ICON } from "@/components/ui/Alert/alert-icons";
import { parseSource } from "../../../../test/e2e/support/source";
import { ICON_CARET_DOWN, ICON_CHECK, ICON_VIEWBOX, ICON_WARNING_CIRCLE } from "./field-icons";

/* The DS icons the form controls draw (Field's error line, Select's caret, Checkbox's tick) and Alert's tone icons.
 * The checkout forms are client islands (ADR-003) and import these controls, so whatever the controls import ships
 * to the browser. Since task 2.11 the generator emits one constant per icon and a production build keeps only the
 * constants a client chunk uses, so field-icons.ts and alert-icons.ts re-export those constants: no copied path
 * data. That the controls never reach `ICON_PATHS`, `Icon` or `Button` is test/guards/client-icons.test.ts's
 * (they are on its list of client-safe modules). */

const MODULES = ["src/components/ui/Field/field-icons.ts", "src/components/ui/Alert/alert-icons.ts"];

/** Every string literal in the file that reads as SVG path data ("M…"), comments excluded. */
function pathLiterals(path: string): string[] {
  const sf = parseSource(path, readFileSync(path, "utf8"));
  const out: string[] = [];
  const visit = (node: ts.Node): void => {
    if ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) && /^M\s*-?[\d.]/.test(node.text)) out.push(node.text);
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** The module specifiers a file imports or re-exports from, and the names it takes from them. */
function imports(path: string): { specifiers: string[]; names: string[] } {
  const sf = parseSource(path, readFileSync(path, "utf8"));
  const specifiers: string[] = [];
  const names: string[] = [];
  for (const s of sf.statements) {
    if (!(ts.isImportDeclaration(s) || ts.isExportDeclaration(s)) || !s.moduleSpecifier || !ts.isStringLiteral(s.moduleSpecifier)) continue;
    specifiers.push(s.moduleSpecifier.text);
    const bindings = ts.isImportDeclaration(s) ? s.importClause?.namedBindings : s.exportClause;
    if (bindings === undefined) names.push("*");
    else if (ts.isNamespaceImport(bindings) || ts.isNamespaceExport(bindings)) names.push("*");
    else for (const el of bindings.elements) names.push((el.propertyName ?? el.name).text);
  }
  return { specifiers, names };
}

describe("field-icons: the DS icons the form controls draw", () => {
  it.each([
    ["warning-circle", ICON_WARNING_CIRCLE, generated.ICON_WARNING_CIRCLE],
    ["caret-down", ICON_CARET_DOWN, generated.ICON_CARET_DOWN],
    ["check", ICON_CHECK, generated.ICON_CHECK],
  ] as const)("%s is the generated constant, equal to the map's entry", (name, d, constant) => {
    expect(d).toBe(constant);
    expect(d).toBe(generated.ICON_PATHS[name]);
  });

  it("uses the DS viewBox", () => {
    expect(ICON_VIEWBOX).toBe(generated.ICON_VIEWBOX);
  });

  it("Alert's tone icons are the generated constants (bundle.js STATUS_ICON)", () => {
    expect(ALERT_TONE_ICON).toEqual({
      info: generated.ICON_INFO,
      success: generated.ICON_CHECK_CIRCLE,
      warning: generated.ICON_WARNING_CIRCLE,
      danger: generated.ICON_WARNING_CIRCLE,
    });
  });
});

describe("field-icons.ts and alert-icons.ts carry no copied path data (task 2.11)", () => {
  it.each(MODULES)("%s holds no path string of its own", (path) => {
    expect(pathLiterals(path)).toEqual([]);
  });

  it.each(MODULES)("%s takes its icons from the generated constants only, never the map or the whole module", (path) => {
    const { specifiers, names } = imports(path);
    expect(specifiers).toEqual(["@/assets/icons.generated"]);
    expect(names.length).toBeGreaterThan(0);
    for (const name of names) expect(name, path).toMatch(/^ICON_(?!PATHS$)[A-Z0-9_]+$/);
  });

  it("the path-literal scan sees a copied path (so a green result above is real)", () => {
    expect(pathLiterals("src/assets/icons.generated.ts").length).toBe(Object.keys(generated.ICON_PATHS).length);
  });
});
