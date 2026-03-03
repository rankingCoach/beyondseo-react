import { SelectOptionProps } from "vanguard";
import { Adornment } from "./MultiSelectAdornmentInput";

export const generateTextAdornmentKey = (): string => {
  const textId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  return `text_${textId}`;
};

export const generateVariableKey = (
  baseKey: string,
  type: "separator" | "variable" | "text",
  existingAdornments: Adornment[] = [],
): string => {
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
  const candidateKey = `${baseKey}_${uniqueId}`;

  // Ensure the generated key is truly unique by checking against existing keys
  const existingKeys = existingAdornments.map((a) => a.key).filter(Boolean);
  if (existingKeys.includes(candidateKey)) {
    // If by some rare chance there's a collision, add another random suffix
    const extraId = Math.random().toString(36).substring(2, 5);
    return `${baseKey}_${uniqueId}_${extraId}`;
  }

  return candidateKey;
};

export const createAdornment = (
  type: "separator" | "variable" | "text",
  option: SelectOptionProps[0] | string,
  existingAdornments: Adornment[] = [],
): Adornment => {
  if (typeof option === "string") {
    return {
      key: generateTextAdornmentKey(),
      value: option,
      type: "text" as const,
    };
  }

  const baseKey = type === "variable" ? option.key.toString() : option.key.toString();
  const value = option.value.toString();
  const uniqueKey = generateVariableKey(baseKey, type, existingAdornments);

  return {
    key: uniqueKey,
    value: value,
    type: type === "separator" ? ("separator" as const) : ("variable" as const),
  };
};

export const updateAdornmentKey = (adornment: Adornment, newValue: string, optionKey?: string): Adornment => {
  if (adornment.type === "text") {
    return { ...adornment, value: newValue };
  }

  if (optionKey) {
    const currentKey = adornment.key || "";
    // Match hash-based suffix (alphanumeric after underscore) or numeric suffix
    const suffixMatch = currentKey.match(/_([a-zA-Z0-9]+)$/);
    const suffix = suffixMatch ? `_${suffixMatch[1]}` : "";

    return {
      ...adornment,
      value: newValue,
      key: `${optionKey}${suffix}`,
    };
  } else {
    const currentKey = adornment.key || "";
    const baseKeyMatch = currentKey.match(/^([^_]+)/);
    const baseKey = baseKeyMatch ? baseKeyMatch[1] : "";
    // Match hash-based suffix (alphanumeric after underscore) or numeric suffix
    const suffixMatch = currentKey.match(/_([a-zA-Z0-9]+)$/);
    const suffix = suffixMatch ? `_${suffixMatch[1]}` : "";

    if (baseKey) {
      return { ...adornment, value: newValue, key: `${baseKey}${suffix}` };
    } else {
      return { ...adornment, value: newValue, key: newValue };
    }
  }
};

// Canvas-based text measurement as fallback
const measureTextWithCanvas = (text: string, font: string): number => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) return text.length * 8; // Rough fallback

  context.font = font;
  return context.measureText(text).width;
};

