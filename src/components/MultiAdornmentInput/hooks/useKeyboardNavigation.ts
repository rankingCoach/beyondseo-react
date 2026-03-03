import { useCallback } from "react";
import styles from "../MultiSelectAdornmentInput.module.scss";

interface UseKeyboardNavigationProps {
  handleRemoveVariable: (index: number) => void;
  firstInputRef: React.RefObject<HTMLInputElement>;
}

export const useKeyboardNavigation = (props: UseKeyboardNavigationProps) => {
  const { handleRemoveVariable, firstInputRef } = props;

  const handleInlineInputKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
      const input = event.target as HTMLInputElement;
      const hasSelection = input.selectionStart !== input.selectionEnd;

      if (event.key === "Backspace" && input.selectionStart === 0 && !hasSelection) {
        event.preventDefault();

        let inputToFocus: HTMLInputElement | null = null;

        const allInputs = document.querySelectorAll(`.${styles.inlineInput}`);

        if (allInputs[index]) {
          inputToFocus = allInputs[index] as HTMLInputElement;
        } else {
          inputToFocus = firstInputRef.current;
        }

        handleRemoveVariable(index);

        setTimeout(() => {
          if (inputToFocus) {
            inputToFocus.focus();
          } else if (firstInputRef.current) {
            firstInputRef.current.focus();
          }
        }, 10);
      } else if (event.key === "ArrowLeft" && input.selectionStart === 0 && !hasSelection) {
        event.preventDefault();

        let previousInput: HTMLInputElement | null = null;

        if (index === 0 || index === -1) {
          previousInput = firstInputRef.current;
        } else {
          const allInlineInputs = Array.from(document.querySelectorAll(`.${styles.inlineInput}`)).filter(
            (el) => el !== firstInputRef.current,
          );

          if (allInlineInputs[index - 1]) {
            previousInput = allInlineInputs[index - 1] as HTMLInputElement;
          } else {
            previousInput = firstInputRef.current;
          }
        }

        if (previousInput) {
          previousInput.focus();
          const length = previousInput.value.length;
          previousInput.setSelectionRange(length, length);
        }
      } else if (event.key === "ArrowRight" && input.selectionStart === input.value.length && !hasSelection) {
        event.preventDefault();

        let nextInput: HTMLInputElement | null = null;

        if (index === -1 || input === firstInputRef.current) {
          const allInlineInputs = Array.from(document.querySelectorAll(`.${styles.inlineInput}`)).filter(
            (el) => el !== firstInputRef.current,
          );

          if (allInlineInputs.length > 0) {
            nextInput = allInlineInputs[0] as HTMLInputElement;
          }
        } else {
          const allInlineInputs = Array.from(document.querySelectorAll(`.${styles.inlineInput}`)).filter(
            (el) => el !== firstInputRef.current,
          );

          const currentInputIndex = allInlineInputs.findIndex((el) => el === input);

          if (currentInputIndex !== -1 && currentInputIndex < allInlineInputs.length - 1) {
            nextInput = allInlineInputs[currentInputIndex + 1] as HTMLInputElement;
          }
        }

        if (nextInput) {
          nextInput.focus();
          nextInput.setSelectionRange(0, 0);
        }
      }
    },
    [handleRemoveVariable, firstInputRef, styles.inlineInput],
  );

  return { handleInlineInputKeyDown };
};
