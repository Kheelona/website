import Image from "next/image";

/** Product-page hero visual. High-quality 2D only (founder decision
 *  2026-07-07 evening: the GLB turntable read as low quality; the
 *  Gemini studio render carries the hero alone). */
export function LumiHero({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src="/product/lumi-blue.png"
        alt="Lumi, a small blue talking toy with a striped party hat"
        width={1113}
        height={1600}
        priority
        sizes="(max-width: 768px) 80vw, 420px"
        className="relative mx-auto h-auto w-full max-w-[360px] drop-shadow-[0_20px_26px_rgba(41,160,215,0.2)]"
      />
    </div>
  );
}
