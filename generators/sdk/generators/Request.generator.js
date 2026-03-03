const {
  toUpperCaseFirstChar,
  parseEndpointNameWithPathParams,
  parseRef,
  replaceAll,
  toLowerCaseFirstChar,
  createFolderIfNotExists,
} = require("../helpers/sdk-utils");
const parseType = (type) => {
  const mapped = {
    integer: "number",
  };

  return mapped[type] ?? type;
};

class RequestGenerator {
  imports = "";
  folderDepth = 0;
  types = "";
  isMock = "";
  collector = null;

  constructor(imports, folderDepth, isMock, collector) {
    this.imports = imports;
    this.folderDepth = folderDepth ?? 0;
    this.isMock = isMock;
    this.collector = collector;
  }

  createOwnModelImport = (name) => {
    if (!name) {
      return "";
    }
    const model = this.collector?.schemas[name];
    if (!model) {
      // TODO leave me in!!
      // console.log("model not found", name);
    }
    if (name === "") {
      return "";
    }
    const pathArr = name.split(".");
    name = pathArr.pop();
    const path = pathArr.length ? `@models/swagger/${pathArr.join("/")}/` : "@models/swagger/";

    return `import type { ${name} } from '${path}${name}';
    `;
  };
  createOwnModelMockImport = (name, folder) => {
    if (!name) {
      return "";
    }
    if (folder) {
      folder = `${folder}/`;
    }
    return `import {get${name}Mock} from '@mocks/__model_mocks__/${folder}${name}.mock';`;
  };
  createOwnType = (endpointName, opts) => {
    return `
 export type ${toUpperCaseFirstChar(endpointName)}Opts = ${opts}`;
  };

  extractOpsFromData = ({ pathData }) => {
    let params = pathData.parameters;

    if (pathData && pathData.parameters) {
      params = params.filter((p) => p.in === "query");
    }

    if (!params || !params.length) {
      params = [];
    }

    let obj = "FE_UNIQUE_ID?: string";
    for (let param of params) {
      obj = `${obj}
  ${
    param.description
      ? "/** \n* " + param.description.replaceAll("\n", "\n* ").replaceAll("[*][/]", "").replaceAll("*/", "") + " \n*/"
      : ""
  }
  ${param.name}${param.required ? "" : "?"} : ${parseType(param.schema.type)},`;
    }

    return `{${obj}
}`;
  };

  extractRouteParamsFromData = ({ pathData }) => {
    let params = pathData.parameters;

    if (pathData && pathData.parameters) {
      params = params.filter((p) => p.in === "path").sort((a) => !!a.required);
    }

    if (!params || !params.length) {
      return {
        pathParamsWithTypes: "",
        pathParamsWithoutTypes: "",
      };
    }

    let functionParameters = "";
    let functionParametersWithoutTypes = "";

    for (let param of params) {
      functionParameters += `${param.name}: ${parseType(param.schema.type)}${param.required ? "" : "|undefined"}, `;
      functionParametersWithoutTypes += `${param.name}, `;
    }

    return {
      pathParamsWithTypes: functionParameters,
      pathParamsWithoutTypes: functionParametersWithoutTypes,
    };
  };

  extractOpsKeysFromData = ({ pathData }) => {
    const params = pathData.parameters;

    if (!params) {
      return null;
    }

    let obj = {};
    for (let param of params) {
      obj[param.name] = parseType(param.schema.type);
    }

    return obj;
  };

  extractResponses(endPointData) {}

  extractResponse(response) {
    const ref = response["application/json"]?.schema["$ref"];
    const parsedRef = parseRef(ref);
    if (parsedRef) {
      const modelImport = this.createOwnModelImport(parsedRef);
      if (this.imports.includes(modelImport) === false) {
        this.imports += modelImport;
      }
    }
    return parsedRef || "any";
  }

