
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "../../http.store";
import { EndPoint } from "../../../api-config";

import { AbortControllersManager } from "../../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
import type { PluginInformationResponseDto } from '@models/swagger/BeyondSEO/Presentation/Api/Client/Integrations/WordPress/Dtos/PluginInformationResponseDto';
    import type { BadRequestException } from '@models/swagger/BeyondSEODeps/DDD/Infrastructure/Exceptions/BadRequestException';
    


 export type PostApiPluginInformationOpts = {FE_UNIQUE_ID?: string
  /** 
* If set to true, debug mode will be activated 
*/
  debug? : boolean,
  /** 
* If set to true, no EntityRegistry Argus Caching will be used 
*/
  noCache? : boolean,
}

export class PluginInformationStore extends HttpStore {
 
 
/**
    * Manager of list of AbortControllers for the Request
    */
    static postApiPluginInformationAbortManager: AbortControllersManager = new AbortControllersManager();
/** 
* Get plugin data / information and current user data 
*/


/** 
* Get plugin information 
* Get plugin data / information and current user data 
*/
postApiPluginInformation(  requestBody: null, queryParams: PostApiPluginInformationOpts, signal?: AbortSignal, contentType?: 'application/json' ): Observable<PluginInformationResponseDto> {
  return this.post(new EndPoint(`/wp-json/rankingcoach/api/pluginInformation`), requestBody, queryParams, signal, contentType) as Observable<PluginInformationResponseDto>;
}

static postApiPluginInformationThunk = createAsyncThunk<
  PluginInformationResponseDto,
  { requestBody: null, queryParams: PostApiPluginInformationOpts, contentType?: 'application/json'},
  {
      rejectValue:  | BadRequestException
  }
>

/** 
* Get plugin information 
* Get plugin data / information and current user data 
*/
("postApiPluginInformation", async ({ requestBody, queryParams, contentType = 'application/json'} : { requestBody: null, queryParams: PostApiPluginInformationOpts, contentType?: 'application/json'}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.postApiPluginInformationAbortManager._push(requestId, controller);

    const result = await firstValueFrom(
      pluginInformationStore.postApiPluginInformation( requestBody, queryParams, signal, contentType)
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.postApiPluginInformationAbortManager._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.postApiPluginInformationAbortManager._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static postApiPluginInformationUrlRegEx = new RegExp('/wp-json/rankingcoach/api/pluginInformation');
static postApiPluginInformationUrlMockRequest = '/wp-json/rankingcoach/api/pluginInformation(.*)';


  
 }
 export const pluginInformationStore = new PluginInformationStore();
 