import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { ICON_PATHS, ICON_VIEWBOX } from "@/assets/icons.generated";
import { ICON_CARET_DOWN, ICON_CHECK, ICON_VIEWBOX as FIELD_ICON_VIEWBOX, ICON_WARNING_CIRCLE } from "./field-icons";

/* The checkout forms (PreorderForm, AddressForm) are client islands (ADR-003) and take Field, Select, Checkbox
 * and Alert (tasks 5.15, 5.16; store copy: failures show in a danger Alert). Whatever those controls import ships
 * to the browser, and the generated icon map is about 30 KB of path data that is never tree-shaken: one icon read
 * from it ships all 76 (assets catalogue, Icons row). So the controls draw their icons from field-icons.ts (and
 * Alert/alert-icons.ts), and only this test reads the map, to hold every copy equal to the DS's. */

const ROOT = process.cwd();
const ICON_MAP = "src/assets/icons.generated.ts";

/** `from "x"`, a bare `import "x"`, `export … from "x"` and `import("x")`. */
const SPECIFIER = /\bfrom\s+["']([^"']+)["']|\bimport\s+["']([^"']+)["']|\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

/** A repo file for an `@/` or relative specifier; null for a package. */
function resolveLocal(from: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? join(ROOT, "src", specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(from), specifier)
      : null;
  if (base === null) return null;
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const path = base + ext;
    if (existsSync(path) && statSync(path).isFile()) return path;
  }
  throw new Error(`${specifier} (imported by ${relative(ROOT, from)}) does not resolve`);
}

/** Every repo module `entry` reaches through its imports, itself included, as repo-relative paths. */
function reachableFrom(entry: string): string[] {
  const seen = new Set<string>();
  const queue = [join(ROOT, entry)];
  while (queue.length > 0) {
    const file = queue.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const m of readFileSync(file, "utf8").matchAll(SPECIFIER)) {
      const next = resolveLocal(file, m[1] ?? m[2] ?? m[3]);
      if (next !== null) queue.push(next);
    }
  }
  return [...seen].map((p) => relative(ROOT, p)).sort();
}

describe("field-icons: the DS icons the form controls draw", () => {
  it.each([
    ["warning-circle", ICON_WARNING_CIRCLE],
    ["caret-down", ICON_CARET_DOWN],
    ["check", ICON_CHECK],
  ] as const)("%s is the DS icon's path, exactly (equal to the generated map's)", (name, d) => {
    expect(d).toBe(ICON_PATHS[name]);
  });

  it("uses the DS viewBox", () => {
    expect(FIELD_ICON_VIEWBOX).toBe(ICON_VIEWBOX);
  });
});

describe("what the checkout forms import never reaches the icon map", () => {
  it.each([
    "src/components/ui/Field/Field.tsx",
    "src/components/ui/Field/field-parts.tsx",
    "src/components/ui/Select/Select.tsx",
    "src/components/ui/Checkbox/Checkbox.tsx",
    "src/components/ui/Alert/Alert.tsx",
  ])("%s", (entry) => {
    const reached = reachableFrom(entry);
    expect(reached, reached.join("\n")).not.toContain(ICON_MAP);
    // The walk is real: each control reaches the copies it draws from.
    expect(reached).toContain("src/components/ui/Field/field-icons.ts");
  });

  it("the walk finds an import of the map (so a red result above is real)", () => {
    expect(reachableFrom("src/components/ui/CopyLinkButton/CopyLinkButton.tsx")).toContain(ICON_MAP);
  });
});
