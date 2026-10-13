import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { toPlainText } from "@/lib/content/plain-text";
import { pageMeta } from "@/lib/seo/metadata";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { readRepoFile, tagText } from "../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../organization";
import { notFoundPage } from "../pages/not-found";
import { eventPage, storeNotFound, type StorePanelCopy } from "./event-page";
import { storePage } from "./store-page";

/* The event page's words and the store's dead end (task 6.1; structure §5 row "(no mockup)"; architecture §16.1).
 * Neither has a mockup: the event page reuses the store page's folds and words (store.md), its own lines are the live
 * page's (checkout.md "Variants"), and the dead end keeps the live NotFoundPanel's words. "As live" is read from the
 * pages at the freeze tag, white space collapsed, so a word that drifts from what parents saw fails here. */

const norm = (s: string | null | undefined) => (s ?? "").replace(/\s+/g, " ").trim();
const liveEvent = norm(tagText("src/app/store/e/[event]/page.tsx"));
const livePanel = norm(tagText("src/app/store/_components/NotFoundPanel.tsx"));

/** A panel's WhatsApp line as it reads with the button (cta) and without it. */
function helpLine(copy: StorePanelCopy, cta: boolean): string {
  return cta ? `${copy.help.or} ${copy.help.link} ${copy.help.tail}` : `${copy.help.linkAlone} ${copy.help.tail}`;
}

describe("event page: the tier checkout's words are the store page's (store.md; reuse, never retyped)", () => {
  it("first screen: the store's h1, image, price id and compact trust line; the eyebrow is the tier's own price name", () => {
    expect(eventPage.checkout.top).toEqual({ ...storePage.top, eyebrow: undefined });
    expect(eventPage.checkout.top).not.toHaveProperty("eyebrow");
    expect(eventPage.checkout.top.title).toBe("Pre-order Kheelu.");
  });

  it("the details heading, what sits beside the pay button, the questions and the payments line are the store's own", () => {
    expect(eventPage.checkout.details).toBe(storePage.details);
    expect(eventPage.checkout.beside).toBe(storePage.beside);
    expect(eventPage.checkout.questions).toBe(storePage.questions);
    expect(eventPage.checkout.payments).toBe(storePage.payments);
  });
});

describe("event page: a refused link (as live)", () => {
  it("keeps the live heading, the button to the usual price and the WhatsApp line", () => {
    const { refused } = eventPage;
    expect(refused.title).toBe("That link will not work.");
    expect(liveEvent).toContain(refused.title);
    expect(liveEvent).toContain(`> ${refused.action} </a>`);
    expect(liveEvent).toContain('Or{" "}');
    expect(liveEvent).toContain(`${refused.help.link} </a>{" "} ${refused.help.tail}`);
    expect(helpLine(refused, true)).toBe("Or message us on WhatsApp and a person will sort it out with you.");
  });

  it("has no body of its own: the reason is the checkout's (tiers.ts tierRefusalMessage), passed by the page", () => {
    expect(eventPage.refused).not.toHaveProperty("body");
  });
});

describe("event page: the store before its keys are in place (and on beta, D051)", () => {
  it('reads "Pre-orders open here shortly.", in the store page\'s own words (store.md, Other states)', () => {
    const { notConfigured } = eventPage;
    expect(notConfigured.title).toBe("Pre-orders open here shortly.");
    expect(notConfigured.title).toBe(storePage.notConfigured.title);
    expect(notConfigured.body).toBe(storePage.notConfigured.body);
    expect(notConfigured.help.linkAlone).toBe(storePage.notConfigured.action);
  });

  it("joins the store's WhatsApp action and its note into one line, with no button to a store that is not open", () => {
    const note = storePage.notConfigured.note;
    expect(eventPage.notConfigured.help.tail).toBe(`and ${note.charAt(0).toLowerCase()}${note.slice(1)}`);
    expect(helpLine(eventPage.notConfigured, false)).toBe(
      "Message us on WhatsApp and we will reserve one for you by hand in the meantime.",
    );
  });
});

describe("the store's dead end (as live: the NotFoundPanel at the tag)", () => {
  it("keeps the live heading, body, button and WhatsApp line, with and without the button", () => {
    const { panel } = storeNotFound;
    expect(panel.title).toBe("That page is not here.");
    expect(livePanel).toContain(`title = "${panel.title}"`);
    expect(livePanel).toContain(`body = "${panel.body}"`);
    expect(livePanel).toContain(`> ${panel.action} </a>`);
    expect(livePanel).toContain(`{cta ? "${panel.help.or} " : ""}`);
    expect(livePanel).toContain(`{cta ? "${panel.help.link}" : "${panel.help.linkAlone}"}`);
    expect(livePanel).toContain(`</a>{" "} ${panel.help.tail}`);
    expect(helpLine(panel, true)).toBe("Or message us on WhatsApp with your order number and a person will find it.");
    expect(helpLine(panel, false)).toBe("Message us on WhatsApp with your order number and a person will find it.");
  });

  it("names each panel's heading once, for its section", () => {
    for (const copy of [storeNotFound.panel, eventPage.refused, eventPage.notConfigured]) expect(copy.titleId).toBe("store-title");
  });
});

describe("meta (description, Open Graph and Twitter through pageMeta; the store layout's noindex stands)", () => {
  const token = buildOffer("token");

  it("event page: the store's title, and the first sentence of its description, which names no amount", () => {
    expect(eventPage.meta.title).toBe(storePage.meta.title);
    expect(toPlainText(storePage.meta.description, token).startsWith(eventPage.meta.description)).toBe(true);
    expect(eventPage.meta.description).toBe("Pre-order Kheelu by Kheelona, a screen-free plush toy that talks, for ages 3 to 7.");
    expect(eventPage.meta.og).toBe(DEFAULT_OG);
    // An event link sets its own price, so its preview never names the store's (D028; tiers.ts).
    expect(eventPage.meta.description).not.toMatch(TYPED_AMOUNT);
    expect(eventPage.meta.description).not.toMatch(/\{price:/);
  });

  it("dead end: the site 404's title, and the panel's own body as the description", () => {
    expect(storeNotFound.meta.title).toBe(notFoundPage.meta.title);
    expect(storeNotFound.meta.description).toBe(storeNotFound.panel.body);
    expect(storeNotFound.meta.og).toBe(DEFAULT_OG);
  });

  it("each fits: title at most 60 characters, description at most 155 (ADR-012), through pageMeta's checks", () => {
    for (const meta of [eventPage.meta, storeNotFound.meta]) {
      const built = pageMeta({ ...meta, path: "/" });
      expect((built.title as { absolute: string }).absolute.length).toBeLessThanOrEqual(60);
      expect(String(built.description).length).toBeLessThanOrEqual(155);
    }
  });
});

describe("event page module: source", () => {
  const source = readRepoFile("src/content/en-IN/store/event-page.ts");

  it("types no amount, number or address: each comes from its one source", () => {
    expect(source).not.toMatch(/₹|Rs\.? ?\d|91875|wa\.me|mid-November|20 October/);
  });

  it("names no banned line (the old age band, \"friend\")", () => {
    expect(source).not.toMatch(/ages 3\+|nearly 3|\bfriend\b/i);
  });
});
