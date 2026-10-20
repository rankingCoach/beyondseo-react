import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  FontWeights,
  InfoBox,
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
import { ContentItem, getMetaTags, getVariables, saveMetaTags } from "../setup-wizard-api";
import styles from "./ScanStep.module.scss";

interface IssueFixPanelProps {
  post: ContentItem;
  kind: "title" | "description";
  onSaved: () => void;
  onClose: () => void;
}

const variableConfig: AdornmentConfig = { options: VariableOptions, buttonText: __("Add Variable", "beyondseo") };
const separatorConfig: AdornmentConfig = { options: SeparatorOptions, buttonText: __("Add Separator", "beyondseo") };

/** Inline editor for the SEO title or the meta description of a page. */
export const IssueFixPanel: React.FC<IssueFixPanelProps> = ({ post, kind, onSaved, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [variables, setVariables] = useState<WPVariableData[]>([]);
  const [initialAdornments, setInitialAdornments] = useState<Adornment[]>([]);
  const [titleAdornments, setTitleAdornments] = useState<Adornment[]>([]);
  const [description, setDescription] = useState("");

  const variablesMap = useMemo(() => buildVariablesMap(variables), [variables]);
  const titlePreview = resolveAdornments(titleAdornments, variablesMap) || post.title;

  useEffect(() => {
    let cancelled = false;

    Promise.all([getMetaTags(post.id), getVariables(post.id).catch(() => [] as WPVariableData[])])
      .then(([tags, loadedVariables]) => {
        if (cancelled) {
          return;
        }
        setVariables(loadedVariables);

        // The API falls back to the post title when nothing is stored, which is what the editor should start from.
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
  }, [post.id]);

  const buildRequest = (): MetaTagsSaveRequest | null => {
    if (kind === "title") {
      const template = adornmentsToTemplate(titleAdornments);
      if (templateIsEmpty(template)) {
        setError(__("Enter a title or add a variable.", "beyondseo"));
        return null;
      }

      return { title: { template } };
    }
    if (!description.trim()) {
      setError(__("Enter a meta description.", "beyondseo"));
      return null;
    }

    return { description: { template: textToTemplate(description.trim()) } };
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

  const renderEditor = () =>
    kind === "title" ? (
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
    ) : (
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
