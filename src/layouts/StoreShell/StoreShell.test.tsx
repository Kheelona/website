import { render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { isSitePath } from "@/lib/links";
import { withSellerFacts } from "../../../test/e2e/support/seller-facts";
import { mockupDiff, mockupPage, mockupRoute } from "../../../test/support/mockup-compare";
import { StoreShell } from "./StoreShell";

/* StoreShell (task 3.1; architecture §16.1, structure §3.1): the store host's shell, rendered by src/app/store/layout.tsx:
 * the skip link, the store header, the page in <main id="main">, the store footer, compared element by element with
 * the approved store mockup (mockup/store.html, shared with store-confirmation.html) through the mockup comparison
 * harness (test/support/mockup-compare.ts, task 3.6). Each store page renders its own WhatsApp bubble (a layout cannot
 * know its page, D050), so the shell has none. */

const mockup = mockupPage("store");

/** The mockup links the marketing pages by file name; the store links them on the marketing origin of this build. */
function realHref(href: string): string {
  const route = mockupRoute(href);
  if (!isSitePath(route)) return route;
  return route === "/" ? MARKETING_ORIGIN : `${MARKETING_ORIGIN}${route}`;
}

/** The image source and width are not markup; the address's mk-seller is ks-store-foot__seller (mockup-css-mapping §6.2). */
const differences = mockupDiff({ realHref, ignore: ["src", "width"], renames: { seller: "ks-store-foot__seller" } });

function shell() {
  return render(
    <StoreShell>
      <p>store page</p>
    </StoreShell>,
  );
}

describe("StoreShell: the store chrome equals the approved mockup's (mockup/store.html)", () => {
  it("skip link", () => {
    const { container } = shell();
    expect(differences(container.querySelector(".ks-skip")!, mockup.querySelector(".mk-skip")!)).toEqual([]);
  });

  /* The header's help line, the footer's seller lines and its grievance line as D063 items 2-3 rule them (task Q2.3;
     test/e2e/support/seller-facts.ts): WhatsApp and the email, no GSTIN, no number, no call. The help line's lead is
     every close's since the selling update (task Q2.12; the D2C plan v2 §1.1 and §10, CMO m9): "Questions?" for "Need
     help?". */
  it("store header", () => {
    const { container } = shell();
    const ref = withSellerFacts(mockup.querySelector("header.mk-store-head")!);
    const lead = ref.querySelector(".mk-store-head__help")!.firstChild!;
    expect(lead.textContent).toBe("Need help? ");
    lead.textContent = "Questions? ";
    expect(differences(container.querySelector("header.ks-store-head")!, ref)).toEqual([]);
  });

  it("store footer, but for the payments line (held back: see the test below)", () => {
    const { container } = shell();
    const ref = withSellerFacts(mockup.querySelector("footer.mk-store-foot")!);
    const payments = Array.from(ref.querySelectorAll("p.kh-body-s")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))!;
    payments.remove();
    expect(differences(container.querySelector("footer.ks-store-foot")!, ref)).toEqual([]);
  });

  it("holds back the payments line, whose chargeback link the frozen store-layout contract does not list", () => {
    /* test/guards/fixtures/checkout-contract/store-layout.json (never edited) pins the store layout's policy links to
       exactly five; the mockup's "How to raise a chargeback with your bank" (refund#chargeback) would be a sixth. The
       line renders as the last line of the store page's main instead (task 5.15; wiki/qa/deviations.md V1). */
    const { container } = shell();
    expect(container.textContent).not.toContain("Payments by Razorpay");
    expect(container.querySelector('a[href*="#chargeback"]')).toBeNull();
  });

  it("keeps the order: skip link, header, main, footer, and adds no bubble and no site navigation", () => {
    const { container } = shell();
    expect(Array.from(container.children).map((el) => el.tagName.toLowerCase() + (el.className ? `.${el.className.split(" ")[0]}` : ""))).toEqual([
      "a.kh-btn",
      "header.kh-nav",
      "main",
      "footer.kh-footer",
    ]);
    expect(container.querySelector(".ks-wa")).toBeNull();
    expect(screen.queryByRole("navigation", { name: "Main" })).toBeNull();
  });

  it("mounts the motion observer, so the store page's reveals run (D049 pick 1A; store.html's films wrap)", async () => {
    /* MotionController renders nothing: one frame after mounting it arms html.js-motion (test/setup.ts gives jsdom an
       IntersectionObserver and no reduced-motion preference), and it disarms when the page goes. */
    const { unmount } = render(
      <StoreShell>
        <div data-reveal>films</div>
      </StoreShell>,
    );
    await waitFor(() => expect(document.documentElement).toHaveClass("js-motion"));
    unmount();
    expect(document.documentElement).not.toHaveClass("js-motion");
  });

  it("puts the page in <main id=\"main\">", () => {
    shell();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main");
    expect(screen.getByRole("main")).toHaveTextContent("store page");
  });

  it("links the policies to the marketing site of this build (MARKETING_ORIGIN: the beta site on beta)", () => {
    shell();
    const hrefs = within(screen.getByRole("navigation", { name: "Policies" }))
      .getAllByRole("link")
      .map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["terms", "refund", "shipping", "privacy", "contact"].map((p) => `${MARKETING_ORIGIN}/${p}`));
  });
});

