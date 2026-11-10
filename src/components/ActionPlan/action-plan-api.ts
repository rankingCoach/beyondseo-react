import { getPluginRestUrl } from "@helpers/internal-links";
import { ContentItem, request } from "@components/SetupWizard/setup-wizard-api";

/** A page of the Action Plan: the wizard's content item plus what the stored analysis knows about it. */
export interface ActionPlanPage extends ContentItem {
  /** WordPress post type as stored (`type` is narrowed to post/page for the shared fix panels). */
  postType: string;
  /** Latest score in percent, when the page has one. */
  score: number | null;
  /** Unix time of the latest analysis. */
  analyzedAt: number | null;
}

/** One wizard check a published page failed in its latest analysis. */
export interface ActionPlanIssue {
  issueType: string;
  title: string;
  description: string;
  /** 1 = critical … 4 = low, mirrors FactorSuggestion::PRIORITY_*. */
  priority: number;
  post: ActionPlanPage;
}

export interface ActionPlan {
  /** Published pages with a stored analysis. */
  pagesChecked: number;
  /** Unix time of the latest analysis on any published page. */
  lastCheckAt: number | null;
  /** Ordered by priority (critical first), then page. */
  issues: ActionPlanIssue[];
}

export const issueKey = (issue: Pick<ActionPlanIssue, "issueType" | "post">): string =>
  `${issue.post.id}:${issue.issueType}`;

const toPage = (raw: Record<string, any>): ActionPlanPage => ({
  id: Number(raw.id),
  title: String(raw.title || `#${raw.id}`),
  link: String(raw.link || ""),
  editLink: String(raw.editLink || ""),
  type: raw.type === "page" ? "page" : "post",
  postType: String(raw.type || "post"),
  score: typeof raw.score === "number" ? raw.score : null,
  analyzedAt: typeof raw.analyzedAt === "number" ? raw.analyzedAt : null,
});

/** The Action Plan from the stored analysis (ActionPlanService::getPlan()); nothing is analysed by this call. */
export const getActionPlan = async (signal?: AbortSignal): Promise<ActionPlan> => {
  const data = await request<{ pagesChecked?: number; lastCheckAt?: number | null; issues?: Record<string, any>[] }>(
    getPluginRestUrl("action-plan"),
    {},
    signal,
  );

  return {
    pagesChecked: Number(data.pagesChecked) || 0,
    lastCheckAt: typeof data.lastCheckAt === "number" && data.lastCheckAt > 0 ? data.lastCheckAt : null,
    issues: (Array.isArray(data.issues) ? data.issues : [])
      .filter((raw) => raw && typeof raw.issueType === "string" && raw.post && Number(raw.post.id) > 0)
      .map((raw) => ({
        issueType: raw.issueType as string,
        title: String(raw.title || raw.issueType),
        description: String(raw.description || ""),
        priority: Number(raw.priority) || 4,
        post: toPage(raw.post),
      })),
  };
};
