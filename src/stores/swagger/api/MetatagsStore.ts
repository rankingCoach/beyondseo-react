
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { MetaTagsGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsGetResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    import type { InternalErrorException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/InternalErrorException';
    import type { MetaTagsPostRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsPostRequestDto';
    import type { ForbiddenException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/ForbiddenException';
    import type { KeywordsMetaTagsKeywordRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/KeywordsMetaTagsKeywordRequestDto';
    import type { KeywordsResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/KeywordsResponseDto';
    import type { ContentAnalysisResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/ContentAnalysisResponseDto';
    import type { MetaTagsSeparatorResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsSeparatorResponseDto';
    import type { MetaTagsSeparatorRequestDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsSeparatorRequestDto';
    


 export type GetApiMetatagsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiMetatagsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiMetatagsKeywordSwapByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiMetatagsTitleAutoSuggestByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiMetatagsDescriptionAutoSuggestByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PutApiMetatagsKeywordByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type DeleteApiMetatagsKeywordByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiMetatagsKeywordsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PostApiMetatagsContentKeywordsByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type GetApiMetatagsSeparatorByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}
 export type PutApiMetatagsSeparatorByPostIdOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class MetatagsStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiMetatagsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get MetaTags
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Get all MetaTags 
* Get MetaTags
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
getApiMetatagsByPostId( postId: number,  queryParams: GetApiMetatagsByPostIdOpts, signal?: AbortSignal ): Observable<MetaTagsGetResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}`), queryParams, signal) as Observable<MetaTagsGetResponseDto>;
}

static getApiMetatagsByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  queryParams: GetApiMetatagsByPostIdOpts},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Get all MetaTags 
* Get MetaTags
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("getApiMetatagsByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiMetatagsByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiMetatagsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.getApiMetatagsByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiMetatagsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiMetatagsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiMetatagsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}');
static getApiMetatagsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiMetatagsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTag Keywords 
*/


/** 
* Update or create all MetaTags 
* Save MetaTag Keywords 
*/
postApiMetatagsByPostId( postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<MetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}`), requestBody, queryParams, signal, contentType) as Observable<MetaTagsGetResponseDto>;
}

static postApiMetatagsByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Update or create all MetaTags 
* Save MetaTag Keywords 
*/
("postApiMetatagsByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiMetatagsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.postApiMetatagsByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiMetatagsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiMetatagsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiMetatagsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}');
static postApiMetatagsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiMetatagsKeywordSwapByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTag Keywords
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Update or create all MetaTags 
* Save MetaTag Keywords
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
postApiMetatagsKeywordSwapByPostId( postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PostApiMetatagsKeywordSwapByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<MetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/keyword/swap`), requestBody, queryParams, signal, contentType) as Observable<MetaTagsGetResponseDto>;
}

static postApiMetatagsKeywordSwapByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PostApiMetatagsKeywordSwapByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Update or create all MetaTags 
* Save MetaTag Keywords
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("postApiMetatagsKeywordSwapByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PostApiMetatagsKeywordSwapByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiMetatagsKeywordSwapByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.postApiMetatagsKeywordSwapByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiMetatagsKeywordSwapByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiMetatagsKeywordSwapByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiMetatagsKeywordSwapByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/keyword/swap');
static postApiMetatagsKeywordSwapByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/keyword/swap(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiMetatagsTitleAutoSuggestByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Auto-suggest MetaTags Title
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Automatically Suggest MetaTags Title 
* Auto-suggest MetaTags Title
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
postApiMetatagsTitleAutoSuggestByPostId( postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsTitleAutoSuggestByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<MetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/title/autoSuggest`), requestBody, queryParams, signal, contentType) as Observable<MetaTagsGetResponseDto>;
}

static postApiMetatagsTitleAutoSuggestByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsTitleAutoSuggestByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Automatically Suggest MetaTags Title 
* Auto-suggest MetaTags Title
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("postApiMetatagsTitleAutoSuggestByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsTitleAutoSuggestByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiMetatagsTitleAutoSuggestByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.postApiMetatagsTitleAutoSuggestByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiMetatagsTitleAutoSuggestByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiMetatagsTitleAutoSuggestByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiMetatagsTitleAutoSuggestByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/title/autoSuggest');
static postApiMetatagsTitleAutoSuggestByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/title/autoSuggest(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiMetatagsDescriptionAutoSuggestByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Auto-suggest MetaTags Description
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Automatically Suggest MetaTags Description 
* Auto-suggest MetaTags Description
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
postApiMetatagsDescriptionAutoSuggestByPostId( postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsDescriptionAutoSuggestByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<MetaTagsGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/description/autoSuggest`), requestBody, queryParams, signal, contentType) as Observable<MetaTagsGetResponseDto>;
}

static postApiMetatagsDescriptionAutoSuggestByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsDescriptionAutoSuggestByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Automatically Suggest MetaTags Description 
* Auto-suggest MetaTags Description
* PRO feature
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
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("postApiMetatagsDescriptionAutoSuggestByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: MetaTagsPostRequestDto, queryParams: PostApiMetatagsDescriptionAutoSuggestByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiMetatagsDescriptionAutoSuggestByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.postApiMetatagsDescriptionAutoSuggestByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiMetatagsDescriptionAutoSuggestByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiMetatagsDescriptionAutoSuggestByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiMetatagsDescriptionAutoSuggestByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/description/autoSuggest');
static postApiMetatagsDescriptionAutoSuggestByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/description/autoSuggest(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static putApiMetatagsKeywordByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTags Keyword 
*/


/** 
* Save MetaTags Keyword 
* Save MetaTags Keyword 
*/
putApiMetatagsKeywordByPostId( postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PutApiMetatagsKeywordByPostIdOpts, signal?: AbortSignal ): Observable<MetaTagsGetResponseDto> {
  return this.put(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/keyword`), requestBody, queryParams, signal) as Observable<MetaTagsGetResponseDto>;
}

static putApiMetatagsKeywordByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PutApiMetatagsKeywordByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Save MetaTags Keyword 
* Save MetaTags Keyword 
*/
("putApiMetatagsKeywordByPostId", async ({postId,  requestBody, queryParams } : {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: PutApiMetatagsKeywordByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.putApiMetatagsKeywordByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.putApiMetatagsKeywordByPostId(postId,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.putApiMetatagsKeywordByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.putApiMetatagsKeywordByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static putApiMetatagsKeywordByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/keyword');
static putApiMetatagsKeywordByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/keyword(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static deleteApiMetatagsKeywordByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Save MetaTags Keyword
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
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Remove MetaTags Keyword 
* Save MetaTags Keyword
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
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
deleteApiMetatagsKeywordByPostId( postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: DeleteApiMetatagsKeywordByPostIdOpts, signal?: AbortSignal ): Observable<MetaTagsGetResponseDto> {
  return this.delete(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/keyword`), requestBody, queryParams, signal) as Observable<MetaTagsGetResponseDto>;
}

static deleteApiMetatagsKeywordByPostIdThunk = createAsyncThunk<
  MetaTagsGetResponseDto,
  {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: DeleteApiMetatagsKeywordByPostIdOpts} ,
  {
      rejectValue:  | BadRequestException | ForbiddenException | InternalErrorException
  }
>

/** 
* Remove MetaTags Keyword 
* Save MetaTags Keyword
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
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("deleteApiMetatagsKeywordByPostId", async ({postId,  requestBody , queryParams} : {postId: number,  requestBody: KeywordsMetaTagsKeywordRequestDto, queryParams: DeleteApiMetatagsKeywordByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.deleteApiMetatagsKeywordByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.deleteApiMetatagsKeywordByPostId(postId,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.deleteApiMetatagsKeywordByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.deleteApiMetatagsKeywordByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static deleteApiMetatagsKeywordByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/keyword');
static deleteApiMetatagsKeywordByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/keyword(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiMetatagsKeywordsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieve Location Keywords
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/


/** 
* Retrieve Location Keywords 
* Retrieve Location Keywords
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
getApiMetatagsKeywordsByPostId( postId: number,  queryParams: GetApiMetatagsKeywordsByPostIdOpts, signal?: AbortSignal ): Observable<KeywordsResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/keywords`), queryParams, signal) as Observable<KeywordsResponseDto>;
}

static getApiMetatagsKeywordsByPostIdThunk = createAsyncThunk<
  KeywordsResponseDto,
  {postId: number,  queryParams: GetApiMetatagsKeywordsByPostIdOpts},
  {
      rejectValue:  | BadRequestException | InternalErrorException
  }
>

/** 
* Retrieve Location Keywords 
* Retrieve Location Keywords
* 
* 
* 
* 
* 
* 
* 
* 
* @throws \BeyondSEODeps\Doctrine\ORM\Mapping\MappingException 
*/
("getApiMetatagsKeywordsByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiMetatagsKeywordsByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiMetatagsKeywordsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.getApiMetatagsKeywordsByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiMetatagsKeywordsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiMetatagsKeywordsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiMetatagsKeywordsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/keywords');
static getApiMetatagsKeywordsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/keywords(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiMetatagsContentKeywordsByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieve Keywords After Analyzing The Content 
*/


/** 
* Retrieve Content Keywords 
* Retrieve Keywords After Analyzing The Content 
*/
postApiMetatagsContentKeywordsByPostId( postId: number,  requestBody: null, queryParams: PostApiMetatagsContentKeywordsByPostIdOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<ContentAnalysisResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/content/keywords`), requestBody, queryParams, signal, contentType) as Observable<ContentAnalysisResponseDto>;
}

static postApiMetatagsContentKeywordsByPostIdThunk = createAsyncThunk<
  ContentAnalysisResponseDto,
  {postId: number,  requestBody: null, queryParams: PostApiMetatagsContentKeywordsByPostIdOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Retrieve Content Keywords 
* Retrieve Keywords After Analyzing The Content 
*/
("postApiMetatagsContentKeywordsByPostId", async ({postId,  requestBody, queryParams, contentType = 'application/json'} : {postId: number,  requestBody: null, queryParams: PostApiMetatagsContentKeywordsByPostIdOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiMetatagsContentKeywordsByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.postApiMetatagsContentKeywordsByPostId(postId,  requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiMetatagsContentKeywordsByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiMetatagsContentKeywordsByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiMetatagsContentKeywordsByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/content/keywords');
static postApiMetatagsContentKeywordsByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/content/keywords(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static getApiMetatagsSeparatorByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get Post Separator 
*/


/** 
* Get Post Separator 
* Get Post Separator 
*/
getApiMetatagsSeparatorByPostId( postId: number,  queryParams: GetApiMetatagsSeparatorByPostIdOpts, signal?: AbortSignal ): Observable<MetaTagsSeparatorResponseDto> {
  return this.get(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/separator`), queryParams, signal) as Observable<MetaTagsSeparatorResponseDto>;
}

static getApiMetatagsSeparatorByPostIdThunk = createAsyncThunk<
  MetaTagsSeparatorResponseDto,
  {postId: number,  queryParams: GetApiMetatagsSeparatorByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Get Post Separator 
* Get Post Separator 
*/
("getApiMetatagsSeparatorByPostId", async ({postId,  queryParams } : {postId: number,  queryParams: GetApiMetatagsSeparatorByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.getApiMetatagsSeparatorByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.getApiMetatagsSeparatorByPostId(postId,  queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.getApiMetatagsSeparatorByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.getApiMetatagsSeparatorByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static getApiMetatagsSeparatorByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/separator');
static getApiMetatagsSeparatorByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/separator(.*)';


/**
    * Manager of list of AbortControllers for the Request
    */
    static putApiMetatagsSeparatorByPostIdAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Update Post Separator 
*/


/** 
* Update Post Separator 
* Update Post Separator 
*/
putApiMetatagsSeparatorByPostId( postId: number,  requestBody: MetaTagsSeparatorRequestDto, queryParams: PutApiMetatagsSeparatorByPostIdOpts, signal?: AbortSignal ): Observable<MetaTagsSeparatorResponseDto> {
  return this.put(new EndPoint(`/wp-json/rankingcoach/api/metatags/${postId}/separator`), requestBody, queryParams, signal) as Observable<MetaTagsSeparatorResponseDto>;
}

static putApiMetatagsSeparatorByPostIdThunk = createAsyncThunk<
  MetaTagsSeparatorResponseDto,
  {postId: number,  requestBody: MetaTagsSeparatorRequestDto, queryParams: PutApiMetatagsSeparatorByPostIdOpts},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Update Post Separator 
* Update Post Separator 
*/
("putApiMetatagsSeparatorByPostId", async ({postId,  requestBody, queryParams } : {postId: number,  requestBody: MetaTagsSeparatorRequestDto, queryParams: PutApiMetatagsSeparatorByPostIdOpts}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.putApiMetatagsSeparatorByPostIdAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      metatagsStore.putApiMetatagsSeparatorByPostId(postId,  requestBody, queryParams, signal)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.putApiMetatagsSeparatorByPostIdAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.putApiMetatagsSeparatorByPostIdAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static putApiMetatagsSeparatorByPostIdUrlRegEx = new RegExp('/wp-json/rankingcoach/api/metatags/{postId}/separator');
static putApiMetatagsSeparatorByPostIdUrlMockRequest = '/wp-json/rankingcoach/api/metatags/{postId}/separator(.*)';


  
 }
 export const metatagsStore = new MetatagsStore();
 