/** StoreShell imported afresh, so src/config/env.ts and the content modules are read again: stub the environment or
 *  mock a module first. */
async function freshStoreShell(): Promise<typeof StoreShell> {
  vi.resetModules();
  return (await import("./StoreShell")).StoreShell;
}

describe("StoreShell: fresh imports", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.doUnmock("@/content/en-IN/navigation");
    vi.resetModules();
  });

  /* Task 3.6 item 15 (D048): on beta every way out of the store leads to the beta marketing site, never production. */
  it("on beta (KH_SITE_ENV=beta): the five policy links and the logo link go to https://betawebsite.kheelona.com", async () => {
    vi.stubEnv("KH_SITE_ENV", "beta");
    const Shell = await freshStoreShell();
    render(
      <Shell>
        <p>store page</p>
      </Shell>,
    );
    const BETA = "https://betawebsite.kheelona.com";
    const policies = within(screen.getByRole("navigation", { name: "Policies" }))
      .getAllByRole("link")
      .map((a) => a.getAttribute("href") ?? "");
    expect(policies).toEqual(["terms", "refund", "shipping", "privacy", "contact"].map((p) => `${BETA}/${p}`));
    expect(screen.getByRole("link", { name: "Kheelona home" }).getAttribute("href")).toBe(BETA);
    for (const href of [...policies, screen.getByRole("link", { name: "Kheelona home" }).getAttribute("href") ?? ""]) {
      expect(href.startsWith(BETA), href).toBe(true);
    }
  });

  /* Task 3.6 item 13: the logo link's name and the new-tab note come from content (navigation.labels), typed nowhere in
     the shell, so a change of wording is a content change. */
  it("names the logo link and the new-tab note from content/en-IN/navigation.ts", async () => {
    vi.doMock("@/content/en-IN/navigation", async (importOriginal) => {
      const real = await importOriginal<typeof import("@/content/en-IN/navigation")>();
      return { navigation: { ...real.navigation, labels: { ...real.navigation.labels, storeLogoLink: "Logo from content", newTabNote: " (note from content)" } } };
    });
    const Shell = await freshStoreShell();
    render(
      <Shell>
        <p>store page</p>
      </Shell>,
    );
    expect(screen.getByRole("link", { name: "Logo from content" })).toHaveClass("kh-logo-link");
    const links = within(screen.getByRole("navigation", { name: "Policies" })).getAllByRole("link");
    expect(links).toHaveLength(5);
    for (const a of links) expect(a.querySelector(".kh-sr")?.textContent, a.outerHTML).toBe(" (note from content)");
  });
});
