import { readFileSync } from "node:fs";
import { render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MARKETING_ORIGIN } from "@/config/env";
import { hoistNowrap, mockupDiff } from "@/layouts/SiteShell/mockup-diff";
import { StoreShell } from "./StoreShell";

/* StoreShell (task 3.1; architecture §16.1, structure §3.1): the store host's shell, rendered by src/app/store/layout.tsx:
 * the skip link, the store header, the page in <main id="main">, the store footer, compared element by element with
 * the approved store mockup (mockup/store.html, shared with store-confirmation.html) through mockup-diff.ts (shared
 * with SiteShell.test.tsx). Each store page renders its own WhatsApp bubble (a layout cannot know its page, D050), so
 * the shell has none. */

const mockup = new DOMParser().parseFromString(readFileSync("mockup/store.html", "utf8"), "text/html");

/** The mockup links the marketing pages by file name; the store links them on the marketing origin of this build. */
function realHref(href: string): string {
  if (href === "home.html") return MARKETING_ORIGIN;
  const page = /^([a-z0-9-]+)\.html(#.*)?$/.exec(href);
  return page ? `${MARKETING_ORIGIN}/${page[1]}${page[2] ?? ""}` : href;
}

/** The image source and width are not markup; the address's mk-seller is ks-store-foot__seller (mockup-css-mapping §6.2). */
const differences = mockupDiff({ realHref, ignore: ["src", "width"], renameClasses: { "mk-seller": "ks-store-foot__seller" } });

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

  it("store header", () => {
    const { container } = shell();
    expect(differences(container.querySelector("header.ks-store-head")!, mockup.querySelector("header.mk-store-head")!)).toEqual([]);
  });

  it("store footer, but for the payments line (held back: see the test below)", () => {
    const { container } = shell();
    const ref = mockup.querySelector("footer.mk-store-foot")!.cloneNode(true) as Element;
    const payments = Array.from(ref.querySelectorAll("p.kh-body-s")).find((p) => /Payments by Razorpay/.test(p.textContent ?? ""))!;
    payments.remove();
    expect(differences(hoistNowrap(container.querySelector("footer.ks-store-foot")!), ref)).toEqual([]);
  });

  it("holds back the payments line, whose chargeback link the frozen store-layout contract does not list", () => {
    /* test/guards/fixtures/checkout-contract/store-layout.json (never edited) pins the store layout's policy links to
       exactly five; the mockup's "How to raise a chargeback with your bank" (refund#chargeback) would be a sixth. Held
       for the main session's ruling (task 3.1 report); StoreFooter takes the line through its `payments` prop. */
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
