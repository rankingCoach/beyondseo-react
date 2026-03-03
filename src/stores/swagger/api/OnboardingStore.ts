
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { OnboardingDataResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/OnboardingDataResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    import type { InternalErrorException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/InternalErrorException';
    import type { WPFlowStepsResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowStepsResponseDto';
    import type { ForbiddenException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/ForbiddenException';
    import type { WPSetupExtractAutoResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Extracts/WPSetupExtractAutoResponseDto';
    import type { WPFlowStepAndNextStepResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowStepAndNextStepResponseDto';
    import type { WPFlowStepCompletionRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/WPFlowStepCompletionRequestDto';
    import type { WPFlowStepResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowStepResponseDto';
    import type { WPFlowPostSaveDataCompletionRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Flow/WPFlowPostSaveDataCompletionRequestDto';
    import type { WPRequirementsResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Requirements/WPRequirementsResponseDto';
    import type { WPRequirementResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Requirements/WPRequirementResponseDto';
    import type { WPRequirementPostRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Requirements/WPRequirementPostRequestDto';
    import type { WPRequirementPutRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Requirements/WPRequirementPutRequestDto';
    import type { WPCategoriesGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Categories/WPCategoriesGetResponseDto';
    import type { WPLocationSuggestionsGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Location/WPLocationSuggestionsGetResponseDto';
    import type { WPLocationSuggestionsGetRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Location/WPLocationSuggestionsGetRequestDto';
    


 export type PostApiOnboardingSubmitOnboardingOpts = {FE_UNIQUE_ID?: string
}
 export type PostApiOnboardingScanPagesOpts = {FE_UNIQUE_ID?: string
}
 export type PostApiOnboardingGenerateStepsOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOnboardingExtractAutoOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOnboardingSubmitStepAnswerOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOnboardingGetStepOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiOnboardingRequirementsOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOnboardingRequirementsOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PutApiOnboardingRequirementsByRequirementIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiOnboardingCategoriesOpts = {FE_UNIQUE_ID?: string
  /** 
* $search 
*/
  search : string,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOnboardingLocationSuggestionsOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class OnboardingStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingSubmitOnboardingAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save onboarding data 
*/


/** 
* Save onboarding data on completion 
* Save onboarding data 
*/
postApiOnboardingSubmitOnboarding(  requestBody: null, queryParams?: PostApiOnboardingSubmitOnboardingOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<OnboardingDataResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/submitOnboarding`), requestBody, queryParams, signal, contentType) as Observable<OnboardingDataResponseDto>;
}

static postApiOnboardingSubmitOnboardingThunk = createAsyncThunk<
  OnboardingDataResponseDto,
  { requestBody: null, queryParams?: PostApiOnboardingSubmitOnboardingOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Save onboarding data on completion 
* Save onboarding data 
*/
("postApiOnboardingSubmitOnboarding", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostApiOnboardingSubmitOnboardingOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingSubmitOnboardingAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingSubmitOnboarding( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingSubmitOnboardingAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingSubmitOnboardingAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingSubmitOnboardingUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/submitOnboarding');
static postApiOnboardingSubmitOnboardingUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/submitOnboarding(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingScanPagesAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Scan all posts and pages 
*/


/** 
* Scan all posts and pages 
* Scan all posts and pages 
*/
postApiOnboardingScanPages(  requestBody: null, queryParams?: PostApiOnboardingScanPagesOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<OnboardingDataResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/scanPages`), requestBody, queryParams, signal, contentType) as Observable<OnboardingDataResponseDto>;
}

static postApiOnboardingScanPagesThunk = createAsyncThunk<
  OnboardingDataResponseDto,
  { requestBody: null, queryParams?: PostApiOnboardingScanPagesOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Scan all posts and pages 
* Scan all posts and pages 
*/
("postApiOnboardingScanPages", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostApiOnboardingScanPagesOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingScanPagesAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingScanPages( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingScanPagesAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingScanPagesAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingScanPagesUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/scanPages');
static postApiOnboardingScanPagesUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/scanPages(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingGenerateStepsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Generate flow steps
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception 
*/


/** 
* Generate flow steps 
* Generate flow steps
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception 
*/
postApiOnboardingGenerateSteps(  requestBody: null, queryParams: PostApiOnboardingGenerateStepsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPFlowStepsResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/generateSteps`), requestBody, queryParams, signal, contentType) as Observable<WPFlowStepsResponseDto>;
}

static postApiOnboardingGenerateStepsThunk = createAsyncThunk<
  WPFlowStepsResponseDto,
  { requestBody: null, queryParams: PostApiOnboardingGenerateStepsOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Generate flow steps 
* Generate flow steps
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception 
*/
("postApiOnboardingGenerateSteps", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams: PostApiOnboardingGenerateStepsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingGenerateStepsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingGenerateSteps( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingGenerateStepsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingGenerateStepsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingGenerateStepsUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/generateSteps');
static postApiOnboardingGenerateStepsUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/generateSteps(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingExtractAutoAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Extract onboarding information automatically
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/


/** 
* Extract onboarding information automatically 
* Extract onboarding information automatically
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
postApiOnboardingExtractAuto(  requestBody: null, queryParams: PostApiOnboardingExtractAutoOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPSetupExtractAutoResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/extractAuto`), requestBody, queryParams, signal, contentType) as Observable<WPSetupExtractAutoResponseDto>;
}

static postApiOnboardingExtractAutoThunk = createAsyncThunk<
  WPSetupExtractAutoResponseDto,
  { requestBody: null, queryParams: PostApiOnboardingExtractAutoOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Extract onboarding information automatically 
* Extract onboarding information automatically
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
("postApiOnboardingExtractAuto", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams: PostApiOnboardingExtractAutoOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingExtractAutoAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingExtractAuto( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingExtractAutoAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingExtractAutoAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingExtractAutoUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/extractAuto');
static postApiOnboardingExtractAutoUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/extractAuto(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingSubmitStepAnswerAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save answer data from a step's question 
*/


/** 
* Save completion data from a specific step 
* Save answer data from a step's question 
*/
postApiOnboardingSubmitStepAnswer(  requestBody: WPFlowStepCompletionRequestDto, queryParams: PostApiOnboardingSubmitStepAnswerOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPFlowStepAndNextStepResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/submitStepAnswer`), requestBody, queryParams, signal, contentType) as Observable<WPFlowStepAndNextStepResponseDto>;
}

static postApiOnboardingSubmitStepAnswerThunk = createAsyncThunk<
  WPFlowStepAndNextStepResponseDto,
  { requestBody: WPFlowStepCompletionRequestDto, queryParams: PostApiOnboardingSubmitStepAnswerOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Save completion data from a specific step 
* Save answer data from a step's question 
*/
("postApiOnboardingSubmitStepAnswer", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: WPFlowStepCompletionRequestDto, queryParams: PostApiOnboardingSubmitStepAnswerOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingSubmitStepAnswerAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingSubmitStepAnswer( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingSubmitStepAnswerAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingSubmitStepAnswerAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingSubmitStepAnswerUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/submitStepAnswer');
static postApiOnboardingSubmitStepAnswerUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/submitStepAnswer(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingGetStepAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieves a step by its unique ID. 
*/


/** 
* Get a step by step id 
* Retrieves a step by its unique ID. 
*/
postApiOnboardingGetStep(  requestBody: WPFlowPostSaveDataCompletionRequestDto, queryParams: PostApiOnboardingGetStepOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPFlowStepResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/getStep`), requestBody, queryParams, signal, contentType) as Observable<WPFlowStepResponseDto>;
}

static postApiOnboardingGetStepThunk = createAsyncThunk<
  WPFlowStepResponseDto,
  { requestBody: WPFlowPostSaveDataCompletionRequestDto, queryParams: PostApiOnboardingGetStepOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Get a step by step id 
* Retrieves a step by its unique ID. 
*/
("postApiOnboardingGetStep", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: WPFlowPostSaveDataCompletionRequestDto, queryParams: PostApiOnboardingGetStepOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingGetStepAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingGetStep( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingGetStepAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingGetStepAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingGetStepUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/getStep');
static postApiOnboardingGetStepUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/getStep(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiOnboardingRequirementsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieves all prefilled requirements 
*/


/** 
* Get all prefilled requirements 
* Retrieves all prefilled requirements 
*/
getApiOnboardingRequirements(  queryParams: GetApiOnboardingRequirementsOpts, signal?: AbortSignal ): Observable<WPRequirementsResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/onboarding/requirements`), queryParams, signal) as Observable<WPRequirementsResponseDto>;
}

static getApiOnboardingRequirementsThunk = createAsyncThunk<
  WPRequirementsResponseDto,
   GetApiOnboardingRequirementsOpts,
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Get all prefilled requirements 
* Retrieves all prefilled requirements 
*/
("getApiOnboardingRequirements", async ( queryParams: GetApiOnboardingRequirementsOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiOnboardingRequirementsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.getApiOnboardingRequirements( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiOnboardingRequirementsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiOnboardingRequirementsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiOnboardingRequirementsUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/requirements');
static getApiOnboardingRequirementsUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/requirements(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingRequirementsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Create requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception|\BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/


/** 
* create requirement 
* Create requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception|\BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
postApiOnboardingRequirements(  requestBody: WPRequirementPostRequestDto, queryParams: PostApiOnboardingRequirementsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPRequirementResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/requirements`), requestBody, queryParams, signal, contentType) as Observable<WPRequirementResponseDto>;
}

static postApiOnboardingRequirementsThunk = createAsyncThunk<
  WPRequirementResponseDto,
  { requestBody: WPRequirementPostRequestDto, queryParams: PostApiOnboardingRequirementsOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* create requirement 
* Create requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception|\BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
("postApiOnboardingRequirements", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: WPRequirementPostRequestDto, queryParams: PostApiOnboardingRequirementsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingRequirementsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingRequirements( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingRequirementsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingRequirementsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingRequirementsUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/requirements');
static postApiOnboardingRequirementsUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/requirements(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static putApiOnboardingRequirementsByRequirementIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Update a requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/


/** 
* Update a requirement 
* Update a requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
putApiOnboardingRequirementsByRequirementId( requirementId: number,  requestBody: WPRequirementPutRequestDto, queryParams: PutApiOnboardingRequirementsByRequirementIdOpts, signal?: AbortSignal ): Observable<WPRequirementResponseDto> {
  return this.put(new EndPoint(`/wp-json/rankingcoach/api/onboarding/requirements/${requirementId}`), requestBody, queryParams, signal) as Observable<WPRequirementResponseDto>;
}

static putApiOnboardingRequirementsByRequirementIdThunk = createAsyncThunk<
  WPRequirementResponseDto,
  {requirementId: number,  requestBody: WPRequirementPutRequestDto, queryParams: PutApiOnboardingRequirementsByRequirementIdOpts},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Update a requirement 
* Update a requirement
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\DBAL\Exception
* @throws \BeyondSEODeps\Doctrine\Persistence\Mapping\MappingException 
*/
("putApiOnboardingRequirementsByRequirementId", async ({requirementId,  requestBody, queryParams } : {requirementId: number,  requestBody: WPRequirementPutRequestDto, queryParams: PutApiOnboardingRequirementsByRequirementIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.putApiOnboardingRequirementsByRequirementIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.putApiOnboardingRequirementsByRequirementId(requirementId,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.putApiOnboardingRequirementsByRequirementIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.putApiOnboardingRequirementsByRequirementIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static putApiOnboardingRequirementsByRequirementIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/requirements/{requirementId}');
static putApiOnboardingRequirementsByRequirementIdUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/requirements/{requirementId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiOnboardingCategoriesAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Search categories 
*/


/** 
* Categories search 
* Search categories 
*/
getApiOnboardingCategories(  queryParams: GetApiOnboardingCategoriesOpts, signal?: AbortSignal ): Observable<WPCategoriesGetResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/onboarding/categories`), queryParams, signal) as Observable<WPCategoriesGetResponseDto>;
}

static getApiOnboardingCategoriesThunk = createAsyncThunk<
  WPCategoriesGetResponseDto,
   GetApiOnboardingCategoriesOpts,
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Categories search 
* Search categories 
*/
("getApiOnboardingCategories", async ( queryParams: GetApiOnboardingCategoriesOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiOnboardingCategoriesAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.getApiOnboardingCategories( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiOnboardingCategoriesAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiOnboardingCategoriesAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiOnboardingCategoriesUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/categories');
static getApiOnboardingCategoriesUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/categories(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOnboardingLocationSuggestionsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get location suggestions based on address input 
*/


/** 
* Get location suggestions for onboarding 
* Get location suggestions based on address input 
*/
postApiOnboardingLocationSuggestions(  requestBody: WPLocationSuggestionsGetRequestDto, queryParams: PostApiOnboardingLocationSuggestionsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<WPLocationSuggestionsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/onboarding/location/suggestions`), requestBody, queryParams, signal, contentType) as Observable<WPLocationSuggestionsGetResponseDto>;
}

static postApiOnboardingLocationSuggestionsThunk = createAsyncThunk<
  WPLocationSuggestionsGetResponseDto,
  { requestBody: WPLocationSuggestionsGetRequestDto, queryParams: PostApiOnboardingLocationSuggestionsOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Get location suggestions for onboarding 
* Get location suggestions based on address input 
*/
("postApiOnboardingLocationSuggestions", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: WPLocationSuggestionsGetRequestDto, queryParams: PostApiOnboardingLocationSuggestionsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOnboardingLocationSuggestionsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      onboardingStore.postApiOnboardingLocationSuggestions( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOnboardingLocationSuggestionsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOnboardingLocationSuggestionsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOnboardingLocationSuggestionsUrlRegEx = new RegExp('/wp-json/rankingcoach/api/onboarding/location/suggestions');
static postApiOnboardingLocationSuggestionsUrlMockRequest = '/wp-json/rankingcoach/api/onboarding/location/suggestions(.*)';


  
 }
 export const onboardingStore = new OnboardingStore();
 