import { Text, TextTypes, FontWeights } from "vanguard";
import classNames from "classnames";
import styles from "./SeparatorSettings.module.scss";
import { useEffect } from "react";
import { __ } from "@wordpress/i18n";

interface SeparatorSettingsProps {
  value: string;
  onChange: (separator: string) => void;
}

export const SeparatorSettings: React.FC<SeparatorSettingsProps> = ({ value, onChange }) => {
  const separators = {
    pipe: "|",
    dash: "-",
    en_dash: "–",
    em_dash: "—",
    dot: "·",
    colon: ":",
    bullet: "•",
    angle_double: "»",
    angle_single: "›",
    tilde: "~",
    asterisk: "*",
    plus: "+",
    slash: "/",
    backslash: "\\",
    equals: "=",
    ellipsis: "…",
  };

  const defaultSeparator = "»";

  useEffect(() => {
    if (!value || !Object.values(separators).includes(value)) {
      onChange(defaultSeparator);
    }
  }, [value]);

  const handleSelect = (separator: string) => {
    onChange(separator);
  };

  return (
    <div className={styles.container}>
      <Text type={TextTypes.text} fontWeight={FontWeights.regular} className={styles.title}>
        {__("Separator", "beyondseo")}
      </Text>
      <div className={styles.separatorsContainer}>
        {Object.entries(separators).map(([key, separator]) => (
          <div
            key={key}
            className={classNames(styles.separator, {
              [styles.selected]: separator === value,
            })}
            onClick={() => handleSelect(separator)}
          >
            <Text translate={false} color={separator === value ? "--fn-bg-cta-fg" : undefined}>
              {separator}
            </Text>
          </div>
        ))}
      </div>
    </div>
  );
};
