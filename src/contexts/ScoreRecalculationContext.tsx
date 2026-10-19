import * as React from "react";
import { createContext, useContext, useCallback, useRef, useEffect } from "react";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { REVIEW_EDITOR_SCORE_THRESHOLD } from "@components/Review/ReviewState";
import { OptimiserStore, type PostApiOptimiserByPostIdOpts } from "@stores/swagger/api/OptimiserStore";

type ReviewEditorQueryParams = PostApiOptimiserByPostIdOpts & { reviewContext?: "editor" };

type ReviewEditorResponse = {
  review?: {
    postId: number;
    completed: boolean;
    score: number | null;
    milestone: boolean;
  };
};

function getReviewEditorPostId() {
  const editor = typeof wp !== "undefined" ? wp.data?.select("core/editor") : undefined;

  return editor ? Number(editor.getCurrentPostId()) : getPathId();
}

interface ScoreRecalculationEventDetail {
  timestamp: number;
  apiResponse?: any;
  error?: any;
}

interface SlugChangeEventDetail {
  timestamp: number;
  oldSlug: string;
  newSlug: string;
  newUrl: string;
}

interface ScoreRecalculationContextType {
  triggerRecalculation: (immediate?: boolean, reviewInteractive?: boolean) => void;
  isRecalculating: boolean;
  editorReview: ReviewBootstrapData | null;
}

const ScoreRecalculationContext = createContext<ScoreRecalculationContextType | undefined>(undefined);

export const useScoreRecalculation = () => {
  const context = useContext(ScoreRecalculationContext);
  if (!context) {
    throw new Error("useScoreRecalculation must be used within ScoreRecalculationProvider");
  }
  return context;
};

interface ScoreRecalculationProviderProps {
  children: React.ReactNode;
  onRecalculationStart?: () => void;
  onRecalculationComplete?: () => void;
}

