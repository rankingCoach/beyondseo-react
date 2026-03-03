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

      if(initialSettings?.allow_auto_onboarding) {
        // CRITICAL: Call extractAuto FIRST and wait for it to complete
        // This ensures auto-extraction data is available before generating steps
        await dispatch(
          OnboardingStore.postApiOnboardingExtractAutoThunk({
            requestBody: null,
            queryParams: { noCache: true, debug: true },
          }),
        );
      }

      // THEN call generateSteps after extractAuto completes
      const response = await dispatch(
        OnboardingStore.postApiOnboardingGenerateStepsThunk({
          requestBody: null,
          queryParams,
        }),
      ).unwrap();

      if (response?.steps?.elements) {
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
    if(initialSettings?.allow_auto_onboarding) {
      return <OnboardingPreloader />;
    }
    return <OnboardingPlaceholder />;
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
