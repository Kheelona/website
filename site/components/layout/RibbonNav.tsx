"use client";

import { useEffect, useRef } from "react";

/** Bookmark-ribbon chapter nav (the Pop-up Storybook element the founder
 *  kept): colored tabs at the viewport edge, one per chapter; the open
 *  chapter's ribbon draws out. Pure DOM: works on every tier. */
const CHAPTERS: { id: string; label: string; color: string }[] = [
  { id: "hero", label: "The clearing", color: "var(--color-orange)" },
  { id: "why", label: "Why we exist", color: "var(--color-yellow)" },
  { id: "feelings", label: "The feelings", color: "var(--color-blue)" },
  { id: "lumi", label: "Meet Lumi", color: "var(--color-blue-soft)" },
  { id: "playos-home", label: "PlayOS", color: "var(--color-purple)" },
  { id: "compare", label: "How Lumi compares", color: "var(--color-ink-muted)" },
  { id: "safety-strip", label: "Safety", color: "var(--color-teal)" },
  { id: "journal", label: "Stories", color: "var(--color-orange-deep)" },
  { id: "reserve", label: "Reserve", color: "var(--color-orange)" },
];

export function RibbonNav() {
  const nav = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = nav.current;
    if (!root) return;
    const links = new Map<string, HTMLAnchorElement>();
    root.querySelectorAll<HTMLAnchorElement>("a[data-target]").forEach((a) => {
      links.set(a.dataset.target!, a);
    });
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const link = links.get(e.target.id);
          if (!link) continue;
          links.forEach((a) => a.classList.remove("ribbon-active"));
          link.classList.add("ribbon-active");
        }
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    links.forEach((_, id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <nav ref={nav} aria-label="Chapters" className="ribbon-nav">
      {CHAPTERS.map((c) => (
        <a key={c.id} href={`#${c.id}`} data-target={c.id} style={{ background: c.color }}>
          <span>{c.label}</span>
        </a>
      ))}
    </nav>
  );
}
