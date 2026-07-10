"use client";

import { useEffect, useState } from "react";
import { Tilt, TiltContent } from "@/components/vendor/animate-ui/primitives/tilt";

/** Brand wrapper over the vendored Animate UI tilt primitive: gentle
 *  pointer-tracked perspective on card surfaces (R6 "elegant motion").
 *  Renders a plain div unless the device has a fine hover pointer AND the
 *  user allows motion — touch screens and reduced-motion never tilt.
 *  maxTilt 5 on purpose: depth cue, not a gimmick. */
export function TiltCard({
  className,
  children,
  maxTilt = 5,
}: {
  className?: string;
  children: React.ReactNode;
  maxTilt?: number;
}) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (!enabled) return <div className={className}>{children}</div>;

  return (
    // h-full: grid call sites rely on equal-height cards
    <Tilt maxTilt={maxTilt} perspective={900} className="h-full">
      <TiltContent className={className}>{children}</TiltContent>
    </Tilt>
  );
}
