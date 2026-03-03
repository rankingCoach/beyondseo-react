import React from "react";
import styles from "./RSSPage.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const RSSPagePlaceholder: React.FC = () => {
  return (
    <ComponentContainer>
      {/* Title placeholder */}
      <Skeleton width="80px" height="32px" className={styles.title} />

      {/* Description placeholder */}
      <Skeleton width="100%" height="20px" className={styles.description} />
      <Skeleton width="90%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />
      <Skeleton width="85%" height="20px" className={styles.description} style={{ marginTop: "8px" }} />

      <div className={styles.separator}></div>

      <div className={styles.settingsColumn}>
        {/* Open RSS feed button placeholder */}
        <Skeleton width="120px" height="40px" className={styles.openRssButton} />

        {/* Before content input placeholder */}
        <Skeleton width="240px" height="20px" className={styles.rssInput} />
        <Skeleton width="100%" height="40px" className={styles.rssInput} />

        {/* After content input placeholder */}
        <Skeleton width="240px" height="20px" className={styles.rssInput} />
        <Skeleton width="100%" height="40px" className={styles.rssInput} />

        {/* Save button placeholder */}
        <div className={styles.buttonContainer}>
          <Skeleton width="120px" height="40px" />
        </div>
      </div>
    </ComponentContainer>
  );
};
