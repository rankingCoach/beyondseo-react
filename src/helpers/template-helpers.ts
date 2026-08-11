import {
  StructuredTemplate,
  TemplateElement,
  WPVariableData,
} from "@src/types/meta-tags";
import type { Adornment } from "@components/MultiAdornmentInput/MultiSelectAdornmentInput";
import { generateTextAdornmentKey, generateVariableKey } from "@components/MultiAdornmentInput/adornment-helpers";
import {
  SeparatorOptions,
  VariableOptions,
} from "@components/SEOMetadataAndKeywords/SEOMetadata/SEOMetaTitleEditor/AdornmentOptions";

/**
 * Helpers translating between the API's structured template format
 * (`[{type:'text',content}, {type:'variable',key}, {type:'separator',key}]`)
 * and the chip editor's `Adornment` model, plus client-side resolution of
 * templates into plain preview strings (the server no longer sends `parsed`).
 */

/** Separator key -> character, mirroring the backend's separator map. */
export const SEPARATOR_CHARACTERS: Record<string, string> = SeparatorOptions.reduce(
  (map: Record<string, string>, option: { key: string | number; value: string | number }) => {
    if (option.key !== "remove") {
      map[option.key.toString()] = option.value.toString();
    }
    return map;
  },
  {},
);

/** Variable key -> human readable label, from the editor's variable options. */
export const VARIABLE_LABELS: Record<string, string> = VariableOptions.reduce(
  (map: Record<string, string>, option: { key: string | number; value: string | number }) => {
    if (option.key !== "remove") {
      map[option.key.toString()] = option.value.toString();
    }
    return map;
  },
  {},
);

/** All known variable/separator base keys, longest first, for suffix stripping. */
const KNOWN_BASE_KEYS: string[] = [...Object.keys(SEPARATOR_CHARACTERS), ...Object.keys(VARIABLE_LABELS)].sort(
  (a, b) => b.length - a.length,
);

/**
 * Normalize any `template` value coming from the API into a structured array.
 * Defensive: accepts a structured array, a JSON-encoded array string, a legacy
 * `{% variable:key %}` string, or a plain string.
 */
export const normalizeTemplate = (template: unknown): StructuredTemplate => {
  if (Array.isArray(template)) {
    return template.filter(
      (element): element is TemplateElement =>
        !!element && typeof element === "object" && typeof (element as any).type === "string",
    );
  }

  if (typeof template === "string") {
    const trimmed = template.trim();
    if (trimmed === "") return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const decoded = JSON.parse(trimmed);
        if (Array.isArray(decoded)) return normalizeTemplate(decoded);
      } catch (e) {
        // fall through to legacy parsing
      }
    }

    return parseLegacyTemplate(template);
  }

  return [];
};

/** Parse a legacy `{% variable:key %}` / `{% separator:key %}` string into a structured array. */
export const parseLegacyTemplate = (template: string): StructuredTemplate => {
  const result: StructuredTemplate = [];
  const pattern = /{% (variable|separator):([a-zA-Z0-9_-]+) %}/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(template)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: "text", content: template.slice(lastIndex, match.index) });
    }
    result.push({ type: match[1] as "variable" | "separator", key: match[2] });
    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < template.length) {
    result.push({ type: "text", content: template.slice(lastIndex) });
  }

  return result;
};

/** True when a template contains no text content and no variables/separators. */
export const templateIsEmpty = (template: unknown): boolean => {
  const normalized = normalizeTemplate(template);
  return !normalized.some((element) => {
    if (element.type === "text") return element.content.trim() !== "";
    return true;
  });
};

/** Build a fast lookup map from the resolved WP variables returned by `rc_variables/{postId}/data`. */
export const buildVariablesMap = (variables: WPVariableData[] | null | undefined): Record<string, string> => {
  const map: Record<string, string> = {};
  (variables ?? []).forEach((variable) => {
    if (variable?.key) {
      map[variable.key] = variable.value != null ? String(variable.value) : "";
    }
  });
  return map;
};

/**
 * Resolve a structured template into its final text representation using the
 * given variables map — the client-side equivalent of the server's
 * `WordpressHelpers::resolveTemplate()`.
 */
export const resolveTemplate = (template: unknown, variablesMap: Record<string, string> = {}): string => {
  return normalizeTemplate(template)
    .map((element) => {
      switch (element.type) {
        case "text":
          return element.content ?? "";
        case "separator":
          return SEPARATOR_CHARACTERS[element.key] ?? "-";
        case "variable":
          return variablesMap[element.key] ?? "";
        default:
          return "";
      }
    })
    .join("");
};

/**
 * Strip the editor's uniqueness suffix (`post_title_m3k2ab` -> `post_title`).
 * Matches against known option keys first so base keys containing underscores
 * survive; falls back to removing the trailing `_suffix` segment.
 */
export const adornmentBaseKey = (key: string): string => {
  for (const baseKey of KNOWN_BASE_KEYS) {
    if (key === baseKey || key.startsWith(`${baseKey}_`)) {
      return baseKey;
    }
  }
  const lastUnderscore = key.lastIndexOf("_");
  return lastUnderscore > 0 ? key.slice(0, lastUnderscore) : key;
};

/**
 * Map an API structured template to the chip editor's adornment list.
 * Variables/separators get a fresh unique key suffix (the editor relies on it
 * for React keys and option switching); display values come from the option
 * lists (label for variables, character for separators).
 */
export const templateToAdornments = (template: unknown): Adornment[] => {
  const adornments: Adornment[] = [];

  normalizeTemplate(template).forEach((element) => {
    if (element.type === "text") {
      if (element.content === "") return;
      adornments.push({
        key: generateTextAdornmentKey(),
        value: element.content,
        type: "text",
      });
      return;
    }

    const isSeparator = element.type === "separator";
    const displayValue = isSeparator
      ? SEPARATOR_CHARACTERS[element.key] ?? element.key
      : VARIABLE_LABELS[element.key] ?? element.key;

    adornments.push({
      key: generateVariableKey(element.key, element.type, adornments),
      value: displayValue,
      type: element.type,
    });
  });

  return adornments;
};

/** Map the chip editor's adornment list back to the API structured template. */
export const adornmentsToTemplate = (adornments: Adornment[]): StructuredTemplate => {
  return adornments
    .map((adornment): TemplateElement | null => {
      if (adornment.type === "text") {
        const content = adornment.value ?? "";
        return content === "" ? null : { type: "text", content };
      }
      return { type: adornment.type, key: adornmentBaseKey(adornment.key) };
    })
    .filter((element): element is TemplateElement => element !== null);
};

/**
 * Resolve the editor's adornment list into a preview string. Variables are
 * looked up by their base key in the variables map; separators already carry
 * their character as `value`.
 */
export const resolveAdornments = (adornments: Adornment[], variablesMap: Record<string, string> = {}): string => {
  return adornments
    .map((adornment) => {
      switch (adornment.type) {
        case "text":
          return adornment.value ?? "";
        case "separator":
          return SEPARATOR_CHARACTERS[adornmentBaseKey(adornment.key)] ?? adornment.value ?? "";
        case "variable":
          return variablesMap[adornmentBaseKey(adornment.key)] ?? "";
        default:
          return "";
      }
    })
    .join("");
};

/** Wrap plain text into a text-only structured template (empty text -> empty template). */
export const textToTemplate = (text: string): StructuredTemplate => {
  return text === "" ? [] : [{ type: "text", content: text }];
};
