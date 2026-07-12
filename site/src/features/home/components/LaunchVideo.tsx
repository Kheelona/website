"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/atoms/Container";
import { Section } from "@/components/atoms/Section";
import { CurveDivider } from "@/components/atoms/CurveDivider";
import { Reveal } from "@/components/molecules/Reveal";
import { KheeluSays } from "@/components/molecules/KheeluSays";

/** Home S02c: the ambient launch film (real product photography, 20s loop).
 *  Autoplays muted only for users who have not asked for less motion or data;
 *  pauses whenever it leaves the viewport. All text in the film is verbatim
 *  site copy, so nothing here is content a screen reader misses. */
export function LaunchVideo() {
  const video = useRef<HTMLVideoElement>(null);
  const [ambient, setAmbient] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as unknown as { connection?: { saveData?: boolean } })
      .connection;
    if (reduce || conn?.saveData) return;
    setAmbient(true);
    const el = video.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) el.play().catch(() => {});
          else el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Section wash="cream">
      {/* R10: KheeluIntro (white) now precedes this section since
          StagedIntro retired — the curve keeps the wash handoff soft */}
      <CurveDivider from="white" flip />
      <Container className="pb-16 pt-2 md:pb-24">
        <Reveal>
          <KheeluSays line="Press play. I will wait." pose="silly" />
        </Reveal>
        <Reveal>
          <video
            ref={video}
            muted
            loop
            playsInline
            autoPlay={ambient}
            controls={!ambient}
            preload="none"
            // with preload=none there is no metadata to size the box from;
            // explicit dimensions keep the document height stable (no CLS,
            // no smooth-scroll landing drift)
            width={1920}
            height={1080}
            poster="/video/launch-poster.jpg"
            src="/video/launch.mp4"
            aria-label="A short film of the Lumi talking toy: it listens first, then talks back, in the three colors, with the launch price of 4,999 rupees"
            className="w-full rounded-(--radius-card-lg) shadow-[0_24px_60px_rgba(216,95,27,0.16)]"
          />
        </Reveal>
      </Container>
    </Section>
  );
}
