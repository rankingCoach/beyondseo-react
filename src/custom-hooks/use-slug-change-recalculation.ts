import { useEffect } from "react";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";

/**
 * Custom hook that integrates slug change events with score recalculation
 * Provides real-time score updates when slug changes occur
 */
export const useSlugChangeRecalculation = () => {
  const { triggerRecalculation, isRecalculating } = useScoreRecalculation();

  useEffect(() => {
    const handleSlugChange = (event: CustomEvent<{
      timestamp: number;
      oldSlug: string;
      newSlug: string;
      newUrl: string;
    }>) => {
      const { newSlug, oldSlug } = event.detail;

      // Immediate recalculation for slug changes as they affect SEO scoring
      triggerRecalculation(true);
    };

    // Listen for slug changes from ScoreRecalculationProvider
    document.addEventListener('rankingcoach-slug-changed', handleSlugChange);

    return () => {
      document.removeEventListener('rankingcoach-slug-changed', handleSlugChange);
    };
  }, [triggerRecalculation]);

  return {
    isRecalculating,
    triggerRecalculation
  };
};
