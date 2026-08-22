"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import {
  KHEELU_POSES,
  KHEELU_POSE_NAMES,
  kheeluPoseSrc,
  type KheeluPose,
} from "@/lib/kheelu-poses";
import { PREORDER_HREF, PREORDER_LABEL } from "@/config/site";
import { PRESS } from "@/lib/interactions";

/** The persistent Kheelu guide (revamp M1, theme B's signature device).
 *
 *  Kheelu sits fixed bottom-left and narrates the page: an
 *  IntersectionObserver watches every `[data-say]` section (Room's `guide` +
 *  `say` props) and the section straddling the viewport centreline sets his
 *  pose and speech line. Clicking him is a "poke". On phones he docks into a
 *  slim bottom bar that ALSO carries the reserve CTA — this absorbs the old
 *  StickyMobileCTA (one fixed bottom element, same hide-while-#reserve-visible
 *  contract).
 *
 *  Accessibility contract (hard rules):
 *  - The bubble text paraphrases visible content, so it is aria-hidden and
 *    there are NO live regions — the narration never churns the a11y tree.
 *  - Exactly one tab stop on desktop (the poke button); the dock's reserve
 *    link is the mobile stop.
 *  - `html:not(.js) [data-kheelu-guide]` hides the whole widget without JS.
 *  - Reduced motion: no follow, no bob, no poke bounce (CSS-gated); pose and
 *    line still swap instantly.
 *
 *  GATED:kheelu-line — every line Kheelu speaks (data-say values on pages +
 *  the poke lines below) requires founder sign-off before production merge.
 *  Queue: docs/revamp-2026-07/copy-v2.md. */
const POKE_LINES = [
  "Hehe, that tickles.",
  "Oi, mind the fur.",
  "Ready when you are.",
  "Come on, this way.",
  "I've got you.",
] as const;

