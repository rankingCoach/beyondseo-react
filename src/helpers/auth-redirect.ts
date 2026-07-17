/**
 * Centralized handling for backend authentication failures.
 *
 * When the plugin's REST layer detects that the access/refresh token is no longer
 * valid (locally or rejected by the rankingCoach backend), it responds with
 * HTTP 401 and a body of the shape:
 *
 *   wp_send_json_error wrapper:  { "success": false, "data": { "code": "token_invalid", "redirect": "<url>" } }
 *   flat payload:                { "error": true, "code": "token_invalid", "redirect": "<url>" }
 *
 * In that case the connection has already been reset server-side, so the only thing
 * the frontend has to do is navigate the user into the Connect flow.
 */

const TOKEN_INVALID_CODE = "token_invalid";

interface TokenInvalidPayload {
  code?: string;
  redirect?: string;
  error?: boolean;
}

/**
 * Navigate the top-most window (breaking out of the admin iframe when present) to
 * the reconnect URL. Falls back to the current window if the top frame cannot be
 * accessed (cross-origin) or is unavailable.
 */
function navigateToReconnect(redirect: string): void {
  try {
    if (window.top && window.top !== window.self) {
      window.top.location.href = redirect;
      return;
    }
  } catch {
    // Cross-origin frame access denied — fall through to same-window navigation.
  }
  window.location.href = redirect;
}

/**
 * If the given HTTP status + body represent a token-invalid response, trigger the
 * reconnect redirect and return true. Otherwise return false so the caller keeps
 * its normal error handling.
 */
export function maybeHandleTokenInvalid(status: number | undefined, data: unknown): boolean {
  if (status !== 401) {
    return false;
  }

  const body = (data ?? {}) as { data?: TokenInvalidPayload } & TokenInvalidPayload;
  // Unwrap the wp_send_json_error envelope ({ success, data }) if present, otherwise
  // read the flat payload.
  const payload: TokenInvalidPayload = body.data ?? body;

  if (payload.code !== TOKEN_INVALID_CODE || !payload.redirect) {
    return false;
  }

  navigateToReconnect(payload.redirect);
  return true;
}
