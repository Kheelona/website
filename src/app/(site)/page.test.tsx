import { existsSync } from "node:fs";
import { join } from "node:path";
import { render } from "@testing-library/react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { homePage } from "@/content/en-IN/pages/home";
import type { OfferMode } from "@/content/types";
import { PageTemplate } from "@/layouts/PageTemplate/PageTemplate";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";

/* The Home route (task 5.1; structure §3.1): thin. It loads the page's content module and the live offer (ADR-005),
 * describes the page through pageMeta, renders PageTemplate, and reports Meta ViewContent on load with the offer's
 * headline, the product page's payload (architecture §8.2, B9). */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));

type HomeRoute = {
  default: () => Promise<ReactNode>;
  generateMetadata: () => Promise<Metadata>;
  revalidate: number;
};

async function route(mode: OfferMode): Promise<HomeRoute> {
  getOffer.mockResolvedValue(buildOffer(mode));
  return (await import("./page")) as unknown as HomeRoute;
}

const win = window as unknown as { fbq?: (...args: unknown[]) => void };
afterEach(() => {
  delete win.fbq;
});

describe("the Home route", () => {
  it("revalidates like every page that shows a price (ADR-005: the offer follows the live mode)", async () => {
    expect((await route("token")).revalidate).toBe(300);
  });

  it.each(["token", "full"] as const)("describes the page from its content module, in the live mode (%s)", async (mode) => {
    const { generateMetadata } = await route(mode);
    expect(await generateMetadata()).toEqual(pageMeta({ ...homePage.meta, path: "/", offer: buildOffer(mode) }));
  });

  it.each(["token", "full"] as const)("gives search and share tools the whole card: canonical, Open Graph, Twitter, never robots (%s; SPA 5)", async (mode) => {
    const meta = await (await route(mode)).generateMetadata();
    const title = "Kheelu by Kheelona: a screen-free plush toy that talks";
    const description = meta.description as string;
    expect(meta.title).toEqual({ absolute: title });
    expect(title.length).toBeLessThanOrEqual(60);
    expect(description.length).toBeLessThanOrEqual(155);
    // The total first (D028), with no GST note since the selling update (D065 item 3; the D2C plan v2 §2, Home's meta).
    expect(description).toMatch(/^Kheelu by Kheelona: .*₹(4,999|7,999) in total/);
    expect(description).not.toMatch(/GST/);
    expect(meta.alternates).toEqual({ canonical: "/" });
    const image = { url: "/og/kheelu.jpg", alt: "Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy." };
    expect(meta.openGraph).toEqual({
      type: "website",
      url: "/",
      title,
      description,
      siteName: "Kheelona",
      locale: "en_IN",
      images: [{ ...image, width: 1200, height: 630 }],
    });
    expect(meta.twitter).toEqual({ card: "summary_large_image", title, description, images: [image] });
    expect(existsSync(join(process.cwd(), "public", image.url))).toBe(true);
    expect(meta).not.toHaveProperty("robots");
  });

  it.each(["token", "full"] as const)("renders the page module through PageTemplate with the live offer (%s)", async (mode) => {
    const { default: HomePage } = await route(mode);
    expect(renderToStaticMarkup(<>{await HomePage()}</>)).toBe(renderToStaticMarkup(<PageTemplate page={homePage} offer={buildOffer(mode)} path="/" />));
  });

  it.each([
    ["token", 4999],
    ["full", 7999],
  ] as const)("reports Meta ViewContent once on load, valued at the offer's headline (%s mode; B9)", async (mode, value) => {
    const fbq = vi.fn();
    win.fbq = fbq;
    const { default: HomePage } = await route(mode);
    render(<>{await HomePage()}</>);
    expect(fbq.mock.calls.filter((call) => call[1] === "ViewContent")).toEqual([
      ["track", "ViewContent", { content_name: "Kheelu", content_ids: ["lumi"], content_type: "product", value, currency: "INR" }, undefined],
    ]);
  });
});
