import { readdirSync, readFileSync } from "node:fs";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { InAppBrowserNote } from "@/components/ui/InAppBrowserNote/InAppBrowserNote";
import { STORE_ORIGIN } from "@/config/env";
import { seller } from "@/content/en-IN/seller";
import { inAppNote } from "@/content/en-IN/store/in-app-note";
import { storePage } from "@/content/en-IN/store/store-page";
import { buildOffer } from "@/lib/offer/offer";
import { pageMeta } from "@/lib/seo/metadata";
import { revealOnMoneyInDocument } from "../../../test/e2e/support/page-checks";
import { fakeEnv } from "../../../test/helpers/fake-supabase";

/* The store page, store.kheelona.com (task 5.15; structure §3.1, §5 row store.html; architecture §16, ADR-013): the
 * route composes the store sections around the frozen checkout. The live mode is read per request from the store (as
 * at the tag) and decides the tier; the page wires PreorderForm and OrderSummary with that tier exactly as before. The
 * films come below every money answer, the payments line closes <main> (deviations V1), and the store's own WhatsApp
 * bubble is the page's (D050). The not-configured state (and beta, D051) says "shortly" rather than failing. */

const env = vi.hoisted(() => ({ value: null as unknown }));
const mode = vi.hoisted(() => ({ value: "token" as "token" | "full" }));
const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/store/env", () => ({ storeEnv: () => env.value }));
vi.mock("@/lib/store/mode", () => ({ preorderMode: async () => mode.value, FULL_TIER: "full" }));
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
vi.mock("@/features/preorder/lib/checkout", () => ({ startCheckout: vi.fn() }));

beforeAll(async () => {
  await import("./page");
}, 60_000);

beforeEach(() => {
  env.value = fakeEnv;
  mode.value = "token";
});

const SOURCE = readFileSync("src/app/store/page.tsx", "utf8");

/** Every source file task 5.15 owns (tasks.md 5.15 Owns): the route, every module of the two store section folders (read
 *  from disk, so a file added there later is covered), the two content modules, and the two checkout components with
 *  their story and test. This file is the one left out: it holds the planted imports the check is tested with. */
const SECTION_DIRS = ["src/components/sections/store/StoreTop", "src/components/sections/store/StoreDetails"];
const OWNED_SOURCES: readonly string[] = [
  "src/app/store/page.tsx",
  ...SECTION_DIRS.flatMap((dir) => readdirSync(dir).filter((file) => /\.tsx?$/.test(file)).map((file) => `${dir}/${file}`)),
  ...["store-page", "in-app-note"].flatMap((name) => [`src/content/en-IN/store/${name}.ts`, `src/content/en-IN/store/${name}.test.ts`]),
  ...["PreorderForm", "OrderSummary"].flatMap((name) =>
    ["tsx", "test.tsx", "stories.tsx"].map((kind) => `src/features/preorder/components/${name}.${kind}`),
  ),
];

/** The paths task 6.3 deletes that the 5.15 spec names (tasks.md 5.15 Acceptance). */
const DELETED_BY_6_3 = ["atoms/Field", "lib/cn", "lib/interactions", "molecules/PromiseMark", "organisms/VideoMoments", "lib/video-moments", "lib/kheelu-art"];

/** The modules a file names: `import ... from`, `export ... from`, a bare `import "..."`, `import("...")` and
 *  `vi.mock("...")`. */
function moduleSpecifiers(text: string): string[] {
  return [...text.matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*|\bvi\.mock\(\s*)["']([^"']+)["']/g)].map((m) => m[1]);
}

/** The deleted paths a file's modules point at: the path as a whole segment run (`@/lib/cn`, `../../lib/cn.ts`), never
 *  a longer name (`@/lib/cnx`, `ui/Field/Field`). */
function deletedPathsNamedIn(text: string): string[] {
  return moduleSpecifiers(text).flatMap((spec) => DELETED_BY_6_3.filter((path) => new RegExp(`(?:^|/)${path}(?:$|[/.])`).test(spec)));
}

/** The store's canonical and og:url: the production store in every environment (config/env.ts CANONICAL_ORIGIN's rule;
 *  the store is noindex everywhere, so this only keeps a shared beta link from naming beta as the page's home). */
const PRODUCTION_STORE = "https://store.kheelona.com/";

/** Instagram's in-app browser on an iPhone: one of the browsers the in-app note was for (B12; in-app-browser.ts). */
const INSTAGRAM =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 310.0.0.27.110 (iPhone14,5; iOS 17_1; en_IN; en; scale=3.00; 1170x2532; 541635890)";

