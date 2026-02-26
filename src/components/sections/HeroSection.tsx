"use client";

import Image from "next/image";
import { DecoStar } from "@/components/ui/DecoStar";

export function HeroSection() {
  const decorStars = [
    { pos: "left-[12%] bottom-[28%]", color: "tangerine" as const },
    { pos: "right-[18%] bottom-[34%]", color: "muted-orange" as const },
    { pos: "left-[26%] bottom-[32%]", color: "tangerine" as const },
    { pos: "right-[22%] bottom-[20%]", color: "muted-orange" as const },
    { pos: "left-[18%] bottom-[22%]", color: "muted-orange" as const },
    { pos: "right-[28%] bottom-[18%]", color: "tangerine" as const },
    { pos: "left-[34%] bottom-[46%]", color: "tangerine" as const },
    { pos: "right-[14%] bottom-[42%]", color: "muted-orange" as const },
  ];
  return (
    <section className="relative bg-white px-4 pt-15 md:pt-20">
      <div className="mx-auto flex max-w-300 mt-25 flex-col items-center text-center">
        {/* Heading for Mobile - Main h1 */}
        <h1 className="font-heading text-[26px] md:text-[40px] text-stroke-tangerine">
          {/* Show different text on mobile vs desktop, but use same h1 */}
          <span>CAn YOUR TOY TALK?</span>
        </h1>

        {/* Character Image */}
        <div className="w-full ">
          <div className="relative max-w-49 sm:max-w-59 mx-auto">
            <Image
              src="/images/hero-girl.webp"
              alt="Child holding Lumi toy"
              width={230}
              height={569}
              priority
              className="relative h-auto w-full z-1"
            />
            {/* Pills */}
            <span className="absolute -left-[20%] top-[9%] md:-left-[10%] text-tangerine bg-[#FFE8D2] py-0.5 px-3 rounded-full z-0 ">
              ✦ AI Powered
            </span>
            <span className="absolute left-[68%] top-[16%] text-sky-blue bg-[#DBF2FF] py-0.5  whitespace-nowrap px-3 rounded-full z-0">
              ✦ 10+ Languages
            </span>
            <span className="absolute -left-[35%] top-[20%] md:-left-[20%] text-muted-orange bg-[#FFEDDB] py-0.5 px-3 rounded-full z-0">
              ✦ 0% Screen time
            </span>
          </div>
        </div>
        {/* Decorative stars */}
        {decorStars.map((star, i) => (
          <DecoStar key={i} position={star.pos} color={star.color} />
        ))}
      </div>
    </section>
  );
}
