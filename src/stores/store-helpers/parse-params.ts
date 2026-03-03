import { getQueryParam } from "../../helpers/url-params";

export type ParamType = Record<string, string | number | boolean | never | null> | null;
const addExtraParam = (params?: ParamType, newParam?: string) => {
  if (!newParam) {
    return;
  }
  const newParamQuery = getQueryParam(newParam);
  if (newParamQuery && Boolean(newParamQuery)) {
    if (!params) {
      params = {};
    }

    params = {
      ...params,
    };
    if (newParamQuery.toLowerCase() === "true") {
      params[newParam] = true;
    }
    if (newParamQuery.toLowerCase() === "1") {
      params[newParam] = 1;
    }
  }

  return params;
};
export const parseParams = (params?: ParamType) => {
  params = addExtraParam(params, "noCache");
  params = addExtraParam(params, "debug");

  if (!params) {
    return "";
  }
  let queryString = "";
  const keysLn = Object.keys(params)?.length;

  if (!params || !keysLn) {
    return "";
  }
  const keys = Object.keys(params);

  for (const key of keys) {
    if (params[key] === undefined) {
      continue;
    }
    if (queryString) {
      queryString += "&";
    }
    queryString = queryString
      ? queryString + key + "=" + params[key]
      : key + "=" + encodeURIComponent(params[key] ?? "");
  }
  if (!queryString) {
    return "";
  }

  return "?" + queryString;
};
