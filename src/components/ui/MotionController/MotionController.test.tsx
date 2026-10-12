import { act, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/* MotionController (task 2.8; ADR-007, architecture §11.1-§11.3, D049 picks 1A and 3B).
 *
 * The one observer behind the reveals and the doodle draws, tested with a mocked IntersectionObserver.
 * jsdom has no layout, so each block's position comes from its data-top attribute (px from the top of
 * the viewport); window.innerHeight is jsdom's 768. The class contract is motion.css's (§11.3):
 * html.js-motion arms the presets, .is-in shows a [data-reveal] block or draws a [data-draw] doodle. */

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

import { MotionController } from "./MotionController.client";

const REDUCE = "(prefers-reduced-motion: reduce)";

class FakeObserver {
  static instances: FakeObserver[] = [];
  readonly observed = new Set<Element>();
  readonly unobserved: Element[] = [];
  disconnected = false;
  constructor(
    readonly callback: IntersectionObserverCallback,
    readonly options?: IntersectionObserverInit,
  ) {
    FakeObserver.instances.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
    this.unobserved.push(el);
  }
  disconnect() {
    this.observed.clear();
    this.disconnected = true;
  }
  takeRecords() {
    return [];
  }
  /** What the browser reports when `el` crosses the observer's root (margin applied). */
  fire(el: Element, isIntersecting: boolean) {
    this.callback([{ target: el, isIntersecting } as unknown as IntersectionObserverEntry], this as unknown as IntersectionObserver);
  }
}

const html = () => document.documentElement;
const byId = (id: string) => document.getElementById(id)!;
const below = window.innerHeight + 100;

/** A page: two blocks in view at load (a reveal and a doodle), two below the fold, and a block that does not move. */
const PAGE = `
  <section id="reveal-top" data-reveal></section>
  <svg id="draw-top" class="ks-doodle" data-draw data-top="300"></svg>
  <section id="reveal-low" data-reveal data-top="${below}"></section>
  <svg id="draw-low" class="ks-doodle" data-draw data-draw-order="2" data-top="${below + 400}"></svg>
  <p id="still" data-top="${below}"></p>`;

/** The page a client navigation brings: one block in view, one below. */
const NEXT_PAGE = `
  <section id="next-top" data-reveal></section>
  <section id="next-low" data-reveal data-top="${below}"></section>`;

/** Runs the frame the controller waits for (test/setup.ts runs requestAnimationFrame on a zero timeout). */
const nextFrame = () => act(() => new Promise<void>((done) => setTimeout(done, 0)));

/** Records every class change under <html> in order, to prove what was marked before js-motion arrived.
 *  Returns one line per change, "<id or html>: <class list after that change>". */
function recordClassChanges() {
  const records: MutationRecord[] = [];
  const observer = new MutationObserver((batch) => records.push(...batch));
  observer.observe(html(), { attributes: true, attributeFilter: ["class"], attributeOldValue: true, subtree: true });
  return (): string[] => {
    records.push(...observer.takeRecords());
    observer.disconnect();
    return records.map((r, i) => {
      const el = r.target as Element;
      // A record holds the value before its change; the value after it is the next record's "before", or the current one.
      const later = records.slice(i + 1).find((n) => n.target === el);
      const after = later ? (later.oldValue ?? "") : (el.getAttribute("class") ?? "");
      return `${el === html() ? "html" : el.id}: ${after}`;
    });
  };
}

const classesOf = (line: string) => line.slice(line.indexOf(": ") + 2).split(/\s+/);

/** Index of the record where `who` first carries `cls`. */
function firstWith(log: string[], who: string, cls: string): number {
  return log.findIndex((line) => line.startsWith(`${who}: `) && classesOf(line).includes(cls));
}

function stubAnimations(el: Element) {
  const animation = { finish: vi.fn() };
  Object.defineProperty(el, "getAnimations", { configurable: true, value: vi.fn(() => [animation]) });
  return animation;
}

beforeEach(() => {
  FakeObserver.instances = [];
  nav.pathname = "/";
  vi.stubGlobal("IntersectionObserver", FakeObserver);
  vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    const top = Number(this.getAttribute("data-top") ?? 0);
    return { top, bottom: top + 100, left: 0, right: 100, width: 100, height: 100, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
  });
  // As a browser: an element inside a `hidden` ancestor (React's streaming holder) has no layout box at all.
  vi.spyOn(Element.prototype, "getClientRects").mockImplementation(function (this: Element) {
    const boxes = this.closest("[hidden]") ? [] : [this.getBoundingClientRect()];
    return Object.assign(boxes, { item: (i: number) => boxes[i] ?? null }) as unknown as DOMRectList;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
  html().className = "";
});

describe("MotionController", () => {
  it("renders nothing of its own, so it can shift no layout", async () => {
    document.body.innerHTML = PAGE;
    const { container } = render(<MotionController />);
    await nextFrame();
    expect(container).toBeEmptyDOMElement();
  });

  it("marks the blocks and doodles in view at load is-in before it adds js-motion to <html>", async () => {
    document.body.innerHTML = PAGE;
    const changes = recordClassChanges();
    render(<MotionController />);
    await nextFrame();
    const log = changes();

    expect(html()).toHaveClass("js-motion");
    expect(byId("reveal-top")).toHaveClass("is-in");
    expect(byId("draw-top")).toHaveClass("is-in");
    const armed = firstWith(log, "html", "js-motion");
    expect(armed, log.join("\n")).toBeGreaterThan(-1);
    expect(firstWith(log, "reveal-top", "is-in"), log.join("\n")).toBeLessThan(armed);
    expect(firstWith(log, "draw-top", "is-in"), log.join("\n")).toBeLessThan(armed);
  });

  it("leaves the blocks below the fold for the observer: not is-in yet", async () => {
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    expect(byId("reveal-low")).not.toHaveClass("is-in");
    expect(byId("draw-low")).not.toHaveClass("is-in");
    expect(byId("still")).not.toHaveClass("is-in");
  });

  it("uses one IntersectionObserver, with the mockup's margin, for the [data-reveal] and [data-draw] below the fold only", async () => {
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    expect(FakeObserver.instances).toHaveLength(1);
    const [observer] = FakeObserver.instances;
    expect(observer.options).toEqual({ rootMargin: "0px 0px -10% 0px" });
    expect([...observer.observed].map((el) => el.id).sort()).toEqual(["draw-low", "reveal-low"]);
  });

  it("reveals a block once it enters, then stops watching it", async () => {
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    const [observer] = FakeObserver.instances;

    observer.fire(byId("reveal-low"), false);
    expect(byId("reveal-low")).not.toHaveClass("is-in");
    expect(observer.observed.has(byId("reveal-low"))).toBe(true);

    observer.fire(byId("reveal-low"), true);
    expect(byId("reveal-low")).toHaveClass("is-in");
    expect(observer.observed.has(byId("reveal-low"))).toBe(false);
    expect(observer.unobserved).toEqual([byId("reveal-low")]);

    observer.fire(byId("draw-low"), true);
    expect(byId("draw-low")).toHaveClass("is-in");
    expect(observer.observed.size).toBe(0);
  });

  it("shows a doodle already on screen drawn, not drawing: its draw animation jumps to the end", async () => {
    document.body.innerHTML = PAGE;
    const top = stubAnimations(byId("draw-top"));
    const low = stubAnimations(byId("draw-low"));
    render(<MotionController />);
    await nextFrame();
    expect(top.finish).toHaveBeenCalled();
    expect(low.finish).not.toHaveBeenCalled();

    // A doodle that enters later draws itself (pick 3B): nothing cuts its animation short.
    FakeObserver.instances[0].fire(byId("draw-low"), true);
    expect(low.finish).not.toHaveBeenCalled();
  });

  it("does nothing with reduced motion: no js-motion, no is-in, no observer, everything stays visible", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: query === REDUCE, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList,
    );
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    expect(html()).not.toHaveClass("js-motion");
    expect(document.querySelectorAll(".is-in")).toHaveLength(0);
    expect(FakeObserver.instances).toHaveLength(0);
  });

  it("does nothing without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    expect(html()).not.toHaveClass("js-motion");
    expect(document.querySelectorAll(".is-in")).toHaveLength(0);
  });

  it("re-arms on a usePathname() change: the new page's blocks in view are is-in before js-motion returns, the rest observed", async () => {
    document.body.innerHTML = PAGE;
    const view = render(<MotionController />);
    await nextFrame();
    const [first] = FakeObserver.instances;

    // A client navigation: the router swaps the page under the shell, then the pathname changes.
    document.body.querySelectorAll("section, svg, p").forEach((el) => el.remove());
    document.body.insertAdjacentHTML("afterbegin", NEXT_PAGE);
    const changes = recordClassChanges();
    nav.pathname = "/products/kheelu";
    view.rerender(<MotionController />);
    await nextFrame();
    const log = changes();

    expect(first.disconnected).toBe(true);
    expect(FakeObserver.instances).toHaveLength(2);
    const second = FakeObserver.instances[1];
    expect([...second.observed].map((el) => el.id)).toEqual(["next-low"]);
    expect(byId("next-top")).toHaveClass("is-in");
    expect(html()).toHaveClass("js-motion");
    // js-motion comes off first, so the new page's blocks in view are measured and shown without a fade.
    const off = log.findIndex((line) => line.startsWith("html: ") && !classesOf(line).includes("js-motion"));
    const on = log.findIndex((line, i) => i > off && line.startsWith("html: ") && classesOf(line).includes("js-motion"));
    expect(off, log.join("\n")).toBeGreaterThan(-1);
    expect(firstWith(log, "next-top", "is-in"), log.join("\n")).toBeGreaterThan(off);
    expect(firstWith(log, "next-top", "is-in"), log.join("\n")).toBeLessThan(on);
  });

  it("on a re-arm, leaves blocks already shown alone and keeps a doodle already drawn from drawing again", async () => {
    document.body.innerHTML = `<footer><svg id="kept" class="ks-doodle" data-draw></svg><div id="kept-block" data-reveal></div></footer>`;
    const view = render(<MotionController />);
    await nextFrame();
    expect(byId("kept")).toHaveClass("is-in");
    const kept = stubAnimations(byId("kept"));

    nav.pathname = "/safety";
    view.rerender(<MotionController />);
    await nextFrame();
    expect(FakeObserver.instances[1].observed.size).toBe(0);
    expect(byId("kept-block")).toHaveClass("is-in");
    expect(kept.finish).toHaveBeenCalled();
  });

  it("disconnects and disarms on unmount", async () => {
    document.body.innerHTML = PAGE;
    const view = render(<MotionController />);
    await nextFrame();
    view.unmount();
    expect(FakeObserver.instances[0].disconnected).toBe(true);
    expect(html()).not.toHaveClass("js-motion");
  });

  it("does nothing if it unmounts before its frame", async () => {
    document.body.innerHTML = PAGE;
    const view = render(<MotionController />);
    view.unmount();
    await nextFrame();
    expect(html()).not.toHaveClass("js-motion");
    expect(FakeObserver.instances).toHaveLength(0);
  });
});

