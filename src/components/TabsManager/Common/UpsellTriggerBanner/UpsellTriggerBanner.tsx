import * as React from "react";
import styles from "./UpsellTriggerBanner.module.scss";
import { classNames, Text } from "vanguard";
import { __ } from "@wordpress/i18n";

interface UpsellTriggerBannerProps {
  title: string;
  description: string;
  features: string[];
  imageSrc: string;
  andMoreText?: string;
  buttonText: string;
  onButtonClick: () => void;
  className?: string;
}

export const UpsellTriggerBanner: React.FC<UpsellTriggerBannerProps> = ({
  title,
  description,
  features,
  imageSrc,
  andMoreText = __("And more", "beyondseo"),
  buttonText,
  onButtonClick,
  className,
}) => {
  const handleClick = () => {
    window.location.href = `${(window as any).rankingCoachReactData?.adminurl || 'admin.php'}?page=rankingcoach-upsell`;
  };

  return (
    <div className={classNames(styles.bannerContainer, className)}>
      <div className={styles.imageContainer}>
        <div
          className={styles.bannerImage}
          role="img"
          aria-label={__("Feature illustration", "beyondseo")}
          style={{ backgroundImage: `url(${imageSrc})` }}
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
      <ul className={styles.featureList}>
        {features.map((feature, index) => (
          <li key={index} className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <span className={styles.bulletDot}></span>
              <Text>{feature}</Text>
            </div>
          </li>
        ))}
      </ul>
      {andMoreText && <p className={styles.description}>{andMoreText}</p>}
      <button
        className={classNames(styles.ctaButton, styles.rcButton, styles.rcButtonPrimary)}
        onClick={handleClick}
        style={{ textDecoration: "none", backgroundColor: "#0068FF" }}
      >
        {buttonText}
      </button>
    </div>
  );
};
