"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function AboutHeroSection() {
  return (
    <section className="relative pt-10 px-4 md:pt-15" aria-labelledby="hero-heading">
      <div>
        {/* 1. Heading */}
        <SectionHeader id="about-heading" title="The Story of Kheelona" />
        {/* 2. Subtitle */}
        <p className="text-[16px] md:text-[26px] font-medium w-70 md:w-152.5 text-center mb-12 max-w-3xl mx-auto leading-5 md:leading-7">
          We’re building <b>Kheelona</b> <br />
          Because every child deserves a best friend that actually
          <span className="text-sky-blue"> listens</span>.
        </p>
        <Image
          src={"/images/about/HeroSection.jpg"}
          alt="Kheelona Hero Image"
          width={1200}
          height={640}
          className="w-65.25 h-35.5 md:w-200 md:h-105 object-cover mx-auto rounded-2xl"
        />
        <p className="text-[10px] md:text-[14px] text-center mb-12 mt-1">
          Kheelona receiving Award and Grants from Govt. of Karnataka
        </p>
        {/* 4. Subheading */}
        <div className="text-center my-10 md:mt-15 md:mb-16">
          <SectionHeader id="about-hero-heading" title="How it all started?" />
        </div>
        <div className="flex gap-1 md:gap-2 items-end max-w-5xl mx-auto">
          <div className="w-3/7 md:w-2/7 flex items-end">
            <Image
              src={"/images/about/ApoorvaAction.png"}
              alt="Kheelona Hero Image"
              width={540}
              height={440}
              className="h-full md:w-65 md:h-full object-contain"
            />
          </div>
          <div className="w-4/7 md:w-5/7 px-2 flex flex-col justify-end">
            <p className="text-[13px] md:text-[20px] font-medium leading-4 md:leading-6">
              Apoorva watched his two-year-old ignore a shelf full of expensive, static toys to
              stare at a glowing screen. The toys were beautiful, but they were &quot;dead.&quot;
              The moment a human spoke to her, she lit up.
            </p>
            <p className="text-[12px] md:text-[20px] my-2 md:my-5 font-semibold text-end">
              ~Apoorva, (Founder)
            </p>
          </div>
        </div>
        <div className="border border-b -mx-4 border-[#868686]"></div>
        <div className="flex gap-1 md:gap-8 items-end pt-10 max-w-5xl mx-auto">
          <div className="w-4/7 md:w-5/7 px-2">
            <p className="text-[13px] md:text-[20px] font-medium leading-4 md:leading-6">
              Aman and Apoorva then realised the <b>$100B</b> toy industry was stuck in the past,
              selling plastic while the world moved to AI. Then they decided to change that. Now we
              aren&apos;t just making &quot;smart toys&quot;,{" "}
              <b>We are building how the toys will feel like, from now on.</b>
            </p>
            <p className="text-[12px] md:text-[20px] my-2 md:my-5 font-semibold text-end">
              ~Aman Soni, (Founder)
            </p>
          </div>
          <div className="w-3/7 md:w-2/7 flex items-end justify-end">
            <Image
              src={"/images/about/AmanAction.png"}
              alt="Kheelona Hero Image"
              width={540}
              height={460}
              className="w-33.75 h-28.75 md:w-65 md:h-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
