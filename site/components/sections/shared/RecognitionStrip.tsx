import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Section } from "@/components/layout/Section";
import { Reveal } from "@/components/ui/Reveal";

/** R7: the recognition row from kheelona.ai (founder-published; assets from
 *  the kheelona.ai repo, entries mirror its content/site.ts RECOGNITION).
 *  Karnataka renders as seal + live text (the tall seal goes unreadable when
 *  squeezed); Founders Inc is text-only by design. */
const ENTRIES = [
  {
    name: "NVIDIA Inception Program",
    logo: { src: "/recognition/nvidia-inception.png", w: 575, h: 200, h8: true },
  },
  {
    name: "Karnataka Elevate",
    mark: { src: "/recognition/karnataka-seal.png", w: 240, h: 240 },
  },
  {
    name: "nasscom startups",
    logo: { src: "/recognition/nasscom.png", w: 306, h: 126, h8: false },
  },
  { name: "Founders Inc" },
] as const;

export function RecognitionStrip({ label = "Recognised by" }: { label?: string }) {
  return (
    <Section wash="white">
      <Container className="py-8 md:py-10">
        <Reveal className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <span className="text-[13px] font-bold uppercase tracking-[0.1em] text-ink-muted">
            {label}
          </span>
          <ul className="flex flex-wrap items-center gap-3">
            {ENTRIES.map((e) => (
              <li
                key={e.name}
                className="flex items-center gap-3 rounded-(--radius-card) border border-line-soft bg-white px-5 py-3"
              >
                {"logo" in e && e.logo ? (
                  <Image
                    src={e.logo.src}
                    alt={e.name}
                    width={e.logo.w}
                    height={e.logo.h}
                    className={e.logo.h8 ? "h-8 w-auto" : "h-7 w-auto"}
                  />
                ) : (
                  <>
                    {"mark" in e && e.mark && (
                      <Image
                        src={e.mark.src}
                        alt=""
                        width={e.mark.w}
                        height={e.mark.h}
                        className="h-9 w-9"
                      />
                    )}
                    <span className="text-[16px] font-semibold text-ink-head">
                      {e.name}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </Section>
  );
}
