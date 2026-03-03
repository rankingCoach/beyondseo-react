import * as React from "react";
import styles from "./OptimisationTab.module.scss";
import { __ } from "@wordpress/i18n";
import { GutenbergSidebar } from "@components/GutenbergSidebar/GutenbergSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { OptimiserStore } from "@src/stores/swagger/api/OptimiserStore";
import { getPathId } from "@helpers/get-path-id";

interface OptimisationTabProps {
  recalculationStart?: boolean;
  proVersion?: boolean;
}

export const OptimisationTab: React.FC<OptimisationTabProps> = ({ recalculationStart }) => {
  const { optimiserResult } = useSelector((state: RootState) => state.app);
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = React.useState(false);
  // Track whether initial fetch has been attempted to prevent infinite retries on failure
  const fetchAttempted = React.useRef(false);

  // Calculate the overall score from the optimiserResult
  const overallScore = React.useMemo(() => {
    if (optimiserResult && typeof optimiserResult.score === "number") {
      return Math.round(optimiserResult.score * 100);
    }
    return undefined;
  }, [optimiserResult]);

  React.useEffect(() => {
    if (recalculationStart) {
      setIsLoading(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [recalculationStart]);

  // Initial data fetch
  React.useEffect(() => {
    const fetchData = async () => {
      if (!optimiserResult && !fetchAttempted.current) {
        fetchAttempted.current = true;
        setIsLoading(true);
        try {
          await dispatch(
            OptimiserStore.getApiOptimiserByPostIdThunk({
              postId: getPathId(),
              queryParams: { noCache: true },
            }),
          );
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      }
    };

    // Reset the flag when we get a successful result
    if (optimiserResult) {
      fetchAttempted.current = false;
    }

    fetchData();
  }, [dispatch, optimiserResult]);

  // Event listener for score recalculation
  React.useEffect(() => {
    const handleScoreRecalculated = (event: CustomEvent<{ timestamp: number; apiResponse?: any; error?: any }>) => {
      setIsLoading(false);
    };

    document.addEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);
    };
  }, []);

  return (
    <div className={styles.optimisationTabContainer}>
      <div className={styles.sidebarWrapper}>
        <GutenbergSidebar
          headerText={__("SEO Plug-in", "beyondseo")}
          overallScore={overallScore}
          analysisResult={optimiserResult as any}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
