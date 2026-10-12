import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Test support for the task 3.4 section tests (never shipped: nothing in the app imports it). It reads one element of
 * an approved mockup page as built (mockup/<slug>.html, icons inlined; the Gate A reference, D046) and reduces any
 * element to a skeleton, so a test can assert that a section renders the mockup's markup: same elements, same classes
 * (the mockup's own prefix renamed to ks-, components §7), same ARIA, same order (SCA 1). Text is compared apart with
 * `words`. Tests run from the repository root.
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
/** Attributes whose value is compared; the others only by presence (ids and addresses differ between mockup and build;
 *  aria-hidden is always "true" where it is set). */
const BY_VALUE = new Set(["role", "aria-label", "aria-current", "alt"]);

function className(name: string, options: SkeletonOptions): string {
  if (!name.startsWith(PREFIX)) return name;
  const bare = name.slice(PREFIX.length);
  return options.rename?.[bare] ?? `ks-${bare}`;
}

function line(el: Element, options: SkeletonOptions): string {
  const classes = [...el.classList]
    .map((c) => className(c, options))
    .filter((c) => c !== "" && !options.drop?.test(c))
    .sort();
  const attrs = ARIA.filter((a) => el.hasAttribute(a))
    .map((a) => (BY_VALUE.has(a) ? `[${a}=${el.getAttribute(a)}]` : `[${a}]`))
    .join("");
  return `${el.tagName.toLowerCase()}${classes.map((c) => `.${c}`).join("")}${attrs}`;
}

function walk(el: Element, depth: number, options: SkeletonOptions, out: string[]): void {
  if (options.skip && el.matches(options.skip)) return;
  if (options.unwrap && el.matches(options.unwrap)) {
    for (const child of el.children) walk(child, depth, options, out);
    return;
  }
  out.push(`${"  ".repeat(depth)}${line(el, options)}`);
  if (el.tagName.toLowerCase() === "svg") return;
  for (const child of el.children) walk(child, depth + 1, options, out);
}

/** The element's tree as lines: tag, sorted classes, ARIA; two spaces per level; an svg's inside left out. */
export function skeleton(el: Element, options: SkeletonOptions = {}): string {
  const out: string[] = [];
  walk(el, 0, options, out);
  return out.join("\n");
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
