import React, { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import styles from "./GutenbergSidebar.module.scss";
import { AIOrb, AIOrbSize, AIOrbStatus, classNames, ComponentContainer, FontWeights, Text, TextTypes } from "vanguard";
import GutenbergSidebarPlaceholder from "./GutenbergSidebarPlaceholder";
import {
  calculateDonutStrokeDasharray,
  getOptimisationMessage,
  transformAnalysisResult,
  type AnalysisResult,
} from "./GutenbergSidebarHelpers";
import { GutenbergSidebarStateProvider, useGutenbergSidebarState } from "./GutenbergSidebarContext";
import { ContentCategoryComponent } from "./GutenbergSidebarComponents";

export type GutenbergSidebarProps = {
  headerText?: string;
  overallScore?: number;
  analysisResult?: AnalysisResult;
  isLoading?: boolean;
};

// Main component implementation
const GutenbergSidebarContent = (props: GutenbergSidebarProps) => {
  const { headerText, overallScore, analysisResult, isLoading } = props;

  // UI state
  const [uiState, setUiState] = useState({
    isTransitioning: false,
    isEntering: true,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the shared state from context
  const { expandedContentItems, setExpandedContentItems, expandedCategories, setExpandedCategories } =
    useGutenbergSidebarState();

  // Transform analysis result into content categories
  const contentCategories = useMemo(() => transformAnalysisResult(analysisResult), [analysisResult]);

  // Handle entrance animation
  useEffect(() => {
    setUiState((prev) => ({ ...prev, isEntering: true }));

    const timer = setTimeout(() => {
      setUiState((prev) => ({ ...prev, isEntering: false }));
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Event handlers
  const handleCategoryExpand = (categoryId: string, expanded: boolean) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: expanded,
    }));
  };

  const handleContentItemExpand = (itemKey: string, expanded: boolean) => {
    setExpandedContentItems((prev) => ({
      ...prev,
      [itemKey]: expanded,
    }));
  };

  const handleAccordionClick = (e: MouseEvent) => {
    e.stopPropagation();
  };

  // If no score is available, show placeholder
  if (typeof overallScore !== "number") {
    return <GutenbergSidebarPlaceholder />;
  }

  // Render the sidebar content
  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.gutenbergSidebarContainer,
        uiState.isTransitioning ? styles.transitioning : "",
        uiState.isEntering ? styles.entering : "",
      )}
      style={{
        willChange: uiState.isTransitioning || uiState.isEntering ? "width, height, transform" : "auto",
      }}
    >
      <div className={styles.content}>
        <ComponentContainer className={styles.loadingOptimizationContainer}>
          <div className={styles.contentWrapper}>
            <div className={styles.orbSection}>
              <div className={classNames(styles.orbContainer, styles.expanded)}>
                <div className={styles.aiOrbWrapper}>
                  <AIOrb state={AIOrbStatus.Waiting} size={AIOrbSize.Medium} />
                  {typeof overallScore === "number" && (
                    <div className={styles.donutChartOverlay}>
                      <svg viewBox="0 0 36 36" className={styles.donutChart}>
                        <circle
                          className={styles.donutRing}
                          cx="18"
                          cy="18"
                          r="15"
                          fill="transparent"
                          strokeWidth="3.5"
                        />
                        <circle
                          className={styles.donutSegment}
                          cx="18"
                          cy="18"
                          r="15"
                          fill="transparent"
                          strokeWidth="3.5"
                          strokeDasharray={calculateDonutStrokeDasharray(overallScore)}
                          strokeDashoffset="0"
                        />
                      </svg>
                    </div>
                  )}
                </div>
                {typeof overallScore === "number" && (
                  <div className={styles.scoreOverlay}>
                    <Text
                      type={TextTypes.heading3}
                      fontWeight={FontWeights.bold}
                      color="#ffffff"
                      className={styles.scoreText}
                    >
                      {`${overallScore}%`}
                    </Text>
                  </div>
                )}
              </div>

              <Text
                type={TextTypes.text}
                fontWeight={FontWeights.bold}
                color="--n600"
                className={styles.optimisationTitle}
              >
                {getOptimisationMessage(overallScore)}
              </Text>
            </div>

            <div className={styles.accordionSection} onClick={handleAccordionClick}>
              <div className={styles.accordionsScrollContainer}>
                {contentCategories.map((category, index) => (
                  <ContentCategoryComponent
                    key={category.id}
                    category={category}
                    index={index}
                    expandedCategories={expandedCategories}
                    handleCategoryExpand={handleCategoryExpand}
                    expandedContentItems={expandedContentItems}
                    handleContentItemExpand={handleContentItemExpand}
                  />
                ))}
              </div>
            </div>
          </div>
        </ComponentContainer>
      </div>
    </div>
  );
};

// Wrap the component with the state provider
export const GutenbergSidebar = (props: GutenbergSidebarProps) => (
  <GutenbergSidebarStateProvider>
    <GutenbergSidebarContent {...props} />
  </GutenbergSidebarStateProvider>
);
