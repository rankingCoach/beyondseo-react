import React from "react";
import styles from "./BreadcrumbPreview.module.scss";
import { Text, TextTypes, FontWeights } from "vanguard";

interface BreadcrumbItem {
  text: string;
  isLink?: boolean;
}

interface BreadcrumbPreviewProps {
  items: BreadcrumbItem[];
  separator: string;
  prefix?: string;
}

export const BreadcrumbPreview: React.FC<BreadcrumbPreviewProps> = ({ items, separator, prefix }) => {
  const spaceStyle = {
    marginRight: '8px',
    display: 'inline-block'
  };

  return (
    <div className={styles.previewContainer}>
      {prefix && (
        <span style={spaceStyle}>
          <Text type={TextTypes.text} fontWeight={FontWeights.medium} className={styles.prefix}>
            {prefix}
          </Text>
        </span>
      )}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <Text type={TextTypes.text} className={item.isLink ? styles.link : styles.text}>
            {item.text}
          </Text>
          {index < items.length - 1 && (
            <Text type={TextTypes.text} className={styles.separator}>
              {` ${separator} `}
            </Text>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
