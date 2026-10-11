import { __ } from "@wordpress/i18n";
import { getPluginRestUrl, getRestNonce } from "./internal-links";

export class StageRequestError extends Error {
  constructor(
    message: string,
    public status: number,
    public retryable: boolean,
    public details = "",
  ) {
    super(message);
  }
}

export const requestStage = async (path: string, body: unknown = null, method = "POST"): Promise<any> => {
  for (let attempt = 0; attempt < 2; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 75000);
    try {
      const response = await fetch(getPluginRestUrl(path), {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-WP-Nonce": getRestNonce(),
        },
        credentials: "same-origin",
        body: method === "GET" ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
      const data = await response.json().catch(() => null);
      const transient = [408, 429, 500, 502, 503, 504].includes(response.status);
      if (!response.ok || !data || data.success === false) {
        throw new StageRequestError(
          typeof data?.message === "string"
            ? data.message
            : __("The request could not be completed. Please try again.", "beyondseo"),
          response.status,
          typeof data?.retryable === "boolean" ? data.retryable : transient || (response.ok && !data),
          typeof data?.details === "string" ? data.details : `HTTP ${response.status}`,
        );
      }
      return data;
    } catch (error) {
      const failure =
        error instanceof StageRequestError
          ? error
          : new StageRequestError(
              __("The connection was interrupted or timed out. Please try again.", "beyondseo"),
              0,
              true,
            );
      if (attempt === 1 || !failure.retryable) {
        throw failure;
      }
    } finally {
      clearTimeout(timer);
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
};

export const completeActivation = async (
  activationCode?: string,
  commOptIn?: boolean,
  recover = false,
): Promise<void> => {
  let recovering = recover;
  let recovered = recover;
  for (let stage = 0; stage < 6; stage++) {
    try {
      const response = await requestStage("account/activate", { activationCode, commOptIn, recover: recovering });
      recovering = false;
      if (response.complete === true) {
        return;
      }
    } catch (error) {
      if (error instanceof StageRequestError && error.status === 401 && !recovered) {
        recovering = true;
        recovered = true;
        continue;
      }
      throw error;
    }
  }
  throw new StageRequestError(__("Activation could not be completed. Please try again.", "beyondseo"), 500, false);
};
