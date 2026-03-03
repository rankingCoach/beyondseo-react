import { useEffect, useState } from "react";
import styles from "./ScoreButtonHeader.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../main.store";
import { ComponentContainer, Text, FontWeights } from "vanguard";
import rCLogoBlue from "@assets/rc-logo-blue.svg";
import { ScoreButtonHeaderPlaceholder } from "./ScoreButtonHeaderPlaceholder";
import { __ } from "@wordpress/i18n";

export interface ScoreButtonHeaderProps { }

export const ScoreButtonHeader = (props: ScoreButtonHeaderProps) => {
  const { } = props;
  const [score, setScore] = useState<number | null>(null);
  const optimiserResult = useSelector((state: RootState) => state.app.optimiserResult);

  useEffect(() => {
    if (optimiserResult && typeof optimiserResult.score === "number") {
      const rawScore = optimiserResult.score;
      const normalizedScore = rawScore > 1 ? Math.round(rawScore) : Math.round(rawScore * 100);
      setScore(normalizedScore);
    }
  }, [optimiserResult]);

  if (typeof score !== "number") {
    return <ScoreButtonHeaderPlaceholder />;
  }

  return (
    <>
      <ComponentContainer id="score-button-header" className={styles.scoreContainer}>
        <img src={rCLogoBlue} alt={__("rC Icon", "beyondseo")} className={styles.icon} />
        <Text fontSize={14} fontWeight={FontWeights.medium}>
          {score}/100
        </Text>
      </ComponentContainer>
    </>
  );
};
