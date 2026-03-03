export const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const capitalizeOnlyFirstLetter = (string:string|undefined) => {
  return string ? (string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()) : '';
}

// Helper function to convert keys to PascalCase
export const toPascalCase = (str: string): string => {
  return str
    .replace(/(?:^|_)([a-z])/g, (_, char) => char.toUpperCase())
    .replace(/[-_]/g, '');
};

export function getNameInitials(name: string): string[] {
  const initialsList = [];

  // Choose separator
  let separator = " ";
  const separators = [" ", "-", "_"];
  for (const sep of separators) {
    if (name.indexOf(sep) >= 0) {
      separator = sep;
      break;
    }
  }

  // Split
  const splitName = name.split(separator);
  if (splitName.length > 1) {
    for (let i = 0; i <= 1; i++) {
      if (splitName[i].charAt(0) !== "") {
        initialsList.push(splitName[i].charAt(0).toUpperCase());
      }
    }
  } else {
    initialsList.push(splitName[0].charAt(0).toUpperCase());
  }

  return initialsList;
}

export const replaceMultipleSpacesAndCarriageReturnLineFeed = (string: string) => {
  return string.replace(/\&nbsp;+/g, " ").replace(/\s+/g, " ");
};

export const removeTrailingSlash = (str: string) => {
  return str.replace(/\/+$/, "");
};

export const containsOnlySpecialCharacters = (newKeyword: string) => {
  return !!newKeyword.match(/^[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/? ~]*$/g);
};

export const findURLsInText = (text: string) => {
  const urlRegex =
    /(?:https?:\/\/)?(?:www\.)?[a-zA-Z0-9_-]+(?:\.[a-zA-Z]+){1,}(?:\/[^\s]*)?(?:\?[^#\s]*)?(?:#[^\s]*)?/g;
  const matches = text.match(urlRegex);
  return matches || [];
};

export const normalizeText = (text: string) => {
  const isAllUppercase = text === text.toUpperCase();

  if (isAllUppercase) {
    const words = text.toLowerCase().split("_");
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return capitalizedWords.join(" ");
  } else {
    return text.replace(/_/g, " ").replace(/(?:^|_)(\w)/g, (_, letter) => letter.toUpperCase());
  }
};

export const highlightedTextMaxLength = (content: string, maxLength: number, className: string) => {
  if (content.length > maxLength) {
    let safeMaxLength = maxLength;
    // Adjust maxLength to avoid splitting surrogate pairs
    while (
      content.charCodeAt(safeMaxLength) >= 0xdc00 &&
      content.charCodeAt(safeMaxLength) <= 0xdfff &&
      safeMaxLength < content.length
    ) {
      safeMaxLength++;
    }
    // Construct the new string with the highlighting
    const normalText = content.substring(0, safeMaxLength);
    const highlightedText = content.substring(safeMaxLength);
    return normalText + '<span class="' + className + '">' + highlightedText + "</span>";
  }
  return content;
};

export const toTitleCase = (str: string | undefined) => {
  str = str?.replace(/_/g, " ");
  return str
    ?.replace(/\w\S*/g, function (txt: string) {
      return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();
    })
    .replace(/\s\w/g, function (txt: string) {
      return txt.toLowerCase();
    });
};

export const cleanString = (str: string) => {
  const wordsArray = str.split(/\s+/);

  const cleanedWords = wordsArray.map((word) => {
    const cleanedWord = word.replace(/^(\+|\s)+/, ""); // remove '+' signs and multiple spaces at the beginning of each word
    return cleanedWord;
  });

  return cleanedWords.join(" ");
};

export const removeDiacritics = (str: string) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
