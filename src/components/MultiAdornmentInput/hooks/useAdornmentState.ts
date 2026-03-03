import { useCallback, useEffect, useState } from "react";
import { SelectOptionProps } from "vanguard";
import { createAdornment, updateAdornmentKey } from "../adornment-helpers";
import { buildCompleteAdornmentsArray, processAdornmentsToInputsAndVariables } from "../adornment-helpers";
import { Adornment } from "../MultiSelectAdornmentInput";

interface UseAdornmentStateProps {
  initialAdornments: Adornment[];
  onSave: (variableElements: Adornment[]) => void;
  maxAdornments: number;
  maxChars?: number;
  value?: string;
  defaultValue?: string;
}

export const useAdornmentState = (props: UseAdornmentStateProps) => {
  const { initialAdornments, onSave, maxAdornments, maxChars, value, defaultValue = "" } = props;

  // Extract first text adornment if it exists
  const firstTextAdornment = initialAdornments.find((a) => a.type === "text");
  const firstTextValue = firstTextAdornment?.value || "";

  const shouldUseDefault = initialAdornments.length === 0 && (!value || value === "");

  // Initialize with first text adornment value, default value, or empty string
  const initialFirstInputValue = firstTextValue || (shouldUseDefault && defaultValue ? defaultValue : "");

  const [addedAdornments, setAddedAdornments] = useState<Adornment[]>(initialAdornments);
  const [inlineInputValues, setInlineInputValues] = useState<string[]>([]);
  const [firstInputValue, setFirstInputValue] = useState<string>(shouldUseDefault && defaultValue ? defaultValue : "");

  const isOverCharLimit = useCallback(() => {
    if (maxChars === undefined) return false;

    const effectiveValue = value || firstInputValue;

    if (!effectiveValue) return false;

    //this code is for future use if we want to check the length of the value
    // return effectiveValue.length > maxChars;
    return false;
  }, [maxChars, value, firstInputValue]);

  const isEmpty = useCallback(() => {
    const hasAdornments = addedAdornments.length > 0;
    const hasFirstInputText = firstInputValue.trim().length > 0;
    const hasInlineText = inlineInputValues.some((val) => val.trim().length > 0);

    return !hasAdornments && !hasFirstInputText && !hasInlineText;
  }, [addedAdornments, firstInputValue, inlineInputValues]);

  const hasError = useCallback(() => {
    return isEmpty();
  }, [isEmpty]);

  useEffect(() => {
    if (addedAdornments.length > 0 && inlineInputValues.length === 0) {
      const { processedAdornments, inputValues, firstInputText } =
        processAdornmentsToInputsAndVariables(addedAdornments);

      setFirstInputValue(firstInputText);
      setInlineInputValues(inputValues);

      if (processedAdornments.length !== addedAdornments.length) {
        setAddedAdornments(processedAdornments);
      }
    }
  }, [addedAdornments, inlineInputValues.length]);

  const handleAddAdornment = useCallback(
    (e: React.SyntheticEvent, type: string, options: SelectOptionProps) => {
      e.preventDefault();
      if (addedAdornments.length >= maxAdornments) return;

      const firstOption = options.find((opt) => opt.value !== "Remove")!;
      const explicitType = type === "separator" ? ("separator" as const) : ("variable" as const);

      const newAdornment = createAdornment(explicitType, firstOption, addedAdornments);

      const newAdornments = [...addedAdornments, newAdornment];
      setAddedAdornments(newAdornments);

      const newInlineInputValues = [...inlineInputValues, ""];
      setInlineInputValues(newInlineInputValues);

      const completeAdornments = buildCompleteAdornmentsArray(firstInputValue, newInlineInputValues, newAdornments);

      onSave(completeAdornments);
    },
    [addedAdornments, inlineInputValues, firstInputValue, onSave],
  );

  const handleRemoveVariable = useCallback(
    (index: number) => {
      const newAdornments = addedAdornments.filter((_, i) => i !== index);

      const nonTextAdornments = addedAdornments.filter((adornment) => adornment.type !== "text");
      const nonTextIndex = nonTextAdornments.findIndex((_, i) => {
        const nonTextBeforeCount = addedAdornments.slice(0, index).filter((a) => a.type !== "text").length;
        return i === nonTextBeforeCount;
      });

      const newInlineInputValues = [...inlineInputValues];
      let updatedFirstInputValue = firstInputValue;

      if (nonTextIndex !== -1) {
        const currentInputValue = newInlineInputValues[nonTextIndex] || "";

        if (nonTextIndex === 0) {
          updatedFirstInputValue = firstInputValue + currentInputValue;
        } else if (nonTextIndex > 0) {
          newInlineInputValues[nonTextIndex - 1] = (newInlineInputValues[nonTextIndex - 1] || "") + currentInputValue;
        } else if (newInlineInputValues.length > 1) {
          newInlineInputValues[1] = currentInputValue + (newInlineInputValues[1] || "");
        }

        newInlineInputValues.splice(nonTextIndex, 1);
      }

      setFirstInputValue(updatedFirstInputValue);
      setInlineInputValues(newInlineInputValues);

      setAddedAdornments(newAdornments);

      const completeAdornments = buildCompleteAdornmentsArray(
        updatedFirstInputValue,
        newInlineInputValues,
        newAdornments,
      );

      onSave(completeAdornments);
    },
    [addedAdornments, onSave, inlineInputValues, firstInputValue],
  );

  const handleChangeVariable = useCallback(
    (index: number, value: string, optionKey?: string) => {
      const newAdornments = addedAdornments.map((adornment, i) => {
        if (i !== index) return adornment;
        return updateAdornmentKey(adornment, value, optionKey);
      });

      setAddedAdornments(newAdornments);

      const completeAdornments = buildCompleteAdornmentsArray(firstInputValue, inlineInputValues, newAdornments);

      onSave(completeAdornments);
    },
    [addedAdornments, onSave, inlineInputValues, firstInputValue],
  );

  const handleFirstInputChange = useCallback(
    (value: string) => {
      setFirstInputValue(value);

      const completeAdornments = buildCompleteAdornmentsArray(value, inlineInputValues, addedAdornments);

      onSave(completeAdornments);
    },
    [addedAdornments, inlineInputValues, onSave],
  );

  const handleInlineInputChange = useCallback(
    (index: number, value: string) => {
      const newValues = [...inlineInputValues];
      newValues[index] = value;
      setInlineInputValues(newValues);

      const completeAdornments = buildCompleteAdornmentsArray(firstInputValue, newValues, addedAdornments);

      onSave(completeAdornments);
    },
    [inlineInputValues, addedAdornments, firstInputValue, onSave],
  );

  return {
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
  };
};
