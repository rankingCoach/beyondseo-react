import * as React from "react";
import styles from "../../MultiSelectAdornmentInput.module.scss";
import { calculateInputWidthCanvas } from "../../adornment-helpers";

interface InlineInputProps {
  value: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const InlineInput = (props: InlineInputProps) => {
  const { value, onChange, onKeyDown, inputRef } = props;

  return (
    <input
      type="text"
      className={styles.inlineInput}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      style={{ width: calculateInputWidthCanvas(value, inputRef?.current) }}
      ref={inputRef}
    />
  );
};
