import React, { useState, useEffect } from "react";
import styles from "./ImportSettingsPage.module.scss";
import { ComponentContainer, Text, TextTypes, Link, FontWeights, Button, ButtonTypes } from "vanguard";
import { ImportSettingsPagePlaceholder } from "./ImportSettingsPagePlaceholder";
import { __ } from "@wordpress/i18n";

interface ImportSettingsPageProps {
  comingSoon?: boolean;
}

const ImportSettingsPage: React.FC<ImportSettingsPageProps> = ({ comingSoon }) => {
  const [togglerState, setTogglerState] = useState<"left" | "right">("left");
  const [selectedPlugin, setSelectedPlugin] = useState<string>("yoast");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleTogglerChange = (selection: string) => {
    setTogglerState(selection as "left" | "right");
  };

  const handlePluginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPlugin(event.target.value);
  };

  const handleImport = () => {
    // API call will be added later
  };

  return (
    <ComponentContainer>
      {isLoading ? (
        <ImportSettingsPagePlaceholder />
      ) : (
        <>
          <div className={styles.titleContainer}>
            <Text type={TextTypes.heading3} className={styles.title}>
              {__("Import settings", "beyondseo")}
            </Text>
            {comingSoon && <span className={styles.comingSoonBadge}>{__("Coming soon", "beyondseo")}</span>}
          </div>
          <Text type={TextTypes.text} className={styles.description}>
            {__(
              "Switching to our SEO Plugin? Import your settings from other SEO plugins like Yoast SEO, All in One SEO, Rank Math, or SEOPress in just a few clicks. We'll ensure your data is safely transferred.",
              "beyondseo",
            )}
          </Text>
          <div className={styles.separator}></div>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.stepTitle}>
            {__("Step 1. Backup your site", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.stepDescription}>
            {__(
              "Before importing settings, we strongly recommend creating a full backup of your WordPress site to avoid any data loss.",
              "beyondseo",
            )}
          </Text>
          <Link href="#" className={styles.backupLink}>
            {__("Learn how to backup your site", "beyondseo")}
          </Link>

          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.stepTitle}>
            {__("Step 2. Select Plugin to import from", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.stepDescription}>
            {__(
              "Choose the SEO plugin you're currently using. We've detected the following plugins installed on your site.",
              "beyondseo",
            )}
          </Text>

          <div className={styles.radioGroup}>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="plugin"
                value="yoast"
                checked={selectedPlugin === "yoast"}
                onChange={handlePluginChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{__("Yoast SEO", "beyondseo")}</span>
            </label>
            <label className={styles.radioLabel}>
              <input
                type="radio"
                name="plugin"
                value="aioseo"
                checked={selectedPlugin === "aioseo"}
                onChange={handlePluginChange}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{__("All in One SEO", "beyondseo")}</span>
            </label>
          </div>
          <div className={styles.buttonContainer}>
            <Button
              type={ButtonTypes.primary}
              onClick={handleImport}
              testId="import-settings-button"
              disabled={comingSoon}
            >
              {__("Import settings", "beyondseo")}
            </Button>
            {comingSoon && (
              <Text type={TextTypes.text} className={styles.comingSoonText}>
                {__("This feature will be available soon.", "beyondseo")}
              </Text>
            )}
          </div>
        </>
      )}
    </ComponentContainer>
  );
};

export default ImportSettingsPage;
