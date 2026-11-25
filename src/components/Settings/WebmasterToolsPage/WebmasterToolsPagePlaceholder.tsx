import React from "react";
import styles from "./WebmasterToolsPage.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const WebmasterToolsPagePlaceholder: React.FC = () => {
  return (
    <ComponentContainer>
      <Skeleton width="160px" height="32px" className={styles.title} />

      <Skeleton width="100%" height="20px" className={styles.description} />
      <Skeleton width="85%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />

      <div className={styles.separator}></div>

      <div className={styles.settingsColumn}>
        <Skeleton width="240px" height="20px" className={styles.codeInput} />
        <Skeleton width="100%" height="40px" className={styles.codeInput} />

        <Skeleton width="240px" height="20px" className={styles.codeInput} />
        <Skeleton width="100%" height="40px" className={styles.codeInput} />

        <div className={styles.buttonContainer}>
          <Skeleton width="120px" height="40px" />
        </div>
      </div>
    </ComponentContainer>
  );
};
