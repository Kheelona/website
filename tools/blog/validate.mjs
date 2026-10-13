/** The shape check for journal posts coming from the dashboard (blog API), shared by
 *  the build-time sync (tools/blog/sync.mjs) and its test.
 *
 *  The dashboard's backend already sanitises every post to a whitelist of nodes, so
 *  this is not a security boundary; it is the "would the build render this correctly"
 *  boundary. A post that fails it stops the build, and Vercel keeps the last good
 *  deployment live, which is strictly better than shipping a broken article. */

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
export const POSES = ["curious", "silly", "joy", "bliss", "grumpy", "sad"];
export const TINTS = ["bg-blue/15", "bg-yellow/15", "bg-orange/15"];
const BLOCKS = new Set([
  "paragraph",
  "heading",
  "bulletList",
  "orderedList",
  "blockquote",
  "horizontalRule",
  "image",
  "videoEmbed",
]);

/** @returns {string[]} problems, each naming the post */
export function validatePosts(posts) {
  if (!Array.isArray(posts))
    return ["the blog API did not return a list of posts"];
  const problems = [];
  const seen = new Set();
  for (const p of posts) {
    const where = `post "${p?.slug ?? "?"}"`;
    if (!p || typeof p !== "object") {
      problems.push("a post is not an object");
      continue;
    }
    if (typeof p.slug !== "string" || !SLUG.test(p.slug))
      problems.push(`${where}: bad slug`);
    if (seen.has(p.slug)) problems.push(`${where}: duplicate slug`);
    seen.add(p.slug);
    for (const key of ["title", "description", "theme", "author"]) {
      if (typeof p[key] !== "string" || !p[key].trim())
        problems.push(`${where}: missing ${key}`);
    }
    if (!ISO_DAY.test(p.published) || !ISO_DAY.test(p.updated))
      problems.push(`${where}: bad dates`);
    else if (p.updated < p.published)
      problems.push(`${where}: updated before published`);
    if (!POSES.includes(p.pose))
      problems.push(`${where}: unknown pose "${p.pose}"`);
    if (!TINTS.includes(p.tint))
      problems.push(`${where}: unknown tint "${p.tint}"`);
    if (p.hero !== null && typeof p.hero !== "string")
      problems.push(`${where}: bad hero`);
    if (!Array.isArray(p.sources))
      problems.push(`${where}: sources is not a list`);
    if (p.body?.type !== "doc" || !Array.isArray(p.body.content)) {
      problems.push(`${where}: body is not a document`);
    } else {
      for (const block of p.body.content) {
        if (!BLOCKS.has(block?.type))
          problems.push(`${where}: unknown block "${block?.type}"`);
      }
    }
  }
  return problems;
}

/** A fall this steep is far more likely a broken database or API than an editorial
 *  decision, and shipping it would turn indexed articles into 404s overnight. */
export function shrinkProblem(previousCount, nextCount) {
  if (previousCount >= 4 && nextCount < Math.ceil(previousCount / 2)) {
    return (
      `the blog API returned ${nextCount} posts where the last build had ${previousCount}. ` +
      `If that is intended (posts were unpublished), set BLOG_ALLOW_SHRINK=1 for one build.`
    );
  }
  return null;
}
