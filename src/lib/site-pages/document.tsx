import { createElement, type ReactNode } from "react";

/**
 * A served redesign page as React elements, for the one page Next renders with React (src/app/global-not-found.tsx):
 * the 404, which Next (and Vercel's edge) serve from the prerendered not-found output, so it cannot be a route handler.
 * The document's head becomes elements React places in <head> (meta, link, title, script, style); the body is set as
 * HTML, exactly as built. Next writes its own charset and viewport, so the page's are dropped.
 */

export interface SplitDocument {
  readonly htmlAttrs: Record<string, string>;
  readonly head: string;
  readonly bodyAttrs: Record<string, string>;
  readonly body: string;
}

const ENTITIES: Readonly<Record<string, string>> = { amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " " };

/** HTML character references in an attribute value, decoded (React encodes them again). */
export function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#[0-9]+|[a-z]+);/gi, (whole, ref: string) => {
    if (ref[0] === "#") {
      const code = ref[1] === "x" || ref[1] === "X" ? parseInt(ref.slice(2), 16) : parseInt(ref.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[ref.toLowerCase()] ?? whole;
  });
}

/** The attributes of a start tag's inside (`name="v" defer`), in order. A bare attribute reads as "". */
export function parseAttributes(source: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of source.matchAll(/([^\s"'=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g)) {
    attrs[m[1].toLowerCase()] = decodeEntities(m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

export function splitDocument(html: string): SplitDocument {
  const htmlTag = /<html\b([^>]*)>/i.exec(html);
  const head = /<head\b[^>]*>([\s\S]*?)<\/head>/i.exec(html);
  const body = /<body\b([^>]*)>([\s\S]*)<\/body>/i.exec(html);
  if (!head || !body) throw new Error("the 404 page has no <head> or <body>");
  return {
    htmlAttrs: parseAttributes(htmlTag?.[1] ?? ""),
    head: head[1],
    bodyAttrs: parseAttributes(body[1]),
    body: body[2],
  };
}

const PROP: Readonly<Record<string, string>> = {
  class: "className",
  charset: "charSet",
  crossorigin: "crossOrigin",
  "http-equiv": "httpEquiv",
  fetchpriority: "fetchPriority",
  referrerpolicy: "referrerPolicy",
  nomodule: "noModule",
  imagesizes: "imageSizes",
  imagesrcset: "imageSrcSet",
  hreflang: "hrefLang",
  tabindex: "tabIndex",
};
const BOOLEAN = new Set(["async", "defer", "nomodule", "disabled"]);

/** HTML attributes as React props. */
export function toProps(attrs: Record<string, string>): Record<string, string | boolean> {
  const props: Record<string, string | boolean> = {};
  for (const [name, value] of Object.entries(attrs)) {
    props[PROP[name] ?? name] = BOOLEAN.has(name) ? true : value;
  }
  return props;
}

/** The head's elements, in order. Comments and the page's own charset and viewport are left out. */
export function headElements(head: string): ReactNode[] {
  const out: ReactNode[] = [];
  const tokens = head.replace(/<!--[\s\S]*?-->/g, "");
  const re = /<(meta|link|base)\b([^>]*?)\/?>|<(title|script|style|noscript)\b([^>]*)>([\s\S]*?)<\/\3>/gi;
  let i = 0;
  for (const m of tokens.matchAll(re)) {
    const key = `h${i++}`;
    if (m[1]) {
      const attrs = parseAttributes(m[2]);
      /* Next writes the charset, the viewport and, for a 404, the noindex itself. */
      if (m[1].toLowerCase() === "meta" && ("charset" in attrs || ["viewport", "robots"].includes(attrs.name))) continue;
      out.push(createElement(m[1].toLowerCase(), { key, ...toProps(attrs) }));
    } else {
      const tag = m[3].toLowerCase();
      const props = { key, ...toProps(parseAttributes(m[4])) };
      out.push(
        tag === "title"
          ? createElement("title", props, decodeEntities(m[5]))
          : createElement(tag, { ...props, dangerouslySetInnerHTML: { __html: m[5] } }),
      );
    }
  }
  return out;
}
