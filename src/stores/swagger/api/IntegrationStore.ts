
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PingGetResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Public/Integrations/WordPress/Dtos/PingGetResponseDto';
    


 export type PostApiIntegrationStatusOpts = {FE_UNIQUE_ID?: string
}

export class IntegrationStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiIntegrationStatusAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Retrieve 'ok' response for ping requests. 
*/


/** 
* Integration Status 
* Retrieve 'ok' response for ping requests. 
*/
postApiIntegrationStatus(  requestBody: null, queryParams?: PostApiIntegrationStatusOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<PingGetResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/integration/status`), requestBody, queryParams, signal, contentType) as Observable<PingGetResponseDto>;
}

static postApiIntegrationStatusThunk = createAsyncThunk<
  PingGetResponseDto,
  { requestBody: null, queryParams?: PostApiIntegrationStatusOpts, contentType?: 'application/json'},
  {
      rejectValue: any
  }
>

/** 
* Integration Status 
* Retrieve 'ok' response for ping requests. 
*/
("postApiIntegrationStatus", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams?: PostApiIntegrationStatusOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiIntegrationStatusAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      integrationStore.postApiIntegrationStatus( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiIntegrationStatusAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiIntegrationStatusAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiIntegrationStatusUrlRegEx = new RegExp('/wp-json/rankingcoach/api/integration/status');
static postApiIntegrationStatusUrlMockRequest = '/wp-json/rankingcoach/api/integration/status(.*)';


  
 }
 export const integrationStore = new IntegrationStore();
 