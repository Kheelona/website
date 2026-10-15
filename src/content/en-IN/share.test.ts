import { describe, expect, it } from "vitest";
import { WHATSAPP_SHARE_HREF, WHATSAPP_SHARE_LABEL } from "@/config/site";
import { buildOffer } from "@/lib/offer/offer";
import { toPlainText } from "@/lib/content/plain-text";
import { findBanned } from "../../../test/guards/banned-phrases.data";
import { readRepoFile } from "../../../test/e2e/support/repo";
import * as utm from "../../../tools/utm/build-link.mjs";
import { share } from "./share";

/* The "Share Kheelu on WhatsApp" link under the offer cards (task 8c.2; D061, the main session's ruling on the share
 * link; tracking inventory §6). The label is the live site's (WHATSAPP_SHARE_LABEL, reused); the message is new, because
 * the old one said "talking friend that teaches" and "first 500", and the founder signed its price clause (D066 item 2,
 * the D2C plan v2 §1.7). It leads with the total "in total", without GST (D028, as for ad text), states the advance as
 * refundable (DARK-03), and ends with kheelona.com tagged as the campaign conventions say (docs/utm-conventions.md,
 * tools/utm/build-link.mjs). */

/* The tool is plain JavaScript that `allowJs` types from its code (test/utm.test.ts does the same). */
type UtmInput = { source: string; medium: string; campaign: string; path?: string; content?: string; term?: string };
const buildUtmUrl = utm.buildUtmUrl as (input: UtmInput) => string;

const ADDRESS = "https://kheelona.com/?utm_source=whatsapp&utm_medium=referral&utm_campaign=2026-10-share";
/* The founder's words (D066 item 2; the D2C plan v2 §1.7): the total first, "in total", without "incl. GST"; in token
   mode the advance after it, refundable. */
const MESSAGE = {
  token:
    "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. ₹4,999 in total; ₹499 today reserves yours, refundable.",
  full: "Kheelu is a screen-free talking toy for children aged 3 to 7. It answers every why, then asks one back. ₹7,999 in total, paid in full when you order.",
} as const;

/** The words WhatsApp opens with: the `text` parameter of the share link, decoded. */
const sent = (href: string) => {
  const url = new URL(href);
  expect(`${url.origin}${url.pathname}`).toBe("https://wa.me/");
  expect([...url.searchParams.keys()]).toEqual(["text"]);
  return url.searchParams.get("text")!;
};

describe("the share link's words", () => {
  it("reuses the live site's label, word for word", () => {
    expect(share.label).toBe(WHATSAPP_SHARE_LABEL);
    expect(share.label).toBe("Know a parent who needs this? Share Kheelu on WhatsApp");
  });

  it("opens WhatsApp's own share sheet (no number: the parent picks who gets it)", () => {
    expect(share.href).toBe("https://wa.me/");
  });

  it.each(["token", "full"] as const)("sends, in %s mode, the message for that mode, then the tagged address", (mode) => {
    const offer = buildOffer(mode);
    expect(offer.share?.label).toBe(WHATSAPP_SHARE_LABEL);
    expect(sent(offer.share!.href)).toBe(`${MESSAGE[mode]} ${ADDRESS}`);
  });

  it("never reuses the old share link, which stays pinned in the frozen money block (ADR-013)", () => {
    for (const mode of ["token", "full"] as const) expect(buildOffer(mode).share?.href).not.toBe(WHATSAPP_SHARE_HREF);
    const imports = readRepoFile("src/content/en-IN/share.ts").match(/^import[^;]+;/gm) ?? [];
    expect(imports.length).toBeGreaterThan(0);
    for (const line of imports) expect(line).not.toContain("WHATSAPP_SHARE_HREF");
  });
});

describe("the message's rules (task 8c.2 acceptance 4)", () => {
  const messages = (["token", "full"] as const).map((mode) => ({ mode, offer: buildOffer(mode), text: sent(buildOffer(mode).share!.href) }));

  it("types no amount: every amount is a {price:…} token", () => {
    for (const words of [share.text.token, share.text.full]) {
      expect(words).not.toMatch(/₹|\bRs\.?\s?\d|\d,\d{3}/);
      expect(words).toMatch(/\{price:[a-z]+\}/);
    }
  });

  it("says no \"first 500\", no \"teaches\", no \"save\" and no \"just\" or \"only\" before an amount", () => {
    for (const { text } of messages) {
      expect(text).not.toMatch(/first 500|\bteach/i);
      expect(text).not.toMatch(/\bsave\b|\bsaving/i);
      expect(text).not.toMatch(/\b(?:just|only)\s+₹/i);
    }
  });

  it("passes the banned-phrases list, claims, offer terms and spelling alike", () => {
    for (const { mode, text } of messages) expect(findBanned(text), mode).toEqual([]);
  });

  it("leads with the total, \"in total\" and without GST (D066 item 2, D028), and names the advance only as refundable (DARK-03)", () => {
    for (const { offer, text } of messages) {
      const amounts = text.match(/₹[\d,]+/g) ?? [];
      expect(amounts[0]).toBe(offer.prices.headline);
      expect(text).toContain(`${offer.prices.headline} in total`);
      expect(text).not.toMatch(/GST/);
    }
    const [token, full] = messages;
    expect(token.text).toContain(`${token.offer.prices.headline} in total; ${token.offer.prices.token} today reserves yours, refundable.`);
    expect(full.text).toContain(`${full.offer.prices.headline} in total, paid in full when you order.`);
    expect(full.text).not.toContain(full.offer.prices.token);
    expect(full.text).not.toMatch(/refundable|advance|today/);
  });

  it("names the age band as 3 to 7, never anything under 3", () => {
    for (const { text } of messages) {
      expect(text).toContain("aged 3 to 7");
      expect(text).not.toMatch(/\b[0-2]\b|\b3\+|\b3 and up\b|\bunder 3\b/);
    }
  });

  it("is the mode's words, resolved as the page resolves any offer string", () => {
    for (const { mode, offer } of messages) expect(toPlainText(share.text, offer)).toBe(MESSAGE[mode]);
  });
});

describe("the address the message ends with", () => {
  it("is kheelona.com tagged exactly as the campaign conventions' tool builds it (source whatsapp, medium referral)", () => {
    expect(share.address).toBe(buildUtmUrl({ source: "whatsapp", medium: "referral", campaign: "2026-10-share", path: "/" }));
    expect(share.address).toBe(ADDRESS);
  });

  it("is never a link on a page of its own: only words inside the message (rule 2 of the conventions)", () => {
    const href = buildOffer("token").share!.href;
    expect(href).not.toContain(ADDRESS);
    expect(href).toContain(encodeURIComponent(ADDRESS));
  });
});
