import { __ } from "@wordpress/i18n";
import * as React from "react";
import { ComponentContainer, EditModal, Icon, IconNames, Text, TextTypes } from "vanguard";
import styles from "./ErrorModal.module.scss";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  isLoading?: boolean;
  title?: string;
  width?: string;
  primaryButtonText?: string;
  onPrimaryAction?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage = __("Something went wrong from our side, please try again!", "beyondseo"),
  isLoading = false,
  title = "",
  width = "528px",
  primaryButtonText = __("Try again", "beyondseo"),
  onPrimaryAction,
}) => {
  if (!isOpen) return null;

  return (
    <ComponentContainer className={styles.modalWrapper}>
      <EditModal
        title={title}
        close={onClose}
        closeOnSave={false}
        savable={true}
        positiveBtnText={primaryButtonText}
        showPositiveBtnIcon={false}
        saveCallback={onPrimaryAction ?? onClose}
        cancelCallback={onClose}
        savingInProgress={isLoading}
        width={width}
      >
        <div className={styles.errorModalContent}>
          <Icon
            children={IconNames.exclamation}
            hasCircle={true}
            fillColor={"#ffeceb"}
            color={"#ff4d4f"}
            circleSize={40}
            className={styles.errorIcon}
          />
          <Text type={TextTypes.text}>{errorMessage}</Text>
        </div>
      </EditModal>
    </ComponentContainer>
  );
};
