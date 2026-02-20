"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutHeroSection() {
  return (
    <section className="relative pt-16 px-4 md:pt-24" aria-labelledby="hero-heading">
      <div className="max-w-6xl mx-auto">
        {/* 1. Heading */}
        <SectionHeader id="about-heading" title="The Story of Kheelona" />

        {/* 2. Subtitle */}
        <p className="text-[16px] md:text-[32px] font-medium w-full md:w-152.5 text-center mb-12 max-w-3xl mx-auto md:leading-9">
          We’re building Kheelona <br />
          Because every child deserves a best friend that actually
          <span className="text-sky-blue"> listens</span>.
        </p>

        <Image
          src={"/images/about/HeroSection.jpg"}
          alt="Kheelona Hero Image"
          width={1200}
          height={640}
          className="w-75.25 h-35.5 md:w-150 md:h-80 object-contain mx-auto"
        />
        <p className="text-[10px] md:text-[14px] text-center mb-12 mt-1">
          Kheelona receiving Award and Grants from Govt. of Karnataka
        </p>

        {/* 4. Subheading */}
        <div className="text-center mt-15 mb-16">
          <SectionHeader id="about-hero-heading" title="How it all started?" />
        </div>

        <div className="flex gap-1 md:gap-8 items-end">
          <div className="w-2/5  flex items-end justify-center">
            <Image
              src={"/images/about/ApoorvaAction.png"}
              alt="Kheelona Hero Image"
              width={540}
              height={440}
              className="w-33.75 h-27.5 md:w-50 md:h-full object-contain mx-auto"
            />
          </div>
          <div className="w-3/5 px-2 md:p-12 rounded-2xl">
            <p className="text-[12px] md:text-[20px] font-medium leading-3.5 md:leading-5">
              Apoorva watched his two-year-old ignore a shelf full of expensive, static toys to
              stare at a glowing screen. The toys were beautiful, but they were &quot;dead.&quot;
              The moment a human spoke to her, she lit up.
            </p>
            <p className="text-[12px] md:text-[20px] mt-10 font-semibold text-end">
              ~Apoorva, (Founder)
            </p>
          </div>
        </div>
        <div className="border border-b -mx-4 border-[#868686]"></div>

        <div className="flex gap-1 md:gap-8 items-end pt-10">
          <div className="w-3/5 px-2 md:p-12 rounded-2xl">
            <p className="ext-[12px] md:text-[20px] font-medium leading-3.5 md:leading-5">
              Aman and Apoorva then realised the $100B toy industry was stuck in the past, selling
              plastic while the world moved to AI. Then they decided to change that. Now we
              aren&apos;t just making &quot;smart toys&quot;, we are building how the toys will feel
              like, from now on.
            </p>
            <p className="text-[12px] md:text-[20px] mt-10 font-semibold text-end">
              ~Aman Soni, (Founder)
            </p>
          </div>
          <div className="w-2/5  flex items-end justify-center">
            <Image
              src={"/images/about/AmanAction.png"}
              alt="Kheelona Hero Image"
              width={540}
              height={460}
              className="w-33.75 h-28.75 md:w-50 md:h-full object-contain mx-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
