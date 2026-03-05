import React from "react";
import { classNames, ComponentContainer, Skeleton, SkeletonTypes, VanguardStyle } from "vanguard";
import { __ } from "@wordpress/i18n";
import styles from "./GeneralTabPlaceholder.module.scss";

interface GeneralTabPlaceholderProps {
  showMessage?: boolean;
}

export const GeneralTabPlaceholder = ({ showMessage = false }: GeneralTabPlaceholderProps) => {
  if (showMessage) {
    return (
      <div className={classNames("general-tab-container", VanguardStyle.mt4, VanguardStyle.mb4)}>
        <ComponentContainer className={classNames("seo-metadata-and-keywords-container", styles.messageContainer)}>
          <p className={styles.message}>
            {__("Save draft and refresh page to access BeyondSEO General Tab", "beyondseo")}
          </p>
        </ComponentContainer>
      </div>
    );
  }

  return (
    <div className={classNames("general-tab-container", VanguardStyle.mt4, VanguardStyle.mb4)}>
      <ComponentContainer className="seo-metadata-and-keywords-container">
        {/* SERP Preview */}
        <ComponentContainer className={classNames("serp-preview-outer-container", VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 120 }} />
        </ComponentContainer>

        {/* Title Editor */}
        <ComponentContainer className={classNames("seo-title-editor-outer-container", VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 100 }} />
        </ComponentContainer>

        {/* Description Editor */}
        <ComponentContainer className={classNames("seo-description-editor-outer-container", VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 150 }} />
        </ComponentContainer>

        {/* Keyword Manager */}
        <ComponentContainer className={classNames("seo-keywords-manager-outer-container", VanguardStyle.mb3)}>
          <Skeleton type={SkeletonTypes.fill} style={{ height: 100 }} />
        </ComponentContainer>
      </ComponentContainer>
    </div>
  );
};
