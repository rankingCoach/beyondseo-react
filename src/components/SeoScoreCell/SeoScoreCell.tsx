import { useState, useEffect } from "@wordpress/element";
import styles from "./SeoScoreCell.module.scss";
import DonutChart from "@components/Common/DonutChart/DonutChart";
import {
  TextIcon,
  Text,
  IconNames,
  IconSize,
  Button,
  ButtonSizes,
  ButtonTypes,
  FontWeights,
  classNames,
  ComponentContainer,
  Render,
} from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { SeoScoreCellPlaceholder } from "./SeoScoreCellPlaceholder";
import cellWidgetSuccessURL from "@assets/cell-widget-success.svg";
// import cellWidgetWarningURL from "@assets/cell-widget-warning.svg";
import rcIconManageProjectsURL from "@assets/rC-icon-manage-projects.svg";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";
import { __ } from "@wordpress/i18n";

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

export const SeoScoreCell = ({ postId, onDataLoaded }: SeoScoreCellProps) => {
  const dispatch = useAppDispatch();
  const [show, setShow] = useState(false);
  const [score, setScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [badgeClass, setBadgeClass] = useState(BadgeType.Success);
  const [badgeIcon, setBadgeIcon] = useState(cellWidgetSuccessURL);
  const [badgeValue, setBadgeValue] = useState("0");
  const [iconUrl, setIconUrl] = useState(rcIconManageProjectsURL);
  const [recommendations, setRecommendations] = useState<FactorSuggestion[]>([]);
  let issueLabel = __("Issues", "beyondseo");
  let recommendationLabel = __("Recommendations", "beyondseo");
  let optimisationLabel = __("Optimisation level", "beyondseo");

  // Function to validate analysis result structure
  const isValidAnalysisResult = (result: any): result is AnalysisResult => {
    return (
      result &&
      typeof result.score === "number" &&
      result.contexts?.elements !== undefined &&
      Array.isArray(result.contexts.elements)
    );
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

  // Custom hook for data fetching
  const useSeoAnalysis = (postId: number) => {
    const fetchSeoData = async () => {
      try {
        setIsLoading(true);

        // Initial GET request
        const apiResponse = (await dispatch(
          OptimiserStore.getApiOptimiserByPostIdThunk({
            postId,
            queryParams: { noCache: true },
          }),
        )) as any;

        if (apiResponse?.payload) {
          const analysisResult = apiResponse.payload.analyseResult;

          if (isValidAnalysisResult(analysisResult)) {
            const calculatedScore = calculateScore(analysisResult.score);

            // If score is 0, try to make a POST request as fallback
            if (calculatedScore === 0) {
              try {
                const postApiResponse = (await dispatch(
                  OptimiserStore.postApiOptimiserByPostIdThunk({
                    postId,
                    requestBody: null,
                    queryParams: { noCache: true },
                  }),
                )) as any;

                if (postApiResponse?.payload) {
                  const postAnalysisResult = postApiResponse.payload.analyseResult;

                  if (isValidAnalysisResult(postAnalysisResult)) {
                    const postScore = calculateScore(postAnalysisResult.score);

                    // Only use the POST response if the score is not zero to avoid loops
                    if (postScore !== 0) {
                      processAnalysisResult(postAnalysisResult);
                      return;
                    }
                  }
                }
              } catch (postError) {
              }
            }

            // Process the original GET response
            processAnalysisResult(analysisResult);
          } else {
            // Handle invalid analysis result
            setScore(0);
            const defaultBadgeConfig = getBadgeConfig(false, 0);
            setBadgeClass(defaultBadgeConfig.badgeClass);
            setBadgeValue(defaultBadgeConfig.badgeValue);
            setRecommendations([]);
          }
        }
      } catch (error) {
        // Handle error state
        setScore(0);
        const errorBadgeConfig = getBadgeConfig(false, 0);
        setBadgeClass(errorBadgeConfig.badgeClass);
        setBadgeValue(errorBadgeConfig.badgeValue);
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    return { fetchSeoData };
  };

  const { fetchSeoData } = useSeoAnalysis(postId);

  useEffect(() => {
    fetchSeoData();
  }, [postId]);

  // Notify parent when data loading is complete
  useEffect(() => {
    if (!isLoading && onDataLoaded) {
      onDataLoaded();
    }
  }, [isLoading, onDataLoaded]);

  return (
    <>
      {isLoading ? (
        <SeoScoreCellPlaceholder />
      ) : (
        <div
          className={styles.seoScoreCellWrapper}
          onMouseEnter={() => setShow(true)}
          onMouseLeave={() => setShow(false)}
        >
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

          <Render if={show}>
            <ComponentContainer className={styles.popup}>
              <DonutChart
                percentage={Number(score)}
                label={optimisationLabel}
                textPosition="bottom"
              />
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
                    {badgeValue + ' '}
                    {badgeClass === BadgeType.Warning
                      ? issueLabel
                      : recommendationLabel
                    }
                  </Text>
                </ComponentContainer>
              </ComponentContainer>
            </ComponentContainer>
          </Render>
        </div>
      )}
    </>
  );
};
