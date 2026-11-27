import React, { useEffect, useState } from "react";
import styles from "./WebmasterToolsPage.module.scss";
import { ComponentContainer, Text, TextTypes, Input, Button, ButtonTypes, ButtonSizes } from "vanguard";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { __ } from "@wordpress/i18n";
import { useReviewSettingsSave } from "../../Review/Review";
import { WebmasterToolsPagePlaceholder } from "./WebmasterToolsPagePlaceholder";
import { ProjectDomain } from "./ProjectDomain";

const MAX_CODE_LENGTH = 100;
const VALID_CODE = /^[A-Za-z0-9_-]*$/;

/**
 * Accepts a bare verification code or the full <meta> tag copied from the search engine
 * and returns only the content value. Mirrors the server-side sanitising.
 */
export const extractVerificationCode = (raw: string): string => {
  const value = raw.trim();
  if (value.includes("content=")) {
    const match = value.match(/content=(['"])?([^'">\s]+)(?:\1|[\s/>])/);
    if (match) {
      return match[2].trim();
    }
  }
  return value;
};

const getCodeError = (code: string): string => {
  if (code.length > MAX_CODE_LENGTH) {
    return __("The verification code is too long", "beyondseo");
  }
  if (!VALID_CODE.test(code)) {
    return __("Only letters, numbers, dashes and underscores are allowed", "beyondseo");
  }
  return "";
};

const WebmasterToolsPage: React.FC<{ reviewNotice?: React.ReactNode }> = ({ reviewNotice }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [googleCode, setGoogleCode] = useState("");
  const [bingCode, setBingCode] = useState("");
  const { saveReviewSettings, reviewSave } = useReviewSettingsSave();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = (await seoStore.getRankingcoachSeoSettings({}).toPromise()) as any;
        const settings = response?.response?.settings;
        if (settings) {
          setGoogleCode(settings.google_verification_code || "");
          setBingCode(settings.bing_verification_code || "");
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, []);

  const googleError = getCodeError(extractVerificationCode(googleCode));
  const bingError = getCodeError(extractVerificationCode(bingCode));

  const handleSave = async () => {
    const cleanGoogle = extractVerificationCode(googleCode);
    const cleanBing = extractVerificationCode(bingCode);
    if (getCodeError(cleanGoogle) || getCodeError(cleanBing)) {
      return;
    }

    setIsSaving(true);
    try {
      await saveReviewSettings({
        google_verification_code: cleanGoogle,
        bing_verification_code: cleanBing,
      });
      setGoogleCode(cleanGoogle);
      setBingCode(cleanBing);
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ComponentContainer>
      {isLoading ? (
        <WebmasterToolsPagePlaceholder />
      ) : (
        <>
          <Text type={TextTypes.heading3} className={styles.title}>
            {__("Webmaster Tools", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.description}>
            {__(
              "Verify your site with Google Search Console and Bing Webmaster Tools. Paste the verification code, or the whole meta tag, from the HTML tag method. We add it to your site's head section.",
              "beyondseo",
            )}
          </Text>
          <div className={styles.separator}></div>
          {reviewNotice}

          <div className={styles.settingsColumn}>
            <Input
              value={googleCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setGoogleCode(event.target.value)}
              onBlur={() => setGoogleCode(extractVerificationCode(googleCode))}
              label={__("Google Search Console", "beyondseo")}
              labelType="outer"
              placeholder={__("Verification code or meta tag", "beyondseo")}
              infoText={
                googleError ||
                __(
                  "In Search Console choose the HTML tag method and copy the code (the content value of the tag).",
                  "beyondseo",
                )
              }
              className={styles.codeInput}
              disabled={isSaving}
            />

            <Input
              value={bingCode}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setBingCode(event.target.value)}
              onBlur={() => setBingCode(extractVerificationCode(bingCode))}
              label={__("Bing Webmaster Tools", "beyondseo")}
              labelType="outer"
              placeholder={__("Verification code or meta tag", "beyondseo")}
              infoText={
                bingError ||
                __(
                  "In Bing Webmaster Tools choose the HTML Meta Tag method and copy the code (the content value of the tag).",
                  "beyondseo",
                )
              }
              className={styles.codeInput}
              disabled={isSaving}
            />

            <Text type={TextTypes.text} className={styles.note}>
              {__("After saving, go back to the search engine and click Verify.", "beyondseo")}
            </Text>

            <div className={styles.buttonContainer}>
              <Button
                size={ButtonSizes.extraLarge}
                type={ButtonTypes.primary}
                onClick={handleSave}
                disabled={!!googleError || !!bingError || isSaving}
                isLoading={isSaving}
              >
                {__("Save changes", "beyondseo")}
              </Button>
            </div>
          </div>
          <ProjectDomain />
          {reviewSave}
        </>
      )}
    </ComponentContainer>
  );
};

export default WebmasterToolsPage;
