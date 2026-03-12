import * as React from "react";
import { useEffect, useMemo, useState, useCallback } from "react";
import { Container, createRoot } from "react-dom/client";
import "./index.css";

import App from "./App";
import { PersistGate } from "redux-persist/integration/react";
import { MainStore, MainStorePersistor, RootState } from "./main.store";
import { Provider, useDispatch, useSelector } from "react-redux";
import "@vanguard-style";
import { useLocaleLoader } from "@hooks/use-locale-loader";
import { GutenbergSidebar } from "@components/GutenbergSidebar/GutenbergSidebar";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";
import { AppSlice } from "./App.slice";

// this is a workaround to load the css files
import "@components/TabsManager/TabsManager.css";
import "@components/TabsManager/Tabs/GeneralTab/GeneralTab.module.scss";
import "@components/TabsManager/Tabs/OptimisationTab/OptimisationTab.css";
import "@components/TabsManager/Tabs/SchemaTab/SchemaTab.css";
import "@components/SeoScoreCell/SeoScoreCell.module.scss";
import "@components/Common/DonutChart/DonutChart.module.scss";

import { rcWindow } from "@stores/window.store";
import { ComponentContainer, Render } from "vanguard";
import { Onboarding } from "@src/components/Onboarding/Onboarding";
import { Registration } from "@src/components/Registration/Registration";
import { SEOOptimiser } from "@components/SEO/SEOOptimiser/SEOOptimiser";
import { fetchPost } from "@helpers/post-helpers";
import { PluginInformationStore } from "@stores/swagger/api/PluginInformationStore";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { WPKeywordsAnalysis } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/WPKeywordsAnalysis";
import { WPWebPageKeywordsMetaTag } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag";
import { SeoScoreCell } from "@components/SeoScoreCell/SeoScoreCell";
import { ScoreButtonHeader } from "@components/ScoreButtonHeader/ScoreButtonHeader";
import Settings from "@components/Settings/Settings";
import { Upsell } from "@components/Upsell/Upsell";
import { __ } from "@wordpress/i18n";
const params = new URLSearchParams(window.location.search);
const hasDebug = ["1", "true"].includes(params.get("debug") || "");

const componentsToLoad = (rcWindow.rankingCoachReactData?.loadNextComponents || "").split(",");


interface FactorSuggestion {
  id: number;
  operationKey: string;
  title: string;
  description: string;
  priority: number;
  activationThreshold: number;
  additionalInfo: any[];
}

interface DisplayFactor {
  name: string;
  score: number;
  description?: string;
  suggestions?: FactorSuggestion[];
}

interface AnalysisResult {
  score: number;
  contexts: {
    elements: Array<{
      score?: number;
      factors: {
        elements: Array<{
          factorName: string;
          description?: string;
          score: number;
          suggestions?: {
            elements: FactorSuggestion[];
          };
        }>;
      };
    }>;
  };
  topSuggestions?: {
    elements: FactorSuggestion[];
  };
}

const MainComponent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isLocaleReady = useLocaleLoader();
  const dispatch = useAppDispatch();
  const { isPluginDataLoaded, isFetchingPluginData } = useSelector((state: RootState) => state.app);
  const { isCurrentPostLoaded, isFetchingPostData } = useSelector((state: RootState) => state.post);
  let { currentPostType, currentPostId, isEditingPost } = rcWindow?.rankingCoachReactData || {};

  const postId = wp?.data?.select("core/editor")?.getCurrentPostId();
  const postStatus = wp?.data?.select("core/editor")?.getCurrentPost()?.status;
  const isAddingPost = postStatus === "auto-draft" && postId !== 0;

  // Cache mechanism to prevent duplicate fetchPost calls
  const [fetchPostExecuted, setFetchPostExecuted] = useState(false);

  useEffect(() => {
    if (!isPluginDataLoaded && !isFetchingPluginData) {
      dispatch(
        PluginInformationStore.postApiPluginInformationThunk({
          requestBody: null,
          queryParams: { debug: true, noCache: true },
        }),
      );
    }
  }, [isPluginDataLoaded, isFetchingPluginData]);

  useEffect(() => {
    if (fetchPostExecuted || isCurrentPostLoaded || isFetchingPostData) return;

    const shouldFetchForEditing = isEditingPost && ["post", "page"].includes(currentPostType);
    const shouldFetchForAdding = isAddingPost;

    if (shouldFetchForEditing || shouldFetchForAdding) {
      const targetPostId = shouldFetchForAdding ? postId : currentPostId;

      // Validate targetPostId before executing fetchPost
      if (!targetPostId || isNaN(targetPostId) || targetPostId <= 0) {
        return;
      }

      if (postId) {
        rcWindow.rankingCoachReactData.currentPostId = postId;
      }

      setFetchPostExecuted(true);
      dispatch(fetchPost({ postId: targetPostId, postType: currentPostType }));
    }
  }, [
    isEditingPost,
    currentPostType,
    currentPostId,
    isAddingPost,
    postId,
    isCurrentPostLoaded,
    isFetchingPostData,
    fetchPostExecuted,
  ]);

  const isLoading = !(isPluginDataLoaded && isLocaleReady);

  return (
    <ComponentContainer testId={"rc-main-container"} style={{ width: "100%" }}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && (child.type === Onboarding || child.type === Registration)) {
          // @ts-ignore
          return React.cloneElement(child, { isPluginLoading: isLoading });
        }
        return isLoading ? <div style={{ opacity: 0.1 }}>Loading...</div> : child;
      })}
    </ComponentContainer>
  );
};

