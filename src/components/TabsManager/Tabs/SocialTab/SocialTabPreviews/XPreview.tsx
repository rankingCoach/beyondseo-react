// XPreview.tsx
import * as React from "react";
import styles from "./XPreview.module.scss";
import XIconRound from "@src/assets/x-icon-round.svg";
import { __ } from "@wordpress/i18n";

interface XPreviewProps {
  title?: string;
  domain?: string;
  imageUrl?: string;
}

export const XPreview: React.FC<XPreviewProps> = ({
  title = __("Your page title will appear here", "beyondseo"),
  domain = __("yourdomain.com", "beyondseo"),
  imageUrl,
}) => {
  return (
    <div className={styles.previewContainer}>
      <div className={styles.previewHeader}>
        <img src={XIconRound} alt="X Logo" className={styles.previewIconSvg} />
      </div>

      {imageUrl && (
        <div className={styles.imageWrapper}>
          <img src={imageUrl} alt="Preview" className={styles.previewImage} />
          <div className={styles.imageCaption}>{title}</div>
        </div>
      )}

      <div className={styles.previewLink}>
        <span className={styles.previewFrom}>{__("From", "beyondseo")}&nbsp;</span>
        <span className={styles.previewDomain}>{domain}</span>
      </div>
    </div>
  );
};