// Pure Canvas-based measurement (more reliable alternative)
export const calculateInputWidthCanvas = (text: string, referenceElement?: HTMLElement): string => {
  if (!text) return "8px";

  let targetElement = referenceElement;
  if (!targetElement) {
    targetElement = document.querySelector(".multi-adornment-input input") as HTMLElement;
  }
  if (!targetElement) {
    targetElement = document.querySelector("input") as HTMLElement;
  }
  if (!targetElement) {
    targetElement = document.body;
  }

  const computedStyles = window.getComputedStyle(targetElement);

  // Get font properties with better fallbacks
  const fontSize = computedStyles.fontSize || "14px";
  const fontFamily = computedStyles.fontFamily || "Arial, sans-serif";
  const fontWeight = computedStyles.fontWeight || "normal";
  const fontStyle = computedStyles.fontStyle || "normal";
  const fontVariant = computedStyles.fontVariant || "normal";

  const fontString = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize} ${fontFamily}`;

  let width = measureTextWithCanvas(text, fontString);

  // If Canvas measurement fails or gives unreasonable results, use character-based fallback
  if (width === 0 || width < text.length * 3) {
    const fontSizeNum = parseFloat(fontSize);
    width = text.length * fontSizeNum * 0.6; // Character-based approximation
  }

  const paddedWidth = width + 2;
  const finalWidth = `${Math.min(Math.max(paddedWidth, 8), 644)}px`;

  return finalWidth;
};

export const calculateInputWidth = (text: string, referenceElement?: HTMLElement): string => {
  if (!text) return "8px";

  // Try to get font styles from a specific reference element first
  let targetElement = referenceElement;
  if (!targetElement) {
    // Look for inputs within the current component's scope first
    targetElement = document.querySelector(".multi-adornment-input input") as HTMLElement;
  }
  if (!targetElement) {
    // Fallback to any input
    targetElement = document.querySelector("input") as HTMLElement;
  }
  if (!targetElement) {
    // Final fallback
    targetElement = document.body;
  }

  const computedStyles = window.getComputedStyle(targetElement);

  // Try DOM-based measurement first
  let width = 0;
  try {
    const measureElement = document.createElement("span");

    // Copy ALL relevant text-related properties
    const propertiesToCopy = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "fontVariant",
      "letterSpacing",
      "wordSpacing",
      "textTransform",
      "textDecoration",
      "lineHeight",
      "textShadow",
      "fontStretch",
      "fontSizeAdjust",
    ];

    propertiesToCopy.forEach((prop) => {
      const value = computedStyles.getPropertyValue(prop.replace(/([A-Z])/g, "-$1").toLowerCase());
      if (value && value !== "normal" && value !== "none") {
        (measureElement.style as any)[prop] = value;
      }
    });

    // Set fallback values for critical properties
    if (!measureElement.style.fontFamily) {
      measureElement.style.fontFamily = "Arial, sans-serif";
    }
    if (!measureElement.style.fontSize) {
      measureElement.style.fontSize = "14px";
    }

    // Positioning and visibility
    measureElement.style.position = "absolute";
    measureElement.style.visibility = "hidden";
    measureElement.style.whiteSpace = "pre"; // Changed from nowrap to pre
    measureElement.style.left = "-9999px";
    measureElement.style.top = "-9999px";
    measureElement.style.pointerEvents = "none";
    measureElement.style.margin = "0";
    measureElement.style.padding = "0";
    measureElement.style.border = "none";
    measureElement.style.outline = "none";
    measureElement.style.boxSizing = "content-box";

    // Use textContent with non-breaking spaces
    measureElement.textContent = text.replace(/ /g, "\u00A0");

    document.body.appendChild(measureElement);

    // Force multiple layout calculations to ensure accuracy
    measureElement.offsetHeight;
    measureElement.offsetWidth;

    // Visual debug - uncomment to see the measurement element
    // visualDebugMeasurement(measureElement, text);

    const rect = measureElement.getBoundingClientRect();
    width = rect.width;

    document.body.removeChild(measureElement);
  } catch (error) {
    console.warn("DOM measurement failed, falling back to Canvas:", error);

    // Fallback to Canvas measurement
    const fontString = `${computedStyles.fontStyle || "normal"} ${computedStyles.fontVariant || "normal"} ${computedStyles.fontWeight || "normal"} ${computedStyles.fontSize || "14px"} ${computedStyles.fontFamily || "Arial, sans-serif"}`;
    width = measureTextWithCanvas(text, fontString);
  }

  // If width is still 0 or unreasonably small, use a character-based fallback
  if (width < text.length * 4) {
    const fontSize = parseFloat(computedStyles.fontSize || "14");
    width = text.length * fontSize * 0.6; // Rough approximation
  }

  const paddedWidth = width + 2;
  const finalWidth = `${Math.min(Math.max(paddedWidth, 8), 644)}px`;

  return finalWidth;
};

// Simple character-based approximation (most reliable fallback)
export const calculateInputWidthSimple = (text: string, referenceElement?: HTMLElement): string => {
  if (!text) return "8px";

  let fontSize = 14; // default

  if (referenceElement) {
    const computedStyles = window.getComputedStyle(referenceElement);
    fontSize = parseFloat(computedStyles.fontSize || "14");
  } else {
    // Try to get font size from any input in the component
    const inputElement = document.querySelector(".multi-adornment-input input") as HTMLElement;
    if (inputElement) {
      const computedStyles = window.getComputedStyle(inputElement);
      fontSize = parseFloat(computedStyles.fontSize || "14");
    }
  }

  // Use a character width multiplier based on common fonts
  // This is approximate but more reliable than complex measurement
  const avgCharWidthRatio = 0.6; // Works well for most fonts
  const width = text.length * fontSize * avgCharWidthRatio;

  const paddedWidth = width + 2;
  const finalWidth = `${Math.min(Math.max(paddedWidth, 8), 644)}px`;

  return finalWidth;
};

export const buildCompleteAdornmentsArray = (
  firstInputValue: string,
  inlineInputValues: string[],
  addedAdornments: Adornment[],
): Adornment[] => {
  const completeAdornments: Adornment[] = [];

  // Handle first input text - ensure it's always included if it has content
  if (firstInputValue && firstInputValue.trim()) {
    // Check if there's already a text adornment at the beginning
    const existingFirstTextAdornment =
      addedAdornments.length > 0 && addedAdornments[0].type === "text" ? addedAdornments[0] : null;

    if (existingFirstTextAdornment) {
      // Update existing text adornment with new value
      completeAdornments.push({
        ...existingFirstTextAdornment,
        value: firstInputValue.trim(),
      });
    } else {
      // Create new text adornment
      const firstTextAdornment = createAdornment("text", firstInputValue.trim(), addedAdornments);
      completeAdornments.push(firstTextAdornment);
    }
  }

  const nonTextAdornments = addedAdornments.filter((a) => a.type !== "text");

  for (let i = 0; i < nonTextAdornments.length; i++) {
    completeAdornments.push({
      ...nonTextAdornments[i],
    });

    if (i < inlineInputValues.length && inlineInputValues[i] && inlineInputValues[i].trim()) {
      const textAdornment = createAdornment("text", inlineInputValues[i].trim(), addedAdornments);
      completeAdornments.push(textAdornment);
    }
  }

  // If we have no adornments but have first input text, make sure we return at least that
  if (completeAdornments.length === 0 && firstInputValue && firstInputValue.trim()) {
    const firstTextAdornment = createAdornment("text", firstInputValue.trim(), []);
    completeAdornments.push(firstTextAdornment);
  }

  return completeAdornments;
};

export const processAdornmentsToInputsAndVariables = (
  addedAdornments: Adornment[],
): {
  processedAdornments: Adornment[];
  inputValues: string[];
  firstInputText: string;
} => {
  const processedAdornments: Adornment[] = [];
  const inputValues: string[] = [];
  let firstInputText = "";

  let firstNonTextIndex = addedAdornments.findIndex((a) => a.type !== "text");

  // Handle text adornments before the first non-text adornment
  if (firstNonTextIndex > 0) {
    for (let i = 0; i < firstNonTextIndex; i++) {
      if (addedAdornments[i].type === "text") {
        firstInputText += addedAdornments[i].value || "";
      }
    }
  } else if (firstNonTextIndex === -1) {
    // If there are no non-text adornments, all adornments are text, put them all in firstInputText
    for (let i = 0; i < addedAdornments.length; i++) {
      if (addedAdornments[i].type === "text") {
        firstInputText += addedAdornments[i].value || "";
      }
    }
  }

  for (let i = 0; i < addedAdornments.length; i++) {
    if (addedAdornments[i].type !== "text") {
      processedAdornments.push(addedAdornments[i]);
    }
  }

  for (let i = 0; i < processedAdornments.length; i++) {
    const adornmentIndex = addedAdornments.findIndex((a) => a === processedAdornments[i]);

    let textValue = "";
    let j = adornmentIndex + 1;

    while (j < addedAdornments.length && addedAdornments[j].type === "text") {
      textValue += addedAdornments[j].value || "";
      j++;
    }

    inputValues.push(textValue);
  }

  inputValues.push("");

  return { processedAdornments, inputValues, firstInputText };
};
