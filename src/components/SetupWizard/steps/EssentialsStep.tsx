import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  FontWeights,
  IconNames,
  IconSize,
  InfoBox,
  Link,
  Render,
  Skeleton,
  Switch,
  Text,
  Textarea,
  TextIcon,
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
import { getAdminScreenUrl, getHomeUrl } from "@helpers/internal-links";
import { MetaTagsSaveRequest, StructuredTemplate, WPVariableData } from "@src/types/meta-tags";
import { StepLayout } from "../StepLayout";
import {
  getMetaTags,
  getVariables,
  isSearchEngineVisible,
  saveMetaTags,
  saveSitemapSettings,
  SitemapSettings,
  WpSiteSettings,
} from "../setup-wizard-api";
import shared from "../SetupWizard.module.scss";
import styles from "./EssentialsStep.module.scss";

interface EssentialsStepProps {
  site: WpSiteSettings | null;
  sitemap: SitemapSettings | null;
  onSitemapSaved: (sitemap: SitemapSettings) => void;
  onExit: () => void;
  onNext: () => void;
  isLeaving: boolean;
}

const variableConfig: AdornmentConfig = { options: VariableOptions, buttonText: __("Add Variable", "beyondseo") };
const separatorConfig: AdornmentConfig = { options: SeparatorOptions, buttonText: __("Add Separator", "beyondseo") };

const canonical = (template: StructuredTemplate): string =>
  JSON.stringify(
    template.map((element) =>
      element.type === "text" ? { type: "text", content: element.content } : { type: element.type, key: element.key },
    ),
  );

