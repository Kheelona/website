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
    /* data-hero-has-kheelu: this artwork contains Kheelu, so the corner guide
       holds back until it scrolls away (V5-5) — two of the same character in
       one viewport was the craft flaw REV-a's final art locked in. */
    <div
      data-hero-has-kheelu
      className={cn("relative flex items-end justify-center pb-4", className)}
    >
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
        sizes="(max-width: 768px) 82vw, 500px"
        /* V5-5: the art was 420px in an ~800px hero, leaving a band of empty
           wash above it — the composition read left-heavy and the product,
           which is the thing being sold, was the smaller half of its own hero.
           Scaled up on desktop only; the phone size already filled its frame
           and it owns the mobile LCP, so it is left exactly as measured. */
        className="relative h-[350px] w-auto md:h-[470px] xl:h-[500px]"
      />
    </div>
  );
}
