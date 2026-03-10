import * as React from "react";
import { SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./SocialTab.module.scss";
import tabStyles from "../Tabs.module.scss";
import { ComponentContainer, FontWeights, Form, Select, Text, Textarea, useFormConfig, VanguardStyle } from "vanguard";
import { FacebookPreview } from "./SocialTabPreviews/FacebookPreview";
import { XPreview } from "./SocialTabPreviews/XPreview";
import { LinkedInPreview } from "./SocialTabPreviews/LinkedInPreview";
import { RootState } from "@src/main.store";
import { useAppDispatch } from "@hooks/use-app-dispatch";
import { getPathId } from "@helpers/get-path-id";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { FeatureSwitch } from "@components/Common/FeatureSwitch/FeatureSwitch";
import { SocialTabPlaceholder } from "./SocialTabPlaceholder";
import { SocialStore } from "@src/stores/swagger/api/SocialStore";
import PlaceholderImage from "@src/assets/image-placeholder.svg";
import { useScoreRecalculation } from "@contexts/ScoreRecalculationContext";
import classNames from "classnames";
import { __ } from "@wordpress/i18n";

export const SocialTab = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [seoUrl, setSeoUrl] = useState<string | null>(null);
  const [titleSwitchOpen, setTitleSwitchOpen] = useState(false);
  const [descriptionSwitchOpen, setDescriptionSwitchOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageSource, setSelectedImageSource] = useState<string>("");
  const [imageSources, setImageSources] = useState<
    Array<{ source?: string; label: string; value?: string; default?: boolean }>
  >([]);
  const [activeImageUrl, setActiveImageUrl] = useState<string>(PlaceholderImage);
  const dispatch = useAppDispatch();
  const { metaTagsData, seoTitle, seoDescription } = useSelector((state: RootState) => state.app);
  const { currentPost } = useSelector((state: RootState) => state.post);
  const { triggerRecalculation } = useScoreRecalculation();

  const { formConfig } = useFormConfig({
    inputs: {
      socialTitle: {
        validation: {
          urlNotAllowed: true,
          maxLength: 60,
        },
      },
      socialDescription: {
        validation: {
          urlNotAllowed: true,
          maxLength: 300,
        },
      },
    },
  });

  useEffect(() => {
    setSeoUrl(currentPost?.link ?? null);

    const isGutenberg = typeof wp !== "undefined" && wp.data && wp.data.select("core/editor");

    if (isGutenberg) {
      const { select, subscribe } = wp.data;

      const getSlug = () => select("core/editor")?.getEditedPostAttribute("slug");
      const getCurrentPost = () => select("core/editor")?.getCurrentPost();

      let currentSlug = getSlug();
      let currentPost = getCurrentPost();

      if (!currentSlug || !currentPost || !currentPost.link || !currentPost.slug) {
        return;
      }

      const savedSlug = currentPost.slug;
      const previewURL = currentPost.link;

      const unsubscribe = subscribe(() => {
        const updatedSlug = getSlug();
        if (!updatedSlug || updatedSlug === currentSlug) return;

        currentSlug = updatedSlug;
        const replacedURL = previewURL.replace(new RegExp(`/${savedSlug}(/|\\?|$)`), `/${updatedSlug}$1`);

        setSeoUrl(replacedURL);
      });

      return () => unsubscribe();
    } else {
      const slugInput = document.querySelector("#post_name") as HTMLInputElement | null;
      const permalinkEl = document.querySelector("#sample-permalink") as HTMLElement | null;

      if (slugInput && permalinkEl) {
        const getCurrentPermalink = () => permalinkEl.textContent || permalinkEl.innerText || "";

        const observer = new MutationObserver(() => {
          const newPermalink = getCurrentPermalink();
          setSeoUrl(newPermalink);
        });

        observer.observe(permalinkEl, { childList: true, subtree: true });
        observer.observe(slugInput, { attributes: true, childList: true, subtree: true });

        return () => observer.disconnect();
      }
    }
  }, [currentPost]);

  const refreshReactComponent = async () => {
    setIsLoading(true);
    try {
      const socialData = await dispatch(
        SocialStore.getApiSocialByPostIdThunk({
          postId: getPathId(),
          queryParams: { noCache: true },
        }),
      ).unwrap();

      if (socialData?.social_title?.content) {
        setTitle(socialData.social_title.content);
      } else if (seoTitle) {
        setTitle(seoTitle);
      }

      if (socialData?.social_description?.content) {
        setDescription(socialData.social_description.content);
      } else if (seoDescription) {
        setDescription(seoDescription);
      }

      if (socialData?.selected_image_source) {
        setSelectedImageSource(socialData.selected_image_source);
      }

      const imageSourcesData = await dispatch(
        SocialStore.getApiSocialImageSourcesByPostIdThunk({
          postId: getPathId(),
          queryParams: { noCache: true },
        }),
      ).unwrap();

      if (imageSourcesData.image_sources) {
        const sources = imageSourcesData.image_sources;
        setImageSources(sources);

        if (!socialData?.selected_image_source) {
          const defaultSource = sources.find((source) => source.default === true);

          if (defaultSource?.source) {
            setSelectedImageSource(defaultSource.source);
            updateActiveImageUrl(defaultSource.source, sources);
          } else if (sources.length > 0 && sources[0].source) {
            setSelectedImageSource(sources[0].source as string);
            updateActiveImageUrl(sources[0].source as string, sources);
          }
        } else {
          updateActiveImageUrl(socialData.selected_image_source, sources);
        }
      }
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for global score recalculation events for logging
  useEffect(() => {
    const handleScoreRecalculated = (event: CustomEvent<{ timestamp: number; apiResponse?: any; error?: any }>) => {
      const { error } = event.detail;
      if (error) {
      } else {
      }
    };

    document.addEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);

    return () => {
      document.removeEventListener("rankingcoach-score-recalculated", handleScoreRecalculated as EventListener);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const socialData = await dispatch(
          SocialStore.getApiSocialByPostIdThunk({
            postId: getPathId(),
            queryParams: { noCache: true },
          }),
        ).unwrap();

        if (socialData?.social_title?.content) {
          setTitle(socialData.social_title.content);
        } else if (seoTitle) {
          setTitle(seoTitle);
        }

        if (socialData?.social_description?.content) {
          setDescription(socialData.social_description.content);
        } else if (seoDescription) {
          setDescription(seoDescription);
        }

        if (socialData?.selected_image_source) {
          setSelectedImageSource(socialData.selected_image_source);
        }

        const imageSourcesData = await dispatch(
          SocialStore.getApiSocialImageSourcesByPostIdThunk({
            postId: getPathId(),
            queryParams: { noCache: true },
          }),
        ).unwrap();

        if (imageSourcesData.image_sources) {
          const sources = imageSourcesData.image_sources;
          setImageSources(sources);

          if (!socialData?.selected_image_source) {
            const defaultSource = sources.find((source) => source.default === true);

            if (defaultSource?.source) {
              setSelectedImageSource(defaultSource.source);
              updateActiveImageUrl(defaultSource.source, sources);
            } else if (sources.length > 0 && sources[0].source) {
              setSelectedImageSource(sources[0].source as string);
              updateActiveImageUrl(sources[0].source as string, sources);
            }
          } else {
            updateActiveImageUrl(socialData.selected_image_source, sources);
          }
        }
      } catch (error) {

        if (seoTitle) setTitle(seoTitle);
        if (seoDescription) setDescription(seoDescription);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [seoTitle, seoDescription]);

  const updateActiveImageUrl = (
    sourceId: string,
    sources: Array<{ source?: string; label: string; value?: string }> = imageSources,
  ) => {
    const selectedSource = sources.find((src) => src.source === sourceId);

    if (selectedSource && selectedSource.value && selectedSource.value.startsWith("http")) {
      setActiveImageUrl(selectedSource.value);
    } else {
      setActiveImageUrl(PlaceholderImage);
    }
  };

  const handleSave = async (field: "title" | "description", value: string) => {
    const payload: any = {};

    if (field === "title") {
      payload.title = {
        type: "social_title",
        parsed: "",
        postId: getPathId(),
        content: value,
        template: "{content}",
        autoGenerated: false,
        objectType:
          "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\MetaTags\\Social\\WPWebPageSocialTitleMetaTag",
      };
    } else {
      payload.description = {
        type: "social_description",
        parsed: "",
        postId: getPathId(),
        content: value,
        template: "{content}",
        autoGenerated: false,
        objectType:
          "App\\Domain\\Integrations\\WordPress\\Seo\\Entities\\WebPages\\Content\\Elements\\MetaTags\\Social\\WPWebPageSocialDescriptionMetaTag",
      };
    }

    await dispatch(
      SocialStore.postApiSocialByPostIdThunk({
        postId: getPathId(),
        requestBody: payload,
        queryParams: { noCache: true },
      }),
    );

    // Trigger immediate recalculation after social metadata change
    triggerRecalculation(true);
  };

  if (isLoading) {
    return <SocialTabPlaceholder />;
  }

  return (
    <div className={classNames(styles.socialTabContainer, tabStyles.tabContent)}>
      {isLoading ? (
        <SocialTabPlaceholder />
      ) : (
        <ComponentContainer>
          <Text fontWeight={FontWeights.bold}>{__("Preview", "beyondseo")}</Text>

          <div className={styles.previewsWrapper}>
            <FacebookPreview
              title={title || __("Enter a title", "beyondseo")}
              domain={seoUrl || __("yourdomain.com", "beyondseo")}
              imageUrl={activeImageUrl}
            />

            <XPreview
              title={title || __("Enter a title", "beyondseo")}
              domain={seoUrl || __("yourdomain.com", "beyondseo")}
              imageUrl={activeImageUrl}
            />

            <LinkedInPreview
              title={title || __("Enter a title", "beyondseo")}
              domain={seoUrl || __("yourdomain.com", "beyondseo")}
              imageUrl={activeImageUrl}
            />
          </div>

          <ComponentContainer className={VanguardStyle.mt2}>
            <Select
              required={true}
              className={styles.selectContainer}
              label={__("Image Source", "beyondseo")}
              labelType="outer"
              onChange={async (e: any) => {
                const newValue = e.target.value;
                setSelectedImageSource(newValue);
                updateActiveImageUrl(newValue);
                await dispatch(
                  SocialStore.postApiSocialByPostIdThunk({
                    postId: getPathId(),
                    requestBody: {
                      selectedImageSource: newValue,
                    },
                    queryParams: { noCache: true },
                  }),
                );

                // Trigger immediate recalculation after image source change
                triggerRecalculation(true);
              }}
              value={selectedImageSource}
              options={imageSources
                .filter((source) => source.source)
                .map((source) => ({
                  key: source.source as string,
                  value: source.source as string,
                  title: source.label,
                }))}
            />
          </ComponentContainer>

          <div className={styles.formContainer}>
            <div className={styles.inputWrapper}>
              <Form config={formConfig} onChange={(e: any) => { }}>
                <Textarea
                  formconfig={formConfig.socialTitle}
                  required={true}
                  className={styles.textareaContainer}
                  label={__("Title", "beyondseo")}
                  labelType="outer"
                  placeholder={__("Enter meta title", "beyondseo")}
                  rows={1}
                  counter={true}
                  maxLength={60}
                  value={title}
                  disabled={titleSwitchOpen}
                  onChange={(e: any) => setTitle(e.target.value)}
                  onBlur={(e: any) => handleSave("title", e.target.value)}
                />
              </Form>
            </div>

            <div className={styles.inputWrapper}>
              <Form config={formConfig} onChange={(e: any) => { }}>
                <Textarea
                  formconfig={formConfig.socialDescription}
                  required={true}
                  className={styles.textareaContainer}
                  label={__("Description", "beyondseo")}
                  labelType="outer"
                  placeholder={__("Enter meta description", "beyondseo")}
                  rows={3}
                  counter={true}
                  maxLength={300}
                  value={description}
                  disabled={descriptionSwitchOpen}
                  onChange={(e: any) => setDescription(e.target.value)}
                  onBlur={(e: any) => handleSave("description", e.target.value)}
                />
              </Form>
            </div>
          </div>
        </ComponentContainer>
      )}
    </div>
  );
};
