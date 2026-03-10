import * as React from "react";
import { SyntheticEvent, useCallback, useRef, useState, useMemo } from "react";
import styles from "./SEOMetaTitleEditor.module.scss";
import { classNames, ComponentContainer, IconNames, ModalService, useFormConfig } from "vanguard";
import { Adornment, MultiSelectAdornmentInput } from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import { AdornmentConfig } from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { RootState } from "@src/main.store";
import { FeatureSwitch } from "@components/Common/FeatureSwitch/FeatureSwitch";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { useSelector } from "react-redux";
import { SEOMetaTitleEditorProps } from "@components/SEOMetadataAndKeywords/SEOMetadataAndKeywords";
import { SeparatorOptions, VariableOptions } from "./AdornmentOptions";
import { saveToServer } from "./saveTitleToServerHelper";
import debounce from "lodash.debounce";
import { __ } from "@wordpress/i18n";
import { useElementorDirtyTrigger } from "@hooks/use-elementor-dirty-trigger";
const VARIABLE_BUTTON_TEXT = __("Add Variable", "beyondseo");
const SEPARATOR_BUTTON_TEXT = __("Add Separator", "beyondseo");

export const seoMetaTitleEditorProps: SEOMetaTitleEditorProps = {
  title: "",
  description: "",
  setSeoTitle: () => { },
  setSeoDescription: () => { },
};

const variableConfig: AdornmentConfig = {
  options: VariableOptions,
  buttonText: __(VARIABLE_BUTTON_TEXT, "beyondseo"),
};

const separatorConfig: AdornmentConfig = {
  options: SeparatorOptions,
  buttonText: __(SEPARATOR_BUTTON_TEXT, "beyondseo"),
};

export const SEOMetaTitleEditor = (props: SEOMetaTitleEditorProps) => {
  const { metaTagsData, previewTitle } = useSelector((state: RootState) => state.app);
  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  const [switchOpen, setSwitchOpen] = useState(false);
  const dispatch = useAppDispatch();

  // Trigger Elementor's dirty state when SEO meta title changes
  useElementorDirtyTrigger([previewTitle]);

  const initialAdornments = useMemo(
    () =>
      (metaTagsData?.title?.variables?.elements ?? []).map((variable: any) => ({
        key: variable.key,
        value: variable.value,
        type: variable.type,
      })),
    [metaTagsData?.title?.variables?.elements],
  );

  const debouncedSaveRef = useRef(
    debounce((titleText: string, variableElements: Adornment[]) => {
      saveToServer(titleText, currentPost?.id!, variableElements, dispatch, metaTagsData);
    }, 500),
  );

  const handleSave = useCallback(
    (variableElements?: Adornment[]) => {
      const elementsToUse = variableElements ?? [];

      debouncedSaveRef.current(previewTitle || "", elementsToUse);
    },
    [previewTitle],
  );

  return (
    <ComponentContainer testId={"seo-title-editor-container"} className={classNames(styles.seoTitleEditorContainer)}>
      {isCurrentPostLoaded && initialAdornments && (
        <MultiSelectAdornmentInput
          disable={switchOpen}
          title={__("Title", "beyondseo")}
          variableConfig={variableConfig}
          separatorConfig={separatorConfig}
          initialAdornments={initialAdornments}
          onSave={handleSave}
          value={previewTitle || ""}
          maxChars={120}
          defaultValue={currentPost?.title.rendered}
        />
      )}
    </ComponentContainer>
  );
};
