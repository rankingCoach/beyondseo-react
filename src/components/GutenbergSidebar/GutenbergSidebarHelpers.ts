import { IconNames } from "vanguard";
import styles from "./GutenbergSidebar.module.scss";


// Types
export type AccordionItemStatus = "Enough" | "Have" | "Missing" | "Too many" | "Incomplete";

export type AccordionItem = {
  title: string;
  status: AccordionItemStatus;
  isPositive: boolean;
  score?: number; // Add score field for optimization tab logic
  suggestions: {
    title: string;
    description: string;
  }[];
};

// Icon Properties Interface (from optimization tab)
export interface IconProperties {
  icon: IconNames;
  color: string;
  fillColor: string;
  hasCircle: boolean;
  circleSize: number;
}

export type ContentCategory = {
  id: string;
  title: string;
  score: number;
  weight: number;
  weightedScore: number;
  items: AccordionItem[];
};

export type AnalysisResult = {
  contexts: {
    elements: Array<{
      contextName: string;
      score?: number;
      weight?: number;
      weightedScore: number;
      factors: {
        elements: Array<{
          factorName: string;
          score?: number; // Add score field for each factor
          status: string;
          suggestions?: {
            elements: Array<{
              title: string;
              description?: string;
            }>;
          };
        }>;
      };
    }>;
  };
};

// Constants (from optimization tab)
export const SCORE_THRESHOLDS = {
  EXCELLENT: 1,
  GOOD: 0.7,
  IMPROVING: 0.4,
  NEEDS_ATTENTION: 0,
  NORMALIZATION_FACTOR: 100,
} as const;

export const ICON_STYLES = {
  EXCELLENT: {
    icon: IconNames.check,
    color: "#1BA138",
    fillColor: "#e8f5e9",
    hasCircle: true,
    circleSize: 20,
  },
  GOOD: {
    icon: IconNames.medium,
    color: "#1BA138",
    fillColor: "#e8f5e9",
    hasCircle: true,
    circleSize: 20,
  },
  IMPROVING: {
    icon: IconNames.exclamation,
    color: "#DB7D0A",
    fillColor: "#FDE5C9",
    hasCircle: false,
    circleSize: 20,
  },
  NEEDS_ATTENTION: {
    icon: IconNames.exclamation,
    color: "#f44034",
    fillColor: "#feedec",
    hasCircle: true,
    circleSize: 20,
  },
  RECOMMENDATION: {
    icon: IconNames.rec,
    color: "#6c5ce7",
    fillColor: "#e3f2fd",
    hasCircle: false,
    circleSize: 20,
  },
} as const;

// Helper function to get icon properties by score (from optimization tab)
export const getIconPropertiesByScore = (score: number): IconProperties => {
  const normalizedScore = score > 1 ? score / SCORE_THRESHOLDS.NORMALIZATION_FACTOR : score;

  if (normalizedScore >= SCORE_THRESHOLDS.EXCELLENT) {
    return ICON_STYLES.EXCELLENT;
  } else if (normalizedScore >= SCORE_THRESHOLDS.GOOD) {
    return ICON_STYLES.GOOD;
  } else if (normalizedScore >= SCORE_THRESHOLDS.IMPROVING) {
    return ICON_STYLES.IMPROVING;
  } else {
    return ICON_STYLES.NEEDS_ATTENTION;
  }
};

// Format status helper function
export const formatStatus = (
  statusName: string,
): {
  displayStatus: AccordionItemStatus;
  isPositive: boolean;
  icon: IconNames;
  color: string;
  fillColor: string;
} => {
  const displayStatus = (statusName.charAt(0).toUpperCase() + statusName.slice(1).toLowerCase()) as AccordionItemStatus;

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

// Helper function to get score style class
export const getScoreStyleClass = (score: number) => {
  const normalizedScore = score > 1 ? score / 100 : score;
  return normalizedScore >= 0.5 ? styles.scoreGreen : styles.scoreRed;
};

export { getOptimisationMessage } from "@helpers/score-helpers";

// Helper function to calculate donut stroke dasharray
export const calculateDonutStrokeDasharray = (score?: number): string => {
  if (typeof score !== "number") return "0 100";
  const normalizedScore = Math.max(0, Math.min(100, score));
  return `${normalizedScore} ${100 - normalizedScore}`;
};

// Transform analysis result into content categories
export const transformAnalysisResult = (analysisResult?: AnalysisResult): ContentCategory[] => {
  if (!analysisResult?.contexts?.elements) return [];

  return analysisResult.contexts.elements.map((context, index) => ({
    id: `context-${index}`,
    title: context.contextName || `Content Group ${index + 1}`, // Use contextName with fallback
    score: context.score ? Math.round(context.score * 100) : 0,
    weight: context.weight || 1, // Default weight to 1 if not provided
    weightedScore: Math.round((context.score ? Math.round(context.score * 100) : 0) * (context.weight || 1)),
    items: context.factors.elements.map((factor) => {
      const { displayStatus, isPositive } = formatStatus(factor.status);
      return {
        title: factor.factorName,
        status: displayStatus,
        isPositive,
        score: factor.score || 0, // Add score information
        suggestions:
          factor.suggestions?.elements.map((s) => {
            return {
              title: s.title,
              description: s.description || "",
            };
          }) || [],
      };
    }),
  }));
};

// Default state values
export const DEFAULT_EXPANDED_CONTENT_ITEMS = {
  h1: true,
  keywords: false,
  paragraphs: false,
  passive: false,
};

export const DEFAULT_EXPANDED_CATEGORIES = {
  content: true,
  seo: false,
  technical: false,
};
