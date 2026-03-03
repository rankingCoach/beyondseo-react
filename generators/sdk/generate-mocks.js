const { parsePath } = require("./helpers/path-utils");
const { StoreGenerator } = require("./generators/Store.generator");
const { HttpStoreMockTemplate } = require("./templates/http-store.mock.template");

const generateMock = (basePath, path, basePathData, generator, useFolders) => {
  const { fileName, pathData } = parsePath(basePath, path, basePathData, useFolders);
  generator.addStore(fileName, pathData);
};

const generateMockRequests = (paths, basePath, useFolders, collector) => {
  const generator = new StoreGenerator(
    "./src/__mocks__/@stores/swagger/${folders}/${storeName}.ts",
    HttpStoreMockTemplate,
    "../../../",
    true,
    collector,
  );
  for (let path in paths) {
    generateMock(`/${basePath}`, path, paths[path], generator, useFolders);
  }

  generator.write();
};

module.exports = {
  generateMockRequests,
};
