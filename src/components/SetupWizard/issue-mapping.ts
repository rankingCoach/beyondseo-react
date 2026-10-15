import { __ } from "@wordpress/i18n";

/** What the wizard can do about an issue: an inline editor or the post editor. */
export type FixKind = "title" | "description" | "keywords" | "editor";

const KEYWORD_ISSUES = new Set([
  "missing_primary_keyword",
  "missing_secondary_keywords",
  "insufficient_secondary_keywords",
  "too_many_secondary_keywords",
  "keyword_map",
  "optimise_primary_keyword",
  "optimise_secondary_keyword",
  "narrow_keyword_portfolio",
  "missing_related_keywords",
  "missing_long_tail_keywords",
  "missing_keyword_coverage",
]);

export const fixKindForIssue = (issueType: string): FixKind => {
  if (
    issueType.startsWith("meta_title") ||
    issueType.endsWith("in_meta_title") ||
    issueType === "keyword_not_at_title_start"
  ) {
    return "title";
  }
  if (issueType.includes("meta_description")) {
    return "description";
  }
  if (KEYWORD_ISSUES.has(issueType)) {
    return "keywords";
  }

  return "editor";
};

export const fixActionLabel = (kind: FixKind): string => {
  switch (kind) {
    case "title":
      return __("Edit SEO title", "beyondseo");
    case "description":
      return __("Edit meta description", "beyondseo");
    case "keywords":
      return __("Set keywords", "beyondseo");
    default:
      return __("Open in editor", "beyondseo");
  }
};

export const priorityLabel = (priority: number): string => {
  switch (priority) {
    case 1:
      return __("Critical", "beyondseo");
    case 2:
      return __("High", "beyondseo");
    case 3:
      return __("Medium", "beyondseo");
    default:
      return __("Low", "beyondseo");
  }
};
