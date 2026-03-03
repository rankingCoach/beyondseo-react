import React, {useEffect, useRef} from "react";
import {Gradient} from "./StripeGradientAnimation";
import styles from "./StripeGradientBackgroundAnimation.module.scss";

const StripeGradientBackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gradientRef = useRef<any>(null);

  useEffect(() => {

    if (canvasRef.current) {
      try {
        gradientRef.current = new Gradient();
        gradientRef.current.initGradient("#gradient-canvas");

        // Add resize listener
        const handleResize = () => {
          if (gradientRef.current) {
            gradientRef.current.resize();
          }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      } catch (error) {
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <canvas
        ref={canvasRef}
        id="gradient-canvas"
        data-js-darken-top
        aria-hidden="true"
        style={
          {
            "--gradient-color-1": "#f03a7f",
            "--gradient-color-2": "#8fd8d4",
            "--gradient-color-3": "#146CFF",
            "--gradient-color-4": "#146CFF",
          } as React.CSSProperties
        }
      />
    </div>
  );
};

export default StripeGradientBackgroundAnimation;
