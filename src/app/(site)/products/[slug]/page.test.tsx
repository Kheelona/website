import { readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { productSlugs } from "@/content/en-IN/products";
import { kheeluPage } from "@/content/en-IN/products/kheelu/page";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The product route (task 5.2; structure §3.1; architecture §5.4): one page per entry of the product registry, each its
 * page module through PageTemplate with the live offer, and Meta's ViewContent with the offer's headline (B9,
 * ADR-005). Every other slug stops at the router (dynamicParams = false), so /products/<unknown> is the real 404 and
 * never a thrown one (test/not-found-ssr.test.ts, lessons §1). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

const params = (slug: string) => ({ params: Promise.resolve({ slug }) });
const SOURCE = readFileSync("src/app/(site)/products/[slug]/page.tsx", "utf8");
const CODE = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

afterEach(() => {
  delete window.fbq;
});

describe("/products/[slug]", () => {
  it("prerenders exactly the products of the registry and refuses every other slug at the router", async () => {
    const mod = await import("./page");
    expect(mod.generateStaticParams()).toEqual(productSlugs.map((slug) => ({ slug })));
    expect(mod.generateStaticParams()).toEqual([{ slug: "kheelu" }]);
    expect(mod.dynamicParams).toBe(false);
    expect(SOURCE).toMatch(/^export const dynamicParams = false;$/m);
  });

  it("revalidates like every page that shows a price (ADR-005)", async () => {
    expect((await import("./page")).revalidate).toBe(300);
  });

  it("never throws a 404 (a thrown notFound() renders a blank page on the server, lessons §1)", () => {
    expect(CODE).not.toMatch(/\bnotFound\b/);
  });

  it.each(["token", "full"] as const)("takes the page's metadata from its module, in the live mode (%s)", async (mode) => {
    const offer = buildOffer(mode);
    getOffer.mockResolvedValue(offer);
    const { generateMetadata } = await import("./page");
    expect(await generateMetadata(params("kheelu"))).toEqual(pageMeta({ ...kheeluPage.meta, path: "/products/kheelu", offer }));
  });

  it.each(["token", "full"] as const)("renders the page module through the template with the live offer (%s mode)", async (mode) => {
    const offer = buildOffer(mode);
    getOffer.mockResolvedValue(offer);
    const { default: ProductPage } = await import("./page");
    const html = renderToStaticMarkup(<>{await ProductPage(params("kheelu"))}</>);
    expect(html).toBe(renderToStaticMarkup(<PageTemplate page={kheeluPage} offer={offer} path="/products/kheelu" />));
    expect(getOffer).toHaveBeenCalled();
  });

  it.each([
    ["token", 4999],
    ["full", 7999],
  ] as const)("reports Meta's ViewContent once, with the offer's headline as its value (%s mode: %i)", async (mode, value) => {
    getOffer.mockResolvedValue(buildOffer(mode));
    const fbq = vi.fn();
    window.fbq = fbq;
    const { default: ProductPage } = await import("./page");
    render(await ProductPage(params("kheelu")));
    const views = fbq.mock.calls.filter((call) => call[1] === "ViewContent");
    expect(views).toHaveLength(1);
    expect(views[0][2]).toEqual({ content_name: "Kheelu", content_ids: ["lumi"], content_type: "product", value, currency: "INR" });
  });

  it("is thin: no copy, price or address typed in the route file (structure §3.1)", () => {
    const code = CODE.replace(/^import [^;]*;$/gm, "");
    expect([...code.matchAll(/"([^"]*)"|`([^`]*)`/g)].map((m) => m[1] ?? m[2]).filter((s) => !s.includes("${"))).toEqual([]);
    expect(code).not.toMatch(/₹|https?:/);
  });
});
