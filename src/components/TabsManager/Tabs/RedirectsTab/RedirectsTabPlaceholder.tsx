import * as React from "react";
import styles from "./RedirectsTabPlaceholder.module.scss";
import { ComponentContainer, Skeleton } from "vanguard";

export const RedirectsTabPlaceholder = () => {
  return (
    <div className={styles.redirectsPlaceholderContainer}>
      <Skeleton width={200} height={24} className={styles.tableHeaderSkeleton} />

      <div className={styles.tableContainer}>
        {/* Table header skeleton */}
        <div className={styles.tableHeaderRow}>
          <Skeleton width="100%" height={40} />
        </div>

        {/* Table data rows */}
        <div className={styles.tableRowsContainer}>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className={styles.tableRow}>
                <Skeleton width={140} height={16} />
                <Skeleton width={140} height={16} />
                <Skeleton width={70} height={16} />
                <Skeleton width={50} height={16} />
                <Skeleton width={50} height={16} />
                <Skeleton width={70} height={16} />
              </div>
            ))}
        </div>
      </div>

      <ComponentContainer className={styles.formContainer}>
        <Skeleton width={180} height={24} className={styles.formTitleSkeleton} />

        <div className={styles.formFieldsContainer}>
          <div className={styles.inputsRow}>
            <Skeleton width={300} height={60} className={styles.urlInputSkeleton} />
            <Skeleton width={24} height={24} />
            <Skeleton width={300} height={60} className={styles.urlInputSkeleton} />
          </div>

          <Skeleton width={300} height={60} className={styles.selectRowSkeleton} />

          <Skeleton width={120} height={40} className={styles.buttonRowSkeleton} />
        </div>
      </ComponentContainer>
    </div>
  );
};
