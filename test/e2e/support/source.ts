/* Source-reading helpers for the guards (task 1.1). They read TypeScript through the compiler's
 * own parser, so a comment that mentions a banned word, a "#fff" in a URL fragment, or "//" inside
 * JSX text is never mistaken for code (lessons §7: strip comments, scope the claim).
 */
import ts from "typescript";

export function parseSource(path: string, text: string): ts.SourceFile {
  const kind = path.endsWith(".tsx") || path.endsWith(".jsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  return ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true, kind);
}

export type SourceString = {
  /** The string's own text (template literals: the static parts joined by "${…}"). */
  text: string;
  kind: "string" | "template" | "jsx-text";
  line: number;
  node: ts.Node;
};

function lineOf(sf: ts.SourceFile, node: ts.Node): number {
  return sf.getLineAndCharacterOfPosition(node.getStart(sf)).line + 1;
}

/** Every string literal, template literal and JSX text in the file, comments excluded. */
export function sourceStrings(sf: ts.SourceFile): SourceString[] {
  const out: SourceString[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      // Import specifiers are paths, not published text.
      if (!ts.isImportDeclaration(node.parent) && !ts.isExportDeclaration(node.parent)) {
        out.push({ text: node.text, kind: "string", line: lineOf(sf, node), node });
      }
    } else if (ts.isTemplateExpression(node)) {
      const parts = [node.head.text, ...node.templateSpans.map((s) => s.literal.text)];
      out.push({ text: parts.join("${…}"), kind: "template", line: lineOf(sf, node), node });
    } else if (ts.isJsxText(node)) {
      const text = node.text.replace(/\s+/g, " ").trim();
      if (text) out.push({ text, kind: "jsx-text", line: lineOf(sf, node), node });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

export type JsxAttr = {
  tag: string;
  name: string;
  /** Static value when the attribute is a string literal, else null. */
  value: string | null;
  initializer: ts.JsxAttributeValue | undefined;
  line: number;
  node: ts.JsxAttribute;
};

export function tagNameOf(node: ts.JsxOpeningLikeElement): string {
  return node.tagName.getText();
}

export function jsxAttributes(sf: ts.SourceFile): JsxAttr[] {
  const out: JsxAttr[] = [];
  const visit = (node: ts.Node): void => {
    if (ts.isJsxAttribute(node)) {
      const owner = node.parent.parent as ts.JsxOpeningLikeElement;
      const init = node.initializer;
      let value: string | null = null;
      if (init && ts.isStringLiteral(init)) value = init.text;
      if (init && ts.isJsxExpression(init) && init.expression) {
        const e = init.expression;
        if (ts.isStringLiteral(e) || ts.isNoSubstitutionTemplateLiteral(e)) value = e.text;
      }
      out.push({
        tag: tagNameOf(owner),
        name: node.name.getText(sf),
        value,
        initializer: init,
        line: lineOf(sf, node),
        node,
      });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  return out;
}

/** CSS without comments, keeping line numbers (comments become spaces and newlines). */
export function stripCssComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
}

/** Every top-level statement except imports, as text: "the same file apart from its imports". */
export function withoutImports(path: string, text: string): string {
  const sf = parseSource(path, text);
  return sf.statements
    .filter((s) => !ts.isImportDeclaration(s))
    .map((s) => s.getText(sf))
    .join("\n");
}
