const fetch = require("node-fetch");
const { SchemaCollector } = require("./helpers/schema-collector");
const { keyMapModels } = require("./helpers/key-map-models");
const { generateModels } = require("./generate-models");
const { generateRequests } = require("./generate-requests");
const { generateMockRequests } = require("./generate-mocks");

const readApi = async (workspace, endpoint, sdkToken = null) => {
  let base = `${workspace ?? ""}`;
  if (base) {
    base = `${base}`;
  }
  endpoint = endpoint.replace("${base}", base);
  console.log("Generating documentation from URL!", endpoint);
  console.log("__________________________________");

  const fetchOptions = {
    headers: {}
  };

  if (sdkToken) {
    fetchOptions.headers['X-SDK-Token'] = sdkToken;
    console.log("Using SDK token for authentication");
  }

  const response = await fetch(endpoint, fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const resp = await response.json();

  return {
    paths: resp.paths,
    schemas: resp?.components?.schemas ?? [],
  };
};

const generateFromUrl = async (realUrl, documentationUrl, baseUrl, useFolders, onlyMocks, sdkToken = null) => {
  const endpoint = "${base}" + documentationUrl;
  const { paths, schemas } = await readApi(realUrl, endpoint, sdkToken);
  const collector = new SchemaCollector();

  keyMapModels(schemas, collector);
  collector.resolveRefs();

  if (!onlyMocks) {
    console.log("============ Generating SDK =================");
    // await deleteModels();
    // await deleteRequests();
    await collector.writeModels();
    await generateModels(collector);
    await generateRequests(paths, baseUrl, useFolders, collector);
  }


  if (onlyMocks) {
    console.log("============ Generating MOCKS =================");
    // await deleteMocks();
    collector.mockModels();
    collector.writeMockModels();
    generateMockRequests(paths, baseUrl, useFolders, collector);
  }
};

const generateSdk = async (baseUrl = null, mocks = false, sdkToken = null) => {
  await generateFromUrl(baseUrl ?? '', "/wp-json/rankingcoach/seo/generate_sdk?debug=1&noCache=1", "wp-json", true, mocks, sdkToken);
  await generateFromUrl(baseUrl ?? '', "/wp-json/rankingcoach/api/documentation/openapi?debug=1&noCache=1", "wp-json/rankingcoach", true, mocks, sdkToken);
};

module.exports = {
  generateSdk: generateSdk,
};
