"use client";

import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden bg-white px-4 pt-15 md:pt-20">
      <div className="mx-auto flex max-w-300 mt-25 flex-col items-center text-center">
        {/* Heading for Mobile */}
        <h1 className="mb-6 font-heading text-[26px] md:hidden text-stroke-tangerine">
          SMARTEST PLAYMATES FOR BRIGHTEST MINDS.
        </h1>
        {/* Heading for Desktop */}
        <h2 className="mb-6 hidden font-heading  text-[44px] md:block text-stroke-tangerine ">
          CAn YOUR TOY TALK?
        </h2>

        {/* Character Image */}
        <div className="absolute bottom-0 md:mt-0 mt-10 w-full ">
          <div className="relative max-w-59 mx-auto">
            <Image
              src="/images/hero-girl.webp"
              alt="Child holding Lumi toy"
              width={230}
              height={569}
              priority
              className="relative h-auto w-full z-1"
            />
            {/* Pills */}
            <span className="absolute -left-[10%] top-[9%] text-tangerine bg-[#FFE8D2] py-0.5 px-3 rounded-full z-0">
              ✦ AI Powered
            </span>
            <span className="absolute left-[68%] top-[16%] text-sky-blue bg-[#DBF2FF] py-0.5  whitespace-nowrap px-3 rounded-full z-0">
              ✦ 10+ Languages
            </span>
            <span className="absolute -left-[20%] top-[20%] text-muted-orange bg-[#FFEDDB] py-0.5 px-3 rounded-full z-0">
              ✦ 0% Screen time
            </span>
          </div>
        </div>
        {/* Decorative stars */}
        <span className="absolute left-[12%] bottom-[28%] text-tangerine">✦</span>
        <span className="absolute right-[18%] bottom-[34%] text-muted-orange">✦</span>
        <span className="absolute left-[26%] bottom-[32%] text-tangerine">✦</span>

        <span className="absolute right-[22%] bottom-[20%] text-muted-orange">✦</span>
        <span className="absolute right-[35%] bottom-[52%] text-muted-orange">✦</span>
        <span className="absolute left-[18%] bottom-[22%] text-muted-orange">✦</span>

        <span className="absolute right-[28%] bottom-[18%] text-tangerine">✦</span>
        <span className="absolute left-[34%] bottom-[46%] text-tangerine">✦</span>
        <span className="absolute right-[14%] bottom-[42%] text-muted-orange">✦</span>
      </div>
    </section>
  );
}
