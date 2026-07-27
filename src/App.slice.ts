import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxGenerator } from "@helpers/redux-common";
import { SeoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { fetchPost } from "@helpers/post-helpers";
import { Post } from "@helpers/post-helpers";
import { OnboardedAccountKeywords } from "@hooks/use-get-onboarded-account-keywords";
import { useMapLocationKeywords } from "@hooks/use-map-location-keywords";

import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { SocialStore } from "@stores/swagger/api/SocialStore";
import { AdvancedSettingsStore } from "@stores/swagger/api/AdvancedSettingsStore";
import { WpVariablesStore } from "@stores/wp-variables.store";
import { PluginInformationResponseDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/PluginInformationResponseDto";
import { SchemaMarkupGetDataResponseDto } from "@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Schema/SchemaMarkup/Dtos/SchemaMarkupGetDataResponseDto";
import { WPKeywordsAnalysis } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/WPKeywordsAnalysis";
import { OptimiserResult } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Models/Results/OptimiserResult";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";
import { OnboardingStore } from "@stores/swagger/api/OnboardingStore";
import { WPFlowStepsResponseDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowStepsResponseDto";
import { rcWindow } from "@stores/window.store";
import { KeywordsTagDto, MetaTagsApiResponse, WPVariableData } from "@src/types/meta-tags";
import { buildVariablesMap, resolveTemplate } from "@helpers/template-helpers";

export type AppSliceType = {
  appLoadedModalId: string;
  plugin: PluginInformationResponseDto | undefined;
  isPluginDataLoaded: boolean;
  metaTagsData: MetaTagsApiResponse | undefined;
  wpVariables: WPVariableData[] | null;
  seoTitle: string | null;
  seoDescription: string | null;
  previewTitle: string | null;
  previewDescription: string | null;
  parsedTitle: string | null;
  parsedDescription: string | null;
  seoKeywords: KeywordsTagDto | null;
  currentPost: Post | null;
  currentPostStatus: string | null;
  isCurrentPostLoaded: boolean;
  isMetaTagsDataLoaded: boolean;
  isFetchingPluginData: boolean;
  isFetchingPostData: boolean;
  primaryKeyword: string;
  additionalKeywords: string[] | [];
  // Account keywords available for the keyword autocomplete; null = not fetched yet
  availableKeywords: Array<{ name: string }> | null;
  error: any;

  onboardAccountKeywords: OnboardedAccountKeywords[] | null;
  postSeoOptimiserLoading: boolean | undefined;
  postSeoOptimiser: any | undefined;
  postSeoOptimiserKeywords: WPKeywordsAnalysis | undefined;
  hasValidSEOKeywords: boolean | undefined;

  // Schema Markup
  schemaMarkup: SchemaMarkupGetDataResponseDto | undefined;

  // Advanced Settings
  noIndexForPage: boolean;
  excludeSitemapForPage: boolean;
  disableAutoLinks: boolean;
  canonicalUrl: string;
  viewportForPage: boolean;
  isAdvancedSettingsLoaded: boolean;

  // Optimiser Result
  optimiserResult: OptimiserResult | null;

  // Breadcrumbs
  breadcrumbsData: any | null;
  isBreadcrumbsLoaded: boolean;

  // Onboarding
  onboardingSteps: WPFlowStepsResponseDto | undefined;
  isGeneratingOnboardingSteps: boolean;
  onboardingError: any;
};

// Plugin information is provided up-front through the localized `rankingCoachReactData`
// window object so the metabox, settings and connect/upsell areas can render without an
// extra `pluginInformation` API round-trip. When the window carries it we seed the store
// from it and mark the data as loaded; the API call in main.tsx is then only used as a
// fallback for pages where the window does not include the payload. This is inert until
// PHP populates `rankingCoachReactData.pluginInformation` (consumers use optional chaining).
const seededPluginInformation: PluginInformationResponseDto | undefined =
  rcWindow?.rankingCoachReactData?.pluginInformation;

const initialState: AppSliceType = {
  appLoadedModalId: "",
  plugin: seededPluginInformation,
  isPluginDataLoaded: !!seededPluginInformation,
  isMetaTagsDataLoaded: false,
  isFetchingPluginData: false,
  metaTagsData: undefined,
  wpVariables: null,
  seoTitle: "",
  seoDescription: "",
  previewTitle: "",
  previewDescription: "",
  parsedTitle: null,
  parsedDescription: null,
  seoKeywords: null,
  currentPost: null,
  currentPostStatus: null,
  isCurrentPostLoaded: false,
  isFetchingPostData: false,
  primaryKeyword: "",
  additionalKeywords: [],
  availableKeywords: null,
  error: null,
  onboardAccountKeywords: null,
  postSeoOptimiserLoading: undefined,
  postSeoOptimiser: undefined,
  postSeoOptimiserKeywords: undefined,
  hasValidSEOKeywords: undefined,

  // Schema Markup
  schemaMarkup: undefined,

  // Advanced Settings
  noIndexForPage: false,
  excludeSitemapForPage: false,
  disableAutoLinks: false,
  canonicalUrl: "",
  viewportForPage: false,
  isAdvancedSettingsLoaded: false,

  //
  optimiserResult: null,

  // Breadcrumbs
  breadcrumbsData: null,
  isBreadcrumbsLoaded: false,

  // Onboarding
  onboardingSteps: undefined,
  isGeneratingOnboardingSteps: false,
  onboardingError: null,
};

/**
 * Apply a full meta tags payload (returned by both the metatags and social
 * GET/POST endpoints) to the app state. Templates are resolved client-side
 * against the loaded WP variables — the API no longer returns `parsed`.
 *
 * `updatePreviews` is true for initial loads only; save responses must not
 * override the live preview the editors already computed locally (avoids
 * flicker from debounced-save races while typing).
 */
const applyMetaTagsPayload = (state: AppSliceType, payload: MetaTagsApiResponse, updatePreviews: boolean): void => {
  const variablesMap = buildVariablesMap(state.wpVariables);

  state.metaTagsData = payload;
  state.seoTitle = payload.title ? resolveTemplate(payload.title.template, variablesMap) : null;
  state.seoDescription = payload.description ? resolveTemplate(payload.description.template, variablesMap) : null;
  state.seoKeywords = payload.keywords ?? null;
  state.primaryKeyword = payload.keywords?.primaryKeyword ?? "";
  state.additionalKeywords = payload.keywords?.additionalKeywords ?? [];

  if (updatePreviews) {
    state.parsedTitle = state.seoTitle || null;
    state.parsedDescription = state.seoDescription || null;
    if (state.parsedTitle) {
      state.previewTitle = state.parsedTitle;
    }
    if (state.parsedDescription) {
      state.previewDescription = state.parsedDescription;
    }
  }
};

const G = new ReduxGenerator<AppSliceType>();
const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    ...G.genAll(initialState),
    setAppLoadedModalId: (state, action: PayloadAction<string>) => {
      state.appLoadedModalId = action.payload;
    },
    setParsedTitle: (state, action: PayloadAction<string | null>) => {
      state.parsedTitle = action.payload;
    },
    setParsedDescription: (state, action: PayloadAction<string | null>) => {
      state.parsedDescription = action.payload;
    },
    setBreadcrumbsData: (state, action: PayloadAction<any>) => {
      state.breadcrumbsData = action.payload;
      state.isBreadcrumbsLoaded = true;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk.fulfilled, (state, action) => {
      state.postSeoOptimiser = action.payload;

      state.postSeoOptimiserLoading = false;
      state.hasValidSEOKeywords = false;

      state.postSeoOptimiserKeywords = state.postSeoOptimiser.keywords;
      if (
        (state.postSeoOptimiserKeywords?.primaryKeywordFromExisting &&
          state.postSeoOptimiserKeywords?.primaryKeywordFromExisting.name) ||
        (state.postSeoOptimiserKeywords?.primaryKeywordFromContent &&
          state.postSeoOptimiserKeywords?.primaryKeywordFromContent.name)
        // && state.postSeoOptimiserKeywords?.additionalKeywordsFromExisting &&
        // (state.postSeoOptimiserKeywords?.additionalKeywordsFromExisting?.elements ?? []).length > 0
      ) {
        state.hasValidSEOKeywords = true;
      }
    });
    builder.addCase(MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      state.hasValidSEOKeywords = false;
      state.postSeoOptimiserLoading = false;
    });
    builder.addCase(MetatagsStore.postApiMetatagsContentKeywordsByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      state.hasValidSEOKeywords = false;
      state.postSeoOptimiserLoading = true;
    });

    // Meta-tags remove keywords
    builder.addCase(MetatagsStore.deleteApiMetatagsKeywordByPostIdThunk.fulfilled, (state, action) => {
      state.isMetaTagsDataLoaded = true;
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, false);
    });
    builder.addCase(MetatagsStore.deleteApiMetatagsKeywordByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.deleteApiMetatagsKeywordByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      state.isMetaTagsDataLoaded = false;
    });

    // Meta-tags swap keyword from additional to primary
    builder.addCase(MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk.fulfilled, (state, action) => {
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, false);
    });
    builder.addCase(MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });

    // Retrieve meta-tag title, description, keywords, social fields
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.fulfilled, (state, action) => {
      state.isMetaTagsDataLoaded = true;
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, true);
    });
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });

    // Meta-tags update/create title, description, keywords, social fields.
    // Previews are NOT overridden here: the editors already updated them
    // locally, and the save response may be stale while the user keeps typing.
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.fulfilled, (state, action) => {
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, false);
    });
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });

    // Social meta tags: both endpoints return the same full meta tags payload
    // (enriched with selectedImageSource / selectedImageUrl / imageSources),
    // so keep the shared state in sync with it.
    builder.addCase(SocialStore.getApiSocialByPostIdThunk.fulfilled, (state, action) => {
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, false);
    });
    builder.addCase(SocialStore.postApiSocialByPostIdThunk.fulfilled, (state, action) => {
      applyMetaTagsPayload(state, action.payload as unknown as MetaTagsApiResponse, false);
    });

    // Resolved WordPress variables (used to resolve structured templates into
    // preview text). When they arrive after the meta tags, re-resolve — but
    // only refresh a preview the user has not edited in the meantime: a
    // preview is considered untouched while it is empty or still equals the
    // resolution produced with the previous (usually empty) variables map.
    builder.addCase(WpVariablesStore.getVariablesByPostIdThunk.fulfilled, (state, action) => {
      const staleMap = buildVariablesMap(state.wpVariables);
      state.wpVariables = action.payload ?? [];

      if (!state.metaTagsData) {
        return;
      }

      const staleTitle = state.metaTagsData.title
        ? resolveTemplate(state.metaTagsData.title.template, staleMap)
        : "";
      const staleDescription = state.metaTagsData.description
        ? resolveTemplate(state.metaTagsData.description.template, staleMap)
        : "";
      const titleUntouched = !state.previewTitle || state.previewTitle === staleTitle;
      const descriptionUntouched = !state.previewDescription || state.previewDescription === staleDescription;

      applyMetaTagsPayload(state, state.metaTagsData, false);

      if (titleUntouched && state.seoTitle) {
        state.parsedTitle = state.seoTitle;
        state.previewTitle = state.seoTitle;
      }
      if (descriptionUntouched && state.seoDescription) {
        state.parsedDescription = state.seoDescription;
        state.previewDescription = state.seoDescription;
      }
    });

    // Advanced settings: cache the per-post settings so re-mounting the
    // Advanced tab does not refetch them (saves keep updating this state
    // optimistically in the tab itself).
    builder.addCase(AdvancedSettingsStore.getApiAdvancedSettingsByPostIdThunk.fulfilled, (state, action) => {
      const settings = action.payload as any;
      if (settings?.canonicalUrl !== undefined) state.canonicalUrl = settings.canonicalUrl;
      if (settings?.noindexForPage !== undefined) state.noIndexForPage = settings.noindexForPage;
      if (settings?.excludeSitemapForPage !== undefined) state.excludeSitemapForPage = settings.excludeSitemapForPage;
      if (settings?.disableAutoLinks !== undefined) state.disableAutoLinks = settings.disableAutoLinks;
      if (settings?.viewportForPage !== undefined) state.viewportForPage = settings.viewportForPage;
      state.isAdvancedSettingsLoaded = true;
    });

    // Account keywords for the autocomplete: cache the list so re-mounting the
    // keyword manager does not refetch it (the keywords-updated event still
    // forces a refresh).
    builder.addCase(MetatagsStore.getApiMetatagsKeywordsByPostIdThunk.fulfilled, (state, action) => {
      const elements = (action.payload as any)?.keywords?.elements;
      const keywordArray = Array.isArray(elements) ? elements : [];
      state.availableKeywords = keywordArray.map((keyword: any) => ({
        name: keyword.keyword || keyword.name || keyword,
      }));
    });

    // Account location keywords
    builder.addCase(SeoStore.getRankingcoachSeoLocationKeywordsThunk.fulfilled, (state, action) => {
      // @ts-ignore
      state.onboardAccountKeywords = useMapLocationKeywords(action.payload.response.location.keywords.elements);
    });
    builder.addCase(SeoStore.getRankingcoachSeoLocationKeywordsThunk.rejected, (state, action) => {
      //state.response = action.payload;
    });
    builder.addCase(SeoStore.getRankingcoachSeoLocationKeywordsThunk.pending, (state, action) => {
      //state.response = action.payload;
    });

    // Schema Markup
    builder.addCase(SeoStore.getRankingcoachSeoSchemaMarkupByIdThunk.fulfilled, (state, action) => {
      //@ts-ignore
      state.schemaMarkup = action.payload.response;
    });
    builder.addCase(SeoStore.postRankingcoachSeoSchemaMarkupSaveByIdThunk.fulfilled, (state, action) => {
      //@ts-ignore
      state.schemaMarkup = action.payload.response;
    });

    // OptimiserStore - Optimiser Result
    builder.addCase(OptimiserStore.getApiOptimiserByPostIdThunk.fulfilled, (state, action) => {
      state.optimiserResult = action.payload.analyseResult;
    });
    builder.addCase(OptimiserStore.postApiOptimiserByPostIdThunk.fulfilled, (state, action) => {
      state.optimiserResult = action.payload.analyseResult;
    });

    // Onboarding Generate Steps
    builder.addCase(OnboardingStore.postApiOnboardingGenerateStepsThunk.fulfilled, (state, action) => {
      state.onboardingSteps = action.payload;
      state.isGeneratingOnboardingSteps = false;
      state.onboardingError = null;
    });
    builder.addCase(OnboardingStore.postApiOnboardingGenerateStepsThunk.rejected, (state, action) => {
      state.onboardingError = action.payload;
      state.isGeneratingOnboardingSteps = false;
    });
    builder.addCase(OnboardingStore.postApiOnboardingGenerateStepsThunk.pending, (state) => {
      state.isGeneratingOnboardingSteps = true;
      state.onboardingError = null;
    });
  },
});

export const AppSlice = appSlice.actions;
export const AppReducer = appSlice.reducer;

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.isFetchingPostData = true;
        state.isCurrentPostLoaded = false;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.isFetchingPostData = false;
        state.currentPost = action.payload;
        state.isCurrentPostLoaded = true;
        state.currentPostStatus = action.payload.status;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.isFetchingPostData = true;
        state.isCurrentPostLoaded = false;
        state.error = true;
      });
  },
});
export const PostSlice = postSlice.actions;
export const PostReducer = postSlice.reducer;
