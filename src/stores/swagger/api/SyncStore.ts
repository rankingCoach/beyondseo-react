
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ServiceSyncResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Public/Integrations/WordPress/Dtos/ServiceSyncResponseDto';
    


 export type PostApiSyncKeywordsOpts = {FE_UNIQUE_ID?: string
}

export class SyncStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiSyncKeywordsAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieve 'ok' response for ping requests. 
*/


/** 
* Sync Keywords 
* Retrieve 'ok' response for ping requests. 
*/
postApiSyncKeywords(  requestBody: null, queryParams?: PostApiSyncKeywordsOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<ServiceSyncResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/sync/keywords`), requestBody, queryParams, signal, contentType) as Observable<ServiceSyncResponseDto>;
}

static postApiSyncKeywordsThunk = createAsyncThunk<
  ServiceSyncResponseDto,
  { requestBody: null, queryParams?: PostApiSyncKeywordsOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Sync Keywords 
* Retrieve 'ok' response for ping requests. 
*/
("postApiSyncKeywords", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostApiSyncKeywordsOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiSyncKeywordsAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      syncStore.postApiSyncKeywords( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiSyncKeywordsAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiSyncKeywordsAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiSyncKeywordsUrlRegEx = new RegExp('/wp-json/rankingcoach/api/sync/keywords');
static postApiSyncKeywordsUrlMockRequest = '/wp-json/rankingcoach/api/sync/keywords(.*)';


  
 }
 export const syncStore = new SyncStore();
 