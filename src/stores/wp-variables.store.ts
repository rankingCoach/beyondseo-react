import { firstValueFrom, Observable } from "rxjs";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpStore } from "./http.store";
import { EndPoint } from "../api-config";
import { WPVariableData } from "@src/types/meta-tags";

/**
 * Hand-written store for `GET /wp-json/rankingcoach/seo/rc_variables/{postId}/data`.
 *
 * Returns the WordPress variables (post_title, site_title, ...) already
 * resolved against the given post. The frontend uses them to resolve
 * structured meta tag templates into live preview text — the meta tags API
 * itself no longer returns a server-parsed string.
 */

type RcVariablesApiEnvelope = {
  success?: boolean;
  response?: WPVariableData[];
};

export class WpVariablesStore extends HttpStore {
  getVariablesByPostId(postId: number, signal?: AbortSignal): Observable<RcVariablesApiEnvelope> {
    return this.get(
      new EndPoint(`/wp-json/rankingcoach/seo/rc_variables/${postId}/data`),
      null,
      signal,
    ) as Observable<RcVariablesApiEnvelope>;
  }

  static getVariablesByPostIdThunk = createAsyncThunk<WPVariableData[], { postId: number }, { rejectValue: any }>(
    "getWpVariablesByPostId",
    async ({ postId }, { rejectWithValue } = {} as any) => {
      try {
        const result = await firstValueFrom(wpVariablesStore.getVariablesByPostId(postId));
        return Array.isArray(result?.response) ? result.response : [];
      } catch (err: any) {
        return rejectWithValue(err?.response?.data ?? err);
      }
    },
  );
}

export const wpVariablesStore = new WpVariablesStore();
