/** Minimal class combiner; avoids a tailwind-merge dependency for this size of app. */
export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}
