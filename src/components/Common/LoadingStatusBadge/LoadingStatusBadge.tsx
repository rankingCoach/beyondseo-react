import { __ } from "@wordpress/i18n";
import * as React from "react";
import { useEffect, useState } from "react";
import styles from "./LoadingStatusBadge.module.scss";
import { StatusBadge } from "vanguard";

export interface LoadingStatusBadgeProps {
  loading: boolean;
  texts: string[];
  intervalDuration?: number;
}

export const LoadingStatusBadge = (props: LoadingStatusBadgeProps) => {
  const [loadingMessageIndex, setLoadingMessageIndex] = useState<number>(0);
  const [showLoadingBadge, setShowLoadingBadge] = useState<boolean>(true);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isAppearing, setIsAppearing] = useState<boolean>(false);
  const [textTransition, setTextTransition] = useState<string>("expandingText");

  useEffect(() => {
    if (showLoadingBadge) {
      let currentIndex = 0;
      setLoadingMessageIndex(currentIndex);
      setIsAppearing(true);

      const interval = props.intervalDuration || 3000;
      const transitionDuration = 300;

      const intervalId = setInterval(() => {
        setTextTransition("shrinkingText");

        setTimeout(() => {
          currentIndex = (currentIndex + 1) % props.texts.length; // Loop through texts
          setLoadingMessageIndex(currentIndex);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTextTransition("expandingText");
            });
          });
        }, transitionDuration);
      }, interval);

      return () => clearInterval(intervalId);
    }
  }, [showLoadingBadge, props.texts, props.intervalDuration]);

  if (!showLoadingBadge) {
    return null;
  }
  return (
    <div
      className={`${styles.loadingIndicatorWrapper}
      ${isAppearing ? styles.appearing : ""}
      ${isExiting ? styles.exiting : ""}`}
    >
      <StatusBadge
        key={loadingMessageIndex}
        className={`${styles.loadingIndicator} ${styles[textTransition]}`}
        text={props.texts[loadingMessageIndex]}
        status="publishing"
        hideIcon={true}
      />
    </div>
  );
};
