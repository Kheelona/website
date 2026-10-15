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
import { parseRichText } from "@/lib/content/rich-text";
import { readRepoFile } from "../../../test/e2e/support/repo";
import { seller } from "./seller";

/* The seller block and the support chat (architecture §6.1; task 2.1 acceptance 2): the seller
 * strings equal the existing src/config/site.ts constants, which the store footer and the emails
 * already print; the visible lines equal the approved mockups, as D063 items 2-3 rule them (the
 * GSTIN off the website, the number only on /contact and the legal pages; task Q2.3); the chat
 * carries D050's number and three texts, never an order number. */

const doc = (slug: string) => new DOMParser().parseFromString(readRepoFile(`mockup/${slug}.html`), "text/html");
const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const home = doc("home");

/** The support number as a page prints it ("+91 91875 46483"), or a call link; never the wa.me address's digits, which
 *  stay everywhere. */
const PHONE = /91875\s46483|tel:/;

describe("the seller strings equal src/config/site.ts", () => {
  it("entity, address, support number, WhatsApp link and email", () => {
    expect(seller.legalName).toBe(LEGAL_ENTITY);
    expect(seller.address).toEqual(REGISTERED_ADDRESS);
    expect(seller.addressLine).toBe(REGISTERED_ADDRESS_LINE);
    expect(seller.support.phone).toBe(SUPPORT_WHATSAPP_DISPLAY);
    expect(seller.support.whatsapp).toBe(SUPPORT_WHATSAPP_HREF);
    expect(seller.support.email).toBe(CONTACT_EMAIL);
  });
});

describe("the GSTIN and the number on the website (D063 items 2-3, D064 item 11; task Q2.3)", () => {
  it("holds no GSTIN: the website prints none; src/config/site.ts keeps it for the receipts and invoices", () => {
    expect(seller).not.toHaveProperty("gstin");
    expect(JSON.stringify(seller)).not.toContain(GSTIN);
  });

  it("words every line a selling page or a footer prints without the number: WhatsApp and the email stay", () => {
    for (const [name, line] of [
      ["help line", seller.help.contact],
      ["store header's help line", seller.storeHelp.contact],
      ["footers' contact line", seller.support.footerLine],
      ["the WhatsApp-or-email phrase", seller.support.reach],
    ] as const) {
      expect(line, name).not.toMatch(PHONE);
      expect(line, name).toContain(SUPPORT_WHATSAPP_HREF);
    }
    expect(seller.support.footerLine).toContain(`mailto:${CONTACT_EMAIL}`);
    /* The officer's line names him by his email, as the D032 line always has; only the number comes off. */
    expect(seller.grievance.footerLine.text).not.toMatch(PHONE);
    expect(seller.grievance.footerLine.text).toContain("mailto:aman@kheelona.com");
  });

  it("says \"WhatsApp or email\" in one phrase where a sentence offers both (setup's close, two guides)", () => {
    expect(toPlainText(seller.support.reach)).toBe(`WhatsApp or email ${CONTACT_EMAIL}`);
    expect(seller.support.reach).toBe(`[WhatsApp](${SUPPORT_WHATSAPP_HREF}) or email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL})`);
  });

  it("keeps the number in the lines /contact and the legal pages print (E-Commerce Rules r.4(2)(d); ECOM-01, ECOM-02)", () => {
    expect(seller.support.line).toMatch(PHONE);
    expect(seller.grievance.line.text).toMatch(PHONE);
  });

  it("prints the store footer's grievance line as the D032 line without the number, word for word otherwise", () => {
    expect(seller.grievance.footerLine.lead).toBe(seller.grievance.line.lead);
    expect(toPlainText(seller.grievance.footerLine.text)).toBe(toPlainText(seller.grievance.line.text).replace(`, ${SUPPORT_WHATSAPP_DISPLAY}`, ""));
  });
});

describe("the visible lines equal the approved mockup", () => {
  it("prints the footer's seller lines as the mockup does, the GSTIN and the number off (partials/footer.html; D063)", () => {
    const lines = Array.from(home.querySelectorAll(".kh-footer__legal span")).map((s) => norm(s.textContent));
    expect(lines.slice(0, 4)).toEqual([toPlainText(seller.copyright), `GSTIN ${GSTIN}`, seller.addressLine, toPlainText(seller.support.line)]);
    expect([toPlainText(seller.copyright), seller.addressLine, toPlainText(seller.support.footerLine)]).toEqual([
      lines[0],
      lines[2],
      `WhatsApp · ${CONTACT_EMAIL}`,
    ]);
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

  it("prints the help line every CTA block prints (Home hero), the call off (D063 item 2)", () => {
    const help = norm(home.querySelector(".mk-help")?.textContent);
    expect(help).toBe("Questions? WhatsApp or call +91 91875 46483");
    expect(`${seller.help.lead} ${toPlainText(seller.help.contact)}`).toBe("Questions? WhatsApp us");
  });

  /* Task 3.6 item 7. Every no-wrap phone link of the approved mockup puts the no-wrap on the link itself
     (`<a href="tel:…" class="mk-nowrap">`, and never a no-wrap span inside a link), so the content wraps the whole link:
     `{nowrap:[…](tel:…)}`, which RichText renders as `<a class="ks-nowrap">`. */
  it("wraps each call link whole in a no-wrap, as every no-wrap phone link of the mockup is marked", () => {
    const mockupLinks = ["home", "contact", "store", "refund", "meet-kheelu"].flatMap((slug) => Array.from(doc(slug).querySelectorAll('a[href^="tel:"]')));
    expect(mockupLinks.length).toBeGreaterThan(0);
    for (const a of mockupLinks.filter((a) => a.querySelector(".mk-nowrap") || a.classList.contains("mk-nowrap"))) {
      expect(a.classList.contains("mk-nowrap"), a.outerHTML).toBe(true);
    }
    const callLinks = (source: string) =>
      parseRichText(source).flatMap((node) => (node.kind === "nowrap" ? node.children : [node])).filter((n) => n.kind === "link" && n.href.startsWith("tel:"));
    for (const [name, source] of [
      ["support line", seller.support.line],
      ["grievance line", seller.grievance.line.text],
    ] as const) {
      const nodes = parseRichText(source);
      const wrapped = nodes.filter((n) => n.kind === "nowrap" && n.children.length === 1 && n.children[0].kind === "link" && n.children[0].href.startsWith("tel:"));
      expect(wrapped, `${name}: ${source}`).toHaveLength(1);
      expect(callLinks(source), name).toHaveLength(1);
    }
  });

  /* The selling update (task Q2.12; the D2C plan v2 §1.1 and §10, CMO m9): one help line everywhere, so the store's
     header reads as every close's, "Questions?" in place of the mockup's "Need help?". */
  it("prints the store header's help line as every close's: the call off (D063 item 2), “Questions?” as its lead (CMO m9)", () => {
    const help = norm(doc("store").querySelector(".mk-store-head__help")?.textContent);
    expect(help).toBe("Need help? WhatsApp or call");
    expect(`${seller.storeHelp.lead} ${toPlainText(seller.storeHelp.contact)}`).toBe("Questions? WhatsApp us");
    expect(seller.storeHelp).toEqual(seller.help);
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

  it("is named for screen readers as D050 says, and its laptop label reads the same words (P13 default, WCAG 2.5.3)", () => {
    expect(seller.chat.label).toBe("Chat with us on WhatsApp");
    expect(seller.chat.shortLabel).toBe("Chat with us on WhatsApp");
    expect(seller.chat.label).toContain(seller.chat.shortLabel);
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
