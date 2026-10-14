import { ICON_PATHS } from "@/assets/icons.generated";
import { DEFAULT_OG, organization, TEAM_BYLINE } from "@/content/en-IN/organization";
import { photos } from "@/content/en-IN/stories/photos";
import { topics } from "@/content/en-IN/stories/topics";
import type { JournalVocabulary } from "@/lib/journal/to-article";

/**
 * The site's vocabulary for the journal adapter (ADR-014; journal-pipeline §4, §8.2 rows 10-12), assembled from the
 * content modules as the registry will assemble it (task 8b.2e, `journal.ts`): the four topics with their close and
 * D025 line, the photo table, the 76 DS icon names, the founders' bylines and the team's ("Kheelona" in the dashboard,
 * "The Kheelona team" on the page), and the default share card. Test support only: `src/lib` never imports content
 * (structure §6), so the adapter takes all of this as an argument.
 */
export const VOCABULARY: JournalVocabulary = {
  topics,
  photos,
  icons: Object.keys(ICON_PATHS),
  people: organization.founders.map((founder) => founder.name),
  team: { author: "Kheelona", byline: TEAM_BYLINE },
  defaultOg: DEFAULT_OG,
};
