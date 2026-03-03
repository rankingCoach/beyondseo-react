import * as React from "react";
import { Button, ButtonSizes, ButtonTypes, IconNames, Text, SelectOptionProps } from "vanguard";
import styles from "../MultiSelectAdornmentInput.module.scss";
import { AdornmentConfig } from "../MultiSelectAdornmentInput";
import { __ } from "@wordpress/i18n";

interface AdornmentControlsProps {
  title?: string;
  disabled?: boolean;
  onAddAdornment: (e: React.SyntheticEvent, type: string, options: SelectOptionProps) => void;
  onEmojiSelect?: (emoji: string) => void;
  adornmentCount: number;
  maxAdornments: number;
  variableConfig: AdornmentConfig;
  separatorConfig?: AdornmentConfig;
}

export const AdornmentControls = (props: AdornmentControlsProps) => {
  const {
    title = __("Add Adornments", "beyondseo"),
    disabled = false,
    onAddAdornment,
    onEmojiSelect,
    adornmentCount,
    maxAdornments,
    variableConfig,
    separatorConfig,
  } = props;
  return (
    <div className={styles.headerControlsContainer}>
      <div className={styles.leftAlignControls}>
        <Text className={styles.titleText}>{title}</Text>
        {!disabled && (
          <>
            <Button
              key={"variable"}
              onClick={(e:any) => onAddAdornment(e, "variable", variableConfig.options)}
              disabled={adornmentCount >= maxAdornments}
              size={ButtonSizes.small}
              iconLeft={IconNames.add}
              type={ButtonTypes.secondary}
            >
              {__(variableConfig.buttonText, "beyondseo")}
            </Button>

            {separatorConfig && (
                <Button
                key={"separator"}
                onClick={(e:any) => onAddAdornment(e, "separator", separatorConfig.options)}
                disabled={adornmentCount >= maxAdornments}
                size={ButtonSizes.small}
                iconLeft={IconNames.add}
                type={ButtonTypes.secondary}
                >
                {__(separatorConfig.buttonText, "beyondseo")}
                </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
