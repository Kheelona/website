"use client";

import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

const testimonials = [
  {
    quote: "My child's best friend. She takes Lumi everywhere.",
    name: "Gaurav Guha",
    meta: "Parent of a 4 year old.",
    avatar: "/images/test2.jpg",
  },
  {
    quote:
      "As a working mom in Bangalore, I was honestly tired of feeling guilty about screen time. Lumi changed that for me. Thank you.",
    name: "Shweta Kiran",
    meta: "Parent of a 3 year old.",
    avatar: "/images/test.jpg",
  },
  {
    quote: "Lumi is now part of our daily routine. My kid actually asks for it.",
    name: "Ananya Das",
    meta: "Parent of a 5 year old.",
    avatar: "/images/test3.png",
  },
  {
    quote: "Finally something that keeps my child engaged without a screen.",
    name: "Deepika",
    meta: "Parent of a 4 year old.",
    avatar: "/images/test4.png",
  },
];

export default function Testimonials() {
  // ref to scroll viewport
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const testimonialRefs = React.useRef<Array<HTMLElement | null>>([]);
  const [active, setActive] = React.useState(0);
  const [scrollPositions, setScrollPositions] = React.useState<number[]>([]);

  const calculateScrollPositions = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return [];

    const maxScroll = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    const positions = testimonialRefs.current
      .map((item) => (item ? Math.min(item.offsetLeft, maxScroll) : null))
      .filter((value): value is number => value !== null);

    const deduped: number[] = [];
    positions.forEach((value) => {
      if (!deduped.some((existing) => Math.abs(existing - value) < 1)) {
        deduped.push(value);
      }
    });

    return deduped;
  }, []);

  const updateActive = React.useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const positions = calculateScrollPositions();
    if (!positions.length) return;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    positions.forEach((position, index) => {
      const distance = Math.abs(position - viewport.scrollLeft);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActive(closestIndex);
  }, [calculateScrollPositions]);

  // smooth scroll to a card by index
  const scrollTo = React.useCallback(
    (index: number) => {
      if (!viewportRef.current || !scrollPositions.length) return;

      viewportRef.current.scrollTo({
        left: scrollPositions[index],
        behavior: "smooth",
      });
    },
    [scrollPositions]
  );

  React.useEffect(() => {
    const sync = () => {
      const positions = calculateScrollPositions();
      setScrollPositions(positions);
      setActive((prev) => Math.min(prev, Math.max(0, positions.length - 1)));
      updateActive();
    };

    const rafId = window.requestAnimationFrame(sync);
    window.addEventListener("resize", sync);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", sync);
    };
  }, [calculateScrollPositions, updateActive]);

  return (
    <section id="testimonials" className="pt-5 pb-20" aria-labelledby="testimonials-heading">
      <SectionHeader id="testimonials-heading" title="WHAT THE PARENTS SAY?" />

      <ScrollArea.Root className="relative w-full mt-3 md:mt-5">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="w-full flex overflow-x-auto"
          onScroll={updateActive}
        >
          <div className="flex gap-8 p-4">
            {testimonials.map((t, i) => (
              <article
                key={i}
                ref={(el) => {
                  testimonialRefs.current[i] = el;
                }}
                className="shrink-0"
              >
                {/* single testimonial card */}
                <div className="relative shrink-0 w-55 md:w-90 rounded-2xl border border-gray-300 p-6 bg-white h-40 mb-5">
                  <blockquote className=" text-[13px] md:text-[18px] font-semibold leading-[110%]">
                    &quot;{t.quote}&quot;
                  </blockquote>

                  <div
                    className="absolute bottom-5 left-5 flex gap-1 text-yellow-400"
                    aria-label="5 star rating"
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} aria-hidden="true">
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <footer className="flex gap-2 items-center">
                  <div className="flex items-center gap-3">
                    <Image
                      src={t.avatar}
                      alt={`${t.name} profile picture`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase font-heading text-[16px] md:text-[20px]">
                      {t.name}
                    </h3>
                    <p className="text-[14px] md:text-[17px] text-gray-600">{t.meta}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" /> <ScrollArea.Corner />
      </ScrollArea.Root>

      <div className="mt-10 flex justify-center gap-2">
        {scrollPositions.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            aria-label={`Go to testimonial group ${i + 1}`}
            className={clsx(
              "flex min-h-11 min-w-11 items-center justify-center rounded-full transition-all",
              active === i ? "bg-orange-100" : "bg-transparent"
            )}
          >
            <span
              aria-hidden="true"
              className={clsx(
                "h-2 rounded-full transition-all",
                active === i ? "w-6 bg-orange-500" : "w-2 bg-orange-300"
              )}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
