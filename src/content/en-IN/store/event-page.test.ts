import { describe, expect, it } from "vitest";
import { buildOffer } from "@/lib/offer/offer";
import { toPlainText } from "@/lib/content/plain-text";
import { pageMeta } from "@/lib/seo/metadata";
import { TYPED_AMOUNT } from "@/lib/seo/price-lead";
import { tierRefusalMessage } from "@/lib/store/tiers";
import { readRepoFile, tagText } from "../../../../test/e2e/support/repo";
import { DEFAULT_OG } from "../organization";
import { notFoundPage } from "../pages/not-found";
import { eventPage, storeNotFound, type StorePanelCopy } from "./event-page";
import { STORE_AGE_BAND, storePage } from "./store-page";

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
  it("first screen: the store's h1, image, price id and compact trust line; the eyebrow is composed per tier", () => {
    expect(eventPage.checkout.top).toEqual({ ...storePage.top, eyebrow: undefined });
    expect(eventPage.checkout.top).not.toHaveProperty("eyebrow");
    expect(eventPage.checkout.top.title).toBe("Pre-order Kheelu.");
  });

  /* CMO review C m2 (task 7.1c): the tier's price name took the eyebrow's place, so the age band left the first screen.
     The eyebrow keeps the store's own band beside the tier's name, from two approved words and no new copy (the CMO's
     7.1c copy review, "Not in this round"). */
  /* Since the selling update (task Q2.12) the store's own eyebrow opens with "Screen-free AI toy" (D065 item 1); the
     event page keeps the tier's name and the store's age band alone (STORE_AGE_BAND), its words unchanged. */
  it("the eyebrow is the tier's own price name, then the store's age band (CMO review C m2)", () => {
    expect(toPlainText(eventPage.checkout.eyebrow("Bangalore expo price"))).toBe("Bangalore expo price · Ages 3 to 7");
    expect(toPlainText(eventPage.checkout.eyebrow("Bangalore expo price")).endsWith(` · ${STORE_AGE_BAND}`)).toBe(true);
    expect(toPlainText(storePage.top.eyebrow).endsWith(` · ${STORE_AGE_BAND}`)).toBe(true);
  });

  it("keeps the age band on one line when the eyebrow wraps beside the small Kheelu on a phone", () => {
    expect(eventPage.checkout.eyebrow("Bangalore expo price")).toBe(`Bangalore expo price · {nowrap:${STORE_AGE_BAND}}`);
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

  it("has no single body: the page passes the body for the refusal's reason", () => {
    expect(eventPage.refused).not.toHaveProperty("body");
  });
});

/* CMO review C m1 (task 7.1c): the panel printed the frozen tiers.ts words, whose default line put ₹499 beside a button
 * with no total (D028) and said "on this page" of a button that leaves for the store. The copy page now gives one body
 * per refusal reason (store.md, "Event link refused"), printed presentation-side; tiers.ts stays byte-identical. */
describe("event page: a refused link's body, one per reason (store.md, Event link refused)", () => {
  const REASONS = ["cap-reached", "not-yet", "unknown", "bad-signature", "expired", "full"] as const;

  /** The copy page's table: each row's reasons (the backticked names in its first cell) and its body (last cell). */
  function copyPageBodies(): Record<string, string> {
    const markdown = readRepoFile("wiki/site/pages/store.md");
    const section = markdown.split(/^## /m).find((s) => s.startsWith("Event link refused"));
    if (!section) throw new Error('store.md has no "## Event link refused" section');
    const out: Record<string, string> = {};
    for (const line of section.split("\n")) {
      if (!line.startsWith("| `")) continue;
      const cells = line.split("|").slice(1, -1).map((c) => c.trim());
      for (const [, reason] of cells[0].matchAll(/`([a-z-]+)`/g)) out[reason] = cells.at(-1)!;
    }
    return out;
  }

  it("has a body for each of the checkout's six reasons, and only those", () => {
    expect(Object.keys(eventPage.refused.reasons).sort()).toEqual([...REASONS].sort());
  });

  it("each body is the copy page's, word for word", () => {
    const bodies = copyPageBodies();
    expect(Object.keys(bodies).sort()).toEqual([...REASONS].sort());
    for (const reason of REASONS) expect(eventPage.refused.reasons[reason], reason).toBe(bodies[reason]);
  });

  it("names no amount and points at the store, never at this page: true in token and full mode (D028)", () => {
    for (const [reason, body] of Object.entries(eventPage.refused.reasons)) {
      expect(body, reason).not.toMatch(TYPED_AMOUNT);
      expect(body, reason).not.toMatch(/\{price:|₹|this page|Refresh/);
      expect(body.endsWith("at the usual price in our store."), reason).toBe(true);
    }
  });

  it("keeps the live first sentence where it is still true, and never calls a signed link 'not one of ours'", () => {
    const live = (reason: (typeof REASONS)[number]) => tierRefusalMessage(reason).split(". ")[0];
    for (const reason of ["expired", "full"] as const) {
      expect(eventPage.refused.reasons[reason].startsWith(`${live(reason)}.`), reason).toBe(true);
    }
    expect(eventPage.refused.reasons.unknown).not.toMatch(/not one of ours/);
  });

  it("tells a parent whose link fails its signature that it may only be cut short, not only forged (D057 item 4)", () => {
    expect(eventPage.refused.reasons["bad-signature"]).toBe("This link is incomplete, or not one of ours. You can pre-order at the usual price in our store.");
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
