import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { navigation } from "@/content/en-IN/navigation";
import { trustItems } from "@/content/en-IN/trust";
import { toPlainText } from "@/lib/content/plain-text";
import { buildOffer } from "@/lib/offer/offer";
import { readRepoFile } from "../e2e/support/repo";

/*
 * The one mockup comparison harness (task 3.6 items 5 and 14; wave-3 close, "One of each helper"). Test support, never
 * shipped: it lives outside src/ and only tests import it. Every ui, section, shell and template test that compares what
 * it renders with the approved Gate A mockup (mockup/<slug>.html, built: partials and icons inlined; D046) reads the mockup and
 * ports its addresses and classes here, then compares in one of three ways:
 *
 *   builtMarkup, renderedMarkup, canonical   the exact markup (SCA 1): the selling sections (task 3.2) and the ui
 *                                           primitives that compare with the mockup (task 4.5 item 8)
 *   skeleton, words                         tags, classes, ARIA, ids and addresses, then the words apart: the support
 *                                           sections (task 3.4)
 *   outline                                 tags, classes and reveals down to the media primitives: the story
 *                                           sections (task 3.3), which compare their words apart
 *   mockupDiff                              element by element, every difference listed with its path: the shells
 *                                           (task 3.1)
 *
 * What the build prints differently from the mockup, in all three:
 * - addresses: a mockup page file is the route it became (`mockupRoute`, structure §5); store.html is this build's
 *   store (`STORE`); a trust item's link and the footer's grievance officer link carry the part of the page the build
 *   links them to (`ruledLinkHref`, task 7.1a; wiki/qa/deviations.md V24);
 * - classes: each mockup block (`mk-…`) takes its ks- name (components §7), or the name a test's rename table gives
 *   it, or is dropped (`portClass`);
 * - the mockup's value markers (data-src) are review-tool markup that never ships (N22).
 * Tests run from the repository root (`readRepoFile`).
 */

/* ── Reading the mockup ─────────────────────────────────────────────────────────────────────────────────────────── */

/** The store of a build without KH_SITE_ENV ("development", whose store is production's; src/config/env.ts). */
export const STORE = "https://store.kheelona.com";

/** A built mockup page, parsed fresh: for a test that changes what it reads (a stand-in in place of a slot). */
export function parseMockup(slug: string): Document {
  return new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
}

const pages = new Map<string, Document>();

/** A built mockup page, parsed once and shared by the test file: read it, never change it (clone first). */
export function mockupPage(slug: string): Document {
  let doc = pages.get(slug);
  if (!doc) {
    doc = parseMockup(slug);
    pages.set(slug, doc);
  }
  return doc;
}

/** One element of a built mockup page: the `index`th match of `selector` (the first by default). Throws when there is
 *  none, so a test can never compare against an empty fold. */