export function KheeluGuide({ defaultPose = "hero-wink" }: { defaultPose?: KheeluPose }) {
  const pathname = usePathname();
  const [pose, setPose] = useState<KheeluPose>(defaultPose);
  const [say, setSay] = useState("");
  const [pokeSay, setPokeSay] = useState("");
  const [poking, setPoking] = useState(false);
  const [reserveVisible, setReserveVisible] = useState(false);
  const [heroArtVisible, setHeroArtVisible] = useState(false);
  const followRef = useRef<HTMLDivElement>(null);
  const pokeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* Section sensing, re-armed per route (client navigation replaces the
     page's [data-say] nodes — the StickyMobileCTA lesson, QA 2026-07-10). */
  useEffect(() => {
    setPose(defaultPose);
    setSay("");
    setPokeSay("");
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-say]"));
    if (nodes.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          const g = el.dataset.guide as KheeluPose | undefined;
          if (g && g in KHEELU_POSES) setPose(g);
          setSay(el.dataset.say ?? "");
        }
      },
      // the section straddling the viewport centreline wins
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [pathname, defaultPose]);

  /* Hide the mobile dock while the #reserve finale is on screen (inherited
     StickyMobileCTA contract: a second pre-order button floating over the one
     you are already reading is noise). Desktop Kheelu stays. */
  useEffect(() => {
    const reserve = document.getElementById("reserve");
    setReserveVisible(false);
    if (!reserve) return;
    const io = new IntersectionObserver(
      (entries) => setReserveVisible(entries.some((e) => e.isIntersecting)),
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(reserve);
    return () => io.disconnect();
  }, [pathname]);

  /* V5-5: hold the DESKTOP guide back while hero art that already contains
     Kheelu is on screen. REV-a's final artwork is Kheelu whispering to Lumi, so
     the corner guide put the same character on screen twice in the first
     impression — a craft flaw the M2 notes predicted and the final art locked
     in rather than removed. He fades in once the art has scrolled away, which
     also gives him a proper entrance instead of being there from frame one.
     Only pages whose hero carries Kheelu opt in, via [data-hero-has-kheelu].
     The mobile dock is unaffected: it sits below the fold, never beside the
     art. */
  useEffect(() => {
    const art = document.querySelector("[data-hero-has-kheelu]");
    setHeroArtVisible(false);
    if (!art) return;
    const io = new IntersectionObserver(
      (entries) => setHeroArtVisible(entries.some((e) => e.isIntersecting)),
      // most of the art has to leave before he appears, so they never overlap
      { threshold: 0.25 },
    );
    io.observe(art);
    return () => io.disconnect();
  }, [pathname]);

  /* Pointer follow: desktop fine-pointer + motion-ok only. The rAF loop is
     self-stopping (runs only while converging) and pauses on hidden tabs. */
  useEffect(() => {
    const fine = window.matchMedia("(min-width: 861px) and (pointer: fine)");
    const motionOk = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const el = followRef.current;
    if (!fine.matches || !motionOk.matches || !el) return;

    let raf = 0;
    let running = false;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--gx", `${cx.toFixed(2)}px`);
      el.style.setProperty("--gy", `${cy.toFixed(2)}px`);
      el.style.setProperty("--gr", `${(cx * 0.25).toFixed(2)}deg`);
      if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.05 && !document.hidden) {
        raf = requestAnimationFrame(tick);
      } else {
        running = false;
      }
    };
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 10;
      ty = (e.clientY / window.innerHeight - 0.5) * 6;
      if (!running && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };
    const onVisibility = () => {
      if (document.hidden && running) {
        cancelAnimationFrame(raf);
        running = false;
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(raf);
    };
  }, []);

  const poke = useCallback(() => {
    setPokeSay(POKE_LINES[Math.floor(Math.random() * POKE_LINES.length)]);
    if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      setPoking(true);
    }
    if (pokeTimer.current) clearTimeout(pokeTimer.current);
    pokeTimer.current = setTimeout(() => {
      setPokeSay("");
      setPoking(false);
    }, 1600);
  }, []);

  useEffect(
    () => () => {
      if (pokeTimer.current) clearTimeout(pokeTimer.current);
    },
    [],
  );

  const line = pokeSay || say;

  return (
    <aside aria-label="Kheelu, your guide" data-kheelu-guide>
      {/* Desktop: the corner guide.
          V4 (team feedback 2026-07-30): moved to the bottom-RIGHT — room copy
          is left-aligned, so the right corner overlays whitespace and media
          instead of words — and he shrinks below 1320px, where the track
          leaves him the least room. Bubble narrowed to match, with the §5.1
          law capping say lines at 48 characters so it never wraps past two
          lines. */}
      <div
        className={cn(
          "pointer-events-none fixed bottom-[22px] right-[22px] z-40 hidden md:block",
          // V5-5: he waits out hero art that already shows him, then fades in
          "transition-opacity duration-500 ease-(--ease-calm) motion-reduce:transition-none",
          heroArtVisible ? "opacity-0" : "opacity-100",
        )}
        /* aria-hidden alone is a violation while the poke button inside stays
           focusable ("aria-hidden element must not contain focusable
           elements"), so the button drops out of the tab order with it. */
        aria-hidden={heroArtVisible || undefined}
      >
        <div ref={followRef} className="kheelu-guide-follow flex flex-col items-end">
          {line ? (
            <div
              aria-hidden="true"
              key={line}
              className="kheelu-guide-bubble relative mb-3 w-max max-w-[220px] rounded-(--radius-card) border border-line-soft bg-white px-4 py-2.5 shadow-(--shadow-room-sm)"
            >
              <span className="absolute -bottom-[7px] right-7 h-3.5 w-3.5 rotate-45 border-b border-r border-line-soft bg-white" />
              <p className="font-display text-[15px] font-bold leading-snug text-ink-head">
                {line}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            aria-label="Give Kheelu a poke"
            onClick={poke}
            /* leaves the tab order while the wrapper is aria-hidden, so the
               hidden guide is never a focus trap for a keyboard visitor */
            tabIndex={heroArtVisible ? -1 : 0}
            className={cn(
              "kheelu-guide-idle pointer-events-auto flex h-[132px] cursor-pointer items-end justify-end rounded-(--radius-card) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 min-[1320px]:h-[168px]",
              poking && "kheelu-guide-poke",
            )}
          >
            {/* all poses stay mounted and pre-decoded; swapping is an
                opacity-free class flip — no decode flash, no request storm */}
            {KHEELU_POSE_NAMES.map((p) => (
              <Image
                key={p}
                src={kheeluPoseSrc(p)}
                alt=""
                width={KHEELU_POSES[p].w}
                height={KHEELU_POSES[p].h}
                sizes="132px"
                loading={p === defaultPose ? undefined : "lazy"}
                className={cn("h-full w-auto", p === pose ? "block" : "hidden")}
              />
            ))}
          </button>
        </div>
      </div>

      {/* Mobile: the dock (absorbs StickyMobileCTA — one fixed bottom bar) */}
      {!reserveVisible && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line-soft bg-white/95 backdrop-blur-sm md:hidden">
          <div className="flex items-center gap-3 px-4 py-2.5">
            <Image
              src={kheeluPoseSrc(pose)}
              alt=""
              width={KHEELU_POSES[pose].w}
              height={KHEELU_POSES[pose].h}
              sizes="46px"
              className="h-[46px] w-auto shrink-0"
            />
            <p
              aria-hidden="true"
              className="min-w-0 flex-1 truncate font-display text-[14px] font-bold text-ink-head"
            >
              {line}
            </p>
            <a
              href={PREORDER_HREF}
              className={`shrink-0 rounded-full bg-action px-4 py-3 text-[14px] font-bold leading-none text-ink-head shadow-cta ${PRESS}`}
            >
              {PREORDER_LABEL}
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}
