import * as React from "react";
import { classNames } from "vanguard";
import styles from "../MultiSelectAdornmentInput.module.scss";
import { InlineInput } from "./InlineInput/InlineInput";
import { AdornmentItem } from "./AdornmentItem/AdornmentItem";
import { Adornment } from "../MultiSelectAdornmentInput";
import { createRef, RefObject, useEffect, useRef } from "react";

interface AdornmentContainerProps {
  firstInputValue: string;
  onFirstInputChange: (value: string) => void;
  onFirstInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  adornments: Adornment[];
  inlineInputValues: string[];
  onInlineInputChange: (index: number, value: string) => void;
  onInlineInputKeyDown: (e: React.KeyboardEvent<HTMLInputElement>, index: number) => void;
  onChangeVariable: (index: number, value: string, optionKey?: string) => void;
  onRemoveVariable: (index: number) => void;
  firstInputRef: React.RefObject<HTMLInputElement>;
  lastInputRef: React.RefObject<HTMLInputElement>;
  onContainerClick: (e: React.MouseEvent) => void;
  isError?: boolean;
}

export const AdornmentContainer = (props: AdornmentContainerProps) => {
  const {
    firstInputValue,
    onFirstInputChange,
    onFirstInputKeyDown,
    adornments,
    inlineInputValues,
    onInlineInputChange,
    onInlineInputKeyDown,
    onChangeVariable,
    onRemoveVariable,
    firstInputRef,
    lastInputRef,
    onContainerClick,
    isError,
  } = props;

  // Create refs for all inline inputs
  const inlineInputRefs = useRef<RefObject<HTMLInputElement>[]>([]);

  // Initialize refs array when adornments change
  useEffect(() => {
    inlineInputRefs.current = adornments.map(() => createRef<HTMLInputElement>()) as RefObject<HTMLInputElement>[];
  }, [adornments.length]);

  return (
    <div
      className={classNames(styles.variablesContainer, isError ? styles.variablesContainerError : undefined)}
      onClick={onContainerClick}
    >
      <div className={classNames(styles.adornmentItem)}>
        <InlineInput
          value={firstInputValue}
          onChange={onFirstInputChange}
          onKeyDown={onFirstInputKeyDown}
          inputRef={firstInputRef}
        />
      </div>

      {adornments.map((adornment, index) => (
        <React.Fragment key={`adornment-group-${index}`}>
          <AdornmentItem
            adornment={adornment}
            index={index}
            onChangeVariable={onChangeVariable}
            onRemoveVariable={onRemoveVariable}
          />
          <InlineInput
            value={inlineInputValues[index] || ""}
            onChange={(value) => onInlineInputChange(index, value)}
            onKeyDown={(e) => onInlineInputKeyDown(e, index)}
            inputRef={index === adornments.length - 1 ? lastInputRef : inlineInputRefs.current[index]}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
