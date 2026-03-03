import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./OptimisationTabSEOOptimiser.module.scss";
import {
  Accordion,
  AIOrb,
  AIOrbSize,
  AIOrbStatus,
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  IconNames,
  IconSize,
  Render,
  Text,
  TextIcon,
  TextTypes,
  VanguardStyle,
} from "vanguard";
import rcLogo from "@assets/rc-logo.svg";
import { __ } from "@wordpress/i18n";
import { getOptimisationMessage } from "@helpers/score-helpers";

export enum SEOOptimiserSizeType {
  Small = "small",
  Medium = "medium",
  Large = "large",
}

export type SEOOptimiserProps = {
  headerText?: string;
  overallScore?: number;
  analysisResult?: {
    contexts: {
      elements: Array<{
        contextName: string;
        score?: number;
        factors: {
          elements: Array<{
            factorName: string;
            status: string;
            suggestions?: {
              elements: Array<{
                title: string;
              }>;
            };
          }>;
        };
      }>;
    };
  };
};

type AccordionItemStatus = "Enough" | "Have" | "Missing" | "Too many" | "Incomplete";
type AccordionItem = {
  title: string;
  status: AccordionItemStatus;
  isPositive: boolean;
  suggestions: string[];
};

type ContentCategory = {
  id: string;
  title: string;
  score: number;
  items: AccordionItem[];
};