/* Targets added after it armed (task 2.12; architecture §11.3, authoring rule): a client-only island or a streamed
 * block lands in the page after the first frame. Under html.js-motion such a block would sit at opacity 0 for good
 * unless the controller takes it too. One MutationObserver on document.body (childList, subtree) hands each added
 * [data-reveal] and [data-draw] to the same rules as at arming, before the browser paints (a mutation observer runs
 * as a microtask). */
describe("MotionController: targets added after it armed", () => {
  /** Mutation observers report as a microtask: one queued after the insertion runs after them. */
  const mutationsDelivered = () => act(() => new Promise<void>((done) => queueMicrotask(done)));

  /** An element parsed from markup, not yet in the page (so a stub can go on it before it lands). */
  function fragment(markup: string): Element {
    const holder = document.createElement("div");
    holder.innerHTML = markup.trim();
    return holder.firstElementChild!;
  }

  async function armed() {
    document.body.innerHTML = PAGE;
    const view = render(<MotionController />);
    await nextFrame();
    return { view, observer: FakeObserver.instances[0] };
  }

  it("shows a block added on screen at once: is-in, not observed, its own fade jumped to the end", async () => {
    const { observer } = await armed();
    const late = fragment(`<section id="late-top" data-reveal data-top="200"></section>`);
    const fade = stubAnimations(late);
    document.body.append(late);
    await mutationsDelivered();

    expect(late).toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(false);
    // Reading its position styled it hidden (js-motion is on), so is-in starts a fade: it is finished before the
    // frame paints, and only the block's own transitions (no subtree), so nothing inside it is cut short.
    expect(fade.finish).toHaveBeenCalled();
    expect(late.getAnimations).toHaveBeenCalledWith();
  });

  it("observes a block added below the fold, and reveals it once it enters", async () => {
    const { observer } = await armed();
    const late = fragment(`<section id="late-low" data-reveal data-top="${below + 800}"></section>`);
    document.body.append(late);
    await mutationsDelivered();

    expect(late).not.toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(true);
    observer.fire(late, true);
    expect(late).toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(false);
  });

  it("shows a doodle added on screen drawn (its draw finished, as at arming); one added below draws when it enters", async () => {
    const { observer } = await armed();
    const top = fragment(`<svg id="late-draw-top" class="ks-doodle" data-draw data-top="120"></svg>`);
    const low = fragment(`<svg id="late-draw-low" class="ks-doodle" data-draw data-top="${below + 300}"></svg>`);
    const topDraw = stubAnimations(top);
    const lowDraw = stubAnimations(low);
    document.body.append(top, low);
    await mutationsDelivered();

    expect(top).toHaveClass("is-in");
    expect(topDraw.finish).toHaveBeenCalled();
    expect(top.getAnimations).toHaveBeenCalledWith({ subtree: true });
    expect(observer.observed.has(top)).toBe(false);

    expect(low).not.toHaveClass("is-in");
    expect(observer.observed.has(low)).toBe(true);
    observer.fire(low, true);
    expect(low).toHaveClass("is-in");
    expect(lowDraw.finish).not.toHaveBeenCalled();
  });

  /* Task 3.6 item 3. React streams a late block into a `hidden` holder first and then moves it into place. In the
     holder the block has no layout box (getClientRects() is empty and its rectangle reads 0, 0), which looks "on
     screen" to a top-edge test: shown there, it would skip its reveal wherever it lands. It is observed instead. */
  it("observes an added target with no layout box (inside a hidden streaming holder), and never shows it at once", async () => {
    const { observer } = await armed();
    const holder = document.createElement("div");
    holder.hidden = true;
    const late = fragment(`<section id="streamed" data-reveal></section>`);
    const fade = stubAnimations(late);
    holder.append(late);
    document.body.append(holder);
    await mutationsDelivered();

    expect(late.getClientRects()).toHaveLength(0);
    expect(late).not.toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(true);
    expect(fade.finish).not.toHaveBeenCalled();

    // React moves it out of the holder into its place, below the fold: still waiting, revealed once it enters.
    late.setAttribute("data-top", String(below + 200));
    document.body.append(late);
    holder.remove();
    await mutationsDelivered();
    expect(late.getClientRects()).toHaveLength(1);
    expect(late).not.toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(true);
    observer.fire(late, true);
    expect(late).toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(false);
  });

  it("shows a streamed target at once when it is moved into place on screen", async () => {
    const { observer } = await armed();
    const holder = document.createElement("div");
    holder.hidden = true;
    const late = fragment(`<section id="streamed-top" data-reveal data-top="120"></section>`);
    holder.append(late);
    document.body.append(holder);
    await mutationsDelivered();
    expect(late).not.toHaveClass("is-in");

    document.body.prepend(late);
    holder.remove();
    await mutationsDelivered();
    expect(late).toHaveClass("is-in");
    observer.fire(late, true);
    expect(observer.observed.has(late)).toBe(false);
  });

  it("finds targets anywhere inside an added subtree, deep in the page", async () => {
    const { observer } = await armed();
    const host = document.createElement("div");
    document.body.append(host);
    await mutationsDelivered();
    host.insertAdjacentHTML(
      "beforeend",
      `<article id="island"><div><section id="island-top" data-reveal data-top="40"></section></div>
       <svg id="island-low" class="ks-doodle" data-draw data-top="${below + 50}"></svg><p id="island-still" data-top="${below}"></p></article>`,
    );
    await mutationsDelivered();

    expect(byId("island-top")).toHaveClass("is-in");
    expect(observer.observed.has(byId("island-low"))).toBe(true);
    expect(byId("island")).not.toHaveClass("is-in");
    expect(byId("island-still")).not.toHaveClass("is-in");
    expect([...observer.observed].map((el) => el.id).sort()).toEqual(["draw-low", "island-low", "reveal-low"]);
  });

  it("leaves an added target that already shows alone, and one that left again before it was seen", async () => {
    const { observer } = await armed();
    const shown = fragment(`<section id="kept" class="is-in" data-reveal data-top="${below}"></section>`);
    const gone = fragment(`<section id="gone" data-reveal data-top="${below}"></section>`);
    document.body.append(shown, gone);
    gone.remove();
    await mutationsDelivered();
    expect(observer.observed.has(shown)).toBe(false);
    expect(observer.observed.has(gone)).toBe(false);
    expect(gone).not.toHaveClass("is-in");
  });

  it("uses one MutationObserver, on document.body, for added children anywhere below it", async () => {
    const observe = vi.spyOn(MutationObserver.prototype, "observe");
    await armed();
    const onBody = observe.mock.calls.filter(([target]) => target === document.body);
    expect(onBody).toEqual([[document.body, { childList: true, subtree: true }]]);
  });

  it("stops watching for added targets once it disarms (unmount)", async () => {
    const { view, observer } = await armed();
    view.unmount();
    const late = fragment(`<section id="after-unmount" data-reveal data-top="10"></section>`);
    document.body.append(late);
    await mutationsDelivered();
    expect(late).not.toHaveClass("is-in");
    expect(observer.observed.has(late)).toBe(false);
  });

  it("after a re-arm, hands an added target to the new observer only", async () => {
    const { view, observer: first } = await armed();
    nav.pathname = "/safety";
    view.rerender(<MotionController />);
    await nextFrame();
    const second = FakeObserver.instances[1];

    const late = fragment(`<section id="after-rearm" data-reveal data-top="${below + 10}"></section>`);
    document.body.append(late);
    await mutationsDelivered();
    expect(first.observed.has(late)).toBe(false);
    expect(second.observed.has(late)).toBe(true);
  });

  it("does nothing with an added target under reduced motion", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: query === REDUCE, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn() }) as unknown as MediaQueryList,
    );
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    document.body.append(fragment(`<section id="reduced-late" data-reveal data-top="10"></section>`));
    await mutationsDelivered();
    expect(document.querySelectorAll(".is-in")).toHaveLength(0);
    expect(html()).not.toHaveClass("js-motion");
  });

  it("does nothing with an added target without IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    document.body.innerHTML = PAGE;
    render(<MotionController />);
    await nextFrame();
    document.body.append(fragment(`<section id="no-io-late" data-reveal data-top="10"></section>`));
    await mutationsDelivered();
    expect(document.querySelectorAll(".is-in")).toHaveLength(0);
    expect(html()).not.toHaveClass("js-motion");
  });
});
