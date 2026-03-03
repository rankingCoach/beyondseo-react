const { toUpperCaseFirstChar, toLowerCaseFirstChar, replaceAll } = require("../helpers/sdk-utils");
const { writeFile, createFolderIfNotExists } = require("../../file-utils");
const { RequestGenerator } = require("./Request.generator");
const { clearIgnorable } = require("../helpers/path-utils");

class StoreGenerator {
  stores = {};
  writePath = "";
  upPath = "";
  isMock = false;
  collector = false;
  generateStore = null;

  constructor(writePath, generateStore, upPath, isMock, collector) {
    this.stores = {};
    this.writePath = writePath;
    this.generateStore = generateStore;
    this.upPath = upPath;
    this.isMock = isMock;
    this.collector = collector;
  }

  addVerb(store, verb, pathData) {
    let noPathParams = pathData.fullPath.noPathParams;
    let replaced = pathData.fullPath.replaced;

    noPathParams = clearIgnorable(noPathParams);
    let splitNoParams = noPathParams.split("/");

    splitNoParams = splitNoParams.map((x) => {
      return x.split("_");
    });

    // console.log("splitNoParams", splitNoParams);

    splitNoParams = splitNoParams.flat();
    splitNoParams = splitNoParams.map((x) => toUpperCaseFirstChar(x));
    splitNoParams = splitNoParams.join("");
    splitNoParams = verb + splitNoParams;

    splitNoParams = toLowerCaseFirstChar(splitNoParams);

    if (replaced) {
      splitNoParams = splitNoParams + "By" + toUpperCaseFirstChar(replaced);
    }

    store[splitNoParams] = {
      ...pathData["fullPath"],
      verb,
      pathData: pathData[verb],
    };
  }

  addStore(store, pathData) {
    const verbs = Object.keys(pathData);
    const storeName = toUpperCaseFirstChar(store) + "Store";
    if (!this.stores[storeName]) {
      this.stores[storeName] = {};
    }

    for (let verb of verbs) {
      // We added the full path verb
      if (verb !== "fullPath") {
        this.addVerb(this.stores[storeName], verb, pathData);
      }
    }
  }

  write(collector) {
    for (let storeName in this.stores) {
      const storeData = this.stores[storeName];
      let requests = "";
      let imports = "";
      let types = "";
      let folderName = "";

      for (let endpointName in storeData) {
        const endPointData = storeData[endpointName];
        folderName = endPointData["folderName"];
        const requestGenerator = new RequestGenerator(imports, folderName ? 1 : 0, this.isMock, collector);
        requests += requestGenerator.generateRequest(endpointName, endPointData, storeName);
        imports = requestGenerator.imports;
        types += requestGenerator.types;
        if (folderName) {
          folderName = `${folderName}/`;
        }
      }

      let store = this.generateStore
        ? this.generateStore(storeName, requests, imports, types, folderName ? 1 : 0)
        : null;
      const writePathWithFolders = this.writePath.replace("${folders}/", folderName);
      const folder = writePathWithFolders.replace("/${storeName}", "").replace(".ts", "");
      const folderPath = writePathWithFolders.replace("${storeName}", storeName);
      createFolderIfNotExists(folder);
      writeFile(`${folderPath}`, store);
    }
  }
}

module.exports = {
  StoreGenerator,
};
