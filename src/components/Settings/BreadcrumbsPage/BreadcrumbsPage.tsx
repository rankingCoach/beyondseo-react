import React, { SyntheticEvent, useState, useEffect } from "react";
import styles from "./BreadcrumbsPage.module.scss";
import { ComponentContainer, Switch, Text, TextTypes, FontWeights, Input, Button, ButtonTypes } from "vanguard";
import { SeparatorSettings } from "./SeparatorSettings";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { BreadcrumbPreview } from "./BreadcrumbPreview";
import { BreadcrumbsPagePlaceholder } from "./BreadcrumbsPagePlaceholder";
import { __ } from "@wordpress/i18n";

interface BreadcrumbSuffixes {
  archive: string;
  search: string;
  "404": string;
  custom_post: string;
  category: string;
  taxonomy: string;
}

interface BreadcrumbPrefixes {
  archive: string;
  search: string;
  "404": string;
  custom_post: string;
  taxonomy: string;
}

interface BreadcrumbSettings {
  home_text: string;
  separator: string;
  enable_schema_markup: boolean;
  max_depth: number;
  show_current_as_link: boolean;
  allow_filters: boolean;
  prefix: string;
  suffix: string;
  show_on_posts: boolean;
  show_on_pages: boolean;
  show_on_search: boolean;
  show_on_404: boolean;
  show_on_archives: boolean;
  show_on_categories: boolean;
  show_on_tags: boolean;
  show_on_custom_post_types: boolean;
  show_on_taxonomies: boolean;
  enabled_post_types: string[];
  enabled_taxonomies: string[];
  suffixes: BreadcrumbSuffixes;
  prefixes: BreadcrumbPrefixes;
}

const defaultBreadcrumbSettings: BreadcrumbSettings = {
  home_text: "Home",
  separator: " » ",
  enable_schema_markup: true,
  max_depth: 4,
  show_current_as_link: false,
  allow_filters: true,
  prefix: "You are here: ",
  suffix: "",
  show_on_posts: true,
  show_on_pages: true,
  show_on_search: true,
  show_on_404: true,
  show_on_archives: true,
  show_on_categories: true,
  show_on_tags: true,
  show_on_custom_post_types: true,
  show_on_taxonomies: true,
  enabled_post_types: ["post", "page"],
  enabled_taxonomies: ["category", "post_tag", "product_cat"],
  suffixes: {
    archive: "Archives for",
    search: "Search results for",
    "404": "Error 404: Page not found",
    custom_post: "Custom post type archives for",
    category: "Categories",
    taxonomy: "Taxonomy archives for",
  },
  prefixes: {
    archive: "",
    search: "",
    "404": "",
    custom_post: "",
    taxonomy: "",
  },
};

