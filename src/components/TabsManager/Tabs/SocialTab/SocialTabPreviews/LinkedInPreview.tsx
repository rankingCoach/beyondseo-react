// SocialTabPreviews/LinkedInPreview.tsx
import * as React from "react";
import styles from "./LinkedInPreview.module.scss";
import { Icon, IconNames } from "vanguard";
import { __ } from "@wordpress/i18n";

interface LinkedInPreviewProps {
  title?: string;
  domain?: string;
  imageUrl?: string;
}

export const LinkedInPreview: React.FC<LinkedInPreviewProps> = ({
  title = __("Your page title will appear here", "beyondseo"),
  domain = __("yourdomain.com", "beyondseo"),
  imageUrl,
}) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <Icon
          children={IconNames.linkedin}
          className={styles.previewIcon}
          svgClassName={styles.previewIconSvg}
          hasCircle
          circleSize={20}
          fillColor="#0A66C2"
          color="#FFFFFF"
          style={{ width: "20px", height: "20px" }}
        />
      </div>

      {/* body */}
      <div className={styles.previewBody}>
        <img
          className={styles.previewImage}
          src={imageUrl}
          alt="Preview"
        />

        <div className={styles.previewContent}>
          <div className={styles.previewTitle}>{title}</div>
          <div className={styles.previewDomain}>{domain}</div>
        </div>
      </div>
    </div>
  );
};
