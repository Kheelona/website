import type { MetadataRoute } from "next";
import { robotsFile } from "@/lib/seo/robots";

/** robots.txt: the rules live in src/lib/seo/robots.ts (architecture §9.3; Bytespider disallowed, D041). */
export default function robots(): MetadataRoute.Robots {
  return robotsFile();
}