const BreadcrumbsPage: React.FC = () => {
  const [breadcrumbsEnabled, setBreadcrumbsEnabled] = useState(false);
  const [homeAnchorText, setHomeAnchorText] = useState("");
  const [pathPrefix, setPathPrefix] = useState("");
  const [archiveSuffix, setArchiveSuffix] = useState("");
  const [searchSuffix, setSearchSuffix] = useState("");
  const [errorText, setErrorText] = useState("");
  const [separator, setSeparator] = useState(defaultBreadcrumbSettings.separator);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [breadcrumbSettings, setBreadcrumbSettings] = useState<BreadcrumbSettings>(defaultBreadcrumbSettings);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await seoStore.getRankingcoachSeoSettings({}).toPromise();
      const apiResponse = response as any;
      if (apiResponse?.response?.settings) {
        const settings = apiResponse.response.settings;
        setBreadcrumbsEnabled(settings.enable_breadcrumbs || false);
        if (settings.breadcrumb_settings) {
          setBreadcrumbSettings({
            ...defaultBreadcrumbSettings,
            ...settings.breadcrumb_settings,
          });
          setHomeAnchorText(settings.breadcrumb_settings.home_text || "");
          setPathPrefix(settings.breadcrumb_settings.prefix || "");
          setArchiveSuffix(settings.breadcrumb_settings.suffixes?.archive || "");
          setSearchSuffix(settings.breadcrumb_settings.suffixes?.search || "");
          setErrorText(settings.breadcrumb_settings.suffixes?.["404"] || "");
          setSeparator(settings.breadcrumb_settings.separator || "|");
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchChange = async (event: SyntheticEvent) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    setBreadcrumbsEnabled(checked);
    setIsSaving(true);

    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_breadcrumbs: checked,
          },
        } as any)
        .toPromise();
    } catch (error) {
      setBreadcrumbsEnabled(!checked);
    } finally {
      setIsSaving(false);
    }
  };

  const handleHomeAnchorChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHomeAnchorText(event.target.value);
  };

  const handlePathPrefixChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPathPrefix(event.target.value);
  };

  const handleArchiveSuffixChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setArchiveSuffix(event.target.value);
  };

  const handleSearchSuffixChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSearchSuffix(event.target.value);
  };

  const handleErrorTextChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setErrorText(event.target.value);
  };

  const handleSeparatorChange = (newSeparator: string) => {
    setSeparator(newSeparator);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update the complete settings object
      const updatedSettings = {
        ...breadcrumbSettings,
        home_text: homeAnchorText,
        prefix: pathPrefix,
        separator: separator,
        suffixes: {
          ...breadcrumbSettings.suffixes,
          archive: archiveSuffix,
          search: searchSuffix,
          "404": errorText,
        },
      };

      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_breadcrumbs: breadcrumbsEnabled,
            breadcrumb_settings: updatedSettings,
          },
        } as any)
        .toPromise();

      setBreadcrumbSettings(updatedSettings);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const previewItems = [
    { text: homeAnchorText || "Home", isLink: true },
    { text: "Category", isLink: true },
    { text: "Subcategory", isLink: true },
    { text: "Article Title" },
  ];

  return (
    <ComponentContainer>
      {isLoading ? (
        <BreadcrumbsPagePlaceholder />
      ) : (
        <>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("Breadcrumbs", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__(
              "Show users their location on a website with clickable links to parent pages, acting as a secondary navigation tool. In our BeyondSEO plugin, customize their look to fit your site. They're auto-added to schema markup for better SEO and crawlability, no extra setup needed.",
              "beyondseo",
            )}
          </Text>
          <div className={styles.separator}></div>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.switchLabel}>
            {__("Enable breadcrumbs", "beyondseo")}
          </Text>

          <Switch
            value={breadcrumbsEnabled}
            onChange={handleSwitchChange}
            size="small"
            testId={`breadcrumbs-enable-switch`}
            className={styles.breadcrumbsSwitch}
            disabled={isSaving}
          />

          {breadcrumbsEnabled && (
            <>
              <Text
                type={TextTypes.textIntro}
                fontWeight={FontWeights.medium}
                className={`${styles.title} ${styles.displayOptionsTitle}`}
              >
                {__("Display options", "beyondseo")}
              </Text>
              <div className={styles.optionsContainer}>
                <div className={styles.settingsColumn}>
                  <SeparatorSettings value={separator} onChange={handleSeparatorChange} />
                  <Input
                    value={homeAnchorText}
                    onChange={handleHomeAnchorChange}
                    label={__("Anchor text for homepage", "beyondseo")}
                    labelType="outer"
                    required={true}
                    placeholder={__("Home", "beyondseo")}
                    className={styles.homeAnchorInput}
                  />

                  <Text
                    type={TextTypes.textIntro}
                    fontWeight={FontWeights.medium}
                    className={`${styles.title} ${styles.advancedOptionsTitle}`}
                  >
                    {__("Advanced options", "beyondseo")}
                  </Text>

                  <Input
                    value={pathPrefix}
                    onChange={handlePathPrefixChange}
                    label={__("Prefix for breadcrumb path", "beyondseo")}
                    labelType="outer"
                    required={true}
                    className={styles.advancedInput}
                  />

                  <div className={styles.advancedInput}>
                    <div className={styles.inputWrapper}>
                      <Input
                        value={archiveSuffix}
                        onChange={handleArchiveSuffixChange}
                        label={__("Suffix for archive breadcrumbs", "beyondseo")}
                        labelType="outer"
                        required={true}
                        placeholder={__("Archives for", "beyondseo")}
                      />
                    </div>
                  </div>

                  <div className={styles.advancedInput}>
                    <div className={styles.inputWrapper}>
                      <Input
                        value={searchSuffix}
                        onChange={handleSearchSuffixChange}
                        label={__("Suffix for search page breadcrumbs", "beyondseo")}
                        labelType="outer"
                        required={true}
                        placeholder={__("Search results for", "beyondseo")}
                      />
                    </div>
                  </div>

                  <div className={styles.advancedInput}>
                    <div className={styles.inputWrapper}>
                      <Input
                        value={errorText}
                        onChange={handleErrorTextChange}
                        label={__("Breadcrumbs for 404 Page", "beyondseo")}
                        labelType="outer"
                        required={true}
                        placeholder={__("Error 404: Page not found", "beyondseo")}
                      />
                    </div>
                  </div>
                </div>
                <div className={styles.previewColumn}>
                  <Text type={TextTypes.text} fontWeight={FontWeights.regular} className={styles.previewTitle}>
                    {__("Preview", "beyondseo")}
                  </Text>
                  <BreadcrumbPreview items={previewItems} separator={separator} prefix={pathPrefix} />
                  {archiveSuffix && (
                    <div className={`${styles.previewItem} ${styles.archive}`}>
                      <BreadcrumbPreview
                        items={[{ text: homeAnchorText || "Home", isLink: true }, { text: archiveSuffix }]}
                        separator={separator}
                        prefix={pathPrefix}
                      />
                    </div>
                  )}
                  {searchSuffix && (
                    <div className={`${styles.previewItem} ${styles.search}`}>
                      <BreadcrumbPreview
                        items={[{ text: homeAnchorText || "Home", isLink: true }, { text: searchSuffix }]}
                        separator={separator}
                        prefix={pathPrefix}
                      />
                    </div>
                  )}
                  {errorText && (
                    <div className={`${styles.previewItem} ${styles.error}`}>
                      <BreadcrumbPreview
                        items={[{ text: homeAnchorText || "Home", isLink: true }, { text: errorText }]}
                        separator={separator}
                        prefix={pathPrefix}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.buttonContainer}>
                <Button
                  type={ButtonTypes.primary}
                  onClick={handleSave}
                  testId="save-breadcrumbs-settings"
                  disabled={isSaving}
                  isLoading={isSaving}
                >
                  {__("Save changes", "beyondseo")}
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </ComponentContainer>
  );
};

export default BreadcrumbsPage;
