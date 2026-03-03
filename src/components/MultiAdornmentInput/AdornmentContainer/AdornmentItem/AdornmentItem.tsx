import * as React from "react";
import { classNames } from "vanguard";
import styles from "../../MultiSelectAdornmentInput.module.scss";
import { AdornmentSelector } from "./AdornmentSelector";
import {
  SeparatorOptions,
  VariableOptions,
} from "../../../SEOMetadataAndKeywords/SEOMetadata/SEOMetaTitleEditor/AdornmentOptions";
import { Adornment } from "../../MultiSelectAdornmentInput";
import { __ } from "@wordpress/i18n";

interface AdornmentItemProps {
  adornment: Adornment;
  index: number;
  onChangeVariable: (index: number, value: string, optionKey?: string) => void;
  onRemoveVariable: (index: number) => void;
}

export const AdornmentItem = (props: AdornmentItemProps) => {
  const { adornment, index, onChangeVariable, onRemoveVariable } = props;
  const getOptionsForType = (type: string) => {
    switch (type) {
      case "variable":
        return VariableOptions;
      case "separator":
        return SeparatorOptions;
      default:
        return [];
    }
  };

  return (
    <div className={classNames(styles.adornmentItem)}>
      <AdornmentSelector
        key={`${adornment.key}-${index}-${adornment.value}`}
        type={adornment.type!}
        options={getOptionsForType(adornment.type!)}
        index={index}
        value={adornment.value!}
        changeFn={onChangeVariable}
        removeFn={onRemoveVariable}
        maxMenuItemsUntilScroll={adornment.type === "variable" ? 10 : undefined}
      />
    </div>
  );
};
