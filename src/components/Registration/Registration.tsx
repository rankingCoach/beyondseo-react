import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Registration.module.scss";
import { Button, ButtonSizes, ButtonTypes, ComponentContainer, IconNames, Input, Text, TextTypes, FontWeights, TextIcon, Select, Link, CheckBox } from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { ErrorModal } from "@components/Common/ErrorModal/ErrorModal";
import { __ } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";
import emailVerifySvg from "@assets/validate-email-illustration.svg";
import { seoStore, SeoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";

const STORAGE_KEYS = {
  EMAIL: "registrationEmail",
  COUNTRY: "registrationCountry",
  POLL_TOKEN: "registrationPollToken",
  ACCOUNT_STATUS: "registrationAccountStatus",
  REGISTRATION_STATUS: "registrationRegistrationStatus",
};

const ONBOARDING_URL = `${(window as any).rankingCoachReactData?.adminurl || 'admin.php'}?page=rankingcoach-onboarding&skipWelcomeScreen=1`;
const POLLING_INTERVAL = 5000;
const VERIFICATION_TIME_WINDOW = 60;


interface RegistrationProps {
  isPluginLoading?: boolean;
}

export const Registration: React.FC<RegistrationProps> = ({ isPluginLoading }) => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(Boolean(isPluginLoading));
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [country, setCountry] = useState(() => sessionStorage.getItem(STORAGE_KEYS.COUNTRY) || "DE");
  const [isVerificationPhase, setIsVerificationPhase] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [pollToken, setPollToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.POLL_TOKEN) || null);
  const [accountStatus, setAccountStatus] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.ACCOUNT_STATUS) || null);
  const [registrationStatus, setRegistrationStatus] = useState<string | null>(() => localStorage.getItem(STORAGE_KEYS.REGISTRATION_STATUS) || null); // "new_account" or "existing_account" from register response
  const [termsAccepted, setTermsAccepted] = useState(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTokenRef = useRef<string | null>(null);
  const accountStatusRef = useRef<string | null>(null);
  const registrationStatusRef = useRef<string | null>(null);
  const finalizingRef = useRef<boolean>(false);
  const { plugin } = useSelector((state: RootState) => state.app);
  const adminEmail = plugin?.pluginData?.website?.settings?.adminEmail || "";
  const allowedCountries = plugin?.pluginData?.website?.settings?.allowedCountries || {};
  const [email, setEmail] = useState(() => localStorage.getItem(STORAGE_KEYS.EMAIL) || adminEmail);

  useEffect(() => {
    pollTokenRef.current = pollToken;
    accountStatusRef.current = accountStatus;
    registrationStatusRef.current = registrationStatus;
  }, [pollToken, accountStatus, registrationStatus]);

  const isWithinTimeWindow = useCallback((timestamp: number, windowSeconds: number = VERIFICATION_TIME_WINDOW): boolean => {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return (currentTimestamp - timestamp) <= windowSeconds;
  }, []);

  const shouldFinalizeRegistration = useCallback((
    registrationStatus: string | null,
    verificationSetting: any
  ): boolean => {
    if (registrationStatus === "new_account") {
      return verificationSetting?.emailValidated
        && verificationSetting?.validatedAt
        && isWithinTimeWindow(verificationSetting.validatedAt);
    } else if (registrationStatus === "existing_account") {
      return verificationSetting?.accountClaimed
        && verificationSetting?.claimedAt
        && isWithinTimeWindow(verificationSetting.claimedAt);
    }
    return false;
  }, [isWithinTimeWindow]);
  const clearLocalStorageVerification = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.POLL_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT_STATUS);
    localStorage.removeItem(STORAGE_KEYS.REGISTRATION_STATUS);
    localStorage.removeItem(STORAGE_KEYS.EMAIL);
  }, []);

  const loadInitialState = useCallback(async () => {
    const savedPollToken = localStorage.getItem(STORAGE_KEYS.POLL_TOKEN);
    const savedAccountStatus = localStorage.getItem(STORAGE_KEYS.ACCOUNT_STATUS);
    const savedRegistrationStatus = localStorage.getItem(STORAGE_KEYS.REGISTRATION_STATUS);
    const savedEmail = localStorage.getItem(STORAGE_KEYS.EMAIL);

    if (savedPollToken && savedAccountStatus && savedRegistrationStatus && savedEmail) {
      try {
        const result = await dispatch(
          SeoStore.getRankingcoachSeoAccountVerificationStatusThunk({
            pollToken: savedPollToken,
            status: savedAccountStatus,
          } as any)
        ).unwrap();

        if (!result) {
          clearLocalStorageVerification();
          return;
        }

        // Update poll token if changed
        if (result.pollToken && result.pollToken !== savedPollToken) {
          localStorage.setItem(STORAGE_KEYS.POLL_TOKEN, result.pollToken);
          setPollToken(result.pollToken);
        }

        // Check if verification is complete
        if (result.emailChecked) {
          const verificationSetting = result.verificationStatusSetting;
          if (shouldFinalizeRegistration(savedRegistrationStatus, verificationSetting)) {
            await finalizeRegistration(result.pollToken || savedPollToken);
            return;
          }
        }

        // Resume verification phase
        setIsVerificationPhase(true);
      } catch (error) {
        console.error("[REGISTRATION] Error loading initial state:", error);
        clearLocalStorageVerification();
      }
    }
  }, [dispatch, shouldFinalizeRegistration, clearLocalStorageVerification]);
  const finalizeRegistration = useCallback(async (pollToken: string): Promise<boolean> => {
    if (finalizingRef.current) {
      console.log('[REGISTRATION] Finalization already in progress, skipping');
      return false;
    }

    finalizingRef.current = true;
    setIsButtonLoading(true);
    stopPolling();

    try {
      const finalizeResult = await dispatch(
        SeoStore.postRankingcoachSeoAccountFinalizeRegisterThunk({
          requestBody: null,
          queryParams: {
            email: email.trim(),
            country: country,
            type: "direct",
            pollToken,
          } as any,
        })
      ).unwrap();

      if (!finalizeResult || (!finalizeResult.ok && !finalizeResult.success)) {
        console.error("[REGISTRATION] Finalize registration failed - invalid response:", finalizeResult);
        setShowErrorModal(true);
        setIsButtonLoading(false);
        return false;
      }

      clearLocalStorageVerification();
      window.location.href = ONBOARDING_URL;
      return true;
    } catch (error) {
      console.error("[REGISTRATION] Finalize registration error:", error);
      setShowErrorModal(true);
      setIsButtonLoading(false);
      return false;
    } finally {
      finalizingRef.current = false;
    }
  }, [dispatch, email, country, clearLocalStorageVerification]);

  useEffect(() => {
    setIsLoading(Boolean(isPluginLoading));
  }, [isPluginLoading]);

  useEffect(() => {
    if (!isPluginLoading) {
      loadInitialState();
    }
  }, [isPluginLoading, loadInitialState]);

  // Cleanup polling interval on unmount or when verification phase ends
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVerificationPhase && pollToken && accountStatus) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [isVerificationPhase]);

  const stopPolling = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
      setIsPolling(false);
      console.log("[REGISTRATION] Polling stopped");
    }
  };

  const checkVerificationStatus = async () => {
    const currentPollToken = pollTokenRef.current;
    const currentAccountStatus = accountStatusRef.current;
    const currentRegistrationStatus = registrationStatusRef.current;

    if (!currentPollToken || !currentAccountStatus) {
      console.error("[REGISTRATION] Missing pollToken or status for verification check");
      return;
    }

    try {
      console.log("[REGISTRATION] Checking verification status with pollToken:", currentPollToken);

      const result = await dispatch(
        SeoStore.getRankingcoachSeoAccountVerificationStatusThunk({
          pollToken: currentPollToken,
          status: currentAccountStatus,
        } as any)
      ).unwrap();

      console.log("[REGISTRATION] Verification status result:", result);

      if (!result) {
        console.error("[REGISTRATION] Invalid verification status response");
        stopPolling();
        setShowErrorModal(true);
        return;
      }

      if (result.pollToken && result.pollToken !== currentPollToken) {
        console.log("[REGISTRATION] Updating pollToken:", result.pollToken);
        setPollToken(result.pollToken);
        localStorage.setItem(STORAGE_KEYS.POLL_TOKEN, result.pollToken);
      }

      if (result.emailChecked) {
        const verificationSetting = result.verificationStatusSetting;

        if (shouldFinalizeRegistration(currentRegistrationStatus, verificationSetting)) {
          console.log("[REGISTRATION] All conditions met! Attempting finalize registration...");
          await finalizeRegistration(result.pollToken || currentPollToken);
        }
      }
    } catch (error) {
      console.error("[REGISTRATION] Verification status check error:", error);
      stopPolling();
      setShowErrorModal(true);
    }
  };

  const startPolling = () => {
    stopPolling();
    setIsPolling(true);
    checkVerificationStatus();

    pollingIntervalRef.current = setInterval(() => {
      checkVerificationStatus();
    }, POLLING_INTERVAL);
  };

  const handleEmailChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    // sessionStorage.setItem(STORAGE_KEYS.EMAIL, newEmail); // Not used for now
  }, []);

  const handleCountryChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry(newCountry);
    sessionStorage.setItem(STORAGE_KEYS.COUNTRY, newCountry);
  }, []);

  const handleTermsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked);
  }, []);

  const handleNext = async () => {
    if (termsAccepted) {
      try {
        await seoStore
          .postRankingcoachSeoSettings({
            settings: { beyondseo_comm_opt_in: true },
          } as any)
          .toPromise();
      } catch (_) {}
    }

    if (isVerificationPhase) {
      await handleVerify();
    } else {
      await handleRegister();
    }
  };

  const handleRegister = async () => {
    if (!email.trim()) {
      return;
    }

    setIsButtonLoading(true);

    try {
      const result = await dispatch(
        SeoStore.postRankingcoachSeoAccountRegisterThunk({
          requestBody: null,
          queryParams: {
            email: email.trim(),
            country: country,
            type: "direct",
            marketingConsent: true,
          } as any,
        })
      ).unwrap();

      if (!result || !result.pollToken || !result.status) {
        console.error("[REGISTRATION] Invalid registration response:", result);
        setShowErrorModal(true);
        setIsButtonLoading(false);
        return;
      }

      setPollToken(result.pollToken);
      setRegistrationStatus(result.status);
      console.log("[REGISTRATION] Stored registration status (new_account/existing_account):", result.status);
      setAccountStatus(result.status);

      // Save to localStorage
      localStorage.setItem(STORAGE_KEYS.POLL_TOKEN, result.pollToken);
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_STATUS, result.status);
      localStorage.setItem(STORAGE_KEYS.REGISTRATION_STATUS, result.status);
      localStorage.setItem(STORAGE_KEYS.EMAIL, email.trim());

      setIsVerificationPhase(true);
    } catch (error) {
      console.error("[REGISTRATION] Error:", error);
      setShowErrorModal(true);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleRegistrationReset = () => {
    stopPolling();
    setIsButtonLoading(false);
    setPollToken(null);
    setAccountStatus(null);
    setRegistrationStatus(null);
    setIsVerificationPhase(false);
    clearLocalStorageVerification();
  };

  const handleVerify = async () => {
    if (!pollToken || !accountStatus) {
      console.error("[REGISTRATION] Missing pollToken or status for manual verification");
      return;
    }

    setIsButtonLoading(true);

    try {

      const result = await dispatch(
        SeoStore.getRankingcoachSeoAccountVerificationStatusThunk({
          pollToken,
          status: accountStatus,
        } as any)
      ).unwrap();

      if (!result) {
        console.error("[REGISTRATION] Invalid manual verification response");
        setShowErrorModal(true);
        setIsButtonLoading(false);
        return;
      }

      if (result.pollToken && result.pollToken !== pollToken) {
        setPollToken(result.pollToken);
        localStorage.setItem(STORAGE_KEYS.POLL_TOKEN, result.pollToken);
      }

      if (result.emailChecked) {
        const verificationSetting = result.verificationStatusSetting;

        if (shouldFinalizeRegistration(registrationStatus, verificationSetting)) {
          const success = await finalizeRegistration(result.pollToken || pollToken);
          if (success) {
            return;
          }
        }
      }
    } catch (error) {
      console.error("[REGISTRATION] Manual verification error:", error);
      setShowErrorModal(true);
    } finally {
      setIsButtonLoading(false);
    }
  };

  // Populate country options from allowed_countries in plugin settings
  const countryOptions = React.useMemo(() => {
    if (allowedCountries && typeof allowedCountries === 'object' && Object.keys(allowedCountries).length > 0) {
      return Object.entries(allowedCountries).map(([code, name]) => ({
        key: code,
        value: code,
        title: String(name),
      }));
    }
    return [];
  }, [allowedCountries]);

  return (
    <ComponentContainer className={styles.registrationContainer}>
      {/* Header Section with Logo */}
      <div className={styles.headerSection}>
        <div className={styles.logo}>
          <img src={beyondSEOLogo} alt="Beyond SEO Logo" />
        </div>
      </div>

      {/* Top Horizontal Divider */}
      <div className={styles.topDivider} />

      {/* Main Content Area */}
      <div className={styles.registrationContent}>
        {!isVerificationPhase ? (
          <>
            <Text
              type={TextTypes.heading1}
              fontWeight={FontWeights.bold}
              className={styles.authTitle}
            >
              {__("Welcome to BeyondSEO", "beyondseo")}
            </Text>

            <Text
              type={TextTypes.text}
              className={styles.authDescription}
            >
              {__("Log in or create a new account to start using your SEO tools.", "beyondseo")}
            </Text>

            <ComponentContainer className={styles.featuresList}>
              <TextIcon icon={IconNames.check} iconColor="#4caf50" iconHasCircle={true} iconFillColor="#e9fbed" iconCircleSize={24}>
                {__("Optimize WordPress SEO", "beyondseo")}
              </TextIcon>
              <TextIcon icon={IconNames.check} iconColor="#4caf50" iconHasCircle={true} iconFillColor="#e9fbed" iconCircleSize={24}>
                {__("Manage local listings", "beyondseo")}
              </TextIcon>
              <TextIcon icon={IconNames.check} iconColor="#4caf50" iconHasCircle={true} iconFillColor="#e9fbed" iconCircleSize={24}>
                {__("Track keyword rankings", "beyondseo")}
              </TextIcon>
              <TextIcon icon={IconNames.check} iconColor="#4caf50" iconHasCircle={true} iconFillColor="#e9fbed" iconCircleSize={24}>
                {__("Start your personal online marketing agent", "beyondseo")}
              </TextIcon>
            </ComponentContainer>

            <Input
              label={__("Email", "beyondseo")}
              required={true}
              value={email}
              onChange={handleEmailChange}
              placeholder={__("Enter your email", "beyondseo")}
              type="email"
              className={styles.emailInput}
            />

            <Select
              label={__("Country", "beyondseo")}
              labelType="outer"
              required={true}
              value={country}
              onChange={handleCountryChange}
              options={countryOptions}
              className={styles.countrySelect}
            />

            <div className={styles.termsContainer}>
              <CheckBox
                checked={termsAccepted}
                onChange={handleTermsChange}
                label={
                  <span className={styles.termsText}>
                    {__("I agree that the BeyondSEO plugin may create/authenticate my account and communicate with rankingCoach servers to provide its services. I have read and accept the ", "beyondseo")}
                    <Link href="https://www.rankingcoach.com/en-us/privacy-policy" target="_blank" rel="noopener noreferrer">
                      {__("Privacy Policy", "beyondseo")}
                    </Link>
                    {__(" and the ", "beyondseo")}
                    <Link href="https://www.rankingcoach.com/en-us/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                      {__("Terms and Conditions", "beyondseo")}
                    </Link>.
                  </span>
                }
              />
            </div>
          </>
        ) : (
          <>
            <Text
              type={TextTypes.heading2}
              fontWeight={FontWeights.bold}
              className={styles.verifyTitle}
            >
              {registrationStatus === "existing_account"
                ? __("Claim your existing account", "beyondseo")
                : __("Verify your email", "beyondseo")}
            </Text>

            <img
              src={emailVerifySvg}
              alt="Email verification"
              className={styles.verifyImage}
            />

            <Text
              type={TextTypes.text}
              className={styles.verifyDescription}
            >
              {registrationStatus === "existing_account" ? (
                <>
                  {__("Follow the instructions in the email we've sent to ", "beyondseo")}
                  <strong>{email}</strong>
                  {__(" to claim your existing account.", "beyondseo")}
                </>
              ) : (
                <>
                  {__("Follow the instructions in the email we've sent to this address: ", "beyondseo")}
                  <strong>{email}</strong>
                  {__(". This helps keep your account secure.", "beyondseo")}
                </>
              )}
            </Text>
          </>
        )}
      </div>

      {/* Bottom Horizontal Divider */}
      <div className={styles.bottomDivider} />

      {/* Footer Section with Register Button */}
      <div className={styles.footerSection}>
        {isVerificationPhase && (
          <Button
            type={ButtonTypes.secondary}
            size={ButtonSizes.medium}
            onClick={handleRegistrationReset}
            className={styles.registrationResetButton}
          >
            {__("Change Email address", "beyondseo")}
          </Button>
        )}
        <Button
          type={ButtonTypes.primary}
          size={ButtonSizes.medium}
          iconRight={!isVerificationPhase ? IconNames.arrowRight : undefined}
          onClick={handleNext}
          disabled={isLoading || isButtonLoading || isPolling || (!isVerificationPhase && (!email.trim() || !termsAccepted))}
          isLoading={isButtonLoading || isPolling}
        >
          {isVerificationPhase ? __("Verify", "beyondseo") : __("Next", "beyondseo")}
        </Button>
      </div>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={__("Something went wrong from our side, please try again!", "beyondseo")}
        primaryButtonText={__("Try again", "beyondseo")}
        onPrimaryAction={() => {
          setShowErrorModal(false);
          handleRegistrationReset();
        }}
      />
    </ComponentContainer>
  );
};
