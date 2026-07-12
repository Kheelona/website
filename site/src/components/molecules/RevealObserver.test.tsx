import { render } from "@testing-library/react";
import { RevealObserver } from "./RevealObserver";

describe("RevealObserver", () => {
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
});
