import { HttpStore, type ReviewEvent } from "@stores/http.store";

export type ReviewPlacement = "settings" | "save" | "dashboard" | "editor";

export const REVIEW_DASHBOARD_SCORE_THRESHOLD =
  window.rankingCoachReactData?.review?.scoreThresholds?.dashboard ?? Infinity;
export const REVIEW_EDITOR_SCORE_THRESHOLD = window.rankingCoachReactData?.review?.scoreThresholds?.editor ?? Infinity;

type ReviewCandidate = {
  element: HTMLElement;
  placement: ReviewPlacement;
};

const reviewCandidates = new Map<symbol, ReviewCandidate>();
const reviewListeners = new Set<() => void>();
let reviewData: ReviewBootstrapData | null = null;
let reviewInitialized = false;
let reviewSelected: symbol | null = null;
let reviewDisplayed: symbol | null = null;
let reviewDismissed = false;
let reviewOutboundRequested = false;
let reviewFrame = 0;
let reviewHttp: HttpStore | null = null;

function getReviewData() {
  if (!reviewInitialized) {
    reviewInitialized = true;
    reviewData = window.rankingCoachReactData?.review ?? null;
  }

  return reviewData;
}

function notifyReview() {
  reviewListeners.forEach((listener) => {
    try {
      listener();
    } catch {
      return;
    }
  });
}

export function updateReviewData(data: ReviewBootstrapData) {
  const previous = getReviewData();
  reviewData = {
    ...data,
    displayCount: Math.max(previous?.displayCount ?? 0, data.displayCount),
    cooldownUntil: Math.max(previous?.cooldownUntil ?? 0, data.cooldownUntil),
    permanentlyStopped: Boolean(previous?.permanentlyStopped || data.permanentlyStopped),
  };
  scheduleReview();
}

export function isReviewVisible(element: HTMLElement) {
  if (!element.isConnected || document.visibilityState !== "visible") {
    return false;
  }

  const rect = element.getBoundingClientRect();
  let top = Math.max(rect.top, 0);
  let left = Math.max(rect.left, 0);
  let bottom = Math.min(rect.bottom, document.documentElement.clientHeight);
  let right = Math.min(rect.right, document.documentElement.clientWidth);
  if (rect.width <= 0 || rect.height <= 0) {
    return false;
  }

  for (let parent: HTMLElement | null = element; parent; parent = parent.parentElement) {
    const style = window.getComputedStyle(parent);
    if (
      parent.hidden ||
      parent.inert ||
      parent.getAttribute("aria-hidden") === "true" ||
      style.display === "none" ||
      style.visibility !== "visible" ||
      style.contentVisibility === "hidden" ||
      Number(style.opacity) === 0 ||
      (parent instanceof HTMLDetailsElement && !parent.open)
    ) {
      return false;
    }

    if (parent !== element) {
      const bounds = parent.getBoundingClientRect();
      if (style.overflowY !== "visible") {
        top = Math.max(top, bounds.top);
        bottom = Math.min(bottom, bounds.bottom);
      }
      if (style.overflowX !== "visible") {
        left = Math.max(left, bounds.left);
        right = Math.min(right, bounds.right);
      }
    }
  }

  return bottom > top && right > left;
}

function canDisplayReview() {
  const data = getReviewData();

  return Boolean(
    data?.eligible &&
    Number.isFinite(data.displayCount) &&
    data.displayCount >= 0 &&
    data.displayCount < 3 &&
    !data.permanentlyStopped &&
    data.cooldownUntil <= Date.now() / 1000 &&
    !reviewDismissed &&
    !reviewDisplayed,
  );
}

export function scheduleReview() {
  if (reviewFrame) {
    return;
  }
  reviewFrame = window.requestAnimationFrame(() => {
    reviewFrame = 0;
    if (reviewDisplayed || reviewDismissed) {
      return;
    }
    const currentCard = reviewSelected
      ? reviewCandidates.get(reviewSelected)?.element.querySelector<HTMLElement>("[data-review-card]")
      : null;
    if (reviewSelected && currentCard && isReviewVisible(currentCard)) {
      displayReview(reviewSelected, currentCard);
      return;
    }
    const candidates = canDisplayReview()
      ? [...reviewCandidates].filter(([, candidate]) => isReviewVisible(candidate.element))
      : [];
    const contextual = candidates.find(([, candidate]) => candidate.placement !== "settings");
    const selected = contextual?.[0] ?? candidates[0]?.[0] ?? null;
    if (reviewSelected !== selected) {
      reviewSelected = selected;
      notifyReview();
    }
  });
}

export function registerReview(id: symbol, candidate: ReviewCandidate) {
  reviewCandidates.set(id, candidate);
  scheduleReview();

  return () => {
    reviewCandidates.delete(id);
    scheduleReview();
  };
}

export function subscribeReview(listener: () => void) {
  reviewListeners.add(listener);

  return () => {
    reviewListeners.delete(listener);
  };
}

export function getReviewSelection() {
  return reviewDismissed ? null : reviewSelected;
}

function persistReview(event: ReviewEvent) {
  try {
    reviewHttp ??= new HttpStore();
    reviewHttp.persistReview(event).subscribe({
      next: (response) => {
        try {
          if (response?.review) {
            updateReviewData(response.review);
          }
        } catch {
          return;
        }
      },
      error: () => {},
    });
  } catch {
    return;
  }
}

export function displayReview(id: symbol, element: HTMLElement) {
  if (reviewDisplayed || reviewDismissed) {
    return false;
  }
  if (reviewSelected !== id || !reviewCandidates.has(id) || !isReviewVisible(element)) {
    scheduleReview();
    return false;
  }
  const data = getReviewData();
  if (!data) {
    return false;
  }
  reviewDisplayed = id;
  reviewData = {
    ...data,
    displayCount: data.displayCount + 1,
    cooldownUntil: Math.max(data.cooldownUntil, Date.now() / 1000 + 14 * 24 * 60 * 60),
  };
  persistReview("display");

  return true;
}

export function stopReviewFromFooter(event: "review" | "support") {
  if (reviewOutboundRequested) {
    return;
  }
  reviewOutboundRequested = true;
  reviewDismissed = true;
  const data = getReviewData();
  if (data) {
    reviewData = { ...data, permanentlyStopped: true };
  }
  notifyReview();
  persistReview(event);
}

export function dismissReview(id: symbol, event: Exclude<ReviewEvent, "display">) {
  if (reviewDisplayed !== id || reviewDismissed) {
    return false;
  }
  reviewDismissed = true;
  const outbound = event === "review" || event === "support";
  reviewOutboundRequested ||= outbound;
  const data = getReviewData();
  if (data) {
    reviewData = {
      ...data,
      permanentlyStopped: data.permanentlyStopped || outbound,
      cooldownUntil: outbound
        ? data.cooldownUntil
        : Math.max(data.cooldownUntil, Date.now() / 1000 + 14 * 24 * 60 * 60),
    };
  }
  notifyReview();
  persistReview(event);

  return true;
}
