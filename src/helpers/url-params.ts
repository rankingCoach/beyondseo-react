import { RefObject } from "react";

/**
 *
 * Passing a local ref object and an url param we set the local value to the url param
 * */
export const setLocalToUrl = (local: RefObject<HTMLInputElement> | null, urlName: string): string => {
  const windowUrl = window.location.search;
  const params: any = new URLSearchParams(windowUrl);
  const urlParam = params.get(urlName);
  // init it with the one in memory
  let searchable = local?.current?.value;
  // if we have an url param we set that as the real one
  if (urlParam) {
    searchable = urlParam;
    // also use the setter to update the local state
    if (local?.current) {
      local.current.value = urlParam;
    }
  }
  return searchable ?? "";
};

export const getQueryParam = (param: string): string => {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param) || "";
};

export const deleteQueryParam = (param: string, type: "push" | "replace" = "push") => {
  const searchParams = new URLSearchParams(window.location.search);
  if (!searchParams.has(param)) {
    // If the parameter doesn't exist, do nothing.
    return;
  }

  searchParams.delete(param);

  const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
  if (type === "push") {
    history.pushState(null, "", newRelativePathQuery);
  }

  if (type === "replace") {
    history.replaceState(null, "", newRelativePathQuery);
  }
};

export const setQueryParam = (param: string | null, value: string | number, type: "push" | "replace" = "push") => {
  const searchParams = new URLSearchParams(window.location.search);
  param = param ?? "";
  const searchTextQP = getQueryParam(param);
  if (searchTextQP === value) {
    // if we are trying to set the same value do not do anything
    return;
  }

  value ? searchParams.set(param, value.toString()) : searchParams.delete(param);

  const newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
  if (type === "push") {
    history.pushState(null, "", newRelativePathQuery);
  }

  if (type === "replace") {
    history.replaceState(null, "", newRelativePathQuery);
  }
};

export const setQueryParamDecoded = (param: string, value: string | number, type: "push" | "replace" = "push") => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchTextQP = getQueryParam(param);
  if (searchTextQP === value) {
    // if we are trying to set the same value do not do anything
    return;
  }

  value ? searchParams.set(param, value.toString()) : searchParams.delete(param);

  let newRelativePathQuery = window.location.pathname + "?" + searchParams.toString();
  newRelativePathQuery = decodeURIComponent(newRelativePathQuery);

  if (type === "push") {
    history.pushState(null, "", newRelativePathQuery);
  }

  if (type === "replace") {
    history.replaceState(null, "", newRelativePathQuery);
  }
};

export const getQueryParamAsInt = (qp: string): number | null => {
  if (qp === null || isNaN(parseInt(getQueryParam(qp)))) {
    return null;
  }

  return parseInt(getQueryParam(qp));
};

export const getLastPathParam = (): string => {
  const pathSegments = window.location.pathname.split("/").filter((segment) => segment.length > 0);
  return pathSegments[pathSegments.length - 1];
};

export const removePathParam = (pathParam: string): string => {
  let pathSegments = window.location.pathname.split("/").filter((segment) => segment.length > 0);

  // Find the index of the path parameter to remove
  const index = pathSegments.indexOf(pathParam);
  if (index > -1) {
    pathSegments = [...pathSegments.slice(0, index), ...pathSegments.slice(index + 1)];
  }

  // Reconstruct the URL with the removed path parameter
  const newPath = pathSegments.join("/");
  const newUrl = `${window.location.origin}/${newPath}${window.location.search}${window.location.hash}`;

  // Replace the current URL with the new one
  window.history.replaceState(null, "", newUrl);

  return newUrl;
};