/** The in-app browsers the note was built for, and LinkedIn's, by the tokens their apps put in the user agent (C2, D073:
 *  the note is switched off for every one of them). */
const ANDROID_WEBVIEW = "Mozilla/5.0 (Linux; Android 14; Pixel 7 Build/UP1A.231105.003; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6045.193 Mobile Safari/537.36";
const IN_APP_USER_AGENTS: Record<string, string> = {
  "Instagram on iPhone": INSTAGRAM,
  "Instagram on Android": `${ANDROID_WEBVIEW} Instagram 310.0.0.37.109 Android (34/14; 420dpi; 1080x2400; Google/google; Pixel 7; panther; panther; en_IN; 543812345)`,
  "Facebook on iPhone (FBAN)":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/440.0.0.35.108;FBBV/563912345;FBDV/iPhone14,5;FBMD/iPhone;FBSN/iOS;FBSV/17.1;FBSS/3;FBID/phone;FBLC/en_IN;FBOP/5]",
  "Facebook on Android (FB_IAB, FBAV)": `${ANDROID_WEBVIEW} [FB_IAB/FB4A;FBAV/440.0.0.35.108;]`,
  "WhatsApp on Android": `${ANDROID_WEBVIEW} WhatsApp/2.23.20.0`,
  "LinkedIn on iPhone":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1234",
};

/** The page as the store layout holds it: the route's output inside <main>. */
async function renderPage() {
  const { default: StorePage } = await import("./page");
  const html = `<!doctype html><html><body><main id="main">${renderToStaticMarkup((await StorePage()) as ReactElement)}</main></body></html>`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  return { doc, main: doc.querySelector("main")! };
}

