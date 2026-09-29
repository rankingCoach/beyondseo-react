import { StructuredTemplate } from "@src/types/meta-tags";
import { normalizeTemplate, resolveTemplate } from "@helpers/template-helpers";

/**
 * Search snippet of a post as rendered into the list-table mount point by
 * ContentsManager::populateColumn() (PHP). Everything is read from data
 * attributes so the list does not fire REST requests per row; only the score is
 * fetched by the cell.
 */
export interface SeoSnippetData {
  /** WordPress post title (plain text). */
  postTitle: string;
  postType: string;
  permalink: string;
  /** Admin URL of the post editor. */
  editLink: string;
  /** Whether the current user may save the SEO title/description from the list. */
  canEdit: boolean;
  /** Resolved SEO title (variables and separators already replaced). */
  title: string;
  titleTemplate: StructuredTemplate;
  /** Resolved meta description; empty when none is set. */
  description: string;
  descriptionTemplate: StructuredTemplate;
  /** Post text summary shown in the search preview while no description is set. */
  fallbackDescription: string;
}

const parseTemplateAttribute = (raw: string | undefined): StructuredTemplate => {
  if (!raw) {
    return [];
  }

  try {
    return normalizeTemplate(JSON.parse(raw));
  } catch (e) {
    return normalizeTemplate(raw);
  }
};

/**
 * Read the snippet data attributes of a `.rc-react-postcell` mount point.
 * Returns undefined for markup that predates the snippet attributes.
 */
export const readSnippetFromElement = (element: HTMLElement): SeoSnippetData | undefined => {
  const data = element.dataset;

  if (data.seoTitle === undefined && data.seoDescription === undefined) {
    return undefined;
  }

  return {
    postTitle: data.postTitle ?? "",
    postType: data.postType ?? "",
    permalink: data.permalink ?? "",
    editLink: data.editLink ?? "",
    canEdit: data.canEdit === "1",
    title: data.seoTitle ?? "",
    titleTemplate: parseTemplateAttribute(data.seoTitleTemplate),
    description: data.seoDescription ?? "",
    descriptionTemplate: parseTemplateAttribute(data.seoDescriptionTemplate),
    fallbackDescription: data.fallbackDescription ?? "",
  };
};

/** True when a template relies on WordPress variables or separators rather than plain text only. */
export const templateHasDynamicParts = (template: StructuredTemplate): boolean =>
  template.some((element) => element.type !== "text");

/**
 * Text to start editing from: the raw text of a text-only template (keeps line
 * breaks the server-side resolution collapses), otherwise the resolved value.
 */
export const templateEditableText = (template: StructuredTemplate, resolved: string): string =>
  templateHasDynamicParts(template) ? resolved : resolveTemplate(template);
