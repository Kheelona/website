import { readFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { NEW_EVENTS } from "./new-events";

/* The client-only map of the new events (task 6.3, 6.2 note 2). track.ts ships in the store's client chunks; reading the
   whole EVENTS registry there put every existing event's documentation into them (about 2.3 KB gzip on three store
   chunks). The map holds only what the dispatcher needs, and nothing it loads may pull the registry back in: from
   events.ts (and destinations.ts) only types. test/guards/tracking-registry.test.ts holds the map equal to the
   registry's new rows. */

/** Every module a source text loads at run time: import declarations and export-from that are not `type`-only. */
function runtimeImportsOf(text: string): string[] {
  const file = ts.createSourceFile("probe.ts", text, ts.ScriptTarget.Latest, true);
  const out: string[] = [];
  for (const node of file.statements) {
    if (ts.isImportDeclaration(node)) {
      const clause = node.importClause;
      const typeOnly =
        clause?.isTypeOnly === true ||
        (clause !== undefined &&
          clause.name === undefined &&
          clause.namedBindings !== undefined &&
          ts.isNamedImports(clause.namedBindings) &&
          clause.namedBindings.elements.every((e) => e.isTypeOnly));
      if (!typeOnly) out.push((node.moduleSpecifier as ts.StringLiteral).text);
    } else if (ts.isExportDeclaration(node) && node.moduleSpecifier && !node.isTypeOnly) {
      out.push((node.moduleSpecifier as ts.StringLiteral).text);
    }
  }
  return out;
}

const runtimeImports = (path: string) => runtimeImportsOf(readFileSync(join(process.cwd(), path), "utf8"));

const REGISTRY = /(^|\/)(events|destinations)$/;

describe("the new events' client map", () => {
  it("finds the modules a file loads, telling type-only imports apart (guard the guard)", () => {
    expect(runtimeImportsOf('import type { A } from "./events";')).toEqual([]);
    expect(runtimeImportsOf('import { type A, type B } from "./events";')).toEqual([]);
    expect(runtimeImportsOf('import { EVENTS } from "./events";')).toEqual(["./events"]);
    expect(runtimeImportsOf('import { type A, EVENTS } from "./events";')).toEqual(["./events"]);
    expect(runtimeImportsOf('import * as registry from "@/lib/tracking/events";')).toEqual(["@/lib/tracking/events"]);
    expect(runtimeImportsOf('import "./destinations";')).toEqual(["./destinations"]);
    expect(runtimeImportsOf('export { EVENTS } from "./events";')).toEqual(["./events"]);
    expect(runtimeImportsOf('export type { TrackedEvent } from "./events";')).toEqual([]);
    expect(runtimeImports("src/lib/tracking/track.test.ts")).toContain("@/lib/tracking/events");
  });

  it("loads nothing from the registry at run time (types only)", () => {
    expect(runtimeImports("src/lib/tracking/new-events.ts").filter((m) => REGISTRY.test(m))).toEqual([]);
  });

  it("is what track.ts loads; track.ts takes nothing but types from the registry", () => {
    const loaded = runtimeImports("src/lib/tracking/track.ts");
    expect(loaded).toContain("./new-events");
    expect(loaded.filter((m) => REGISTRY.test(m))).toEqual([]);
  });

  it("names each new event once, with its browser destinations and parameters, and never Meta", () => {
    for (const [name, entry] of Object.entries(NEW_EVENTS)) {
      expect(entry.params.length, name).toBeGreaterThan(0);
      expect(entry.destinations.filter((d) => d.startsWith("meta")), name).toEqual([]);
    }
  });
});
