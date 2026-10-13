import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/seo/metadata";
import { readRepoBytes, readRepoFile, tagText } from "../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../organization";
import { eventPage } from "./event-page";
import { partnerPage } from "./partner-page";

/* The partner page's words, store.kheelona.com/ideabaaz (task 6.1; structure §5 row "(no mockup)"; checkout.md
 * "Variants"). The Ideabaaz exclusive ended on 31 August 2026, so its ended state is the page parents meet: its words
 * are the live page's, read at the freeze tag. Its checkout and its not-configured state are the event page's, and the
 * Ideabaaz lockup stays (B29: printed QR codes point here). */

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const live = norm(tagText("src/app/store/ideabaaz/page.tsx"));

describe("partner page: the ended state (as live)", () => {
  it('keeps "The Ideabaaz exclusive has ended." and both reasons, word for word', () => {
    const { ended } = partnerPage;
    expect(ended.title).toBe("The Ideabaaz exclusive has ended.");
    expect(live).toContain(`title = "${ended.title}"`);
    expect(live).toContain(`"${ended.full}"`);
    expect(live).toContain(`"${ended.closed}"`);
    expect(ended.full).toBe("The Ideabaaz allocation has all gone. You can still pre-order Kheelu at the usual price.");
  });

  it("offers the usual price and a person, in the event page's refusal words (the same two ways on, as live)", () => {
    const { ended } = partnerPage;
    expect(live).toContain(`> ${ended.action} </a>`);
    expect(live).toContain(`</a>{" "} ${ended.help.tail}`);
    expect(ended.action).toBe(eventPage.refused.action);
    expect(ended.help).toBe(eventPage.refused.help);
    expect(ended.titleId).toBe("store-title");
  });
});

describe("partner page: the rest is the event page's", () => {
  it("its checkout (the store's folds) and its not-configured state", () => {
    expect(partnerPage.checkout).toBe(eventPage.checkout);
    expect(partnerPage.notConfigured).toBe(eventPage.notConfigured);
    expect(partnerPage.notConfigured.title).toBe("Pre-orders open here shortly.");
  });
});

describe("partner page: the Ideabaaz lockup (B29; assets.md)", () => {
  it("is the live file at its stable URL, with its real size and the live alt", () => {
    const { logo } = partnerPage;
    expect(logo.src).toBe("/partners/ideabaaz-startup-fest.png");
    expect(logo.alt).toBe("Ideabaaz Startup Fest");
    expect(live).toContain(`src="${logo.src}" alt="${logo.alt}"`);
    // The PNG's own width and height (IHDR, bytes 16-23), so the box is reserved at the file's ratio.
    const png = readRepoBytes(`public${logo.src}`);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([logo.width, logo.height]);
  });
});

describe("partner page: meta", () => {
  it("the live title with the brand, and the ended state as its description", () => {
    expect(live).toContain('title: "Ideabaaz exclusive pre-order"');
    expect(partnerPage.meta.title).toBe("Ideabaaz exclusive pre-order · Kheelona");
    expect(partnerPage.meta.description).toBe(
      "The Ideabaaz exclusive has ended. You can still pre-order Kheelu at the usual price.",
    );
    expect(partnerPage.meta.og).toBe(DEFAULT_OG);
    const built = pageMeta({ ...partnerPage.meta, path: "/ideabaaz" });
    expect((built.title as { absolute: string }).absolute.length).toBeLessThanOrEqual(60);
    expect(String(built.description).length).toBeLessThanOrEqual(155);
  });
});

describe("partner page module: source", () => {
  // The words, comments aside (the module's notes may name the date the exclusive ended).
  const source = readRepoFile("src/content/en-IN/store/partner-page.ts").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");

  it("types no amount and no date: the exclusive's amount and expiry are the database row's, never the page's", () => {
    expect(source).not.toMatch(/₹|Rs\.? ?\d|\b99\b|31 August|wa\.me/);
  });
});
