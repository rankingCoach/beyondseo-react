import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { __, sprintf } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  CheckBox,
  FontWeights,
  InfoBox,
  Input,
  Render,
  Skeleton,
  Text,
  Textarea,
  TextTypes,
} from "vanguard";
import {
  Adornment,
  AdornmentConfig,
  MultiSelectAdornmentInput,
} from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import {
  SeparatorOptions,
  VariableOptions,
} from "@components/SEOMetadataAndKeywords/SEOMetadata/SEOMetaTitleEditor/AdornmentOptions";
import { DESCRIPTION_MAX_LENGTH, TITLE_MAX_LENGTH } from "@components/SeoScoreCell/QuickEdit/SeoQuickEdit";
import { templateEditableText } from "@components/SeoScoreCell/snippet-data";
import {
  adornmentsToTemplate,
  buildVariablesMap,
  normalizeTemplate,
  resolveAdornments,
  resolveTemplate,
  templateIsEmpty,
  templateToAdornments,
  textToTemplate,
} from "@helpers/template-helpers";
import { MetaTagsSaveRequest, WPVariableData } from "@src/types/meta-tags";
import { FixKind } from "../issue-mapping";
import { ContentItem, extractContentKeywords, getMetaTags, getVariables, saveMetaTags } from "../setup-wizard-api";
import styles from "./ScanStep.module.scss";

interface IssueFixPanelProps {
  post: ContentItem;
  kind: Exclude<FixKind, "editor">;
  onSaved: () => void;
  onClose: () => void;
}

const MAX_KEYWORD_SUGGESTIONS = 8;

const variableConfig: AdornmentConfig = { options: VariableOptions, buttonText: __("Add Variable", "beyondseo") };
const separatorConfig: AdornmentConfig = { options: SeparatorOptions, buttonText: __("Add Separator", "beyondseo") };

