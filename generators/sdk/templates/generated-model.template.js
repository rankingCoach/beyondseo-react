GeneratedModelTemplate = (name, model) => {
  return `/*
 * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
*/
import faker from "@faker-js/faker";


const ${name}Mock = ${model};

export const get${name}Mock = () => {
  return ${name}Mock;
}

`;
};

module.exports = {
  GeneratedModelTemplate,
};
