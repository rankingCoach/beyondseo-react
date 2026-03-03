import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./KeywordManager.module.scss";
import { Autocomplete, Button, ComponentContainer, IconNames, PageSectionLoading, Render, Text } from "vanguard";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { KeywordsTable } from "@components/SEOMetadataAndKeywords/SEOKeywords/KeywordsTable/KeywordsTable";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { AppSlice } from "@src/App.slice";
import { getPathId } from "@helpers/get-path-id";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import { __ } from "@wordpress/i18n";
import { useElementorDirtyTrigger } from "@hooks/use-elementor-dirty-trigger";

export const KeywordManager = () => {
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [showError, setShowError] = useState(false);
  const { primaryKeyword, additionalKeywords } = useSelector((state: RootState) => state.app);
  const [keywordsSearchOptions, setKeywordsSearchOptions] = useState<Array<{ name: string }>>([]);
  const dispatch = useAppDispatch();
  const { setAdditionalKeywords, setPrimaryKeyword } = AppSlice;
  const [resetKey, setResetKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { triggerRecalculation } = useScoreRecalculation();

  // Trigger Elementor's dirty state when keyword selections change
  useElementorDirtyTrigger([primaryKeyword, additionalKeywords]);

  const isMounted = useRef(true);

  const isValidKeyword = (keyword: string): boolean => {
    // Allow letters (including diacritics), numbers, spaces, and basic punctuation, but not emojis
    const regex = /^[\p{L}\p{N}\s!@#$%^&*()_+}{±~`-]+$/u;
    return regex.test(keyword);
  };

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const resetInputs = () => {
    setSearchValue("");
    setInputValue("");
    setResetKey((prev) => prev + 1);
  };

  const fetchKeywords = useCallback(async () => {
    if (!isMounted.current) return;

    try {
      setIsLoading(true);
      const response = await dispatch(
        MetatagsStore.getApiMetatagsKeywordsByPostIdThunk({
          postId: getPathId(),
          queryParams: { noCache: true, debug: true },
        }),
      ).unwrap();

      if (!isMounted.current) return;

      if (response?.keywords?.elements) {
        const keywordArray = Array.isArray(response.keywords.elements) ? response.keywords.elements : [];
        const mappedKeywords = keywordArray.map((keyword: any) => ({
          name: keyword.keyword || keyword.name || keyword,
        }));
        setKeywordsSearchOptions(mappedKeywords);
      } else {
        setKeywordsSearchOptions([]);
      }
    } catch (error) {
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [dispatch]);

  useEffect(() => {
    const handleKeywordsUpdated = () => {
      fetchKeywords();
      triggerRecalculation(true);
    };

    document.addEventListener("rankingcoach-keywords-updated", handleKeywordsUpdated);

    return () => {
      document.removeEventListener("rankingcoach-keywords-updated", handleKeywordsUpdated);
    };
  }, [fetchKeywords]);

  const handleAddKeyword = async (keyword: string) => {
    if (!keyword.trim() || keyword.trim().length <= 1) return;

    const trimmedKeyword = keyword.trim().toLowerCase();

    if (!isValidKeyword(trimmedKeyword)) {
      setShowError(true);
      resetInputs();
      return;
    }
    setShowError(false);

    if (primaryKeyword?.toLowerCase() === trimmedKeyword) {
      resetInputs();
      return;
    }

    if (additionalKeywords?.some((k) => k.toLowerCase() === trimmedKeyword)) {
      resetInputs();
      return;
    }

    try {
      setIsLoading(true);
      await dispatch(
        MetatagsStore.putApiMetatagsKeywordByPostIdThunk({
          postId: getPathId(),
          requestBody: {
            keyword: trimmedKeyword,
          },
          queryParams: { noCache: true },
        }),
      );

      // If primary keyword already exists, add new keyword to additional keywords
      if (primaryKeyword) {
        const updatedAdditionalKeywords = [...additionalKeywords, trimmedKeyword];
        dispatch(setAdditionalKeywords(updatedAdditionalKeywords));
      } else {
        // Only set as primary if there isn't already a primary keyword
        dispatch(setPrimaryKeyword(trimmedKeyword));
      }

      await fetchKeywords();

      // Trigger immediate recalculation after keyword change
      triggerRecalculation(true);

      // Dispatch event to notify other components about the keyword update
      const event = new CustomEvent("rankingcoach-keywords-updated");
      document.dispatchEvent(event);
    } catch (error) {
    } finally {
      setIsLoading(false);
      resetInputs();
    }
  };

  // Create a filtered version of the keywords search options
  const filteredKeywordsSearchOptions = React.useMemo(() => {
    // Convert selected keywords to lowercase for case-insensitive comparison
    const selectedKeywordsLowercase = new Set([
      ...(primaryKeyword ? [primaryKeyword.toLowerCase()] : []),
      ...(additionalKeywords?.map((keyword) => keyword.toLowerCase()) || []),
    ]);

    // Filter out any keywords that are already selected
    return keywordsSearchOptions.filter((option) => !selectedKeywordsLowercase.has(option.name.toLowerCase()));
  }, [keywordsSearchOptions, primaryKeyword, additionalKeywords]);

  useEffect(() => {
    fetchKeywords();
  }, [fetchKeywords]);

  const triggerKeywordGenerator = () => {
    const triggerSEOOptimiserEvent = new CustomEvent("rankingcoach-trigger-keyword-generator");
    document.dispatchEvent(triggerSEOOptimiserEvent);
  };

  useEffect(() => {
    if (!primaryKeyword && !additionalKeywords?.length) triggerKeywordGenerator();
  }, []);

  return (
    <ComponentContainer testId={"seo-keywords-manager-container"} className={styles.seoKeywordsManagerContainer}>
      <Text className={styles.seoKeywordsManagerTitle} color="--n800">
        {__("Keywords", "beyondseo")}
      </Text>
      <Text className={styles.seoKeywordsManagerSubtitle} color="--n800">
        {__(
          "Enter the main keyword that best describes the focus of your content. This primary keyword will help search engines understand the core topic of your page and improve your ranking for this specific term.",
          "beyondseo",
        )}
      </Text>

      <ComponentContainer
        testId={"seo-keywords-manager-search-input-container"}
        className={styles.searchInputContainer}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            <Autocomplete
              key={resetKey}
              className={styles.autocompleteInputContainer}
              placeholder={__("Write words that you want to search", "beyondseo")}
              value={searchValue}
              onChange={(e: React.SyntheticEvent, newValue: { name: string } | null, reason: string) => {
                if (reason === "selectOption" && newValue?.name) {
                  handleAddKeyword(newValue.name);
                }
              }}
              options={filteredKeywordsSearchOptions}
              testId={"search-keywords-input"}
              restrictToOptions={false}
              autoSelect={false}
              hideCaret={true}
              hideClearButton={true}
              blurOnSelect={true}
              labelType={"hidden"}
              filterOptions={(options: Array<{ name: string }>) => options}
              optionKey={"name"}
              onInputChange={(e: React.SyntheticEvent, newValue: string) => {
                setShowError(false);
                setInputValue(newValue);
                setSearchValue(newValue);
              }}
              disabled={isLoading}
              multiple={false}
              onKeyUp={() => {}}
              onKeyDown={() => {}}
              autoHighlight={false}
              onBlur={() => {}}
              onFocus={() => {}}
              autoComplete={false}
            />
            <Button
              onClick={() => {
                const trimmedKeyword = inputValue.trim();
                if (trimmedKeyword && trimmedKeyword.length > 1 && !isLoading) {
                  handleAddKeyword(inputValue);
                }
              }}
              disabled={isLoading}
              testId={"add-keyword-button"}
            >
              Add
            </Button>
          </div>
          {showError && (
            <Text color="--e500" className="error-message">
              {__("Certain special characters are not allowed.", "beyondseo")}
            </Text>
          )}
        </div>
      </ComponentContainer>

      <ComponentContainer
        testId={"seo-keywords-manager-primary-table-container"}
        className={styles.keywordPrimaryTableContainer}
      >
        <Text className={styles.tableHeaderTitle} color="--n800">
          {__("Primary keyword", "beyondseo")}
        </Text>
        <Render if={!primaryKeyword}>
          <PageSectionLoading
            className={styles.nodataContainer}
            testId={"keywords-nodata"}
            title={__("Add a primary keyword", "beyondseo")}
            description={__(
              "This keyword should capture a key aspect of your content to boost search visibility",
              "beyondseo",
            )}
            borderRadius={"rounded"}
            imgSize={"medium"}
            titleType={"text"}
          />
          {/*<div className={styles.generateButtonContainer}>*/}
          {/*  <Button*/}
          {/*    onClick={triggerKeywordGenerator}*/}
          {/*    testId={"generate-keywords-button"}*/}
          {/*    className={styles.generateButton}*/}
          {/*    iconRight={IconNames.ai}*/}
          {/*    iconColor={"#FFFFFF"}*/}
          {/*  >*/}
          {/*    Generate Keywords*/}
          {/*  </Button>*/}
          {/*</div>*/}
        </Render>
        <Render if={!!primaryKeyword}>
          <KeywordsTable hideSwapButton={true} elements={[primaryKeyword]} isPrimaryKeywordTable={true} />
          {/* <PrimaryKeywordTasks keyword={primaryKeyword} /> */}
        </Render>
      </ComponentContainer>

      <ComponentContainer
        testId={"seo-keywords-manager-additional-table-container"}
        className={styles.keywordAdditionalTableContainer}
      >
        <Text className={styles.tableHeaderTitle} color="--n800">
          {__("Additional keywords", "beyondseo")}
        </Text>
        <Render if={!additionalKeywords || additionalKeywords.length === 0}>
          <PageSectionLoading
            className={styles.nodataContainer}
            testId={"keywords-nodata"}
            title={__("Add additional keywords", "beyondseo")}
            description={__(
              "These keywords should capture key aspects of your content to boost search visibility",
              "beyondseo",
            )}
            borderRadius={"rounded"}
            imgSize={"medium"}
            titleType={"text"}
          />
        </Render>
        <Render if={!!additionalKeywords && additionalKeywords.length > 0}>
          <KeywordsTable elements={additionalKeywords} />
        </Render>
      </ComponentContainer>
    </ComponentContainer>
  );
};
