import * as React from "react";
import { classNames } from "vanguard";
import styles from "./SetupWizard.module.scss";

interface StepLayoutProps {
  children: React.ReactNode;
  /** Buttons aligned to the start of the footer (Back). */
  footerStart?: React.ReactNode;
  /** Buttons aligned to the end of the footer (secondary, primary). */
  footerEnd?: React.ReactNode;
}

/** Content column plus the divider and footer every step shares. */
export const StepLayout: React.FC<StepLayoutProps> = ({ children, footerStart, footerEnd }) => (
  <>
    <div className={styles.content}>
      <div className={styles.column}>{children}</div>
    </div>
    <div className={styles.divider} />
    <div className={styles.footer}>
      <div className={classNames(styles.footerStart)}>{footerStart}</div>
      <div className={classNames(styles.footerEnd)}>{footerEnd}</div>
    </div>
  </>
);
