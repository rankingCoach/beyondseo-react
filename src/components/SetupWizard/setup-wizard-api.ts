import { getEditPostUrl, getPluginRestUrl, getRestNonce, getWpRestUrl } from "@helpers/internal-links";
import { rcWindow } from "@stores/window.store";
import { MetaTagsApiResponse, MetaTagsSaveRequest, WPVariableData } from "@src/types/meta-tags";
import { OptimiserResult } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Models/Results/OptimiserResult";

export class WizardRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = "WizardRequestError";
    this.code = code;
    this.status = status;
  }
}

export interface WizardState {
  completed: boolean;
  dismissed: boolean;
}

export interface WpSiteSettings {
  title: string;
  tagline: string;
  showOnFront: "posts" | "page";
  pageOnFront: number;
}

export interface SitemapSettings {
  enabled: boolean;
  includeImages: boolean;
  maxLinks: number;
  pingGoogle: boolean;
  pingBing: boolean;
}

export interface ImportSource {
  source: "aioseo" | "rankmath" | "yoast";
  name: string;
  installed: boolean;
  active: boolean;
}

export interface ImportResult {
  source: string;
  settings: number;
  postMeta: number;
  skipped: number;
  status: string;
}

export interface ContentItem {
  id: number;
  title: string;
  link: string;
  type: "post" | "page";
  editLink: string;
}

export interface PageIssue {
  issueType: string;
  title: string;
  description: string;
  /** 1 = critical … 4 = low (FactorSuggestion::PRIORITY_*). */
  priority: number;
  label: string;
  hex: string;
}

export interface PageScanResult {
  post: ContentItem;
  analyzed: boolean;
  failed: boolean;
  score: number | null;
  issues: PageIssue[];
}

const MAX_PAGE_ISSUES = 6;
const CONTENT_PER_TYPE = 20;

