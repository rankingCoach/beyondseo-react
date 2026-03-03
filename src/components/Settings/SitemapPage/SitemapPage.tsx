import React, { SyntheticEvent, useState, useEffect } from "react";
import styles from "./SitemapPage.module.scss";
import { ComponentContainer, Switch, Text, TextTypes, FontWeights, Button, ButtonTypes } from "vanguard";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { SitemapPagePlaceholder } from "./SitemapPagePlaceholder";
import { __ } from "@wordpress/i18n";

interface SitemapSettings {
  enabled: boolean;
  includeImages: boolean;
  maxLinks: number;
  pingGoogle: boolean;
  pingBing: boolean;
}

const defaultSitemapSettings: SitemapSettings = {
  enabled: true,
  includeImages: true,
  maxLinks: 1000,
  pingGoogle: true,
  pingBing: true,
};

const SitemapPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sitemapSettings, setSitemapSettings] = useState<SitemapSettings>(defaultSitemapSettings);
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
      if (apiResponse?.response?.settings?.sitemap) {
        const settings = apiResponse.response.settings.sitemap;
        setSitemapSettings({
          ...defaultSitemapSettings,
          ...settings,
        });
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSitemapToggle = async (event: SyntheticEvent) => {
    const checked = (event.currentTarget as HTMLInputElement).checked;
    const updatedSettings = {
      ...sitemapSettings,
      enabled: checked,
    };

    setSitemapSettings(updatedSettings);
    setIsSaving(true);

    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            sitemap: updatedSettings,
          },
        } as any)
        .toPromise();
    } catch (error) {
      // Revert on error
      setSitemapSettings({
        ...sitemapSettings,
        enabled: !checked,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            sitemap: sitemapSettings,
          },
        } as any)
        .toPromise();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewSitemap = () => {
    window.open(`${homeUrl}/sitemap.xml`, "_blank");
  };

  return (
    <ComponentContainer>
      {isLoading ? (
        <SitemapPagePlaceholder />
      ) : (
        <>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("Sitemap", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__("Generate and manage your XML sitemap for better search engine indexing.", "beyondseo")}
          </Text>
          <div className={styles.separator}></div>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.switchLabel}>
            {__("Enable sitemap", "beyondseo")}
          </Text>

          <Switch
            value={sitemapSettings.enabled}
            onChange={handleSitemapToggle}
            size="small"
            testId="sitemap-enable-switch"
            className={styles.sitemapSwitch}
            disabled={isSaving}
          />

          {sitemapSettings.enabled && (
            <>
              <Text type={TextTypes.text} className={styles.lastUpdated}>
                {__("Last updated:", "beyondseo")} June 24, 2025 8:31 am
              </Text>

              <div className={styles.secondarySeparator}></div>

              <Text type={TextTypes.text} className={styles.additionalInfo}>
                {__(
                  "The sitemap is automatically regenerated when you publish new content. You can also manually generate it using the button above.",
                  "beyondseo",
                )}
              </Text>

              <div className={styles.urlContainer}>
                <Text type={TextTypes.text}>{__("Your sitemap URL:", "beyondseo")}</Text>
                <Text type={TextTypes.text} className={styles.urlValue}>
                  {homeUrl}/sitemap.xml
                </Text>
                <Button type={ButtonTypes.secondary} onClick={handleViewSitemap}>
                  {__("View Sitemap", "beyondseo")}
                </Button>
              </div>

              <div className={styles.buttonContainer}>
                <Button
                  type={ButtonTypes.primary}
                  onClick={handleSave}
                  testId="save-sitemap-settings"
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

export default SitemapPage;
