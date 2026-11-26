/** India Standard Time is UTC+05:30 all year (no daylight saving), so a fixed offset is exact. */
const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;

const two = (n: number) => String(n).padStart(2, "0");

/** "2026-11-26 02:00:03 IST" for a moment in time. */
export function formatIst(date: Date): string {
  const d = new Date(date.getTime() + IST_OFFSET_MS);
  return (
    `${d.getUTCFullYear()}-${two(d.getUTCMonth() + 1)}-${two(d.getUTCDate())} ` +
    `${two(d.getUTCHours())}:${two(d.getUTCMinutes())}:${two(d.getUTCSeconds())} IST`
  );
}

/** "2026-11-26": the IST calendar day. */
export function istDate(date: Date): string {
  return formatIst(date).slice(0, 10);
}