export const ScoreRecalculationProvider: React.FC<ScoreRecalculationProviderProps> = ({
  children,
  onRecalculationStart,
  onRecalculationComplete,
}) => {
  const dispatch = useAppDispatch();
  const [isRecalculating, setIsRecalculating] = React.useState(false);
  const [editorReview, setEditorReview] = React.useState<ReviewBootstrapData | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const immediateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reviewMountedRef = useRef(false);
  const reviewRevisionRef = useRef(0);
  const reviewRequestRef = useRef<string | null>(null);
  const reviewPendingRecalculationRef = useRef<(() => void) | null>(null);

  const performRecalculation = useCallback(
    async (postId: number, href: string, revision: number, reviewInteractive: boolean): Promise<void> => {
      if (
        !reviewMountedRef.current ||
        !Number.isInteger(postId) ||
        postId <= 0 ||
        revision !== reviewRevisionRef.current ||
        postId !== getReviewEditorPostId() ||
        href !== window.location.href
      )
        return;
      if (reviewRequestRef.current) {
        reviewPendingRecalculationRef.current = () => {
          void performRecalculation(postId, href, revision, reviewInteractive);
        };
        return;
      }

      const isCurrentReviewRequest = () =>
        reviewMountedRef.current &&
        revision === reviewRevisionRef.current &&
        postId === getReviewEditorPostId() &&
        href === window.location.href;

      try {
        setIsRecalculating(true);
        onRecalculationStart?.();

        const queryParams: ReviewEditorQueryParams = { noCache: true };
        if (reviewInteractive) {
          queryParams.reviewContext = "editor";
        }
        const request = dispatch(
          OptimiserStore.postApiOptimiserByPostIdThunk({
            postId,
            requestBody: null,
            queryParams,
          }),
        );
        reviewRequestRef.current = request.requestId;
        const apiResponse = await request;
        if (
          !isCurrentReviewRequest() ||
          apiResponse.meta.requestId !== request.requestId ||
          reviewRequestRef.current !== request.requestId
        )
          return;
        if (OptimiserStore.postApiOptimiserByPostIdThunk.rejected.match(apiResponse)) {
          throw apiResponse.payload ?? apiResponse.error;
        }
        if (!OptimiserStore.postApiOptimiserByPostIdThunk.fulfilled.match(apiResponse)) return;

        const review = (apiResponse.payload as unknown as ReviewEditorResponse)?.review;
        const reviewData = window.rankingCoachReactData?.review;
        if (
          reviewInteractive &&
          review?.completed === true &&
          review.milestone === true &&
          review.postId === postId &&
          typeof review.score === "number" &&
          Number.isFinite(review.score) &&
          review.score > REVIEW_EDITOR_SCORE_THRESHOLD &&
          review.score <= 100 &&
          reviewData
        ) {
          setEditorReview({ ...reviewData, eligible: true });
        }

        const event = new CustomEvent<ScoreRecalculationEventDetail>("rankingcoach-score-recalculated", {
          detail: {
            timestamp: Date.now(),
            apiResponse,
          },
        });
        document.dispatchEvent(event);
      } catch (error) {
        if (isCurrentReviewRequest()) {
          const errorEvent = new CustomEvent<ScoreRecalculationEventDetail>("rankingcoach-score-recalculated", {
            detail: {
              timestamp: Date.now(),
              error,
            },
          });
          document.dispatchEvent(errorEvent);
        }
      } finally {
        reviewRequestRef.current = null;
        if (reviewMountedRef.current) {
          setIsRecalculating(false);
          onRecalculationComplete?.();
        }
        const pendingRecalculation = reviewPendingRecalculationRef.current;
        reviewPendingRecalculationRef.current = null;
        pendingRecalculation?.();
      }
    },
    [dispatch, onRecalculationStart, onRecalculationComplete],
  );

  const triggerRecalculation = useCallback(
    (immediate = false, reviewInteractive = true) => {
      const postId = getReviewEditorPostId();
      const href = window.location.href;
      const revision = ++reviewRevisionRef.current;
      reviewPendingRecalculationRef.current = null;
      // Clear existing timeouts
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
        debounceTimeoutRef.current = null;
      }
      if (immediateTimeoutRef.current) {
        clearTimeout(immediateTimeoutRef.current);
        immediateTimeoutRef.current = null;
      }

      if (immediate) {
        // For immediate actions (save, keyword add/remove), short delay to ensure data is persisted
        immediateTimeoutRef.current = setTimeout(() => {
          performRecalculation(postId, href, revision, reviewInteractive).then((r) => r);
        }, 500);
      } else {
        // For real-time changes (typing), longer debounce
        debounceTimeoutRef.current = setTimeout(() => {
          performRecalculation(postId, href, revision, reviewInteractive).then((r) => r);
        }, 2000);
      }
    },
    [performRecalculation],
  );

  useEffect(() => {
    reviewMountedRef.current = true;
    let postId = getReviewEditorPostId();
    let href = window.location.href;
    const invalidateReview = () => {
      ++reviewRevisionRef.current;
      reviewPendingRecalculationRef.current = null;
      setEditorReview(null);
      postId = getReviewEditorPostId();
      href = window.location.href;
    };
    const checkReviewNavigation = () => {
      if (postId !== getReviewEditorPostId() || href !== window.location.href) {
        invalidateReview();
      }
    };
    const unsubscribe = typeof wp !== "undefined" ? wp.data?.subscribe(checkReviewNavigation) : undefined;
    window.addEventListener("popstate", invalidateReview);
    window.addEventListener("pagehide", invalidateReview);

    return () => {
      reviewMountedRef.current = false;
      ++reviewRevisionRef.current;
      reviewPendingRecalculationRef.current = null;
      unsubscribe?.();
      window.removeEventListener("popstate", invalidateReview);
      window.removeEventListener("pagehide", invalidateReview);
    };
  }, []);

  // Global Gutenberg monitoring - works regardless of active tab
  useEffect(() => {
    const isGutenberg = typeof wp !== "undefined" && wp.data && wp.data.select("core/editor");

    if (isGutenberg) {
      const { select, subscribe } = wp.data;

      let wasSaving = false;
      let previousTitle = "";
      let previousContent = "";
      let previousSlug = "";
      let currentPost: any = null;

      // Initialize tracking variables
      const initializeTracking = () => {
        const post = select("core/editor")?.getCurrentPost();
        if (post) {
          currentPost = post;
          previousSlug = select("core/editor")?.getEditedPostAttribute("slug") || "";
        }
      };

      initializeTracking();

      const unsubscribe = subscribe(() => {
        const isSaving = select("core/editor")?.isSavingPost() ?? false;
        const didSaveSucceed = select("core/editor")?.didPostSaveRequestSucceed();
        const currentTitle = select("core/editor")?.getEditedPostAttribute("title") || "";
        const currentContent = select("core/editor")?.getEditedPostContent() || "";
        const currentSlug = select("core/editor")?.getEditedPostAttribute("slug") || "";

        // Trigger immediate recalculation on save
        if (wasSaving && !isSaving && didSaveSucceed) {
          triggerRecalculation(true);
        }

        // Handle slug changes with immediate recalculation and event dispatch
        if (currentSlug !== previousSlug && previousSlug !== "") {
          // Calculate new URL
          let newUrl = "";
          if (currentPost?.link) {
            const savedSlug = currentPost.slug;
            newUrl = currentPost.link.replace(new RegExp(`/${savedSlug}(/|\\?|$)`), `/${currentSlug}$1`);
          }

          // Dispatch slug change event for SERPPreview and other components
          const slugChangeEvent = new CustomEvent<SlugChangeEventDetail>("rankingcoach-slug-changed", {
            detail: {
              timestamp: Date.now(),
              oldSlug: previousSlug,
              newSlug: currentSlug,
              newUrl: newUrl,
            },
          });
          document.dispatchEvent(slugChangeEvent);

          // Trigger immediate score recalculation
          triggerRecalculation(true);
          previousSlug = currentSlug;
        } else if (previousSlug === "") {
          // Initialize slug tracking
          previousSlug = currentSlug;
        }

        // Trigger debounced recalculation on content changes
        if (
          currentTitle !== previousTitle
          //|| currentContent !== previousContent
        ) {
          if (
            previousTitle !== ""
            //|| previousContent !== ""
          ) {
            // Skip initial load
            triggerRecalculation(false);
          }
          previousTitle = currentTitle;
          //previousContent = currentContent;
        }

        wasSaving = isSaving;
      });

      return () => unsubscribe();
    } else {
      // Classic Editor slug monitoring
      const slugInput = document.querySelector("#post_name") as HTMLInputElement | null;
      const permalinkEl = document.querySelector("#sample-permalink") as HTMLElement | null;

      if (slugInput && permalinkEl) {
        let previousSlug = slugInput.value;

        const observer = new MutationObserver(() => {
          const newSlug = slugInput.value;
          const newPermalink = permalinkEl.textContent || permalinkEl.innerText || "";

          if (newSlug !== previousSlug && previousSlug !== "") {
            // Extract and build new URL
            const oldSlugMatch = newPermalink.match(/\/([^\/?#]+)(\/|\?|$)/);
            const oldSlug = oldSlugMatch ? oldSlugMatch[1] : null;
            let newUrl = "";

            if (oldSlug && newPermalink.includes(oldSlug)) {
              newUrl = newPermalink.replace(new RegExp(`/${oldSlug}(/|\\?|$)`), `/${newSlug}$1`);
            }

            // Dispatch slug change event
            const slugChangeEvent = new CustomEvent<SlugChangeEventDetail>("rankingcoach-slug-changed", {
              detail: {
                timestamp: Date.now(),
                oldSlug: previousSlug,
                newSlug: newSlug,
                newUrl: newUrl,
              },
            });
            document.dispatchEvent(slugChangeEvent);

            // Trigger immediate score recalculation
            triggerRecalculation(true);
            previousSlug = newSlug;
          } else if (previousSlug === "") {
            previousSlug = newSlug;
          }
        });

        observer.observe(permalinkEl, { childList: true, subtree: true });
        observer.observe(slugInput, { attributes: true, childList: true, subtree: true });

        return () => observer.disconnect();
      }
    }
  }, [triggerRecalculation]);

  // Elementor save monitoring - trigger score recalculation after save
  useEffect(() => {
    const handleElementorSave = (
      event: CustomEvent<{ timestamp: number; documentId?: number | null; saveSuccess: boolean }>,
    ) => {
      console.log("[RankingCoach] Elementor save detected, triggering score recalculation");
      // Use immediate recalculation (500ms delay) for save actions
      triggerRecalculation(
        true,
        event.detail.saveSuccess === true && event.detail.documentId === getReviewEditorPostId(),
      );
    };

    document.addEventListener("rankingcoach-elementor-saved", handleElementorSave as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-elementor-saved", handleElementorSave as EventListener);
    };
  }, [triggerRecalculation]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (immediateTimeoutRef.current) {
        clearTimeout(immediateTimeoutRef.current);
      }
    };
  }, []);

  const value = React.useMemo(
    () => ({
      triggerRecalculation,
      isRecalculating,
      editorReview,
    }),
    [triggerRecalculation, isRecalculating, editorReview],
  );

  return <ScoreRecalculationContext.Provider value={value}>{children}</ScoreRecalculationContext.Provider>;
};
