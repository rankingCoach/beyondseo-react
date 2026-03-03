import * as React from "react";
import { useEffect, useRef, useState } from "react";
import styles from "./OnboardingWelcome.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  IconNames,
  Link,
  Render,
  SlideTransition,
  Text,
  TextTypes,
  Skeleton,
} from "vanguard";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { OnboardingStore } from "@stores/swagger/api/OnboardingStore";
import { OnboardingStep } from "../OnboardingSteps/OnboardingStep";
import { WPFlowStep } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Steps/WPFlowStep";
import { WPFlowDataCompletionObjectType } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Setup/Entities/Flows/Completions/WPFlowDataCompletion";
import { OnboardingSummary } from "../OnboardingSummary/OnboardingSummary";
import { AIOrb, AIOrbSize, AIOrbStatus } from "@components/Common/AIOrb/AIOrb";
import StripeGradientBackgroundAnimation from "@components/Common/StripeGradientBackgroundAnimation/StripeGradientBackgroundAnimation";
import { ErrorModal } from "@components/Common/ErrorModal/ErrorModal";
import { __ } from "@wordpress/i18n";
import { OnboardingPlaceholder } from "../OnboardingPlaceholder";
import whiteLoadingAnimation from "@assets/white-loading-animation.gif";
import { LoadingStatusBadge } from "@components/Common/LoadingStatusBadge/LoadingStatusBadge";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";

interface OnboardingWelcomeProps {
  isCompleted?: boolean;
  currentStep?: WPFlowStep;
  skipWelcomeScreen?: boolean;
}

export const ANIMATION_SPEED_MODIFIER = 1;
export const WELCOME_TEXTS = [
  __("Hey there, I`m your assistant.", "beyondseo"),
  __("I`m here to make SEO simple and effective for your website.", "beyondseo"),
  __("Ready to dive in?", "beyondseo"),
];
export const TEXT_FADE_ANIMATION_DURATION = 150 * ANIMATION_SPEED_MODIFIER;
export const TEXT_WELCOME_ANIMATION_WAIT_BETWEEN_COMPONENTS = 4000 * ANIMATION_SPEED_MODIFIER;
export const TEXT_WELCOME_ANIMATION_ANIMATION_DURATION = 250 * ANIMATION_SPEED_MODIFIER;
export const TEXT_THANK_YOU_ANIMATION_WAIT_BETWEEN_COMPONENTS = 500 * ANIMATION_SPEED_MODIFIER;
export const TEXT_THANK_YOU_ANIMATION_DURATION = 250 * ANIMATION_SPEED_MODIFIER;
export const THANK_YOU_TEXTS = [__("Please wait, I’m setting this up now. We’ll continue in just a few minutes.", "beyondseo")];
export const THANK_YOU_TEXTS_SUBTITLE = [
  __("After I`ll open Wordpress, and we can continue on optimising your website and content from there.", "beyondseo"),
];
export const MIN_THANK_YOU_DISPLAY_TIME = 8000; // Minimum 8 seconds on thank you page

export const THANK_YOU_LOADING_TEXTS = [
  __("Connecting WordPress integration", "beyondseo"),
  __("Adding project name", "beyondseo"),
  __("Saving project contact details", "beyondseo"),
  __("Setting project type", "beyondseo"),
  __("Adding project address", "beyondseo"),
  __("Connecting project website", "beyondseo"),
  __("Defining local service areas", "beyondseo"),
  __("Adding weekday hours", "beyondseo"),
  __("Adding weekend hours", "beyondseo"),
  __("Setting primary category", "beyondseo"),
  __("Adding secondary categories", "beyondseo"),
  __("Adding primary keywords", "beyondseo"),
  __("Adding additional keywords", "beyondseo"),
  __("Adding competitors", "beyondseo"),
  __("Setting up main goal", "beyondseo"),
  __("Setting up secondary goal", "beyondseo"),
  __("Adding short description", "beyondseo"),
  __("Adding long description", "beyondseo"),
  __("Searching listings", "beyondseo"),
  __("Getting status of listings", "beyondseo"),
  __("Checking connections", "beyondseo"),
  __("Finalising project fine tuning", "beyondseo"),
];

const LOADING_TEXTS = {
  1: [__("Analyzing details", "beyondseo"), __("Processing input", "beyondseo")],
  2: [__("Checking name", "beyondseo"), __("Verifying availability", "beyondseo")],
  3: [__("Reviewing details", "beyondseo"), __("Understanding scope", "beyondseo")],
  4: [__("Locating business", "beyondseo"), __("Validating area", "beyondseo")],
  5: [__("Determining focus", "beyondseo"), __("Mapping region", "beyondseo")],
  6: [__("Highlighting features", "beyondseo"), __("Finding uniqueness", "beyondseo")],
};

