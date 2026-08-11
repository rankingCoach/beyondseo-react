/**
 * Hand-written contract types for the native WordPress SEO meta tags API
 * (`rankingcoach/seo/metatags` and `rankingcoach/seo/social`).
 *
 * These mirror the response/request structure documented in
 * FRONTEND_INTEGRATION.md. The auto-generated swagger DTOs predate the
 * structured-template contract, so application code uses these types instead.
 */

/** A plain text node inside a template. */
export interface TemplateTextElement {
  type: "text";
  content: string;
}

/** A dynamic WordPress value, e.g. `post_title` or `site_title`. */
export interface TemplateVariableElement {
  type: "variable";
  key: string;
}

/** A layout separator/decorator, e.g. `pipe` -> `|`. */
export interface TemplateSeparatorElement {
  type: "separator";
  key: string;
}

export type TemplateElement = TemplateTextElement | TemplateVariableElement | TemplateSeparatorElement;

/** Structured template as returned/accepted by the API for title, description and social fields. */
export type StructuredTemplate = TemplateElement[];

/** A single meta tag (title, description, social_title, social_description) as returned by the API. */
export interface MetaTagDto {
  id: number;
  postId: number;
  type: string;
  template: StructuredTemplate;
}

/** The keywords tag; `template` stays a JSON string, decoded fields are exposed directly. */
export interface KeywordsTagDto {
  id: number;
  postId: number;
  type: string;
  template: string;
  primaryKeyword: string;
  additionalKeywords: string[];
}

/** One entry of the social image source picker. */
export interface SocialImageSourceDto {
  label: string;
  value: string | null;
  source: string;
  default?: boolean;
}

/**
 * Full payload returned by
 *   GET/POST /wp-json/rankingcoach/seo/metatags/{postId}
 *   GET/POST /wp-json/rankingcoach/seo/social/{postId}
 */
export interface MetaTagsApiResponse {
  title: MetaTagDto | null;
  description: MetaTagDto | null;
  keywords: KeywordsTagDto | null;
  socialTitle: MetaTagDto | null;
  socialDescription: MetaTagDto | null;
  selectedImageSource: string | null;
  selectedImageUrl: string | null;
  imageSources: SocialImageSourceDto[];
}

/** Body accepted by POST /metatags/{postId}. Omitted fields are left unchanged. */
export interface MetaTagsSaveRequest {
  title?: { template: StructuredTemplate };
  description?: { template: StructuredTemplate };
  keywords?: { primaryKeyword: string; additionalKeywords: string[] };
  socialTitle?: { template: StructuredTemplate };
  socialDescription?: { template: StructuredTemplate };
}

/** Body accepted by POST /social/{postId}. Omitted fields are left unchanged. */
export interface SocialSaveRequest {
  socialTitle?: { template: StructuredTemplate };
  socialDescription?: { template: StructuredTemplate };
  selectedImageSource?: string;
}

/** Response of GET /social/{postId}/image_sources. */
export interface SocialImageSourcesApiResponse {
  imageSources: SocialImageSourceDto[];
}

/** One resolved WordPress variable from GET /rc_variables/{postId}/data. */
export interface WPVariableData {
  key: string;
  description?: string;
  value: string;
}
