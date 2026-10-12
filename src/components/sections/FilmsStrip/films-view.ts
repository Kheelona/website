/* The films strip's arithmetic (task 3.3), kept apart from the island so it is tested with real layouts: where the
 * strip is and what its controls say (mockup.js section 4), and which film is in focus (D049 pick 8). Pure functions;
 * client-safe. */

/** What the strip's track measures, in CSS pixels. */
export interface TrackMetrics {
  readonly scrollLeft: number;
  readonly scrollWidth: number;
  readonly clientWidth: number;
  /** One film's width. */
  readonly tileWidth: number;
  /** One step: a film plus the gap (the second film's left minus the first's). */
  readonly pitch: number;
  readonly count: number;
}

/** The films shown (1-based, inclusive) and whether each end is reached. */
export interface StripView {
  readonly from: number;
  readonly to: number;
  readonly atStart: boolean;
  readonly atEnd: boolean;
}

/** The first paint, before the strip is measured: "1 of 7", Previous disabled (the approved markup after load). */
export const INITIAL_VIEW: StripView = { from: 1, to: 1, atStart: true, atEnd: false };

/**
 * Where the strip is. A phone shows one film, a laptop three (mockup.css:41, 83). An end counts as reached within half
 * a film of it, so a snap that stops a few pixels short (or a last step shorter than a film) still disables the
 * button; at the end the last films are the ones shown.
 */
export function stripView(m: TrackMetrics): StripView {
  if (!(m.pitch > 0) || m.count < 1) return INITIAL_VIEW;
  const shown = Math.min(m.count, Math.max(1, Math.round((m.clientWidth + m.pitch - m.tileWidth) / m.pitch)));
  const max = Math.max(0, m.scrollWidth - m.clientWidth);
  const half = m.pitch / 2;
  const atStart = m.scrollLeft < half;
  const atEnd = m.scrollLeft > max - half;
  const first = atEnd ? m.count - shown : Math.min(Math.round(m.scrollLeft / m.pitch), m.count - shown);
  return { from: first + 1, to: first + shown, atStart, atEnd };
}

/** The position line: "1 of 7" with one film shown, "1–3 of 7" (an en dash) with more; `of` is the content's word. */
export function positionText(view: StripView, total: number, of: string): string {
  const shown = view.to > view.from ? `${view.from}–${view.to}` : `${view.from}`;
  return `${shown} ${of} ${total}`;
}

/** The film most inside the strip's central band (the widest visible part there), in the strip's order on a tie; none
 *  when no film reaches the band. */
export function focusedTile(widths: ReadonlyMap<string, number>, order: readonly string[]): string | null {
  let best: string | null = null;
  let bestWidth = 0;
  for (const id of order) {
    const width = widths.get(id) ?? 0;
    if (width > bestWidth) [best, bestWidth] = [id, width];
  }
  return best;
}
