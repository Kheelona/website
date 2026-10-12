import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readRepoFile } from "../../../../test/e2e/support/repo";

/*
 * Test support for the selling sections (task 3.2), never shipped: no page imports it. It turns a fold of the
 * built Gate A mockup (mockup/<slug>.html, partials and icons inlined) into the markup the build must print, so
 * each section test can say "renders exactly what the mockup shows" (SCA 1) instead of re-typing the HTML.
 *
 * What the build prints differently from the mockup, and nothing else:
 * - links: store.html is the store of this build (STORE_URL, https://store.kheelona.com in tests); every other
 *   mockup file name is the site path it stands for (mockup/build.mjs: home is /, meet-kheelu is /products/kheelu);
 * - the mockup's value markers (data-src spans and attributes) are gone (N22);
 * - a link the mockup marks no-wrap carries the no-wrap span inside it, as RichText renders the content's
 *   `[{nowrap:…}](href)` (same rendering: white-space applies to the same words);
 * - each mockup block class takes its ks- name (components §7), or the name a section's rename table gives it,
 *   or is dropped (null) where the build styles it another way.
 */

/** The store of a build without KH_SITE_ENV ("development", whose store is production's; src/config/env.ts). */
export const STORE = "https://store.kheelona.com";

/** A mockup class (without the prefix) mapped to the classes the build prints instead; [] drops it. */
export type Renames = Readonly<Record<string, readonly string[]>>;

const pages = new Map<string, Document>();

/** A built mockup page, parsed once. */
export function mockupPage(slug: string): Document {
  let doc = pages.get(slug);
  if (!doc) {
    doc = new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
    pages.set(slug, doc);
  }
  return doc;
}

/** The one element `selector` matches on a mockup page; throws if there is none. */
export function mockupElement(slug: string, selector: string): Element {
  const el = mockupPage(slug).querySelector(selector);
  if (!el) throw new Error(`mockup/${slug}.html has no ${selector}`);
  return el;
}

/** A fold's CTA block as the mockup lays it out: the actions row holding its chilli button, and every element after
 *  it in the same column (price, trust line, help line, the group around them, the secondary row). */
export function mockupCtaRun(fold: Element): Element[] {
  const row = fold.querySelector(".kh-section__actions > .kh-btn--cta")?.parentElement;
  if (!row) throw new Error("the fold has no actions row with a chilli button");
  const run: Element[] = [];
  for (let el: Element | null = row; el; el = el.nextElementSibling) run.push(el);
  return run;
}

/** The site path a mockup file link stands for. */
function sitePath(href: string): string {
  if (href === "store.html") return STORE;
  const m = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  if (!m) return href;
  const page = m[1] === "home" ? "" : m[1] === "meet-kheelu" ? "products/kheelu" : m[1];
  return `/${page}${m[2] ?? ""}`;
}

const MOCKUP_CLASS = /^mk-(.+)$/;

function renameClasses(el: Element, renames: Renames): void {
  const classes = (el.getAttribute("class") ?? "").split(/\s+/).filter(Boolean);
  const out = classes.flatMap((c) => {
    const m = MOCKUP_CLASS.exec(c);
    if (!m) return [c];
    return renames[m[1]] ?? [`ks-${m[1]}`];
  });
  if (out.length) el.setAttribute("class", out.join(" "));
  else el.removeAttribute("class");
}

/**
 * A mockup element turned into what the build prints (see the header). Works on a deep clone. A span that only
 * carried a value marker goes with it, unless `keepSpans` matches it: a span the component draws anyway (an offer
 * card perk's words are always in a span, with or without the marker).
 */
