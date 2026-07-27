import { cn } from "@/lib/cn";

/** The single column every page's rooms stack in (theme B): kit width
 *  1180px, kit gutters, 34px rhythm between rooms. Purely layout — the
 *  parent owns nothing else (atoms carry no outer margins). */
export function RoomsTrack({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1180px] flex-col gap-[34px] px-[clamp(20px,5vw,64px)] pb-14",
        className,
      )}
    >
      {children}
    </div>
  );
}
