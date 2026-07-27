import Image from "next/image";

/** Product hero, 2D since R5 (founder 2026-07-10: 2D Lumi, not 3D — same
 *  call as the home mascot). The live-plush inset (components/product/
 *  LumiInset.tsx via the Stage entry) is dormant, not deleted: restoring the
 *  pre-R5 cross-fade version of this file brings the 3D toy back. */
export function LumiHero({ className }: { className?: string }) {
  return (
    <div className={className} style={{ position: "relative" }}>
      <Image
        src="/product/lumi-blue-2.png"
        alt="Lumi, a small blue talking toy with a striped party hat"
        width={1113}
        height={1600}
        priority
        fetchPriority="high"
        sizes="(max-width: 768px) 80vw, 420px"
        className="relative mx-auto h-full w-auto object-contain drop-shadow-[0_20px_26px_rgba(41,160,215,0.2)]"
      />
    </div>
  );
}
