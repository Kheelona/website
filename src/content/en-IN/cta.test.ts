import { describe, expect, it } from "vitest";
import { ICON_PATHS } from "@/assets/icons.generated";
import { PREORDER_LABEL } from "@/config/site";
import { CTAS } from "@/lib/tracking/cta";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { MOCKUP_SLUGS } from "../../../test/e2e/support/mockup-text";
import { cta } from "./cta";

/* CTA copy (architecture §6.1; D041): the one label on every chilli button and the labelled
 * secondary links, each keyed by its registered tracking value (architecture §8.3), with the
 * label and destination the approved mockup gives it. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const sitePath = (href: string) =>
  `/${href.replace(/\.html/, "").replace(/^home$/, "").replace(/^meet-kheelu/, "products/kheelu")}`;

describe("the one label (D041)", () => {
  it("is the checkout's own constant", () => {
    expect(cta.preorder).toBe(PREORDER_LABEL);
    expect(cta.preorder).toBe("Pre-order Kheelu");
  });

  it("is what every chilli button in the approved mockups says", () => {
    let buttons = 0;
    for (const slug of MOCKUP_SLUGS) {
      for (const button of Array.from(doc(slug).querySelectorAll("a.kh-btn--cta"))) {
        buttons += 1;
        expect(norm(button.textContent), slug).toBe(cta.preorder);
      }
    }
    expect(buttons).toBeGreaterThan(20);
  });
});

describe("the secondary links", () => {
  const tagged = MOCKUP_SLUGS.flatMap((slug) =>
    Array.from(doc(slug).querySelectorAll("a[data-ph-capture-attribute-cta]")).map((a) => ({ slug, a })),
  );

  it("are keyed by registered secondary values only", () => {
    for (const id of Object.keys(cta.secondary)) expect(CTAS[id as keyof typeof CTAS]?.role, id).toBe("secondary");
  });

  it("cover every secondary value the mockups carry", () => {
    const values = new Set(
      tagged.map(({ a }) => a.getAttribute("data-ph-capture-attribute-cta")!).filter((v) => CTAS[v as keyof typeof CTAS]?.role === "secondary"),
    );
    expect(Object.keys(cta.secondary).sort()).toEqual([...values].sort());
  });

  it("carry the mockup's label, destination and icons (leading `icon`, trailing `iconEnd`)", () => {
    const iconOf = (svg: Element | null | undefined) => {
      const d = Array.from(svg?.querySelectorAll("path") ?? []).map((p) => p.getAttribute("d")).join("");
      return (Object.keys(ICON_PATHS) as (keyof typeof ICON_PATHS)[]).find((name) => ICON_PATHS[name] === d);
    };
    for (const [id, link] of Object.entries(cta.secondary)) {
      const found = tagged.filter(({ a }) => a.getAttribute("data-ph-capture-attribute-cta") === id);
      expect(found.length, id).toBeGreaterThan(0);
      for (const { slug, a } of found) {
        expect(norm(a.textContent), `${slug} ${id}`).toBe(link.label);
        expect(sitePath(a.getAttribute("href") ?? ""), `${slug} ${id}`).toBe(link.href);
        expect(link.cta).toBe(id);
        const first = a.firstElementChild;
        const last = a.lastElementChild;
        expect("icon" in link ? link.icon : undefined, `${slug} ${id} icon`).toBe(first?.tagName === "svg" ? iconOf(first) : undefined);
        expect("iconEnd" in link ? link.iconEnd : undefined, `${slug} ${id} iconEnd`).toBe(
          last?.tagName === "svg" ? iconOf(last) : undefined,
        );
      }
    }
  });
});
