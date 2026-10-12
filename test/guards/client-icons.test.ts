import { existsSync, readFileSync, statSync } from "node:fs";
import { join, posix } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { listFiles, ROOT } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";

/* client-icons (task 2.11; wave-2 close ruling; architecture §12 "Client islands and icons").
 *
 * `Icon`, `Button` and `PreorderButton` read the whole icon map (`ICON_PATHS` in src/assets/icons.generated.ts), so
 * a client island that reaches any of them ships all 76 paths against the §12 route budget (an island rendering
 * `Icon` by a name from its props: one client chunk of 29,255 B, 10,451 B gzip, task 2.11 probe build). An island
 * draws its own icons with `Glyph` or `IconButton` and the named `ICON_*` constants, which a production build keeps
 * one by one (Turbopack removes unused exports; the same probe with `ICON_CARET_LEFT`: 1,425 B, that path alone).
 * A literal key (`ICON_PATHS["caret-left"]`) happens to minify to one path too, but a key from data ships all 76 and
 * an import cannot tell them apart, so the guard refuses any import of `ICON_PATHS` in client code.
 *
 * The rule: from every module under src/ whose directive prologue holds "use client", and every `*.client.tsx`,
 * following relative and `@/` imports transitively (static imports, re-exports and `import()`; type-only imports
 * skipped, as the compiler erases them), no reachable module is ui/Icon/Icon.tsx, ui/Button/** or
 * ui/PreorderButton/**, and none imports `ICON_PATHS` (by name, or the whole icon module by `*`). The modules the
 * catalogue marks client-safe are roots too, so they stay safe before their first island imports them.
 *
 * Proven red by the plants below (in memory, every run) and once on the real tree (task 2.11 report). */

const ICON_MODULE = "src/assets/icons.generated.ts";

