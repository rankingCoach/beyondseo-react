import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./OnboardingStep.module.scss";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  IconNames,
  IconSize,
  Popover,
  SlideTransition,
  Text,
  Textarea,
  TextTypes,
  VanguardStyle,
} from "vanguard";
import { LoadingStatusBadge } from "@components/Common/LoadingStatusBadge/LoadingStatusBadge";
import { ErrorModal } from "@components/Common/ErrorModal/ErrorModal";
import { __ } from "@wordpress/i18n";

export interface OnboardingStepProps {
  texts: string[];
  subtitle?: string;
  loadingTexts?: string[];
  onSubmit: (value: string) => Promise<void>;
  showLoadingBadge?: boolean;
}

export const OnboardingStep: React.FC<OnboardingStepProps> = ({
  texts,
  subtitle,
  loadingTexts = [],
  onSubmit,
  showLoadingBadge = false,
}) => {
  const [textareaValue, setTextareaValue] = useState<string>("");
  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const TEXT_FADE_ANIMATION_DURATION = 150;
  const TEXT_WELCOME_ANIMATION_WAIT_BETWEEN_COMPONENTS = 1000;
  const TEXT_WELCOME_ANIMATION_ANIMATION_DURATION = 250;
  const MAX_CHARS = 255;
  const CHAR_LIMIT_MESSAGE = __("Message cannot exceed 255 characters", "beyondseo");
  const INVALID_TEXT_MESSAGE = __("Text contains URL or is missing a space after a period (.)", "beyondseo");

  const hasInvalidDotPattern = (text: string): boolean => {
    const urlPattern = /[a-zA-Z0-9]{2,}\.[a-zA-Z0-9]{2,}/;
    return urlPattern.test(text);
  };

  const isFormValid = () => {
    const validLength = textareaValue.length <= MAX_CHARS && textareaValue.trim().length > 0;
    return validLength && !hasInvalidDotPattern(textareaValue);
  };

  const getErrorMessage = (): string | undefined => {
    if (!isFormValid()) {
      if (textareaValue.length > MAX_CHARS) {
        return CHAR_LIMIT_MESSAGE;
      }
      if (hasInvalidDotPattern(textareaValue)) {
        return INVALID_TEXT_MESSAGE;
      }
    }
    return undefined;
  };

  useEffect(() => {
    setShowSubtitle(false);
    if (subtitle) {
      const totalTitleDuration =
        TEXT_WELCOME_ANIMATION_WAIT_BETWEEN_COMPONENTS * (texts.length - 1) + TEXT_WELCOME_ANIMATION_ANIMATION_DURATION;

      const timer = setTimeout(() => {
        setShowSubtitle(true);
      }, totalTitleDuration);

      return () => clearTimeout(timer);
    }
  }, [texts, subtitle]);

  const handleSubmit = async () => {
    if (isButtonLoading || !isFormValid()) return;
    setIsButtonLoading(true);

    try {
      await onSubmit(textareaValue);
      setTextareaValue("");
    } catch (error) {
      setShowErrorModal(true);
    } finally {
      setIsButtonLoading(false);
    }
  };

  const handleSendClick = () => {
    if (!isFormValid()) return;
    handleSubmit();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isFormValid()) {
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    if (!showLoadingBadge) {
      setIsButtonLoading(false);
    }
  }, [showLoadingBadge]);

  const formValid = isFormValid();

  return (
    <>
      <ComponentContainer className={classNames(styles.sliderComponent)}>
        <div
          className={classNames(
            VanguardStyle.dFlex,
            VanguardStyle.alignItemsCenter,
            VanguardStyle.justifyContentCenter,
            VanguardStyle.dFlexColumn,
          )}
        >
          <SlideTransition
            waitBetweenComponents={TEXT_WELCOME_ANIMATION_WAIT_BETWEEN_COMPONENTS}
            duration={TEXT_WELCOME_ANIMATION_ANIMATION_DURATION}
          >
            {texts.map((txt) => (
              <Text
                className={styles.sliderText}
                key={txt}
                type={TextTypes.heading3}
                color={"white"}
                fontWeight={FontWeights.bold}
                textAlign="center"
                animateWords={{
                  animation: "fade-up",
                  duration: TEXT_FADE_ANIMATION_DURATION,
                  delay: 30,
                }}
              >
                {txt}
              </Text>
            ))}
          </SlideTransition>

          {subtitle && (
            <Text
              className={styles.subtitle}
              color={"white"}
              type={TextTypes.heading4}
              fontWeight={FontWeights.regular}
              textAlign="center"
              animateWords={{
                animation: "fade-up",
                duration: TEXT_FADE_ANIMATION_DURATION,
                delay: 30,
              }}
            >
              {subtitle}
            </Text>
          )}
        </div>
      </ComponentContainer>

      {showLoadingBadge && (
        <ComponentContainer className={classNames(styles.loadingBadgeWrapper)}>
          <LoadingStatusBadge loading={showLoadingBadge} texts={loadingTexts} />
        </ComponentContainer>
      )}

      <ComponentContainer className={classNames(styles.textareaWrapper, styles.fadeIn)}>
        <Textarea
          autoFocus={true}
          required={true}
          counter={true}
          maxLength={MAX_CHARS}
          placeholder={__("Write here to communicate", "beyondseo")}
          className={classNames(styles.textareatransparent, styles.noBoxShadow)}
          value={textareaValue}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setTextareaValue(e.target.value)}
          onKeyDown={handleKeyDown}
          endAdornment={
            <Popover position={"right"} message={getErrorMessage()}>
              <span
                className={!formValid ? styles.sendButtonWrapperNonInteractive : undefined}
                aria-disabled={!formValid}
              >
                <Button
                  type={ButtonTypes.default}
                  iconRight={IconNames.send}
                  size={ButtonSizes.medium}
                  iconSize={IconSize.large}
                  iconColor="--n500"
                  isLoading={isButtonLoading}
                  onClick={handleSendClick}
                  tabIndex={formValid ? 0 : -1}
                  className={!formValid ? styles.sendButtonNonInteractive : undefined}
                />
              </span>
            </Popover>
          }
        />
      </ComponentContainer>

      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        errorMessage={__("Something went wrong from our side, please try again!", "beyondseo")}
      />
    </>
  );
};
