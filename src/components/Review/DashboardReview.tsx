import React, { useState } from "react";
import { rcWindow } from "@stores/window.store";
import { Review } from "./Review";
import { REVIEW_DASHBOARD_SCORE_THRESHOLD } from "./ReviewState";

function consumeReviewCompletion(): number | null {
  if (!rcWindow.rankingCoachReactData?.loadNextComponents?.split(",").includes("dashboardReview")) {
    return null;
  }

  try {
    const reviewKey = `rankingcoach-review-dashboard:${window.location.pathname}`;
    const stored = window.sessionStorage.getItem(reviewKey);
    window.sessionStorage.removeItem(reviewKey);
    const container = document.querySelector<HTMLElement>(
      ".rankingcoach-dashboard-widget #dashboard-review-rankingcoach-react",
    );
    if (!stored || !container) {
      return null;
    }
    const score = Number(container.dataset.reviewScore);
    const completion = JSON.parse(stored);
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const age = Date.now() - completion?.completedAt;

    return navigation?.type === "reload" &&
      Number.isFinite(score) &&
      score > REVIEW_DASHBOARD_SCORE_THRESHOLD &&
      score <= 100 &&
      typeof completion?.completedAt === "number" &&
      age >= 0 &&
      age < 60_000 &&
      typeof completion?.nonce === "string" &&
      completion.nonce === rcWindow.rankingCoachReactData?.restNonce
      ? completion.completedAt
      : null;
  } catch {
    return null;
  }
}

const reviewDashboardCompletedAt = consumeReviewCompletion();

export const DashboardReview = () => {
  const [reviewDashboardCompleted] = useState(() => {
    const age = reviewDashboardCompletedAt === null ? -1 : Date.now() - reviewDashboardCompletedAt;

    return age >= 0 && age < 60_000;
  });

  return reviewDashboardCompleted ? <Review placement="dashboard" /> : null;
};
