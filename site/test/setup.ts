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

// WebGL2 probe (lib .../tier.ts): return null so detectTier() -> "static".
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
    default: ({ src, alt, fill, priority, ...rest }: Record<string, unknown>) =>
      React.createElement("img", {
        src: typeof src === "string" ? src : "",
        alt: typeof alt === "string" ? alt : "",
        ...rest,
      }),
  };
});

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn(), back: vi.fn(), forward: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// next/dynamic: the only user is StageGate (lazy-loads the 3D Stage). Render a
// null stub so tests never enter the async dynamic-import/WebGL path (which
// hangs jsdom). The gate's own logic still runs; the 3D canvas is dev-visual only.
vi.mock("next/dynamic", () => ({
  default: () => {
    const DynamicStub = () => null;
    DynamicStub.displayName = "DynamicStub";
    return DynamicStub;
  },
}));

// ---------------------------------------------------------------------------
// three / R3F / drei — the WebGL kill-switch (never construct a WebGLRenderer)
// ---------------------------------------------------------------------------
vi.mock("@react-three/fiber", async () => {
  const React = await import("react");
  const state = {
    camera: { position: { set: () => {}, x: 0, y: 0, z: 0 }, lookAt: () => {} },
    gl: { domElement: document.createElement("canvas"), setClearColor: () => {} },
    scene: {},
    size: { width: 800, height: 600 },
    clock: { getElapsedTime: () => 0 },
  };
  return {
    Canvas: ({ children }: { children?: React.ReactNode }) =>
      React.createElement("div", { "data-mock-canvas": true }, children),
    useFrame: () => {},
    useThree: (selector?: (s: typeof state) => unknown) => (selector ? selector(state) : state),
    extend: () => {},
  };
});

vi.mock("@react-three/drei", async () => {
  const React = await import("react");
  // Any drei export used as a component renders nothing; hooks return a safe stub.
  return new Proxy(
    {},
    {
      get: (_t, key) => {
        // Guard the thenable trap: a catch-all that returns a function for
        // `then` makes this namespace look like a Promise, so module resolution
        // (Promise.resolve(namespace)) calls then() and hangs forever. Also keep
        // ESM/symbol interop keys undefined.
        if (key === "then" || key === "__esModule" || typeof key === "symbol") {
          return undefined;
        }
        if (typeof key === "string" && key.startsWith("use")) {
          return () => ({ scene: {}, nodes: {}, materials: {}, animations: [] });
        }
        return ({ children }: { children?: React.ReactNode }) =>
          React.createElement(React.Fragment, null, children ?? null);
      },
    },
  );
});

// three-stdlib: only shape-geometry.ts uses it (SVGLoader, dormant journey
// geometry). The full barrel stalls jsdom on import, so stub the one export.
vi.mock("three-stdlib", () => ({
  SVGLoader: class {
    parse() {
      return { paths: [] as unknown[] };
    }
    static createShapes() {
      return [] as unknown[];
    }
  },
}));

// ---------------------------------------------------------------------------
// motion/react — deterministic, no rAF-driven animation in jsdom
// ---------------------------------------------------------------------------
vi.mock("motion/react", async () => {
  const React = await import("react");
  const make = (tag: string) => ({ children, ...rest }: { children?: React.ReactNode } & Record<string, unknown>) =>
    React.createElement(tag, rest, children);
  return {
    motion: new Proxy(
      {},
      {
        get: (_t, tag) => {
          if (tag === "then" || tag === "__esModule" || typeof tag === "symbol") return undefined;
          return make(tag as string);
        },
      },
    ),
    AnimatePresence: ({ children }: { children?: React.ReactNode }) => children,
    useReducedMotion: () => false,
    useScroll: () => ({ scrollYProgress: { get: () => 0, on: () => () => {}, set: () => {} } }),
    useTransform: () => ({ get: () => 0 }),
    useSpring: (v: unknown) => v,
    useMotionValue: (init: number) => ({ get: () => init, set: () => {}, on: () => () => {} }),
    useMotionValueEvent: () => {},
    useInView: () => false,
  };
});
