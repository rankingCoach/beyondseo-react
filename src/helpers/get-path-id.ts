import { getQueryParam } from "@helpers/url-params";
import {rcWindow} from "@stores/window.store";

export const getPathId = (url?: string): number => {
  rcWindow.rankingCoachReactData = rcWindow?.rankingCoachReactData || {};
  if(rcWindow.rankingCoachReactData?.currentPostId) {
    return parseInt(rcWindow.rankingCoachReactData?.currentPostId);
  }

  if (!url) {
    url = window.location.href.toString();
  }

  let pathId: any = getQueryParam("post");

  if (typeof pathId === "string") {
    pathId = parseInt(pathId);
    if (isNaN(pathId) && !!pathId) {
      return -1;
    }
  }

  const match = url.match(/(?:\/)(\d+)(?:$|[\?\#])/);
  if (!match) {
    return pathId;
  }

  return parseInt(match[1]) ?? pathId;
};

export const getPathIdAsStr = (url?: string): string => {
  return getPathId(url) + "";
};
