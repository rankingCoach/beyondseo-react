const { generateMockData } = require("../generators/generate-mock-data");
const { GeneratedModelTemplate } = require("../templates/generated-model.template");
const { writeFile, createFolderIfNotExists } = require("../../file-utils");

class SchemaCollector {
  constructor() {
    this.schemas = {};
    this.hasRefs = false;
  }

  getByName(name) {
    if (!name) {
      return undefined;
    }
    // basic prop no need to search for it
    if (name === "string" || name === "object") {
      return undefined;
    }
    // TODO this is an enum
    if (name.includes("keyof typeof")) {
      return undefined;
    }
    let schema = this.schemas[name];
    if (schema) {
      return schema;
    }
    // if we do not find it as a fixed name we need t o see if it exists in any namespace
    for (let key of Object.keys(this.schemas)) {
      const split = key.split(".");
      const last = split.pop();
      if (last.trim() === name.trim()) {
        schema = this.schemas[key];
        break;
      }
    }
    return schema;
  }

  add(name, item, ref = null) {
    if (!this.schemas[name]) {
      this.schemas[name] = {
        item,
        refs: ref ? [ref] : [],
      };
    } else {
      this.schemas[name].item.imports = [...this.schemas[name].item.imports, ...item.imports];
      this.schemas[name].item.props = [...this.schemas[name].item.props, ...item.props];
      if (ref) {
        this.schemas[name].refs = [...this.schemas[name].refs, ref];
      }
    }
  }

  resolveRefs() {
    this.hasRefs = false;
    for (let key in this.schemas) {
      const item = this.schemas[key];

      if (item.refs && item.refs.length > 0) {
        this.hasRefs = true;
        for (let ref of item.refs) {
          const resolvedRef = ref.replace("#/components/schemas/", "");
          const refItems = this.schemas[resolvedRef];
          this.schemas[key].item.imports = [...this.schemas[key].item.imports, ...refItems.item.imports];
          this.schemas[key].item.props = [...this.schemas[key].item.props, ...refItems.item.props];
          this.schemas[key].refs = [...this.schemas[key].refs, ...refItems.refs];
        }
        item.refs = [];
      }
    }
    if (this.hasRefs) {
      this.resolveRefs();
    }
  }

  getMock(name) {
    if (name) {
      return this.schemas[name]["mock"];
    }
  }

  mockModels() {
    for (let key in this.schemas) {
      this.schemas[key]["mock"] = generateMockData(key, this);
    }
  }

  writeModels() {
    for (let key in this.schemas) {
      let name = "";
      let path = "";

      const split = key.split(".");
      name = split.pop();
      path = split.join("/");
      if (path) {
        path = `${path}/`;
      }
    }
  }

  writeMockModels() {
    for (let key in this.schemas) {
      let name = "";
      let path = "";

      const split = key.split(".");
      name = split.pop();
      path = split.join("/");
      if (path) {
        path = `${path}/`;
      }
      const generated = GeneratedModelTemplate(name, this.getMock(key));
      const folderPath = `./src/__mocks__/__model_mocks__/${path}`;
      createFolderIfNotExists(folderPath);
      writeFile(`${folderPath}${name}.mock.ts`, generated);
    }
  }
}

module.exports = {
  SchemaCollector,
};
