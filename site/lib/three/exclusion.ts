import * as THREE from "three";
import { stageStore } from "./store";

/** Copy legibility contract for the floating shape field (§8.13): a shape
 *  whose screen projection would cross a measured [data-content] rect ghosts
 *  down to a faint presence instead of sitting over the copy.
 *
 *  Everything here is math on cached measurements: content rects live in
 *  document coords (written by store.measure), converted to NDC with the
 *  store's scrollY. No DOM reads on the frame loop, no steering feedback --
 *  the shape keeps drifting, only its opacity ducks. */

export const GHOST_OPACITY = 0.14;

/** Feather (in NDC units) around a content rect where the fade eases in.
 *  Generous on purpose: a shape should start ducking well before its edge
 *  touches copy (UI panel 2026-07-10). */
const FEATHER = 0.14;

const v = new THREE.Vector3();

/** Returns the target opacity (GHOST_OPACITY..1) for a shape at worldPos with
 *  the given world radius, against every measured copy rect. 1 = fully clear. */
export function contentFadeTarget(
  worldPos: THREE.Vector3,
  worldRadius: number,
  camera: THREE.Camera,
): number {
  const { contentRects, scrollY, viewH, viewW } = stageStore.getState();
  if (!contentRects.length) return 1;

  const dist = camera.position.distanceTo(worldPos);
  if (dist <= 0.001) return 1;

  v.copy(worldPos).project(camera);
  if (v.z > 1) return 1; // behind the camera

  // projected shape radius in NDC (vertical fov; horizontal scales by aspect)
  const persp = camera as THREE.PerspectiveCamera;
  const halfH = Math.tan(THREE.MathUtils.degToRad(persp.fov ?? 32) / 2) * dist;
  const rNdcY = worldRadius / Math.max(halfH, 0.001);
  const rNdcX = rNdcY / Math.max(persp.aspect ?? 1, 0.001);

  let worst = 1;
  for (const rect of contentRects) {
    // rect -> NDC via document coords + current scroll (no layout reads)
    const left = (rect.left / viewW) * 2 - 1;
    const right = (rect.right / viewW) * 2 - 1;
    const top = 1 - ((rect.top - scrollY) / viewH) * 2;
    const bottom = 1 - ((rect.bottom - scrollY) / viewH) * 2;
    if (top < -1.2 || bottom > 1.2) continue; // rect off-screen

    // signed distance from the shape's projected disc to the rect
    const dx = Math.max(left - (v.x + rNdcX), (v.x - rNdcX) - right, 0);
    const dy = Math.max(bottom - (v.y + rNdcY), (v.y - rNdcY) - top, 0);
    const d = Math.hypot(dx, dy);
    if (d >= FEATHER) continue;
    const t = d / FEATHER; // 0 = overlapping, 1 = at feather edge
    worst = Math.min(worst, GHOST_OPACITY + (1 - GHOST_OPACITY) * t);
  }
  return worst;
}