const request = async <T>(url: string, init: RequestInit = {}, signal?: AbortSignal): Promise<T> => {
  const response = await fetch(url, {
    ...init,
    signal,
    headers: {
      "Content-Type": "application/json",
      "X-WP-Nonce": getRestNonce(),
      ...(init.headers as Record<string, string>),
    },
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    const message = data?.message || data?.error || response.statusText;
    throw new WizardRequestError(message, data?.code || `http_${response.status}`, response.status);
  }

  return data as T;
};

export const saveWizardState = (state: WizardState): Promise<unknown> =>
  request(getPluginRestUrl("settings/setup_wizard"), { method: "POST", body: JSON.stringify({ value: state }) });

export const isSearchEngineVisible = (): boolean =>
  rcWindow?.rankingCoachReactData?.pluginInformation?.pluginData?.website?.settings?.searchEngineVisibility !== false;

export const getAdminEmail = (): string =>
  rcWindow?.rankingCoachReactData?.pluginInformation?.pluginData?.website?.settings?.adminEmail || "";

export const getWpSiteSettings = async (): Promise<WpSiteSettings> => {
  const data = await request<Record<string, any>>(getWpRestUrl("wp/v2/settings"));

  return {
    title: data.title || "",
    tagline: data.description || "",
    showOnFront: data.show_on_front === "page" ? "page" : "posts",
    pageOnFront: Number(data.page_on_front) || 0,
  };
};

export const getSitemapSettings = async (): Promise<SitemapSettings | null> => {
  const data = await request<{ response?: { settings?: { sitemap?: SitemapSettings } } }>(getPluginRestUrl("settings"));

  return data.response?.settings?.sitemap ?? null;
};

export const saveSitemapSettings = (sitemap: SitemapSettings): Promise<unknown> =>
  request(getPluginRestUrl("settings"), { method: "POST", body: JSON.stringify({ settings: { sitemap } }) });

export const getImportSources = async (): Promise<ImportSource[]> => {
  const data = await request<{ sources?: ImportSource[] }>(getPluginRestUrl("imports/sources"));

  return (data.sources || []).filter((source) => source.installed);
};

export const runImport = (source: ImportSource["source"]): Promise<ImportResult> =>
  request(getPluginRestUrl("imports"), { method: "POST", body: JSON.stringify({ source }) });

/** Analyses every published post and page on the server; returns the number of scanned items. */
export const runSiteScan = async (signal: AbortSignal): Promise<number> => {
  const data = await request<{ scanned?: number }>(getPluginRestUrl("onboarding/scan"), { method: "POST" }, signal);

  return data.scanned ?? 0;
};

/** Plain text of a WP REST "rendered" string (tags stripped, entities decoded). */
const decodeHtml = (html: string): string =>
  new DOMParser().parseFromString(html, "text/html").body.textContent?.trim() || "";

const listContent = async (type: ContentItem["type"], signal: AbortSignal): Promise<ContentItem[]> => {
  const items = await request<Array<{ id: number; title?: { rendered?: string }; link?: string }>>(
    getWpRestUrl(`wp/v2/${type}s`, { per_page: CONTENT_PER_TYPE, status: "publish", _fields: "id,title,link" }),
    {},
    signal,
  );

  return items.map((item) => ({
    id: item.id,
    title: decodeHtml(item.title?.rendered || "") || `#${item.id}`,
    link: item.link || "",
    type,
    editLink: getEditPostUrl(item.id),
  }));
};

/** Published pages first (menu order), then posts, capped per type. */
export const listScannableContent = async (signal: AbortSignal): Promise<ContentItem[]> => {
  const [pages, posts] = await Promise.all([listContent("page", signal), listContent("post", signal)]);

  return [...pages, ...posts];
};

const toPercent = (score: number | undefined): number | null => {
  if (typeof score !== "number") {
    return null;
  }

  return Math.round(score > 1 ? score : score * 100);
};

export const toPageScanResult = (post: ContentItem, result: OptimiserResult | undefined): PageScanResult => {
  const analyzed = !!result?.analyzedAt;
  const suggestions = (result?.topSuggestions?.elements || []) as Array<Record<string, any>>;
  const issues: PageIssue[] = suggestions
    .filter((suggestion) => suggestion.issueType && suggestion.title)
    .sort((a, b) => (a.priority ?? 4) - (b.priority ?? 4))
    .slice(0, MAX_PAGE_ISSUES)
    .map((suggestion) => ({
      issueType: suggestion.issueType,
      title: suggestion.title,
      description: suggestion.description || "",
      priority: suggestion.priority ?? 4,
      label: suggestion.displayConfig?.label || "",
      hex: suggestion.displayConfig?.hex || "",
    }));

  return { post, analyzed, failed: false, score: analyzed ? toPercent(result?.score) : null, issues };
};

export const getOptimiserResult = async (
  postId: number,
  signal?: AbortSignal,
): Promise<OptimiserResult | undefined> => {
  const data = await request<{ analyseResult?: OptimiserResult }>(getPluginRestUrl(`optimiser/${postId}`), {}, signal);

  return data.analyseResult;
};

export const rerunOptimiser = async (postId: number): Promise<OptimiserResult | undefined> => {
  const data = await request<{ analyseResult?: OptimiserResult }>(getPluginRestUrl(`optimiser/${postId}`), {
    method: "POST",
  });

  return data.analyseResult;
};

export const getMetaTags = (postId: number): Promise<MetaTagsApiResponse> =>
  request(getPluginRestUrl(`metatags/${postId}`));

export const saveMetaTags = (postId: number, body: MetaTagsSaveRequest): Promise<MetaTagsApiResponse> =>
  request(getPluginRestUrl(`metatags/${postId}`), { method: "POST", body: JSON.stringify(body) });

export const getVariables = async (postId: number): Promise<WPVariableData[]> => {
  const data = await request<{ response?: WPVariableData[] }>(getPluginRestUrl(`rc_variables/${postId}/data`));

  return Array.isArray(data.response) ? data.response : [];
};

// TODO Setup Wizard: no lead-capture endpoint exists yet; the address only lives in the wizard session.
export const saveEmailLead = async (_email: string, _optIn: boolean): Promise<void> => {};

// The endpoint only strips a handful of stop words; filter the rest client-side.
const KEYWORD_STOP_WORDS = new Set(
  "about after again all also and any are because been before being between both but can could did does doing down each even every few for from further had has have having her here him his how into its just like made make many more most much not now off once only other our out over own page people same she should some something such than that the their them then there these they thing things this those through too under until very was were what when where which while who whom why will with would you your yours".split(
    " ",
  ),
);

export const extractContentKeywords = async (postId: number): Promise<string[]> => {
  const data = await request<{ keywords?: Array<{ keyword: string }> }>(
    getPluginRestUrl(`metatags/${postId}/content/keywords`),
    { method: "POST" },
  );

  return (data.keywords || [])
    .map((entry) => (entry.keyword || "").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase())
    .filter((keyword) => keyword.length >= 4 && !KEYWORD_STOP_WORDS.has(keyword) && /^[\p{L}\p{N}-]+$/u.test(keyword));
};
