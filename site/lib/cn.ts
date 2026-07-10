import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Class combiner with Tailwind conflict resolution (R6): vendored registry
 *  components (components/vendor/) assume a merging cn, and the plain-join
 *  version already bit us once (R4: Button's base display class fought a
 *  caller's `hidden`). clsx+twMerge is ~3KB gz total. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
