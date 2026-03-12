import { __ } from "@wordpress/i18n";
import * as React from "react";
import { SyntheticEvent, useEffect, useState, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import styles from "./SEOMetaDescriptionEditor.module.scss";
import {
  ButtonSizes,
  ButtonTypes,
  classNames,
  ComponentContainer,
  FontWeights,
  Form,
  Text,
  Textarea,
  useFormConfig,
} from "vanguard";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { AppSlice } from "@src/App.slice";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { WPWebPageDescriptionMetaTag } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageDescriptionMetaTag";
import { SEOMetaTitleEditorProps } from "@components/SEOMetadataAndKeywords/SEOMetadataAndKeywords";
import { useElementorDirtyTrigger } from "@hooks/use-elementor-dirty-trigger";

export const seoMetaDescriptionEditorProps: SEOMetaTitleEditorProps = {
  title: "",
  description: "",
  setSeoTitle: () => { },
  setSeoDescription: () => { },
};

export const SEOMetaDescriptionEditor = (props: SEOMetaTitleEditorProps) => {
  const { description: seoDescription } = props;
  const [textareaValue, setTextareaValue] = useState<string | null>(null);
  const [switchOpen, setSwitchOpen] = useState(false);
  const [initialSaveDone, setInitialSaveDone] = useState(false);
  const { metaTagsData, previewDescription } = useSelector((state: RootState) => state.app);
  const { setSeoDescription, setPreviewDescription } = AppSlice;
  const { currentPost } = useSelector((state: RootState) => state.post);

  const dispatch = useAppDispatch();

  // Trigger Elementor's dirty state when SEO meta description changes
  useElementorDirtyTrigger([previewDescription]);

  // Debounced save function - saves to server after 500ms delay
  const debouncedSaveRef = useRef(
    debounce((descriptionText: string) => {
      const oldDescription = { ...metaTagsData?.description } as WPWebPageDescriptionMetaTag;
      if (oldDescription) {
        oldDescription.content = descriptionText;
      }

      dispatch(
        MetatagsStore.postApiMetatagsByPostIdThunk({
          postId: getPathId(),
          requestBody: {
            description: oldDescription,
          },
          queryParams: { noCache: true },
        }),
      )
        .then((response: any) => {
          return response;
        })
        .catch((error: Error) => {
          throw error;
        });
    }, 800),
  );

  const handleSaveDescription = useCallback(
    (descriptionText: string) => {
      debouncedSaveRef.current(descriptionText);
    },
    [dispatch, metaTagsData],
  );

  const { formConfig } = useFormConfig({
    slice: AppSlice as any,
    reducer: (state: RootState) => state.app,
    inputs: {
      seoDescription: {
        validation: {
          urlNotAllowed: true,
          maxLength: 300,
        },
      },
      seoTitle: {},
    },
  });

  useEffect(() => {
    setTextareaValue(seoDescription);
  }, [seoDescription]);

  useEffect(() => {
    if (!initialSaveDone && seoDescription && !metaTagsData?.description) {
      const descriptionObject = {
        content: seoDescription,
        postId: getPathId(),
        objectType:
          "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\MetaTags\\Tags\\WPWebPageDescriptionMetaTag",
      };

      dispatch(
        MetatagsStore.postApiMetatagsByPostIdThunk({
          postId: getPathId(),
          requestBody: { description: descriptionObject },
          queryParams: { noCache: true },
        }),
      ).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          setInitialSaveDone(true);
        }
      });
    }
  }, [seoDescription, metaTagsData, initialSaveDone, dispatch]);

  const handleEmojiSelect = (emoji: string) => {
    const newValue = (textareaValue || "") + emoji;
    setTextareaValue(newValue);
    dispatch(setSeoDescription(newValue));
    dispatch(setPreviewDescription(newValue));

    // Debounced save to server
    handleSaveDescription(newValue);
  };

  const TEXT_RECOMMENDED = __("recommended", "beyondseo");

  //This is a workaround and must be replaced if the vanguard input gets a recomended prop
  // Append "recommended" to counter text
  useEffect(() => {
    const appendRecommendedText = () => {
      const counterElements = document.querySelectorAll(
        ".paragraph.rc-text.text.text-wrap.text-initial.notranslate.vanguard-input-counter:not([data-recommended])",
      );
      counterElements.forEach((element) => {
        if (element.textContent && !element.hasAttribute("data-recommended")) {
          element.textContent = `${element.textContent} ${TEXT_RECOMMENDED}`;
          element.setAttribute("data-recommended", "true");
        }
      });
    };

    // Run immediately and set up observer
    appendRecommendedText();

    const observer = new MutationObserver(appendRecommendedText);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <ComponentContainer
      testId={"seo-description-editor-container"}
      className={classNames(styles.seoDescriptionEditorContainer)}
    >
      <div className={styles.descriptionContainer}>
        <div className={styles.headerControls}>
          <Text className={styles.headerControlsTitle} fontWeight={FontWeights.medium}>
            {__("Description", "beyondseo")}
          </Text>
        </div>

        <Form
          config={formConfig}
          onChange={(e: any) => {
          }}
        >
          <Textarea
            formconfig={formConfig.seoDescription}
            required={false}
            className={styles.textareaContainer}
            labelType={"outer"}
            disabled={switchOpen}
            placeholder={__("Enter SEO meta description", "beyondseo")}
            rows={3}
            counter={true}
            maxLength={300}
            defaultValue={currentPost?.excerpt.filtered || ""}
            onChange={(e: any) => {
              const value = e.target.value;
              setTextareaValue(value);
              dispatch(setSeoDescription(value));
              dispatch(setPreviewDescription(value));

              // Debounced save to server
              handleSaveDescription(value);
            }}
            value={textareaValue || ""}
          />
        </Form>
      </div>
    </ComponentContainer>
  );
};
