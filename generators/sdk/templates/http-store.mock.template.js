const { toLowerCaseFirstChar } = require("../helpers/sdk-utils");
HttpStoreMockTemplate = (className, requests, imports = "", types = "") => {
  return `
    /*
     * WARNING THIS FILE IS AUTO-GENERATED DO NOT MODIFY YOUR CHANGES WILL BE OVERWRITTEN!
    */
 import { firstValueFrom, Observable } from "rxjs";
import { createAsyncThunk } from "@reduxjs/toolkit";

${imports}

type StorybookMock<T,QueryParams> = {
    url: string,
      method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
      status: number,
      delay: number,
      response:  T | ((searchParams: QueryParams, originalMock: T) => T)
}

${types}

export class ${className} {
 
 ${requests}
  
 }
 export const ${toLowerCaseFirstChar(className)} = new ${className}();
 `;
};

module.exports = {
  HttpStoreMockTemplate,
};