export const OptimisationTabSEOOptimiser = (props: SEOOptimiserProps) => {
  const { headerText, overallScore, analysisResult } = props;
  const [sizeType, setSizeType] = useState<SEOOptimiserSizeType>(SEOOptimiserSizeType.Small);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [isContentAccordionExpanded, setIsContentAccordionExpanded] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [position, setPosition] = React.useState<"left" | "right">("left");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isEntering, setIsEntering] = useState(true);

  const [expandedContentItems, setExpandedContentItems] = useState<{ [key: string]: boolean }>({
    h1: true,
    keywords: false,
    paragraphs: false,
    passive: false,
  });

  const formatStatus = (
    statusName: string,
  ): {
    displayStatus: AccordionItemStatus;
    isPositive: boolean;
    icon: IconNames;
    color: string;
    fillColor: string;
  } => {
    const displayStatus = (statusName.charAt(0).toUpperCase() +
      statusName.slice(1).toLowerCase()) as AccordionItemStatus;

    switch (statusName) {
      case "MISSING":
        return {
          displayStatus,
          isPositive: false,
          icon: IconNames.close,
          color: "#ff675c",
          fillColor: "#ffeceb",
        };
      case "INCOMPLETE":
        return {
          displayStatus,
          isPositive: true,
          icon: IconNames.exclamation,
          color: "#ff9340",
          fillColor: "#fff5eb",
        };
      default:
        return {
          displayStatus,
          isPositive: true,
          icon: IconNames.check,
          color: "#21c445",
          fillColor: "#e9fbed",
        };
    }
  };

  const contentCategories: ContentCategory[] = React.useMemo(() => {
    if (!analysisResult?.contexts?.elements) return [];

    return analysisResult.contexts.elements.map((context, index) => ({
      id: `context-${index}`,
      title: context.contextName || `Content Group ${index + 1}`, // Use contextName with fallback
      score: context.score ? Math.round(context.score * 100) : 0,
      items: context.factors.elements.map((factor) => {
        const { displayStatus, isPositive } = formatStatus(factor.status);
        return {
          title: factor.factorName,
          status: displayStatus,
          isPositive: isPositive,
          suggestions: factor.suggestions?.elements.map((s) => s.title) || [],
        };
      }),
    }));
  }, [analysisResult]);

  const getScoreStyleClass = (score: number) => {
    const normalizedScore = score > 1 ? score / 100 : score;

    if (normalizedScore >= 0.5) {
      return styles.scoreGreen;
    }
    return styles.scoreRed;
  };

  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    content: true,
    seo: false,
    technical: false,
  });

  const isLarge = sizeType === SEOOptimiserSizeType.Large;
  const isSmall = sizeType === SEOOptimiserSizeType.Small;
  const isMedium = sizeType === SEOOptimiserSizeType.Medium;

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (sizeType === SEOOptimiserSizeType.Small || isTransitioning) {
        return;
      }

      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        debouncedSizeChange(SEOOptimiserSizeType.Small);
      }
    };

    if (sizeType !== SEOOptimiserSizeType.Small) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [sizeType, isTransitioning]);

  const debouncedSizeChange = (newSize: SEOOptimiserSizeType) => {
    if (isTransitioning || sizeType === newSize) return;

    setIsTransitioning(true);
    setSizeType(newSize);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 650);
  };

  useEffect(() => {
    if ((isAccordionExpanded || isContentAccordionExpanded) && !isSmall) {
      let newSize = SEOOptimiserSizeType.Large;
      debouncedSizeChange(newSize);
    } else if (!isSmall && !isAccordionExpanded && !isContentAccordionExpanded) {
      debouncedSizeChange(SEOOptimiserSizeType.Medium);
    }
  }, [isAccordionExpanded, isContentAccordionExpanded]);

  useEffect(() => {
    setIsEntering(true);

    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    if (isSmall && !isTransitioning) {
      debouncedSizeChange(SEOOptimiserSizeType.Large);
    }
  };

  const handleAccordionChange = (expanded: boolean) => {
    setIsAccordionExpanded(expanded);
  };

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

  const handleAccordionClick = (e: React.MouseEvent) => {
    if (!isSmall) {
      e.stopPropagation();
    }
  };



  const renderContentAccordionItem = (item: AccordionItem, index: number) => {
    const itemKey = item.title.toLowerCase().replace(/\s+/g, "");
    const isExpanded = expandedContentItems[itemKey] || false;

    return (
      <div className={styles.contentAccordionItem} key={`content-item-${index}`}>
        <div className={styles.contentItemHeader} onClick={() => handleContentItemExpand(itemKey, !isExpanded)}>
          <div className={styles.contentItemTitle}>
            <Text type={TextTypes.text} color="--n600">
              {item.title}
            </Text>
          </div>
          <div className={styles.contentItemStatus}>
            <TextIcon
              icon={
                item.status === "Incomplete"
                  ? IconNames.exclamation
                  : item.isPositive
                    ? IconNames.check
                    : IconNames.close
              }
              iconColor={item.status === "Incomplete" ? "#ff9340" : item.isPositive ? "#21c445" : "#ff675c"}
              iconHasCircle={true}
              iconFillColor={item.status === "Incomplete" ? "#fff5eb" : item.isPositive ? "#e9fbed" : "#ffeceb"}
              iconSize={IconSize.small}
              iconCircleSize={24}
            >
              {item.status}
            </TextIcon>
          </div>
          <Button
            type={ButtonTypes.default}
            iconLeft={isExpanded ? IconNames.caretUp : IconNames.caretDown}
            size={ButtonSizes.small}
            onClick={(e:any) => {
              e.stopPropagation();
              handleContentItemExpand(itemKey, !isExpanded);
            }}
            className={styles.contentItemToggle}
          />
        </div>
        <div className={classNames(styles.contentItemDetails, isExpanded ? styles.expanded : "")}>
          {item.suggestions.length > 0 ? (
            item.suggestions.map((suggestion, idx) => (
              <TextIcon
                key={idx}
                icon={IconNames.rec}
                iconColor="#3D3DFF"
                verticalAlign="center"
                iconHasCircle={false}
                iconSize={IconSize.small}
                className={styles.suggestionItem}
              >
                {suggestion}
              </TextIcon>
            ))
          ) : (
            <Text type={TextTypes.textCaption} color="--n400">
              {__("No suggestions found", "beyondseo")}
            </Text>
          )}
        </div>
      </div>
    );
  };

  const renderContentCategory = (category: ContentCategory, index: number) => {
    const isExpanded = expandedCategories[category.id] || false;
    const scoreStyleClass = getScoreStyleClass(category.score);

    return (
      <Accordion
        key={`category-${category.id}`}
        expanded={isExpanded}
        defaultExpanded={index === 0}
        className={styles.accordion}
        accordionId={`category-${category.id}`}
        summaryChildren={
          <div className={styles.categoryAndScore}>
            <Text type={TextTypes.text}>{category.title}</Text>
            <Text fontSize={14} type={TextTypes.text} className={classNames(styles.score, scoreStyleClass)}>
              {category.score}%
            </Text>
          </div>
        }
        detailsChildren={
          <div className={styles.contentAccordionContainer}>{category.items.map(renderContentAccordionItem)}</div>
        }
        iconSize={IconSize.small}
        iconName={IconNames.caretDown}
        onExpandedChange={(expanded:any) => handleCategoryExpand(category.id, expanded)}
      />
    );
  };

  const calculateDonutStrokeDasharray = (score?: number): string => {
    if (typeof score !== "number") return "0 100";
    const normalizedScore = Math.max(0, Math.min(100, score));
    return `${normalizedScore} ${100 - normalizedScore}`;
  };

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.seoOptimiserContainer,
        styles[sizeType],
        styles[position],
        isTransitioning ? styles.transitioning : "",
        isEntering ? styles.entering : "",
      )}
      onClick={isSmall ? handleClick : undefined}
      style={{
        willChange: isTransitioning || isEntering ? "width, height, transform" : "auto",
      }}
    >
      <div className={styles.header}>
        <div className={styles.logo}>
          <img className={styles.logoImage} src={rcLogo} alt={__("rankingCoach logo", "beyondseo")} />
          <Text type={TextTypes.textCaption} color={"--n400"} className={classNames(styles.title, VanguardStyle.mr3)}>
            {headerText}
          </Text>
        </div>
        <div className={styles.close}>
          <Render if={!isSmall}>
            <Button
              type={ButtonTypes.secondary}
              iconLeft={IconNames.close}
              size={ButtonSizes.small}
              color={"--n400"}
              onClick={() => {
                setSizeType(SEOOptimiserSizeType.Small);
              }}
            />
          </Render>
        </div>
      </div>
      <div className={styles.content}>
        <ComponentContainer className={classNames(styles.loadingOptimizationContainer, styles[sizeType])}>
          <div className={styles.contentWrapper}>
            <div className={styles.orbSection}>
              <div className={classNames(styles.orbContainer, isLarge || isMedium ? styles.expanded : "")}>
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
                      color={"#ffffff"}
                      className={styles.scoreText}
                    >
                      {`${overallScore}%`}
                    </Text>
                  </div>
                )}
              </div>

              <Render if={!isSmall}>
                <Text
                  type={TextTypes.text}
                  fontWeight={FontWeights.bold}
                  color={"--n600"}
                  className={styles.optimisationTitle}
                >
                  {getOptimisationMessage(overallScore)}
                </Text>
              </Render>
            </div>

            <Render if={!isSmall}>
              <div className={styles.accordionSection} onClick={handleAccordionClick}>
                <div className={styles.accordionsScrollContainer}>{contentCategories.map(renderContentCategory)}</div>
              </div>
            </Render>
          </div>

          <Render if={isSmall}>
            <TextIcon
              icon={IconNames.rec}
              iconSize={IconSize.small}
              className={classNames(styles.recommendationsText, VanguardStyle.mt2)}
              iconColor="#3D3DFF"
            >
              recommendations
            </TextIcon>
          </Render>
        </ComponentContainer>
      </div>
    </div>
  );
};
