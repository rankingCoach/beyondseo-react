
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { AdvancedSettingsMetaTagsGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/AdvancedSettingsMetaTagsGetResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    import type { AdvancedSettingsMetaTagsPostRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/AdvancedSettingsMetaTagsPostRequestDto';
    


 export type GetApiAdvancedSettingsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiAdvancedSettingsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class AdvancedSettingsStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiAdvancedSettingsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get MetaTags 
*/


/** 
* Get all advanced settings metaTags 
* Get MetaTags 
*/
getApiAdvancedSettingsByPostId( postId: number,  queryParams: GetApiAdvancedSettingsByPostIdOpts, signal?: AbortSignal ): Observable<AdvancedSettingsMetaTagsGetResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/advancedSettings/${postId}`), queryParams, signal) as Observable<AdvancedSettingsMetaTagsGetResponseDto>;
}

static getApiAdvancedSettingsByPostIdThunk = createAsyncThunk<
  AdvancedSettingsMetaTagsGetResponseDto,
  {postId: number,  queryParams: GetApiAdvancedSettingsByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Get all advanced settings metaTags 
* Get MetaTags 
*/
("getApiAdvancedSettingsByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiAdvancedSettingsByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiAdvancedSettingsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      advancedSettingsStore.getApiAdvancedSettingsByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiAdvancedSettingsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiAdvancedSettingsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiAdvancedSettingsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/advancedSettings/{postId}');
static getApiAdvancedSettingsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/advancedSettings/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiAdvancedSettingsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTag Keywords 
*/


/** 
* Update all advanced settings metaTags 
* Save MetaTag Keywords 
*/
postApiAdvancedSettingsByPostId( postId: number,  requestBody: AdvancedSettingsMetaTagsPostRequestDto, queryParams: PostApiAdvancedSettingsByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<AdvancedSettingsMetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/advancedSettings/${postId}`), requestBody, queryParams, signal, contentType) as Observable<AdvancedSettingsMetaTagsGetResponseDto>;
}

static postApiAdvancedSettingsByPostIdThunk = createAsyncThunk<
  AdvancedSettingsMetaTagsGetResponseDto,
  {postId: number,  requestBody: AdvancedSettingsMetaTagsPostRequestDto, queryParams: PostApiAdvancedSettingsByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Update all advanced settings metaTags 
* Save MetaTag Keywords 
*/
("postApiAdvancedSettingsByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: AdvancedSettingsMetaTagsPostRequestDto, queryParams: PostApiAdvancedSettingsByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiAdvancedSettingsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      advancedSettingsStore.postApiAdvancedSettingsByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiAdvancedSettingsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiAdvancedSettingsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiAdvancedSettingsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/advancedSettings/{postId}');
static postApiAdvancedSettingsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/advancedSettings/{postId}(.*)';


  
 }
 export const advancedSettingsStore = new AdvancedSettingsStore();
 