const renderWithProviders = (container: Container | null, Component: React.ComponentType) => {
  if (container) {
    createRoot(container).render(
      <Provider store={MainStore}>
        <PersistGate persistor={MainStorePersistor}>
          <MainComponent>
            <Component />
          </MainComponent>
        </PersistGate>
      </Provider>,
    );
  }
};

const COMPONENTS_MAP: Record<string, React.ComponentType> = {
  add_new: () => {
    // This component is used for the "Add New" post type page
    return <></>;
  },
  edit: () => <App hideTabs={false} />,
  float: () => {
    const { metaTagsData, seoTitle, seoDescription, seoKeywords, isMetaTagsDataLoaded } = useSelector(
      (state: RootState) => state.app,
    );
    const [showFloating, setShowFloating] = useState(false);
    const dispatch = useAppDispatch();
    const SEOOptimiserProps = {
      headerText: "BeyondSEO",
      loadingText: __("Checking your page for<br>existing keywords", 'beyondseo'),
      noKeywordsText: __("This page doesn`t have keywords", 'beyondseo'),
      noKeywordsDescription:
        __("Using the right keywords can significantly increase your website`s visibility, making it easier for people to find it.", 'beyondseo'),
      closeButtonText: __("Close", 'beyondseo'),
      useKwdButtonText: __("Use these keywords", 'beyondseo'),
      skipKwdButtonText: __("Skip this", 'beyondseo'),
    };

    useEffect(() => {
      const handleTriggerKeywordGenerator = () => {
        setShowFloating(true);
      };

      document.addEventListener("rankingcoach-trigger-keyword-generator", handleTriggerKeywordGenerator);

      return () => {
        document.removeEventListener("rankingcoach-trigger-keyword-generator", handleTriggerKeywordGenerator);
      };
    }, []);

    const handleOnUseKeywordsFunction = (keywords: WPKeywordsAnalysis) => {
      let currentPostId = getPathId();
      let oldKeywords = { ...metaTagsData?.keywords } as WPWebPageKeywordsMetaTag;

      const uniqueKeywordsSet = new Set<string>();

      if (keywords.primaryKeywordFromContent?.name) {
        uniqueKeywordsSet.add(keywords.primaryKeywordFromContent.name);
      } else if (keywords.primaryKeywordFromExisting?.name) {
        uniqueKeywordsSet.add(keywords.primaryKeywordFromExisting.name);
      }

      if (
        keywords.additionalKeywordsFromContent?.elements &&
        keywords.additionalKeywordsFromContent.elements.length > 0
      ) {
        keywords.additionalKeywordsFromContent.elements.forEach((keyword) => {
          if (keyword.name) {
            uniqueKeywordsSet.add(keyword.name);
          }
        });
      }

      if (
        keywords.additionalKeywordsFromExisting?.elements &&
        keywords.additionalKeywordsFromExisting.elements.length > 0
      ) {
        keywords.additionalKeywordsFromExisting.elements.forEach((keyword) => {
          if (keyword.name) {
            uniqueKeywordsSet.add(keyword.name);
          }
        });
      }

      const uniqueKeywords = Array.from(uniqueKeywordsSet);

      if (uniqueKeywords.length > 0) {
        oldKeywords.content = uniqueKeywords.join(",");
      }

      dispatch(
        MetatagsStore.postApiMetatagsByPostIdThunk({
          postId: currentPostId,
          requestBody: {
            keywords: oldKeywords,
          },
          queryParams: {},
        }),
      ).then(() => {
        const keywordsUpdatedEvent = new CustomEvent("rankingcoach-keywords-updated");
        document.dispatchEvent(keywordsUpdatedEvent);
      });
      setShowFloating(false);
    };

    return (
      <Render if={!!showFloating}>
        <SEOOptimiser
          onCloseFunction={() => setShowFloating(false)}
          onUseKeywordsFunction={handleOnUseKeywordsFunction}
          {...SEOOptimiserProps}
        />
      </Render>
    );
  },
  onboarding: () => {
    return <Onboarding />;
  },

  registration: () => {
    // console.log("[MAIN] Registration component factory called");
    return <Registration />;
  },

  upsell: () => {
    return <Upsell />;
  },

  generalSettings: () => {
    const [showGeneralSettings, setShowGeneralSettings] = useState(true);
    return (
      <Render if={showGeneralSettings}>
        <Settings />
      </Render>
    );
  },
  elementor: () => <App hideTabs={false} context={"elementor"} />,
  postlist: () => {
    // This component will be rendered for each post cell in the list
    // The actual rendering of individual cells will be handled separately
    return <></>;
  },
  scoreOrbHeaderButton: () => {
    return <ScoreButtonHeader />;
  },

  gutenbergSidebar: () => {
    const dispatch = useAppDispatch();
    const { optimiserResult } = useSelector((state: RootState) => state.app);
    const [isLoading, setIsLoading] = useState(false);
    const [hasOnboardingError, setHasOnboardingError] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);

    // Calculate the overall score from the optimiserResult
    const overallScore = useMemo(() => {
      if (optimiserResult && typeof optimiserResult.score === "number") {
        const rawScore = optimiserResult.score;
        return rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);
      }
      return 0;
    }, [optimiserResult]);

    // Load data if not already in the store - single execution control
    useEffect(() => {
      if (!optimiserResult && !isLoading && !hasOnboardingError && !dataFetched) {
        setIsLoading(true);
        setDataFetched(true);

        dispatch(
          OptimiserStore.getApiOptimiserByPostIdThunk({
            postId: getPathId(),
            queryParams: { noCache: false },
          }),
        ).then((result) => {
          // Check if the action was rejected
          if (result.meta.requestStatus === "rejected") {

            // Check if this is an onboarding error and stop further attempts
            const errorPayload = result.payload as any;
            if (
              errorPayload &&
              typeof errorPayload === "object" &&
              errorPayload.code === "rest_forbidden" &&
              errorPayload.message &&
              typeof errorPayload.message === "string" &&
              errorPayload.message.includes("complete onboarding")
            ) {
              setHasOnboardingError(true);
            }
          }
        }).finally(() => {
          setIsLoading(false);
        });
      }
    }, [optimiserResult, isLoading, hasOnboardingError, dataFetched, dispatch]);

    // Listen for score recalculation events to update the UI
    React.useEffect(() => {
      const handleScoreRecalculated = (event: CustomEvent<{ timestamp: number; apiResponse?: any; error?: any }>) => {
        // No need to set local state as the Redux store will be updated by the event
      };

      document.addEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);

      return () => {
        document.removeEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);
      };
    }, []);

    const SEOOptimiserProps = {
      headerText: __("BeyondSEO", "beyondseo"),
      overallScore: overallScore,
      analysisResult: optimiserResult
        ? {
          contexts: {
            elements:
              optimiserResult.contexts?.elements?.map((context) => ({
                contextName: context.contextName || "",
                score: context.score,
                weight: context.weight || 1,
                weightedScore: Math.round((context.score || 0) * (context.weight || 1)) * 100,
                factors: {
                  elements:
                    context.factors?.elements?.map((factor) => ({
                      factorName: factor.factorName || "",
                      score: factor.score || 0,
                      status: factor.status,
                      suggestions: factor.suggestions
                        ? {
                          elements:
                            factor.suggestions.elements?.map((suggestion) => ({
                              title: suggestion.title || "",
                              description: suggestion.description || "",
                            })) || [],
                        }
                        : undefined,
                    })) || [],
                },
              })) || [],
          },
        }
        : undefined,
      isLoading: isLoading,
    };

    // @ts-ignore
    return <GutenbergSidebar {...SEOOptimiserProps} />;
  },
};

