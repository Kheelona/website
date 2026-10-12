import type { Article } from "@/content/types";

/**
 * ArticleBody's configuration: an article module's body as content holds it (src/content/types.ts), parts and the
 * photos between them, every block type of the three approved article mockups. The article template (task 4.2)
 * passes `article.body`; the answer and the sources are their own sections, passed in as `before` and `after`.
 */
export interface ArticleBodyConfig {
  readonly blocks: Article["body"];
}
