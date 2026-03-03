import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { from, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { EndPoint } from "../api-config";
import { BaseModel } from "@models/BaseModel";
import { BaseStore } from "./base.store";
import { parseParams } from "./store-helpers/parse-params";
import { stores } from "./stores";
import {rcWindow} from "./window.store";
import {
  MetaTagsGetResponseDto
} from "@models/swagger/App/Presentation/Api/Client/Integrations/WordPress/Dtos/MetaTagsGetResponseDto";

class AxiosClass {
  request(opts: AxiosRequestConfig): Observable<AxiosResponse<BaseModel>> {
    return from(axios.request(opts));
  }
}

export const Axios = new AxiosClass();

// axios.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status && error.response.status == 500) {
//       const data = [
//         {
//           info: {
//             url: error.config?.url,
//             method: error.config?.method,
//             data: error.config?.data?.slice(0, 2000),
//           },
//           href: window.location.href,
//           host: window.location.host,
//           pathname: window.location.pathname,
//         } as any,
//       ];
//
//       fetch("https://" + window.location.host + "/rest_api/v1/log?type=error_api_logs", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });
//     }
//
//     return Promise.reject(error);
//   },
// );

// https://github.com/zhaosiyang/axios-observable

export class HttpStore extends BaseStore {
  constructor() {
    super();
    stores.addStore(this);
  }

  getHeaders(isFormData = false, token: string = "") {
    const Headers: Record<string, string> = {};
    Headers["Content-Type"] = isFormData ? "application/x-www-form-urlencoded" : "application/json";
    if (token) {
      Headers["Authorization"] = `Bearer ${token}`;
    }

    if(rcWindow.rankingCoachRestData.nonce) {
      Headers["X-WP-Nonce"] = rcWindow.rankingCoachRestData.nonce;
    }

    return Headers;
  }

  buildFormData(formData: any, data: any, parentKey: any) {
    if (data && typeof data === "object" && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach((key) => {
        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
      });
    } else {
      const value = data == null ? "" : data;

      formData.append(parentKey, value);
    }
  }

  jsonToFormData(data: any) {
    const formData = new FormData();

    this.buildFormData(formData, data, null);

    return formData;
  }

  get<T extends BaseModel | any>(
    endPoint: EndPoint,
    queryParams?: Record<string, string | number | boolean | null> | null,
    signal?: AbortSignal,
  ): Observable<T | T[] | unknown | MetaTagsGetResponseDto> {
    // endPoint.endPoint = endPoint.endPoint.replace("-1", "1922195");
      const token = '';
    const options: AxiosRequestConfig | any = {
      withCredentials: true,
      store: this,
      method: "GET",
      headers: this.getHeaders(false, token),
      url: `${endPoint.get()}${parseParams(queryParams)}`,
      signal,
    };
    return Axios.request(options).pipe(
      map((response: any) => {
        if (response.data) {
          return response.data;
        }

        return response;
      }),
      catchError((err) => {
        return new Observable((observer) => {
          console.warn("Warning | Request Rejected | Details: ", JSON.stringify(err));
          observer.error(err);
          observer.next(err);
          observer.complete();
        });
      }),
    ) as Observable<T | T[] | unknown | MetaTagsGetResponseDto>;
  }

  post(
    endPoint: EndPoint,
    requestBody: Record<string, any> | null,
    queryParams?: Record<string, string | number | boolean> | null,
    signal?: AbortSignal,
    contentType = "",
    bearerToken?: string,
  ): Observable<any> {
    const body = contentType === "multipart/form-data" ? this.jsonToFormData(requestBody) : requestBody;

    const options: AxiosRequestConfig = {
      method: "POST",
      headers: this.getHeaders(contentType === "multipart/form-data", bearerToken),
      data: body,
      url: `${endPoint.get()}${parseParams(queryParams)}`,
      signal,
      onUploadProgress: (progress) => {
        if (progress.total !== undefined) {
        } else {
        }
      },
    };
    return Axios.request(options).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((err) => {
        console.warn("Warning | Request Rejected | Details: ", JSON.stringify(err));
        return new Observable((observer) => {
          observer.error(err);
          observer.complete();
        });
      }),
    );
  }

  put(
    endPoint: EndPoint,
    requestBody: Record<string, any> | null,
    queryParams?: Record<string, string | number | boolean> | null,
    signal?: AbortSignal,
  ): Observable<any> {
    const options: AxiosRequestConfig = {
      method: "PUT",
      headers: this.getHeaders(),
      data: requestBody,
      url: `${endPoint.get()}${parseParams(queryParams)}`,
      signal,
    };

    return Axios.request(options).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((err) => {
        return new Observable((observer) => {
          observer.error(err);
          observer.complete();
        });
      }),
    );
  }

  delete(
    endPoint: EndPoint,
    requestBody?: Record<string, any> | null,
    queryParams?: Record<string, string | number | boolean> | null,
    signal?: AbortSignal,
  ): Observable<any> {
    const options: AxiosRequestConfig = {
      method: "DELETE",
      headers: this.getHeaders(),
      data: requestBody,
      url: `${endPoint.get()}${parseParams(queryParams)}`,
      signal,
    };

    return Axios.request(options).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((err) => {
        return new Observable((observer) => {
          observer.error(err);
          observer.complete();
        });
      }),
    );
  }

  patch(
    endPoint: EndPoint,
    requestBody: Record<string, any> | null,
    queryParams?: Record<string, string | number | boolean> | null,
    signal?: AbortSignal,
  ): Observable<any> {

    const options: AxiosRequestConfig = {
      method: "PATCH",
      headers: this.getHeaders(),
      data: requestBody,
      url: `${endPoint.get()}${parseParams(queryParams)}`,
      signal,
    };

    return Axios.request(options).pipe(
      map((resp) => {
        return resp.data;
      }),
      catchError((err) => {
        return new Observable((observer) => {
          observer.error(err);
          observer.complete();
        });
      }),
    );
  }
}
