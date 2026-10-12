import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Test support for the task 3.4 section tests (never shipped: nothing in the app imports it). It reads one element of
 * an approved mockup page as built (mockup/<slug>.html, icons inlined; the Gate A reference, D046) and reduces any
 * element to a skeleton, so a test can assert that a section renders the mockup's markup: same elements, same classes
 * (the mockup's own prefix renamed to ks-, components §7), same ARIA, ids and addresses (a mockup page read as its
 * route), same order (SCA 1). Text is compared apart with `words`. Tests run from the repository root.
 */

const PREFIX = "m" + "k-";

/** One element of a built mockup page. Throws when the selector finds nothing. */
export function mockupFold(slug: string, selector: string, index = 0): Element {
  const html = readFileSync(join(process.cwd(), "mockup", `${slug}.html`), "utf8");
  const doc = new DOMParser().parseFromString(html, "text/html");
  const found = doc.querySelectorAll(selector)[index];
  if (!found) throw new Error(`mockup/${slug}.html: no element matches ${selector} (#${index})`);
  return found;
}

export interface SkeletonOptions {
  /** Mockup class names (without the prefix) the build renamed: `{ guides: "ks-topic__guides" }`; "" drops one. */
  rename?: Readonly<Record<string, string>>;
  /** Classes left out on either side: what the build adds that the mockup does not carry (type steps, list reset). */
  drop?: RegExp;
  /** Subtrees left out (a selector): the mockup's hidden tab list, a gated block. */
  skip?: string;
  /** Elements replaced by their children (a selector): an inner span the build adds. */
  unwrap?: string;
}

const ARIA = ["role", "aria-hidden", "aria-label", "aria-labelledby", "aria-current", "id", "href", "alt"] as const;

/** A mockup page address read as the route it became (structure §5): `home.html` is `/`, `meet-kheelu.html` the
 *  product page, `story-<slug>.html` the article `/stories/<slug>`, any other `<page>.html` `/<page>`; a fragment is
 *  kept. Anything else (a fragment, tel:, mailto:, https:, a route the build wrote) is kept as it is. */
function route(href: string): string {
  const match = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  if (!match) return href;
  const [, page, fragment = ""] = match;
  const path =
    page === "home" ? "/" : page === "meet-kheelu" ? "/products/kheelu" : page.startsWith("story-") ? `/stories/${page.slice("story-".length)}` : `/${page}`;
  return path + fragment;
}

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
      return `[${name}=${route(value)}]`;
    case "aria-labelledby":
      return `[${name}=${references(el).map((id) => (labels.lineOf.has(id) ? `@${labels.lineOf.get(id)}` : id)).join(" ")}]`;
    case "id":
      return labels.labelOnly.has(value) ? `[${name}]` : `[${name}=${value}]`;
    default:
      return `[${name}=${value}]`;
  }
}

function className(name: string, options: SkeletonOptions): string {
  if (!name.startsWith(PREFIX)) return name;
  const bare = name.slice(PREFIX.length);
  return options.rename?.[bare] ?? `ks-${bare}`;
}

function line(el: Element, options: SkeletonOptions, labels: Labels): string {
  const classes = [...el.classList]
    .map((c) => className(c, options))
    .filter((c) => c !== "" && !options.drop?.test(c))
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
