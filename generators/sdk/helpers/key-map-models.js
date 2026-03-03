function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

const toUpperCaseFirstChar = (what) => {
  return what.charAt(0).toUpperCase() + what.slice(1);
};

function replaceAll(str, find, replace) {
  if (typeof str !== "string") return str;
  return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
}

class ItemDependents {
  imports = [];
  enums = [];
  props = [];
  schemaName = null;
  schemaNamespace = null;

  addNamespace;

  addImports(imports) {
    for (let imp of imports) {
      this.addImport(imp);
    }
  }

  addImport(value) {
    const importDoesNotExistInImportsArray = this.imports.indexOf(value) === -1;
    const importHasValue = value !== "null";

    if (importDoesNotExistInImportsArray && importHasValue) {
      // do not allow duplicate enum names
      this.imports.push(value);
    }
  }

  addEnum(value) {
    this.enums.push(value);
  }

  addProps(name, type, isArray = false, propData = {}) {
    let { isRequired, description } = propData;
    description = description?.replaceAll("*/", "");
    // if type iss a namespace we need to split it in name and path
    if (!type) {
      // console.log(this.schemaName);
      type = "any";
    }
    const multipleTypes = type?.split("|") || [];
    const typeArr = [];
    for (let innerType of multipleTypes) {
      const pathArr = innerType?.split(".") ?? [];
      typeArr.push(pathArr.pop().trim());
    }

    type = typeArr.join(" | ");

    this.props.push({ name, type, isArray, isRequired, description });
  }

  wrapKey = (name) => {
    if (typeof name === "string" && !isNaN(parseInt(name.charAt(0)))) {
      return `"${name}"`;
    }

    if (typeof name === "string" && name.includes("-")) {
      // Transform to camelCase
      const camelCased = name
        .toLowerCase()
        .split("-")
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join("");

      console.log(camelCased);

      return camelCased;
    }

    return name;
  };

  getProps() {
    //console.log(this.props);
    let concatProps = "";

    for (let prop of this.props) {
      const descComment = prop.description
        ? `\n   /**
    * ${prop.description.replaceAll("\n", "\n* ").replaceAll("[*][/]", "")}
    */`
        : "";
      let suffix = "";
      if (prop.isArray) {
        // prop.type = replaceAll(prop.type, "|", "[] |");
        if (prop.type.includes("|")) {
          prop.type = `Array<${prop.type}>`.replace("integer", "number");
        } else {
          prop.type = prop.type + " []";
        }
      }
      concatProps = `${concatProps}${descComment}
  ${this.wrapKey(prop.name)}${prop.isRequired ? "" : "?"}: ${prop.type}`;
    }

    return concatProps;
  }

  getImports(schemaName) {
    let importsConcat = "";
    let idx = 0;

    for (let imp of this.imports) {
      if (imp === "object") {
        // We skip imports for the type "object", because it is a Standard TypeScript type
        continue; // @todo Check if this is good
      }
      const pathArr = imp.split(".");
      imp = pathArr.pop();
      const path = pathArr ? `@models/swagger/${pathArr.join("/")}` : "./";

      // We skip importing Schemas that are exported in the same file (When we have a recursive tree structure)
      if (schemaName === imp) {
        continue;
      }

      importsConcat = `${importsConcat}${idx > 0 ? "\n" : ""}import {${imp}} from '${path}/${imp}';`;
      idx++;
    }

    return importsConcat;
  }

  getEnums() {
    if (this.enums.length === 0) {
      return "";
    }
    let enumsConcat = "";
    for (let enumData of this.enums) {
      const newEnum = this.createEnum(enumData);
      enumsConcat = `${enumsConcat}${newEnum}\n`;
    }
    return enumsConcat;
  }

  /**
   *This generates a enum with real enum shape
   * */
  //   createEnum(enumData, idx) {
  //     const normalizeEnumKey = (key) => {
  //       key = replaceAll(key, "\\", "_");
  //       return key;
  //     };
  //     const { name, value } = enumData;
  //     let enumValue = "";
  //
  //     if (Array.isArray(value)) {
  //       let idx = 0;
  //       for (let enumKey of value) {
  //         const enumKeyValue = `${normalizeEnumKey(enumKey)} = "${enumKey}",`;
  //         if (enumValue.indexOf(enumKeyValue) < 0) {
  //           enumValue = `${enumValue}${idx === 0 ? "" : "\n"}  ${enumKeyValue}`;
  //           idx = idx + 1;
  //         }
  //       }
  //     } else {
  //       enumValue = ` ${normalizeEnumKey(value)} = "${value}"`;
  //     }
  //     const enumStr = `
  // export enum ${name} {
  // ${enumValue}
  // }`;
  //
  //     return enumStr;
  //   }

