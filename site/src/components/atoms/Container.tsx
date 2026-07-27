import { cn } from "@/lib/cn";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    // data-content: the 3D stage measures these rects to keep floating
    // shapes out of the copy column (lib/three/exclusion.ts)
    <div data-content className={cn("mx-auto w-full max-w-[1200px] px-6", className)}>
      {children}
    </div>
  );
}
