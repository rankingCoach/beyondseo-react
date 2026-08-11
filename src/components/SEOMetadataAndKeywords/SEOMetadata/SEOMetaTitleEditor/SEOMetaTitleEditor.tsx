import * as React from "react";
import { useCallback, useMemo, useRef, useState } from "react";
import styles from "./SEOMetaTitleEditor.module.scss";
import { classNames, ComponentContainer } from "vanguard";
import { Adornment, MultiSelectAdornmentInput } from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import { AdornmentConfig } from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { RootState } from "@src/main.store";
import { useSelector } from "react-redux";
import { SEOMetaTitleEditorProps } from "@components/SEOMetadataAndKeywords/SEOMetadataAndKeywords";
import { SeparatorOptions, VariableOptions } from "./AdornmentOptions";
import { saveTitleToServer } from "./saveTitleToServerHelper";
import {
  adornmentsToTemplate,
  buildVariablesMap,
  resolveAdornments,
  templateToAdornments,
} from "@helpers/template-helpers";
import { StructuredTemplate } from "@src/types/meta-tags";
import { AppSlice } from "@src/App.slice";
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
  const { metaTagsData, previewTitle, wpVariables } = useSelector((state: RootState) => state.app);
  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  const [switchOpen, setSwitchOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { setPreviewTitle, setParsedTitle, setSeoTitle } = AppSlice;

  // Trigger Elementor's dirty state when SEO meta title changes
  useElementorDirtyTrigger([previewTitle]);

  const variablesMap = useMemo(() => buildVariablesMap(wpVariables), [wpVariables]);
  const variablesMapRef = useRef(variablesMap);
  variablesMapRef.current = variablesMap;

  // The API returns the title as a structured template array
  // (text / variable / separator elements); map it to editor adornments once.
  const initialAdornments = useMemo(
    () => templateToAdornments(metaTagsData?.title?.template),
    [metaTagsData?.title?.template],
  );

  const debouncedSaveRef = useRef(
    debounce((template: StructuredTemplate) => {
      saveTitleToServer(template, dispatch);
    }, 500),
  );

  const handleSave = useCallback(
    (variableElements?: Adornment[]) => {
      const elementsToUse = variableElements ?? [];

      // Live preview: resolve the adornments client-side against the loaded
      // WP variables (the server no longer returns a parsed string).
      const resolved = resolveAdornments(elementsToUse, variablesMapRef.current);
      dispatch(setPreviewTitle(resolved));
      dispatch(setParsedTitle(resolved || null));
      dispatch(setSeoTitle(resolved));

      debouncedSaveRef.current(adornmentsToTemplate(elementsToUse));
    },
    [dispatch],
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
