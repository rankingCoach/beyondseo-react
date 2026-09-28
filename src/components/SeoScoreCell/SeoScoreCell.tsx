import { MouseEvent as ReactMouseEvent, useEffect, useRef, useState } from "react";
import styles from "./SeoScoreCell.module.scss";
import DonutChart from "@components/Common/DonutChart/DonutChart";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  Icon,
  IconNames,
  IconSize,
  Popover,
  Render,
  Text,
  TextIcon,
  TextTypes,
} from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { SeoScoreCellPlaceholder } from "./SeoScoreCellPlaceholder";
import cellWidgetSuccessURL from "@assets/cell-widget-success.svg";
// import cellWidgetWarningURL from "@assets/cell-widget-warning.svg";
import rcIconManageProjectsURL from "@assets/rC-icon-manage-projects.svg";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";
import { __ } from "@wordpress/i18n";
import { SeoSnippetData } from "./snippet-data";
import { SeoQuickEdit, SeoQuickEditHandle, SeoQuickEditResult } from "./QuickEdit/SeoQuickEdit";

// Enums
export enum BadgeType {
  Success = "success",
  Warning = "warning",
}

interface FactorSuggestion {
  id: number;
  operationKey: string;
  title: string;
  description: string;
  priority: number;
  activationThreshold: number;
  additionalInfo: any[];
}

export interface SeoScoreCellProps {
  postId: number;
  onDataLoaded?: () => void;
  /** Search snippet passed by PHP through the mount point's data attributes. */
  snippet?: SeoSnippetData;
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

/** How long the "Saved" confirmation stays visible next to the score. */
const SAVED_FLASH_MS = 2500;

// Helper functions
const calculateScore = (rawScore: number): number => {
  return rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);
};

const getBadgeConfig = (hasIssues: boolean, issuesCount: number) => {
  //the commented code below is for future use if we want to handle different badge types based on issues count
  // if (!hasIssues) {
  return {
    badgeClass: BadgeType.Success,
    badgeIcon: cellWidgetSuccessURL,
    badgeValue: issuesCount === 0 ? "-" : issuesCount.toString(),
  };
  // }

  // return {
  //   badgeClass: BadgeType.Warning,
  //   badgeIcon: cellWidgetWarningURL,
  //   badgeValue: issuesCount.toString(),
  // };
};

// Function to validate analysis result structure
const isValidAnalysisResult = (result: any): result is AnalysisResult => {
  return (
    result &&
    typeof result.score === "number" &&
    result.contexts?.elements !== undefined &&
    Array.isArray(result.contexts.elements)
  );
};

/**
 * Assistant cell of the posts/pages list: optimisation score with the
 * recommendations popup, the current SEO title / meta description, and the
 * quick editor to change both without opening the post.
 */