/** Inline editor for the fixes the wizard handles itself: SEO title, meta description, keywords. */
export const IssueFixPanel: React.FC<IssueFixPanelProps> = ({ post, kind, onSaved, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<WPVariableData[]>([]);
  const [initialAdornments, setInitialAdornments] = useState<Adornment[]>([]);
  const [titleAdornments, setTitleAdornments] = useState<Adornment[]>([]);
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [customKeyword, setCustomKeyword] = useState("");

  const variablesMap = useMemo(() => buildVariablesMap(variables), [variables]);
  const titlePreview = resolveAdornments(titleAdornments, variablesMap) || post.title;

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      getMetaTags(post.id),
      getVariables(post.id).catch(() => [] as WPVariableData[]),
      kind === "keywords"
        ? extractContentKeywords(post.id).catch(() => [] as string[])
        : Promise.resolve([] as string[]),
    ])
      .then(([tags, loadedVariables, suggestions]) => {
        if (cancelled) {
          return;
        }
        setVariables(loadedVariables);

        const storedTitle = tags.title ? normalizeTemplate(tags.title.template) : [];
        const adornments = templateToAdornments(storedTitle.length > 0 ? storedTitle : textToTemplate(post.title));
        setInitialAdornments(adornments);
        setTitleAdornments(adornments);

        const storedDescription = tags.description ? normalizeTemplate(tags.description.template) : [];
        setDescription(
          templateEditableText(
            storedDescription,
            resolveTemplate(storedDescription, buildVariablesMap(loadedVariables)),
          ),
        );

        const existing = [tags.keywords?.primaryKeyword || "", ...(tags.keywords?.additionalKeywords || [])].filter(
          Boolean,
        );
        setSelectedKeywords(existing);
        setKeywords(Array.from(new Set([...existing, ...suggestions.slice(0, MAX_KEYWORD_SUGGESTIONS)])));
      })
      .catch(() => {
        if (!cancelled) {
          setError(__("The page details could not be loaded.", "beyondseo"));
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
  }, [post.id, kind]);

  const toggleKeyword = (keyword: string, checked: boolean) => {
    setSelectedKeywords((current) =>
      checked ? Array.from(new Set([...current, keyword])) : current.filter((entry) => entry !== keyword),
    );
  };

  const addCustomKeyword = () => {
    const keyword = customKeyword.trim();
    if (!keyword) {
      return;
    }
    if (!keywords.some((entry) => entry.toLowerCase() === keyword.toLowerCase())) {
      setKeywords((current) => [...current, keyword]);
    }
    toggleKeyword(keyword, true);
    setCustomKeyword("");
  };

  const buildRequest = (): MetaTagsSaveRequest | null => {
    if (kind === "title") {
      const template = adornmentsToTemplate(titleAdornments);
      if (templateIsEmpty(template)) {
        setError(__("Enter a title or add a variable.", "beyondseo"));
        return null;
      }

      return { title: { template } };
    }
    if (kind === "description") {
      if (!description.trim()) {
        setError(__("Enter a meta description.", "beyondseo"));
        return null;
      }

      return { description: { template: textToTemplate(description.trim()) } };
    }
    if (selectedKeywords.length === 0) {
      setError(__("Select at least one keyword.", "beyondseo"));
      return null;
    }

    return { keywords: { primaryKeyword: selectedKeywords[0], additionalKeywords: selectedKeywords.slice(1) } };
  };

  const handleSave = async () => {
    setError(null);
    const body = buildRequest();
    if (!body) {
      return;
    }
    setIsSaving(true);
    try {
      await saveMetaTags(post.id, body);
      onSaved();
    } catch (saveError: any) {
      setError(saveError?.message || __("Your changes could not be saved. Please try again.", "beyondseo"));
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditor = () => {
    if (kind === "title") {
      return (
        <div className={styles.titleEditor}>
          <MultiSelectAdornmentInput
            title={__("SEO title", "beyondseo")}
            variableConfig={variableConfig}
            separatorConfig={separatorConfig}
            initialAdornments={initialAdornments}
            onSave={setTitleAdornments}
            value={titlePreview}
            maxChars={TITLE_MAX_LENGTH}
            defaultValue={post.title}
          />
        </div>
      );
    }
    if (kind === "description") {
      return (
        <div>
          <Textarea
            value={description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
            placeholder={__("Enter SEO meta description", "beyondseo")}
            maxLength={DESCRIPTION_MAX_LENGTH}
            counter={false}
            highlightUrl={false}
            minRows={2}
            maxRows={4}
            disabled={isSaving}
            testId="rc-wizard-fix-description"
          />
          <div className={styles.counter}>
            {description.length} / {DESCRIPTION_MAX_LENGTH} {__("recommended", "beyondseo")}
          </div>
        </div>
      );
    }

    return (
      <>
        <Text type={TextTypes.textHelp}>
          {selectedKeywords.length > 0
            ? sprintf(
                /* translators: %s: keyword */
                __("Primary keyword: %s. The other selected terms become additional keywords.", "beyondseo"),
                selectedKeywords[0],
              )
            : __(
                "Pick the terms this page should rank for. The first selected term becomes the primary keyword.",
                "beyondseo",
              )}
        </Text>
        <div className={styles.keywordList}>
          {keywords.map((keyword) => (
            <CheckBox
              key={keyword}
              checked={selectedKeywords.includes(keyword)}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleKeyword(keyword, event.target.checked)}
              label={keyword}
            />
          ))}
        </div>
        <div className={styles.keywordAdd}>
          <Input
            label={__("Add a keyword", "beyondseo")}
            labelType="static"
            value={customKeyword}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => setCustomKeyword(event.target.value)}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addCustomKeyword();
              }
            }}
            placeholder={__("e.g. reusable kitchen products", "beyondseo")}
            maxLength={100}
            hideOptionalLabel={true}
          />
          <Button
            type={ButtonTypes.secondary}
            size={ButtonSizes.medium}
            onClick={addCustomKeyword}
            disabled={!customKeyword.trim()}
          >
            {__("Add", "beyondseo")}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className={styles.fixPanel} data-testid="rc-wizard-fix-panel">
      <Text type={TextTypes.text} fontWeight={FontWeights.bold}>
        {post.title}
      </Text>
      {isLoading ? (
        <>
          <Skeleton width="100%" height="48px" />
          <Skeleton width="60%" height="20px" />
        </>
      ) : (
        renderEditor()
      )}
      <Render if={!!error}>
        <InfoBox type="danger" borderRadius={8} description={error || ""} />
      </Render>
      <div className={styles.fixPanelActions}>
        <Button type={ButtonTypes.default} size={ButtonSizes.small} onClick={onClose} disabled={isSaving}>
          {__("Cancel", "beyondseo")}
        </Button>
        <Button
          type={ButtonTypes.primary}
          size={ButtonSizes.small}
          onClick={handleSave}
          isLoading={isSaving}
          disabled={isSaving || isLoading}
        >
          {__("Save", "beyondseo")}
        </Button>
      </div>
    </div>
  );
};
