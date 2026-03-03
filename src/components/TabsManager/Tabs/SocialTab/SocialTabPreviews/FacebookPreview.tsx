import * as React from "react";
import styles from "./FacebookPreview.module.scss";
import { Icon, IconNames } from "vanguard";
import { __ } from "@wordpress/i18n";

interface FacebookPreviewProps {
  title: string;
  domain: string;
  imageUrl?: string;
}

export const FacebookPreview: React.FC<FacebookPreviewProps> = ({
  title = __("Your page title will appear here", "beyondseo"),
  domain = __("yourdomain.com", "beyondseo"),
  imageUrl,
}) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <Icon
          children={IconNames.facebook}
          className={styles.previewIcon}
          svgClassName={styles.previewIconSvg}
          fillColor={"#1877F2"}
          color={"#FFFFFF"}
          hasCircle={true}
          circleSize={20}
          style={{ width: "20px", height: "20px" }} // Direct style override
        />
      </div>

      {imageUrl && <img src={imageUrl} alt="Preview" className={styles.previewImage} />}

      <div className={styles.previewContent}>
        <div className={styles.previewDomain}>{domain}</div>
        <div className={styles.previewTitle}>{title}</div>
      </div>
    </div>
  );
};
