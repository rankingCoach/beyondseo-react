import { __ } from "@wordpress/i18n";

// Normalize score to a 0–100 integer percentage
const normalizeToPercent = (score?: number): number | undefined => {
  if (typeof score !== "number" || Number.isNaN(score)) return undefined;
  // If score looks like 0–1, convert to percent
  if (score <= 1) return Math.round(Math.max(0, Math.min(1, score)) * 100);
  // Otherwise clamp to 0–100
  return Math.round(Math.max(0, Math.min(100, score)));
};

export const getOptimisationMessage = (score?: number): string => {
  const percent = normalizeToPercent(score);
  if (percent === undefined) return "";

  if (percent <= 50) {
    return __("Poor SEO score — major improvements needed.", "beyondseo");
  }
  if (percent <= 70) {
    return __("You have medium optimisation level on this page", "beyondseo");
  }
  return __("You have good optimisation level on this page", "beyondseo");
};
