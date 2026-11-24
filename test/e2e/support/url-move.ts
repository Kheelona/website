/* The product page's address moved from /products/kheelu to /products/khelu (D070 / C4, human 24 Nov: "Don't drop
 * kheelu. Redirect it."). The approved mockups are frozen (D046) and keep the address they were approved with, as
 * printed: a page's meta `url`, a link's `href`. Every comparison reads that address through this function, so the
 * mockup side says what the build now serves while no mockup file is edited (the F1 pattern, wiki/qa/deviations.md).
 * Plain TypeScript with no imports, so Playwright's loader and Vitest both take it. */

/** A mockup's address as the build serves it: the product page's old address (a fragment or query kept) is the new one;
 *  every other address is returned as it is. */
export function builtAddress(address: string): string {
  return address.replace(/^\/products\/kheelu(?=$|[#?])/, "/products/khelu");
}
