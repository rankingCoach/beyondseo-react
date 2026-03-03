import * as React from 'react';
import styles from './AdvancedTabPlaceholder.module.scss';
import { ComponentContainer, Skeleton, VanguardStyle } from 'vanguard';

export const AdvancedTabPlaceholder = () => {
  return (
    <div className={styles.advancedTabContainer}>
      <ComponentContainer className={VanguardStyle.mt4}>
        <div className={styles.formContainer}>
          {/* Switch placeholder */}
          <Skeleton width={100} height={24} />

          {/* Switch placeholder */}
          <Skeleton width={100} height={24} />

          {/* Input placeholder */}
          <Skeleton width={670} height={80} />
        </div>
      </ComponentContainer>
    </div>
  );
};