export function asBuilt(source: Element, renames: Renames = {}, keepSpans?: string): Element {
  const el = source.cloneNode(true) as Element;
  const doc = el.ownerDocument;
  const all = () => [el, ...Array.from(el.querySelectorAll("*"))];
  for (const node of all()) {
    if (!node.hasAttribute("data-src")) continue;
    const keep = keepSpans !== undefined && node.matches(keepSpans);
    node.removeAttribute("data-src");
    if (!keep && node.tagName === "SPAN" && node.attributes.length === 0) node.replaceWith(...Array.from(node.childNodes));
  }
  for (const node of all()) renameClasses(node, renames);
  for (const a of all().filter((n) => n.tagName === "A")) {
    const href = a.getAttribute("href");
    if (href !== null) a.setAttribute("href", sitePath(href));
    if (a.classList.contains("ks-nowrap")) {
      a.classList.remove("ks-nowrap");
      if (a.classList.length === 0) a.removeAttribute("class");
      const span = doc.createElement("span");
      span.className = "ks-nowrap";
      span.append(...Array.from(a.childNodes));
      a.append(span);
    }
  }
  return el;
}

const VOID = new Set(["img", "br", "hr", "input", "source", "meta", "link"]);
const escapeAttr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
const escapeText = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * One canonical serialisation for both sides: attributes sorted by name, comments dropped, adjacent text joined,
 * runs of white space as one space, and the source's indentation (white space with a line break) left out.
 */
export function canonical(node: Node): string {
  if (node.nodeType === 3) {
    const text = node.textContent ?? "";
    return /^\s*$/.test(text) && text.includes("\n") ? "" : escapeText(text.replace(/\s+/g, " "));
  }
  if (node.nodeType !== 1) return "";
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const attrs = Array.from(el.attributes)
    .map((a) => `${a.name}="${escapeAttr(a.value)}"`)
    .sort()
    .join(" ");
  const open = `<${tag}${attrs ? ` ${attrs}` : ""}>`;
  if (VOID.has(tag)) return open;
  return `${open}${childrenMarkup(el)}</${tag}>`;
}

function childrenMarkup(parent: Node): string {
  const parts: string[] = [];
  let text = "";
  const flush = () => {
    if (text) parts.push(canonical(parent.ownerDocument!.createTextNode(text)));
    text = "";
  };
  for (const child of Array.from(parent.childNodes)) {
    if (child.nodeType === 8) continue;
    if (child.nodeType === 3) {
      text += child.textContent ?? "";
      continue;
    }
    flush();
    parts.push(canonical(child));
  }
  flush();
  return parts.join("");
}

export interface BuiltOptions {
  readonly renames?: Renames;
  /** Value-marker spans the component draws anyway (asBuilt). */
  readonly keepSpans?: string;
  /** A section's own documented differences, applied after the general ones (classes the build adds). */
  readonly adjust?: (el: Element) => void;
}

/** The canonical markup of several mockup elements, each turned into what the build prints. */
export function builtMarkup(elements: readonly Element[], { renames = {}, keepSpans, adjust }: BuiltOptions = {}): string {
  return elements
    .map((source) => {
      const el = asBuilt(source, renames, keepSpans);
      adjust?.(el);
      return canonical(el);
    })
    .join("");
}

/** Appends `cls` to every element `selector` matches inside `root` (and `root` itself). */
export function addClass(root: Element, selector: string, cls: string): void {
  const hits = [...(root.matches(selector) ? [root] : []), ...Array.from(root.querySelectorAll(selector))];
  for (const el of hits) el.setAttribute("class", `${el.getAttribute("class") ?? ""} ${cls}`.trim());
}

/** The canonical markup of what a server component renders (its top-level nodes, in order). */
export function renderedMarkup(ui: ReactElement): string {
  const template = document.createElement("template");
  template.innerHTML = renderToStaticMarkup(ui);
  return childrenMarkup(template.content);
}

/** The top-level element a server component renders, parsed into the test's own document (so the DOM matchers,
 *  which check the element's realm, accept it). */
export function renderedElement(ui: ReactElement): HTMLElement {
  const holder = document.createElement("div");
  holder.innerHTML = renderToStaticMarkup(ui);
  const el = holder.firstElementChild;
  if (!(el instanceof HTMLElement)) throw new Error("rendered no element");
  return el;
}

/** `el` without the elements `selector` matches (a deep clone): media are compared on their own. */
export function without(el: Element, selector: string): Element {
  const copy = el.cloneNode(true) as Element;
  copy.querySelectorAll(selector).forEach((n) => n.remove());
  return copy;
}
