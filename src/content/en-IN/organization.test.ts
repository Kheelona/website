import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { ROOT, readRepoFile } from "../../../test/e2e/support/repo";
import { DEFAULT_OG, organization, TEAM_BYLINE } from "./organization";
import { seller } from "./seller";

/* Organization and WebSite schema facts (architecture §6.1, §9.2; wiki/product/facts.md): the
 * company basics the site already states, the founder-confirmed profiles, and no `memberOf` until
 * each recognition's proof is filed (D038, F11). */

const team = new DOMParser().parseFromString(readRepoFile("mockup/team.html"), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();

describe("the organization", () => {
  it("is Kheelona, sold by the seller of record", () => {
    expect(organization.name).toBe("Kheelona");
    expect(organization.legalName).toBe(seller.legalName);
    expect(organization.address).toEqual(seller.address);
    expect(organization.country).toBe("IN");
  });

  it("points at stable files that exist (logo and default card, URLs kept)", () => {
    for (const path of [organization.logo, organization.image]) expect(existsSync(join(ROOT, "public", path)), path).toBe(true);
    expect(organization.logo).toBe("/brand/logo-mark.png");
  });

  it("lists only the five profiles the founder confirmed on 2026-09-05", () => {
    expect(organization.sameAs).toEqual([
      "https://www.linkedin.com/company/kheelona/",
      "https://www.instagram.com/kheelona/",
      "https://www.facebook.com/kheelona/",
      "https://play.google.com/store/apps/developer?id=Kheelona.com",
      "https://kheelona.ai",
    ]);
  });

  /* The node prints on every page (the site shell's graph), so it says what every page may: no GSTIN and no number
     (D063 items 2-3, D064 item 11; task Q2.3). */
  it("states no GSTIN (taxID): the website prints none", () => {
    expect(organization).not.toHaveProperty("taxId");
  });

  it("carries the support contact point from the seller block: WhatsApp and the email, no number (D032, D063 item 2)", () => {
    expect(organization.contactPoint).toEqual({
      email: seller.support.email,
      url: seller.support.whatsapp,
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    });
  });

  it("names the three founders exactly as the team page does, with their profiles", () => {
    const cards = Array.from(team.querySelectorAll(".mk-founder")).map((card) => ({
      name: norm(card.querySelector(".kh-card__title")?.textContent),
      role: norm(card.querySelector(".mk-founder__role")?.textContent),
      sameAs: card.querySelector('a[href^="https://www.linkedin.com/"]')?.getAttribute("href"),
    }));
    expect(organization.founders.map(({ name, role, sameAs }) => ({ name, role, sameAs }))).toEqual(cards);
    for (const f of organization.founders) expect(f.anchor).toMatch(/^[a-z]+(?:-[a-z]+)+$/);
  });

  it("states no recognition and no founder bio until its proof is filed (D038, F11)", () => {
    expect("memberOf" in organization).toBe(false);
    for (const f of organization.founders) expect("description" in f).toBe(false);
  });
});

describe("what every page by the team shares", () => {
  it("bylines a guide the team wrote together as the Kheelona team, never a person (stories.md)", () => {
    expect(TEAM_BYLINE).toBe("The Kheelona team");
  });

  it("shares the organization's default card, a file that exists, in the copy pages' words (home.md)", () => {
    expect(DEFAULT_OG.image).toBe(organization.image);
    expect(existsSync(join(ROOT, "public", DEFAULT_OG.image))).toBe(true);
    expect(DEFAULT_OG.alt).toBe("Kheelu by Kheelona: the cream plush rabbit with rainbow ears and a speaker in its tummy.");
  });
});
