import * as React from "react";
import { __ } from "@wordpress/i18n";
import {
  Button,
  ButtonSizes,
  ButtonTypes,
  FontWeights,
  IconNames,
  IconSize,
  InfoBox,
  Render,
  Text,
  TextIcon,
  TextTypes,
} from "vanguard";
import { AdminPage, getAdminPageUrl } from "@helpers/internal-links";
import { isActivationCompleted, isOnboardingCompleted } from "@helpers/onboarding-helpers";
import { rcWindow } from "@stores/window.store";
import { StepLayout } from "../StepLayout";
import shared from "../SetupWizard.module.scss";
import styles from "./AccountStep.module.scss";

interface AccountStepProps {
  onBack: () => void;
  onFinish: () => void;
  /** Marks the wizard as completed, then navigates to the given admin page. */
  onConnect: (url: string) => void;
  isFinishing: boolean;
}

const getPluginItems = (): string[] => [
  __("Check titles, keywords and headings", "beyondseo"),
  __("Review page-specific SEO issues", "beyondseo"),
  __("Fix issues directly on your pages", "beyondseo"),
];

const getAccountItems = (): string[] => [
  __("Start tracking your own rankings, keywords & competitors", "beyondseo"),
  __("Finally see how visible you are on Google", "beyondseo"),
  __("Track how your performance improves over time", "beyondseo"),
  __("Compare your results with competitors", "beyondseo"),
  __("Monitor your reviews and online reputation", "beyondseo"),
];

export const AccountStep: React.FC<AccountStepProps> = ({ onBack, onFinish, onConnect, isFinishing }) => {
  const connected = isActivationCompleted() || isOnboardingCompleted();
  // IONOS and partner installs register with an activation code instead of an email address.
  const emailRegistration = rcWindow?.rankingCoachReactData?.registrationShowEmail !== "false";
  const connectUrl = getAdminPageUrl(emailRegistration ? AdminPage.Registration : AdminPage.Activation);

  return (
    <StepLayout
      footerStart={
        <Button
          type={ButtonTypes.secondary}
          size={ButtonSizes.medium}
          iconLeft={IconNames.arrowLeft}
          onClick={onBack}
          disabled={isFinishing}
        >
          {__("Back", "beyondseo")}
        </Button>
      }
      footerEnd={
        <Button
          type={ButtonTypes.primary}
          size={ButtonSizes.medium}
          onClick={onFinish}
          isLoading={isFinishing}
          disabled={isFinishing}
        >
          {__("Go to BeyondSEO settings", "beyondseo")}
        </Button>
      }
    >
      <div className={shared.intro}>
        <Text type={TextTypes.heading2} fontWeight={FontWeights.bold}>
          {__("Keep growing your visibility", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={shared.description}>
          {__(
            "BeyondSEO helps you find and fix page issues. A rankingCoach account adds ongoing visibility information about your online presence.",
            "beyondseo",
          )}
        </Text>
      </div>

      <Render if={connected}>
        <InfoBox
          type="info"
          borderRadius={8}
          title={__("Your rankingCoach account is connected", "beyondseo")}
          description={__("Rankings, competitors and reports are available from the BeyondSEO dashboard.", "beyondseo")}
        />
      </Render>

      <div className={styles.cards}>
        <div className={styles.pluginCard}>
          <Text type={TextTypes.heading4} fontWeight={FontWeights.bold}>
            {__("With BeyondSEO", "beyondseo")}
          </Text>
          <ul className={styles.list}>
            {getPluginItems().map((item) => (
              <li key={item}>
                <TextIcon
                  icon={IconNames.check}
                  iconColor="var(--s500)"
                  iconSize={IconSize.small}
                  textType={TextTypes.text}
                  verticalAlign="start"
                >
                  {item}
                </TextIcon>
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.accountCard}>
          <Text type={TextTypes.heading4} fontWeight={FontWeights.bold} color="var(--white)">
            {__("After activation", "beyondseo")}
          </Text>
          <ul className={styles.list}>
            {getAccountItems().map((item) => (
              <li key={item}>
                <TextIcon
                  icon={IconNames.check}
                  iconColor="var(--white)"
                  iconSize={IconSize.small}
                  textType={TextTypes.text}
                  textColor="var(--white)"
                  verticalAlign="start"
                >
                  {item}
                </TextIcon>
              </li>
            ))}
          </ul>
          <Render if={!connected}>
            <div className={styles.actions}>
              <Button
                type={ButtonTypes.secondary}
                size={ButtonSizes.medium}
                className={styles.connectButton}
                onClick={() => onConnect(connectUrl)}
                disabled={isFinishing}
              >
                {emailRegistration
                  ? __("Create your free account", "beyondseo")
                  : __("Enter your activation code", "beyondseo")}
              </Button>
              <Render if={emailRegistration}>
                <Button
                  type={ButtonTypes.default}
                  size={ButtonSizes.medium}
                  className={styles.loginButton}
                  onClick={() => onConnect(connectUrl)}
                  disabled={isFinishing}
                >
                  {__("I already have an account", "beyondseo")}
                </Button>
              </Render>
            </div>
          </Render>
        </div>
      </div>

      <Text type={TextTypes.textHelp} className={shared.fine}>
        {__(
          "Registration and login happen on the BeyondSEO connect pages. You can also do this later from Settings.",
          "beyondseo",
        )}
      </Text>
    </StepLayout>
  );
};
