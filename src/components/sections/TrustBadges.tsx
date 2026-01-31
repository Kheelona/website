"use client";

import React from "react";

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
const TrustBadges = () => {
  return (
    <section className=" w-full px-3 py-4">
      <div className="mx-auto max-w-350 rounded-2xl border border-[#B0B0B0] p-5">
        <h2 className="font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center">
          Kheelona is backed by
        </h2>
        <div className="flex justify-center items-center mt-5 md:mt-10">
          {/* Render with dividers */}
          {partners.map((partner) => (
            <React.Fragment key={partner.id}>
              {partner.id > 1 && <div className="mx-8 w-0 h-20 border-l border-black" />}
              <div className="flex items-center">
                <img src={partner.image} alt={partner.name} className="w-35 h-35 object-contain" />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
