import React, { SyntheticEvent, useState, useEffect } from "react";
import styles from "./RSSPage.module.scss";
import { ComponentContainer, Switch, Text, TextTypes, FontWeights, Input, Button, ButtonTypes } from "vanguard";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { RSSPagePlaceholder } from "./RSSPagePlaceholder";
import { __ } from "@wordpress/i18n";

interface RSSSettings {
  feeds: {
    cleanupEnable: boolean;
    global: boolean;
    globalComments: boolean;
    postComments: boolean;
    attachments: boolean;
    authors: boolean;
    search: boolean;
    archivesIncluded: string[];
    archivesAll: boolean;
    taxonomiesIncluded: string[];
    taxonomiesAll: boolean;
    atom: boolean;
    rdf: boolean;
    staticBlogPage: boolean;
    paginated: boolean;
  };
  content: {
    before: string;
    after: string;
  };
}

const defaultRSSSettings: RSSSettings = {
  feeds: {
    cleanupEnable: false,
    global: true,
    globalComments: true,
    postComments: true,
    attachments: true,
    authors: true,
    search: true,
    archivesIncluded: ["post", "page", "attachment"],
    archivesAll: false,
    taxonomiesIncluded: ["category", "post_tag"],
    taxonomiesAll: false,
    atom: true,
    rdf: true,
    staticBlogPage: true,
    paginated: true,
  },
  content: {
    before: "",
    after: "",
  },
};

const RSSPage: React.FC = () => {
  const [rssEnabled, setRssEnabled] = useState(true);
  const [beforeContent, setBeforeContent] = useState("");
  const [afterContent, setAfterContent] = useState("");
  const [beforeContentError, setBeforeContentError] = useState<string>("");
  const [afterContentError, setAfterContentError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [rssSettings, setRssSettings] = useState<RSSSettings>({ ...defaultRSSSettings });
  const { plugin } = useSelector((state: RootState) => state.app);


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
        setRssEnabled(settings.enable_rss !== undefined ? settings.enable_rss : true);

        if (settings.rss) {
          setRssSettings((settings.rss as RSSSettings) || { ...defaultRSSSettings });

          if (settings.rss.content) {
            setBeforeContent(settings.rss.content.before || "");
            setAfterContent(settings.rss.content.after || "");
          }
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const validateContent = (value: string): boolean => {
    return value.length <= 255;
  };

  const handleBeforeContentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setBeforeContent(value);
    if (!validateContent(value)) {
      setBeforeContentError(__("Content exceeds maximum length of 255 characters", "beyondseo"));
    } else {
      setBeforeContentError("");
    }
  };

  const handleAfterContentChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setAfterContent(value);
    if (!validateContent(value)) {
      setAfterContentError("Content exceeds maximum length of 255 characters");
    } else {
      setAfterContentError("");
    }
  };

  const handleRssToggle = async (event: SyntheticEvent) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    setRssEnabled(checked);
    setIsSaving(true);

    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_rss: checked,
          },
        } as any)
        .toPromise();
    } catch (error) {
      setRssEnabled(!checked);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenRSS = () => {
    const homeUrl = plugin?.pluginData?.website?.settings?.homeUrl;
    window.open(`${homeUrl}/feed/`, "_blank");
  };

  const handleSave = async () => {
    if (!validateContent(beforeContent) || !validateContent(afterContent)) {
      return; // Prevent saving if validation fails
    }

    setIsSaving(true);
    try {
      const updatedSettings = {
        ...rssSettings,
        content: {
          ...rssSettings.content,
          before: beforeContent,
          after: afterContent,
        },
      };

      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_rss: rssEnabled,
            rss: updatedSettings,
          },
        } as any)
        .toPromise();

      setRssSettings(updatedSettings);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ComponentContainer>
      {isLoading ? (
        <RSSPagePlaceholder />
      ) : (
        <>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("RSS", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__(
              "This feature is used to automatically add content to your site's RSS feed. More specifically, it allows you to add links back to your blog and your blog posts so scrapers will automatically add these links too. This helps search engines identify you as the original source of the content.",
              "beyondseo",
            )}
          </Text>
          <div className={styles.separator}></div>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.switchLabel}>
            {__("Enable RSS", "beyondseo")}
          </Text>

          <Switch
            value={rssEnabled}
            onChange={handleRssToggle}
            size="small"
            testId="rss-enable-switch"
            className={styles.rssSwitch}
            disabled={isSaving}
          />

          {rssEnabled && (
            <>
              <Text
                type={TextTypes.textIntro}
                fontWeight={FontWeights.medium}
                className={`${styles.title} ${styles.displayOptionsTitle}`}
              >
                {__("Options", "beyondseo")}
              </Text>
              <div className={styles.settingsColumn}>
                <Input
                  value={beforeContent}
                  onChange={handleBeforeContentChange}
                  label={__("Content to put before each post in the feed", "beyondseo")}
                  labelType="outer"
                  maxLength={255}
                  counter={true}
                  required={true}
                  infoText={beforeContentError}
                  className={styles.rssInput}
                  highlightLengthExceeded={beforeContent.length > 255}
                  disabled={isSaving}
                />

                <Input
                  value={afterContent}
                  onChange={handleAfterContentChange}
                  label={__("Content to put after each post in the feed", "beyondseo")}
                  labelType="outer"
                  maxLength={255}
                  counter={true}
                  required={true}
                  infoText={afterContentError}
                  className={styles.rssInput}
                  highlightLengthExceeded={afterContent.length > 255}
                  disabled={isSaving}
                />

                <div className={styles.urlContainer}>
                  <Text type={TextTypes.text}>{__("Your RSS feed URL:", "beyondseo")}</Text>
                  <Text type={TextTypes.text} className={styles.urlValue}>
                    {plugin?.pluginData?.website?.settings?.homeUrl}/feed/
                  </Text>
                  <Button type={ButtonTypes.secondary} onClick={handleOpenRSS} className={styles.openRssButton}>
                    {__("View RSS Feed", "beyondseo")}
                  </Button>
                </div>


                <div className={styles.buttonContainer}>
                  <Button
                    type={ButtonTypes.primary}
                    onClick={handleSave}
                    disabled={!validateContent(beforeContent) || !validateContent(afterContent) || isSaving}
                    isLoading={isSaving}
                  >
                    {__("Save changes", "beyondseo")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </ComponentContainer>
  );
};

export default RSSPage;
