import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { describe, expect, it } from "vitest";
import { ROOT, fixtureName, listFiles, readRepoFile } from "../e2e/support/repo";
import { parseSource } from "../e2e/support/source";

/* checkout-signature (task 1.1; ADR-013 class 3, architecture §16.2 proof 2, QA review B3).
 *
 * The checkout's presentation files may change markup, classes, copy and presentation imports,
 * nothing else. Each file's LOGIC SIGNATURE is computed from the TypeScript AST and compared
 * with test/guards/fixtures/checkout-signatures/<path with "/" as "__">.json:
 *   code: every statement outside JSX (imports, declarations, hooks, handlers, awaits,
 *         early-return conditions), comments removed, each JSX tree replaced by __JSX_<tag>__;
 *   jsx:  inside the JSX, every expression container (conditions, .map callees, values shown)
 *         and the contract attributes: on intrinsic elements the form, field, link and handler
 *         attributes plus ph-no-capture/ph-mask; on components every prop except presentation
 *         props (className, label, hint, title, body, size, variant …).
 * A restyle regenerates its file's signature in the same commit:
 *   KH_UPDATE_SIGNATURES=1 npx vitest run test/guards/checkout-signature.test.ts
 * and the diff is reviewed: only content reads (copy.*, content.*) and presentation imports may
 * appear. The fixtures were seeded from the tree on 2026-10-12, byte-identical to the tag
 * (checkout-freeze and `git diff --stat archive/pre-reset-2026-10-10 -- src/app/store
 * src/features/preorder` empty in the same run).
 */

const FIXTURES = "test/guards/fixtures/checkout-signatures";

const INTRINSIC_CONTRACT = new Set([
  "name",
  "type",
  "inputMode",
  "autoComplete",
  "maxLength",
  "minLength",
  "pattern",
  "required",
  "noValidate",
  "disabled",
  "defaultValue",
  "value",
  "checked",
  "defaultChecked",
  "href",
  "action",
  "method",
  "target",
  "rel",
  "role",
]);
const COMPONENT_PRESENTATION = new Set([
  "className",
  "style",
  "label",
  "hint",
  "title",
  "body",
  "alt",
  "src",
  "width",
  "height",
  "priority",
  "sizes",
  "loading",
  "fetchPriority",
  "size",
  "variant",
  "tone",
  "icon",
  "iconEnd",
  "as",
]);

function presentationFiles(): string[] {
  return listFiles(["src/app/store", "src/features/preorder/components"]).filter(
    (p) =>
      p.endsWith(".tsx") &&
      !/\.(test|stories)\.tsx$/.test(p) &&
      (p.startsWith("src/app/store/") || /\/(PreorderForm|OrderSummary|AddressForm)\.tsx$/.test(p)),
  );
}

type Signature = { code: string[]; jsx: string[] };

const isJsxRoot = (n: ts.Node): n is ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxFragment =>
  ts.isJsxElement(n) || ts.isJsxSelfClosingElement(n) || ts.isJsxFragment(n);

function rootTag(n: ts.JsxElement | ts.JsxSelfClosingElement | ts.JsxFragment, sf: ts.SourceFile): string {
  if (ts.isJsxFragment(n)) return "fragment";
  const tag = ts.isJsxElement(n) ? n.openingElement.tagName : n.tagName;
  return tag.getText(sf).replace(/[^\w]/g, "_");
}

function computeSignature(path: string, text: string): Signature {
  const sf = parseSource(path, text);
  const printer = ts.createPrinter({ removeComments: true, newLine: ts.NewLineKind.LineFeed });

  /** Replace every JSX tree under `node` with an identifier, so code prints without markup. */
  const stripJsx = <T extends ts.Node>(node: T): T => {
    const result = ts.transform(node, [
      (ctx) => {
        const visit = (n: ts.Node): ts.Node =>
          isJsxRoot(n) ? ts.factory.createIdentifier(`__JSX_${rootTag(n, sf)}__`) : ts.visitEachChild(n, visit, ctx);
        return (root) => ts.visitNode(root, visit) as T;
      },
    ]);
    const out = result.transformed[0];
    result.dispose();
    return out;
  };
  const print = (node: ts.Node) =>
    printer.printNode(ts.EmitHint.Unspecified, stripJsx(node), sf).replace(/\s+/g, " ").trim();

  const code = printer
    .printFile(stripJsx(sf))
    .split("\n")
    .map((l) => l.trimEnd())
    .filter((l) => l.trim() !== "");

  const jsx: string[] = [];
  const visitJsx = (n: ts.Node): void => {
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const tag = n.tagName.getText(sf);
      const component = /^[A-Z]/.test(tag) || tag.includes(".");
      for (const a of n.attributes.properties) {
        if (ts.isJsxSpreadAttribute(a)) {
          jsx.push(`@${tag} {...${print(a.expression)}}`);
          continue;
        }
        const name = a.name.getText(sf);
        const init = a.initializer;
        if (!component && name === "className") {
          const tokens = (init?.getText(sf) ?? "").match(/\bph-(?:no-capture|mask)\b/g);
          if (tokens) jsx.push(`@${tag} class~${[...new Set(tokens)].sort().join(" ")}`);
          continue;
        }
        const keep = component
          ? !COMPONENT_PRESENTATION.has(name)
          : INTRINSIC_CONTRACT.has(name) || /^on[A-Z]/.test(name) || /^data-ph-/.test(name);
        if (!keep) continue;
        if (!init) jsx.push(`@${tag} ${name}`);
        else if (ts.isStringLiteral(init)) jsx.push(`@${tag} ${name}=${JSON.stringify(init.text)}`);
        else if (ts.isJsxExpression(init) && init.expression) jsx.push(`@${tag} ${name}={${print(init.expression)}}`);
      }
    } else if (ts.isJsxExpression(n) && n.expression && !ts.isJsxAttribute(n.parent)) {
      // {" "} only spaces words apart: presentation, not logic.
      const blank = ts.isStringLiteral(n.expression) && n.expression.text.trim() === "";
      if (!blank) jsx.push(`{${print(n.expression)}}`);
    }
    ts.forEachChild(n, visitJsx);
  };
  const findJsx = (n: ts.Node): void => {
    if (isJsxRoot(n)) visitJsx(n);
    else ts.forEachChild(n, findJsx);
  };
  findJsx(sf);
  return { code, jsx };
}

