import React from 'react';
import styles from './OptimisationTabPlaceholder.module.scss';
import { ComponentContainer, Skeleton, SkeletonTypes, VanguardStyle } from 'vanguard';

export const OptimisationTabPlaceholder = () => {
  return (
    <div className={styles.optimisationTabContainer}>
      <ComponentContainer className={VanguardStyle.mt4}>
        <Skeleton type={SkeletonTypes.fill} style={{ height: 24, width: '30%' }} />
        <div className={styles.donutChartContainer}>
          <Skeleton type={SkeletonTypes.circle} style={{ height: 120, width: 120 }} />
        </div>
        <div className={styles.seoMetricsContainer}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Skeleton key={item} type={SkeletonTypes.fill} style={{ height: 30 }} />
          ))}
        </div>
      </ComponentContainer>
    </div>
  );
};