describe("store page: the configured store (token mode)", () => {
  it("composes the first screen, the form, the questions and then the agreement card, then the films (D070 / C1)", async () => {
    const { main } = await renderPage();
    expect(Array.from(main.querySelectorAll("h1, h2")).map((h) => h.textContent)).toEqual([
      "Pre-order Khelu.",
      "Your details",
      "Questions before you pay",
      "What you are agreeing to",
      /* The selling update (task Q2.12; D057 item 2; the D2C plan v2 §10). */
      "See Khelu ask.",
    ]);
    expect(main.querySelectorAll("h1")).toHaveLength(1);
  });

  /* D070 / C1 (K-176), the reservation layout: Pay always on screen, the answers beside it, no new words. */
  describe("the reservation layout (D070 / C1)", () => {
    it("puts the questions directly after the pay block and the agreement card after them, the card's words as they were", async () => {
      const { main } = await renderPage();
      const form = main.querySelector("#details")!;
      const questions = main.querySelector(".ks-faq")!;
      const card = main.querySelector(".ks-agree")!;
      expect(form.compareDocumentPosition(questions) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(questions.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(main.querySelector(".ks-store__side")!.children[0]).toBe(questions);
    });

    it("opens the three money answers (paying today, the refund, the delivery date) and leaves how to pay closed", async () => {
      const { main } = await renderPage();
      const rows = Array.from(main.querySelectorAll<HTMLDetailsElement>(".ks-faq details"));
      expect(rows.map((d) => [d.id, d.hasAttribute("open")])).toEqual([
        ["faq-paying-today", true],
        ["faq-change-my-mind", true],
        ["faq-store-arrival", true],
        ["faq-how-to-pay", false],
      ]);
      expect(rows.map((d) => d.querySelector("summary")!.textContent)).toEqual([
        "What am I paying today?",
        "What if I change my mind?",
        "When will my Khelu arrive?",
        "How can I pay?",
      ]);
    });

    it("makes the small Khelu a link to the first film, named by that film's own play label, and the strip plays it there", async () => {
      const { main } = await renderPage();
      const link = main.querySelector<HTMLAnchorElement>(".ks-store-top a.ks-store-top__film")!;
      expect(link.getAttribute("href")).toBe("#learning-by-asking");
      expect(link.getAttribute("aria-label")).toBe(
        "Play: Learning by asking. Khelu asks her to explain carrom, and thanks her for the reminder.",
      );
      expect(link.querySelector("img")!.getAttribute("alt")).toBe(storePage.top.image.alt);
      // The link is a film's play button's name, so the film it names is a tile of the strip, carrying that id.
      expect(main.querySelector('[aria-labelledby="ask-title"] li#learning-by-asking[data-video-id="learning-by-asking"]')).not.toBeNull();
      expect(link.querySelector("img")!.getAttribute("loading")).toBe("eager");
    });

    it("keeps every link's address: the trust links still lead to the marketing site (the no-JavaScript fallback), the consent line's too", async () => {
      const { main } = await renderPage();
      const hrefs = (selector: string) => Array.from(main.querySelectorAll<HTMLAnchorElement>(selector)).map((a) => new URL(a.href).pathname + new URL(a.href).hash);
      expect(hrefs(".ks-store-top .kh-trustline a")).toEqual(["/refund#before-dispatch", "/shipping#when"]);
      expect(hrefs(".ks-pay-beside .kh-trustline a")).toEqual(["/refund#returns", "/refund#faulty", "/terms#payment", "/shipping#where"]);
      expect(hrefs(".ks-consent a")).toEqual(["/terms", "/refund"]);
    });

    it("draws no pay bar in the server HTML (it mounts after hydration: nothing to show, nothing to shift), and the form's own button is the only Pay", async () => {
      const { main } = await renderPage();
      expect(main.querySelector(".ks-paybar")).toBeNull();
      expect(Array.from(main.querySelectorAll("button")).filter((b) => b.textContent?.startsWith("Pay "))).toHaveLength(1);
    });
  });

  it("wires the checkout as before: the launch tier's amount on the pay button, the token sentence beside it", async () => {
    const { main } = await renderPage();
    expect(main.querySelector('button[type="submit"]')!.textContent).toBe("Pay ₹499 and reserve");
    expect(main.querySelector("form .ks-price")!.textContent).toBe(
      "Reserve yours for ₹499 today, refundable until dispatch, then pay ₹4,500 before delivery: ₹4,999 in total (incl. GST).",
    );
    expect(main.querySelectorAll("form")).toHaveLength(1);
  });

  it("puts the trust row, the payment window line and the help line inside the form's block, after the price", async () => {
    const { main } = await renderPage();
    const beside = main.querySelector("form .ks-pay-beside")!;
    expect(Array.from(beside.children).map((c) => c.className)).toEqual(["kh-body-s ks-price", "kh-trustline ks-trust", "kh-body-s ks-muted", "kh-body-s ks-help"]);
  });

  it("the agreement card states the D023 delivery line, never the old ship date", async () => {
    const { main } = await renderPage();
    const card = main.querySelector(".ks-agree")!;
    expect(card.textContent).toContain("Deliveries start 15 December 2026");
    expect(main.textContent).not.toMatch(/Ships|20 October/);
  });

  it("shows the films below every money answer, with no <video> until play is pressed", async () => {
    const { main } = await renderPage();
    const films = main.querySelector('[aria-labelledby="ask-title"]')!;
    const store = main.querySelector(".ks-store")!;
    expect(store.compareDocumentPosition(films) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(films.querySelectorAll("[data-video-id], .ks-film")).not.toHaveLength(0);
    expect(main.querySelector("video")).toBeNull();
    expect(films.querySelector('a[href="#details"]')!.textContent).toContain("Back to your details");
  });

  it("closes <main> with the payments line (deviations V1); the WhatsApp bubble floats after it", async () => {
    const { main } = await renderPage();
    const blocks = Array.from(main.children);
    expect(blocks.at(-1)!.matches("a.ks-wa")).toBe(true);
    expect(blocks.at(-2)!.matches(".ks-store-payments")).toBe(true);
    expect(blocks.at(-2)!.textContent).toBe(
      `${storePage.payments.text} ${storePage.payments.link.label} (opens in a new tab)`,
    );
  });

  it("renders the store's WhatsApp bubble with the store text (D050)", async () => {
    const { main } = await renderPage();
    const bubble = main.querySelector("a.ks-wa")!;
    expect(bubble.getAttribute("href")).toBe(`${seller.support.whatsapp}?text=${encodeURIComponent(seller.chat.texts.store)}`);
    expect(bubble.classList.contains("ph-no-capture")).toBe(false);
  });

  /* The note is switched off for every browser (C2, D073; it shipped switched on in task 7.1c, D056 item 3). Its gate reads
     the user agent on the client only, so this renders in the browser's way, once per in-app browser. */
  it.each(Object.entries(IN_APP_USER_AGENTS))("shows no in-app note inside %s, hydrated, with the form there (C2, D073)", async (_name, userAgent) => {
    const agent = vi.spyOn(navigator, "userAgent", "get").mockReturnValue(userAgent);
    try {
      const { default: StorePage } = await import("./page");
      const page = render((await StorePage()) as ReactElement);
      expect(page.container.querySelector("form")).not.toBeNull();
      expect(page.container.querySelector(".ks-inapp")).toBeNull();
      expect(page.container.textContent).not.toContain(inAppNote.title);
      page.unmount();
    } finally {
      agent.mockRestore();
    }
  });

  it("holds no in-app note in the server HTML either: neither its mark nor its words", async () => {
    const { main } = await renderPage();
    expect(main.querySelector(".ks-inapp")).toBeNull();
    expect(main.textContent).not.toContain(inAppNote.title);
  });

  it("keeps the in-app note out of any other browser: Chrome or Safari need no note", async () => {
    const { default: StorePage } = await import("./page");
    const page = render((await StorePage()) as ReactElement);
    expect(page.container.querySelector("form")).not.toBeNull();
    expect(page.container.querySelector(".ks-inapp")).toBeNull();
    // Not vacuous: the same note with its switch on, inside Instagram's browser, renders its mark (the gate still works,
    // so switching the note back on is the one flag), and the same note as shipped renders nothing there.
    const agent = vi.spyOn(navigator, "userAgent", "get").mockReturnValue(INSTAGRAM);
    try {
      const on = render(<InAppBrowserNote content={{ ...inAppNote, enabled: true }} storeUrl={STORE_ORIGIN} />);
      expect(on.container.querySelector(".ks-inapp")).not.toBeNull();
      on.unmount();
      const off = render(<InAppBrowserNote content={inAppNote} storeUrl={STORE_ORIGIN} />);
      expect(off.container.querySelector(".ks-inapp")).toBeNull();
      off.unmount();
    } finally {
      agent.mockRestore();
    }
  });

  it("moves nothing on the money: no reveal on the first fold, the h1, the price, the pay button or the form", async () => {
    const { main } = await renderPage();
    expect(revealOnMoneyInDocument(main)).toEqual([]);
  });
});

describe("store page: full mode", () => {
  it("the full tier's amount on the pay button, the full-price sentence with its refund promise, the full card", async () => {
    mode.value = "full";
    const { main } = await renderPage();
    expect(main.querySelector('button[type="submit"]')!.textContent).toBe("Pay ₹7,999 and pre-order");
    expect(main.querySelector("form .ks-price")!.textContent).toBe(
      "₹7,999 (incl. GST), paid in full when you order. Until we dispatch your Khelu, all of it is refundable.",
    );
    expect(main.querySelector(".ks-store-top__price")!.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(main.querySelector(".ks-agree")!.textContent).toContain("Nothing due before delivery");
  });
});

describe("store page: not configured (no store keys; beta, D051)", () => {
  it("says pre-orders open shortly, that nothing was charged, and offers WhatsApp; no form", async () => {
    env.value = null;
    const { main } = await renderPage();
    expect(main.querySelector("h1")!.textContent).toBe(storePage.notConfigured.title);
    expect(main.textContent).toContain(storePage.notConfigured.body);
    expect(main.textContent).toContain(storePage.notConfigured.note);
    const action = Array.from(main.querySelectorAll("a")).find((a) => a.textContent === storePage.notConfigured.action)!;
    expect(action.getAttribute("href")).toBe(seller.support.whatsapp);
    expect(main.querySelector("form")).toBeNull();
    expect(main.querySelector("a.ks-wa")).not.toBeNull();
  });
});

describe("store page: metadata", () => {
  it("description, Open Graph and Twitter through pageMeta, on the production store's address; no robots (the layout's noindex stays)", async () => {
    getOffer.mockResolvedValue(buildOffer("token"));
    const { generateMetadata } = await import("./page");
    const meta = await generateMetadata();
    const base = pageMeta({ ...storePage.meta, path: "/", offer: buildOffer("token") });
    expect(meta.title).toEqual(base.title);
    expect(meta.description).toBe(base.description);
    expect(meta.twitter).toEqual(base.twitter);
    expect(meta.alternates).toEqual({ canonical: PRODUCTION_STORE });
    expect(meta.openGraph).toEqual({ ...base.openGraph, url: PRODUCTION_STORE });
    expect(meta).not.toHaveProperty("robots");
  });

  it("canonicalises to the production store on beta too: a beta page never canonicalises to itself (config/env.ts, N8)", async () => {
    vi.resetModules();
    vi.stubEnv("KH_SITE_ENV", "beta");
    try {
      // The precondition: on beta the store's own links point at betastore, so a canonical built from them would be beta's.
      expect((await import("@/config/env")).STORE_ORIGIN).toBe("https://betastore.kheelona.com");
      getOffer.mockResolvedValue(buildOffer("token"));
      const meta = await (await import("./page")).generateMetadata();
      expect(meta.alternates).toEqual({ canonical: PRODUCTION_STORE });
      expect(meta.openGraph).toMatchObject({ url: PRODUCTION_STORE });
    } finally {
      vi.unstubAllEnvs();
      vi.resetModules();
    }
  }, 60_000);

  it("follows the offer mode", async () => {
    getOffer.mockResolvedValue(buildOffer("full"));
    const { generateMetadata } = await import("./page");
    expect((await generateMetadata()).description).toMatch(/^Pre-order Khelu by Kheelona.*₹7,999 \(incl\. GST\), with delivery/);
  });
});

describe("store page: source", () => {
  /* D070 / B5 (K-173): the store's first screen comes from cache. The page was per-request at the tag (`force-dynamic`: every
     visit waited for the paid-count query); it is now revalidated on the ADR-005 offer window. The live mode still decides
     the tier, but `create-order` re-decides it on the server (resolveTier refuses a stale page both ways). */
  it("is revalidated every 300 seconds, the ADR-005 offer window, and no longer rendered per request", async () => {
    expect(SOURCE).toContain("export const revalidate = 300;"); // a literal: Next reads a segment config statically
    expect(SOURCE).not.toMatch(/export const dynamic\b/);
    const route = (await import("./page")) as Record<string, unknown>;
    expect(route.revalidate).toBe(300);
    expect(route.dynamic).toBeUndefined();
    // The same 300 as OFFER_REVALIDATE_SECONDS (get-offer.test.ts holds that one) and the marketing route handler.
  });

  it("says why a window of staleness is safe: the tier is re-decided on the server (resolveTier), both directions", () => {
    const comment = SOURCE.slice(0, SOURCE.indexOf("export const revalidate"));
    expect(comment).toContain("resolveTier");
    expect(comment).toContain("create-order");
    expect(comment).toContain("cap-reached");
    expect(comment).toContain("not-yet");
  });

  it("reads nothing per request, so it can be cached: no headers(), cookies() or searchParams in the page, the layout or the shell", () => {
    for (const file of ["src/app/store/page.tsx", "src/app/store/layout.tsx", "src/layouts/StoreShell/StoreShell.tsx"]) {
      const code = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
      expect(code, file).not.toMatch(/next\/headers|\bheaders\(|\bcookies\(|searchParams|unstable_noStore|connection\(/);
    }
  });

  it("the check below finds a deleted path in every way a file can name a module, and only there", () => {
    const planted = [
      'import { cn } from "@/lib/cn";',
      'import "../../lib/interactions";',
      'export { Field } from "@/components/atoms/Field";',
      'const m = await import("@/components/organisms/VideoMoments");',
      'vi.mock("@/lib/kheelu-art", () => ({}));',
    ].join("\n");
    expect(deletedPathsNamedIn(planted)).toEqual(["lib/cn", "lib/interactions", "atoms/Field", "organisms/VideoMoments", "lib/kheelu-art"]);
    // The new design's own modules of the same names are not the legacy ones.
    expect(deletedPathsNamedIn('import { Field } from "@/components/ui/Field/Field";\nimport { cnx } from "@/lib/cnx";')).toEqual([]);
  });

  it("imports no path task 6.3 deletes, in any source file 5.15 owns", () => {
    // Guard the guard: the list holds the files the review named, and the walk reads their imports.
    expect(OWNED_SOURCES).toEqual(
      expect.arrayContaining([
        "src/app/store/page.tsx",
        "src/components/sections/store/StoreTop/StoreTop.tsx",
        "src/components/sections/store/StoreDetails/StoreDetails.tsx",
        "src/components/sections/store/StoreDetails/checkout-words.ts",
        "src/content/en-IN/store/store-page.ts",
        "src/content/en-IN/store/in-app-note.ts",
        "src/features/preorder/components/PreorderForm.tsx",
        "src/features/preorder/components/OrderSummary.tsx",
      ]),
    );
    expect(moduleSpecifiers(SOURCE)).toContain("@/features/preorder/components/PreorderForm");
    const named = OWNED_SOURCES.flatMap((file) => deletedPathsNamedIn(readFileSync(file, "utf8")).map((path) => `${file}: ${path}`));
    expect(named).toEqual([]);
  });

  it("imports the two checkout components by file, never the feature barrel (it also loads AddressForm's client code)", () => {
    expect(SOURCE).not.toMatch(/from "@\/features\/preorder";/);
    expect(SOURCE).toContain('from "@/features/preorder/components/PreorderForm"');
    expect(SOURCE).toContain('from "@/features/preorder/components/OrderSummary"');
  });

  it("types no words: the copy is the content module's", () => {
    const code = SOURCE.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, "");
    expect(code).not.toMatch(/"[A-Z][a-z]+ [a-z]+[^"]*\."/);
  });
});
