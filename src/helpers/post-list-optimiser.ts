import { getPluginRestUrl, getRestNonce } from "@helpers/internal-links";

export const fetchPostListOptimiserScores = async (postIds: number[]): Promise<Record<number, unknown>> => {
  const response = await fetch(getPluginRestUrl("optimiser/batch"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": getRestNonce(),
    },
    body: JSON.stringify({ postIds }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch SEO scores");
  }

  const payload = await response.json();
  const results = payload?.results;

  if (!results || typeof results !== "object") {
    return {};
  }

  return Object.fromEntries(
    Object.entries(results).map(([postId, result]) => [
      Number(postId),
      result && typeof result === "object" ? result : null,
    ]),
  );
};