export const EssentialsStep: React.FC<EssentialsStepProps> = ({
  site,
  sitemap,
  onSitemapSaved,
  onExit,
  onNext,
  isLeaving,
}) => {
  const homepageId = site?.showOnFront === "page" ? site.pageOnFront : 0;
  const siteTitle = site?.title || "";
  const siteTagline = site?.tagline || "";

  const [isHomepageLoading, setIsHomepageLoading] = useState(homepageId > 0);
  const [hasStoredTags, setHasStoredTags] = useState(false);
  const [variables, setVariables] = useState<WPVariableData[]>([]);
  const [titleAdornments, setTitleAdornments] = useState<Adornment[]>([]);
  const [initialAdornments, setInitialAdornments] = useState<Adornment[]>([]);
  const [description, setDescription] = useState("");
  const [baseline, setBaseline] = useState<{ title: StructuredTemplate; description: string }>({
    title: [],
    description: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sitemapEnabled, setSitemapEnabled] = useState(!!sitemap?.enabled);
  const [isSitemapSaving, setIsSitemapSaving] = useState(false);

  const variablesMap = useMemo(() => buildVariablesMap(variables), [variables]);
  const titlePreview = resolveAdornments(titleAdornments, variablesMap) || siteTitle;
  const searchEngineVisible = isSearchEngineVisible();

  useEffect(() => {
    if (!homepageId) {
      return;
    }
    let cancelled = false;

    Promise.all([getMetaTags(homepageId), getVariables(homepageId).catch(() => [] as WPVariableData[])])
      .then(([tags, loadedVariables]) => {
        if (cancelled) {
          return;
        }
        // The API falls back to the post title (id 0) when nothing is stored; the live title is then the site name.
        const storedTitle = tags.title && tags.title.id > 0 ? normalizeTemplate(tags.title.template) : [];
        const storedDescription =
          tags.description && tags.description.id > 0 ? normalizeTemplate(tags.description.template) : [];
        const map = buildVariablesMap(loadedVariables);
        const initialDescription =
          storedDescription.length > 0
            ? templateEditableText(storedDescription, resolveTemplate(storedDescription, map))
            : siteTagline;
        const adornments = templateToAdornments(storedTitle.length > 0 ? storedTitle : textToTemplate(siteTitle));

        setVariables(loadedVariables);
        setHasStoredTags(true);
        setInitialAdornments(adornments);
        setTitleAdornments(adornments);
        setDescription(initialDescription);
        setBaseline({
          title: storedTitle.length > 0 ? storedTitle : textToTemplate(siteTitle),
          description: initialDescription,
        });
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            __("The homepage SEO details could not be loaded. You can continue and edit them later.", "beyondseo"),
          );
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsHomepageLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [homepageId]);

  const handleContinue = async () => {
    if (!homepageId || !hasStoredTags) {
      onNext();
      return;
    }

    const titleTemplate = adornmentsToTemplate(titleAdornments);
    const body: MetaTagsSaveRequest = {};
    if (!templateIsEmpty(titleTemplate) && canonical(titleTemplate) !== canonical(baseline.title)) {
      body.title = { template: titleTemplate };
    }
    if (description.trim() !== baseline.description.trim()) {
      body.description = { template: textToTemplate(description.trim()) };
    }
    if (Object.keys(body).length === 0) {
      onNext();
      return;
    }

    setIsSaving(true);
    setError(null);
    try {
      await saveMetaTags(homepageId, body);
      onNext();
    } catch (saveError: any) {
      setError(saveError?.message || __("Your changes could not be saved. Please try again.", "beyondseo"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSitemapToggle = async (event: React.SyntheticEvent) => {
    const enabled = (event.currentTarget as HTMLInputElement).checked;
    const next = { ...(sitemap || { includeImages: true, maxLinks: 1000, pingGoogle: true, pingBing: true }), enabled };

    setSitemapEnabled(enabled);
    setIsSitemapSaving(true);
    try {
      await saveSitemapSettings(next);
      onSitemapSaved(next);
    } catch {
      setSitemapEnabled(!enabled);
    } finally {
      setIsSitemapSaving(false);
    }
  };

  const renderHomepageFields = () => {
    if (!homepageId) {
      return (
        <div className={styles.readOnlyValues}>
          <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
            {__("Site title", "beyondseo")}
          </Text>
          <Text type={TextTypes.text}>{siteTitle}</Text>
          <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
            {__("Tagline", "beyondseo")}
          </Text>
          <Text type={TextTypes.text}>{siteTagline || __("No tagline set", "beyondseo")}</Text>
          <Text type={TextTypes.textHelp} className={shared.fine}>
            {__(
              "Your homepage shows your latest posts, so search engines see the site title and tagline.",
              "beyondseo",
            )}{" "}
            <Link href={getAdminScreenUrl("options-general.php")} display="inline">
              {__("Change them in General settings", "beyondseo")}
            </Link>
          </Text>
        </div>
      );
    }

    if (isHomepageLoading) {
      return (
        <div className={styles.fields}>
          <Skeleton width="100%" height="56px" />
          <Skeleton width="100%" height="88px" />
        </div>
      );
    }

    return (
      <div className={styles.fields}>
        <div className={styles.titleEditor}>
          <MultiSelectAdornmentInput
            title={__("Homepage SEO title", "beyondseo")}
            variableConfig={variableConfig}
            separatorConfig={separatorConfig}
            initialAdornments={initialAdornments}
            onSave={setTitleAdornments}
            value={titlePreview}
            maxChars={TITLE_MAX_LENGTH}
            defaultValue={siteTitle}
            disable={!hasStoredTags}
          />
        </div>
        <div>
          <Textarea
            label={__("Meta description", "beyondseo")}
            labelType="static"
            value={description}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(event.target.value)}
            placeholder={__("Describe your website in one or two sentences", "beyondseo")}
            maxLength={DESCRIPTION_MAX_LENGTH}
            counter={false}
            highlightUrl={false}
            minRows={2}
            maxRows={4}
            disabled={!hasStoredTags || isSaving}
            testId="rc-wizard-home-description"
          />
          <div className={styles.counter}>
            {description.length} / {DESCRIPTION_MAX_LENGTH} {__("recommended", "beyondseo")}
          </div>
        </div>
      </div>
    );
  };

  return (
    <StepLayout
      footerStart={
        <Button
          type={ButtonTypes.secondary}
          size={ButtonSizes.medium}
          onClick={onExit}
          disabled={isLeaving || isSaving}
        >
          {__("Exit setup", "beyondseo")}
        </Button>
      }
      footerEnd={
        <Button
          type={ButtonTypes.primary}
          size={ButtonSizes.medium}
          onClick={handleContinue}
          isLoading={isSaving}
          disabled={isSaving || isLeaving || isHomepageLoading}
        >
          {__("Continue", "beyondseo")}
        </Button>
      }
    >
      <div className={shared.intro}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
          {__("Welcome to BeyondSEO", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={shared.description}>
          {__(
            "Improve how your site appears in search results and find issues on your pages. We prefilled what we already know about your website.",
            "beyondseo",
          )}
        </Text>
      </div>

      <Render if={!!error}>
        <InfoBox type="danger" borderRadius={8} description={error || ""} />
      </Render>

      <div className={shared.card}>
        {renderHomepageFields()}
        <div className={styles.serp} aria-label={__("Search preview", "beyondseo")}>
          <div className={styles.serpUrl}>{getHomeUrl()}</div>
          <div className={styles.serpTitle}>{titlePreview}</div>
          <div className={styles.serpDescription}>{description || siteTagline}</div>
        </div>
      </div>

      <div className={shared.card}>
        <div className={shared.statusRow}>
          <div className={shared.statusText}>
            <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
              {__("XML sitemap", "beyondseo")}
            </Text>
            <Text type={TextTypes.textHelp} className={shared.fine}>
              {__("Helps search engines discover all your pages.", "beyondseo")}
            </Text>
          </div>
          <Switch
            value={sitemapEnabled}
            onChange={handleSitemapToggle}
            size="small"
            testId="rc-wizard-sitemap-switch"
            disabled={isSitemapSaving || !sitemap}
          />
        </div>
        <div className={shared.statusRow}>
          <div className={shared.statusText}>
            <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
              {__("Search engine visibility", "beyondseo")}
            </Text>
            <Text type={TextTypes.textHelp} className={shared.fine}>
              {searchEngineVisible
                ? __("Search engines are allowed to index this site.", "beyondseo")
                : __("WordPress currently asks search engines not to index this site.", "beyondseo")}{" "}
              <Link href={getAdminScreenUrl("options-reading.php")} display="inline">
                {__("Reading settings", "beyondseo")}
              </Link>
            </Text>
          </div>
          <TextIcon
            icon={searchEngineVisible ? IconNames.check : IconNames.warning}
            iconColor={searchEngineVisible ? "var(--s500)" : "var(--w500)"}
            iconSize={IconSize.small}
            textType={TextTypes.textHelp}
            verticalAlign="center"
          >
            {searchEngineVisible ? __("Enabled", "beyondseo") : __("Discouraged", "beyondseo")}
          </TextIcon>
        </div>
      </div>

      <Text type={TextTypes.textHelp} className={shared.fine}>
        {__(
          "A rankingCoach account can add visibility and performance information later. First, let’s review your site.",
          "beyondseo",
        )}
      </Text>
    </StepLayout>
  );
};
