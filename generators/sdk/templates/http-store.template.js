//this.generateStore(storeName, requests, imports, types, folderName ? 1 : 0)
const { replaceAll, toLowerCaseFirstChar } = require("../helpers/sdk-utils");
HttpStoreTemplate = (className, requests, imports = "", types = "", folderDepth) => {
  let extraFolders = "";
  if (folderDepth) {
    extraFolders = "../".repeat(folderDepth);
    imports = replaceAll(imports, "'../", `'${extraFolders}../`);
    types = replaceAll(types, "'../", `'${extraFolders}../`);
  }
  return `
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { HttpStore } from "${extraFolders}../http.store";
import { EndPoint } from "${extraFolders}../../api-config";

import { AbortControllersManager } from "${extraFolders}../store-helpers/abort-controllers-manager";

import { createAsyncThunk } from "@reduxjs/toolkit";
${imports}

${types}

export class ${className} extends HttpStore {
 
 ${requests}
  
 }
 export const ${toLowerCaseFirstChar(className)} = new ${className}();
 `;
};

module.exports = {
  HttpStoreTemplate,
};
