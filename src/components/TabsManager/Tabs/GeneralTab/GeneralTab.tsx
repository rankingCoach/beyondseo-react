import * as React from "react";
import { useEffect, useState } from "react";
import { classNames, ComponentContainer, VanguardStyle } from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { useSelector } from "react-redux";
import { getPathId } from "@helpers/get-path-id";
import { rcWindow } from "@stores/window.store";
import { SEOMetadataAndKeywords } from "@components/SEOMetadataAndKeywords/SEOMetadataAndKeywords";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { GeneralTabPlaceholder } from "./GeneralTabPlaceholder";
import styles from "./GeneralTab.module.scss";
import tabsStyles from "../Tabs.module.scss";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import { RootState } from "@src/main.store";
import { __ } from "@wordpress/i18n";
import { SeoStore } from "@src/stores/swagger/rankingcoach/SeoStore";
import { AppSlice } from "@src/App.slice";

export const GeneralTab = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const { proVersion } = props;
  const dispatch = useAppDispatch();
  const currentPostId = getPathId();
  const { currentPostType, isEditingPost } = rcWindow?.rankingCoachReactData;
  // Add refresh state to trigger re-renders
  const [refreshKey, setRefreshKey] = useState(0);
  const { optimiserResult } = useSelector((state: RootState) => state.app);
  const { triggerRecalculation } = useScoreRecalculation();

  const { currentPost } = useSelector((state: RootState) => state.post);

  const recalculationAttempted = React.useRef(false);

  const loadMetaData = async (postId: number) => {
    try {
      setIsLoading(true);
      if (postId && postId > 0) {
        const [metatags, breadcrumbs] = await Promise.all([
          dispatch(
            MetatagsStore.getApiMetatagsByPostIdThunk({
              postId,
              queryParams: {},
            }),
          ),
          dispatch(
            SeoStore.postRankingcoachSeoBreadcrumbsThunk({
              requestBody: {
                types: ["page", "post", "archive", "search", "404"],
                context: [],
                post_id: String(postId),
              },
            }),
          ),
        ]);

        if (breadcrumbs?.payload?.response) {
          dispatch(AppSlice.setBreadcrumbsData(breadcrumbs.payload.response));
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      if (isEditingPost && (currentPostType === "post" || currentPostType === "page")) {
        await loadMetaData(currentPostId);
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [dispatch, currentPostId, isEditingPost, currentPostType, refreshKey]);

  // Trigger recalculation only if optimiserResult is null and not already attempted
  useEffect(() => {
    if (optimiserResult === null && !isLoading && currentPostId > 0 && !recalculationAttempted.current) {
      recalculationAttempted.current = true;
      triggerRecalculation(true);
    }
    // Reset the flag when we get a successful result so future recalculations work
    if (optimiserResult !== null) {
      recalculationAttempted.current = false;
    }
  }, [optimiserResult, isLoading, currentPostId, triggerRecalculation]);

  // Listen for global score recalculation events for logging
  useEffect(() => {
    const handleScoreRecalculated = (event: CustomEvent<{ timestamp: number; apiResponse?: any; error?: any }>) => {
      const { error } = event.detail;
      if (error) {
      } else {
      }
    };

    document.addEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);
    };
  }, []);

  return (
    <div className={classNames(styles.generalTabContainerOuter, tabsStyles.tabContent)}>
      <div className={styles.generalTabMainContent}>
        {isLoading ? (
          <GeneralTabPlaceholder />
        ) : (
          <ComponentContainer className={"seo-metadata-and-keywords-container"}>
            <SEOMetadataAndKeywords proVersion={proVersion} />
          </ComponentContainer>
        )}
      </div>
    </div>
  );
};
