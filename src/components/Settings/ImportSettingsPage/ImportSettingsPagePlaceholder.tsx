import React from "react";
import { ComponentContainer, Skeleton } from "vanguard";
import styles from "./ImportSettingsPage.module.scss";

export const ImportSettingsPagePlaceholder: React.FC = () => {
  return (
    <ComponentContainer>
      {/* Title placeholder */}
      <div className={styles.titleContainer}>
        <Skeleton width="180px" height="32px" className={styles.title} />
      </div>

      {/* Description placeholder */}
      <Skeleton width="100%" height="20px" className={styles.description} />
      <Skeleton width="90%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />
      <Skeleton width="95%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />

      <div className={styles.separator}></div>

      {/* Step 1 placeholder */}
      <Skeleton width="200px" height="24px" className={styles.stepTitle} />
      <Skeleton width="100%" height="20px" className={styles.stepDescription} />
      <Skeleton width="90%" height="20px" className={styles.stepDescription} style={{ marginTop: "8px" }} />
      <Skeleton width="150px" height="20px" className={styles.backupLink} />

      {/* Step 2 placeholder */}
      <Skeleton width="220px" height="24px" className={styles.stepTitle} />
      <Skeleton width="100%" height="20px" className={styles.stepDescription} />
      <Skeleton width="90%" height="20px" className={styles.stepDescription} style={{ marginTop: "8px" }} />

      {/* Radio buttons placeholder */}
      <div className={styles.radioGroup}>
        <Skeleton width="120px" height="24px" style={{ marginBottom: "16px" }} />
        <Skeleton width="140px" height="24px" />
      </div>

      {/* Button placeholder */}
      <div className={styles.buttonContainer}>
        <Skeleton width="120px" height="40px" />
      </div>
    </ComponentContainer>
  );
};
