import { __ } from "@wordpress/i18n";
import React, { useState } from "react";
import { Button, ButtonSizes, ButtonTypes, ComponentContainer, EditModal, Icon, IconNames, Text, TextTypes } from "vanguard";
import styles from "./ErrorModal.module.scss";
import { rcWindow } from "@stores/window.store";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  errorDetails?: any;
  isLoading?: boolean;
  title?: string;
  width?: string;
  primaryButtonText?: string;
  contactSupportUrl?: string;
  onPrimaryAction?: () => void;
}

export const ErrorModal: React.FC<ErrorModalProps> = ({
  isOpen,
  onClose,
  errorMessage = __("Something went wrong from our side, please try again!", "beyondseo"),
  errorDetails,
  isLoading = false,
  title = "",
  width = "528px",
  primaryButtonText = __("Contact customer support", "beyondseo"),
  contactSupportUrl = "",
  onPrimaryAction,
}) => {
  const [hasCopied, setHasCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Fallback nicely if contactSupportUrl is not provided
  const resolvedSupportUrl = contactSupportUrl ||
    (rcWindow?.rankingCoachReactData?.locale?.startsWith("de")
      ? "https://mein.ionos.de/support/contact"
      : "https://my.ionos.com/support/contact");

  if (!isOpen) return null;

  const handleCopyClick = async () => {
    try {
      const textToCopy = typeof errorDetails === "string" ? errorDetails : JSON.stringify(errorDetails, null, 2);
      await navigator.clipboard.writeText(textToCopy);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  const handlePrimaryAction = () => {
    if (onPrimaryAction) {
      onPrimaryAction();
    } else {
      if (resolvedSupportUrl) {
        window.open(resolvedSupportUrl, "_blank");
      }
      onClose();
    }
  };

  return (
    <ComponentContainer className={styles.modalWrapper}>
      <EditModal
        title={title}
        close={onClose}
        closeOnSave={false}
        savable={true}
        positiveBtnText={primaryButtonText}
        showPositiveBtnIcon={false}
        saveCallback={handlePrimaryAction}
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
          {errorDetails && (
            <div className={styles.errorDetailsContainer}>
              <div className={styles.errorDetailsHeader}>
                <div
                  className={styles.errorDetailsToggleInner}
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  <Text type={TextTypes.textHelp}>{__("Error details", "beyondseo")}</Text>
                  <Icon children={isExpanded ? IconNames.caretUp : IconNames.caretDown} />
                </div>
                <Button onClick={handleCopyClick} type={ButtonTypes.secondary} size={ButtonSizes.small}>
                  {hasCopied ? __("Copied!", "beyondseo") : __("Copy Error", "beyondseo")}
                </Button>
              </div>
              {isExpanded && (
                <div className={styles.errorDetailsContent}>
                  <pre className={styles.errorPre}>{typeof errorDetails === "string" ? errorDetails : JSON.stringify(errorDetails, null, 2)}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </EditModal>
    </ComponentContainer>
  );
};
