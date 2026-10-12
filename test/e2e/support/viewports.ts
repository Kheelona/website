/* Viewports (task 1.1; test plan §3, from the PostHog audit's matrix, QA review N23).
 *
 * Visual parity runs at the three approved widths only, because those are the widths the founder
 * approved (D046). Everything that can break on other screens (sideways scroll, the first-screen
 * CTA, axe, the laptop layout) runs on the whole matrix.
 */

export type Viewport = {
  name: string;
  width: number;
  height: number;
  isMobile: boolean;
  group: "phone" | "laptop";
};

const phone = (width: number, height: number): Viewport => ({ name: `phone-${width}x${height}`, width, height, isMobile: true, group: "phone" });
const laptop = (width: number, height: number): Viewport => ({ name: `laptop-${width}x${height}`, width, height, isMobile: false, group: "laptop" });

/** Test plan §3: phones first. */
export const VIEWPORTS: readonly Viewport[] = [
  phone(360, 640),
  phone(360, 590),
  phone(324, 566),
  phone(390, 844),
  phone(393, 695),
  phone(402, 714),
  phone(412, 780),
  laptop(1440, 900),
  laptop(1440, 800),
  laptop(1920, 1080),
  laptop(1536, 730),
  laptop(1280, 600),
  laptop(1512, 860),
  laptop(1366, 768),
];

/** The approved widths (D046): visual parity. */
export const APPROVED_WIDTHS: readonly Viewport[] = [phone(360, 640), phone(390, 844), laptop(1440, 900)];

/** Sideways scroll also runs at 320, the narrowest phone in the audit (test plan §4.6). */
export const SIDEWAYS_VIEWPORTS: readonly Viewport[] = [phone(320, 640), ...VIEWPORTS];

/** axe (test plan §4.5): 360, 390, 1440 and 1920; templates also 412. */
export const AXE_VIEWPORTS: readonly Viewport[] = [phone(360, 640), phone(390, 844), laptop(1440, 900), laptop(1920, 1080)];
export const AXE_TEMPLATE_EXTRA: Viewport = phone(412, 780);

/** The first small-phone screens (test plan §4.1, D045). */
export const FIRST_SCREEN_VIEWPORTS: readonly Viewport[] = [phone(360, 590), phone(360, 640)];

/** Playwright context options for a viewport (device pixel ratio 1 unless a spec needs real bytes). */
export function contextFor(v: Viewport, deviceScaleFactor = 1) {
  return {
    viewport: { width: v.width, height: v.height },
    isMobile: v.isMobile,
    hasTouch: v.isMobile,
    deviceScaleFactor,
  };
}
