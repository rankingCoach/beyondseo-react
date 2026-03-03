import React from "react";
import { ComponentContainer, Skeleton } from "vanguard";
import styles from "./BreadcrumbsPage.module.scss";

export const BreadcrumbsPagePlaceholder: React.FC = () => {
  return (
    <ComponentContainer>
      {/* Title placeholder */}
      <Skeleton width="200px" height="32px" className={styles.title} />

      {/* Description placeholder */}
      <Skeleton width="100%" height="20px" className={styles.description} />
      <Skeleton width="90%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />
      <Skeleton width="95%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />

      <div className={styles.separator}></div>

      {/* Switch label and switch placeholder */}
      <Skeleton width="150px" height="24px" className={styles.switchLabel} />
      <Skeleton width="36px" height="20px" className={styles.breadcrumbsSwitch} />

      <Skeleton width="180px" height="28px" style={{ marginTop: "32px", marginBottom: "16px" }} />

      <div className={styles.optionsContainer}>
        <div className={styles.settingsColumn}>
          {/* Separator settings placeholder */}
          <Skeleton width="100%" height="80px" style={{ marginBottom: "24px" }} />

          {/* Home anchor input placeholder */}
          <Skeleton width="180px" height="20px" style={{ marginBottom: "8px" }} />
          <Skeleton width="100%" height="40px" style={{ marginBottom: "24px" }} />

          {/* Advanced options title placeholder */}
          <Skeleton width="160px" height="28px" style={{ marginTop: "24px", marginBottom: "16px" }} />

          {/* Advanced input fields placeholders */}
          {[...Array(4)].map((_, index) => (
            <div key={index} className={styles.advancedInput}>
              <Skeleton width="180px" height="20px" style={{ marginBottom: "8px" }} />
              <Skeleton width="100%" height="40px" />
            </div>
          ))}
        </div>
        <div className={styles.previewColumn}>
          {/* Preview title placeholder */}
          <Skeleton width="80px" height="24px" className={styles.previewTitle} />

          {/* Preview placeholders */}
          <Skeleton width="80%" height="32px" style={{ marginTop: "16px" }} />
          <Skeleton width="60%" height="32px" style={{ marginTop: "16px" }} />
          <Skeleton width="70%" height="32px" style={{ marginTop: "16px" }} />
          <Skeleton width="65%" height="32px" style={{ marginTop: "16px" }} />
        </div>
      </div>

      {/* Button placeholder */}
      <div className={styles.buttonContainer}>
        <Skeleton width="120px" height="40px" />
      </div>
    </ComponentContainer>
  );
};