function fixturePath(path: string): string {
  return join(ROOT, FIXTURES, `${fixtureName(path)}.json`);
}

const UPDATE = process.env.KH_UPDATE_SIGNATURES === "1";

describe("checkout-signature instrument", () => {
  const before = `export function F({ busy }: { busy: boolean }) {
    const [s, setS] = useState("idle");
    if (!busy) return <p className="text-[15px]">Hello</p>;
    return <form noValidate onSubmit={go} className="grid"><input name="phone" type="tel" autoComplete="tel" className="a" />{s === "idle" ? "Pay" : null}</form>;
  }`;
  const sig = computeSignature("x.tsx", before);

  it("ignores classes, copy, comments and layout", () => {
    const restyled = before
      .replace('className="text-[15px]"', 'className="kh-body-s"')
      .replace("Hello", "Hi there")
      .replace('className="grid"', 'className="kh-form" /* DS */')
      .replace('className="a"', 'className="kh-input"');
    expect(computeSignature("x.tsx", restyled)).toEqual(sig);
  });

  it("sees an added condition, a changed field attribute, a dropped handler and a new hook", () => {
    expect(computeSignature("x.tsx", before.replace("if (!busy)", "if (!busy && s)"))).not.toEqual(sig);
    expect(computeSignature("x.tsx", before.replace('autoComplete="tel"', 'autoComplete="off"'))).not.toEqual(sig);
    expect(computeSignature("x.tsx", before.replace(" onSubmit={go}", ""))).not.toEqual(sig);
    expect(computeSignature("x.tsx", before.replace("noValidate ", ""))).not.toEqual(sig);
    expect(computeSignature("x.tsx", before.replace('s === "idle"', 's !== "idle"'))).not.toEqual(sig);
    expect(computeSignature("x.tsx", before.replace("const [s", "useEffect(() => {}); const [s"))).not.toEqual(sig);
  });
});

describe("checkout-signature: presentation files keep their logic", () => {
  const files = presentationFiles();

  it("covers the store routes and the three checkout components", () => {
    expect(files).toContain("src/app/store/thanks/page.tsx");
    expect(files).toContain("src/app/store/layout.tsx");
    expect(files).toContain("src/features/preorder/components/PreorderForm.tsx");
    expect(files.length).toBeGreaterThanOrEqual(11);
  });

  it.each(files)("%s", (path) => {
    const now = computeSignature(path, readRepoFile(path));
    const file = fixturePath(path);
    if (UPDATE) {
      mkdirSync(join(ROOT, FIXTURES), { recursive: true });
      writeFileSync(
        file,
        JSON.stringify(
          {
            file: path,
            note: "Logic signature (test/guards/checkout-signature.test.ts). Regenerated only with a restyle; every changed line is reviewed (ADR-013).",
            ...now,
          },
          null,
          2,
        ) + "\n",
      );
      return;
    }
    expect(
      existsSync(file),
      `${path} has no signature fixture. A new presentation file needs one: run KH_UPDATE_SIGNATURES=1 and have the diff reviewed.`,
    ).toBe(true);
    const stored = JSON.parse(readRepoFile(`${FIXTURES}/${fixtureName(path)}.json`)) as Signature;
    expect(
      now,
      `${path}: its logic signature changed. If this is a reviewed restyle, regenerate with ` +
        "KH_UPDATE_SIGNATURES=1 and show the diff: only content reads and presentation imports may appear.",
    ).toEqual({ code: stored.code, jsx: stored.jsx });
  });
});
