const { generateSdk } = require("./generate-sdk");

const baseUrl = process.env.npm_config_base || null;
const mocks = process.env.npm_config_mocks || false;
const sdkToken = process.env.npm_config_token || null;

// avoid using without --base=... argument
if (!baseUrl) {
    console.error("Please provide a base URL using --base=http://... argument");
    process.exit(1);
}

// Token is required for authenticated endpoints
if (!sdkToken) {
    console.error("Please provide an SDK token using --token=... argument");
    console.error("Generate a token by calling POST /wp-json/rankingcoach/seo/sdk_token as an admin user");
    console.error("");
    console.error("Example using curl:");
    console.error('  curl -X POST "' + baseUrl + '/wp-json/rankingcoach/seo/sdk_token" \\');
    console.error('    -H "X-WP-Nonce: YOUR_NONCE" \\');
    console.error('    -H "Cookie: YOUR_AUTH_COOKIES"');
    console.error("");
    console.error("Or use WordPress Application Password:");
    console.error('  curl -X POST "' + baseUrl + '/wp-json/rankingcoach/seo/sdk_token" \\');
    console.error('    -u "username:application_password"');
    process.exit(1);
}

console.log("Using SDK token for authentication...");

generateSdk(baseUrl, mocks, sdkToken).then(() => {
    console.log("SDK generation completed!");
}).catch((error) => {
    console.error("SDK generation failed:", error.message);
    process.exit(1);
});
