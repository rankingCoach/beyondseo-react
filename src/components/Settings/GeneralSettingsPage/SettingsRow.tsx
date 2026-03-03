import React from "react";
import { Switch, Text, TextTypes, FontWeights } from "vanguard";
import styles from "./SettingsRow.module.scss";
import { __ } from "@wordpress/i18n";

interface SettingsRowProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (event: React.SyntheticEvent) => void;
  testId: string;
  disabled?: boolean;
}

const SettingsRow: React.FC<SettingsRowProps> = ({ title, description, checked, onChange, testId, disabled }) => {
  return (
    <div className={styles.settingsRow}>
      <div className={styles.textContainer}>
        <Text type={TextTypes.text} fontWeight={FontWeights.medium} className={styles.title}>
          {__(title, "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={styles.description}>
          {__(description, "beyondseo")}
        </Text>
      </div>
      <div className={styles.switchContainer}>
        <Switch value={checked} onChange={onChange} size="small" testId={testId} disabled={disabled} />
      </div>
    </div>
  );
};

export default SettingsRow;
