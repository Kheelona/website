import { act, render, screen } from "@testing-library/react";
import { StickyReserveBar } from "./StickyReserveBar";
import { PREORDER_HREF, RESERVE_SHORT_LABEL, TOKEN_PRICE } from "@/config/site";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

type Callback = (entries: Partial<IntersectionObserverEntry>[]) => void;
let callback: Callback = () => {};
const observed: Element[] = [];

beforeEach(() => {
  observed.length = 0;
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      constructor(cb: Callback) {
        callback = cb;
      }
      observe(el: Element) {
        observed.push(el);
      }
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  document.body.innerHTML = "";
});

describe("StickyReserveBar", () => {
  it("goes straight to the store in one tap (§8.25-b)", () => {
    render(<StickyReserveBar />);
    expect(screen.getByRole("link", { name: RESERVE_SHORT_LABEL })).toHaveAttribute(
      "href",
      PREORDER_HREF,
    );
  });

  it("carries the sticky-bar cta value for PostHog", () => {
    render(<StickyReserveBar />);
    expect(screen.getByRole("link", { name: RESERVE_SHORT_LABEL })).toHaveAttribute(
      "data-ph-capture-attribute-cta",
      "sticky-bar",
    );
  });

  it("states the token from config, never a typed amount", () => {
    render(<StickyReserveBar />);
    expect(screen.getByText(`${TOKEN_PRICE} reserves Kheelu`)).toBeInTheDocument();
  });

  it("is phones only", () => {
    const { container } = render(<StickyReserveBar />);
    expect(container.firstElementChild?.className).toMatch(/md:hidden/);
  });

  it("hides while the #reserve finale is on screen, and comes back after", () => {
    const reserve = document.createElement("section");
    reserve.id = "reserve";
    document.body.appendChild(reserve);
    render(<StickyReserveBar />);
    expect(observed).toContain(reserve);
    act(() => callback([{ target: reserve, isIntersecting: true }]));
    expect(screen.queryByRole("link")).toBeNull();
    act(() => callback([{ target: reserve, isIntersecting: false }]));
    expect(screen.getByRole("link", { name: RESERVE_SHORT_LABEL })).toBeInTheDocument();
  });

  it("hides over the footer too, so the seller-of-record lines are never covered", () => {
    const footer = document.createElement("footer");
    document.body.appendChild(footer);
    render(<StickyReserveBar />);
    act(() => callback([{ target: footer, isIntersecting: true }]));
    expect(screen.queryByRole("link")).toBeNull();
  });
});
