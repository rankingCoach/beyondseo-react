#!/bin/bash

echo ""
echo "=== SDK Token Generator ==="
echo ""

read -p "Enter HOST (e.g. http://localhost:8080): " HOST
read -p "Enter WordPress USERNAME: " WP_USER
read -p "Enter APPLICATION PASSWORD: " APP_PASS
echo ""
echo ""

if [ -z "$HOST" ] || [ -z "$WP_USER" ] || [ -z "$APP_PASS" ]; then
    echo "Error: HOST, USERNAME and APPLICATION PASSWORD are all required."
    exit 1
fi

if [[ "$HOST" == https://* ]]; then
    TLS_PREFIX="NODE_TLS_REJECT_UNAUTHORIZED=0 "
else
    TLS_PREFIX=""
fi

OS="$(uname -s)"

if [ "$OS" = "Darwin" ]; then
    if ! command -v jq &> /dev/null; then
        echo "jq is not installed."
        echo ""
        read -p "Would you like to install it via Homebrew? (y/n): " INSTALL_JQ
        if [ "$INSTALL_JQ" = "y" ] || [ "$INSTALL_JQ" = "Y" ]; then
            if ! command -v brew &> /dev/null; then
                echo "Error: Homebrew is not installed. Please install it first: https://brew.sh"
                exit 1
            fi
            brew install jq
        else
            echo ""
            echo "Skipping jq installation. Run the command manually and extract the token from the response:"
            echo ""
            echo "  curl -s -X POST \"${HOST}/wp-json/rankingcoach/seo/sdk_token\" \\"
            echo "    -u \"${WP_USER}:<APPLICATION_PASSWORD>\""
            echo ""
            echo "The token is located at: response.data.token in the JSON response."
            exit 0
        fi
    fi

    echo "Fetching SDK token..."
    echo ""

    RESPONSE=$(curl -s -X POST "${HOST}/wp-json/rankingcoach/seo/sdk_token" \
        -u "${WP_USER}:${APP_PASS}")

    TOKEN=$(echo "$RESPONSE" | jq -r '.response.data.token // empty')

    if [ -z "$TOKEN" ]; then
        echo "Error: Could not extract token from response."
        echo ""
        echo "Raw response:"
        echo "$RESPONSE" | jq . 2>/dev/null || echo "$RESPONSE"
        exit 1
    fi

    echo "Token retrieved successfully!"
    echo ""
    echo "Token:"
    echo ""
    echo "  $TOKEN"
    echo ""
    echo "Use this token to generate the SDK:"
    echo ""
    echo "  ${TLS_PREFIX}npm run gen:SDK -- --base=${HOST} --token=${TOKEN}"
    echo ""
else
    echo "Non-macOS system detected (${OS})."
    echo ""
    echo "Please run the following curl command and extract the token manually:"
    echo ""
    echo "  curl -s -X POST \"${HOST}/wp-json/rankingcoach/seo/sdk_token\" \\"
    echo "    -u \"${WP_USER}:<APPLICATION_PASSWORD>\""
    echo ""
    echo "The response will be a JSON object. Look for the token at:"
    echo "  response -> data -> token"
    echo ""
    echo "Example response structure:"
    echo "  {"
    echo "    \"response\": {"
    echo "      \"data\": {"
    echo "        \"token\": \"YOUR_TOKEN_HERE\""
    echo "      }"
    echo "    }"
    echo "  }"
    echo ""
    echo "Once you have the token, run:"
    echo "  ${TLS_PREFIX}npm run gen:SDK -- --base=${HOST} --token=<YOUR_TOKEN>"
    echo ""
fi
