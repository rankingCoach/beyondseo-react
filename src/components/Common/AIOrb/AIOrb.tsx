import React, {useEffect} from "react";
import styles from "./AIOrb.module.scss";
import {useSpring} from "react-spring";
import {classNames} from "vanguard";

export enum AIOrbStatus {
  Waiting = "waiting",
  Thinking = "thinking",
  Error = "error",
  Warning = "warning",
  Disconnected = "disconnected",
}

export enum AIOrbSize {
  Small = 40,
  Medium = 72,
  Large = 140,
  FullScreen = 2000,
}

export interface AIOrbProps {
  state?: AIOrbStatus;
  className?: string;
  size?: AIOrbSize;
  fullScreen?: boolean;
}

export const AIOrb = (props: AIOrbProps) => {
  const { state = AIOrbStatus.Waiting, size = AIOrbSize.Medium, className } = props;

  useSpring({
    config: { tension: 200, friction: 20 },
    containerSize: size === AIOrbSize.FullScreen ? "1500px" : `${size}px`,
    onChange: (props) => {
      document.documentElement.style.setProperty("--container-size", props.value.containerSize);
    },
  });

  useEffect(() => {
    const root = document.documentElement;
    const style = getOrbStyle() as Record<string, string>;

    Object.keys(style).forEach((key) => {
      root.style.setProperty(key, style[key]);
    });
  }, [state]);

  const getOrbStyle = (): React.CSSProperties => {
    // Default settings (For state Waiting)
    let animationDurationRotation = 8;
    let animationDurationScale = 6;
    let baseColor = "var(--p500)";

    let color1 = "hsl(from var(--ai-orb-base-color) calc(h + 123) s calc(l + 6))";
    let color2 = "hsl(from var(--ai-orb-base-color) calc(h - 35) 62 62)";
    let color3 = "hsl(from var(--ai-orb-base-color) h s 98)";

    switch (state) {
      case AIOrbStatus.Thinking:
        animationDurationRotation = 3;
        animationDurationScale = 1.5;
        baseColor = "hsla(217, 100%, 50%, 1)";
        break;

      case AIOrbStatus.Error:
        animationDurationRotation = 5;
        animationDurationScale = 10;
        baseColor = "hsla(15, 100%, 50%, 1)";
        color1 = "hsla(15, 100%, 56%, 1)";
        color2 = "hsla(25, 62%, 62%, 1)";
        color3 = "hsla(0, 100%, 80%, 1)";
        break;

      case AIOrbStatus.Disconnected:
        animationDurationRotation = 20;
        animationDurationScale = 25;
        baseColor = "hsla(217, 20%, 50%, 0.5)";
        color1 = "hsla(217, 20%, 56%, 0.5)";
        color2 = "hsla(250, 20%, 62%, 0.5)";
        color3 = "hsla(217, 20%, 95%, 0.75)";
        break;

      case AIOrbStatus.Warning:
        animationDurationRotation = 5;
        animationDurationScale = 8;
        baseColor = "hsla(40, 100%, 50%, 1)";
        color1 = "hsla(35, 100%, 56%, 1)";
        color2 = "hsla(45, 100%, 62%, 1)";
        color3 = "hsla(35, 100%, 45%, 1)";
        break;

      case AIOrbStatus.Waiting:
      default:
        break;
    }

    if (size === AIOrbSize.FullScreen) {
      animationDurationRotation = 20;
      animationDurationScale = 25;
      color3 = "hsl(from var(--ai-orb-base-color) calc(h + 45) s calc(l - 10))";
    }
    return {
      "--animation-duration-rotation": `${animationDurationRotation}s`,
      "--animation-duration-scale": `${animationDurationScale}s`,
      "--ai-orb-base-color": baseColor,
      "--color1": color1,
      "--color2": color2,
      "--color3": color3,
    } as React.CSSProperties;
  };

  return (
    <div className={classNames(className, size === AIOrbSize.FullScreen ? styles.fullscreen : undefined)}>
      <div className={classNames(styles.aiOrb)} style={getOrbStyle()}>
        <div className={classNames(styles.orbsContainer)} />

        <div className={classNames(styles.orbsContainer)}>
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
        </div>

        <div className={classNames(styles.orbsContainer)}>
          <div className={classNames(styles.orbs, styles.orbsSmall)} />
          <div className={classNames(styles.orbs, styles.orbsSmall)} />
          <div className={classNames(styles.orbs, styles.orbsSmall)} />
          <div className={classNames(styles.orbs, styles.orbsSmall)} />
        </div>

        <div className={classNames(styles.orbsContainer)}>
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
          <div className={classNames(styles.orbs, styles.orbsLarge)} />
        </div>
      </div>
    </div>
  );
};
