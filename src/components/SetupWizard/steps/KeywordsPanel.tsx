import * as React from "react";
import { useEffect, useState } from "react";
import { __ } from "@wordpress/i18n";
import {
  Autocomplete,
  Button,
  ButtonSizes,
  ButtonTypes,
  FontWeights,
  InfoBox,
  Render,
  Skeleton,
  TagList,
  TagProps,
  Text,
  TextTypes,
} from "vanguard";
import { MetaTagsApiResponse } from "@src/types/meta-tags";
import { assignKeyword, ContentItem, detachKeyword, getAvailableKeywords, getMetaTags } from "../setup-wizard-api";
import shared from "../SetupWizard.module.scss";
import styles from "./ScanStep.module.scss";

interface KeywordsPanelProps {
  post: ContentItem;
  /** Called after every saved change so the issue can be marked as updated. */
  onChanged: () => void;
  onClose: () => void;
}

// Same validation as the General tab keyword manager.
const isValidKeyword = (keyword: string): boolean => /^[\p{L}\p{N}\s!@#$%^&*()_+}{±~`-]+$/u.test(keyword);

/** Inline keyword manager: the same calls and keyword list as the General tab, so both stay in sync. */
export const KeywordsPanel: React.FC<KeywordsPanelProps> = ({ post, onChanged, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [primary, setPrimary] = useState("");
  const [additional, setAdditional] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [resetKey, setResetKey] = useState(0);

  const applyKeywords = (tags: MetaTagsApiResponse) => {
    setPrimary(tags.keywords?.primaryKeyword || "");
    setAdditional(tags.keywords?.additionalKeywords || []);
  };

  useEffect(() => {
    let cancelled = false;

    Promise.all([getMetaTags(post.id), getAvailableKeywords(post.id).catch(() => [] as string[])])
      .then(([tags, keywords]) => {
        if (!cancelled) {
          applyKeywords(tags);
          setAvailable(keywords);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(__("The page keywords could not be loaded.", "beyondseo"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [post.id]);

  const selected = new Set([primary, ...additional].filter(Boolean).map((keyword) => keyword.toLowerCase()));
  const options = available
    .filter((keyword) => !selected.has(keyword.toLowerCase()))
    .map((keyword) => ({ name: keyword }));

  const resetInput = () => {
    setInput("");
    setResetKey((key) => key + 1);
  };

  const add = async (value: string) => {
    const keyword = value.trim().toLowerCase();
    if (keyword.length < 2 || isBusy) {
      return;
    }
    if (!isValidKeyword(keyword)) {
      setError(__("Certain special characters are not allowed.", "beyondseo"));
      return;
    }
    if (selected.has(keyword)) {
      resetInput();
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      applyKeywords(await assignKeyword(post.id, keyword));
      onChanged();
      resetInput();
      // The backend remembers added keywords, so the suggestions can offer them again later.
      getAvailableKeywords(post.id)
        .then(setAvailable)
        .catch(() => undefined);
    } catch (saveError: any) {
      setError(saveError?.message || __("The keyword could not be saved. Please try again.", "beyondseo"));
    } finally {
      setIsBusy(false);
    }
  };

  const remove = async (id?: string | number) => {
    const keyword = String(id ?? "");
    if (!keyword || isBusy) {
      return;
    }
    setError(null);
    setIsBusy(true);
    try {
      applyKeywords(await detachKeyword(post.id, keyword));
      onChanged();
    } catch (removeError: any) {
      setError(removeError?.message || __("The keyword could not be removed. Please try again.", "beyondseo"));
    } finally {
      setIsBusy(false);
    }
  };

  const toTags = (keywords: string[]): TagProps[] =>
    keywords.map((keyword) => ({ id: keyword, text: keyword, hasDeleteBtn: true, deleteBtnCallback: remove }));

  return (
    <div className={styles.fixPanel} data-testid="rc-wizard-fix-panel">
      <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
        {post.title}
      </Text>
      <Text type={TextTypes.textHelp} className={shared.fine}>
        {__(
          "Enter the keywords this page should rank for. The first one becomes the primary keyword, the others additional keywords; they are the same keywords you see in the page's General tab.",
          "beyondseo",
        )}
      </Text>

      {isLoading ? (
        <>
          <Skeleton width="100%" height="48px" />
          <Skeleton width="60%" height="20px" />
        </>
      ) : (
        <>
          <div className={styles.keywordAdd}>
            <Autocomplete
              key={resetKey}
              placeholder={__("Write words that you want to search", "beyondseo")}
              value={input}
              onChange={(event: React.SyntheticEvent, newValue: { name: string } | null, reason: string) => {
                if (reason === "selectOption" && newValue?.name) {
                  add(newValue.name);
                }
              }}
              options={options}
              testId="rc-wizard-keyword-input"
              restrictToOptions={false}
              autoSelect={false}
              hideCaret={true}
              hideClearButton={true}
              blurOnSelect={true}
              labelType={"hidden"}
              filterOptions={(candidates: Array<{ name: string }>) => candidates}
              optionKey={"name"}
              onInputChange={(event: React.SyntheticEvent, newValue: string) => {
                setError(null);
                setInput(newValue);
              }}
              onKeyDown={(event: React.KeyboardEvent) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  add(input);
                }
              }}
              disabled={isBusy}
              multiple={false}
              onKeyUp={() => {}}
              onBlur={() => {}}
              onFocus={() => {}}
              autoHighlight={false}
              autoComplete={false}
            />
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.medium}
              onClick={() => add(input)}
              isLoading={isBusy}
              disabled={isBusy || input.trim().length < 2}
            >
              {__("Add", "beyondseo")}
            </Button>
          </div>

          <Render if={!!error}>
            <InfoBox type="danger" borderRadius={8} description={error || ""} />
          </Render>

          <div className={styles.keywordGroups}>
            <div className={styles.keywordGroup}>
              <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
                {__("Primary keyword", "beyondseo")}
              </Text>
              {primary ? (
                <TagList tags={toTags([primary])} />
              ) : (
                <Text type={TextTypes.textHelp} className={shared.fine}>
                  {__("No primary keyword yet. The first keyword you add becomes it.", "beyondseo")}
                </Text>
              )}
            </div>
            <div className={styles.keywordGroup}>
              <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
                {__("Additional keywords", "beyondseo")}
              </Text>
              {additional.length > 0 ? (
                <TagList tags={toTags(additional)} />
              ) : (
                <Text type={TextTypes.textHelp} className={shared.fine}>
                  {__("No additional keywords yet.", "beyondseo")}
                </Text>
              )}
            </div>
          </div>
        </>
      )}

      <div className={styles.fixPanelActions}>
        <Button type={ButtonTypes.primary} size={ButtonSizes.small} onClick={onClose} disabled={isBusy}>
          {__("Done", "beyondseo")}
        </Button>
      </div>
    </div>
  );
};