export function initializeApp() {
  const CONTAINERS = {
    edit: document.getElementById("edit-rankingcoach-react"),
    float: document.getElementById("seo-optimiser-rankingcoach-react"),
    onboarding: document.getElementById("onboarding-rankingcoach-page"),
    registration: document.getElementById("registration-rankingcoach-page"),
    upsell: document.getElementById("upsell-rankingcoach-page"),
    generalSettings: document.getElementById("generalSettings-rankingcoach-page"),
    gutenbergSidebar: document.getElementById("rankingcoach-sidebar-content"),
    elementor: document.getElementById("rankingcoach-elementor-content"),
    postlist: document.getElementById("rc-postlist-container"),
    scoreOrbHeaderButton: document.getElementById("rc-aiorb-header-button-container"),
  };

  Object.entries(CONTAINERS).forEach(([key, container]) => {
    if (container && componentsToLoad.includes(key)) {
      renderWithProviders(container, COMPONENTS_MAP[key]);
    }
  });
}

/**
 * Maximum number of SEO score cells to render in the post list.
 * Limits the number of React component instances for performance optimization.
 */
const MAX_SEO_SCORE_CELLS = 20;

/**
 * Initializes the SeoScoreCell components for post list items
 * This function finds all post cell elements and renders the SeoScoreCell component in each one
 * Limited to MAX_SEO_SCORE_CELLS items for performance optimization
 * Components are loaded sequentially to prevent AJAX overload
 */
