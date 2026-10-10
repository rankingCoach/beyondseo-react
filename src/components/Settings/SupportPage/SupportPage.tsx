import React, { useState, useEffect, useRef } from "react";
import styles from "./SupportPage.module.scss";
import settingsStyles from "../Settings.module.scss";
import { Text, TextTypes, Button, ButtonTypes, Skeleton } from "vanguard";
import { rcWindow } from "@stores/window.store";
import { __ } from "@wordpress/i18n";
import { getSupportUrl } from "@helpers/external-links";

const SupportPage: React.FC = () => {
  const [siteInfo, setSiteInfo] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const copiedTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    loadSiteInfo();

    return () => {
      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }
    };
  }, []);

  const loadSiteInfo = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const restUrl = rcWindow.rankingCoachRestData?.restUrl || "";
      const response = await fetch(`${restUrl}support/site-info`, {
        method: "GET",
        headers: {
          "X-WP-Nonce": rcWindow.rankingCoachRestData?.nonce,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch site info");
      }

      const data = await response.json();
      setSiteInfo(data?.siteInfo || "");
    } catch (error) {
      setHasError(true);
      setSiteInfo("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleContactSupport = () => {
    window.open(getSupportUrl(), "_blank");
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(siteInfo);
      setIsCopied(true);

      if (copiedTimeoutRef.current) {
        clearTimeout(copiedTimeoutRef.current);
      }

      copiedTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    } catch (error) {}
  };

  return (
    <main className={styles.page}>
      <div className={`${settingsStyles.contentArea} ${styles.surface}`}>
        <header className={styles.header}>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("Support", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__("Need help? Get in touch with our support team and copy your site information below.", "beyondseo")}
          </Text>
        </header>

        <div className={styles.sections}>
          <section className={styles.section} aria-labelledby="support-contact-title">
            <div className={styles.sectionContent}>
              <span className={styles.sectionNumber} aria-hidden="true">
                01
              </span>
              <div>
                <h2 id="support-contact-title" className={styles.sectionTitle}>
                  {__("Contact us", "beyondseo")}
                </h2>
                <Text type={TextTypes.text} className={styles.sectionDescription}>
                  {__("Reach out to our team for help with BeyondSEO.", "beyondseo")}
                </Text>
              </div>
            </div>
            <div className={styles.action}>
              <Button type={ButtonTypes.secondary} onClick={handleContactSupport} testId="contact-support-button">
                {__("Contact Support", "beyondseo")}
              </Button>
            </div>
          </section>

          <section className={styles.section} aria-labelledby="support-site-info-title">
            <div className={styles.sectionContent}>
              <span className={styles.sectionNumber} aria-hidden="true">
                02
              </span>
              <div>
                <h2 id="support-site-info-title" className={styles.sectionTitle}>
                  {__("Site info", "beyondseo")}
                </h2>
                <Text type={TextTypes.text} className={styles.sectionDescription}>
                  {__("Copy your site's technical details to share with our support team.", "beyondseo")}
                </Text>
              </div>
            </div>
            <div className={styles.action}>
              {isLoading ? (
                <div role="status" aria-label={__("Loading site info", "beyondseo")}>
                  <Skeleton width="220px" height="40px" />
                </div>
              ) : hasError ? (
                <div className={styles.actionGroup}>
                  <div role="alert">
                    <Text type={TextTypes.text} className={styles.errorText}>
                      {__("Failed to load site info. Please try again.", "beyondseo")}
                    </Text>
                  </div>
                  <Button type={ButtonTypes.secondary} onClick={loadSiteInfo} testId="retry-site-info-button">
                    {__("Retry", "beyondseo")}
                  </Button>
                </div>
              ) : (
                <div className={styles.actionGroup}>
                  <Button
                    type={ButtonTypes.primary}
                    onClick={handleCopyToClipboard}
                    disabled={!siteInfo}
                    testId="copy-site-info-button"
                  >
                    {__("Copy site info to clipboard", "beyondseo")}
                  </Button>
                  {isCopied && (
                    <div role="status">
                      <Text type={TextTypes.text} className={styles.copiedText}>
                        {__("Copied to clipboard", "beyondseo")}
                      </Text>
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default SupportPage;
