import React, { SyntheticEvent, useState, useEffect } from "react";
import styles from "./RobotsPage.module.scss";
import { ComponentContainer, Switch, Text, TextTypes, FontWeights, Button, ButtonTypes, CheckBox } from "vanguard";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { RobotsPagePlaceholder } from "./RobotsPagePlaceholder";
import { __ } from "@wordpress/i18n";

const RobotsPage: React.FC = () => {
  const [robotsEnabled, setRobotsEnabled] = useState(true);
  const [includeSitemap, setIncludeSitemap] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { plugin } = useSelector((state: RootState) => state.app);
  const homeUrl = plugin?.pluginData?.website?.settings?.homeUrl;

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
        setRobotsEnabled(settings.enable_robots_txt !== undefined ? settings.enable_robots_txt : true);
        setIncludeSitemap(settings.include_sitemap_in_robots !== undefined ? settings.include_sitemap_in_robots : false);
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleRobotsToggle = async (event: SyntheticEvent) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    setRobotsEnabled(checked);
    setIsSaving(true);

    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_robots_txt: checked,
          },
        } as any)
        .toPromise();
    } catch (error) {
      setRobotsEnabled(!checked);
    } finally {
      setIsSaving(false);
    }
  };

  const handleIncludeSitemapChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeSitemap(event.target.checked);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            enable_robots_txt: robotsEnabled,
            include_sitemap_in_robots: includeSitemap,
          },
        } as any)
        .toPromise();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewRobots = () => {
    window.open(`${homeUrl}/robots.txt`, "_blank");
  };

  return (
    <ComponentContainer>
      {isLoading ? (
        <RobotsPagePlaceholder />
      ) : (
        <>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("Robots.txt", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__("View your robots.txt file to check search engine crawling instructions.", "beyondseo")}
          </Text>
          <div className={styles.separator}></div>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.switchLabel}>
            {__("Enable robots.txt", "beyondseo")}
          </Text>

          <Switch
            value={robotsEnabled}
            onChange={handleRobotsToggle}
            size="small"
            testId="robots-enable-switch"
            className={styles.robotsSwitch}
            disabled={isSaving}
          />

          {robotsEnabled && (
            <>
              <Text
                type={TextTypes.textIntro}
                fontWeight={FontWeights.medium}
                className={`${styles.title} ${styles.displayOptionsTitle}`}
              >
                {__("Options", "beyondseo")}
              </Text>

              <div className={styles.checkboxContainer}>
                <CheckBox
                  checked={includeSitemap}
                  onChange={handleIncludeSitemapChange}
                  label={__("Include sitemap URL in robots.txt file", "beyondseo")}
                  disabled={isSaving}
                />
                <Text type={TextTypes.text} className={styles.checkboxDescription}>
                  {__(
                    "When enabled, your sitemap URL will be automatically added to your robots.txt file.",
                    "beyondseo",
                  )}
                </Text>
              </div>

              <div className={styles.urlContainer}>
                <Text type={TextTypes.text}>{__("Your robots.txt URL:", "beyondseo")}</Text>
                <Text type={TextTypes.text} className={styles.urlValue}>
                  {homeUrl}/robots.txt
                </Text>
                <Button type={ButtonTypes.secondary} onClick={handleViewRobots} className={styles.viewButton}>
                  {__("View Robots.txt", "beyondseo")}
                </Button>
              </div>

              <div className={styles.secondarySeparator}></div>

              <Text type={TextTypes.text} className={styles.additionalInfo}>
                {__(
                  "The robots.txt file tells search engines which pages or files they can or cannot request from your site.",
                  "beyondseo",
                )}
              </Text>

              <div className={styles.buttonContainer}>
                <Button
                  type={ButtonTypes.primary}
                  onClick={handleSave}
                  testId="save-robots-settings"
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

export default RobotsPage;
