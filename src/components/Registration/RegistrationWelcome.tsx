import * as React from "react";
import styles from "./RegistrationWelcome.module.scss";
import { ComponentContainer, Text, TextTypes, FontWeights } from "vanguard";
import { __ } from "@wordpress/i18n";
import beyondSEOLogo from "@assets/beyondSEO-logo.svg";

const ACTIVATION_URL = `${(window as any).rankingCoachReactData?.adminurl || 'admin.php'}?page=rankingcoach-activation`;

interface RegistrationWelcomeProps {
  onContinueWithEmail: () => void;
}

export const RegistrationWelcome: React.FC<RegistrationWelcomeProps> = ({ onContinueWithEmail }) => {
  const handleActivationCode = () => {
    window.location.href = ACTIVATION_URL;
  };

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
        <Text
          type={TextTypes.heading1}
          fontWeight={FontWeights.bold}
          className={styles.welcomeTitle}
        >
          {__("Welcome, how would you like to get started?", "beyondseo")}
        </Text>

        <div className={styles.optionsList}>
          <button className={styles.optionCard} onClick={onContinueWithEmail}>
            <Text type={TextTypes.text} fontWeight={FontWeights.bold} className={styles.optionTitle}>
              {__("Continue with email", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={styles.optionDescription}>
              {__("Log in or create a free account to start using the plugin.", "beyondseo")}
            </Text>
          </button>

          <button className={styles.optionCard} onClick={handleActivationCode}>
            <Text type={TextTypes.text} fontWeight={FontWeights.bold} className={styles.optionTitle}>
              {__("Use an activation code", "beyondseo")}
            </Text>
            <Text type={TextTypes.text} className={styles.optionDescription}>
              {__("Already received a code by email? Enter it here to activate your plugin.", "beyondseo")}
            </Text>
          </button>
        </div>
      </div>

      {/* Bottom Horizontal Divider */}
      <div className={styles.bottomDivider} />

      {/* Footer spacer */}
      <div className={styles.footerSection} />
    </ComponentContainer>
  );
};
