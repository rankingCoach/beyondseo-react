
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ModulesResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/ModulesResponseDto';
    import type { SettingsResponseDto } from '@models/swagger/RankingCoach/Inc/Core/Settings/Dtos/SettingsResponseDto';
    import type { SettingsRequestDto } from '@models/swagger/RankingCoach/Inc/Core/Settings/Dtos/SettingsRequestDto';
    import type { SingleSettingResponseDto } from '@models/swagger/RankingCoach/Inc/Core/Settings/Dtos/SingleSettingResponseDto';
    import type { SingleSettingRequestDto } from '@models/swagger/RankingCoach/Inc/Core/Settings/Dtos/SingleSettingRequestDto';
    import type { BreadcrumbsResponseDto } from '@models/swagger/RankingCoach/Inc/Core/Breadcrumbs/Dtos/BreadcrumbsResponseDto';
    import type { BreadcrumbsRequestDto } from '@models/swagger/RankingCoach/Inc/Core/Breadcrumbs/Dtos/BreadcrumbsRequestDto';
    import type { GetAllLinksResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/GetAllLinksResponseDto';
    import type { GetLinksForPostResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/GetLinksForPostResponseDto';
    import type { IndexLinksResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/IndexLinksResponseDto';
    import type { IndexLinksRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/IndexLinksRequestDto';
    import type { ScanLinksResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/ScanLinksResponseDto';
    import type { ScanLinksRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/LinkAnalyzer/Dtos/ScanLinksRequestDto';
    import type { GetRedirectsResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/GetRedirectsResponseDto';
    import type { CreateRedirectResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/CreateRedirectResponseDto';
    import type { CreateRedirectRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/CreateRedirectRequestDto';
    import type { GetRedirectResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/GetRedirectResponseDto';
    import type { UpdateRedirectResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/UpdateRedirectResponseDto';
    import type { UpdateRedirectRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/UpdateRedirectRequestDto';
    import type { DeleteRedirectResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/DeleteRedirectResponseDto';
    import type { DeleteRedirectRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Links/RedirectManager/Dtos/DeleteRedirectRequestDto';
    import type { SchemaMarkupGetDataResponseDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Schema/SchemaMarkup/Dtos/SchemaMarkupGetDataResponseDto';
    import type { SchemaMarkupPostSaveDataRequestDto } from '@models/swagger/RankingCoach/Inc/Modules/ModuleLibrary/Schema/SchemaMarkup/Dtos/SchemaMarkupPostSaveDataRequestDto';
    


 export type GetRankingcoachSeoFeatureModulesOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoAccountDetailsOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoLocationKeywordsOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoRcVariablesDataByIdOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoGenerateSdkOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoSdkTokenOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoSettingsOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoSettingsOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoSettingsByKeyOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoSettingsByKeyOpts = {FE_UNIQUE_ID?: string
}
 export type DeleteRankingcoachSeoSettingsByKeyOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoBreadcrumbsOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoAccountChallengeOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoAccountVerificationStatusOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoAccountRegisterOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoAccountFinalizeRegisterOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoFlowguardStateOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoConnectUrlOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoLinkAnalyzerOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoLinkAnalyzerByIdOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoLinkAnalyzerIndexByPostIdOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoLinkAnalyzerScanByPostIdOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoLinkAnalyzerVerifyByPostIdOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoRedirectManagerOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoRedirectManagerOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoRedirectManagerByIdOpts = {FE_UNIQUE_ID?: string
}
 export type PatchRankingcoachSeoRedirectManagerByIdOpts = {FE_UNIQUE_ID?: string
}
 export type DeleteRankingcoachSeoRedirectManagerByIdOpts = {FE_UNIQUE_ID?: string
}
 export type GetRankingcoachSeoSchemaMarkupByIdOpts = {FE_UNIQUE_ID?: string
}
 export type PostRankingcoachSeoSchemaMarkupSaveByIdOpts = {FE_UNIQUE_ID?: string
}

export class SeoStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoFeatureModulesAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Returns the list of available modules with their names. 
*/


/** 
* Get the list of available modules. 
* Returns the list of available modules with their names. 
*/
getRankingcoachSeoFeatureModules(  queryParams?: GetRankingcoachSeoFeatureModulesOpts, signal?: AbortSignal ): Observable<ModulesResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/feature_modules`), queryParams, signal) as Observable<ModulesResponseDto>;
}

static getRankingcoachSeoFeatureModulesThunk = createAsyncThunk<
  ModulesResponseDto,
   GetRankingcoachSeoFeatureModulesOpts,
  {
      rejectValue: any
  }
>

/** 
* Get the list of available modules. 
* Returns the list of available modules with their names. 
*/
("getRankingcoachSeoFeatureModules", async ( queryParams?: GetRankingcoachSeoFeatureModulesOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoFeatureModulesAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoFeatureModules( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoFeatureModulesAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoFeatureModulesAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoFeatureModulesUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/feature_modules');
static getRankingcoachSeoFeatureModulesUrlMockRequest = '/wp-json/rankingcoach/seo/feature_modules(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoAccountDetailsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Returns the rankingCoach account details including user data, subscription data, and other account details. 
*/


/** 
* Get the current logged account details. 
* Returns the rankingCoach account details including user data, subscription data, and other account details. 
*/
getRankingcoachSeoAccountDetails(  queryParams?: GetRankingcoachSeoAccountDetailsOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/account_details`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoAccountDetailsThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoAccountDetailsOpts,
  {
      rejectValue: any
  }
>

/** 
* Get the current logged account details. 
* Returns the rankingCoach account details including user data, subscription data, and other account details. 
*/
("getRankingcoachSeoAccountDetails", async ( queryParams?: GetRankingcoachSeoAccountDetailsOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoAccountDetailsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoAccountDetails( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoAccountDetailsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoAccountDetailsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoAccountDetailsUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/account_details');
static getRankingcoachSeoAccountDetailsUrlMockRequest = '/wp-json/rankingcoach/seo/account_details(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoLocationKeywordsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Returns from rankingCoach the location keywords for the current logged account. 
*/


/** 
* Get the location keywords. 
* Returns from rankingCoach the location keywords for the current logged account. 
*/
getRankingcoachSeoLocationKeywords(  queryParams?: GetRankingcoachSeoLocationKeywordsOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/location_keywords`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoLocationKeywordsThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoLocationKeywordsOpts,
  {
      rejectValue: any
  }
>

/** 
* Get the location keywords. 
* Returns from rankingCoach the location keywords for the current logged account. 
*/
("getRankingcoachSeoLocationKeywords", async ( queryParams?: GetRankingcoachSeoLocationKeywordsOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoLocationKeywordsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoLocationKeywords( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoLocationKeywordsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoLocationKeywordsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoLocationKeywordsUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/location_keywords');
static getRankingcoachSeoLocationKeywordsUrlMockRequest = '/wp-json/rankingcoach/seo/location_keywords(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoRcVariablesDataByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Returns the available variables for a post. 
*/


/** 
* Get the available variables for a post. 
* Returns the available variables for a post. 
*/
getRankingcoachSeoRcVariablesDataById(  queryParams?: GetRankingcoachSeoRcVariablesDataByIdOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/rc_variables/${id}/data`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoRcVariablesDataByIdThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoRcVariablesDataByIdOpts,
  {
      rejectValue: any
  }
>

/** 
* Get the available variables for a post. 
* Returns the available variables for a post. 
*/
("getRankingcoachSeoRcVariablesDataById", async ( queryParams?: GetRankingcoachSeoRcVariablesDataByIdOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoRcVariablesDataByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoRcVariablesDataById( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoRcVariablesDataByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoRcVariablesDataByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoRcVariablesDataByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/rc_variables/{id}/data');
static getRankingcoachSeoRcVariablesDataByIdUrlMockRequest = '/wp-json/rankingcoach/seo/rc_variables/{id}/data(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoGenerateSdkAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Generates the OpenAPI spec for registered routes. This is used for generating stores on frontend. 
*/


/** 
* Generate OpenAPI specification. 
* Generates the OpenAPI spec for registered routes. This is used for generating stores on frontend. 
*/
getRankingcoachSeoGenerateSdk(  queryParams?: GetRankingcoachSeoGenerateSdkOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/generate_sdk`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoGenerateSdkThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoGenerateSdkOpts,
  {
      rejectValue: any
  }
>

/** 
* Generate OpenAPI specification. 
* Generates the OpenAPI spec for registered routes. This is used for generating stores on frontend. 
*/
("getRankingcoachSeoGenerateSdk", async ( queryParams?: GetRankingcoachSeoGenerateSdkOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoGenerateSdkAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoGenerateSdk( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoGenerateSdkAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoGenerateSdkAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoGenerateSdkUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/generate_sdk');
static getRankingcoachSeoGenerateSdkUrlMockRequest = '/wp-json/rankingcoach/seo/generate_sdk(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoSdkTokenAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Creates a temporary token for SDK generation. The token is valid for 10 minutes and allows access to documentation/OpenAPI endpoints. 
*/


/** 
* Create SDK Generation Token 
* Creates a temporary token for SDK generation. The token is valid for 10 minutes and allows access to documentation/OpenAPI endpoints. 
*/
postRankingcoachSeoSdkToken(  requestBody: null, queryParams?: PostRankingcoachSeoSdkTokenOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<any> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/sdk_token`), requestBody, queryParams, signal, contentType) as Observable<any>;
}

static postRankingcoachSeoSdkTokenThunk = createAsyncThunk<
  any,
  { requestBody: null, queryParams?: PostRankingcoachSeoSdkTokenOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Create SDK Generation Token 
* Creates a temporary token for SDK generation. The token is valid for 10 minutes and allows access to documentation/OpenAPI endpoints. 
*/
("postRankingcoachSeoSdkToken", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostRankingcoachSeoSdkTokenOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoSdkTokenAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoSdkToken( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoSdkTokenAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoSdkTokenAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoSdkTokenUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/sdk_token');
static postRankingcoachSeoSdkTokenUrlMockRequest = '/wp-json/rankingcoach/seo/sdk_token(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoSettingsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Handle general settings CRUD operations 
*/


/** 
* General Settings Management 
* Handle general settings CRUD operations 
*/
getRankingcoachSeoSettings(  queryParams?: GetRankingcoachSeoSettingsOpts, signal?: AbortSignal ): Observable<SettingsResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/settings`), queryParams, signal) as Observable<SettingsResponseDto>;
}

static getRankingcoachSeoSettingsThunk = createAsyncThunk<
  SettingsResponseDto,
   GetRankingcoachSeoSettingsOpts,
  {
      rejectValue: any
  }
>

/** 
* General Settings Management 
* Handle general settings CRUD operations 
*/
("getRankingcoachSeoSettings", async ( queryParams?: GetRankingcoachSeoSettingsOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoSettingsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoSettings( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoSettingsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoSettingsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoSettingsUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/settings');
static getRankingcoachSeoSettingsUrlMockRequest = '/wp-json/rankingcoach/seo/settings(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoSettingsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Handle general settings CRUD operations 
*/


/** 
* General Settings Management 
* Handle general settings CRUD operations 
*/
postRankingcoachSeoSettings(  requestBody: SettingsRequestDto, queryParams?: PostRankingcoachSeoSettingsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<SettingsResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/settings`), requestBody, queryParams, signal, contentType) as Observable<SettingsResponseDto>;
}

static postRankingcoachSeoSettingsThunk = createAsyncThunk<
  SettingsResponseDto,
  { requestBody: SettingsRequestDto, queryParams?: PostRankingcoachSeoSettingsOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* General Settings Management 
* Handle general settings CRUD operations 
*/
("postRankingcoachSeoSettings", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: SettingsRequestDto, queryParams?: PostRankingcoachSeoSettingsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoSettingsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoSettings( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoSettingsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoSettingsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoSettingsUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/settings');
static postRankingcoachSeoSettingsUrlMockRequest = '/wp-json/rankingcoach/seo/settings(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoSettingsByKeyAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Handle individual setting CRUD operations 
*/


/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
getRankingcoachSeoSettingsByKey(  queryParams?: GetRankingcoachSeoSettingsByKeyOpts, signal?: AbortSignal ): Observable<SingleSettingResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/settings/${key}`), queryParams, signal) as Observable<SingleSettingResponseDto>;
}

static getRankingcoachSeoSettingsByKeyThunk = createAsyncThunk<
  SingleSettingResponseDto,
   GetRankingcoachSeoSettingsByKeyOpts,
  {
      rejectValue: any
  }
>

/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
("getRankingcoachSeoSettingsByKey", async ( queryParams?: GetRankingcoachSeoSettingsByKeyOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoSettingsByKeyAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoSettingsByKey( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoSettingsByKeyUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/settings/{key}');
static getRankingcoachSeoSettingsByKeyUrlMockRequest = '/wp-json/rankingcoach/seo/settings/{key}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoSettingsByKeyAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Handle individual setting CRUD operations 
*/


/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
postRankingcoachSeoSettingsByKey(  requestBody: SingleSettingRequestDto, queryParams?: PostRankingcoachSeoSettingsByKeyOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<SingleSettingResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/settings/${key}`), requestBody, queryParams, signal, contentType) as Observable<SingleSettingResponseDto>;
}

static postRankingcoachSeoSettingsByKeyThunk = createAsyncThunk<
  SingleSettingResponseDto,
  { requestBody: SingleSettingRequestDto, queryParams?: PostRankingcoachSeoSettingsByKeyOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
("postRankingcoachSeoSettingsByKey", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: SingleSettingRequestDto, queryParams?: PostRankingcoachSeoSettingsByKeyOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoSettingsByKeyAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoSettingsByKey( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoSettingsByKeyUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/settings/{key}');
static postRankingcoachSeoSettingsByKeyUrlMockRequest = '/wp-json/rankingcoach/seo/settings/{key}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static deleteRankingcoachSeoSettingsByKeyAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Handle individual setting CRUD operations 
*/


/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
deleteRankingcoachSeoSettingsByKey(  requestBody: SingleSettingRequestDto, queryParams?: DeleteRankingcoachSeoSettingsByKeyOpts, signal?: AbortSignal ): Observable<SingleSettingResponseDto> {
  return this.delete(new EndPoint(`/wp-json/rankingcoach/seo/settings/${key}`), requestBody, queryParams, signal) as Observable<SingleSettingResponseDto>;
}

static deleteRankingcoachSeoSettingsByKeyThunk = createAsyncThunk<
  SingleSettingResponseDto,
  { requestBody: SingleSettingRequestDto, queryParams?: DeleteRankingcoachSeoSettingsByKeyOpts} ,
  {
      rejectValue: any
  }
>

/** 
* Single Setting Management 
* Handle individual setting CRUD operations 
*/
("deleteRankingcoachSeoSettingsByKey", async ({ requestBody , queryParams} : { requestBody: SingleSettingRequestDto, queryParams?: DeleteRankingcoachSeoSettingsByKeyOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.deleteRankingcoachSeoSettingsByKeyAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.deleteRankingcoachSeoSettingsByKey( requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.deleteRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.deleteRankingcoachSeoSettingsByKeyAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static deleteRankingcoachSeoSettingsByKeyUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/settings/{key}');
static deleteRankingcoachSeoSettingsByKeyUrlMockRequest = '/wp-json/rankingcoach/seo/settings/{key}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoBreadcrumbsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Generate breadcrumbs for multiple context types with full customization support. Supports post types, archives, search results, 404 pages, taxonomies, and date archives. Context-aware generation based on provided parameters. 
*/


/** 
* Multi-context Breadcrumbs Generator 
* Generate breadcrumbs for multiple context types with full customization support. Supports post types, archives, search results, 404 pages, taxonomies, and date archives. Context-aware generation based on provided parameters. 
*/
postRankingcoachSeoBreadcrumbs(  requestBody: BreadcrumbsRequestDto, queryParams?: PostRankingcoachSeoBreadcrumbsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<BreadcrumbsResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/breadcrumbs`), requestBody, queryParams, signal, contentType) as Observable<BreadcrumbsResponseDto>;
}

static postRankingcoachSeoBreadcrumbsThunk = createAsyncThunk<
  BreadcrumbsResponseDto,
  { requestBody: BreadcrumbsRequestDto, queryParams?: PostRankingcoachSeoBreadcrumbsOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Multi-context Breadcrumbs Generator 
* Generate breadcrumbs for multiple context types with full customization support. Supports post types, archives, search results, 404 pages, taxonomies, and date archives. Context-aware generation based on provided parameters. 
*/
("postRankingcoachSeoBreadcrumbs", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: BreadcrumbsRequestDto, queryParams?: PostRankingcoachSeoBreadcrumbsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoBreadcrumbsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoBreadcrumbs( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoBreadcrumbsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoBreadcrumbsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoBreadcrumbsUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/breadcrumbs');
static postRankingcoachSeoBreadcrumbsUrlMockRequest = '/wp-json/rankingcoach/seo/breadcrumbs(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoAccountChallengeAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
postRankingcoachSeoAccountChallenge(  requestBody: null, queryParams?: PostRankingcoachSeoAccountChallengeOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<any> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/account/challenge`), requestBody, queryParams, signal, contentType) as Observable<any>;
}

static postRankingcoachSeoAccountChallengeThunk = createAsyncThunk<
  any,
  { requestBody: null, queryParams?: PostRankingcoachSeoAccountChallengeOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("postRankingcoachSeoAccountChallenge", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostRankingcoachSeoAccountChallengeOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoAccountChallengeAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoAccountChallenge( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoAccountChallengeAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoAccountChallengeAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoAccountChallengeUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/account/challenge');
static postRankingcoachSeoAccountChallengeUrlMockRequest = '/wp-json/rankingcoach/seo/account/challenge(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoAccountVerificationStatusAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
getRankingcoachSeoAccountVerificationStatus(  queryParams?: GetRankingcoachSeoAccountVerificationStatusOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/account/verificationStatus`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoAccountVerificationStatusThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoAccountVerificationStatusOpts,
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("getRankingcoachSeoAccountVerificationStatus", async ( queryParams?: GetRankingcoachSeoAccountVerificationStatusOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoAccountVerificationStatusAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoAccountVerificationStatus( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoAccountVerificationStatusAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoAccountVerificationStatusAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoAccountVerificationStatusUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/account/verificationStatus');
static getRankingcoachSeoAccountVerificationStatusUrlMockRequest = '/wp-json/rankingcoach/seo/account/verificationStatus(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoAccountRegisterAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
postRankingcoachSeoAccountRegister(  requestBody: null, queryParams?: PostRankingcoachSeoAccountRegisterOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<any> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/account/register`), requestBody, queryParams, signal, contentType) as Observable<any>;
}

static postRankingcoachSeoAccountRegisterThunk = createAsyncThunk<
  any,
  { requestBody: null, queryParams?: PostRankingcoachSeoAccountRegisterOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("postRankingcoachSeoAccountRegister", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostRankingcoachSeoAccountRegisterOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoAccountRegisterAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoAccountRegister( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoAccountRegisterAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoAccountRegisterAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoAccountRegisterUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/account/register');
static postRankingcoachSeoAccountRegisterUrlMockRequest = '/wp-json/rankingcoach/seo/account/register(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoAccountFinalizeRegisterAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
postRankingcoachSeoAccountFinalizeRegister(  requestBody: null, queryParams?: PostRankingcoachSeoAccountFinalizeRegisterOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<any> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/account/finalizeRegister`), requestBody, queryParams, signal, contentType) as Observable<any>;
}

static postRankingcoachSeoAccountFinalizeRegisterThunk = createAsyncThunk<
  any,
  { requestBody: null, queryParams?: PostRankingcoachSeoAccountFinalizeRegisterOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("postRankingcoachSeoAccountFinalizeRegister", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostRankingcoachSeoAccountFinalizeRegisterOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoAccountFinalizeRegisterAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoAccountFinalizeRegister( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoAccountFinalizeRegisterAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoAccountFinalizeRegisterAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoAccountFinalizeRegisterUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/account/finalizeRegister');
static postRankingcoachSeoAccountFinalizeRegisterUrlMockRequest = '/wp-json/rankingcoach/seo/account/finalizeRegister(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoFlowguardStateAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
getRankingcoachSeoFlowguardState(  queryParams?: GetRankingcoachSeoFlowguardStateOpts, signal?: AbortSignal ): Observable<any> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/flowguard/state`), queryParams, signal) as Observable<any>;
}

static getRankingcoachSeoFlowguardStateThunk = createAsyncThunk<
  any,
   GetRankingcoachSeoFlowguardStateOpts,
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("getRankingcoachSeoFlowguardState", async ( queryParams?: GetRankingcoachSeoFlowguardStateOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoFlowguardStateAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoFlowguardState( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoFlowguardStateAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoFlowguardStateAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoFlowguardStateUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/flowguard/state');
static getRankingcoachSeoFlowguardStateUrlMockRequest = '/wp-json/rankingcoach/seo/flowguard/state(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoConnectUrlAbortManager: AbortControllersManager = new AbortControllersManager();



/** 
*  
*  
*/
postRankingcoachSeoConnectUrl(  requestBody: null, queryParams?: PostRankingcoachSeoConnectUrlOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<any> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/connect/url`), requestBody, queryParams, signal, contentType) as Observable<any>;
}

static postRankingcoachSeoConnectUrlThunk = createAsyncThunk<
  any,
  { requestBody: null, queryParams?: PostRankingcoachSeoConnectUrlOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
*  
*  
*/
("postRankingcoachSeoConnectUrl", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostRankingcoachSeoConnectUrlOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoConnectUrlAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoConnectUrl( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoConnectUrlAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoConnectUrlAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoConnectUrlUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/connect/url');
static postRankingcoachSeoConnectUrlUrlMockRequest = '/wp-json/rankingcoach/seo/connect/url(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoLinkAnalyzerAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get all links with pagination 
*/


/** 
* Get All Links 
* Get all links with pagination 
*/
getRankingcoachSeoLinkAnalyzer(  queryParams?: GetRankingcoachSeoLinkAnalyzerOpts, signal?: AbortSignal ): Observable<GetAllLinksResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/linkAnalyzer`), queryParams, signal) as Observable<GetAllLinksResponseDto>;
}

static getRankingcoachSeoLinkAnalyzerThunk = createAsyncThunk<
  GetAllLinksResponseDto,
   GetRankingcoachSeoLinkAnalyzerOpts,
  {
      rejectValue: any
  }
>

/** 
* Get All Links 
* Get all links with pagination 
*/
("getRankingcoachSeoLinkAnalyzer", async ( queryParams?: GetRankingcoachSeoLinkAnalyzerOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoLinkAnalyzerAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoLinkAnalyzer( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoLinkAnalyzerAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoLinkAnalyzerAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoLinkAnalyzerUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/linkAnalyzer');
static getRankingcoachSeoLinkAnalyzerUrlMockRequest = '/wp-json/rankingcoach/seo/linkAnalyzer(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoLinkAnalyzerByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get links for a specific post 
*/


/** 
* Get Links For Post 
* Get links for a specific post 
*/
getRankingcoachSeoLinkAnalyzerById( id: number,  queryParams?: GetRankingcoachSeoLinkAnalyzerByIdOpts, signal?: AbortSignal ): Observable<GetLinksForPostResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/linkAnalyzer/${id}`), queryParams, signal) as Observable<GetLinksForPostResponseDto>;
}

static getRankingcoachSeoLinkAnalyzerByIdThunk = createAsyncThunk<
  GetLinksForPostResponseDto,
  {id: number,  queryParams?: GetRankingcoachSeoLinkAnalyzerByIdOpts},
  {
      rejectValue: any
  }
>

/** 
* Get Links For Post 
* Get links for a specific post 
*/
("getRankingcoachSeoLinkAnalyzerById", async ({id,  queryParams } : {id: number,  queryParams?: GetRankingcoachSeoLinkAnalyzerByIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoLinkAnalyzerByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoLinkAnalyzerById(id,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoLinkAnalyzerByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoLinkAnalyzerByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoLinkAnalyzerByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/linkAnalyzer/{id}');
static getRankingcoachSeoLinkAnalyzerByIdUrlMockRequest = '/wp-json/rankingcoach/seo/linkAnalyzer/{id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoLinkAnalyzerIndexByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Index links from posts 
*/


/** 
* Index Links 
* Index links from posts 
*/
postRankingcoachSeoLinkAnalyzerIndexByPostId( post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerIndexByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<IndexLinksResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/linkAnalyzer/index/${post_id}`), requestBody, queryParams, signal, contentType) as Observable<IndexLinksResponseDto>;
}

static postRankingcoachSeoLinkAnalyzerIndexByPostIdThunk = createAsyncThunk<
  IndexLinksResponseDto,
  {post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerIndexByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Index Links 
* Index links from posts 
*/
("postRankingcoachSeoLinkAnalyzerIndexByPostId", async ({post_id,  requestBody, queryParams, contentType = 'application/json'} : {post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerIndexByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoLinkAnalyzerIndexByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoLinkAnalyzerIndexByPostId(post_id,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoLinkAnalyzerIndexByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoLinkAnalyzerIndexByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoLinkAnalyzerIndexByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/linkAnalyzer/index/{post_id}');
static postRankingcoachSeoLinkAnalyzerIndexByPostIdUrlMockRequest = '/wp-json/rankingcoach/seo/linkAnalyzer/index/{post_id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoLinkAnalyzerScanByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Scan links for broken status 
*/


/** 
* Scan Links 
* Scan links for broken status 
*/
postRankingcoachSeoLinkAnalyzerScanByPostId( post_id: number,  requestBody: ScanLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerScanByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<ScanLinksResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/linkAnalyzer/scan/${post_id}`), requestBody, queryParams, signal, contentType) as Observable<ScanLinksResponseDto>;
}

static postRankingcoachSeoLinkAnalyzerScanByPostIdThunk = createAsyncThunk<
  ScanLinksResponseDto,
  {post_id: number,  requestBody: ScanLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerScanByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Scan Links 
* Scan links for broken status 
*/
("postRankingcoachSeoLinkAnalyzerScanByPostId", async ({post_id,  requestBody, queryParams, contentType = 'application/json'} : {post_id: number,  requestBody: ScanLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerScanByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoLinkAnalyzerScanByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoLinkAnalyzerScanByPostId(post_id,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoLinkAnalyzerScanByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoLinkAnalyzerScanByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoLinkAnalyzerScanByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/linkAnalyzer/scan/{post_id}');
static postRankingcoachSeoLinkAnalyzerScanByPostIdUrlMockRequest = '/wp-json/rankingcoach/seo/linkAnalyzer/scan/{post_id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoLinkAnalyzerVerifyByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Verify links for status 
*/


/** 
* Verify Links 
* Verify links for status 
*/
postRankingcoachSeoLinkAnalyzerVerifyByPostId( post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerVerifyByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<IndexLinksResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/linkAnalyzer/verify/${post_id}`), requestBody, queryParams, signal, contentType) as Observable<IndexLinksResponseDto>;
}

static postRankingcoachSeoLinkAnalyzerVerifyByPostIdThunk = createAsyncThunk<
  IndexLinksResponseDto,
  {post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerVerifyByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Verify Links 
* Verify links for status 
*/
("postRankingcoachSeoLinkAnalyzerVerifyByPostId", async ({post_id,  requestBody, queryParams, contentType = 'application/json'} : {post_id: number,  requestBody: IndexLinksRequestDto, queryParams?: PostRankingcoachSeoLinkAnalyzerVerifyByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoLinkAnalyzerVerifyByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoLinkAnalyzerVerifyByPostId(post_id,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoLinkAnalyzerVerifyByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoLinkAnalyzerVerifyByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoLinkAnalyzerVerifyByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/linkAnalyzer/verify/{post_id}');
static postRankingcoachSeoLinkAnalyzerVerifyByPostIdUrlMockRequest = '/wp-json/rankingcoach/seo/linkAnalyzer/verify/{post_id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoRedirectManagerAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get all redirects 
*/


/** 
* Get All Redirects 
* Get all redirects 
*/
getRankingcoachSeoRedirectManager(  queryParams?: GetRankingcoachSeoRedirectManagerOpts, signal?: AbortSignal ): Observable<GetRedirectsResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/redirectManager`), queryParams, signal) as Observable<GetRedirectsResponseDto>;
}

static getRankingcoachSeoRedirectManagerThunk = createAsyncThunk<
  GetRedirectsResponseDto,
   GetRankingcoachSeoRedirectManagerOpts,
  {
      rejectValue: any
  }
>

/** 
* Get All Redirects 
* Get all redirects 
*/
("getRankingcoachSeoRedirectManager", async ( queryParams?: GetRankingcoachSeoRedirectManagerOpts, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoRedirectManagerAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoRedirectManager( queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoRedirectManagerAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoRedirectManagerAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoRedirectManagerUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/redirectManager');
static getRankingcoachSeoRedirectManagerUrlMockRequest = '/wp-json/rankingcoach/seo/redirectManager(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoRedirectManagerAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Create a new redirect 
*/


/** 
* Create Redirect 
* Create a new redirect 
*/
postRankingcoachSeoRedirectManager(  requestBody: CreateRedirectRequestDto, queryParams?: PostRankingcoachSeoRedirectManagerOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<CreateRedirectResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/redirectManager`), requestBody, queryParams, signal, contentType) as Observable<CreateRedirectResponseDto>;
}

static postRankingcoachSeoRedirectManagerThunk = createAsyncThunk<
  CreateRedirectResponseDto,
  { requestBody: CreateRedirectRequestDto, queryParams?: PostRankingcoachSeoRedirectManagerOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Create Redirect 
* Create a new redirect 
*/
("postRankingcoachSeoRedirectManager", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: CreateRedirectRequestDto, queryParams?: PostRankingcoachSeoRedirectManagerOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoRedirectManagerAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoRedirectManager( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoRedirectManagerAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoRedirectManagerAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoRedirectManagerUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/redirectManager');
static postRankingcoachSeoRedirectManagerUrlMockRequest = '/wp-json/rankingcoach/seo/redirectManager(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoRedirectManagerByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get a single redirect by ID 
*/


/** 
* Get Redirect 
* Get a single redirect by ID 
*/
getRankingcoachSeoRedirectManagerById( id: number,  queryParams?: GetRankingcoachSeoRedirectManagerByIdOpts, signal?: AbortSignal ): Observable<GetRedirectResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/redirectManager/${id}`), queryParams, signal) as Observable<GetRedirectResponseDto>;
}

static getRankingcoachSeoRedirectManagerByIdThunk = createAsyncThunk<
  GetRedirectResponseDto,
  {id: number,  queryParams?: GetRankingcoachSeoRedirectManagerByIdOpts},
  {
      rejectValue: any
  }
>

/** 
* Get Redirect 
* Get a single redirect by ID 
*/
("getRankingcoachSeoRedirectManagerById", async ({id,  queryParams } : {id: number,  queryParams?: GetRankingcoachSeoRedirectManagerByIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoRedirectManagerByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoRedirectManagerById(id,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoRedirectManagerByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/redirectManager/{id}');
static getRankingcoachSeoRedirectManagerByIdUrlMockRequest = '/wp-json/rankingcoach/seo/redirectManager/{id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static patchRankingcoachSeoRedirectManagerByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Update an existing redirect 
*/


/** 
* Update Redirect 
* Update an existing redirect 
*/
patchRankingcoachSeoRedirectManagerById( id: number,  requestBody: UpdateRedirectRequestDto, queryParams?: PatchRankingcoachSeoRedirectManagerByIdOpts, signal?: AbortSignal ): Observable<UpdateRedirectResponseDto> {
  return this.patch(new EndPoint(`/wp-json/rankingcoach/seo/redirectManager/${id}`), requestBody, queryParams, signal) as Observable<UpdateRedirectResponseDto>;
}

static patchRankingcoachSeoRedirectManagerByIdThunk = createAsyncThunk<
  UpdateRedirectResponseDto,
  {id: number,  requestBody: UpdateRedirectRequestDto, queryParams?: PatchRankingcoachSeoRedirectManagerByIdOpts},
  {
      rejectValue: any
  }
>

/** 
* Update Redirect 
* Update an existing redirect 
*/
("patchRankingcoachSeoRedirectManagerById", async ({id,  requestBody, queryParams } : {id: number,  requestBody: UpdateRedirectRequestDto, queryParams?: PatchRankingcoachSeoRedirectManagerByIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.patchRankingcoachSeoRedirectManagerByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.patchRankingcoachSeoRedirectManagerById(id,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.patchRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.patchRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static patchRankingcoachSeoRedirectManagerByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/redirectManager/{id}');
static patchRankingcoachSeoRedirectManagerByIdUrlMockRequest = '/wp-json/rankingcoach/seo/redirectManager/{id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static deleteRankingcoachSeoRedirectManagerByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Delete a redirect 
*/


/** 
* Delete Redirect 
* Delete a redirect 
*/
deleteRankingcoachSeoRedirectManagerById( id: number,  requestBody: DeleteRedirectRequestDto, queryParams?: DeleteRankingcoachSeoRedirectManagerByIdOpts, signal?: AbortSignal ): Observable<DeleteRedirectResponseDto> {
  return this.delete(new EndPoint(`/wp-json/rankingcoach/seo/redirectManager/${id}`), requestBody, queryParams, signal) as Observable<DeleteRedirectResponseDto>;
}

static deleteRankingcoachSeoRedirectManagerByIdThunk = createAsyncThunk<
  DeleteRedirectResponseDto,
  {id: number,  requestBody: DeleteRedirectRequestDto, queryParams?: DeleteRankingcoachSeoRedirectManagerByIdOpts} ,
  {
      rejectValue: any
  }
>

/** 
* Delete Redirect 
* Delete a redirect 
*/
("deleteRankingcoachSeoRedirectManagerById", async ({id,  requestBody , queryParams} : {id: number,  requestBody: DeleteRedirectRequestDto, queryParams?: DeleteRankingcoachSeoRedirectManagerByIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.deleteRankingcoachSeoRedirectManagerByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.deleteRankingcoachSeoRedirectManagerById(id,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.deleteRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.deleteRankingcoachSeoRedirectManagerByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static deleteRankingcoachSeoRedirectManagerByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/redirectManager/{id}');
static deleteRankingcoachSeoRedirectManagerByIdUrlMockRequest = '/wp-json/rankingcoach/seo/redirectManager/{id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getRankingcoachSeoSchemaMarkupByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get the schema settings data for the module. 
*/


/** 
* Get Schema Data 
* Get the schema settings data for the module. 
*/
getRankingcoachSeoSchemaMarkupById( id: number,  queryParams?: GetRankingcoachSeoSchemaMarkupByIdOpts, signal?: AbortSignal ): Observable<SchemaMarkupGetDataResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/seo/schemaMarkup/${id}`), queryParams, signal) as Observable<SchemaMarkupGetDataResponseDto>;
}

static getRankingcoachSeoSchemaMarkupByIdThunk = createAsyncThunk<
  SchemaMarkupGetDataResponseDto,
  {id: number,  queryParams?: GetRankingcoachSeoSchemaMarkupByIdOpts},
  {
      rejectValue: any
  }
>

/** 
* Get Schema Data 
* Get the schema settings data for the module. 
*/
("getRankingcoachSeoSchemaMarkupById", async ({id,  queryParams } : {id: number,  queryParams?: GetRankingcoachSeoSchemaMarkupByIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getRankingcoachSeoSchemaMarkupByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.getRankingcoachSeoSchemaMarkupById(id,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getRankingcoachSeoSchemaMarkupByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getRankingcoachSeoSchemaMarkupByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getRankingcoachSeoSchemaMarkupByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/schemaMarkup/{id}');
static getRankingcoachSeoSchemaMarkupByIdUrlMockRequest = '/wp-json/rankingcoach/seo/schemaMarkup/{id}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postRankingcoachSeoSchemaMarkupSaveByIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save the schema settings data for the module 
*/


/** 
* Save Schema Data 
* Save the schema settings data for the module 
*/
postRankingcoachSeoSchemaMarkupSaveById( id: number,  requestBody: SchemaMarkupPostSaveDataRequestDto, queryParams?: PostRankingcoachSeoSchemaMarkupSaveByIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<SchemaMarkupGetDataResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/seo/schemaMarkup/${id}/save`), requestBody, queryParams, signal, contentType) as Observable<SchemaMarkupGetDataResponseDto>;
}

static postRankingcoachSeoSchemaMarkupSaveByIdThunk = createAsyncThunk<
  SchemaMarkupGetDataResponseDto,
  {id: number,  requestBody: SchemaMarkupPostSaveDataRequestDto, queryParams?: PostRankingcoachSeoSchemaMarkupSaveByIdOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Save Schema Data 
* Save the schema settings data for the module 
*/
("postRankingcoachSeoSchemaMarkupSaveById", async ({id,  requestBody, queryParams, contentType = 'application/json'} : {id: number,  requestBody: SchemaMarkupPostSaveDataRequestDto, queryParams?: PostRankingcoachSeoSchemaMarkupSaveByIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postRankingcoachSeoSchemaMarkupSaveByIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      seoStore.postRankingcoachSeoSchemaMarkupSaveById(id,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postRankingcoachSeoSchemaMarkupSaveByIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postRankingcoachSeoSchemaMarkupSaveByIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postRankingcoachSeoSchemaMarkupSaveByIdUrlRegEx = new RegExp('/wp-json/rankingcoach/seo/schemaMarkup/{id}/save');
static postRankingcoachSeoSchemaMarkupSaveByIdUrlMockRequest = '/wp-json/rankingcoach/seo/schemaMarkup/{id}/save(.*)';


  
 }
 export const seoStore = new SeoStore();
 