import * as React from "react";
import { Skeleton } from "vanguard";
import styles from "./SetupWizard.module.scss";

export const SetupWizardPlaceholder: React.FC = () => (
  <div className={styles.content}>
    <div className={styles.placeholder}>
      <Skeleton width="60%" height="32px" />
      <Skeleton width="90%" height="20px" />
      <Skeleton width="100%" height="120px" />
      <Skeleton width="100%" height="72px" />
      <Skeleton width="40%" height="20px" />
    </div>
  </div>
);
