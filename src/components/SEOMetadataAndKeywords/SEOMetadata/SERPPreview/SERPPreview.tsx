import { useEffect, useState } from "react";
import styles from "./SERPPreview.module.scss";
import {
  classNames,
  ComponentContainer,
  FontWeights,
  Icon,
  IconNames,
  IconSize,
  Render,
  VanguardStyle,
} from "vanguard";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { AppSlice } from "@src/App.slice";
import { useSlugChangeRecalculation } from "@hooks/use-slug-change-recalculation";
import { WPWebPageKeywordsMetaTag } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag";
import { Text } from "vanguard";
import { SeoStore } from "@src/stores/swagger/rankingcoach/SeoStore";
import {__} from "@wordpress/i18n";

interface SERPPreviewProps {
  title?: string | null;
  description?: string | null;
  keywords?: WPWebPageKeywordsMetaTag | null;
  url?: string | null;
  openInNewTab?: boolean;
}

export const serpPreviewProps: SERPPreviewProps = {
  title: "",
  description: "",
  keywords: null,
  url: "",
  openInNewTab: true,
};

export enum PreviewBreakpointsMode {
  desktop = "desktop",
  tablet = "tablet",
}

interface BreadcrumbItem {
  name: string;
  description: string;
  url: string;
  type: string;
  position: number;
}

export const SERPPreview = (props: SERPPreviewProps) => {
  const {} = props;
  const {
    seoTitle,
    seoDescription,
    previewTitle,
    previewDescription,
    parsedTitle,
    parsedDescription,
    isMetaTagsDataLoaded,
    metaTagsData,
    breadcrumbsData,
    isBreadcrumbsLoaded,
  } = useSelector((state: RootState) => state.app);
  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  // const { currentPostType } = useSelector((state: RootState) => state.post);
  const [previewMode, setPreviewMode] = useState<string | "desktop" | "tablet">(PreviewBreakpointsMode.desktop);
  const { setPreviewTitle, setPreviewDescription, setParsedTitle, setParsedDescription } = AppSlice;
  const [seoUrl, setSeoUrl] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<string>("");
  const [separator, setSeparator] = useState<string>("|");
  const dispatch = useAppDispatch();

  // Integrate slug change recalculation
  const { isRecalculating } = useSlugChangeRecalculation();

  // Handle preview mode changes
  const handlePreviewModeChange = (mode: "desktop" | "tablet") => {
    setPreviewMode(mode);
  };

  // Event-driven slug change listener - replaces direct wp.data monitoring
  useEffect(() => {
    const handleSlugChange = (
      event: CustomEvent<{
        timestamp: number;
        oldSlug: string;
        newSlug: string;
        newUrl: string;
      }>,
    ) => {
      const { newUrl, newSlug, oldSlug } = event.detail;
      setSeoUrl(newUrl);
    };

    // Listen for slug changes from ScoreRecalculationProvider
    document.addEventListener("rankingcoach-slug-changed", handleSlugChange as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-slug-changed", handleSlugChange as EventListener);
    };
  }, []);

  // Update breadcrumbs when data is loaded
  useEffect(() => {
    if (isBreadcrumbsLoaded && breadcrumbsData?.breadcrumbs) {
      // Get the appropriate breadcrumb data based on post type
      const breadcrumbItems =
        currentPost?.type === "page" ? breadcrumbsData.breadcrumbs.page : breadcrumbsData.breadcrumbs.post;

      const sep = breadcrumbsData.meta?.settings_applied?.separator || "»";
      setSeparator(sep);

      if (breadcrumbItems?.length > 0) {
        const formattedBreadcrumbs: string = breadcrumbItems.map((item: BreadcrumbItem) => item.name).join(` ${sep} `);
        setBreadcrumbs(formattedBreadcrumbs);
      } else {
        setSeoUrl(currentPost?.link ?? null);
      }
    }
  }, [breadcrumbsData, isBreadcrumbsLoaded, currentPost?.type]);

  // Set preview data on initial load
  useEffect(() => {
    if (isCurrentPostLoaded && currentPost) {
      if (!seoUrl) setSeoUrl(currentPost.link ?? null);
      if (!seoTitle) dispatch(setPreviewTitle(currentPost.title?.rendered ?? ""));
      if (!seoDescription && !parsedDescription) {
        dispatch(setPreviewDescription(currentPost.excerpt?.filtered ?? ""));
      }
    }
  }, [isCurrentPostLoaded, currentPost?.id]);

  // Update preview title only when textarea content changes
  useEffect(() => {
    if (parsedTitle) {
      dispatch(setPreviewTitle(parsedTitle));
    }
  }, [parsedTitle]);

  // Update preview description only when textarea content changes
  useEffect(() => {
    if (parsedDescription) {
      dispatch(setPreviewDescription(parsedDescription));
    }
  }, [parsedDescription]);

  return (
    <Render if={isMetaTagsDataLoaded}>
      <ComponentContainer testId={"serp-preview-container"} className={styles.serpPreviewContainer}>
        <Text fontWeight={FontWeights.bold}>{__("SERP Preview", 'beyondseo')}</Text>

        <div className={classNames(styles.serpPreviewBreakpoints, VanguardStyle.dFlex, VanguardStyle.gap1)}>
          {/* Desktop Icon */}
          <Icon
            className={classNames(styles.desktopIcon)}
            color={previewMode === "desktop" ? "--n800" : "--n400"}
            type={IconSize.small}
            onClick={() => handlePreviewModeChange("desktop")}
          >
            {IconNames.desktop}
          </Icon>

          {/* Tablet Icon */}
          <Icon
            className={classNames(styles.tabletIcon)}
            color={previewMode === "tablet" ? "--n800" : "--n400"}
            type={IconSize.small}
            onClick={() => handlePreviewModeChange("tablet")}
          >
            {IconNames.tablet}
          </Icon>
        </div>

        <div
          className={classNames(
            styles.serpPreviewContent,
            previewMode === "desktop" ? styles.contentDesktopModePreview : styles.contentTabletModePreview,
            isRecalculating ? styles.recalculating : "",
          )}
        >
          {isCurrentPostLoaded && (
            <>
              <div className={styles.serpSeoUrl}>
                {breadcrumbs ? (
                  <span>
                    {breadcrumbs.split(` ${separator} `).map((part, index, array) => (
                      <>
                        <span className={styles.breadcrumbPart}>{part}</span>
                        {index < array.length - 1 && <span className={styles.separator}>{separator}</span>}
                      </>
                    ))}
                  </span>
                ) : (
                  <span className={styles.breadcrumbPart}>{seoUrl}</span>
                )}
                {isRecalculating && <span className={styles.recalculatingIndicator}>⟳</span>}
              </div>
              <div className={styles.serpSeoTitle}>{previewTitle || currentPost?.title.rendered || ""}</div>
              <div className={styles.serpSeoDescription}>{previewDescription}</div>
            </>
          )}
        </div>
      </ComponentContainer>
    </Render>
  );
};
