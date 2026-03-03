const clearIgnorable = (path) => {
  /**
   *
   * The API has some prefixes we want to ignore when generating the folder structure
   * We ignore the API in the start of the pth this is to maintain compatibility with older
   * */
  const ignorable = ["", "app", "api"];
  const ignorableString = `${ignorable.join("/")}`;
  if (path.indexOf(ignorableString) === 0) {
    path = path.replace(ignorableString, "");
  }

  return path;
};

const parsePath = (basePath, path, pathData, useFolders) => {
  let folderName = "";
  path = clearIgnorable(path);
  const fullPath = `${basePath}${path}`;
  let fileName = path.split("/")[1];

  if (useFolders) {
    // If use folders is set we use the first path parameter as folder name
    folderName = path.split("/")[1];
    fileName = path.split("/")[2];
    if (!fileName) {
      // if no filename is set we revert
      // we do not use folderName just filename that is required to exist
      fileName = folderName;
      folderName = "";
    }
  }

  let replaced = null;
  const noPathParams = path.replace(/{.*?}\//g, (match) => {
    replaced = match.replace("{", "");
    replaced = replaced.replace("}", "");
    replaced = replaced.replace("/", "");
    return "";
  });

  pathData.fullPath = {
    fullPath: fullPath,
    folderName: folderName,
    noPathParams,
    replaced,
  };

  return { fileName, pathData };
};

module.exports = {
  parsePath,
  clearIgnorable,
};
