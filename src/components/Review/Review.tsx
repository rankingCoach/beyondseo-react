import React, { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { __, sprintf } from "@wordpress/i18n";
import type { ReviewEvent } from "@stores/http.store";
import {
  dismissReview,
  displayReview,
  getReviewSelection,
  isReviewVisible,
  registerReview,
  REVIEW_DASHBOARD_SCORE_THRESHOLD,
  REVIEW_EDITOR_SCORE_THRESHOLD,
  scheduleReview,
  subscribeReview,
  updateReviewData,
  type ReviewPlacement,
} from "./ReviewState";
import styles from "./Review.module.scss";

export interface ReviewProps {
  placement: ReviewPlacement;
  enabled?: boolean;
  review?: ReviewBootstrapData;
  focusReturnRef?: React.RefObject<HTMLElement | null>;
}

export function getReviewDestination(value: string | undefined) {
  try {
    const url = new URL(value ?? "");

    return url.protocol === "https:" || url.protocol === "http:" ? url.href : undefined;
  } catch {
    return undefined;
  }
}

function restoreReviewFocus(element: HTMLElement, target?: HTMLElement | null) {
  if (!element.contains(document.activeElement)) {
    return;
  }
  if (target && !element.contains(target) && isReviewVisible(target)) {
    target.focus({ preventScroll: true });
    return;
  }
  const controls = [...document.querySelectorAll<HTMLElement>("a[href], button, input, select, textarea, [tabindex]")];
  const available = controls.filter(
    (control) =>
      !element.contains(control) && control.tabIndex >= 0 && !control.matches(":disabled") && isReviewVisible(control),
  );
  const next = available.find((control) => element.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_FOLLOWING);
  const previous = available
    .filter((control) => element.compareDocumentPosition(control) & Node.DOCUMENT_POSITION_PRECEDING)
    .pop();
  (next ?? previous)?.focus({ preventScroll: true });
}

export function useReviewSettingsSave() {
  const [reviewSaveData, setReviewSaveData] = useState<ReviewBootstrapData | null>(null);
  const reviewMounted = useRef(false);

  useEffect(() => {
    reviewMounted.current = true;
    return () => {
      reviewMounted.current = false;
    };
  }, []);

  const saveReviewSettings = useCallback(async (settings: Record<string, unknown>) => {
    const response = await seoStore
      .postRankingcoachSeoSettings({ settings, reviewPlacement: "save" } as any)
      .toPromise();
    const reviewResponse = response as
      | { success?: boolean; response?: { review?: ReviewBootstrapData | null } }
      | undefined;
    const review = reviewResponse?.response?.review;
    if (reviewMounted.current && reviewResponse?.success === true && review) {
      setReviewSaveData((previous) => (previous || review.eligible ? review : null));
    }

    return response;
  }, []);

  return {
    saveReviewSettings,
    reviewSave: reviewSaveData ? <Review placement="save" review={reviewSaveData} /> : null,
  };
}

export const Review = ({ placement, enabled = true, review, focusReturnRef }: ReviewProps) => {
  const reviewId = useRef(Symbol("Review"));
  const hostRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLElement>(null);
  const headingId = useId();
  const selected = useSyncExternalStore(subscribeReview, getReviewSelection, () => null);
  const reviewUrl = getReviewDestination(window.rankingCoachReactData?.reviewUrl);
  const supportUrl = getReviewDestination(window.rankingCoachReactData?.supportUrl);
  const ready = enabled && Boolean(reviewUrl && supportUrl);

  useEffect(() => {
    if (review) {
      updateReviewData(review);
    }
  }, [review]);

  useEffect(() => {
    const element = hostRef.current;
    if (!element || !ready) {
      return;
    }
    const unregister = registerReview(reviewId.current, { element, placement });
    const intersection = new IntersectionObserver(scheduleReview);
    const resize = new ResizeObserver(scheduleReview);
    const mutation = new MutationObserver(scheduleReview);
    intersection.observe(element);
    resize.observe(element);
    mutation.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "hidden", "open", "aria-hidden", "inert"],
      childList: true,
      subtree: true,
    });
    document.addEventListener("visibilitychange", scheduleReview);
    document.addEventListener("scroll", scheduleReview, true);
    window.addEventListener("resize", scheduleReview);

    return () => {
      unregister();
      intersection.disconnect();
      resize.disconnect();
      mutation.disconnect();
      document.removeEventListener("visibilitychange", scheduleReview);
      document.removeEventListener("scroll", scheduleReview, true);
      window.removeEventListener("resize", scheduleReview);
    };
  }, [placement, ready]);

  useEffect(() => {
    if (selected !== reviewId.current || !ready) {
      return;
    }
    const frame = window.requestAnimationFrame(() => {
      if (cardRef.current) {
        displayReview(reviewId.current, cardRef.current);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [selected, ready]);

  const handleReviewAction = (event: Exclude<ReviewEvent, "display">) => {
    const element = cardRef.current;
    if (!element) {
      return;
    }
    displayReview(reviewId.current, element);
    try {
      restoreReviewFocus(element, focusReturnRef?.current);
    } catch {
      return;
    } finally {
      dismissReview(reviewId.current, event);
    }
  };

  if (!ready) {
    return null;
  }

  const heading =
    placement === "dashboard"
      ? sprintf(__("Your site score is above %s!", "beyondseo"), REVIEW_DASHBOARD_SCORE_THRESHOLD)
      : placement === "editor"
        ? sprintf(__("Your content score is above %s!", "beyondseo"), REVIEW_EDITOR_SCORE_THRESHOLD)
        : __("Enjoying BeyondSEO?", "beyondseo");
  const body =
    placement === "dashboard" || placement === "editor"
      ? __("Enjoying BeyondSEO? We'd love to hear about your experience.", "beyondseo")
      : __("We'd love to hear about your experience.", "beyondseo");

  return (
    <div ref={hostRef} className={styles.reviewHost}>
      {selected === reviewId.current && (
        <section ref={cardRef} className={styles.reviewCard} aria-labelledby={headingId} data-review-card>
          <h3 id={headingId} className={styles.reviewHeading}>
            {heading}
          </h3>
          <p className={styles.reviewBody}>{body}</p>
          <div className={styles.reviewActions}>
            <a
              className={`${styles.reviewButton} ${styles.reviewPrimary}`}
              href={reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleReviewAction("review")}
              onAuxClick={(event) => {
                if (event.button === 1) {
                  handleReviewAction("review");
                }
              }}
            >
              {__("Yes, I love it", "beyondseo")}
            </a>
            <a
              className={styles.reviewButton}
              href={supportUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleReviewAction("support")}
              onAuxClick={(event) => {
                if (event.button === 1) {
                  handleReviewAction("support");
                }
              }}
            >
              {__("Not really", "beyondseo")}
            </a>
            <button
              className={`${styles.reviewButton} ${styles.reviewLater}`}
              type="button"
              onClick={() => handleReviewAction("later")}
            >
              {__("Maybe later", "beyondseo")}
            </button>
          </div>
          <button
            className={styles.reviewClose}
            type="button"
            aria-label={__("Dismiss review request", "beyondseo")}
            onClick={() => handleReviewAction("close")}
          >
            <span aria-hidden="true">×</span>
          </button>
        </section>
      )}
    </div>
  );
};
