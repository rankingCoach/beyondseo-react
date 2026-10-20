import { __ } from "@wordpress/i18n";
import { rcWindow } from "@stores/window.store";

/** What the wizard can do about an issue: an inline editor or the post editor. */
export type FixKind = "title" | "description" | "keywords" | "editor";

export interface WizardCheck {
  issueType: string;
  title: string;
  description: string;
  /** 1 = critical … 4 = low, mirrors FactorSuggestion::PRIORITY_*. */
  priority: number;
}

/** Checks the wizard reports on: BaseConstants::SETUP_WIZARD_CHECKS resolved through the suggestion catalogue, localized by Assets::front(). */
export const getWizardChecks = (): WizardCheck[] => {
  const checks = rcWindow?.rankingCoachReactData?.setupWizardChecks;

  return Array.isArray(checks)
    ? checks.filter((check: Partial<WizardCheck>) => typeof check?.issueType === "string" && !!check.issueType)
    : [];
};

export const isWizardCheck = (issueType: string): boolean =>
  getWizardChecks().some((check) => check.issueType === issueType);

export const fixKindForIssue = (issueType: string): FixKind => {
  if (issueType.startsWith("meta_title") || issueType.endsWith("in_meta_title")) {
    return "title";
  }
  if (issueType.includes("meta_description")) {
    return "description";
  }
  if (issueType === "missing_primary_keyword") {
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