export const SeoScoreCell = ({ postId, onDataLoaded, snippet: initialSnippet }: SeoScoreCellProps) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshingScore, setIsRefreshingScore] = useState(false);
  const [badgeClass, setBadgeClass] = useState(BadgeType.Success);
  const [badgeIcon, setBadgeIcon] = useState(cellWidgetSuccessURL);
  const [badgeValue, setBadgeValue] = useState("0");
  const [iconUrl] = useState(rcIconManageProjectsURL);
  const [recommendations, setRecommendations] = useState<FactorSuggestion[]>([]);

  const [snippet, setSnippet] = useState<SeoSnippetData | undefined>(initialSnippet);
  const [isEditing, setIsEditing] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const editButtonRef = useRef<HTMLButtonElement>(null);
  const quickEditRef = useRef<SeoQuickEditHandle>(null);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const issueLabel = __("Issues", "beyondseo");
  const recommendationLabel = __("Recommendations", "beyondseo");
  const optimisationLabel = __("Optimisation level", "beyondseo");

  const resetBadge = () => {
    setScore(0);
    const defaultBadgeConfig = getBadgeConfig(false, 0);
    setBadgeClass(defaultBadgeConfig.badgeClass);
    setBadgeValue(defaultBadgeConfig.badgeValue);
    setRecommendations([]);
  };

  // Function to process analysis result and update state
  const processAnalysisResult = (analysisResult: AnalysisResult) => {
    const calculatedScore = calculateScore(analysisResult.score);
    setScore(calculatedScore);

    // Process suggestions/issues
    const suggestions = analysisResult.topSuggestions?.elements || [];
    setRecommendations(suggestions);

    // Set badge properties using helper function
    const hasIssues = suggestions.length > 0;
    const badgeConfig = getBadgeConfig(hasIssues, suggestions.length);

    setBadgeClass(badgeConfig.badgeClass);
    setBadgeIcon(badgeConfig.badgeIcon || cellWidgetSuccessURL);
    setBadgeValue(badgeConfig.badgeValue);
  };

  /** Re-run the optimiser for this post; null when no usable result came back. */
  const requestAnalysis = async (): Promise<AnalysisResult | null> => {
    const postApiResponse = (await dispatch(
      OptimiserStore.postApiOptimiserByPostIdThunk({
        postId,
        requestBody: null,
        queryParams: { noCache: true },
      }),
    )) as any;

    const postAnalysisResult = postApiResponse?.payload?.analyseResult;
    return isValidAnalysisResult(postAnalysisResult) ? postAnalysisResult : null;
  };

  /**
   * Load the score. With `forceAnalysis` the optimiser is re-run (after the
   * snippet changed); otherwise the stored analysis is read and the optimiser
   * only runs as a fallback while no score exists yet.
   */
  const loadScore = async (forceAnalysis = false) => {
    try {
      if (forceAnalysis) {
        const freshResult = await requestAnalysis();
        if (freshResult) {
          processAnalysisResult(freshResult);
        }
        return;
      }

      // Initial GET request
      const apiResponse = (await dispatch(
        OptimiserStore.getApiOptimiserByPostIdThunk({
          postId,
          queryParams: { noCache: true },
        }),
      )) as any;

      if (!apiResponse?.payload) {
        return;
      }

      const analysisResult = apiResponse.payload.analyseResult;

      if (!isValidAnalysisResult(analysisResult)) {
        resetBadge();
        return;
      }

      // If score is 0, try to make a POST request as fallback
      if (calculateScore(analysisResult.score) === 0) {
        try {
          const freshResult = await requestAnalysis();
          // Only use the POST response if it produced a score, to avoid loops
          if (freshResult && calculateScore(freshResult.score) !== 0) {
            processAnalysisResult(freshResult);
            return;
          }
        } catch (postError) {
          // fall through to the GET result
        }
      }

      // Process the original GET response
      processAnalysisResult(analysisResult);
    } catch (error) {
      resetBadge();
    } finally {
      setIsLoading(false);
      setIsRefreshingScore(false);
    }
  };

  useEffect(() => {
    loadScore();
  }, [postId]);

  // Notify parent when data loading is complete
  useEffect(() => {
    if (!isLoading && onDataLoaded) {
      onDataLoaded();
    }
  }, [isLoading, onDataLoaded]);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) {
        clearTimeout(savedTimerRef.current);
      }
    };
  }, []);

  const openEditor = () => {
    setShow(false);
    setIsEditing(true);
  };

  const closeEditor = () => {
    setIsEditing(false);
    editButtonRef.current?.focus?.();
  };

  // Clicking the trigger while the card is open behaves like clicking outside:
  // pending edits are saved, then the card closes.
  const toggleEditor = () => {
    if (isEditing) {
      void quickEditRef.current?.saveAndClose();
    } else {
      openEditor();
    }
  };

  /**
   * The list table lives inside WordPress' `posts-filter` form and Vanguard renders a
   * bare <button>, which would submit that form and reload the page. Cancel the
   * default action before toggling.
   */
  const handleTriggerClick = (event: ReactMouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleEditor();
  };

  const flashSaved = () => {
    if (savedTimerRef.current) {
      clearTimeout(savedTimerRef.current);
    }
    setSavedFlash(true);
    savedTimerRef.current = setTimeout(() => setSavedFlash(false), SAVED_FLASH_MS);
  };

  const handleSaved = (result: SeoQuickEditResult) => {
    setSnippet((current) => (current ? { ...current, ...result } : current));
    closeEditor();

    // The snippet feeds several optimisation factors, so refresh the score and
    // confirm the save once the new score is in.
    setIsRefreshingScore(true);
    loadScore(true).finally(flashSaved);
  };

  const canEdit = !!snippet?.canEdit;
  const displayTitle = snippet?.title || snippet?.postTitle || "";
  const hasDescription = !!snippet?.description;
  const missingDescriptionLabel = canEdit
    ? __("Add a meta description", "beyondseo")
    : __("No meta description", "beyondseo");

  return (
    <div className={styles.seoScoreCellWrapper} ref={wrapperRef} data-testid="rc-seo-score-cell">
      <div className={styles.scoreRow}>
        {isLoading ? (
          <SeoScoreCellPlaceholder />
        ) : (
          <div className={styles.scoreHover} onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
            <ComponentContainer className={styles.assistantCell}>
              <ComponentContainer className={styles.scoreContainer}>
                <img src={iconUrl} alt={__("rC Icon", "beyondseo")} className={styles.icon} />
                <Text fontSize={14}>{score} / 100</Text>
              </ComponentContainer>
              <ComponentContainer className={classNames(styles.issuesContainer, styles[badgeClass])}>
                <img src={badgeIcon} alt={__("Status Icon", "beyondseo")} width="16" height="16" />
                <Text fontSize={14} fontWeight={FontWeights.medium}>
                  {badgeValue}
                </Text>
              </ComponentContainer>
            </ComponentContainer>

            <Render if={show && !isEditing}>
              <ComponentContainer className={styles.popup}>
                <DonutChart percentage={Number(score)} label={optimisationLabel} textPosition="bottom" />
                <ComponentContainer className={styles.popupInner}>
                  <ComponentContainer className={styles.recommendations}>
                    {recommendations.slice(0, 4).map((item, index) => (
                      <TextIcon
                        key={index}
                        icon={IconNames.check}
                        iconColor={"#379683"}
                        verticalAlign="start"
                        iconSize={IconSize.small}
                        className={styles.iconText}
                        fontWeight={FontWeights.regular}
                        maxWidth="180px"
                      >
                        {item.title}
                      </TextIcon>
                    ))}
                  </ComponentContainer>
                  <ComponentContainer className={classNames(styles.recomandationsCount, styles[badgeClass])}>
                    <img src={badgeIcon} alt={__("Status Icon", "beyondseo")} width="16" height="16" />
                    <Text fontSize={14} textWrap="no-wrap">
                      {badgeValue + " "}
                      {badgeClass === BadgeType.Warning ? issueLabel : recommendationLabel}
                    </Text>
                  </ComponentContainer>
                </ComponentContainer>
              </ComponentContainer>
            </Render>
          </div>
        )}

        <Render if={isRefreshingScore}>
          <span className={styles.scoreStatus} role="status">
            <Icon type={IconSize.small} color="--n400" spin={true}>
              {IconNames.refresh}
            </Icon>
            <Text type={TextTypes.textCaption} color="--n500" className={styles.statusText}>
              {__("Updating score…", "beyondseo")}
            </Text>
          </span>
        </Render>

        <Render if={savedFlash && !isRefreshingScore}>
          <span className={styles.savedPill} role="status" data-testid="rc-seo-snippet-saved">
            <Icon type={IconSize.small} color="--s500">
              {IconNames.check}
            </Icon>
            <Text
              type={TextTypes.textCaption}
              color="--s900"
              fontWeight={FontWeights.medium}
              className={styles.statusText}
            >
              {__("Saved", "beyondseo")}
            </Text>
          </span>
        </Render>
      </div>

      <Render if={!!snippet}>
        <div
          className={classNames(
            styles.snippetSummary,
            canEdit ? styles.snippetEditable : "",
            isEditing ? styles.snippetActive : "",
          )}
          onClick={canEdit ? toggleEditor : undefined}
          data-testid="rc-seo-snippet-summary"
        >
          <div className={styles.snippetLines}>
            <Text type={TextTypes.textCaption} className={styles.snippetLabel}>
              {__("Title", "beyondseo")}
            </Text>
            <div className={styles.snippetCell} title={displayTitle}>
              <Text type={TextTypes.text} className={styles.snippetValue}>
                {displayTitle}
              </Text>
            </div>

            <Text type={TextTypes.textCaption} className={styles.snippetLabel}>
              {__("Description", "beyondseo")}
            </Text>
            <div className={styles.snippetCell} title={hasDescription ? snippet?.description : undefined}>
              <Text
                type={TextTypes.text}
                className={classNames(styles.snippetValue, hasDescription ? "" : styles.snippetMissing)}
              >
                {hasDescription ? snippet?.description : missingDescriptionLabel}
              </Text>
            </div>
          </div>

          <Render if={canEdit}>
            <span className={styles.snippetEditTrigger} onClickCapture={(event) => event.preventDefault()}>
              <Popover message={__("Edit SEO title and description", "beyondseo")} position="top">
                <Button
                  type={ButtonTypes.default}
                  size={ButtonSizes.small}
                  iconLeft={IconNames.edit}
                  className={styles.snippetEditButton}
                  onClick={handleTriggerClick}
                  targetRef={editButtonRef}
                  testId="rc-seo-snippet-edit"
                />
              </Popover>
            </span>
          </Render>
        </div>
      </Render>

      <Render if={isEditing && !!snippet && canEdit}>
        <SeoQuickEdit
          ref={quickEditRef}
          postId={postId}
          snippet={snippet as SeoSnippetData}
          anchorRef={wrapperRef}
          onClose={closeEditor}
          onSaved={handleSaved}
        />
      </Render>
    </div>
  );
};
