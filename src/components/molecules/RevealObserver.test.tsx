import { render } from "@testing-library/react";
import { RevealObserver } from "./RevealObserver";

/* Local pathname mock: the global one in test/setup.ts is a constant "/", and
   the re-arm behaviour only shows up when the route changes. */
let pathname = "/";
vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
}));

describe("RevealObserver", () => {
  afterEach(() => {
    pathname = "/";
  });

  it("mounts without throwing and renders nothing visible", () => {
    const { container } = render(<RevealObserver />);
    expect(container).toBeEmptyDOMElement();
  });

  it("observes existing [data-reveal] nodes and cleans up on unmount", () => {
    const target = document.createElement("div");
    target.setAttribute("data-reveal", "rise");
    document.body.appendChild(target);

    const observe = vi.fn();
    const OriginalIO = globalThis.IntersectionObserver;
    class SpyIO {
      observe = observe;
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds: number[] = [];
    }
    vi.stubGlobal("IntersectionObserver", SpyIO);

    const { unmount } = render(<RevealObserver />);
    expect(observe).toHaveBeenCalledWith(target);
    expect(() => unmount()).not.toThrow();

    vi.stubGlobal("IntersectionObserver", OriginalIO);
    document.body.removeChild(target);
  });

  it("re-arms after a client-side navigation (the layout never remounts)", () => {
    const first = document.createElement("div");
    first.setAttribute("data-reveal", "left");
    document.body.appendChild(first);

    const observe = vi.fn();
    const OriginalIO = globalThis.IntersectionObserver;
    class SpyIO {
      observe = observe;
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = () => [];
      root = null;
      rootMargin = "";
      thresholds: number[] = [];
    }
    vi.stubGlobal("IntersectionObserver", SpyIO);

    const { rerender } = render(<RevealObserver />);
    expect(observe).toHaveBeenCalledWith(first);

    // the route changes: old rooms leave, new ones arrive unobserved
    document.body.removeChild(first);
    const next = document.createElement("div");
    next.setAttribute("data-reveal", "right");
    document.body.appendChild(next);
    observe.mockClear();

    pathname = "/safety";
    rerender(<RevealObserver />);
    expect(observe).toHaveBeenCalledWith(next);

    vi.stubGlobal("IntersectionObserver", OriginalIO);
    document.body.removeChild(next);
  });
});
