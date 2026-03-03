const { writeFile, createFolderIfNotExists } = require("../file-utils");

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

const generateArrayType = (schemaName, childType, dependantsData) => {
  return `${dependantsData.getImports()}
       /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
export type ${schemaName} = Array<${childType}>
  
  `;
};

const generateClass = (schemaName, dependantsData) => {
  let classTemplate = `${dependantsData.getEnums()}
export type ${dependantsData.schemaName} = {${dependantsData.getProps()} 
}
  `;

  const addNamespace = (template, schemaNamespace) => {
    return `
    export declare namespace ${schemaNamespace} {
      ${template}

 }`;
  };

  // if (dependantsData.schemaNamespace) {
  //   classTemplate = addNamespace(classTemplate, dependantsData.schemaNamespace);
  // }

  return `${dependantsData.getImports(dependantsData.schemaName)}
${classTemplate}
  `;
};

const generateModels = (collector) => {
  for (let schemaName in collector.schemas) {
    let dependentData = collector.schemas[schemaName].item;
    // Filter out objects with same name
    dependentData.props = dependentData.props.filter(
      (value, index, self) => index === self.findIndex((t) => t.name === value.name),
    );

    const model = generateClass(schemaName, dependentData);
    const folderPath = `./src/models/swagger/${replaceAll(dependentData.schemaNamespace, ".", "/")}`;

    createFolderIfNotExists(folderPath);
    writeFile(`${folderPath}/${dependentData.schemaName}.ts`, model);
  }
};

module.exports = {
  generateModels,
};
