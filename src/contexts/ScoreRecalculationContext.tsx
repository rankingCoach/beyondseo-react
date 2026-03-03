import * as React from "react";
import { createContext, useContext, useCallback, useRef, useEffect } from "react";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";

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
  triggerRecalculation: (immediate?: boolean) => void;
  isRecalculating: boolean;
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
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const immediateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const performRecalculation = useCallback(async () => {
    if (isRecalculating) return;

    try {
      setIsRecalculating(true);
      onRecalculationStart?.();


      const apiResponse = await dispatch(
        OptimiserStore.postApiOptimiserByPostIdThunk({
          postId: getPathId(),
          requestBody: null,
          queryParams: { noCache: true },
        })
      );

      // Dispatch custom event with the API response for OptimisationTab
      const event = new CustomEvent<ScoreRecalculationEventDetail>("rankingcoach-score-recalculated", {
        detail: {
          timestamp: Date.now(),
          apiResponse: apiResponse
        }
      });
      document.dispatchEvent(event);

      onRecalculationComplete?.();
    } catch (error) {

      // Dispatch error event
      const errorEvent = new CustomEvent<ScoreRecalculationEventDetail>("rankingcoach-score-recalculated", {
        detail: {
          timestamp: Date.now(),
          error: error
        }
      });
      document.dispatchEvent(errorEvent);
    } finally {
      setIsRecalculating(false);
    }
  }, [dispatch, isRecalculating, onRecalculationStart, onRecalculationComplete]);

  const triggerRecalculation = useCallback((immediate = false) => {
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
        performRecalculation().then(r => r);
      }, 500);
    } else {
      // For real-time changes (typing), longer debounce
      debounceTimeoutRef.current = setTimeout(() => {
        performRecalculation().then(r => r);
      }, 2000);
    }
  }, [performRecalculation]);

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
            newUrl = currentPost.link.replace(
              new RegExp(`/${savedSlug}(/|\\?|$)`),
              `/${currentSlug}$1`
            );
          }

          // Dispatch slug change event for SERPPreview and other components
          const slugChangeEvent = new CustomEvent<SlugChangeEventDetail>("rankingcoach-slug-changed", {
            detail: {
              timestamp: Date.now(),
              oldSlug: previousSlug,
              newSlug: currentSlug,
              newUrl: newUrl
            }
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
          if (previousTitle !== ""
            //|| previousContent !== ""
          ) { // Skip initial load
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
                newUrl: newUrl
              }
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
      event: CustomEvent<{ timestamp: number; documentId?: number | null; saveSuccess: boolean }>
    ) => {
      console.log('[RankingCoach] Elementor save detected, triggering score recalculation');
      // Use immediate recalculation (500ms delay) for save actions
      triggerRecalculation(true);
    };

    document.addEventListener('rankingcoach-elementor-saved', handleElementorSave as EventListener);

    return () => {
      document.removeEventListener('rankingcoach-elementor-saved', handleElementorSave as EventListener);
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

  const value = React.useMemo(() => ({
    triggerRecalculation,
    isRecalculating,
  }), [triggerRecalculation, isRecalculating]);

  return (
    <ScoreRecalculationContext.Provider value={value}>
      {children}
    </ScoreRecalculationContext.Provider>
  );
};