export function initializePostCells() {
  const renderPostCells = async () => {
    const postCellElements = document.querySelectorAll(".rc-react-postcell");
    const elementsToRender = Array.from(postCellElements).slice(0, MAX_SEO_SCORE_CELLS);

    // Render components sequentially, one at a time
    for (const div of elementsToRender) {
      await new Promise<void>((resolve) => {
        const postId = parseInt(div.getAttribute("data-id") || "0");
        const SeoScoreCellWrapper = () => <SeoScoreCell postId={postId} onDataLoaded={resolve} />;
        renderWithProviders(div, SeoScoreCellWrapper);
      });
    }
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(renderPostCells, 0);
  } else {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(renderPostCells, 0);
    });
  }
}

function initializeScoreHeaderButton() {
  const renderScoreHeaderButton = () => {
    if (!document.getElementById("rc-aiorb-header-button-container")) {
      const editorHeaderSettings = document.querySelector(".editor-header__settings");
      let container: HTMLDivElement | null = null;
      if (editorHeaderSettings) {
        container = document.createElement("div");
        container.id = "rc-aiorb-header-button-container";
        editorHeaderSettings.insertBefore(container, editorHeaderSettings.firstChild);
      }

      renderWithProviders(container, ScoreButtonHeader);
    }
  };

  if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(renderScoreHeaderButton, 1000);
  } else {
    document.addEventListener("DOMContentLoaded", renderScoreHeaderButton);
  }
}

// Initialize Gutenberg sidebar when the sidebar is opened
function initializeGutenbergSidebar() {
  const sidebarContainer = document.getElementById("rankingcoach-sidebar-content");

  if (sidebarContainer) {
    // Clear any existing content to prevent React errors
    while (sidebarContainer.firstChild) {
      sidebarContainer.removeChild(sidebarContainer.firstChild);
    }

    // Render the sidebar component
    renderWithProviders(sidebarContainer, COMPONENTS_MAP.gutenbergSidebar);
    return true;
  } else {
    return false;
  }
}

const isTrashedPostList = params.get("post_status") === "trash" && (params.get("post_type") === "post" || params.get("post_type") === "page");

initializeApp();
if (!isTrashedPostList) {
  initializePostCells();
  initializeScoreHeaderButton();
  initializeGutenbergSidebar();
}

(window as any).initializeApp = initializeApp;
(window as any).initializePostCells = initializePostCells;
(window as any).initializeAIOrbHeaderButton = initializeScoreHeaderButton;
(window as any).initializeGutenbergSidebar = initializeGutenbergSidebar;
