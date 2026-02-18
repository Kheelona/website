import Image from "next/image";
import { DecoStar } from "@/components/ui/DecoStar";

const InteractiveLearning = () => {
  const decorStars = [
    { pos: "left-[16%] bottom-[28%]", color: "tangerine" as const },
    { pos: "right-[14%] bottom-[42%]", color: "muted-orange" as const },
  ];
  return (
    <section className="pt-15 md:pt-25">
      <div className="px-5">
        <h2 className="font-heading text-[24px] md:text-[44px] text-stroke-tangerine text-center">
          Toy talks in Every language
        </h2>
      </div>
      {/* Need to revisit updating the images and separating the text and shapes properly */}
      <div className="relative h-140 md:h-180 w-full mt-10">
        <Image
          src="/images/language/languagetoy.png"
          alt="Interactive Learning"
          width={600}
          height={380}
          className="w-150 h-auto -bottom-8 inset-x-0 absolute mx-auto hidden md:block object-contain"
        />

        <Image
          src="/images/language/leftBottomChar.png"
          alt="Left Bottom Character"
          width={180}
          height={180}
          className="w-45 h-auto left-0 bottom-0 absolute mx-auto hidden md:block object-contain"
        />

        <Image
          src="/images/language/leftTopChar.png"
          alt="Left Top Character"
          width={180}
          height={180}
          className="w-45 h-auto left-0 top-0 absolute mx-auto hidden md:block object-contain"
        />
        <Image
          src="/images/language/rightTopChar.png"
          alt="Right Top Character"
          width={180}
          height={180}
          className="w-45 h-auto right-0 top-0 absolute mx-auto hidden md:block object-contain"
        />
        <Image
          src="/images/language/rightBottomChar.png"
          alt="Right Bottom Character"
          width={180}
          height={180}
          className="w-45 h-auto right-0 bottom-0 absolute mx-auto hidden md:block object-contain"
        />

        <Image
          src="/images/language/leftBottomCharLang.png"
          alt="Left Bottom Character"
          width={188}
          height={188}
          className="w-47 h-auto left-0 bottom-0 absolute mx-auto block md:hidden object-contain"
        />
        <Image
          src="/images/language/leftTopCharLang.png"
          alt="Left Top Character"
          width={140}
          height={140}
          className="w-35 h-auto left-0 top-0 absolute mx-auto block md:hidden object-contain"
        />
        <Image
          src="/images/language/rightTopCharLang.png"
          alt="Right Top Character"
          width={200}
          height={200}
          className="w-50 h-auto right-0 top-0 absolute mx-auto block md:hidden object-contain"
        />
        <Image
          src="/images/language/rightBottomCharLang.png"
          alt="Right Bottom Character"
          width={180}
          height={180}
          className="w-45 h-auto right-0 bottom-0 absolute mx-auto block md:hidden object-contain"
        />
        {/* Decorative stars */}
        {decorStars.map((star, i) => (
          <DecoStar key={i} position={star.pos} color={star.color} />
        ))}
      </div>
    </section>
  );
};

export default InteractiveLearning;