  generateMultipleParsedRef(keys, pathData) {
    let toRet = "";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i > 0) {
        toRet = `${toRet} | `;
      }
      toRet = `${toRet}${this.extractResponse(pathData[key]?.content || {})}`;
    }

    return toRet.split("|").map((value) => {
      const valueSplit = value.split(".");
      return {
        fullName: value.trim(),
        name: (valueSplit.pop() ?? "any").trim(),
        folder: valueSplit.join("/"),
      };
    });
  }

  generateParsedRef(keys, pathData) {
    let toRet = "";

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i > 0) {
        toRet = `${toRet} | `;
      }
      toRet = `${toRet}${this.extractResponse(pathData[key]?.content || {})}`;
    }

    const toRetSplit = toRet.split(".");
    return {
      name: toRetSplit.pop(),
      folder: toRetSplit.join("/"),
    };
  }

  generateRequest = (endpointName, endPointData, storeName) => {
    endpointName = parseEndpointNameWithPathParams(endpointName);
    const endpointDescription = `${endPointData?.pathData?.summary ?? ""} \n* ${(
      endPointData?.pathData?.description ?? ""
    )
      .replaceAll("\n", "\n* ")
      .replaceAll("[*][/]", "")}`;

    const endpointDescriptionComment = endpointDescription ? `\n/** \n* ${endpointDescription} \n*/` : "";

    endPointData.pathData.responses = endPointData.pathData.responses ?? {};
    const keys = Object.keys(endPointData.pathData.responses);
    const successKeys = keys.filter((key) => key.charAt(0) === "2");
    const errorKeys = keys.filter((key) => key.charAt(0) === "4" || key.charAt(0) === "5");

    let { name: parsedRefSuccess, folder: parsedRefSuccessFolder } = this.generateParsedRef(
      successKeys,
      endPointData.pathData.responses,
    );
    let parsedRefErrorArr = this.generateMultipleParsedRef(errorKeys, endPointData.pathData.responses);
    parsedRefErrorArr.forEach((el) => {
      if (!this.imports.includes(el.fullName) && el.fullName !== "any") {
        const toImport = this.createOwnModelImport(el.fullName);
      }
    });
    let parsedRefError = parsedRefErrorArr.reduce((acc, el) => {
      return `${acc} | ${el.name.trim()}`;
    }, "");

    if (parsedRefError.trim() === "|") {
      parsedRefError = "any";
    }

    parsedRefSuccess = replaceAll(parsedRefSuccess, "|", "");
    if (parsedRefSuccess.indexOf(" any ") >= 0) {
      parsedRefSuccess = replaceAll(parsedRefSuccess, "any", "");
    }
    parsedRefSuccess = parsedRefSuccess.trim();
    // // parsed ref success can be of multiple types so we seaprate them with "|"
    // // when we import we need it solo
    // for (let parsedRefSuccessPart of parsedRefSuccessArr) {
    //   parsedRefSuccessPart = parsedRefSuccessPart.trim();
    //   // any is not a type we need to import
    //   if (parsedRefSuccessPart === "any") {
    //     continue;
    //   }
    const modelMockImport = this.createOwnModelMockImport(parsedRefSuccess, parsedRefSuccessFolder);

    if (this.imports.includes(modelMockImport) === false && this.isMock) {
      this.imports += modelMockImport;
      if (parsedRefSuccess) {
        const modelImport = `${modelMockImport}\n`;
        if (this.imports.includes(modelMockImport) === false) {
          this.imports += modelImport;
        }
      }
    }
    // }

    // TODO warn if no 200 response is defined
    // if (!parsedRef) {
    //   console.warn(`Route ${endpointName} has no 200 response set`);
    // }

    // further down we need any type
    parsedRefSuccess = !!parsedRefSuccess ? parsedRefSuccess : "any";
    const { pathParamsWithTypes, pathParamsWithoutTypes } = this.extractRouteParamsFromData(endPointData);
    const opts = this.extractOpsFromData(endPointData);
    const optsAsObj = this.extractOpsKeysFromData(endPointData);
    let params = endPointData.pathData.parameters;
    let optionalQueryParams = "";

    //Information about the path we will generate
    const pathData = endPointData.pathData;
    if (pathData && pathData.parameters) {
      params = params.filter((p) => p.in === "query");
    }

    if (!params || !params.length) {
      optionalQueryParams = "?";
    }
    this.types += this.createOwnType(endpointName, opts);
    const { verb, fullPath } = endPointData;

    const requestContent = pathData?.requestBody?.content;
    let contentType = "application/json";
    if (requestContent) {
      contentType = Object.keys(requestContent)[0];
    }
    const description = `${
      pathData.description
        ? "/** \n* " + pathData.description.replaceAll("\n", "\n* ").replaceAll("[*][/]", "") + " \n*/"
        : ""
    }`;
    const queryParams = `queryParams${optionalQueryParams}: ${toUpperCaseFirstChar(endpointName)}Opts`;

    let requestModelName = pathData.requestBody?.request;
    if (requestContent && requestContent["application/json"]) {
      const requestRef = requestContent["application/json"].schema["$ref"];
      requestModelName = parseRef(requestRef);
    }

    const requestModelImport = this.createOwnModelImport(requestModelName);
    if (this.imports.includes(requestModelImport) === false) {
      this.imports += requestModelImport;
    }
    // remove namespace from name if it exists
    const normalizedRequestModelName = requestModelName ? requestModelName.split(".").pop() : "";

    let requestBody = requestModelName ? `requestBody: ${normalizedRequestModelName}` : null;
    const contentTypeSignature = `contentType?: '${contentType}'`;
    const abortSignalTypeSignature = `signal?: AbortSignal`;
    let functionSignature = "";
    let destructuredFunctionSignature = "";
    let functionRequests = "";
    let functionBaseRequests = "";
    let thunkRequestTyping = "";
    if (requestBody === null) {
      requestBody = "requestBody: null";
    }

    switch (verb) {
      case "post":
        functionSignature = `${pathParamsWithTypes} ${requestBody}, ${queryParams}, ${abortSignalTypeSignature}, ${contentTypeSignature}`;
        destructuredFunctionSignature = `{${pathParamsWithoutTypes} requestBody, queryParams, contentType = '${contentType}'} : {${functionSignature}}`;
        functionRequests = `${pathParamsWithoutTypes} requestBody, queryParams, signal, contentType`;
        functionBaseRequests = `requestBody, queryParams, signal, contentType`;
        thunkRequestTyping = `{${functionSignature}}`;
        break;
      case "patch":
        functionSignature = `${pathParamsWithTypes} ${requestBody}, ${queryParams}, ${abortSignalTypeSignature}`;
        destructuredFunctionSignature = `{${pathParamsWithoutTypes} requestBody, queryParams } : {${functionSignature}}`;
        functionRequests = `${pathParamsWithoutTypes} requestBody, queryParams, signal`;
        functionBaseRequests = `requestBody, queryParams, signal`;
        thunkRequestTyping = `{${functionSignature}}`;

        break;
      case "put":
        functionSignature = `${pathParamsWithTypes} ${requestBody}, ${queryParams}, ${abortSignalTypeSignature}`;
        destructuredFunctionSignature = `{${pathParamsWithoutTypes} requestBody, queryParams } : {${functionSignature}}`;
        functionRequests = `${pathParamsWithoutTypes} requestBody, queryParams, signal`;
        functionBaseRequests = `requestBody, queryParams, signal`;
        thunkRequestTyping = `{${functionSignature}}`;

        break;
      case "delete":
        functionSignature = `${pathParamsWithTypes} ${requestBody}, ${queryParams}, ${abortSignalTypeSignature}`;
        destructuredFunctionSignature = `{${pathParamsWithoutTypes} ${
          requestBody ? "requestBody" : ""
        } , queryParams} : {${functionSignature}}`;
        functionRequests = `${pathParamsWithoutTypes} ${requestBody ? "requestBody" : ""}, queryParams, signal`;
        functionBaseRequests = `${requestBody ? "requestBody" : ""}, queryParams, signal`;
        thunkRequestTyping = `{${functionSignature}} `;

        break;
      default:
        functionSignature = `${pathParamsWithTypes} ${queryParams}, ${abortSignalTypeSignature}`;
        functionRequests = `${pathParamsWithoutTypes} queryParams, signal`;
        functionBaseRequests = `queryParams, signal`;
        if (pathParamsWithoutTypes) {
          destructuredFunctionSignature = `{${pathParamsWithoutTypes} queryParams } : {${functionSignature}}`;
        }
        // special case where we have only one parameter in signature of thunk
        const functionSignatureSplit = functionSignature.replace(`, ${abortSignalTypeSignature}`, "").split(":");
        if (functionSignatureSplit.length === 2) {
          thunkRequestTyping = functionSignatureSplit[1];
        } else {
          thunkRequestTyping = `{${functionSignature}}`;
        }
    }

    if (!destructuredFunctionSignature) {
      destructuredFunctionSignature = functionSignature;
    }

    destructuredFunctionSignature = destructuredFunctionSignature.replaceAll(", signal?: AbortSignal", "");
    thunkRequestTyping = thunkRequestTyping.replaceAll(", signal?: AbortSignal", "");

    let extractedQueryParams = "";
    if (optsAsObj) {
      const keys = Object.keys(optsAsObj);
      extractedQueryParams += "?";

      let idx = 0;
      for (let key of keys) {
        extractedQueryParams += `${key}=""`;
        if (idx < keys.length - 1) {
          extractedQueryParams += "&";
        }
        idx++;
      }
    }

    const createRealRequest = () => {
      return `${endpointName}( ${functionSignature} ): Observable<${parsedRefSuccess || "any"}> {
  return this.${verb}(new EndPoint(\`${replaceAll(fullPath, "{", "${")}\`), ${functionBaseRequests}) as Observable<${parsedRefSuccess || "any"}>;
}`;
    };

    const createMockRequest = () => {
      let mockFnName = parsedRefSuccess !== "any" ? `get${parsedRefSuccess}Mock()` : "null";
      const queryParamsName = `${toUpperCaseFirstChar(endpointName)}Opts`;
      if (!parsedRefSuccess) {
        mockFnName = parsedRefSuccess;
      }
      return `${endpointName}( ${functionSignature} ): Observable<${parsedRefSuccess || "any"}> {
  return new Observable((observer) => {
     observer.next(${mockFnName});
     return observer.complete()
  })
}

static mockStorybook${toUpperCaseFirstChar(
        endpointName,
      )} = (custom: Partial<StorybookMock<${parsedRefSuccess},${queryParamsName}>> = {}): StorybookMock<${parsedRefSuccess},${queryParamsName}> => {

  let customResponse = custom.response as (
      searchParams: ${queryParamsName},
      originalMock: ${parsedRefSuccess} ,
    ) => ${parsedRefSuccess};

    let newResponse = null;

    if (typeof customResponse === "function") {
      newResponse = (opts: ${queryParamsName}) => {
        const originalMock = ${mockFnName};
        return customResponse(opts, originalMock);
      };
    }

  return {
          url: ${storeName}.${endpointName}UrlMockRequest,
          method: "${verb.toUpperCase()}",
          status: 200,
          delay: 0,
          response: newResponse ? newResponse :  ${mockFnName},
          ...custom
    }
}`;
    };

    const createRequest = () => {
      return this.isMock ? createMockRequest() : createRealRequest();
    };

    const abortControllerManagerVariableName = `${endpointName}AbortManager`;

    const abortControllerInitialization = `/**
    * Manager of list of AbortControllers for the Request
    */
    static ${abortControllerManagerVariableName}: AbortControllersManager = new AbortControllersManager();`;

    return `
${abortControllerInitialization}
${description}

${endpointDescriptionComment}
${createRequest()}

static ${endpointName}Thunk = createAsyncThunk<
  ${parsedRefSuccess || "any"},
  ${thunkRequestTyping},
  {
      rejectValue: ${parsedRefError}
  }
>
${endpointDescriptionComment}
("${endpointName}", async (${destructuredFunctionSignature}, { rejectWithValue } = {} as any,) => {
  // Generate a random request Id
  const requestId = new Date().getTime().toString();

  try {
    // Create a new Abort controller for the request
    const controller = new AbortController();

    const signal = controller.signal;
    this.${abortControllerManagerVariableName}._push(requestId, controller);

    const result = await firstValueFrom(
      ${toLowerCaseFirstChar(storeName)}.${endpointName}(${functionRequests})
    );

    // After the Request is completed, remove the Abort controller from Manager, since we don't need it anymore.
    this.${abortControllerManagerVariableName}._remove(requestId);

    return result;
  } catch (err: any) {
        // In case the Request fails, remove the Abort controller from Manager, since we don't need it anymore.
        this.${abortControllerManagerVariableName}._remove(requestId);

        return rejectWithValue(err.response.data);
    }
});

static ${endpointName}UrlRegEx = new RegExp('${fullPath}');
static ${endpointName}UrlMockRequest = '${fullPath}${extractedQueryParams ? "(.*)" : ""}';

`;
  };
}

module.exports = { RequestGenerator };
