import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { buildOffer } from "@/lib/offer/offer";

/* The marketing route group's layout (task 3.1; structure §3.1): SiteShell around every marketing page, with the live
 * offer (the drawer's price sentence and the buy bar's lines) and the paths that carry the buy bar. */

const getOffer = vi.hoisted(() => vi.fn());
vi.mock("@/lib/offer/get-offer", () => ({ getOffer }));
const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

describe("(site) layout", () => {
  it("revalidates like every page that shows a price: the drawer and the bar show one on every marketing page", async () => {
    const mod = await import("./layout");
    expect(mod.revalidate).toBe(300);
  });

  it("wraps the page in the site shell with the live offer", async () => {
    getOffer.mockResolvedValue(buildOffer("full"));
    const { default: SiteLayout } = await import("./layout");
    render(await SiteLayout({ children: <p>the page</p> }));
    expect(screen.getByRole("main")).toHaveTextContent("the page");
    expect(document.querySelector(".kh-drawer__note")?.textContent).toBe("₹7,999 (incl. GST), paid in full when you order.");
    expect(document.querySelector(".kh-buybar__big")?.textContent).toBe("₹7,999 (incl. GST)");
  });

  it("gives the buy bar its paths: Home has it, Setup does not", async () => {
    getOffer.mockResolvedValue(buildOffer("token"));
    const { default: SiteLayout } = await import("./layout");
    nav.pathname = "/setup";
    const view = render(await SiteLayout({ children: <p /> }));
    expect(document.querySelector(".kh-buybar")).toBeNull();
    view.unmount();
    nav.pathname = "/";
    render(await SiteLayout({ children: <p /> }));
    expect(document.querySelector(".kh-buybar")).not.toBeNull();
  });
});
