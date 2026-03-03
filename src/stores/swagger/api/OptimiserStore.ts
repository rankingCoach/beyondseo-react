
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SeoDataExtractionResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Seo/SeoDataExtractionResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    import type { SeoOptimiserResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/Seo/SeoOptimiserResponseDto';
    


 export type GetApiOptimiserDataByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* $context List of context keys to be loaded, separated by comma 
*/
  context? : string,
  /** 
* $factor List of factor keys to be loaded, separated by comma 
*/
  factor? : string,
  /** 
* $operation List of operation keys to be loaded, separated by comma 
*/
  operation? : string,
  
  export? : string,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiOptimiserByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* $context List of context keys to be loaded, separated by comma 
*/
  context? : string,
  /** 
* $factor List of factor keys to be loaded, separated by comma 
*/
  factor? : string,
  /** 
* $operation List of operation keys to be loaded, separated by comma 
*/
  operation? : string,
  
  export? : string,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiOptimiserByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* $context List of context keys to be loaded, separated by comma 
*/
  context? : string,
  /** 
* $factor List of factor keys to be loaded, separated by comma 
*/
  factor? : string,
  /** 
* $operation List of operation keys to be loaded, separated by comma 
*/
  operation? : string,
  
  export? : string,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class OptimiserStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiOptimiserDataByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Extract SEO data 
*/


/** 
* Extract SEO Data 
* Extract SEO data 
*/
getApiOptimiserDataByPostId( postId: number,  queryParams: GetApiOptimiserDataByPostIdOpts, signal?: AbortSignal ): Observable<SeoDataExtractionResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/optimiser/${postId}/data`), queryParams, signal) as Observable<SeoDataExtractionResponseDto>;
}

static getApiOptimiserDataByPostIdThunk = createAsyncThunk<
  SeoDataExtractionResponseDto,
  {postId: number,  queryParams: GetApiOptimiserDataByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Extract SEO Data 
* Extract SEO data 
*/
("getApiOptimiserDataByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiOptimiserDataByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiOptimiserDataByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      optimiserStore.getApiOptimiserDataByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiOptimiserDataByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiOptimiserDataByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiOptimiserDataByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/optimiser/{postId}/data');
static getApiOptimiserDataByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/optimiser/{postId}/data(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiOptimiserByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieve the SEO Optimiser 
*/


/** 
* Retrieve SEO Optimiser 
* Retrieve the SEO Optimiser 
*/
getApiOptimiserByPostId( postId: number,  queryParams: GetApiOptimiserByPostIdOpts, signal?: AbortSignal ): Observable<SeoOptimiserResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/optimiser/${postId}`), queryParams, signal) as Observable<SeoOptimiserResponseDto>;
}

static getApiOptimiserByPostIdThunk = createAsyncThunk<
  SeoOptimiserResponseDto,
  {postId: number,  queryParams: GetApiOptimiserByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Retrieve SEO Optimiser 
* Retrieve the SEO Optimiser 
*/
("getApiOptimiserByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiOptimiserByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiOptimiserByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      optimiserStore.getApiOptimiserByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiOptimiserByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiOptimiserByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiOptimiserByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/optimiser/{postId}');
static getApiOptimiserByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/optimiser/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiOptimiserByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Process the SEO Optimizer 
*/


/** 
* Proceed SEO Optimiser 
* Process the SEO Optimizer 
*/
postApiOptimiserByPostId( postId: number,  requestBody: null, queryParams: PostApiOptimiserByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<SeoOptimiserResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/optimiser/${postId}`), requestBody, queryParams, signal, contentType) as Observable<SeoOptimiserResponseDto>;
}

static postApiOptimiserByPostIdThunk = createAsyncThunk<
  SeoOptimiserResponseDto,
  {postId: number,  requestBody: null, queryParams: PostApiOptimiserByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Proceed SEO Optimiser 
* Process the SEO Optimizer 
*/
("postApiOptimiserByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: null, queryParams: PostApiOptimiserByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiOptimiserByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      optimiserStore.postApiOptimiserByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiOptimiserByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiOptimiserByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiOptimiserByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/optimiser/{postId}');
static postApiOptimiserByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/optimiser/{postId}(.*)';


  
 }
 export const optimiserStore = new OptimiserStore();
 