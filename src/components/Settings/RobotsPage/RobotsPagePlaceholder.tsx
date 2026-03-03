import React from "react";
import styles from "./RobotsPage.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const RobotsPagePlaceholder: React.FC = () => {
  return (
    <ComponentContainer>
      {/* Title placeholder */}
      <Skeleton width="150px" height="32px" className={styles.title} />

      {/* Description placeholder */}
      <Skeleton width="100%" height="20px" className={styles.description} />
      <Skeleton width="70%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />

      <div className={styles.separator}></div>

      {/* Checkbox placeholder */}
      <div className={styles.checkboxContainer}>
        <Skeleton width="280px" height="24px" />
        <Skeleton
          width="90%"
          height="16px"
          style={{ marginTop: "12px", marginLeft: "28px" }}
          className={styles.checkboxDescription}
        />
      </div>

      {/* Button container placeholder */}
      <div className={styles.buttonContainer}>
        <Skeleton width="120px" height="40px" />
        <Skeleton width="120px" height="40px" />
      </div>

      {/* Last updated placeholder */}
      <Skeleton width="200px" height="18px" className={styles.lastUpdated} />

      <div className={styles.secondarySeparator}></div>

      {/* Additional info placeholder */}
      <Skeleton width="100%" height="20px" className={styles.additionalInfo} />
      <Skeleton width="90%" height="20px" className={styles.additionalInfo} style={{ marginTop: "8px" }} />

      {/* URL container placeholder */}
      <div className={styles.urlContainer}>
        <Skeleton width="120px" height="20px" />
        <Skeleton width="200px" height="32px" className={styles.urlValue} />
      </div>
    </ComponentContainer>
  );
};
