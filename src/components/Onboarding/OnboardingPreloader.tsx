import React, { useMemo } from "react";
import styles from "./OnboardingPreloader.module.scss";
import { ComponentContainer } from "vanguard";

export const OnboardingPreloader: React.FC = () => {
  const reducedMotion = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  return (
    <ComponentContainer
      className={styles.container}
    >
      <div className={styles.innerContainer}>
        <svg className={styles.orb} width="80" height="80" viewBox="0 0 80 80">
          <defs>
            <radialGradient id="circleGrad" cx="40" cy="40" r="40" fx="40" fy="40">
              <stop offset="0" stopColor="#4F46E5">
                {!reducedMotion && (
                  <animate
                    attributeName="stopColor"
                    values="#4F46E5;#3B82F6;#10B981;#4F46E5"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </stop>
              <stop offset="1" stopColor="#3B82F6">
                {!reducedMotion && (
                  <animate
                    attributeName="stopColor"
                    values="#3B82F6;#10B981;#4F46E5;#3B82F6"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                )}
              </stop>
            </radialGradient>
          </defs>
          <circle cx="40" cy="40" r="38" fill="url(#circleGrad)">
            {!reducedMotion && (
              <animate
                attributeName="r"
                values="38;40;38"
                dur="1.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="40" cy="40" r="45" fill="none" stroke="#E0E7FF" strokeWidth="2">
            {!reducedMotion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 40 40"
                to="360 40 40"
                dur="2s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        </svg>
        <div className={styles.textContainer}>
          <span className={styles.mainText}>We prepare your onboarding<span className={styles.ellipsis}>...</span></span>
        </div>
        <div className={styles.progress}>
          <div className={styles.progressFill}></div>
        </div>
      </div>
    </ComponentContainer>
  );
};
