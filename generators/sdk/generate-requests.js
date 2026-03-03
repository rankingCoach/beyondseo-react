const { parsePath } = require("./helpers/path-utils");
const { StoreGenerator } = require("./generators/Store.generator");
const { HttpStoreTemplate } = require("./templates/http-store.template");

const generateRequest = (basePath, path, basePathData, generator, useFolders) => {
  let { fileName, pathData } = parsePath(basePath, path, basePathData, useFolders);
  generator.addStore(fileName, pathData);
};

const generateRequests = (paths, basePath, useFolders, collector) => {
  const generator = new StoreGenerator(
    "./src/stores/swagger/${folders}/${storeName}.ts",
    HttpStoreTemplate,
    "../../",
    false,
    collector,
  );
  for (let path in paths) {
    generateRequest(`/${basePath}`, path, paths[path], generator, useFolders);
  }

  generator.write(collector);
};

module.exports = {
  generateRequests,
};
