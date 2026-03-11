import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReduxGenerator } from "@helpers/redux-common";
import { SeoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { fetchPost } from "@helpers/post-helpers";
import { Post } from "@helpers/post-helpers";
import { OnboardedAccountKeywords } from "@hooks/use-get-onboarded-account-keywords";
import { useMapLocationKeywords } from "@hooks/use-map-location-keywords";

import { PluginInformationStore } from "@stores/swagger/api/PluginInformationStore";
import { MetatagsStore } from "@stores/swagger/api/MetatagsStore";
import { PluginInformationResponseDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/PluginInformationResponseDto";
import { MetaTagsGetResponseDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsGetResponseDto";
import { SchemaMarkupGetDataResponseDto } from "@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Schema/SchemaMarkup/Dtos/SchemaMarkupGetDataResponseDto";
import { WPWebPageKeywordsMetaTag } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/MetaTags/Tags/WPWebPageKeywordsMetaTag";
import { WPKeywordsAnalysis } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/WebPages/Content/Elements/ContentAnalysis/WPKeywordsAnalysis";
import { OptimiserResult } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Models/Results/OptimiserResult";
import { OptimiserStore } from "@stores/swagger/api/OptimiserStore";
import { OnboardingStore } from "@stores/swagger/api/OnboardingStore";
import { WPFlowStepsResponseDto } from "@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowStepsResponseDto";

export type AppSliceType = {
  appLoadedModalId: string;
  plugin: PluginInformationResponseDto | undefined;
  isPluginDataLoaded: boolean;
  metaTagsData: MetaTagsGetResponseDto | undefined;
  seoTitle: string | null;
  seoDescription: string | null;
  previewTitle: string | null;
  previewDescription: string | null;
  parsedTitle: string | null;
  parsedDescription: string | null;
  seoKeywords: WPWebPageKeywordsMetaTag | null;
  currentPost: Post | null;
  currentPostStatus: string | null;
  isCurrentPostLoaded: boolean;
  isMetaTagsDataLoaded: boolean;
  isFetchingPluginData: boolean;
  isFetchingPostData: boolean;
  primaryKeyword: string;
  additionalKeywords: string[] | [];
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

const initialState: AppSliceType = {
  appLoadedModalId: "",
  plugin: undefined,
  isPluginDataLoaded: false,
  isMetaTagsDataLoaded: false,
  isFetchingPluginData: false,
  metaTagsData: undefined,
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

    builder.addCase(PluginInformationStore.postApiPluginInformationThunk.fulfilled, (state, action) => {
      state.plugin = action.payload;
      state.isPluginDataLoaded = true;
      state.isFetchingPluginData = false;
    });
    builder.addCase(PluginInformationStore.postApiPluginInformationThunk.rejected, (state, action) => {
      //state.response = action.payload;
      state.isPluginDataLoaded = true;
      state.isFetchingPluginData = false;
    });
    builder.addCase(PluginInformationStore.postApiPluginInformationThunk.pending, (state, action) => {
      //state.response = action.payload;
      state.isPluginDataLoaded = false;
      state.isFetchingPluginData = true;
    });

    // Meta-tags remove keywords
    builder.addCase(MetatagsStore.deleteApiMetatagsKeywordByPostIdThunk.fulfilled, (state, action) => {
      state.isMetaTagsDataLoaded = true;
      state.metaTagsData = action.payload;
      state.seoTitle = action.payload.title?.content ?? null;
      state.seoDescription = action.payload.description?.content ?? null;
      state.seoKeywords = action.payload.keywords ?? null;
      state.primaryKeyword = state.seoKeywords?.primaryKeyword ?? "";
      state.additionalKeywords = state.seoKeywords?.additionalKeywords ?? [];
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
      //state.isMetaTagsDataLoaded = true;
      state.metaTagsData = action.payload;
      state.seoTitle = action.payload.title?.content ?? null;
      state.seoDescription = action.payload.description?.content ?? null;
      state.seoKeywords = action.payload.keywords ?? null;
      state.primaryKeyword = state.seoKeywords?.primaryKeyword ?? "";
      state.additionalKeywords = state.seoKeywords?.additionalKeywords ?? [];
    });
    builder.addCase(MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.postApiMetatagsKeywordSwapByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });

    // Retrieve meta-tag title, description, keywords
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.fulfilled, (state, action) => {
      state.isMetaTagsDataLoaded = true;
      state.metaTagsData = action.payload;

      state.parsedTitle = action.payload.title?.parsed ?? null;
      state.parsedDescription = action.payload.description?.parsed ?? null;

      if (state.parsedTitle) {
        state.previewTitle = state.parsedTitle;
      } else {
        const titleForPreview = action.payload.title
          ? {
            ...action.payload.title,
            parsed: undefined, // Force building from variables
          }
          : null;
      }

      if (state.parsedDescription) {
        state.previewDescription = state.parsedDescription;
      }

      state.seoTitle = action.payload.title?.content ?? null;
      state.seoDescription = action.payload.description?.content ?? null;
      state.seoKeywords = action.payload.keywords ?? null;
      state.primaryKeyword = state.seoKeywords?.primaryKeyword ?? "";
      state.additionalKeywords = state.seoKeywords?.additionalKeywords ?? [];
    });
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.getApiMetatagsByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });

    // Meta-tags update/create title, description, keywords
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.fulfilled, (state, action) => {
      //state.isMetaTagsDataLoaded = true;
      state.metaTagsData = action.payload;
      state.seoTitle = action.payload.title?.content ?? null;
      state.seoDescription = action.payload.description?.content ?? null;
      state.seoKeywords = action.payload.keywords ?? null;
      state.primaryKeyword = state.seoKeywords?.primaryKeyword ?? "";
      state.additionalKeywords = state.seoKeywords?.additionalKeywords ?? [];
    });
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.rejected, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
    });
    builder.addCase(MetatagsStore.postApiMetatagsByPostIdThunk.pending, (state, action) => {
      //state.response = action.payload;
      //state.isMetaTagsDataLoaded = false;
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