  /**
   * String Unions
   */
  //   createEnum(enumData, idx) {
  //     const normalizeEnumKey = (key) => {
  //       key = replaceAll(key, "\\", "_");
  //       return key;
  //     };
  //     const { name, value } = enumData;
  //     let enumValue = "";
  //     if (Array.isArray(value)) {
  //       let idx = 0;
  //       for (let enumKey of value) {
  //         const enumKeyValue = `"${enumKey}"`;
  //         if (enumValue.indexOf(enumKeyValue) < 0) {
  //           enumValue = `${enumValue}${idx === 0 || value.length === idx ? "" : " | "}  ${enumKeyValue}`;
  //           idx = idx + 1;
  //         }
  //       }
  //     } else {
  //       enumValue = ` ${normalizeEnumKey(value)} = "${value}"`;
  //     }
  //     const enumStr = `
  //       export type ${name} = ${enumValue} `;
  //
  //     return enumStr;
  //   }
  /**
   * Object literal alternative
   * */
  createEnum(enumData, idx) {
    const normalizeEnumKey = (key) => {
      key = replaceAll(key, "\\\\", "_");
      return this.wrapKey(key);
    };
    const { name, value } = enumData;
    let enumValue = "";

    if (Array.isArray(value)) {
      let idx = 0;
      for (let enumKey of value) {
        let enumKeyEqValue = enumKey;
        if (enumKey.indexOf && enumKey.indexOf(".") > 0) {
          enumKey = `"${enumKey}"`;
        }
        const enumKeyValue = `${normalizeEnumKey(enumKey)} : "${enumKeyEqValue}",`;
        if (enumValue.indexOf(enumKeyValue) < 0) {
          enumValue = `${enumValue}${idx === 0 ? "" : "\n"}  ${enumKeyValue}`;
          idx = idx + 1;
        }
      }
    } else {
      enumValue = ` ${normalizeEnumKey(value)} : "${value}"`;
    }
    const enumStr = `
  export const ${name} = {
  ${enumValue}
  }`;

    return enumStr;
  }
}

const parseOneOf = (refObj) => {
  // @todo Implement for Objects/Array/Enums
  const imports = [];
  const result = refObj.reduce((accumulator, item) => {
    let parsedType = parseType(item.type);

    if (item.$ref) {
      parsedType = parseRefFromObject(item).value;
      imports.push(parsedType);
    }
    return `${accumulator} ${accumulator ? "|" : ""} ${parsedType}`;
  }, "");
  return { value: result, imports };
};

const parseRefFromObject = (refObj) => {
  let isPrimitive = false;

  if (refObj["$ref"]) {
    return {
      value: parseRef(refObj["$ref"]),
      isPrimitive: false,
    };
  } else {
    if (refObj["type"]) {
      return { value: refObj["type"], isPrimitive: true };
    }
    if (refObj["oneOf"]) {
      let toRet = "";
      let iterations = refObj["oneOf"].length;

      for (let val of refObj["oneOf"]) {
        // last iteration
        let ref = val["$ref"];
        if (!ref) {
          isPrimitive = true;
          ref = val.type;
        }

        if (!--iterations) {
          toRet += parseRef(ref);
        } else {
          toRet += parseRef(ref) + " | ";
        }
      }

      return { value: toRet, isPrimitive };
    }
    return { value: null, isPrimitive: true };
  }
};
const parseRef = (ref) => {
  if (!ref) {
    // This is an inline object we need to create a type
    return null;
  }
  return ref.split("/").pop();
};

const getPropType = (propsData) => {
  if (!propsData.type) {
    propsData.type = "object";
  }

  if (propsData.type === "object") {
    // read the ref and get the
    return parseRefFromObject(propsData).value;
  } else if (propsData.type === "array") {
    // read the ref and get the
    // return propsData['$ref'].split('/').pop();
    return getPropType(propsData.items) + "[]";
  } else {
    return propsData.type;
  }
};

const parseType = (type) => {
  const mapped = {
    integer: "number",
  };

  return mapped[type] ?? type;
};

const createEnumName = (schemaName, propName) => {
  return `${schemaName}${toUpperCaseFirstChar(propName)}`;
};

const createEnumKeyName = (schemaName, propName) => {
  const name = createEnumName(schemaName, propName);
  return `typeof ${name}[keyof typeof ${name}]`;
};

