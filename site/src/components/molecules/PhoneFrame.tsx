import Image from "next/image";

/** Minimal CSS phone chrome around an app screenshot (R7; the kheelona.ai
 *  kit has a PhoneFrame component — this is our token-styled equivalent,
 *  no library). Screenshot ratio expected ~393x852. */
export function PhoneFrame({
  src,
  alt,
  width = 280,
  priority = false,
}: {
  src: string;
  alt: string;
  width?: number;
  /** Set when the frame is a hero's largest element, so it owns the LCP
   *  instead of waiting in the lazy queue (M4: the /setup hero). */
  priority?: boolean;
}) {
  return (
    <div
      className="relative rounded-[44px] border-[10px] border-ink-head bg-ink-head shadow-[0_24px_48px_rgba(42,22,8,0.22)]"
      style={{ width }}
    >
      <div className="overflow-hidden rounded-[34px]">
        <Image
          src={src}
          alt={alt}
          width={393}
          height={852}
          sizes={`${width}px`}
          priority={priority}
          className="block h-auto w-full"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-2 h-[18px] w-24 -translate-x-1/2 rounded-full bg-ink-head"
      />
    </div>
  );
}
