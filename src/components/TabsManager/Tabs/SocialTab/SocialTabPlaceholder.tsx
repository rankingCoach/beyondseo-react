import * as React from 'react';
import styles from './SocialTabPlaceholder.module.scss';
import { ComponentContainer, Skeleton, VanguardStyle } from 'vanguard';

export const SocialTabPlaceholder = () => {
  return (
    <div className={styles.socialTabContainer}>
      <ComponentContainer className={VanguardStyle.mt4}>
        <Skeleton width={100} height={24} />

        <div className={styles.previewsWrapper}>
          <Skeleton width={300} height={158} />
          <Skeleton width={300} height={158} />
          <Skeleton width={300} height={158} />
        </div>

        <div className={styles.formContainer}>
          <Skeleton width={670} height={80} />
          <Skeleton width={670} height={120} />
        </div>
      </ComponentContainer>
    </div>
  );
};
