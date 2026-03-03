function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

const toUpperCaseFirstChar = (what) => {
  return what.charAt(0).toUpperCase() + what.slice(1);
};

const toLowerCaseFirstChar = (what) => {
  return what.charAt(0).toLowerCase() + what.slice(1);
};

const parseRef = (ref) => {
  if (!ref) {
    // This is an inline object we need to create a type
    return null;
  }
  return ref.split("/").pop();
};

const parseEndpointNameWithPathParams = (endpointName) => {
  let split = replaceAll(endpointName, "{", "|{");
  split = replaceAll(split, "}", "|");

  split = split.split("|");

  split = split
    .filter((s) => !!s)
    .map((s, idx) => {
      if (s[0] === "{") {
        s = replaceAll(s, "{", "");
        return `By${toUpperCaseFirstChar(s)}`;
      }

      if (idx) {
        s = toUpperCaseFirstChar(s);
      }
      return s;
    });

  return split.join("");
};

module.exports = {
  parseEndpointNameWithPathParams,
  parseRef,
  toLowerCaseFirstChar,
  toUpperCaseFirstChar,
  replaceAll,
  escapeRegExp,
};
