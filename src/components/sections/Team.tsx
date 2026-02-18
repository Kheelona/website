"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

const team = [
  { id: 1, image: "/images/about/Apoorva.png", label: "Apoorva sahu", class: "bg-linear-orange" },
  { id: 2, image: "/images/about/Aman.png", label: "Aman Soni", class: "bg-linear-blue" },
  { id: 3, image: "/images/about/Kashyap.png", label: "Kashyap", class: "bg-linear-blue" },
  {
    id: 4,
    image: "/images/about/Nandini.png",
    label: "Nandini Molgara",
    class: "bg-linear-orange",
  },
];

const companies = [
  { id: 1, image: "/images/about/GeekyAnts.png", label: "GeekyAnts", w: 114 },
  { id: 2, image: "/images/about/intel.png", label: "Intel", w: 44 },
];

const Team = () => {
  return (
    <section className="py-20 px-5 md:px-10">
      <SectionHeader title="Meet the kheelona team" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-8 max-w-176.25 md:max-w-275 mx-auto mb-20 md:mt-20">
        {team.map((member) => (
          <div key={member.id} className="border rounded-3xl border-[#BCBCBC] p-2">
            <div
              className={`min-w-35.5 h-30.75 md:h-50 rounded-3xl overflow-hidden ${member.class} justify-center flex items-end`}
            >
              <Image
                src={member.image}
                alt={member.label}
                width={270}
                height={338}
                className="w-35.5 h-30.75 md:h-42 md:w-42 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="">
              <p className={`font-bold text-[17px] md:text-[20px] md:pt-3 text-center p-1`}>
                {member.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      <SectionHeader title="Our team comes from" />
      <div className="flex gap-8 items-center justify-center">
        {companies.map((company) => (
          <Image
            key={company.id}
            src={company.image}
            alt={company.label}
            width={company.w}
            height={25}
            className="object-contain transition-transform duration-300 group-hover:scale-105"
          />
        ))}
        <p className="text-[#BCBCBC] text-[12px] md:text-[16px]">+ more</p>
      </div>
    </section>
  );
};

export default Team;
