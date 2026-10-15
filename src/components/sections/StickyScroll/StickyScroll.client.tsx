"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** The reading line: a thin band across the screen a little above its middle. The point crossing it is the one being
 *  read; between two points the last one stays. */
const READING_BAND = "-40% 0px -55% 0px";

/**
 * StickyScroll's island (task Q2.9; the D2C plan v2 §1.6): which point is being read. One IntersectionObserver watches
 * the points (`[data-point]`) against a thin band a little above the screen's middle; the point crossing it marks its
 * picture on the stage (`[data-stage] > *`) and every progress step up to it (`[data-progress] > *`) with `data-on`.
 * That is all it does: the crossfade and the fill are sticky-scroll.css's, on DS motion tokens, under
 * `prefers-reduced-motion: no-preference` only, and the stage and the progress line show from 900 px only. Without
 * JavaScript the server's first picture and first step stay on. The points, the stage and the line are the server's
 * markup, passed in as children; the island only adds and removes one attribute.
 */
export function StickyScrollIsland({ children }: { readonly children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const grid = root.current;
    if (!grid || typeof IntersectionObserver === "undefined") return;
    const points = [...grid.querySelectorAll<HTMLElement>("[data-point]")];
    const pictures = [...grid.querySelectorAll<HTMLElement>("[data-stage] > *")];
    const steps = [...grid.querySelectorAll<HTMLElement>("[data-progress] > *")];
    const show = (active: number) => {
      pictures.forEach((picture, i) => picture.toggleAttribute("data-on", i === active));
      steps.forEach((step, i) => step.toggleAttribute("data-on", i <= active));
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) show(points.indexOf(entry.target as HTMLElement));
      },
      { rootMargin: READING_BAND },
    );
    for (const point of points) observer.observe(point);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="kh-split kh-split--wide-end ks-sticky__grid" ref={root}>
      {children}
    </div>
  );
}
