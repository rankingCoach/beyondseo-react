
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SocialMetaTagsGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/SocialMetaTagsGetResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    import type { SocialMetaTagsPostRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/SocialMetaTagsPostRequestDto';
    import type { SocialImageSourcesResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/SocialImageSourcesResponseDto';
    


 export type GetApiSocialByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiSocialByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiSocialImageSourcesByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class SocialStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiSocialByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get MetaTags 
*/


/** 
* Get all Social MetaTags 
* Get MetaTags 
*/
getApiSocialByPostId( postId: number,  queryParams: GetApiSocialByPostIdOpts, signal?: AbortSignal ): Observable<SocialMetaTagsGetResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/social/${postId}`), queryParams, signal) as Observable<SocialMetaTagsGetResponseDto>;
}

static getApiSocialByPostIdThunk = createAsyncThunk<
  SocialMetaTagsGetResponseDto,
  {postId: number,  queryParams: GetApiSocialByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Get all Social MetaTags 
* Get MetaTags 
*/
("getApiSocialByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiSocialByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiSocialByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      socialStore.getApiSocialByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiSocialByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiSocialByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiSocialByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/social/{postId}');
static getApiSocialByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/social/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiSocialByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTag Keywords 
*/


/** 
* Update all Social MetaTags 
* Save MetaTag Keywords 
*/
postApiSocialByPostId( postId: number,  requestBody: SocialMetaTagsPostRequestDto, queryParams: PostApiSocialByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<SocialMetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/social/${postId}`), requestBody, queryParams, signal, contentType) as Observable<SocialMetaTagsGetResponseDto>;
}

static postApiSocialByPostIdThunk = createAsyncThunk<
  SocialMetaTagsGetResponseDto,
  {postId: number,  requestBody: SocialMetaTagsPostRequestDto, queryParams: PostApiSocialByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Update all Social MetaTags 
* Save MetaTag Keywords 
*/
("postApiSocialByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: SocialMetaTagsPostRequestDto, queryParams: PostApiSocialByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiSocialByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      socialStore.postApiSocialByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiSocialByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiSocialByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiSocialByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/social/{postId}');
static postApiSocialByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/social/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiSocialImageSourcesByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get Social Image Sources 
*/


/** 
* Get all Social Image Sources 
* Get Social Image Sources 
*/
getApiSocialImageSourcesByPostId( postId: number,  queryParams: GetApiSocialImageSourcesByPostIdOpts, signal?: AbortSignal ): Observable<SocialImageSourcesResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/social/${postId}/image_sources`), queryParams, signal) as Observable<SocialImageSourcesResponseDto>;
}

static getApiSocialImageSourcesByPostIdThunk = createAsyncThunk<
  SocialImageSourcesResponseDto,
  {postId: number,  queryParams: GetApiSocialImageSourcesByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Get all Social Image Sources 
* Get Social Image Sources 
*/
("getApiSocialImageSourcesByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiSocialImageSourcesByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiSocialImageSourcesByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      socialStore.getApiSocialImageSourcesByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiSocialImageSourcesByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiSocialImageSourcesByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiSocialImageSourcesByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/social/{postId}/image_sources');
static getApiSocialImageSourcesByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/social/{postId}/image_sources(.*)';


  
 }
 export const socialStore = new SocialStore();
 