const keyMapModel = (schemaName, schemaData, collector) => {
  const dependentData = new ItemDependents();
  let model = null;

  // schemaName could be a long string similar to Namespace.Level1.Level2.ClassName
  // In the above example we want to extract:
  //    * the namespace, which in this case is "Namespace.Level1.Level2"
  //    * the class name, which in this case is "ClassName"
  let nameComponents = schemaName.split(".");
  dependentData.schemaName = nameComponents.pop();
  dependentData.schemaNamespace = nameComponents.join(".");

  const addEnum = (propData, propName) => {
    let enumData = propData.enum;
    if (Array.isArray(enumData[0])) {
      enumData = enumData[0];
    }
    propData.type = createEnumKeyName(dependentData.schemaName, propName);
    dependentData.addEnum({
      name: createEnumName(dependentData.schemaName, propName),
      value: enumData,
      keyName: createEnumKeyName(dependentData.schemaName, propName),
    });
    //Marj object type as required always
    //backend fails of object type is not specified
    if (
      enumData &&
      enumData[0] &&
      enumData[0].indexOf
      // && enumData[0].indexOf("RC\\") >= 0
      //&& propName === "objectType"
    ) {
      propData.isRequired = true;
    }
    if (!enumData[0].indexOf) {
      // console.log('E', enumData)
    } else {
      // console.log('E2', enumData)
    }
  };

  switch (schemaData.type) {
    // Handle base file
    case "object":
      const props = schemaData.properties;
      const requiredProps = schemaData.required;

      for (let propName in props) {
        const propData = props[propName];
        let childTypeFromRef = null;

        // Is Prop Required
        propData.isRequired = false;
        if (Array.isArray(requiredProps) && requiredProps.includes(propName)) {
          props[propName].isRequired = true;
        }
        if (!propData.type && propName === "id") {
          propData.type = "any";
        }
        if (!propData.type && propName === "googleValue") {
          propData.type = "any";
        }
        if (propData.oneOf) {
          propData.type = "oneOf";
        }
        if (!propData.type) {
          propData.type = "object";
        }

        // Now we handle if a objec prop is of a complex type

        switch (propData.type) {
          case "oneOf":
            const { value: oneOfValue, imports } = parseOneOf(propData.oneOf);
            childTypeFromRef = oneOfValue;
            // console.log(imports);

            dependentData.addImports(imports);

            dependentData.addProps(propName, childTypeFromRef, false, {
              isRequired: propData.isRequired,
              description: propData.description,
            });
            break;
          case "object":
            let { value, isPrimitive } = parseRefFromObject(propData);
            childTypeFromRef = value;
            if (schemaName !== childTypeFromRef) {
              dependentData.addImport(childTypeFromRef);
            }

            dependentData.addProps(propName, childTypeFromRef, false, {
              isRequired: propData.isRequired,
              description: propData.description,
            });
            break;
          case "array":
            let { value: valueArr, isPrimitive: isPrimitiveArr } = parseRefFromObject(propData.items);
            childTypeFromRef = valueArr;
            if (!propData.items.type) {
              propData.items.type = "object";
            }

            //Resolve bad type conversion
            if (childTypeFromRef === "array") {
              childTypeFromRef = "any";
            }

            if (propData.items.type === "object") {
              if (childTypeFromRef && childTypeFromRef.indexOf("|") > 0) {
                const childTypeFromRefArr = childTypeFromRef.split("|");
                for (let child of childTypeFromRefArr) {
                  child = child.trim();
                  if (!isPrimitiveArr) {
                    dependentData.addImport(child);
                  }
                }
              } else {
                if (!isPrimitiveArr) {
                  dependentData.addImport(childTypeFromRef);
                }
              }
            }

            dependentData.addProps(propName, parseType(childTypeFromRef), true, {
              isRequired: propData.isRequired,
              description: propData.description,
            });
            break;
          default:
            if (propData.type === "string" && propName === "objectType") {
              propData.enum = [replaceAll(`${schemaName}` ?? "", ".", "\\\\")];
              propData.isRequired = true;
            }
            if (propData.enum) {
              addEnum(propData, propName);
            }

            dependentData.addProps(propName, parseType(propData.type), false, {
              isRequired: propData.isRequired,
              description: propData.description,
            });
            break;
        }
      }
      collector.add(schemaName, dependentData);
      // model = generateClass(schemaName, dependentData);
      // writeFile(`./src/models/swagger/${schemaName}.ts`, model);
      break;
    case "array":
      const { value: childTypeFromRef } = parseRefFromObject(schemaData.items);
      dependentData.addImport(childTypeFromRef);

      // model = generateArrayType(schemaName, childTypeFromRef, dependentData);
      // Here we do not write the main file name of the Array  type
      // We write the child name + Array suffix
      // writeFile(`./src/models/swagger/${schemaName}.ts`, model);
      collector.add(schemaName, dependentData);

      break;
    default:
    // console.log("Not handled", schemaData);
  }

  if (schemaData["$ref"]) {
    collector.add(schemaName, dependentData, schemaData["$ref"]);
  }
  if (schemaData.allOf) {
    for (let item of schemaData.allOf) {
      keyMapModel(schemaName, item, collector);
    }
  }
};

const keyMapModels = (schemas, collector) => {
  for (let schemaName in schemas) {
    keyMapModel(schemaName, schemas[schemaName], collector);
  }
};
module.exports = {
  keyMapModels,
};
