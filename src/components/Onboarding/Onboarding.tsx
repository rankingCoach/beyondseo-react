import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./Onboarding.module.scss";
import { ComponentContainer } from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { OnboardingStore } from "@stores/swagger/api/OnboardingStore";
import { WPFlowStep } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep";
import { OnboardingWelcome } from "./OnboardingWelcome/OnboardingWelcome";
import { ErrorModal } from "@components/Common/ErrorModal/ErrorModal";
import { OnboardingPlaceholder } from "./OnboardingPlaceholder";
import { OnboardingPreloader } from "./OnboardingPreloader";
import {__} from "@wordpress/i18n";
import {useSelector} from "react-redux";
import {RootState} from "@src/main.store";
import {WPPlugin} from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Plugin/Entities/WPPlugin";

interface OnboardingProps {
  isPluginLoading?: boolean;
}

interface WPSettingsPartial {
  allow_auto_onboarding?: boolean;
}

type SettingsKeys =
  | "allow_auto_onboarding"

export const Onboarding: React.FC<OnboardingProps> = ({ isPluginLoading }) => {
  const dispatch = useAppDispatch();
  const { plugin } = useSelector((state: RootState) => state.app);
  const pluginData: WPPlugin | undefined = plugin?.pluginData;
  const initialSettings = (pluginData?.settings || ({} as Partial<Record<SettingsKeys, boolean>>)) as WPSettingsPartial;
  const [isStepsLoading, setIsStepsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<WPFlowStep | null>(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [skipWelcomeScreen, setSkipWelcomeScreen] = useState(false);

  useEffect(() => {
    if (!isPluginLoading) {
      loadInitialState();
    }
  }, [isPluginLoading]);

  const checkHasExistingData = (elements?: Array<{ setupRequirement?: string; value?: any }>) => {
    if (!elements || !Array.isArray(elements)) return false;

    const keywordsReq = elements.find((req) => req.setupRequirement === "businessKeywords");
    const categoriesReq = elements.find((req) => req.setupRequirement === "businessCategories");

    const parseOrCheck = (val: any) => {
      if (!val || val === "[]" || val === "{}" || val === '""') return false;
      if (Array.isArray(val)) return val.length > 0;
      try {
        const parsed = typeof val === "string" ? JSON.parse(val) : val;
        return Array.isArray(parsed) ? parsed.length > 0 : Boolean(parsed);
      } catch {
        return Boolean(typeof val === "string" && val.trim() !== "");
      }
    };

    const hasKeywords = parseOrCheck(keywordsReq?.value);
    const hasCategories = parseOrCheck(categoriesReq?.value);

    return hasKeywords || hasCategories;
  };

  const loadInitialState = async () => {
    setIsStepsLoading(true);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const shouldSkipWelcome = urlParams.get('skipWelcomeScreen') === '1';
      setSkipWelcomeScreen(shouldSkipWelcome);

      const queryParams: any = { noCache: true, debug: true };
      if (shouldSkipWelcome) {
        queryParams.skipWelcomeScreen = 1;
      }

      let hasData = false;
      try {
        const reqResponse = await dispatch(
          OnboardingStore.getApiOnboardingRequirementsThunk({})
        ).unwrap();
        hasData = checkHasExistingData(reqResponse?.requirements?.elements);
      } catch {
      }

      if (!hasData) {
        await dispatch(
          OnboardingStore.postApiOnboardingExtractAutoThunk({
            requestBody: null,
            queryParams: { noCache: true, debug: true },
          }),
        );
      }

      const response = await dispatch(
        OnboardingStore.postApiOnboardingGenerateStepsThunk({
          requestBody: null,
          queryParams,
        }),
      ).unwrap();

      if (hasData) {
        setIsCompleted(true);
      } else if (response?.steps?.elements) {
        const finalStep = response.steps.elements.find(
          (element) => element.isFinalStep === true && element.completed === true,
        );
        if (finalStep) {
          setIsCompleted(true);
        }
      }
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setIsStepsLoading(false);
    }
  };

  if (isPluginLoading || isStepsLoading) {
    return <OnboardingPreloader />;
  }

  return (
    <ComponentContainer className={styles.onboardingContainer}>
      <OnboardingWelcome
        isCompleted={isCompleted}
        currentStep={currentStep ?? undefined}
        skipWelcomeScreen={skipWelcomeScreen}
      />
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={__("Something went wrong from our side, please try again!", "beyondseo")}
      />
    </ComponentContainer>
  );
};
