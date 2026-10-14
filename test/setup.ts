import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// ---------------------------------------------------------------------------
// Browser APIs jsdom lacks (components touch these on mount)
// ---------------------------------------------------------------------------
vi.stubGlobal("matchMedia", (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  addListener: vi.fn(),
  removeListener: vi.fn(),
  dispatchEvent: vi.fn(),
}));

class IntersectionObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
  root = null;
  rootMargin = "";
  thresholds = [];
}
vi.stubGlobal("IntersectionObserver", IntersectionObserverStub);

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  },
);

vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) =>
  setTimeout(() => cb(0), 0) as unknown as number,
);
vi.stubGlobal("cancelAnimationFrame", (id: number) => clearTimeout(id));
vi.stubGlobal("requestIdleCallback", (cb: (d: { didTimeout: boolean; timeRemaining: () => number }) => void) =>
  setTimeout(() => cb({ didTimeout: false, timeRemaining: () => 0 }), 0) as unknown as number,
);
vi.stubGlobal("cancelIdleCallback", (id: number) => clearTimeout(id));

// jsdom has no canvas: a probe for a drawing context gets null quietly, not jsdom's "not implemented" error.
HTMLCanvasElement.prototype.getContext = vi.fn(() => null) as unknown as typeof HTMLCanvasElement.prototype.getContext;

// ---------------------------------------------------------------------------
// Next runtime modules (jsdom has no Next compiler/router)
// ---------------------------------------------------------------------------
vi.mock("next/link", async () => {
  const React = await import("react");
  return {
    default: ({ href, children, ...rest }: { href: unknown; children?: React.ReactNode } & Record<string, unknown>) =>
      React.createElement("a", { href: typeof href === "string" ? href : "#", ...rest }, children),
  };
});

vi.mock("next/image", async () => {
  const React = await import("react");
  return {
    // `priority` is surfaced as a data attribute (jsdom would warn on the real
    // prop) so tests can assert the LCP law: a hero's largest image is eager.
    default: ({ src, alt, fill, priority, ...rest }: Record<string, unknown>) =>
      React.createElement("img", {
        src: typeof src === "string" ? src : "",
        alt: typeof alt === "string" ? alt : "",
        ...(priority ? { "data-priority": "true" } : {}),
        ...rest,
      }),
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

/* Task 6.3 removed the mocks of next/dynamic (its one user, the 3D StageGate, left in Phase 0), three, @react-three/*,
   three-stdlib and motion/react, with the legacy components and the packages they stood in for. The new design has no
   JavaScript motion (test/guards/motion-properties.test.ts). */
