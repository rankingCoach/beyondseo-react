import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { SocialTabPlaceholder } from "./SocialTabPlaceholder";
import { SocialStore } from "@src/stores/swagger/api/SocialStore";
import { WpVariablesStore } from "@stores/wp-variables.store";
import { SocialMetaTagsPostRequestDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/SocialMetaTagsPostRequestDto";
import { MetaTagsApiResponse, SocialImageSourceDto, SocialSaveRequest } from "@src/types/meta-tags";
import { buildVariablesMap, resolveTemplate, templateIsEmpty, textToTemplate } from "@helpers/template-helpers";
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
  const [selectedImageSource, setSelectedImageSource] = useState<string>("");
  const [imageSources, setImageSources] = useState<SocialImageSourceDto[]>([]);
  const [activeImageUrl, setActiveImageUrl] = useState<string>(PlaceholderImage);
  const dispatch = useAppDispatch();
  const { seoTitle, seoDescription, wpVariables, metaTagsData } = useSelector((state: RootState) => state.app);
  const { currentPost } = useSelector((state: RootState) => state.post);
  const { triggerRecalculation } = useScoreRecalculation();

  // The metatags and social endpoints return the same full payload and every
  // response is applied to `metaTagsData` by the app slice — so if another tab
  // already loaded it, this tab can render entirely from the store.
  const [isLoading, setIsLoading] = useState(() => !metaTagsData);

  // Track the last value persisted per field so blur without an actual change
  // does not overwrite a stored variable template with its resolved text.
  const lastSavedRef = useRef<{ title: string | null; description: string | null }>({
    title: null,
    description: null,
  });

  // One-time hydration guard for the textareas (image data stays store-driven).
  const hydratedRef = useRef(false);

  const variablesMap = useMemo(() => buildVariablesMap(wpVariables), [wpVariables]);
  const variablesMapRef = useRef(variablesMap);
  variablesMapRef.current = variablesMap;

  const metaTagsDataRef = useRef(metaTagsData);
  metaTagsDataRef.current = metaTagsData;

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

  // Ensure the store holds everything this tab needs; only hit the API for
  // what is missing (e.g. the Social tab was opened before the General tab).
  // Runs once — later store updates flow in through the hydration effect below.
  useEffect(() => {
    const ensureDataLoaded = async () => {
      try {
        if (!variablesMapRef.current || Object.keys(variablesMapRef.current).length === 0) {
          if (!wpVariables) {
            await dispatch(WpVariablesStore.getVariablesByPostIdThunk({ postId: getPathId() })).unwrap();
          }
        }

        if (!metaTagsDataRef.current) {
          await dispatch(
            SocialStore.getApiSocialByPostIdThunk({
              postId: getPathId(),
              queryParams: { noCache: true },
            }),
          ).unwrap();
        }
      } catch (error) {
        if (!hydratedRef.current) {
          if (seoTitle) setTitle(seoTitle);
          if (seoDescription) setDescription(seoDescription);
          hydratedRef.current = true;
        }
      } finally {
        setIsLoading(false);
      }
    };

    ensureDataLoaded();
  }, []);

  // Hydrate the tab from the store payload: structured templates are resolved
  // to text for the textareas (once — later edits are local), and the
  // server-resolved image fields stay store-driven so every save response
  // keeps them authoritative. No API calls happen here.
  useEffect(() => {
    if (!metaTagsData) return;

    if (!hydratedRef.current) {
      const resolvedTitle =
        metaTagsData.socialTitle && !templateIsEmpty(metaTagsData.socialTitle.template)
          ? resolveTemplate(metaTagsData.socialTitle.template, variablesMap)
          : "";
      const resolvedDescription =
        metaTagsData.socialDescription && !templateIsEmpty(metaTagsData.socialDescription.template)
          ? resolveTemplate(metaTagsData.socialDescription.template, variablesMap)
          : "";

      const effectiveTitle = resolvedTitle || seoTitle || "";
      const effectiveDescription = resolvedDescription || seoDescription || "";

      setTitle(effectiveTitle);
      setDescription(effectiveDescription);
      lastSavedRef.current = { title: effectiveTitle, description: effectiveDescription };
      hydratedRef.current = true;
    }

    const sources = metaTagsData.imageSources ?? [];
    setImageSources(sources);

    if (metaTagsData.selectedImageSource) {
      setSelectedImageSource(metaTagsData.selectedImageSource);
      setActiveImageUrl(metaTagsData.selectedImageUrl || PlaceholderImage);
    } else {
      // Nothing persisted yet: preselect the backend-flagged default source
      // (or the first available one) locally, without saving it.
      const defaultSource = sources.find((source) => source.default === true) ?? sources[0];
      if (defaultSource?.source) {
        setSelectedImageSource(defaultSource.source);
        setActiveImageUrl(
          defaultSource.value && defaultSource.value.startsWith("http") ? defaultSource.value : PlaceholderImage,
        );
      } else {
        setActiveImageUrl(PlaceholderImage);
      }
    }
  }, [metaTagsData, variablesMap]);

  // If the social fields were empty and untouched, fill them from the SEO
  // title/description once those resolve (same fallback as before, without
  // refetching the social payload).
  useEffect(() => {
    if (!hydratedRef.current) return;

    if (!title && !lastSavedRef.current.title && seoTitle) {
      setTitle(seoTitle);
      lastSavedRef.current.title = seoTitle;
    }
    if (!description && !lastSavedRef.current.description && seoDescription) {
      setDescription(seoDescription);
      lastSavedRef.current.description = seoDescription;
    }
  }, [seoTitle, seoDescription]);

  /**
   * Refresh only the image source list via the dedicated endpoint (used when
   * the featured image changes in Gutenberg, without re-fetching the whole
   * social payload).
   */
  const refreshImageSources = async () => {
    try {
      const imageSourcesData = await dispatch(
        SocialStore.getApiSocialImageSourcesByPostIdThunk({
          postId: getPathId(),
          queryParams: { noCache: true },
        }),
      ).unwrap();

      // The reworked endpoint returns `imageSources`; tolerate the legacy
      // snake_case key while the generated DTOs are still in transition.
      const raw = imageSourcesData as any;
      const sources = (raw?.imageSources ?? raw?.image_sources ?? []) as SocialImageSourceDto[];
      if (!sources.length) return;

      setImageSources(sources);

      const current = sources.find((source) => source.source === selectedImageSource);
      if (current) {
        setActiveImageUrl(current.value && current.value.startsWith("http") ? current.value : PlaceholderImage);
      }
    } catch (error) {
    }
  };

  // Keep the image picker in sync with featured image changes in Gutenberg.
  useEffect(() => {
    const isGutenberg = typeof wp !== "undefined" && wp.data && wp.data.select("core/editor");
    if (!isGutenberg) return;

    const { select, subscribe } = wp.data;
    let currentFeaturedImage = select("core/editor")?.getEditedPostAttribute("featured_media");

    const unsubscribe = subscribe(() => {
      const updatedFeaturedImage = select("core/editor")?.getEditedPostAttribute("featured_media");
      if (updatedFeaturedImage !== currentFeaturedImage) {
        currentFeaturedImage = updatedFeaturedImage;
        refreshImageSources();
      }
    });

    return () => unsubscribe();
  }, [selectedImageSource]);

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

  const postSocialData = async (payload: SocialSaveRequest): Promise<MetaTagsApiResponse | null> => {
    try {
      const response = (await dispatch(
        SocialStore.postApiSocialByPostIdThunk({
          postId: getPathId(),
          requestBody: payload as unknown as SocialMetaTagsPostRequestDto,
          queryParams: { noCache: true },
        }),
      ).unwrap()) as unknown as MetaTagsApiResponse;

      return response;
    } catch (error) {
      return null;
    }
  };

  const handleSave = async (field: "title" | "description", value: string) => {
    // Only persist actual edits: saving an unchanged value would replace a
    // stored variable template with its resolved plain text.
    if (lastSavedRef.current[field] === value) {
      return;
    }

    const payload: SocialSaveRequest =
      field === "title"
        ? { socialTitle: { template: textToTemplate(value) } }
        : { socialDescription: { template: textToTemplate(value) } };

    const response = await postSocialData(payload);
    if (response) {
      lastSavedRef.current[field] = value;

      // Trigger immediate recalculation only after a successful save — the
      // server state is unchanged when the POST fails.
      triggerRecalculation(true);
    }
  };

  const handleImageSourceChange = async (newValue: string) => {
    setSelectedImageSource(newValue);

    // Optimistic preview from the already-known source list; the POST response
    // carries the authoritative server-resolved URL and flows back into this
    // tab through the store hydration effect.
    const optimistic = imageSources.find((source) => source.source === newValue);
    setActiveImageUrl(
      optimistic?.value && optimistic.value.startsWith("http") ? optimistic.value : PlaceholderImage,
    );

    const response = await postSocialData({ selectedImageSource: newValue });

    if (response) {
      // Trigger immediate recalculation only after a successful save
      triggerRecalculation(true);
    } else {
      // Roll the optimistic selection back to the last known server state
      const stored = metaTagsDataRef.current;
      if (stored?.selectedImageSource) {
        setSelectedImageSource(stored.selectedImageSource);
        setActiveImageUrl(stored.selectedImageUrl || PlaceholderImage);
      }
    }
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
              onChange={(e: any) => handleImageSourceChange(e.target.value)}
              value={selectedImageSource}
              options={imageSources
                .filter((source) => source.source)
                .map((source) => ({
                  key: source.source,
                  value: source.source,
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
