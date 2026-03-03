import * as React from "react";
import { useEffect, useState, useRef } from "react";
import styles from "./KeywordsTable.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  IconNames,
  IconSize,
  Popover,
  Render,
  Skeleton,
  SkeletonTypes,
  StatusBadge,
  Text,
  TextIcon,
  TextTypes,
} from "vanguard";
import { __ } from "@wordpress/i18n";
import { getPathId } from "@helpers/get-path-id";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { AppSlice } from "@src/App.slice";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import { capitalizeOnlyFirstLetter } from "@helpers/string-helpers";
import { FactorSuggestion } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/FactorSuggestion";

interface KeywordTask {
  id: string;
  title: string;
  description: string;
  priority: string;
  status: "completed" | "pending";
}

export type KeywordsTableProps = {
  hideSwapButton?: boolean;
  title?: string | undefined;
  elements: string[];
  isPrimaryKeywordTable?: boolean;
};

export const KeywordsTable = (props: KeywordsTableProps) => {
  const { hideSwapButton, title, elements, isPrimaryKeywordTable = false } = props;
  const dispatch = useAppDispatch();
  const { optimiserResult, primaryKeyword, additionalKeywords } = useSelector((state: RootState) => state.app);
  const { setPrimaryKeyword, setAdditionalKeywords } = AppSlice;
  const [isDeleting, setIsDeleting] = useState<Record<string, boolean>>({});
  const [expandedTasks, setExpandedTasks] = useState<{ [key: string]: boolean }>({});
  const { triggerRecalculation } = useScoreRecalculation();
  const [isLoadingTasks, setIsLoadingTasks] = useState<boolean>(true);
  const [tasksLoaded, setTasksLoaded] = useState<boolean>(false);
  const prevPrimaryKeyword = useRef<string | null>(null);

  useEffect(() => {
    if (isPrimaryKeywordTable && primaryKeyword) {
      setIsLoadingTasks(true);
      setTasksLoaded(false);
      setExpandedTasks({});
    }
  }, [isPrimaryKeywordTable, primaryKeyword]);

  useEffect(() => {
    if (isPrimaryKeywordTable && optimiserResult) {
      const timer = setTimeout(() => {
        setIsLoadingTasks(false);
        setTasksLoaded(true);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isPrimaryKeywordTable, optimiserResult]);

  useEffect(() => {
    return () => {
      setIsLoadingTasks(true);
      setTasksLoaded(false);
      setExpandedTasks({});
    };
  }, []);

  // Helper function to check if keyword is AI generated and clean it
  const isAIGenerated = (keyword: string): boolean => {
    return keyword.endsWith("*");
  };

  const cleanKeyword = (keyword: string): string => {
    return keyword.endsWith("*") ? keyword.slice(0, -1) : keyword;
  };

  // Transform suggestions from optimiserResult into KeywordTask format
  const getPrimaryKeywordTasks = (): KeywordTask[] => {
    if (!optimiserResult || !optimiserResult.categorizedSuggestions?.primaryKeyword?.elements) {
      return [];
    }

    return optimiserResult.categorizedSuggestions.primaryKeyword.elements.map(
      (suggestion: FactorSuggestion, index: number) => {
        let priorityString = "medium";
        if (suggestion.priority) {
          if (suggestion.priority <= 2) priorityString = "high";
          else if (suggestion.priority >= 5) priorityString = "low";
        }

        let status: "completed" | "pending" = "pending";
        if (suggestion.activationThreshold !== undefined && suggestion.activationThreshold <= 0.5) {
          status = "completed";
        }

        return {
          id: suggestion.issueType || index.toString(),
          title: suggestion.title || "Untitled suggestion",
          description: suggestion.description || "No description available",
          priority: priorityString,
          status: status,
        };
      },
    );
  };

  const keywordTasks = isPrimaryKeywordTable ? getPrimaryKeywordTasks() : [];

  const toggleTask = (taskId: string) => {
    setExpandedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const getTaskIcon = (status: string) => {
    switch (status) {
      case "completed":
        return {
          icon: IconNames.generate,
          iconSize: IconSize.small,
          // color: "#21c445",
          // fillColor: "#e9fbed",
          // hasCircle: true,
          // circleSize: 20,
        };
      case "pending":
      default:
        return {
          icon: IconNames.generate,
          iconSize: IconSize.small,
          // color: "#ff675c",
          // fillColor: "#ffeceb",
          // hasCircle: true,
          // circleSize: 20,
        };
    }
  };

  const swapCallback = async (keyword: string) => {
    // swap elements in state
    await dispatch(
      MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk({
        postId: getPathId(),
        requestBody: {
          keyword: keyword,
        },
        queryParams: {},
      }),
    );

    // Trigger immediate recalculation after keyword swap
    triggerRecalculation(true);
  };

  const removeCallback = async (keyword: string) => {
    try {
      setIsDeleting((prev) => ({ ...prev, [keyword]: true }));

      if (keyword === primaryKeyword) {
        dispatch(setPrimaryKeyword(null));
      } else {
        const newAdditionalKeywords = additionalKeywords.filter((k) => k !== keyword);
        dispatch(setAdditionalKeywords(newAdditionalKeywords));
      }

      const result = await dispatch(
        MetatagsStore.deleteApiMetatagsKeywordByPostIdThunk({
          postId: getPathId(),
          requestBody: {
            keyword: keyword,
          },
          queryParams: {},
        }),
      );


      await dispatch(
        MetatagsStore.getApiMetatagsByPostIdThunk({
          postId: getPathId(),
          queryParams: {},
        }),
      );

      triggerRecalculation(true);
    } catch (error) {
      await dispatch(
        MetatagsStore.getApiMetatagsByPostIdThunk({
          postId: getPathId(),
          queryParams: {},
        }),
      );
    } finally {
      setIsDeleting((prev) => ({ ...prev, [keyword]: false }));
    }
  };

  // Render skeleton loading for tasks
  const renderTasksSkeletons = () => {
    return (
      <div className={styles.keywordTasksContainer} style={{ marginTop: "12px", paddingTop: "8px" }}>
        {[1, 2, 3].map((item) => (
          <div key={item} className={styles.taskItemSkeleton}>
            <Skeleton type={SkeletonTypes.fill} style={{ height: 30, marginBottom: 8 }} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <ComponentContainer testId={"keywords-table-container"} className={styles.keywordsTableContainer}>
      <div className={styles.tableHeader}>
        <Render if={!!title}>
          <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
            {title}
          </Text>
        </Render>
      </div>
      <div className={styles.tableBody}>
        {elements.map((element, index) => (
          <div key={index}>
            <div className={styles.tableRow}>
              <div className={classNames(styles.tableCellKeyword)}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", width: "100%" }}>
                  <span>{cleanKeyword(element)}</span>
                  <Render if={isAIGenerated(element)}>
                    <div style={{ marginLeft: "auto" }}>
                      <StatusBadge
                        status={"info"}
                        icon={IconNames.ai}
                        hideIcon={false}
                        text={__("Generated by AI", "beyondseo")}
                        variant={"small"}
                        iconVariant={"reverse"}
                        className={classNames(styles.statusBadge)}
                      />
                    </div>
                  </Render>
                </div>
              </div>
              <div className={classNames(styles.tableCellActions)}>
                <Render if={!hideSwapButton}>
                  <Popover message={__("Set as primary", "beyondseo")}>
                    <Button
                      className={styles.swapButton}
                      testId={"cta-swap-button"}
                      size={ButtonSizes.small}
                      iconLeft={IconNames.queriesTarget}
                      iconSize={IconSize.small}
                      iconColor={"--n500"}
                      onClick={() => swapCallback(element)}
                      type={ButtonTypes.default}
                      disabled={isDeleting[element]}
                    />
                  </Popover>
                </Render>
                <Popover message={__("Remove keyword", "beyondseo")}>
                  <Button
                    className={styles.deleteButton}
                    testId={"cta-remove-button"}
                    size={ButtonSizes.small}
                    iconLeft={IconNames.trash}
                    iconSize={IconSize.small}
                    iconColor={"--n500"}
                    onClick={() => removeCallback(element)}
                    type={ButtonTypes.default}
                    disabled={isDeleting[element]}
                  />
                </Popover>
              </div>
            </div>

            {isPrimaryKeywordTable && (
              <>
                {isLoadingTasks && renderTasksSkeletons()}

                {!isLoadingTasks && keywordTasks.length > 0 && (
                  <div className={styles.keywordTasksContainer} style={{ marginTop: "12px", paddingTop: "8px" }}>
                    {keywordTasks.map((task) => {
                      const iconProps = getTaskIcon(task.status);
                      const isExpanded = expandedTasks[task.id] || false;

                      return (
                        <div key={task.id} className={styles.taskItem}>
                          <div className={styles.taskItemHeader} onClick={() => toggleTask(task.id)}>
                            <TextIcon
                              icon={IconNames.rec}
                              iconColor={"#6c5ce7"}
                              verticalAlign="start"
                              // iconHasCircle={true}
                              // iconFillColor={iconProps.fillColor}
                              iconSize={IconSize.small}
                              // iconCircleSize={20}
                              className={styles.iconText}
                            >
                              {capitalizeOnlyFirstLetter(task.title)}
                            </TextIcon>
                            <div className={styles.expandIcon}>
                              {isExpanded ? (
                                <span className={styles.caretUp}>▲</span>
                              ) : (
                                <span className={styles.caretDown}>▼</span>
                              )}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className={styles.taskDescription}>
                              <Text type={TextTypes.text} color="--n500" fontSize={13}>
                                {task.description}
                              </Text>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {!isLoadingTasks && tasksLoaded && keywordTasks.length === 0 && (
                  <div className={styles.noTasksMessage} style={{ marginTop: "12px", paddingTop: "8px" }}>
                    <Text type={TextTypes.text} color="--n500">
                      No tasks available for this keyword.
                    </Text>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </ComponentContainer>
  );
};
