import React from 'react';
import { classNames, ComponentContainer, Skeleton, SkeletonTypes, VanguardStyle } from 'vanguard';

export const GeneralTabPlaceholder = () => {
  return (
    <div className={classNames('general-tab-container', VanguardStyle.mt4, VanguardStyle.mb4)}>
      <ComponentContainer className="seo-metadata-and-keywords-container">
        {/* SERP Preview */}
        <ComponentContainer className={classNames('serp-preview-outer-container', VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 120 }} />
        </ComponentContainer>

        {/* Title Editor */}
        <ComponentContainer className={classNames('seo-title-editor-outer-container', VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 100 }} />
        </ComponentContainer>

        {/* Description Editor */}
        <ComponentContainer className={classNames('seo-description-editor-outer-container', VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 150 }} />
        </ComponentContainer>

        {/* Keyword Manager */}
        <ComponentContainer className={classNames('seo-keywords-manager-outer-container', VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 100 }} />
        </ComponentContainer>
      </ComponentContainer>
    </div>
  );
};
