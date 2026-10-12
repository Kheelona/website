import { describe, expect, it } from "vitest";
import { product as kheelu } from "./kheelu/product";
import { getProduct, productSlugs, products } from "./index";

/* The product registry (architecture §5.4; structure §3.1): `products/[slug]` builds one page per
 * entry (generateStaticParams, dynamicParams = false), so a new product is a module plus one line. */

describe("the product registry", () => {
  it("holds Kheelu, keyed by its own slug", () => {
    expect(products).toEqual({ kheelu });
    for (const [slug, p] of Object.entries(products)) expect(p.slug).toBe(slug);
  });

  it("lists the slugs the product route builds", () => {
    expect(productSlugs).toEqual(["kheelu"]);
  });

  it("finds a product by slug and nothing else", () => {
    expect(getProduct("kheelu")).toBe(kheelu);
    expect(getProduct("lumi")).toBeUndefined();
    expect(getProduct("toString")).toBeUndefined();
  });
});
