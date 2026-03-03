import React from "react";
import styles from "./OnboardingSummary.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const OnboardingSummaryPlaceholder: React.FC = () => {
  return (
    <ComponentContainer className={styles.editableCardsContainer}>
      {/* Title placeholder */}
      <Skeleton width="60%" height="36px" className={styles.summaryTitlePlaceholder} />

      {/* Business Information Card Placeholder */}
      <ComponentContainer className={styles.editableCardWrapper}>
        <div className={styles.cardPlaceholder}>
          <Skeleton width="200px" height="24px" />
          <div className={styles.cardContentPlaceholder}>
            <Skeleton width="80%" height="20px" />
            <Skeleton width="70%" height="20px" />
            <Skeleton width="90%" height="20px" />
          </div>
        </div>
      </ComponentContainer>

      {/* Website Description Card Placeholder */}
      <ComponentContainer className={styles.editableCardWrapper}>
        <div className={styles.cardPlaceholder}>
          <Skeleton width="220px" height="24px" />
          <div className={styles.cardContentPlaceholder}>
            <Skeleton width="100%" height="20px" />
            <Skeleton width="100%" height="20px" />
            <Skeleton width="40%" height="20px" />
          </div>
        </div>
      </ComponentContainer>

      {/* Keywords Card Placeholder */}
      <ComponentContainer className={styles.editableCardWrapper}>
        <div className={styles.cardPlaceholder}>
          <Skeleton width="180px" height="24px" />
          <div className={styles.cardContentPlaceholder}>
            <div className={styles.inputWithButtonPlaceholder}>
              <Skeleton width="100%" height="48px" />
              <Skeleton width="80px" height="48px" />
            </div>
            <div className={styles.tagsPlaceholder}>
              <Skeleton width="100px" height="32px" />
              <Skeleton width="120px" height="32px" />
              <Skeleton width="90px" height="32px" />
            </div>
          </div>
        </div>
      </ComponentContainer>

      {/* Categories Card Placeholder */}
      <ComponentContainer className={styles.editableCardWrapper}>
        <div className={styles.cardPlaceholder}>
          <Skeleton width="150px" height="24px" />
          <div className={styles.cardContentPlaceholder}>
            <Skeleton width="100%" height="48px" />
            <div className={styles.tagsPlaceholder}>
              <Skeleton width="140px" height="32px" />
              <Skeleton width="110px" height="32px" />
            </div>
          </div>
        </div>
      </ComponentContainer>

      {/* Finish Button Placeholder */}
      <ComponentContainer className={styles.blurredButtonContainer}>
        <div className={styles.finishButtonPlaceholder}>
          <Skeleton width="100px" height="40px" />
          <Skeleton width="180px" height="40px" />
        </div>
      </ComponentContainer>
    </ComponentContainer>
  );
};