const FORBIDDEN: { test: RegExp; why: string }[] = [
  { test: /^src\/components\/ui\/Icon\/Icon\.tsx$/, why: "Icon reads the whole icon map" },
  { test: /^src\/components\/ui\/Button\//, why: "Button renders Icon" },
  { test: /^src\/components\/ui\/PreorderButton\//, why: "PreorderButton renders Button" },
];

/** Client-safe by the catalogue (components.md): islands import them from waves 3 and 5 on (3.1, 3.3, 5.15, 5.16). */
const CLIENT_SAFE = [
  "src/components/ui/Icon/Glyph.tsx",
  "src/components/ui/IconButton/IconButton.tsx",
  "src/components/ui/Field/Field.tsx",
  "src/components/ui/Field/field-parts.tsx",
  "src/components/ui/Select/Select.tsx",
  "src/components/ui/Checkbox/Checkbox.tsx",
  "src/components/ui/Alert/Alert.tsx",
];

const CODE = /\.(?:tsx?|jsx?|mjs)$/;
const EXTENSIONS = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx", "/index.js"];
/** Stylesheets, data and media: loaded, never followed, so they need not exist (compose.css is git-ignored). */
const ASSET = /\.(?:css|json|svg|png|jpe?g|webp|avif|gif|woff2?|mp4|webm|txt)$/;

/** The source tree the guard reads: the working tree, or the working tree with planted files over it. */
interface Tree {
  files: string[];
  read(path: string): string;
  isFile(path: string): boolean;
}

function workingTree(overlay: Record<string, string> = {}): Tree {
  const files = [...new Set([...listFiles(["src"]), ...Object.keys(overlay)])].filter((p) => CODE.test(p)).sort();
  return {
    files,
    read: (path) => overlay[path] ?? readFileSync(join(ROOT, path), "utf8"),
    isFile: (path) => path in overlay || (existsSync(join(ROOT, path)) && statSync(join(ROOT, path)).isFile()),
  };
}

type Edge = { specifier: string; names: string[] };

/** True when the file's directive prologue holds "use client". */
function hasUseClient(sf: ts.SourceFile): boolean {
  for (const s of sf.statements) {
    if (!ts.isExpressionStatement(s) || !ts.isStringLiteral(s.expression)) return false;
    if (s.expression.text === "use client") return true;
  }
  return false;
}

/** What one module loads at run time: each local or package specifier and the names it takes ("*" = all). */
function edgesOf(path: string, text: string): Edge[] {
  const sf = parseSource(path, text);
  const edges: Edge[] = [];
  for (const s of sf.statements) {
    if (ts.isImportDeclaration(s) && ts.isStringLiteral(s.moduleSpecifier)) {
      const clause = s.importClause;
      if (clause?.isTypeOnly) continue;
      const names: string[] = [];
      if (clause?.name) names.push("default");
      const bindings = clause?.namedBindings;
      if (bindings && ts.isNamespaceImport(bindings)) names.push("*");
      if (bindings && ts.isNamedImports(bindings)) {
        const values = bindings.elements.filter((el) => !el.isTypeOnly);
        // `import { type A, type B } from "x"` is erased whole (no verbatimModuleSyntax in tsconfig.json).
        if (values.length === 0 && !clause?.name) continue;
        for (const el of values) names.push((el.propertyName ?? el.name).text);
      }
      edges.push({ specifier: s.moduleSpecifier.text, names });
    } else if (ts.isExportDeclaration(s) && s.moduleSpecifier && ts.isStringLiteral(s.moduleSpecifier)) {
      if (s.isTypeOnly) continue;
      const clause = s.exportClause;
      if (clause === undefined || ts.isNamespaceExport(clause)) {
        edges.push({ specifier: s.moduleSpecifier.text, names: ["*"] });
      } else {
        const values = clause.elements.filter((el) => !el.isTypeOnly);
        if (values.length === 0) continue;
        edges.push({ specifier: s.moduleSpecifier.text, names: values.map((el) => (el.propertyName ?? el.name).text) });
      }
    }
  }
  const visit = (node: ts.Node): void => {
    if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
      const [arg] = node.arguments;
      if (arg && ts.isStringLiteralLike(arg)) edges.push({ specifier: arg.text, names: ["*"] });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return edges;
}

/** The repo file a relative or `@/` specifier loads; null for a package, `@ds/` or a non-code asset. */
function resolveLocal(tree: Tree, from: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? posix.join("src", specifier.slice(2))
    : specifier.startsWith(".")
      ? posix.normalize(posix.join(posix.dirname(from), specifier))
      : null;
  if (base === null || ASSET.test(base)) return null;
  for (const ext of EXTENSIONS) {
    const path = base + ext;
    if (tree.isFile(path)) return CODE.test(path) ? path : null;
  }
  throw new Error(`client-icons: ${specifier} (imported by ${from}) does not resolve; the guard never skips an import it cannot follow`);
}

function rootsOf(tree: Tree): string[] {
  const roots = tree.files.filter((p) => p.endsWith(".client.tsx") || hasUseClient(parseSource(p, tree.read(p))));
  return [...new Set([...roots, ...CLIENT_SAFE.filter((p) => tree.isFile(p))])].sort();
}

/** Every breach of the rule, each with the import chain from its root. */
function violations(tree: Tree): { roots: string[]; reached: number; found: string[] } {
  const roots = rootsOf(tree);
  const found = new Set<string>();
  const reachedAll = new Set<string>();
  for (const root of roots) {
    const via = new Map<string, string | null>([[root, null]]);
    const queue = [root];
    const chain = (path: string): string => {
      const out = [path];
      for (let p = via.get(path); p; p = via.get(p)) out.unshift(p);
      return out.join(" -> ");
    };
    while (queue.length > 0) {
      const file = queue.shift()!;
      reachedAll.add(file);
      const rule = FORBIDDEN.find((f) => f.test.test(file));
      if (rule) {
        found.add(`${chain(file)}: a client module reaches it (${rule.why}); render it in a server parent and pass it in`);
        continue;
      }
      for (const edge of edgesOf(file, tree.read(file))) {
        const next = resolveLocal(tree, file, edge.specifier);
        if (next === null) continue;
        const takesMap = edge.names.includes("ICON_PATHS") || (next === ICON_MODULE && edge.names.includes("*"));
        if (takesMap) {
          found.add(`${chain(file)}: imports ${edge.names.includes("ICON_PATHS") ? "ICON_PATHS" : "the whole icon module"} from ${edge.specifier}; draw with Glyph or IconButton and the ICON_* constants`);
        }
        if (!via.has(next)) {
          via.set(next, file);
          queue.push(next);
        }
      }
    }
  }
  return { roots, reached: reachedAll.size, found: [...found].sort() };
}

describe("client-icons: what a client island reaches never ships the icon map", () => {
  it("finds the client modules (directive or .client.tsx) and the client-safe list", () => {
    const roots = rootsOf(workingTree());
    for (const island of [
      "src/components/ui/CopyLinkButton/CopyLinkButton.client.tsx",
      "src/components/ui/InAppBrowserNote/InAppBrowserNote.client.tsx",
      "src/components/ui/MotionController/MotionController.client.tsx",
      "src/features/preorder/components/PreorderForm.tsx",
      ...CLIENT_SAFE,
    ]) {
      expect(roots).toContain(island);
    }
    for (const path of CLIENT_SAFE) expect(existsSync(join(ROOT, path)), path).toBe(true);
  });

  it("is green on the tree", () => {
    const { roots, reached, found } = violations(workingTree());
    console.info(`client-icons: ${roots.length} client roots, ${reached} modules reached, ${found.length} violations`);
    expect(found, found.join("\n")).toEqual([]);
    expect(reached).toBeGreaterThan(roots.length);
  });
});

describe("client-icons: planted violations are red", () => {
  const check = (overlay: Record<string, string>) => violations(workingTree(overlay)).found;

  it("plant 1: a client file importing Icon", () => {
    const found = check({
      "src/__plant__/IconIsland.client.tsx": 'import { Icon } from "@/components/ui/Icon/Icon";\nexport const X = () => <Icon name="x" />;\n',
    });
    expect(found).toEqual([expect.stringMatching(/^src\/__plant__\/IconIsland\.client\.tsx -> src\/components\/ui\/Icon\/Icon\.tsx: /)]);
  });

  it("plant 2: a client file importing a helper that imports Button", () => {
    const found = check({
      "src/__plant__/helper.tsx": 'import { Button } from "@/components/ui/Button/Button";\nexport const Help = Button;\n',
      "src/__plant__/Island.tsx": '"use client";\nimport { Help } from "./helper";\nexport const Y = Help;\n',
    });
    expect(found).toContainEqual(
      expect.stringMatching(/^src\/__plant__\/Island\.tsx -> src\/__plant__\/helper\.tsx -> src\/components\/ui\/Button\/Button\.tsx: /),
    );
  });

  it("plant 3: a client file importing ICON_PATHS", () => {
    const found = check({
      "src/__plant__/Map.tsx": '"use client";\nimport { ICON_PATHS } from "@/assets/icons.generated";\nexport const d = ICON_PATHS.x;\n',
    });
    expect(found).toEqual([expect.stringMatching(/^src\/__plant__\/Map\.tsx: imports ICON_PATHS from @\/assets\/icons\.generated/)]);
  });

  it.each([
    ["a .client.tsx without the directive reaching PreorderButton", { "src/__plant__/P.client.tsx": 'import { PreorderButton } from "../components/ui/PreorderButton/PreorderButton";\nexport { PreorderButton };\n' }],
    ["a directive after a comment, importing Icon", { "src/__plant__/C.tsx": '/* note */\n"use client";\nimport { Icon } from "@/components/ui/Icon/Icon";\nexport { Icon };\n' }],
    ["the whole icon module by namespace", { "src/__plant__/N.tsx": '"use client";\nimport * as icons from "@/assets/icons.generated";\nexport const d = icons.ICON_X;\n' }],
    ["a helper re-exporting ICON_PATHS", { "src/__plant__/re.ts": 'export { ICON_PATHS } from "@/assets/icons.generated";\n', "src/__plant__/R.tsx": '"use client";\nimport { ICON_PATHS } from "./re";\nexport const d = ICON_PATHS.x;\n' }],
    ["a helper re-exporting the whole icon module", { "src/__plant__/all.ts": 'export * from "@/assets/icons.generated";\n', "src/__plant__/A.tsx": '"use client";\nimport { ICON_X } from "./all";\nexport const d = ICON_X;\n' }],
    ["a dynamic import of Button", { "src/__plant__/D.tsx": '"use client";\nexport const load = () => import("@/components/ui/Button/Button");\n' }],
    ["a client-safe module importing Icon (IconButton as it was before 2.11)", { "src/components/ui/IconButton/IconButton.tsx": 'import { Icon } from "../Icon/Icon";\nexport const IconButton = () => <Icon name="x" />;\n' }],
  ])("red: %s", (_name, overlay) => {
    expect(check(overlay)).not.toEqual([]);
  });

  it.each([
    ["IconButton with a named constant", { "src/__plant__/Ok.tsx": '"use client";\nimport { ICON_CARET_LEFT } from "@/assets/icons.generated";\nimport { IconButton } from "@/components/ui/IconButton/IconButton";\nexport const Ok = () => <IconButton icon={ICON_CARET_LEFT} label="Previous" onClick={() => {}} />;\n' }],
    ["Glyph with a named constant", { "src/__plant__/G.client.tsx": 'import { ICON_X } from "@/assets/icons.generated";\nimport { Glyph } from "@/components/ui/Icon/Glyph";\nexport const G = () => <Glyph d={ICON_X} />;\n' }],
    ["type-only imports of Icon and Button", { "src/__plant__/T.tsx": '"use client";\nimport type { IconProps } from "@/components/ui/Icon/Icon";\nimport { type ButtonProps } from "@/components/ui/Button/Button";\nexport type { IconName } from "@/components/ui/Icon/Icon";\nexport type P = IconProps & ButtonProps;\n' }],
    ["a server component importing Icon", { "src/__plant__/Server.tsx": 'import { Icon } from "@/components/ui/Icon/Icon";\nexport const S = () => <Icon name="x" />;\n' }],
    [
      "a client file importing a stylesheet, JSON and an image that are not on disk (never followed; a git-ignored generated file may be absent before predev)",
      { "src/__plant__/S.client.tsx": 'import "@/styles/generated/absent.css";\nimport data from "./absent.json";\nimport pic from "./absent.webp";\nexport const S = () => <img src={pic.src} alt={data.alt} />;\n' },
    ],
  ])("green: %s", (_name, overlay) => {
    expect(check(overlay)).toEqual([]);
  });

  it("fails loudly on a local import it cannot resolve (never skips it)", () => {
    expect(() => check({ "src/__plant__/Lost.tsx": '"use client";\nimport { Gone } from "./gone";\nexport { Gone };\n' })).toThrow(/\.\/gone .* does not resolve/);
  });
});
