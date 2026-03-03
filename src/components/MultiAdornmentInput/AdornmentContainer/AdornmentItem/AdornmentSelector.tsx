import { useState } from "react";
import { ComponentContainer, Select, SelectOptionProps } from "vanguard";
import styles from "../../MultiSelectAdornmentInput.module.scss";
import { __ } from "@wordpress/i18n";

interface AdornmentSelectorProps {
  type: string;
  options: SelectOptionProps;
  index: number;
  value: string;
  changeFn: (index: number, value: string, optionKey?: string) => void;
  removeFn: (index: number) => void;
  maxMenuItemsUntilScroll?: number;
}

export const AdornmentSelector = (props: AdornmentSelectorProps) => {
  const { type, options, value, changeFn, removeFn, index, maxMenuItemsUntilScroll } = props;

  const [selectValue, setSelectValue] = useState(value);

  const handleSelectChange = (event: React.ChangeEvent<{ value: string }>) => {
    const newValue = event.target.value;
    if (newValue === "Remove") {
      removeFn(index);
    } else {
      setSelectValue(__(newValue, "beyondseo"));
      const selectedOption = options.find((opt:any) => opt.value === newValue);
      const optionKey = selectedOption?.key?.toString();
      changeFn(index, newValue, optionKey);
    }
  };

  return (
    <ComponentContainer>
      <Select
        options={options}
        value={selectValue}
        onChange={handleSelectChange}
        theme={"grey"}
        containToSelectWidth={true}
        maxMenuItemsUntilScroll={maxMenuItemsUntilScroll}
        className={type === "separator" ? styles.separatorSelector : undefined}
      />
    </ComponentContainer>
  );
};
