import { rcWindow } from "@stores/window.store";

/**
 * Outbound links used by the React app (support, documentation, legal, reviews).
 *
 * The PHP side is the single source of truth: `BaseConstants` declares the URLs and
 * `ExternalLinks` resolves the partner-/market-aware variants (e.g. the IONOS support desk
 * for IONOS installs) and injects them into `window.rankingCoachReactData`
 * (see Assets::front() / ExternalLinks::getReactData()). The defaults below mirror
 * BaseConstants and only apply when that data is missing, so every link always falls back
 * to the rankingCoach (direct-channel) URL. Never hardcode these URLs in components.
 */
interface ExternalLinksData {
  supportUrl?: string;
  supportPartner?: string | null;
  documentationUrl?: string;
  reviewUrl?: string;
  privacyPolicyUrl?: string;
  termsUrl?: string;
  customerReviewsUrl?: string;
}

type LinkKey = Exclude<keyof ExternalLinksData, "supportPartner">;

const DEFAULT_LINKS: Record<LinkKey, string> = {
  supportUrl: "https://grow.rankingcoach.com/wordpress/contact",
  documentationUrl: "https://grow.rankingcoach.com/wordpress",
  reviewUrl: "https://wordpress.org/support/plugin/beyondseo/reviews/#new-post",
  privacyPolicyUrl: "https://www.rankingcoach.com/en-us/privacy-policy",
  termsUrl: "https://www.rankingcoach.com/en-us/terms-and-conditions",
  customerReviewsUrl: "https://www.reviews.io/company-reviews/store/www.rankingcoach.com#page:Qr",
};

const getLinksData = (): ExternalLinksData =>
  (rcWindow?.rankingCoachReactData as ExternalLinksData | undefined) || {};

const resolve = (key: LinkKey): string => getLinksData()[key] || DEFAULT_LINKS[key];

/** Customer-support link: the partner desk (e.g. IONOS) when applicable, rankingCoach support otherwise. */
export const getSupportUrl = (): string => resolve("supportUrl");

/** Partner channel whose support desk applies (e.g. "ionos"), or null when rankingCoach handles support. */
export const getSupportPartner = (): string | null => getLinksData().supportPartner || null;

/** Plugin documentation. */
export const getDocumentationUrl = (): string => resolve("documentationUrl");

/** "Rate us" page on WordPress.org. */
export const getReviewUrl = (): string => resolve("reviewUrl");

/** rankingCoach privacy policy. */
export const getPrivacyPolicyUrl = (): string => resolve("privacyPolicyUrl");

/** rankingCoach terms and conditions. */
export const getTermsUrl = (): string => resolve("termsUrl");

/** rankingCoach customer reviews page (REVIEWS.io). */
export const getCustomerReviewsUrl = (): string => resolve("customerReviewsUrl");
