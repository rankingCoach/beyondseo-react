import { __ } from "@wordpress/i18n";
import * as React from "react";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { classNames, ComponentContainer, Render, VanguardStyle } from "vanguard";
import { SERPPreview } from "@components/SEOMetadataAndKeywords/SEOMetadata/SERPPreview/SERPPreview";
import {
  SEOMetaTitleEditor,
  seoMetaTitleEditorProps,
} from "@components/SEOMetadataAndKeywords/SEOMetadata/SEOMetaTitleEditor/SEOMetaTitleEditor";
import {
  SEOMetaDescriptionEditor,
  seoMetaDescriptionEditorProps,
} from "@components/SEOMetadataAndKeywords/SEOMetadata/SEOMetaDescriptionEditor/SEOMetaDescriptionEditor";
import { KeywordManager } from "@components/SEOMetadataAndKeywords/SEOKeywords/KeywordManager/KeywordManager";
import { AppSlice } from "@src/App.slice";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";

export interface SEOMetaTitleEditorProps {
  title: string | null;
  description: string | null;
  setSeoTitle: (title: string) => void;
  setSeoDescription: (description: string) => void;
}

export const SEOMetadataAndKeywords = (props: any) => {
  const { seoTitle, seoDescription, isMetaTagsDataLoaded, metaTagsData } = useSelector((state: RootState) => state.app);
  const { currentPost, isCurrentPostLoaded } = useSelector((state: RootState) => state.post);
  const { setSeoTitle, setSeoDescription } = AppSlice;
  const dispatch = useAppDispatch();
  const { triggerRecalculation } = useScoreRecalculation();

  // Track previous values for change detection
  const previousValues = useRef({ seoTitle: "", seoDescription: "" });

  useEffect(() => {
    if (isCurrentPostLoaded && !metaTagsData?.title) {
      if (!seoTitle) dispatch(setSeoTitle(currentPost?.title.rendered));
    }
    if (isCurrentPostLoaded && !metaTagsData?.description) {
      if (!seoDescription) dispatch(setSeoDescription(currentPost?.excerpt.filtered));
    }
  }, [isCurrentPostLoaded, metaTagsData]);

  // Monitor SEO title and description changes for debounced recalculation
  useEffect(() => {
    const currentSeoTitle = seoTitle || "";
    const currentSeoDescription = seoDescription || "";

    // Check if values have actually changed and are not initial empty values
    if (previousValues.current.seoTitle !== "" || previousValues.current.seoDescription !== "") {
      if (
        previousValues.current.seoTitle !== currentSeoTitle ||
        previousValues.current.seoDescription !== currentSeoDescription
      ) {
        triggerRecalculation(false);
      }
    }

    // Update previous values
    previousValues.current = {
      seoTitle: currentSeoTitle,
      seoDescription: currentSeoDescription,
    };
  }, [seoTitle, seoDescription, triggerRecalculation]);

  seoMetaTitleEditorProps.title = seoTitle;
  seoMetaTitleEditorProps.description = seoDescription;
  seoMetaTitleEditorProps.setSeoTitle = (title: string) => dispatch(setSeoTitle(title));
  seoMetaTitleEditorProps.setSeoDescription = (description: string) => dispatch(setSeoDescription(description));

  seoMetaDescriptionEditorProps.title = seoTitle;
  seoMetaDescriptionEditorProps.description = seoDescription;
  seoMetaDescriptionEditorProps.setSeoTitle = (title: string) => dispatch(setSeoTitle(title));
  seoMetaDescriptionEditorProps.setSeoDescription = (description: string) => dispatch(setSeoDescription(description));

  return (
    <>
      <Render if={isMetaTagsDataLoaded}>
        <ComponentContainer className={classNames("serp-preview-outer-container", VanguardStyle.mb3)}>
          <SERPPreview />
        </ComponentContainer>

        <ComponentContainer className={classNames("seo-title-editor-outer-container", VanguardStyle.mb3)}>
          <SEOMetaTitleEditor {...seoMetaTitleEditorProps} />
        </ComponentContainer>

        <ComponentContainer className={classNames("seo-description-editor-outer-container", VanguardStyle.mb3)}>
          <SEOMetaDescriptionEditor {...seoMetaDescriptionEditorProps} />
        </ComponentContainer>

        <ComponentContainer className={classNames("seo-keywords-manager-outer-container", VanguardStyle.mb3)}>
          <KeywordManager />
        </ComponentContainer>
      </Render>
    </>
  );
};
