"use client";

import React from "react";
import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

// Partner logos
const partners = [
  {
    id: 1,
    name: "ELEVATE",
    image: "/images/logos/elevateLogo.svg",
  },
  {
    id: 2,
    name: "NASSCOM",
    image: "/images/logos/nasscomLogo.svg",
  },
];

// Displays partner logos
const TrustBadges = ({ bg = "" }: { bg?: string }) => {
  return (
    <section className={`w-full py-5 px-5 md:py-15 ${bg}`}>
      <div className="mx-auto max-w-350 rounded-2xl border border-[#B0B0B0] bg-white pt-10 pb-5 md:pb-10">
        <SectionHeader title="Kheelona is backed by" />
        <div className="flex justify-center items-center mt-5 ">
          {/* Render with dividers */}
          {partners.map((partner) => (
            <React.Fragment key={partner.id}>
              {partner.id > 1 && (
                <div className="mx-8 md:mx-12 w-0 h-15 md:h-20 border-l border-black" />
              )}
              <div className="flex items-center">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  width={140}
                  height={140}
                  className="w-25 md:w-35 h-35 object-contain"
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
