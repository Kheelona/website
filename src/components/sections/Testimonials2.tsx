"use client";

import * as React from "react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import clsx from "clsx";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

// card width in px
const CARD_WIDTH = 400; // must match card width
// horizontal gap between cards in px
const GAP = 16; // gap-4 = 16px

const testimonials = [
  {
    quote: "My child's best friend. She takes Lumi everywhere.",
    name: "Gaurav Guha",
    meta: "Parent of a 4 year old.",
    avatar: "/images/testimonial.png",
  },
  {
    quote:
      "As a working mom in Bangalore, I was honestly tired of feeling guilty about screen time. Lumi changed that for me. Thank you.",
    name: "Shweta Kiran",
    meta: "Parent of a 3 year old.",
    avatar: "/images/testimonial.png",
  },
  {
    quote: "Lumi is now part of our daily routine. My kid actually asks for it.",
    name: "Rohit Mehra",
    meta: "Parent of a 5 year old.",
    avatar: "/images/testimonial.png",
  },
  {
    quote: "Finally something that keeps my child engaged without a screen.",
    name: "Ananya Das",
    meta: "Parent of a 4 year old.",
    avatar: "/images/testimonial.png",
  },
  {
    quote: "My child's best friend. She takes Lumi everywhere.",
    name: "Gaurav Guha",
    meta: "Parent of a 4 year old.",
    avatar: "/images/testimonial.png",
  },
];

export default function Testimonials() {
  // ref to scroll viewport
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const [active, setActive] = React.useState(0);

  // smooth scroll to a card by index
  const scrollTo = (index: number) => {
    if (!viewportRef.current) return;
    viewportRef.current.scrollTo({
      left: index * (CARD_WIDTH + GAP),
      behavior: "smooth",
    });
  };

  return (
    <section className="pt-20">
      <SectionHeader title="WHAT THE PARENTS SAY?" />

      <ScrollArea.Root className="relative w-full mt-10">
        <ScrollArea.Viewport
          ref={viewportRef}
          className="w-full flex overflow-x-auto"
          onScroll={(e) => {
            const el = e.currentTarget;
            // compute active index from scroll position
            const index = Math.round(el.scrollLeft / (CARD_WIDTH + GAP));
            setActive(index);
          }}
        >
          <div className="flex gap-4 p-4">
            {testimonials.map((t, i) => (
              <article key={i}>
                {/* single testimonial card */}
                <div className="relative shrink-0 w-100 rounded-2xl border border-gray-300 p-6 bg-white h-50 mb-5">
                  <blockquote className="mb-6 text-[22px] font-medium  leading-[110%]">
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
                    <h3 className="font-bold uppercase font-heading text-[22px]">{t.name}</h3>
                    <p className=" text-[17px] text-gray-600">{t.meta}</p>
                  </div>
                </footer>
              </article>
            ))}
          </div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="horizontal" /> <ScrollArea.Corner />
      </ScrollArea.Root>

      <div className="mt-10 flex justify-center gap-2">
        {testimonials.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            className={clsx(
              "h-2 rounded-full transition-all",
              active === i ? "w-6 bg-orange-500" : "w-2 bg-orange-300"
            )}
          />
        ))}
      </div>
      <div className="w-full">
        <Image
          src="/images/community.webp"
          alt="Parenting Community"
          width={2400}
          height={600}
          className="mx-auto"
          priority
        />
      </div>
    </section>
  );
}