const getLoadingTextsForStep = (stepId: number) => {
  let defaultText = __("Processing your input", "beyondseo");
  if (!stepId || typeof stepId !== "number") {
    return [defaultText];
  }
  let stepText = LOADING_TEXTS[stepId as keyof typeof LOADING_TEXTS];
  return stepText.map((txt) => __(txt, "beyondseo")) || [defaultText];
};

export const OnboardingWelcome = ({ isCompleted, currentStep, skipWelcomeScreen }: OnboardingWelcomeProps) => {
  const { onboardingSteps, isGeneratingOnboardingSteps } = useSelector((state: RootState) => state.app);

  const dispatch = useAppDispatch();
  const [step, setStep] = useState(isCompleted ? 8 : 1);
  const [showLoadingBadge, setShowLoadingBadge] = useState<boolean>(false);
  const [isOnboardingStarted, setIsOnboardingStarted] = useState(!!isCompleted || !!skipWelcomeScreen);
  const [showOnboardingStep, setShowOnboardingStep] = useState(!!isCompleted);
  const [currentStepContent, setCurrentStepContent] = useState({
    texts: [__("Let`s get started!", "beyondseo")],
    loadingTexts: [""],
  });
  const [currentIncompleteStep, setCurrentIncompleteStep] = useState<WPFlowStep | null>(null);
  const [websiteDescription, setWebsiteDescription] = useState("");
  const [showThankYouScreen, setShowThankYouScreen] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [thankYouTextRendered, setThankYouTextRendered] = useState(false);
  const thankYouStartTimeRef = useRef<number | null>(null);

  const currentStepIndex = step - 2;
  const isFinalStep = step === 8;

  useEffect(() => {
    if (currentStep) {
      const stepLoadingTexts = getLoadingTextsForStep(currentStep.id || 1);
      setCurrentIncompleteStep(currentStep);
      setCurrentStepContent({
        texts: [
          currentStep.questions?.elements?.[0]?.question || __("Provide details to continue", "beyondseo"),
          currentStep.currentQuestion?.question || __("Provide details to continue", "beyondseo"),
        ],
        loadingTexts: stepLoadingTexts,
      });
    }
  }, [currentStep]);

  useEffect(() => {
    if (isCompleted) {
      setStep(8);
      setShowOnboardingStep(true);
      setIsOnboardingStarted(true);
    } else if (skipWelcomeScreen) {
      setIsOnboardingStarted(true);
      if (!onboardingSteps) {
        const queryParams: any = { noCache: true, debug: true };
        if (skipWelcomeScreen) {
          queryParams.skipWelcomeScreen = 1;
        }
        dispatch(
          OnboardingStore.postApiOnboardingGenerateStepsThunk({
            requestBody: null,
            queryParams,
          }),
        ).catch(() => {
          setShowErrorModal(true);
        });
      } else {
        processOnboardingSteps(onboardingSteps);
      }
    } else {
      if (!isOnboardingStarted && !onboardingSteps) {
        dispatch(
          OnboardingStore.postApiOnboardingGenerateStepsThunk({
            requestBody: null,
            queryParams: { noCache: true, debug: true },
          }),
        ).catch(() => {
          setShowErrorModal(true);
        });
      }
    }
  }, [dispatch, isCompleted, isOnboardingStarted, onboardingSteps, skipWelcomeScreen]);

  const handleStartClick = () => {
    setIsOnboardingStarted(true);
    if (!onboardingSteps) {
      dispatch(
        OnboardingStore.postApiOnboardingGenerateStepsThunk({
          requestBody: null,
          queryParams: { noCache: true, debug: true },
        }),
      ).catch(() => {
        setIsOnboardingStarted(false);
        setShowErrorModal(true);
      });
    } else {
      processOnboardingSteps(onboardingSteps);
    }
  };

  const processOnboardingSteps = (steps: any) => {
    if (steps?.steps?.elements) {
      const finalStep = steps.steps.elements.find(
        (element: any) => element.isFinalStep === true && element.completed === true,
      );
      if (finalStep) {
        setStep(8);
        setShowOnboardingStep(true);
      } else {
        const firstIncompleteStep = steps.steps.elements.find((element: any) => element.completed === false);
        if (firstIncompleteStep) {
          const stepLoadingTexts = getLoadingTextsForStep(firstIncompleteStep.id || 1);
          setCurrentIncompleteStep(firstIncompleteStep);
          setCurrentStepContent({
            texts: [
              firstIncompleteStep.questions?.elements?.[0]?.question ||
                __("Provide details to continue", "beyondseo"),
              firstIncompleteStep.currentQuestion?.question || __("Provide details to continue", "beyondseo"),
            ],
            loadingTexts: stepLoadingTexts,
          });
          setShowOnboardingStep(true);
          setStep(2);
        }
      }
    }
  };

  useEffect(() => {
    if (onboardingSteps && isOnboardingStarted) {
      processOnboardingSteps(onboardingSteps);
    }
  }, [onboardingSteps, isOnboardingStarted]);

  const handleStepSubmit = async (value: string) => {
    setShowLoadingBadge(true);

    const stepLoadingTexts = getLoadingTextsForStep(currentIncompleteStep?.id || 1);
    setCurrentStepContent((prev) => ({
      ...prev,
      loadingTexts: stepLoadingTexts,
    }));

    try {
      const response = await dispatch(
        OnboardingStore.postApiOnboardingSubmitStepAnswerThunk({
          requestBody: {
            completion: {
              stepId: currentIncompleteStep?.id,
              questionId: currentIncompleteStep?.currentQuestion?.id,
              answer: value,
              objectType:
                WPFlowDataCompletionObjectType.BeyondSEO_Domain_Integrations_WordPress_Setup_Entities_Flows_Completions_WPFlowDataCompletion,
            },
          },
          queryParams: { noCache: true },
        }),
      ).unwrap();

      setShowLoadingBadge(false);

      if (response?.allStepsCompleted) {
        setStep(8);
        return;
      }

      if (response.step?.isFinalStep) {
        setStep(8);
        return;
      }

      if (response.nextStep) {
        const nextStepLoadingTexts = getLoadingTextsForStep(response.nextStep.id || 1);

        const elementQuestion = response.nextStep.questions?.elements?.[0]?.question;
        const currentQuestion = response.nextStep.currentQuestion?.question;

        const texts: string[] = [];
        if (elementQuestion) texts.push(__(elementQuestion, "beyondseo"));
        if (currentQuestion) texts.push(__(currentQuestion, "beyondseo"));

        setStep((prev) => prev + 1);
        setCurrentIncompleteStep(response.nextStep);
        setCurrentStepContent({
          texts: texts.length > 0 ? texts : [__("Please proceed with the next step", "beyondseo")],
          loadingTexts: nextStepLoadingTexts,
        });
      } else if (response.step) {
        if (response.step?.isFinalStep) {
          setStep(8);
          return;
        }
        const currentStepLoadingTexts = getLoadingTextsForStep(response.step.id || 1);
        setCurrentIncompleteStep(response.step);

        const elementQuestion = response.step.questions?.elements?.[0]?.question;
        const currentQuestion = response.step.currentQuestion?.question;

        const texts: string[] = [];
        if (elementQuestion) texts.push(__(elementQuestion, "beyondseo"));
        if (currentQuestion && currentQuestion !== elementQuestion) texts.push(__(currentQuestion, "beyondseo"));

        setCurrentStepContent({
          texts: texts.length > 0 ? texts : ["Please provide your input"],
          loadingTexts: currentStepLoadingTexts,
        });
      }
    } catch (error) {
      setShowLoadingBadge(false);
      throw error;
    }
  };

  const handleFinish = async (): Promise<void> => {
    try {
      setShowOnboardingStep(false);
      setShowThankYouScreen(true);
      thankYouStartTimeRef.current = Date.now();

      const response = await dispatch(
        OnboardingStore.postApiOnboardingSubmitOnboardingThunk({
          requestBody: null,
          // @ts-ignore
          queryParams: { noCache: true, debug: 1 },
        }),
      ).unwrap();

      const timeElapsed = Date.now() - (thankYouStartTimeRef.current || 0);
      const remainingTime = Math.max(0, MIN_THANK_YOU_DISPLAY_TIME - timeElapsed);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      window.location.href = `${(window as any).rankingCoachReactData?.adminurl || 'admin.php'}?page=rankingcoach-main`;
      //window.location.href = `${(window as any).rankingCoachReactData?.adminurl || 'admin.php'}?page=rankingcoach-main&firstTime=1`;
      //window.location.href = "/wp-admin/index.php";
    } catch (error: any) {
      setShowThankYouScreen(false);
      setShowOnboardingStep(true);
      setStep(8);

      setErrorMessage(error?.message || __("An unexpected error occurred", "beyondseo"));
      setShowErrorModal(true);
    }
  };

  const handleCancel = () => {
    window.location.href = (window as any).rankingCoachReactData?.adminurl?.replace('admin.php', '') || "index.php";
  };

  const containerClass = classNames(
    styles.onboardingWelcomeContainer,
    showOnboardingStep || showThankYouScreen ? styles.step2 : "",
    isFinalStep && !showThankYouScreen ? styles.finalStep : "",
  );

  useEffect(() => {
    if (showThankYouScreen) {
      const totalTextAnimationTime =
        TEXT_THANK_YOU_ANIMATION_WAIT_BETWEEN_COMPONENTS +
        TEXT_THANK_YOU_ANIMATION_DURATION * THANK_YOU_TEXTS.length +
        1000;

      // Set timer to show loading animation after text animation is likely complete
      const timer = setTimeout(() => {
        setThankYouTextRendered(true);
      }, totalTextAnimationTime);

      // Clean up timer on component unmount
      return () => clearTimeout(timer);
    }
  }, [showThankYouScreen]);

  return (
    <ComponentContainer className={containerClass}>
      <Render if={isOnboardingStarted || showThankYouScreen}>
        <StripeGradientBackgroundAnimation />
      </Render>

      {!showThankYouScreen && step !== 1 && !isFinalStep && (
        <Link color="white" className={styles.topRightLink} onClick={() => setStep(8)}>
          {__("Skip to manual input", "beyondseo")}
        </Link>
      )}

      <AIOrb
        state={AIOrbStatus.Waiting}
        fullScreen={false}
        size={AIOrbSize.Small}
        className={classNames(!isOnboardingStarted ? styles.loaderComponent : styles.hidden)}
      />

      <Render if={!isOnboardingStarted && !showThankYouScreen}>
        <SlideTransition
          key="step1"
          waitBetweenComponents={TEXT_WELCOME_ANIMATION_WAIT_BETWEEN_COMPONENTS}
          duration={TEXT_WELCOME_ANIMATION_ANIMATION_DURATION}
        >
          {WELCOME_TEXTS.map((txt) => (
            <Text
              className={styles.sliderTextStep1}
              key={__(txt, "beyondseo")}
              type={TextTypes.heading2}
              fontWeight={FontWeights.bold}
              textAlign="center"
              animateWords={{
                animation: "fade-up",
                duration: TEXT_FADE_ANIMATION_DURATION,
                delay: 30,
              }}
            >
              {__(txt, "beyondseo")}
            </Text>
          ))}
        </SlideTransition>

        <div className={classNames(styles.buttonComponent, styles.fadeInButton)}>
          <Button
            type={ButtonTypes.primary}
            size={ButtonSizes.large}
            iconRight={IconNames.arrowRight}
            onClick={handleStartClick}
          >
            {__("Start", "beyondseo")}
          </Button>
        </div>
      </Render>

      {showOnboardingStep && !isFinalStep && currentStepIndex >= 0 && !showThankYouScreen && (
        <OnboardingStep {...currentStepContent} onSubmit={handleStepSubmit} showLoadingBadge={showLoadingBadge} />
      )}

      {isFinalStep && !showThankYouScreen && (
        <OnboardingSummary
          onFinish={handleFinish}
          onCancel={handleCancel}
          websiteDescription={websiteDescription}
          onDescriptionChange={setWebsiteDescription}
        />
      )}

      {showThankYouScreen && (
        <ComponentContainer className={classNames(styles.sliderComponent, styles.thankYouContainer)}>
          {thankYouTextRendered && (
            <img
              src={whiteLoadingAnimation}
              alt={__("Loading...", "beyondseo")}
              className={classNames(styles.loadingAnimation, styles.fadeIn)}
            />
          )}
          <SlideTransition
            key="thank-you"
            waitBetweenComponents={TEXT_THANK_YOU_ANIMATION_WAIT_BETWEEN_COMPONENTS}
            duration={TEXT_THANK_YOU_ANIMATION_DURATION}
          >
            {THANK_YOU_TEXTS.map((txt) => (
              <Text
                className={styles.sliderTextStep2}
                key={__(txt, "beyondseo")}
                type={TextTypes.heading2}
                fontWeight={FontWeights.bold}
                textAlign="center"
                color="white"
                animateWords={{
                  animation: "fade-up",
                  duration: TEXT_FADE_ANIMATION_DURATION,
                  delay: 30,
                }}
              >
                {__(txt, "beyondseo")}
              </Text>
            ))}
          </SlideTransition>

          <div className={styles.loadingStatusWrapper}>
            <LoadingStatusBadge
              loading={true}
              texts={THANK_YOU_LOADING_TEXTS.map((text) => __(text, "beyondseo"))}
              intervalDuration={10000}
            />
          </div>
        </ComponentContainer>
      )}

      <ComponentContainer className={classNames(styles.cancelComponent)}>
        {step === 1 && !showThankYouScreen && (
          <Link color="black" className={styles.cancelLink} onClick={() => (window.location.href = "/wp-admin")}>
            {__("Cancel", "beyondseo")}
          </Link>
        )}
      </ComponentContainer>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={errorMessage || __("Something went wrong from our side, please try again!", "beyondseo")}
      />
    </ComponentContainer>
  );
};
