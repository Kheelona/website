import { readFileSync } from "node:fs";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { StoreShell } from "./StoreShell";

/* StoreShell (task 3.1; architecture §16.1, structure §3.1): the store host's shell, rendered by src/app/store/layout.tsx:
 * the skip link, the store header, the page in <main id="main">, the store footer, compared element by element with
 * the approved store mockup (mockup/store.html, shared with store-confirmation.html). Each store page renders its own
 * WhatsApp bubble (a layout cannot know its page, D050), so the shell has none. */

const mockup = new DOMParser().parseFromString(readFileSync("mockup/store.html", "utf8"), "text/html");

/** The mockup links the marketing pages by file name; the store links them on the marketing origin of this build. */
function realHref(href: string): string {
  if (href === "home.html") return MARKETING_ORIGIN;
  const page = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  return page ? `${MARKETING_ORIGIN}/${page[1]}${page[2] ?? ""}` : href;
}

function attributes(el: Element, side: "mockup" | "built"): Record<string, string> {
  const out: Record<string, string> = {};
  for (const a of Array.from(el.attributes)) {
    if (a.name === "src" || a.name === "width") continue;
    let value = a.value;
    if (a.name === "class") {
      // mk- blocks are ported as ks-; the address's mk-seller is ks-store-foot__seller (mockup-css-mapping §6.2).
      value = value.replace(/\bmk-seller\b/, "ks-store-foot__seller").replace(/\bmk-/g, "ks-").split(/\s+/).sort().join(" ");
    }
    if (a.name === "href" && side === "mockup") value = realHref(value);
    out[a.name] = value;
  }
  return out;
}

function children(el: Element): Array<Element | string> {
  const out: Array<Element | string> = [];
  for (const node of Array.from(el.childNodes)) {
    const text = node.nodeType === 3 || (node instanceof Element && node.hasAttribute("data-src")) ? (node.textContent ?? "") : null;
    if (text !== null) {
      if (typeof out[out.length - 1] === "string") out[out.length - 1] += text;
      else out.push(text);
    } else if (node instanceof Element) out.push(node);
  }
  return out
    .map((c) => (typeof c === "string" ? c.replace(/\s+/g, " ").trim() : c))
    .filter((c) => c !== "");
}

/** Same reading of the known seller.ts phone-link markup as SiteShell.test.tsx (reported to the main session). */
function hoistNowrap(el: Element): Element {
  const copy = el.cloneNode(true) as Element;
  for (const span of Array.from(copy.querySelectorAll("a > span.ks-nowrap"))) {
    const link = span.parentElement!;
    if (link.childNodes.length !== 1) continue;
    link.classList.add("ks-nowrap");
    link.replaceChildren(...Array.from(span.childNodes));
  }
  return copy;
}

function differences(built: Element, ref: Element, path = ref.tagName.toLowerCase()): string[] {
  if (built.tagName !== ref.tagName) return [`${path}: <${built.tagName.toLowerCase()}> instead of <${ref.tagName.toLowerCase()}>`];
  const out: string[] = [];
  const a = attributes(built, "built");
  const b = attributes(ref, "mockup");
  for (const name of new Set([...Object.keys(a), ...Object.keys(b)])) {
    if (a[name] !== b[name]) out.push(`${path} [${name}]: ${JSON.stringify(a[name])} instead of ${JSON.stringify(b[name])}`);
  }
  const say = (v: Element | string) => (typeof v === "string" ? JSON.stringify(v) : `<${v.tagName.toLowerCase()}>`);
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

function shell() {
  return render(
    <StoreShell>
      <p>store page</p>
    </StoreShell>,
  );
}

describe("StoreShell: the store chrome equals the approved mockup's (mockup/store.html)", () => {
  it("skip link", () => {
    const { container } = shell();
    expect(differences(container.querySelector(".ks-skip")!, mockup.querySelector(".mk-skip")!)).toEqual([]);
  });

  it("store header", () => {
    const { container } = shell();
    expect(differences(container.querySelector("header.ks-store-head")!, mockup.querySelector("header.mk-store-head")!)).toEqual([]);
  });

  it("store footer, but for the payments line (held back: see the test below)", () => {
    const { container } = shell();
    const ref = mockup.querySelector("footer.mk-store-foot")!.cloneNode(true) as Element;
    const payments = Array.from(ref.querySelectorAll("p.kh-body-s")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))!;
    payments.remove();
    expect(differences(hoistNowrap(container.querySelector("footer.ks-store-foot")!), ref)).toEqual([]);
  });

  it("holds back the payments line, whose chargeback link the frozen store-layout contract does not list", () => {
    /* test/guards/fixtures/checkout-contract/store-layout.json (never edited) pins the store layout's policy links to
       exactly five; the mockup's "How to raise a chargeback with your bank" (refund#chargeback) would be a sixth. Held
       for the main session's ruling (task 3.1 report); StoreFooter takes the line through its `payments` prop. */
    const { container } = shell();
    expect(container.textContent).not.toContain("Payments by Razorpay");
    expect(container.querySelector('a[href*="#chargeback"]')).toBeNull();
  });

  it("keeps the order: skip link, header, main, footer, and adds no bubble and no site navigation", () => {
    const { container } = shell();
    expect(Array.from(container.children).map((el) => el.tagName.toLowerCase() + (el.className ? `.${el.className.split(" ")[0]}` : ""))).toEqual([
      "a.kh-btn",
      "header.kh-nav",
      "main",
      "footer.kh-footer",
    ]);
    expect(container.querySelector(".ks-wa")).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull();
  });

  it("puts the page in <main id=\"main\">", () => {
    shell();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("main")).toHaveTextContent("store page");
  });

  it("links the policies to the marketing site of this build (MARKETING_ORIGIN: the beta site on beta)", () => {
    shell();
    const hrefs = within(screen.getByRole("navigation", { name: "Policies" }))
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["terms", "refund", "shipping", "privacy", "contact"].map((p) => `${MARKETING_ORIGIN}/${p}`));
  });
});
