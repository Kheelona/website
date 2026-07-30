import Image from "next/image";
import { cn } from "@/lib/cn";

/** The hero art stage (revamp M2, founder brief pointer 2): Kheelu talking
 *  to Lumi on the right.
 *
 *  REV-a LANDED 2026-07-31: the founder generated the FINAL single artwork —
 *  Kheelu kneeling to whisper to Lumi v2 (speaker tummy, party hat) — and it
 *  replaced the interim two-cutout composition exactly as this file's old
 *  comment prescribed. Source staged in
 *  Design/product-images/generated-2026-07/; cutout via the house Vision
 *  pipeline (gap between the characters verified transparent, hat tassels
 *  intact).
 *
 *  LCP LAW (R9/R11, twice re-learned live): this priority image is the
 *  hero's largest element and owns the mobile LCP. No opacity entrance on
 *  it, ever. */
export function HeroStage({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex items-end justify-center pb-4", className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(241,162,59,0.16)_0%,rgba(241,162,59,0.3)_35%,transparent_70%)]"
      />
      <Image
        src="/hero/kheelu-lumi.png"
        alt="Kheelu, the Kheelona mascot, kneeling to whisper a secret to Lumi, the sky blue talking plush with a speaker in its tummy and a striped party hat"
        width={1106}
        height={1185}
        priority
        sizes="(max-width: 768px) 82vw, 420px"
        className="relative h-[350px] w-auto md:h-[420px]"
      />
    </div>
  );
}
