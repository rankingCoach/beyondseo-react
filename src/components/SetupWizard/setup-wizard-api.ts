import { getEditPostUrl, getPluginRestUrl, getRestNonce, getWpRestUrl } from "@helpers/internal-links";
import { rcWindow } from "@stores/window.store";
import { MetaTagsApiResponse, MetaTagsSaveRequest, WPVariableData } from "@src/types/meta-tags";
import { OptimiserResult } from "@models/swagger/BeyondSEO/Domain/Integrations/WordPress/Seo/Entities/Optimiser/Base/Models/Results/OptimiserResult";
import { isWizardCheck } from "./issue-mapping";

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

/** One wizard check that a page failed, with the backend's wording for it. */
export interface PageIssue {
  issueType: string;
  title: string;
  description: string;
}

export interface PageScanResult {
  post: ContentItem;
  analyzed: boolean;
  failed: boolean;
  score: number | null;
  issues: PageIssue[];
}

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

export interface EmailLead {
  email: string;
  optIn: boolean;
  consentedAt: number;
}

export interface WizardSettings {
  sitemap: SitemapSettings | null;
  emailLead: EmailLead | null;
}

/** The plugin settings the wizard reads (one request; the email lead has no row until it was saved once). */
export const getWizardSettings = async (): Promise<WizardSettings> => {
  const data = await request<{
    response?: {
      settings?: {
        sitemap?: SitemapSettings;
        setup_wizard_email?: { email?: string; opt_in?: boolean; consented_at?: number };
      };
    };
  }>(getPluginRestUrl("settings"));
  const lead = data.response?.settings?.setup_wizard_email;

  return {
    sitemap: data.response?.settings?.sitemap ?? null,
    emailLead: lead?.email
      ? { email: lead.email, optIn: !!lead.opt_in, consentedAt: Number(lead.consented_at) || 0 }
      : null,
  };
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

/** Keeps only the suggestions that belong to the wizard checks, one per issue type. */
export const toPageScanResult = (post: ContentItem, result: OptimiserResult | undefined): PageScanResult => {
  const analyzed = !!result?.analyzedAt;
  const suggestions = (result?.topSuggestions?.elements || []) as Array<Record<string, any>>;
  const issues = new Map<string, PageIssue>();
  for (const suggestion of suggestions) {
    const issueType = suggestion.issueType as string | undefined;
    if (issueType && isWizardCheck(issueType) && !issues.has(issueType)) {
      issues.set(issueType, { issueType, title: suggestion.title || "", description: suggestion.description || "" });
    }
  }

  return {
    post,
    analyzed,
    failed: false,
    score: analyzed ? toPercent(result?.score) : null,
    issues: Array.from(issues.values()),
  };
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

// TODO Setup Wizard: temporary storage in the plugin settings; replace with the direct rankingCoach subscription call once it exists.
export const saveEmailLead = async (email: string, optIn: boolean): Promise<EmailLead> => {
  const lead: EmailLead = { email, optIn, consentedAt: Math.floor(Date.now() / 1000) };
  await request(getPluginRestUrl("settings/setup_wizard_email"), {
    method: "POST",
    body: JSON.stringify({ value: { email: lead.email, opt_in: lead.optIn, consented_at: lead.consentedAt } }),
  });

  return lead;
};

/** Keywords known to this install (synced account keywords); the General tab autocomplete reads the same list. */
export const getAvailableKeywords = async (postId: number): Promise<string[]> => {
  const data = await request<{ keywords?: unknown }>(getPluginRestUrl(`metatags/${postId}/keywords`));
  const rows = Array.isArray(data.keywords)
    ? data.keywords
    : ((data.keywords as { elements?: unknown[] })?.elements ?? []);

  return rows
    .map((row: any) => (typeof row === "string" ? row : row?.keyword || row?.name || ""))
    .filter((name: string) => !!name);
};

/** Same call as the General tab: the first keyword becomes primary, later ones additional. */
export const assignKeyword = (postId: number, keyword: string): Promise<MetaTagsApiResponse> =>
  request(getPluginRestUrl(`metatags/${postId}/keyword`), { method: "PUT", body: JSON.stringify({ keyword }) });

export const detachKeyword = (postId: number, keyword: string): Promise<MetaTagsApiResponse> =>
  request(getPluginRestUrl(`metatags/${postId}/keyword`), { method: "DELETE", body: JSON.stringify({ keyword }) });
