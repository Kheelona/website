/**
 * Test-only: the element comparison behind the shells' mockup parity tests (task 3.1). SiteShell.test.tsx compares the
 * marketing chrome with mockup/home.html, StoreShell.test.tsx the store chrome with mockup/store.html: tag, attributes,
 * classes (the mockup's `mk-` blocks ported as `ks-`), order and text, element by element. Pixel parity of the same
 * elements is test/e2e/chrome.spec.ts's. No production module imports this file; mockup-diff.test.ts proves it reports
 * each kind of difference, so neither parity test can pass on markup it no longer reads.
 */

export interface MockupDiffOptions {
  /** The mockup links its pages by file name (`safety.html`); this returns the build's link for one. */
  realHref: (href: string) => string;
  /** Attributes neither side is compared on: behaviour hooks and image sources. */
  ignore?: readonly string[];
  /** Class renames beyond the `mk-` to `ks-` port (mockup-css-mapping), applied before it. */
  renameClasses?: Readonly<Record<string, string>>;
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
export function mockupDiff(options: MockupDiffOptions): (built: Element, ref: Element) => string[] {
  const ignore = new Set(options.ignore ?? []);
  const drop = new Set(options.dropClasses ?? []);
  const renames = Object.entries(options.renameClasses ?? {});

  const classes = (value: string) =>
    value
      .split(/\s+/)
      .filter((c) => c !== "" && !drop.has(c))
      .map((c) => renames.find(([from]) => from === c)?.[1] ?? c)
      .map((c) => c.replace(/^mk-/, "ks-"))
      .sort()
      .join(" ");

  function attributes(el: Element, side: "mockup" | "built"): Record<string, string> {
    const out: Record<string, string> = {};
    for (const a of Array.from(el.attributes)) {
      if (ignore.has(a.name)) continue;
      out[a.name] = a.name === "class" ? classes(a.value) : a.name === "href" && side === "mockup" ? options.realHref(a.value) : a.value;
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

/**
 * Known content deviation, reported to the main session (task 3.1): seller.ts writes the phone link as
 * `[{nowrap:+91 91875 46483}](tel:…)`, which RichText renders as `<a><span class="ks-nowrap">…</span></a>`; the mockup
 * puts the class on the link (`{nowrap:[…](tel:…)}` in RichText's syntax). Both keep the number on one line. Until the
 * content owner swaps the two, the shells' parity tests read a link whose only child is a no-wrap span as the mockup's
 * link, on a copy of the built element.
 */
export function hoistNowrap(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  for (const span of Array.from(copy.querySelectorAll("a > span.ks-nowrap"))) {
    const link = span.parentElement!;
    if (link.childNodes.length !== 1) continue;
    link.classList.add("ks-nowrap");
    link.replaceChildren(...Array.from(span.childNodes));
  }
  return copy;
}
