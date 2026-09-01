import { describe, expect, it } from "vitest";
import { META_PIXEL_HOSTS, META_PIXEL_ID, GA4_HOSTS } from "@/config/site";
import { shouldLoadMetaPixel } from "./MetaPixel";

/** The whole risk of hardcoding a pixel ID sits in this predicate, and it is a
 *  sharper risk than GA4's. A stray page view from a preview deploy does not
 *  just dirty a report: it joins a retargeting audience and feeds the
 *  conversion signal Meta optimises real ad spend against. So it is tested
 *  directly rather than through a render. */
describe("shouldLoadMetaPixel", () => {
  it("loads on the production hosts, including the store", () => {
    expect(shouldLoadMetaPixel("kheelona.com")).toBe(true);
    expect(shouldLoadMetaPixel("www.kheelona.com")).toBe(true);
    // the store is where Purchase fires, so it must be in the list
    expect(shouldLoadMetaPixel("store.kheelona.com")).toBe(true);
  });

  it("does NOT load on localhost", () => {
    expect(shouldLoadMetaPixel("localhost")).toBe(false);
    expect(shouldLoadMetaPixel("127.0.0.1")).toBe(false);
    expect(shouldLoadMetaPixel("store.localhost")).toBe(false);
  });

  it("does NOT load on Vercel preview hosts", () => {
    expect(shouldLoadMetaPixel("website-hdn2.vercel.app")).toBe(false);
    expect(shouldLoadMetaPixel("website-git-demo-website-kheelona.vercel.app")).toBe(false);
  });

  it("does NOT load on the sister site or a lookalike domain", () => {
    expect(shouldLoadMetaPixel("kheelona.ai")).toBe(false);
    expect(shouldLoadMetaPixel("kheelona.com.evil.example")).toBe(false);
    expect(shouldLoadMetaPixel("notkheelona.com")).toBe(false);
  });

  it("is case-insensitive, because hostnames are", () => {
    expect(shouldLoadMetaPixel("Kheelona.com")).toBe(true);
    expect(shouldLoadMetaPixel("STORE.KHEELONA.COM")).toBe(true);
  });
});

describe("the Meta Pixel constants", () => {
  it("holds a pixel ID in Meta's shape: a bare numeric string", () => {
    expect(META_PIXEL_ID).toMatch(/^\d{15,16}$/);
  });

  /* The two lists are one list on purpose (see config/site.ts). If someone ever
     copies rather than references it, this fails and says why. */
  it("measures exactly the hosts GA4 measures", () => {
    expect([...META_PIXEL_HOSTS]).toEqual([...GA4_HOSTS]);
  });

  it("never names a preview or local host", () => {
    for (const host of META_PIXEL_HOSTS) {
      expect(host).not.toMatch(/localhost|127\.0\.0\.1|vercel\.app/);
    }
  });
});
