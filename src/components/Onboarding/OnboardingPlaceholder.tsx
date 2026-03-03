import React from "react";
import styles from "./Onboarding.module.scss";
import welcomeStyles from "./OnboardingWelcome/OnboardingWelcome.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const OnboardingPlaceholder: React.FC = () => {
  return (
    <ComponentContainer className={styles.onboardingContainer}>
      <div className={welcomeStyles.onboardingWelcomeContainer}>
        {/* AI Orb placeholder */}
        <div className={welcomeStyles.loaderComponent}>
          <Skeleton width="120px" height="120px" borderRadius="50%" />
        </div>

        {/* Welcome text placeholders */}
        <div className={welcomeStyles.sliderComponent}>
          <Skeleton width="50%" height="48px" className={welcomeStyles.sliderTextPlaceholder} />
          <Skeleton
            width="70%"
            height="48px"
            className={welcomeStyles.sliderTextPlaceholder}
            style={{ marginTop: "16px" }}
          />
          <Skeleton
            width="40%"
            height="48px"
            className={welcomeStyles.sliderTextPlaceholder}
            style={{ marginTop: "16px" }}
          />
        </div>

        {/* Button placeholder */}
        <div className={welcomeStyles.buttonComponent}>
          <Skeleton width="160px" height="48px" borderRadius="24px" />
        </div>

        {/* Cancel link placeholder */}
        <div className={welcomeStyles.cancelComponent}>
          <Skeleton width="60px" height="20px" />
        </div>
      </div>
    </ComponentContainer>
  );
};
