/**
 * Type tests for AppScreens (task 2.3; ADR-010, N12, D046). `npm run typecheck` (tsc --noEmit) checks this file: the
 * `.test-d.tsx` suffix is inside tsconfig.json's `**\/*.tsx` include and outside its `**\/*.test.tsx` exclude and
 * Vitest's runtime suite (the src/content/types.test-d.ts pattern). The accepted lines must type-check, and every
 * line marked @ts-expect-error must be refused, or the type check fails (TS2578). Never rendered.
 */
import type { StaticImageData } from "next/image";
import { AppScreens } from "./AppScreens";

const shot = (name: string) => ({ src: { src: `/_next/static/media/${name}.webp`, width: 576, height: 1209 } as StaticImageData, alt: "" });
const TRANSCRIPT = shot("app-transcript");
const ACTIVITY = shot("app-activity");
const PRIVACY = shot("app-privacy");
const SIZES = "(min-width: 900px) 280px, calc((100vw - 48px) / 2)";

export const accepted = () => (
  <>
    <AppScreens variant="home" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} caption="Caption" reveal />
    <AppScreens variant="home" screens={[PRIVACY]} sizes={SIZES} />
    <AppScreens variant="product" screens={[TRANSCRIPT, ACTIVITY]} sizes={SIZES} />
    <AppScreens variant="product" screens={[PRIVACY]} sizes={SIZES} />
  </>
);

export const misuses = () => (
  <>
    {/* @ts-expect-error sizes is required */}
    <AppScreens variant="home" screens={[PRIVACY]} />
    {/* @ts-expect-error the variant is required: each page frames the phones differently */}
    <AppScreens screens={[PRIVACY]} sizes={SIZES} />
    {/* @ts-expect-error no priority prop: deprecated in Next 16 (N12); app screens are never the LCP image */}
    <AppScreens variant="home" screens={[PRIVACY]} sizes={SIZES} priority />
    {/* @ts-expect-error one or two screens, never three */}
    <AppScreens variant="home" screens={[TRANSCRIPT, ACTIVITY, PRIVACY]} sizes={SIZES} />
    {/* @ts-expect-error at least one screen */}
    <AppScreens variant="product" screens={[]} sizes={SIZES} />
  </>
);