export function mockupFold(slug: string, selector: string, index = 0): Element {
  const found = mockupPage(slug).querySelectorAll(selector)[index];
  if (!found) throw new Error(`mockup/${slug}.html: no element matches ${selector} (#${index})`);
  return found;
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

/**
 * A mockup address read as the route it became (structure §5): `store.html` is this build's store; `home.html` is
 * `/`, `meet-kheelu.html` the product page, `story-<slug>.html` the article `/stories/<slug>`, any other `<page>.html`
 * `/<page>`, a fragment kept. Anything else (a fragment, tel:, mailto:, https:, a route) is kept as it is.
 */
export function mockupRoute(href: string): string {
  if (href === "store.html") return STORE;
  const match = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  if (!match) return href;
  const [, page, fragment = ""] = match;
  const path =
    page === "home" ? "/" : page === "meet-kheelu" ? "/products/kheelu" : page.startsWith("story-") ? `/stories/${page.slice("story-".length)}` : `/${page}`;
  return path + fragment;
}

/* ── The trust links' parts (task 7.1a) ─────────────────────────────────────────────────────────────────────────── */

/** Each trust item's words (both offer modes) to its link in trust.ts. */
const TRUST_HREF_BY_WORDS: ReadonlyMap<string, string> = new Map(
  (["token", "full"] as const).flatMap((mode) =>
    Object.values(trustItems).map((item) => [toPlainText(item.label, buildOffer(mode)), item.href as string] as const),
  ),
);
const NEW_TAB_NOTE = /\s*\(opens in a new tab\)$/;

/**
 * A mockup trust link's address as the build links it: the approved mockup links each trust item to the top of its terms
 * page, the build to the part that keeps the promise (trust.ts; task 7.1a, CMO built-page review C, m8, the main
 * session's ruling "the trust row's links land on their anchors"). A link inside a mockup trust line (`.mk-trust`) whose
 * words name a trust item takes that item's fragment, so every comparison here reads the ruled deep links as the
 * mockup's own; any other address, and any link elsewhere, is left as it is. In the mockup's own address space
 * ("refund.html#returns"), so `mockupRoute` and a test's `realHref` read it as before.
 */
export function trustLinkHref(a: Element, href: string): string {
  if (!a.closest(".mk-trust") || href.includes("#")) return href;
  const words = (a.textContent ?? "").replace(/\s+/g, " ").trim().replace(NEW_TAB_NOTE, "");
  const [path, fragment] = (TRUST_HREF_BY_WORDS.get(words) ?? "").split("#");
  return fragment && mockupRoute(href).endsWith(path) ? `${href}#${fragment}` : href;
}

/**
 * The footer's grievance officer link as the build links it: to the officer's block on /contact (`#grievance`, the
 * fragment navigation.ts gives it), where the approved mockup links the page's top (QA-005, the main session's ruling for
 * task 7.1a). Any other link is left as it is.
 */
export function grievanceLinkHref(a: Element, href: string): string {
  const { label, href: built } = navigation.footer.grievance;
  const fragment = built.split("#")[1];
  if (!fragment || href.includes("#") || !a.closest(".kh-footer__legal")) return href;
  return (a.textContent ?? "").replace(/\s+/g, " ").trim() === label && mockupRoute(href) === built.split("#")[0] ? `${href}#${fragment}` : href;
}

/** A mockup link's address with the parts the main session ruled the build links to (task 7.1a): the trust items'
 *  (`trustLinkHref`) and the grievance officer's (`grievanceLinkHref`). */
export function ruledLinkHref(a: Element, href: string): string {
  return grievanceLinkHref(a, trustLinkHref(a, href));
}

/** Every link's address under a mockup element, in page order, as the build links it (`ruledLinkHref`, then
 *  `mockupRoute`): for the tests that compare where a page links. */
export function mockupLinks(root: Element): string[] {
  return Array.from(root.querySelectorAll("a[href]")).map((a) => mockupRoute(ruledLinkHref(a, a.getAttribute("href")!)));
}

/* ── Classes ────────────────────────────────────────────────────────────────────────────────────────────────────── */

/** A mockup block name (without its `mk-` prefix) mapped to the class or classes the build prints instead; "" or []
 *  drops it: `{ guides: "ks-topic__guides", "sf-cta": [], "close-trust": ["ks-cta__full-trust"] }`. */
export type Renames = Readonly<Record<string, string | readonly string[]>>;

const MOCKUP_BLOCK = /^mk-(.+)$/;

/** The classes the build prints for one class of the mockup: a mockup block its ks- name, or the rename table's; any
 *  other class (the DS's kh-, a state) is kept. */
export function portClass(name: string, renames: Renames = {}): string[] {
  const block = MOCKUP_BLOCK.exec(name)?.[1];
  if (block === undefined) return [name];
  if (!Object.hasOwn(renames, block)) return [`ks-${block}`];
  const to = renames[block];
  return (typeof to === "string" ? [to] : [...to]).filter((c) => c !== "");
}

/* ── 1. The exact markup (the selling sections, task 3.2) ───────────────────────────────────────────────────────── */

function portClasses(el: Element, renames: Renames): void {
  const out = (el.getAttribute("class") ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .flatMap((c) => portClass(c, renames));
  if (out.length) el.setAttribute("class", out.join(" "));
  else el.removeAttribute("class");
}

/**
 * A mockup element turned into what the build prints (see the header), on a deep clone: value markers gone, classes
 * ported, addresses read as routes. A span that only carried a value marker goes with it, unless `keepSpans` matches
 * it: a span the component draws anyway (an offer card perk's words are always in a span, with or without the marker).
 * A link the mockup marks no-wrap stays one (`<a class="ks-nowrap">`): the content wraps the whole link,
 * `{nowrap:[…](href)}` (seller.ts, task 3.6 item 7).
 */
export function asBuilt(source: Element, renames: Renames = {}, keepSpans?: string): Element {
  const el = source.cloneNode(true) as Element;
  const all = () => [el, ...Array.from(el.querySelectorAll("*"))];
  for (const node of all()) {
    if (!node.hasAttribute("data-src")) continue;
    const keep = keepSpans !== undefined && node.matches(keepSpans);
    node.removeAttribute("data-src");
    if (!keep && node.tagName === "SPAN" && node.attributes.length === 0) node.replaceWith(...Array.from(node.childNodes));
  }
  // Addresses first, while the mockup's classes (`mk-trust`) still say where a link sits.
  for (const a of all().filter((n) => n.tagName === "A")) {
    const href = a.getAttribute("href");
    if (href !== null) a.setAttribute("href", mockupRoute(ruledLinkHref(a, href)));
  }
  for (const node of all()) portClasses(node, renames);
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

/* ── 2. The skeleton and the words (the support sections, task 3.4) ─────────────────────────────────────────────── */

export interface SkeletonOptions {
  /** Mockup block names (without the prefix) the build renamed: `{ guides: "ks-topic__guides" }`; "" drops one. */
  rename?: Renames;
  /** Classes left out on either side: what the build adds that the mockup does not carry (type steps, list reset). */
  drop?: RegExp;
  /** Subtrees left out (a selector): the mockup's hidden tab list, a gated block. */
  skip?: string;
  /** Elements replaced by their children (a selector): an inner span the build adds. */
  unwrap?: string;
}

const ARIA = ["role", "aria-hidden", "aria-label", "aria-labelledby", "aria-current", "id", "href", "alt"] as const;

/** Where the fold's ids sit: the line each id is on, and the ids that only name a label inside the fold. */
interface Labels {
  readonly lineOf: ReadonlyMap<string, number>;
  readonly labelOnly: ReadonlySet<string>;
}

const references = (el: Element) => (el.getAttribute("aria-labelledby") ?? "").split(/\s+/).filter(Boolean);

/**
 * One attribute as compared. aria-hidden by presence (always "true" where it is set). An address by value, a mockup
 * page read as its route. A label by the line of the element it points to (`@n`), so it is red when it names another
 * element, whatever the id is spelled; a label pointing outside the fold keeps its id. An id used only as a label
 * inside the fold by presence (its spelling is invisible, and the label checks what it names); any other id (an
 * anchor, a panel, a source note) by value. Everything else by value.
 */
function attribute(el: Element, name: (typeof ARIA)[number], labels: Labels): string {
  const value = el.getAttribute(name) ?? "";
  switch (name) {
    case "aria-hidden":
      return `[${name}]`;
    case "href":
      return `[${name}=${mockupRoute(ruledLinkHref(el, value))}]`;
    case "aria-labelledby":
      return `[${name}=${references(el).map((id) => (labels.lineOf.has(id) ? `@${labels.lineOf.get(id)}` : id)).join(" ")}]`;
    case "id":
      return labels.labelOnly.has(value) ? `[${name}]` : `[${name}=${value}]`;
    default:
      return `[${name}=${value}]`;
  }
}

function line(el: Element, options: SkeletonOptions, labels: Labels): string {
  const classes = [...el.classList]
    .flatMap((c) => portClass(c, options.rename))
    .filter((c) => !options.drop?.test(c))
    .sort();
  const attrs = ARIA.filter((a) => el.hasAttribute(a))
    .map((a) => attribute(el, a, labels))
    .join("");
  return `${el.tagName.toLowerCase()}${classes.map((c) => `.${c}`).join("")}${attrs}`;
}

interface Row {
  readonly el: Element;
  readonly depth: number;
}

function walk(el: Element, depth: number, options: SkeletonOptions, out: Row[]): void {
  if (options.skip && el.matches(options.skip)) return;
  if (options.unwrap && el.matches(options.unwrap)) {
    for (const child of el.children) walk(child, depth, options, out);
    return;
  }
  out.push({ el, depth });
  if (el.tagName.toLowerCase() === "svg") return;
  for (const child of el.children) walk(child, depth + 1, options, out);
}

/** The element's tree as lines: tag, sorted classes, ARIA, ids and addresses (see `attribute`); two spaces per level;
 *  an svg's inside left out. */
export function skeleton(el: Element, options: SkeletonOptions = {}): string {
  const rows: Row[] = [];
  walk(el, 0, options, rows);
  const lineOf = new Map<string, number>();
  rows.forEach((row, i) => {
    if (row.el.id && !lineOf.has(row.el.id)) lineOf.set(row.el.id, i);
  });
  const named = new Set(rows.flatMap((row) => references(row.el)));
  const linked = new Set(rows.map((row) => row.el.getAttribute("href") ?? "").filter((h) => h.startsWith("#")).map((h) => h.slice(1)));
  const labels: Labels = { lineOf, labelOnly: new Set([...named].filter((id) => lineOf.has(id) && !linked.has(id))) };
  return rows.map((row) => `${"  ".repeat(row.depth)}${line(row.el, options, labels)}`).join("\n");
}

/** Elements that start a new line on the page: their edges read as a space; inline text stays joined exactly. */
const BLOCKS =
  "address, article, aside, blockquote, dd, div, dl, dt, figcaption, figure, footer, h1, h2, h3, h4, h5, h6, header, li, nav, ol, p, section, table, td, th, tr, ul";

/** The element's visible text, whitespace collapsed, blocks apart (hidden subtrees named by `skip` left out). */
export function words(el: Element, options: Pick<SkeletonOptions, "skip"> = {}): string {
  const copy = el.cloneNode(true) as Element;
  if (options.skip) for (const gone of copy.querySelectorAll(options.skip)) gone.remove();
  for (const block of copy.querySelectorAll(BLOCKS)) {
    block.before(" ");
    block.after(" ");
  }
  return (copy.textContent ?? "").replace(/\s+/g, " ").trim();
}

/* ── 2b. The outline (the story sections, task 3.3) ─────────────────────────────────────────────────────────────── */

export interface OutlineOptions {
  /** Mockup blocks the build names otherwise (`portClass`). */
  readonly renames?: Renames;
  /** Elements whose inside a primitive's own test owns (a media primitive, the FAQ list): their line, never their
   *  children. An svg is always one line. */
  readonly stop?: (el: Element) => boolean;
  /** Classes the build adds to an element where the mockup has none for it (a list reset, a tap target), added on
   *  both sides. */
  readonly extra?: (el: Element) => readonly string[];
}

/** The element's tree as lines: tag, its classes (ported, each once, sorted) and `[data-reveal]`, two spaces per level;
 *  a stop element's inside left out. The story sections compare it with the mockup fold's, then their words apart. */
export function outline(el: Element, options: OutlineOptions = {}, depth = 0): string[] {
  const ported = [...el.classList].flatMap((c) => portClass(c, options.renames));
  const classes = [...new Set([...ported, ...(options.extra?.(el) ?? [])])].sort();
  const line = `${"  ".repeat(depth)}${el.tagName.toLowerCase()}${classes.map((c) => `.${c}`).join("")}${el.hasAttribute("data-reveal") ? "[data-reveal]" : ""}`;
  if (el.tagName.toLowerCase() === "svg" || options.stop?.(el)) return [line];
  return [line, ...[...el.children].flatMap((c) => outline(c, options, depth + 1))];
}

/* ── 3. Element by element (the shells, task 3.1) ──────────────────────────────────────────────────────────────── */

export interface MockupDiffOptions {
  /** The build's link for a mockup address (default `mockupRoute`); the store shell's links are on the marketing
   *  origin. */
  realHref?: (href: string) => string;
  /** Attributes neither side is compared on: behaviour hooks and image sources. */
  ignore?: readonly string[];
  /** Mockup blocks the build names otherwise (`portClass`): `{ seller: "ks-store-foot__seller" }`. */
  renames?: Renames;
  /** Classes that are state, not markup (the bar's `is-hidden`), left out on both sides. */
  dropClasses?: readonly string[];
}

type Child = Element | string;

const say = (c: Child) => (typeof c === "string" ? JSON.stringify(c) : `<${c.tagName.toLowerCase()}>`);

/** Children as elements and whitespace-normalised text, with the mockup's data-src spans read as their text. */
function children(el: Element): Child[] {
  const out: Child[] = [];
  for (const node of Array.from(el.childNodes)) {
    const text = node.nodeType === 3 || (node instanceof Element && node.hasAttribute("data-src")) ? (node.textContent ?? "") : null;
    if (text !== null) {
      if (typeof out[out.length - 1] === "string") out[out.length - 1] += text;
      else out.push(text);
    } else if (node instanceof Element) out.push(node);
  }
  return out.map((c) => (typeof c === "string" ? c.replace(/\s+/g, " ").trim() : c)).filter((c) => c !== "");
}

/** A comparison of a built element with the mockup's: every difference, with the path to it; none means equal. */
export function mockupDiff(options: MockupDiffOptions = {}): (built: Element, ref: Element) => string[] {
  const realHref = options.realHref ?? mockupRoute;
  const ignore = new Set(options.ignore ?? []);
  const drop = new Set(options.dropClasses ?? []);

  const classes = (value: string) =>
    value
      .split(/\s+/)
      .filter((c) => c !== "" && !drop.has(c))
      .flatMap((c) => portClass(c, options.renames))
      .sort()
      .join(" ");

  function attributes(el: Element, side: "mockup" | "built"): Record<string, string> {
    const out: Record<string, string> = {};
    for (const a of Array.from(el.attributes)) {
      if (ignore.has(a.name)) continue;
      out[a.name] = a.name === "class" ? classes(a.value) : a.name === "href" && side === "mockup" ? realHref(ruledLinkHref(el, a.value)) : a.value;
    }
    return out;
  }

  function differences(built: Element, ref: Element, path: string): string[] {
    if (built.tagName !== ref.tagName) return [`${path}: <${built.tagName.toLowerCase()}> instead of <${ref.tagName.toLowerCase()}>`];
    const out: string[] = [];
    const a = attributes(built, "built");
    const b = attributes(ref, "mockup");
    for (const name of [...new Set([...Object.keys(a), ...Object.keys(b)])].sort()) {
      if (a[name] !== b[name]) out.push(`${path} [${name}]: ${JSON.stringify(a[name])} instead of ${JSON.stringify(b[name])}`);
    }
    const x = children(built);
    const y = children(ref);
    if (x.length !== y.length) return [...out, `${path}: children [${x.map(say).join(", ")}] instead of [${y.map(say).join(", ")}]`];
    x.forEach((c, i) => {
      const r = y[i];
      if (typeof c === "string" || typeof r === "string") {
        if (c !== r) out.push(`${path} child ${i}: ${say(c)} instead of ${say(r)}`);
      } else out.push(...differences(c, r, `${path} > ${r.tagName.toLowerCase()}:nth(${i})`));
    });
    return out;
  }

  return (built, ref) => differences(built, ref, ref.tagName.toLowerCase());
}
