import * as React from "react";
import { useCallback, useEffect, useRef } from "react";
import styles from "./MultiSelectAdornmentInput.module.scss";
import { classNames, ComponentContainer } from "vanguard";
import { AdornmentControls } from "./AdornmentControls/AdornmentControls";
import { AdornmentContainer } from "./AdornmentContainer/AdornmentContainer";
import { useAdornmentState } from "./hooks/useAdornmentState";
import { useKeyboardNavigation } from "./hooks/useKeyboardNavigation";
import { SelectOptionProps } from "vanguard";
import { __ } from "@wordpress/i18n";

export interface AdornmentConfig {
  options: SelectOptionProps;
  buttonText: string;
}

export interface Adornment {
  key: string;
  value: string;
  type: "variable" | "separator" | "text";
}

export interface MultiSelectAdornmentInputProps {
  title: string;
  variableConfig: AdornmentConfig;
  separatorConfig?: AdornmentConfig;
  initialAdornments: Adornment[];
  value?: string;
  onSave: (variableElements: Adornment[]) => void | Promise<any>;
  disable?: boolean;
  maxAdornments?: number;
  maxChars?: number;
  defaultValue?: string;
}

export const MultiSelectAdornmentInput = (props: MultiSelectAdornmentInputProps) => {
  const {
    title,
    variableConfig,
    separatorConfig,
    disable,
    initialAdornments,
    onSave,
    maxAdornments = 10,
    value,
    maxChars,
    defaultValue,
  } = props;

  const lastInputRef = useRef<HTMLInputElement>(null!);
  const firstInputRef = useRef<HTMLInputElement>(null!);

  const {
    addedAdornments,
    inlineInputValues,
    firstInputValue,
    handleAddAdornment,
    handleRemoveVariable,
    handleChangeVariable,
    handleFirstInputChange,
    handleInlineInputChange,
    isOverCharLimit,
    isEmpty,
    hasError,
  } = useAdornmentState({
    initialAdornments,
    onSave,
    maxAdornments,
    maxChars,
    value,
    defaultValue,
  });

  const { handleInlineInputKeyDown } = useKeyboardNavigation({
    handleRemoveVariable,
    firstInputRef,
  });

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && defaultValue && (value === defaultValue || !value)) {
      const adornmentsToSave = addedAdornments.length > 0 ? addedAdornments : initialAdornments;

      // If no adornments but we have a default value, create a text adornment from the default value
      if (adornmentsToSave.length === 0 && defaultValue) {
        const defaultAdornment: Adornment = {
          key: "default",
          value: defaultValue,
          type: "text",
        };
        onSave([defaultAdornment]);
      } else if (adornmentsToSave.length > 0) {
        onSave(adornmentsToSave);
      }

      hasInitialized.current = true;
    }
  }, [defaultValue, value, addedAdornments, initialAdornments]);

  const focusLastInput = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        if (addedAdornments.filter((a) => a.type !== "text").length === 0 && firstInputRef.current) {
          firstInputRef.current.focus();
        } else if (lastInputRef.current) {
          lastInputRef.current.focus();
        }
      }
    },
    [lastInputRef, firstInputRef, addedAdornments],
  );

  const handleEmojiSelect = useCallback(
    (emoji: string) => {
      if (addedAdornments.length === 0) {
        handleFirstInputChange((firstInputValue || "") + emoji);
      } else {
        const lastIndex = addedAdornments.length - 1;
        const currentValue = inlineInputValues[lastIndex] || "";
        handleInlineInputChange(lastIndex, currentValue + emoji);
      }
    },
    [addedAdornments, inlineInputValues, firstInputValue, handleFirstInputChange, handleInlineInputChange],
  );

  const nonTextAdornments = addedAdornments.filter((adornment) => adornment.type !== "text");

  return (
    <ComponentContainer
      testId={"multi-adornment-input-container"}
      className={classNames(styles.multiSelectorAdornmentInput)}
    >
      <AdornmentControls
        title={title}
        disabled={disable}
        onAddAdornment={handleAddAdornment}
        onEmojiSelect={handleEmojiSelect}
        adornmentCount={addedAdornments.length}
        maxAdornments={maxAdornments}
        variableConfig={variableConfig}
        separatorConfig={separatorConfig}
      />

      <div className={styles.selectAdornmentInputContainer}>
        {!disable && (
          <>
            <AdornmentContainer
              firstInputValue={firstInputValue}
              onFirstInputChange={handleFirstInputChange}
              onFirstInputKeyDown={(e) => handleInlineInputKeyDown(e, -1)}
              adornments={nonTextAdornments}
              inlineInputValues={inlineInputValues}
              onInlineInputChange={handleInlineInputChange}
              onInlineInputKeyDown={handleInlineInputKeyDown}
              onChangeVariable={handleChangeVariable}
              onRemoveVariable={handleRemoveVariable}
              firstInputRef={firstInputRef}
              lastInputRef={lastInputRef}
              onContainerClick={focusLastInput}
              isError={hasError()}
            />
            <div className={styles.feedbackContainer}>
              {isEmpty() && <div className={classNames(styles.errorMessage)}>{__("This field cannot be empty", "beyondseo")}</div>}

              {maxChars !== undefined && (
                <div
                  className={classNames(
                    styles.characterCounter,
                    isOverCharLimit() || isEmpty() ? styles.characterCounterError : undefined,
                  )}
                >
                  {nonTextAdornments.length === 0 ? firstInputValue.length || 0 : value?.length || 0} / {maxChars}{" "}
                  {__("recommended", "beyondseo")}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </ComponentContainer>
  );
};
