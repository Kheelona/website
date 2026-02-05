"use client";

import Image from "next/image";
import { SectionHeader } from "@/components/ui/SectionHeader";

const scenarios = [
  { id: 1, image: "/images/features/discipline.png", label: "Discipline", class: "outline-blue" },
  { id: 2, image: "/images/features/manners.png", label: "Manners", class: "outline-blue" },
  { id: 3, image: "/images/features/curiosity.png", label: "Curiosity", class: "outline-blue" },
  {
    id: 4,
    image: "/images/features/bedtime-stories.png",
    label: "Bed Time Stories",
    class: "outline-orange",
  },
  { id: 5, image: "/images/features/vocab.png", label: "Vocab", class: "outline-orange" },
  {
    id: 6,
    image: "/images/features/emotional-health.png",
    label: "Emotional Health",
    class: "outline-blue",
  },
  { id: 7, image: "/images/features/creativity.png", label: "Creativity", class: "outline-blue" },
  {
    id: 8,
    image: "/images/features/language-skills.png",
    label: "Language Skills",
    class: "outline-orange",
  },
];

const UsageScenarios = () => {
  return (
    <section className="py-20 px-5 md:px-10">
      <div>
        <h2 className="font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center">
          How Lumi adds value to <br /> millions of kids&apos; life
        </h2>
        <p className="text-[18px] md:text-[30px] font-bold text-muted-foreground text-center mb-6 text-[#575757] ">
          What will happen if my kid has a lumi?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-290 mx-auto">
          {scenarios.map((scenario) => (
            <div
              key={scenario.id}
              className="group relative rounded-3xl overflow-hidden shadow-card "
            >
              <Image
                src={scenario.image}
                alt={scenario.label}
                width={270}
                height={338}
                className="w-67.5 h-49.5 md:h-84.5 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-3 left-3 right-3">
                <p
                  className={`font-bold ${scenario.class}  text-[17px] md:text-[29px] text-center p-1 `}
                >
                  {scenario.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsageScenarios;
