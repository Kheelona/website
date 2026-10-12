import { describe, expect, it } from "vitest";
import {
  CONTACT_EMAIL,
  GSTIN,
  LEGAL_ENTITY,
  REGISTERED_ADDRESS,
  REGISTERED_ADDRESS_LINE,
  SUPPORT_WHATSAPP_DISPLAY,
  SUPPORT_WHATSAPP_HREF,
} from "@/config/site";
import { toPlainText } from "@/lib/content/plain-text";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { seller } from "./seller";

/* The seller block and the support chat (architecture §6.1; task 2.1 acceptance 2): the seller
 * strings equal the existing src/config/site.ts constants, which the store footer and the emails
 * already print; the visible lines equal the approved mockups; the chat carries D050's number and
 * three texts, never an order number. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const home = doc("home");

describe("the seller strings equal src/config/site.ts", () => {
  it("entity, GSTIN, address, support number, WhatsApp link and email", () => {
    expect(seller.legalName).toBe(LEGAL_ENTITY);
    expect(seller.gstin).toBe(GSTIN);
    expect(seller.address).toEqual(REGISTERED_ADDRESS);
    expect(seller.addressLine).toBe(REGISTERED_ADDRESS_LINE);
    expect(seller.support.phone).toBe(SUPPORT_WHATSAPP_DISPLAY);
    expect(seller.support.whatsapp).toBe(SUPPORT_WHATSAPP_HREF);
    expect(seller.support.email).toBe(CONTACT_EMAIL);
  });
});

describe("the visible lines equal the approved mockup", () => {
  it("prints the footer's four seller lines exactly (partials/footer.html)", () => {
    const lines = Array.from(home.querySelectorAll(".kh-footer__legal span")).map((s) => norm(s.textContent));
    expect([
      toPlainText(seller.copyright),
      `GSTIN ${seller.gstin}`,
      seller.addressLine,
      toPlainText(seller.support.line),
    ]).toEqual(lines.slice(0, 4));
  });

  it("prints the D032 grievance line verbatim, as the contact and store pages do", () => {
    const line = `${toPlainText(seller.grievance.line.lead)} ${toPlainText(seller.grievance.line.text)}`;
    expect(line).toBe(
      "Grievance Officer: Aman Soni, Co-Founder and CTO, aman@kheelona.com, +91 91875 46483. We acknowledge every complaint within 48 hours and resolve it within one month of receiving it.",
    );
    for (const slug of ["contact", "store", "refund", "terms", "privacy"]) {
      expect(norm(doc(slug).body.textContent), slug).toContain(line);
    }
  });

  it("names the grievance officer on the support line, which takes calls (D029, D032)", () => {
    expect(seller.grievance).toMatchObject({ name: "Aman Soni", role: "Co-Founder and CTO", email: "aman@kheelona.com" });
    expect(seller.grievance.phone).toBe(seller.support.phone);
    expect(toPlainText(seller.support.line)).toContain("(WhatsApp or call)");
  });

  it("prints the help line exactly as every CTA block does (Home hero)", () => {
    const help = norm(home.querySelector(".mk-help")?.textContent);
    expect(`${seller.help.lead} ${toPlainText(seller.help.contact)}`).toBe(help);
    expect(help).toBe("Questions? WhatsApp or call +91 91875 46483");
  });

  it("prints the store header's help line exactly (store.html)", () => {
    const help = norm(doc("store").querySelector(".mk-store-head__help")?.textContent);
    expect(`${seller.storeHelp.lead} ${toPlainText(seller.storeHelp.contact)}`).toBe(help);
  });

  it("states the manufacturer and origin as the product page's declarations do (D034)", () => {
    const rows = Array.from(doc("meet-kheelu").querySelectorAll(".mk-declare div")).map((row) => [
      norm(row.querySelector("dt")?.textContent),
      norm(row.querySelector("dd")?.textContent),
    ]);
    expect(rows).toContainEqual(["Manufacturer", seller.manufacturer]);
    expect(rows).toContainEqual(["Country of origin", seller.origin.country]);
    expect(seller.origin.countryCode).toBe("IN");
    expect(seller.origin.line).toBe("Made in India");
  });
});

describe("the support chat (D050)", () => {
  it("opens WhatsApp on the support number", () => {
    expect(seller.chat.number).toBe("919187546483");
    expect(`https://wa.me/${seller.chat.number}`).toBe(SUPPORT_WHATSAPP_HREF);
  });

  it("is named for screen readers and on laptops exactly as D050 says", () => {
    expect(seller.chat.label).toBe("Chat with us on WhatsApp");
    expect(seller.chat.shortLabel).toBe("Chat on WhatsApp");
  });

  it("carries the three pre-filled texts, one per context", () => {
    expect(seller.chat.texts).toEqual({
      site: "Hi Kheelona! I have a question about Kheelu.",
      store: "Hi Kheelona! I need help with my pre-order.",
      thanks: "Hi Kheelona! I have a question about my order.",
    });
  });

  it("never carries an order number or any personal data", () => {
    for (const text of Object.values(seller.chat.texts)) {
      expect(text).not.toMatch(/\d|\{|@/);
    }
  });
});
