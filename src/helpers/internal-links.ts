import { rcWindow } from "@stores/window.store";

/**
 * Links into this WordPress install used by the React app: plugin admin pages, the plugin's
 * REST namespace, WordPress core REST routes and the public site files (robots.txt, RSS feed,
 * sitemap). Counterpart of external-links.ts, which covers outbound links.
 *
 * The PHP side is the single source of truth: Assets::front() / Assets::frontElementor()
 * localize `adminurl`, `endpoint`, `restNonce` and Assets::getInternalLinksData()
 * (adminRootUrl, restRootUrl, robotsUrl, feedUrl, sitemapUrl) into `window.rankingCoachReactData`.
 * The defaults below are plain WordPress conventions and only apply when that data is missing.
 * Never build these URLs in components.
 */
interface InternalLinksData {
  /** admin_url('admin.php') */
  adminurl?: string;
  /** admin_url() */
  adminRootUrl?: string;
  /** rest_url('rankingcoach/seo'): the plugin REST namespace, without trailing slash */
  endpoint?: string;
  /** rest_url(): the WordPress REST root */
  restRootUrl?: string;
  /** wp_create_nonce('wp_rest') */
  restNonce?: string;
  /** get_site_url() */
  baseurl?: string;
  robotsUrl?: string;
  feedUrl?: string;
  sitemapUrl?: string;
  pluginInformation?: { pluginData?: { website?: { settings?: { homeUrl?: string } } } } | null;
}

type QueryParams = Record<string, string | number | boolean>;

/** Plugin admin pages, keyed by their `admin.php?page=` slug (mirrors AdminManager::PAGE_* in PHP). */
export enum AdminPage {
  Main = "rankingcoach-main",
  Settings = "rankingcoach-settings",
  Activation = "rankingcoach-activation",
  Registration = "rankingcoach-registration",
  Onboarding = "rankingcoach-onboarding",
  Connect = "rankingcoach-connect",
}

const getLinksData = (): InternalLinksData =>
  (rcWindow?.rankingCoachReactData as InternalLinksData | undefined) || {};

const trimTrailingSlashes = (url: string): string => url.replace(/\/+$/, "");

/** Append query params, using `&` when the URL already carries a query string (e.g. `?rest_route=`). */
const appendQuery = (url: string, params?: QueryParams): string => {
  const entries = Object.entries(params || {});
  if (!entries.length) {
    return url;
  }
  const query = entries
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  return `${url}${url.includes("?") ? "&" : "?"}${query}`;
};

/** Join a REST base and a route so that both `.../wp-json/ns` and `...?rest_route=/ns` bases work. */
const joinRoute = (base: string, route: string): string =>
  `${trimTrailingSlashes(base)}/${route.replace(/^\/+/, "")}`;

/** URL of a plugin admin page, e.g. getAdminPageUrl(AdminPage.Onboarding, { skipWelcomeScreen: 1 }). */
export const getAdminPageUrl = (page: AdminPage, params?: QueryParams): string =>
  appendQuery(`${getLinksData().adminurl || "admin.php"}?page=${page}`, params);

/** WordPress admin root (the dashboard). */
export const getAdminRootUrl = (): string => {
  const { adminRootUrl, adminurl } = getLinksData();
  if (adminRootUrl) {
    return adminRootUrl;
  }

  return adminurl ? adminurl.replace(/admin\.php$/, "") : "/wp-admin/";
};

/** Absolute URL of a route in the plugin REST namespace, e.g. getPluginRestUrl("account/activate"). */
export const getPluginRestUrl = (route: string, params?: QueryParams): string =>
  appendQuery(joinRoute(getLinksData().endpoint || "/wp-json/rankingcoach/seo", route), params);

/** Absolute URL of a WordPress core REST route, e.g. getWpRestUrl("wp/v2/posts/1"). */
export const getWpRestUrl = (route: string, params?: QueryParams): string =>
  appendQuery(joinRoute(getLinksData().restRootUrl || "/wp-json", route), params);

/** REST nonce for requests made outside the HttpStore (`X-WP-Nonce` header). */
export const getRestNonce = (): string => getLinksData().restNonce || rcWindow?.rankingCoachRestData?.nonce || "";

/** Public site root (home_url): the base for robots.txt, the feed and the sitemap. */
export const getHomeUrl = (): string => {
  const data = getLinksData();

  return trimTrailingSlashes(
    data.pluginInformation?.pluginData?.website?.settings?.homeUrl || data.baseurl || window.location.origin,
  );
};

/** robots.txt served by the plugin. */
export const getRobotsTxtUrl = (): string => getLinksData().robotsUrl || `${getHomeUrl()}/robots.txt`;

/** Main RSS feed (get_feed_link() on the PHP side, so it follows the permalink structure). */
export const getFeedUrl = (): string => getLinksData().feedUrl || `${getHomeUrl()}/feed/`;

/** XML sitemap served by the plugin. */
export const getSitemapUrl = (): string => getLinksData().sitemapUrl || `${getHomeUrl()}/sitemap.xml`;
