import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./Activation.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  ComponentContainer,
  IconNames,
  Input,
  CheckBox,
  Text,
  TextTypes,
  FontWeights,
  Link,
} from "vanguard";
import { __, sprintf } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { isValidEmail } from "@helpers/string-helpers";
import { getPrivacyPolicyUrl, getSupportUrl, getTermsUrl } from "@helpers/external-links";
import { AdminPage, getAdminPageUrl, getPluginRestUrl, getRestNonce } from "@helpers/internal-links";
import { completeActivation, requestStage, StageRequestError } from "@helpers/staged-request";

interface ActivationProps {
  isPluginLoading?: boolean;
}

type ActivationView = "form" | "error" | "success" | "recover" | "recoverSuccess";

export const Activation: React.FC<ActivationProps> = ({ isPluginLoading }) => {
  // REST routes and admin pages come from the central internal-links helper (PHP-localized,
  // plain WordPress defaults as fallback), so no URL is built in this component.
  const RECOVER_URL = getPluginRestUrl("account/recoverActivationCode");
  const ONBOARDING_URL = getAdminPageUrl(AdminPage.Onboarding, { skipWelcomeScreen: 1 });
  const REGISTRATION_URL = getAdminPageUrl(AdminPage.Registration);
  // Partner-aware support link (IONOS desk for IONOS installs, rankingCoach otherwise), resolved server-side
  // and read through the central external-links helper (falls back to rankingCoach support).
  const SUPPORT_URL: string = getSupportUrl();

  const [view, setView] = useState<ActivationView>("form");
  const [activationCode, setActivationCode] = useState("");
  const [commOptIn, setCommOptIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorDetails, setErrorDetails] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const activationRunning = useRef(false);
  const resumeChecked = useRef(false);
  const [codeError, setCodeError] = useState("");
  const { plugin } = useSelector((state: RootState) => state.app);
  const adminEmail = plugin?.pluginData?.website?.settings?.adminEmail || "";
  const [recoverEmail, setRecoverEmail] = useState(adminEmail);
  const [recoverEmailError, setRecoverEmailError] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [previousView, setPreviousView] = useState<"form" | "recover">("form");

  useEffect(() => {
    if (view !== "success") return;
    const timer = setTimeout(() => {
      window.location.href = ONBOARDING_URL;
    }, 5000);
    return () => clearTimeout(timer);
  }, [view]);

  const runActivation = async (code?: string, consent?: boolean) => {
    if (activationRunning.current) return;
    activationRunning.current = true;
    setIsLoading(true);
    try {
      await completeActivation(code, consent);
      setView("success");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : __("Activation failed.", "beyondseo"));
      setErrorDetails(error instanceof StageRequestError ? error.details : "");
      setPreviousView("form");
      setView("error");
    } finally {
      activationRunning.current = false;
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (resumeChecked.current) return;
    resumeChecked.current = true;
    void requestStage("account/activationStatus", null, "GET")
      .then(async (status) => {
        if (status.pending) {
          await runActivation();
        } else {
          if (status.complete) setView("success");
          setIsLoading(false);
        }
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSubmit = async () => {
    if (!commOptIn || isLoading || activationRunning.current) return;
    if (activationCode.trim() === "") {
      setCodeError(__("Activation code is required.", "beyondseo"));
      return;
    }
    setCodeError("");
    await runActivation(activationCode.trim(), commOptIn);
  };

  const handleRecoverSubmit = async () => {
    if (isRecovering || isLoading) return;
    const email = recoverEmail.trim();
    if (!isValidEmail(email)) {
      setRecoverEmailError(__("Please enter a valid email address.", "beyondseo"));
      return;
    }
    setRecoverEmailError("");
    setIsRecovering(true);
    try {
      const res = await fetch(RECOVER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": getRestNonce(),
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success === true) {
        setView("recoverSuccess");
      } else {
        setErrorMessage(
          data.message || __("We could not send a recovery email. Please contact customer support.", "beyondseo"),
        );
        setErrorDetails("");
        setPreviousView("recover");
        setView("error");
      }
    } catch (e) {
      setErrorMessage(__("We could not send a recovery email. Please contact customer support.", "beyondseo"));
      setErrorDetails("");
      setPreviousView("recover");
      setView("error");
    } finally {
      setIsRecovering(false);
    }
  };

  return (
    <ComponentContainer className={styles.activationContainer}>
      <div className={styles.headerSection}>
        <div className={styles.logo}>
          <img src={beyondSEOLogo} alt="BeyondSEO" />
        </div>
      </div>

      <div className={styles.topDivider} />

      <div className={styles.activationContent}>
        {view === "form" && (
          <>
            <Text type={TextTypes.heading1} fontWeight={FontWeights.bold} className={styles.authTitle}>
              {__("Enter your activation code", "beyondseo")}
            </Text>

            <Text type={TextTypes.text} className={styles.authDescription}>
              {__("Enter the activation code provided by your provider.", "beyondseo")}
            </Text>

            <Input
              label={__("Activation Code", "beyondseo")}
              required={true}
              value={activationCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setActivationCode(e.target.value)}
              placeholder={__("Enter your activation code", "beyondseo")}
              type="text"
              className={styles.activationInput}
            />
            {codeError && (
              <Text type={TextTypes.text} className={styles.codeError}>
                {codeError}
              </Text>
            )}
            <div className={styles.recoverHint}>
              {/* Split so only the trailing word is the link; Text stringifies nested components, so Link must stay a sibling. */}
              <Text type={TextTypes.textHelp} display="inline">
                {__("Check your email for your activation code. Didn’t receive it? Recover it", "beyondseo")}
              </Text>{" "}
              <Link
                display="inline"
                onClick={() => {
                  if (isLoading) return;
                  setRecoverEmailError("");
                  setView("recover");
                }}
              >
                {__("here", "beyondseo")}
              </Link>
            </div>

            <div className={styles.termsContainer}>
              <CheckBox
                checked={commOptIn}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCommOptIn(e.target.checked)}
                label={
                  <span>
                    {__(
                      "I agree that the BeyondSEO plugin may create/authenticate my account and communicate with rankingCoach servers to provide its services. I have read and accept the ",
                      "beyondseo",
                    )}
                    <Link href={getPrivacyPolicyUrl()} target="_blank" rel="noopener noreferrer">
                      {__("Privacy Policy", "beyondseo")}
                    </Link>
                    {__(" and the ", "beyondseo")}
                    <Link href={getTermsUrl()} target="_blank" rel="noopener noreferrer">
                      {__("Terms and Conditions", "beyondseo")}
                    </Link>
                    .
                  </span>
                }
              />
            </div>
          </>
        )}

        {view === "error" && (
          <>
            <div className={styles.errorIcon}>!</div>
            <Text type={TextTypes.text} className={styles.authDescription}>
              {errorMessage}
            </Text>
            {errorDetails && (
              <Text type={TextTypes.text} className={styles.errorDetails}>
                {sprintf(__("Details: %s", "beyondseo"), errorDetails)}
              </Text>
            )}
            <Link href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
              {__("Contact support", "beyondseo")}
            </Link>
          </>
        )}

        {view === "success" && (
          <>
            <Text type={TextTypes.heading1} fontWeight={FontWeights.bold} className={styles.authTitle}>
              {__("Activation done", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={styles.authDescription}>
              {__("You will be automatically redirected in 5 seconds...", "beyondseo")}
            </Text>
          </>
        )}

        {view === "recover" && (
          <>
            <Text type={TextTypes.heading1} fontWeight={FontWeights.bold} className={styles.authTitle}>
              {__("Recover your activation code", "beyondseo")}
            </Text>

            <Text type={TextTypes.text} className={styles.authDescription}>
              {__(
                "Enter the email address your rankingCoach subscription is registered with. We will send your activation code to that address.",
                "beyondseo",
              )}
            </Text>

            <Input
              label={__("Email", "beyondseo")}
              required={true}
              value={recoverEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRecoverEmail(e.target.value)}
              type="email"
              className={styles.activationInput}
            />
            {recoverEmailError && (
              <Text type={TextTypes.text} className={styles.codeError}>
                {recoverEmailError}
              </Text>
            )}
          </>
        )}

        {view === "recoverSuccess" && (
          <>
            <Text type={TextTypes.heading1} fontWeight={FontWeights.bold} className={styles.authTitle}>
              {__("Check your inbox", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={styles.authDescription}>
              {sprintf(
                __("We have sent your activation code to %s. Enter it below once it arrives.", "beyondseo"),
                recoverEmail.trim(),
              )}
            </Text>
          </>
        )}
      </div>

      <div className={styles.bottomDivider} />

      <div className={styles.footerSection}>
        {view === "form" && (
          <>
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.medium}
              iconLeft={IconNames.arrowLeft}
              onClick={() => {
                window.location.href = REGISTRATION_URL;
              }}
              className={styles.backButton}
              disabled={isLoading}
            >
              {__("Back", "beyondseo")}
            </Button>
            <Button
              type={ButtonTypes.primary}
              size={ButtonSizes.medium}
              onClick={handleSubmit}
              disabled={!commOptIn || isLoading}
              isLoading={isLoading}
              aria-busy={isLoading}
            >
              {__("Activate", "beyondseo")}
            </Button>
          </>
        )}

        {view === "error" && (
          <Button
            type={ButtonTypes.secondary}
            size={ButtonSizes.medium}
            iconLeft={IconNames.arrowLeft}
            onClick={() => setView(previousView)}
            className={styles.backButton}
          >
            {__("Back", "beyondseo")}
          </Button>
        )}

        {view === "success" && (
          <Button
            type={ButtonTypes.primary}
            size={ButtonSizes.medium}
            onClick={() => {
              window.location.href = ONBOARDING_URL;
            }}
          >
            {__("Continue onboarding", "beyondseo")}
          </Button>
        )}

        {view === "recover" && (
          <>
            <Button
              type={ButtonTypes.secondary}
              size={ButtonSizes.medium}
              iconLeft={IconNames.arrowLeft}
              onClick={() => setView("form")}
              className={styles.backButton}
              disabled={isRecovering}
            >
              {__("Back", "beyondseo")}
            </Button>
            <Button
              type={ButtonTypes.primary}
              size={ButtonSizes.medium}
              onClick={handleRecoverSubmit}
              disabled={isRecovering || recoverEmail.trim() === ""}
              isLoading={isRecovering}
              aria-busy={isRecovering}
            >
              {__("Send recovery email", "beyondseo")}
            </Button>
          </>
        )}

        {view === "recoverSuccess" && (
          <Button type={ButtonTypes.primary} size={ButtonSizes.medium} onClick={() => setView("form")}>
            {__("Enter activation code", "beyondseo")}
          </Button>
        )}
      </div>
    </ComponentContainer>
  );
};
