import { __ } from "@wordpress/i18n";
import { SelectOptionProps } from "vanguard";

export const SeparatorOptions: SelectOptionProps = [
  { value: "Remove", key: "remove", title: __("Remove", "beyondseo") },
  { value: "»", key: "angle_double", title: "»" },
  { value: "›", key: "angle_single", title: "›" },
  { value: "*", key: "asterisk", title: "*" },
  { value: "\\", key: "backslash", title: "\\" },
  { value: "•", key: "bullet", title: "•" },
  { value: ":", key: "colon", title: ":" },
  { value: "-", key: "dash", title: "-" },
  { value: "·", key: "dot", title: "·" },
  { value: "…", key: "ellipsis", title: "…" },
  { value: "—", key: "em_dash", title: "—" },
  { value: "–", key: "en_dash", title: "–" },
  { value: "=", key: "equals", title: "=" },
  { value: "|", key: "pipe", title: "|" },
  { value: "+", key: "plus", title: "+" },
  { value: "/", key: "slash", title: "/" },
  { value: "~", key: "tilde", title: "~" },
];

export const VariableOptions: SelectOptionProps = [
  { value: "Remove", key: "remove", title: __("Remove", "beyondseo") },
  { value: "Post title", key: "post_title", title: __("Post title", "beyondseo") },
  { value: "Post slug", key: "post_slug", title: __("Post slug", "beyondseo") },
  // { value: "Post modified", key: "post_modified", title: "Post modified" },
  { value: "Post date", key: "post_date", title: __("Post date", "beyondseo") },
  { value: "Author name", key: "author_name", title: __("Author name", "beyondseo") },
  { value: "Site title", key: "site_title", title: __("Site title", "beyondseo") },
  { value: "Site tagline", key: "site_tagline", title: __("Site tagline", "beyondseo") },
  { value: "Category", key: "category", title: __("Category", "beyondseo") },
  { value: "Categories", key: "categories", title: __("Categories", "beyondseo") },
  // { value: "Tag", key: "tag", title: "Tag" },
  // { value: "Tags", key: "tags", title: "Tags" },
  { value: "Current date", key: "current_date", title: __("Current date", "beyondseo") },
  { value: "Current time", key: "current_time", title: __("Current time", "beyondseo") },
  { value: "Year", key: "year", title: __("Year", "beyondseo") },
  { value: "Month", key: "month", title: __("Month", "beyondseo") },
  { value: "Day", key: "day", title: __("Day", "beyondseo") },
  // { value: "Archive title", key: "archive_title", title: "Archive title" },
  { value: "Search term", key: "search_term", title: __("Search term", "beyondseo") },
];
