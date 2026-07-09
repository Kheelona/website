/** Device tiers for the 3D stage (founder decision: adaptive, mobile included).
 *  full  = desktop-class: both models, sparkles, full shape field
 *  lite  = most phones: reduced dressing, capped DPR
 *  static = stage never mounts (reduced motion, saveData, no WebGL2, very low-end) */
export type Tier = "full" | "lite" | "static";

export function detectTier(): Tier {
  if (typeof window === "undefined") return "static";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return "static";

  // WebGL2 probe on a throwaway canvas
  try {
    const c = document.createElement("canvas");
    const gl = c.getContext("webgl2");
    if (!gl) return "static";
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    return "static";
  }

  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = nav.deviceMemory ?? 4;
  if (cores <= 2 || mem < 2) return "static";
  if (window.innerWidth >= 1024 && cores >= 6 && mem >= 4) return "full";
  return "lite";
}
