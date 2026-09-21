import React, { useState, useEffect, useRef } from "react";
import styles from "./SupportPage.module.scss";
import { ComponentContainer, Text, TextTypes, FontWeights, Button, ButtonTypes, Skeleton } from "vanguard";
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
    <ComponentContainer>
      <Text type={TextTypes.heading3} className={styles.title}>
        {__("Support", "beyondseo")}
      </Text>
      <Text type={TextTypes.text} className={styles.description}>
        {__("Need help? Get in touch with our support team and copy your site information below.", "beyondseo")}
      </Text>
      <div className={styles.separator}></div>

      <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.sectionTitle}>
        {__("Contact us", "beyondseo")}
      </Text>
      <div className={styles.buttonContainer}>
        <Button
          type={ButtonTypes.secondary}
          onClick={handleContactSupport}
          testId="contact-support-button"
        >
          {__("Contact Support", "beyondseo")}
        </Button>
      </div>

      <div className={styles.separator}></div>

      <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.sectionTitle}>
        {__("Site info", "beyondseo")}
      </Text>

      {isLoading ? (
        <Skeleton width="220px" height="40px" />
      ) : hasError ? (
        <div className={styles.buttonContainer}>
          <Text type={TextTypes.text} className={styles.errorText}>
            {__("Failed to load site info. Please try again.", "beyondseo")}
          </Text>
          <Button
            type={ButtonTypes.secondary}
            onClick={loadSiteInfo}
            testId="retry-site-info-button"
          >
            {__("Retry", "beyondseo")}
          </Button>
        </div>
      ) : (
        <div className={styles.buttonContainer}>
          <Button
            type={ButtonTypes.primary}
            onClick={handleCopyToClipboard}
            disabled={!siteInfo}
            testId="copy-site-info-button"
          >
            {__("Copy site info to clipboard", "beyondseo")}
          </Button>
          {isCopied && (
            <Text type={TextTypes.text} className={styles.copiedText}>
              {__("Copied to clipboard", "beyondseo")}
            </Text>
          )}
        </div>
      )}
    </ComponentContainer>
  );
};

export default SupportPage;
