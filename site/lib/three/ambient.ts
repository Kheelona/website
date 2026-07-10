import { stageStore } from "./store";

/** Interior ambient scenes (§8.13): the sky's color timeline is measured from
 *  the page's own [data-wash] sections, so a route can never drift from its
 *  DOM washes — the DOM is the source. No per-route wash arrays to hand-sync.
 *
 *  Same contract as the journey store: layout reads happen only on
 *  (re)measure; scroll/pointer handlers write numbers into the store, the
 *  frame loop reads with getState(). */

/** Sky color per wash name. Tracks the journey's BEAT_WASHES treatment:
 *  teal uses the softened garden light (raw #1ABC9C would glare as a sky);
 *  orange sections keep their own opaque DOM paint, the stop is a formality. */
const WASH_SKY: Record<string, string> = {
  white: "#FFFFFF",
  cream: "#FFF7EE",
  cool: "#EAF6FC",
  sun: "#FDF1E2",
  teal: "#D9F4EC", // soft garden light; the band itself keeps opaque teal-deep paint
  orange: "#C25210", // matches the orange-cta band (R5 white-label migration)
};

type WashRect = { top: number; height: number };

let washRects: WashRect[] = [];

function computeWashJourney(): number {
  if (!washRects.length) return 0;
  const anchor = window.scrollY + window.innerHeight * 0.5;
  let j = 0;
  for (let i = 0; i < washRects.length; i++) {
    const w = washRects[i];
    if (anchor < w.top) break;
    const t = Math.min((anchor - w.top) / Math.max(w.height, 1), 1);
    // hold the section's color, blend only through its last third
    j = i + Math.max(0, (t - 0.66) / 0.34);
  }
  return Math.min(j, washRects.length - 1);
}

/** Measure [data-wash] sections + [data-content] copy rects, subscribe to
 *  scroll/pointer/resize. Returns a cleanup fn. */
export function initAmbientTracking(): () => void {
  const measure = () => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-wash]"));
    washRects = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return { top: r.top + window.scrollY, height: r.height };
    });
    const washStops = sections.map(
      (el) => WASH_SKY[el.dataset.wash ?? "white"] ?? WASH_SKY.white,
    );

    const contentRects = Array.from(
      document.querySelectorAll<HTMLElement>("[data-content]"),
    ).map((el) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left,
        right: r.right,
        top: r.top + window.scrollY,
        bottom: r.bottom + window.scrollY,
      };
    });

    stageStore.setState({
      washStops,
      washJourney: computeWashJourney(),
      contentRects,
      scrollY: window.scrollY,
      viewW: window.innerWidth || 1,
      viewH: window.innerHeight || 1,
    });
  };

  const onScroll = () => {
    stageStore.setState({ washJourney: computeWashJourney(), scrollY: window.scrollY });
  };
  const onPointer = (e: PointerEvent) => {
    stageStore.setState({
      px: (e.clientX / window.innerWidth) * 2 - 1,
      py: (e.clientY / window.innerHeight) * 2 - 1,
    });
  };

  measure();
  const ro = new ResizeObserver(() => measure());
  ro.observe(document.body);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });
  window.addEventListener("orientationchange", measure);

  return () => {
    ro.disconnect();
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("pointermove", onPointer);
    window.removeEventListener("orientationchange", measure);
  };
}
