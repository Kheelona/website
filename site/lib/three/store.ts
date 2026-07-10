import { createStore } from "zustand/vanilla";

/** Transient scroll/pointer state for the 3D stage. Written by passive DOM
 *  listeners, read with getState() inside useFrame (no React re-renders:
 *  native scroll stays sharp, the world lags it by damped smoothing). */
export type BeatRect = { id: string; top: number; height: number };

/** A copy container's box in document pixel coords (viewport-independent;
 *  converted to NDC per frame with scrollY, no DOM reads). */
export type ContentRect = { left: number; right: number; top: number; bottom: number };

export type StageState = {
  /** continuous position along the journey: beatIndex + progress inside it */
  journey: number;
  beatCount: number;
  /** normalized pointer, -1..1, viewport-centered */
  px: number;
  py: number;
  beats: BeatRect[];
  /** measured [data-content] rects: the keep-out zones floating shapes fade
   *  behind (lib/three/exclusion.ts) */
  contentRects: ContentRect[];
  scrollY: number;
  viewW: number;
  viewH: number;
  /** interior ambient stages (lib/three/ambient.ts): sky stops measured from
   *  the page's own [data-wash] sections + continuous position across them */
  washStops: string[];
  washJourney: number;
};

export const stageStore = createStore<StageState>(() => ({
  journey: 0,
  beatCount: 1,
  px: 0,
  py: 0,
  beats: [],
  contentRects: [],
  scrollY: 0,
  viewW: 1,
  viewH: 1,
  washStops: [],
  washJourney: 0,
}));

function computeJourney(beats: BeatRect[]): number {
  if (!beats.length) return 0;
  // A beat's progress runs while its top travels from just below the viewport
  // top to its own height past it: journey 0 at page top (the camera starts
  // AT the clearing, not halfway into it), and it saturates at the finale so
  // the camera dwells there instead of driving through the last place.
  const anchor = window.scrollY + window.innerHeight * 0.15;
  let j = 0;
  for (let i = 0; i < beats.length; i++) {
    const b = beats[i];
    if (anchor < b.top) break;
    const t = Math.min((anchor - b.top) / Math.max(b.height, 1), 1);
    j = i + t;
  }
  return Math.min(j, beats.length - 1 + 0.35);
}

/** Measure [data-beat] sections, subscribe to scroll/pointer/resize.
 *  Returns a cleanup fn. Layout reads happen only on (re)measure. */
export function initStageTracking(): () => void {
  const measure = () => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-beat]"));
    const beats = els.map((el) => {
      const r = el.getBoundingClientRect();
      return {
        id: el.dataset.beat ?? "",
        top: r.top + window.scrollY,
        height: r.height,
      };
    });

    // copy containers, in document coords (layout reads only here)
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
      beats,
      beatCount: Math.max(beats.length, 1),
      contentRects,
      scrollY: window.scrollY,
      viewW: window.innerWidth || 1,
      viewH: window.innerHeight || 1,
    });
    stageStore.setState({ journey: computeJourney(beats) });
  };

  const onScroll = () => {
    stageStore.setState({
      journey: computeJourney(stageStore.getState().beats),
      scrollY: window.scrollY,
    });
  };
  const onPointer = (e: PointerEvent) => {
    stageStore.setState({
      px: (e.clientX / window.innerWidth) * 2 - 1,
      py: (e.clientY / window.innerHeight) * 2 - 1,
    });
  };

  measure();
  // re-measure when layout can change (fonts, images, viewport)
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
