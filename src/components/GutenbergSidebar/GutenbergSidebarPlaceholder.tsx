import React from "react";
import {
  AIOrb,
  AIOrbSize,
  AIOrbStatus,
  classNames,
  ComponentContainer,
  Skeleton,
  SkeletonTypes,
  VanguardStyle,
} from "vanguard";
import styles from "./GutenbergSidebar.module.scss";

export const GutenbergSidebarPlaceholder = () => (
  <ComponentContainer className={classNames(styles.gutenbergSidebarContainer)}>
    {/* Orb Section */}
    <div className={styles.orbSection}>
      <div className={classNames(styles.orbContainer, styles.expanded)}>
        <div className={styles.aiOrbWrapper}>
          <AIOrb state={AIOrbStatus.Waiting} size={AIOrbSize.Medium} />
        </div>
      </div>
    </div>

    <div className={VanguardStyle.p0_5}>
      {/* Skeleton for title */}
      <div className={VanguardStyle.mt3}>
        <Skeleton type={SkeletonTypes.rectangle} width="80%" height={18} />
      </div>

      {/* Skeleton for subtitle */}
      <div className={VanguardStyle.mt1}>
        <Skeleton type={SkeletonTypes.rectangle} width="60%" height={18} />
      </div>

      {/* Skeleton for content sections */}
      <div className={VanguardStyle.mt3}>
        <Skeleton type={SkeletonTypes.rectangle} width="100%" height={56} />
      </div>

      <div className={VanguardStyle.mt1}>
        <Skeleton type={SkeletonTypes.rectangle} width="100%" height={56} />
      </div>

      <div className={VanguardStyle.mt1}>
        <Skeleton type={SkeletonTypes.rectangle} width="100%" height={56} />
      </div>

      {/* Skeleton for button */}
      <div className={VanguardStyle.mt1}>
        <Skeleton type={SkeletonTypes.rectangle} width="100%" height={56} />
      </div>
    </div>
  </ComponentContainer>
);

export default GutenbergSidebarPlaceholder;
