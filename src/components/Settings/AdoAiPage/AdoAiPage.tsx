import React, { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonTypes, ComponentContainer, FontWeights, Skeleton, Text, TextTypes } from "vanguard";
import { __ } from "@wordpress/i18n";
import { getPluginRestUrl, getRestNonce } from "@helpers/internal-links";
import SettingsRow from "../GeneralSettingsPage/SettingsRow";
import styles from "./AdoAiPage.module.scss";

type AdoAiState = {
  enabled: boolean;
  canCreateCredentials: boolean;
  credentialWarning: string | null;
  hasManagedCredentials: boolean;
  cleanupPending: boolean;
  toolsUrl: string;
  callUrl: string;
};

type OneTimeCredentials = { username: string; password: string };
type MutationResponse = { settings: AdoAiState; credentials: OneTimeCredentials | null };
type CopyField = "username" | "password" | "tools" | "call";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isSettings = (value: unknown): value is AdoAiState =>
  isRecord(value) &&
  typeof value.enabled === "boolean" &&
  typeof value.canCreateCredentials === "boolean" &&
  (value.credentialWarning === null || typeof value.credentialWarning === "string") &&
  typeof value.hasManagedCredentials === "boolean" &&
  typeof value.cleanupPending === "boolean" &&
  typeof value.toolsUrl === "string" &&
  value.toolsUrl.length > 0 &&
  typeof value.callUrl === "string" &&
  value.callUrl.length > 0;

const readSettings = (value: unknown): AdoAiState => {
  if (!isSettings(value)) {
    throw new Error(__("The Ado AI settings response could not be verified.", "beyondseo"));
  }
  return {
    enabled: value.enabled,
    canCreateCredentials: value.canCreateCredentials,
    credentialWarning: value.credentialWarning,
    hasManagedCredentials: value.hasManagedCredentials,
    cleanupPending: value.cleanupPending,
    toolsUrl: value.toolsUrl,
    callUrl: value.callUrl,
  };
};

class SettingsApiError extends Error {
  settings: AdoAiState | null;
  status: number;

  constructor(message: string, settings: AdoAiState | null, status: number) {
    super(message);
    this.settings = settings;
    this.status = status;
  }
}

const requestSettings = async (signal: AbortSignal, enabled?: boolean): Promise<unknown> => {
  const response = await fetch(getPluginRestUrl("ado-ai/settings"), {
    method: enabled === undefined ? "GET" : "POST",
    credentials: "same-origin",
    mode: "same-origin",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "X-WP-Nonce": getRestNonce(),
      ...(enabled === undefined ? {} : { "Content-Type": "application/json" }),
    },
    ...(enabled === undefined ? {} : { body: JSON.stringify({ enabled }) }),
    signal,
  });
  const data: unknown = await response.json();
  if (!response.ok) {
    const errorSettings = isRecord(data) && isRecord(data.data) ? data.data.settings : null;
    throw new SettingsApiError(
      isRecord(data) && typeof data.message === "string"
        ? data.message
        : __("Unable to update or load Ado AI settings. Please try again.", "beyondseo"),
      isSettings(errorSettings) ? readSettings(errorSettings) : null,
      response.status,
    );
  }
  return data;
};

const readMutation = (value: unknown): MutationResponse => {
  if (!isRecord(value)) {
    throw new Error(__("The Ado AI update response could not be verified.", "beyondseo"));
  }
  const settings = readSettings(value.settings);
  const credentials = value.credentials;
  if (credentials === null) {
    return { settings, credentials: null };
  }
  if (
    !settings.enabled ||
    !isRecord(credentials) ||
    typeof credentials.username !== "string" ||
    !credentials.username ||
    typeof credentials.password !== "string" ||
    !credentials.password
  ) {
    throw new Error(__("The Ado AI credential response could not be verified.", "beyondseo"));
  }
  return { settings, credentials: { username: credentials.username, password: credentials.password } };
};

const AdoAiPage: React.FC = () => {
  const [settings, setSettings] = useState<AdoAiState | null>(null);
  const [credentials, setCredentials] = useState<OneTimeCredentials | null>(null);
  const [pending, setPending] = useState<"loading" | "saving" | null>("loading");
  const [error, setError] = useState<string | null>(null);
  const [recovery, setRecovery] = useState(false);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);
  const [copying, setCopying] = useState<CopyField | null>(null);
  const mounted = useRef(false);
  const requestLock = useRef(false);
  const controllerRef = useRef<AbortController | null>(null);
  const copyVersion = useRef(0);
  const copyLock = useRef(false);
  const fieldId = useId();

  const clearCredentials = () => {
    copyVersion.current += 1;
    copyLock.current = false;
    setCredentials(null);
    setCopying(null);
    setCopyMessage(null);
  };

  const beginRequest = (kind: "loading" | "saving") => {
    if (!mounted.current || requestLock.current) {
      return null;
    }
    requestLock.current = true;
    const controller = new AbortController();
    controllerRef.current = controller;
    setPending(kind);
    setError(null);
    return controller;
  };

  const isCurrent = (controller: AbortController) =>
    mounted.current && !controller.signal.aborted && controllerRef.current === controller;

  const finishRequest = (controller: AbortController) => {
    if (isCurrent(controller)) {
      requestLock.current = false;
      controllerRef.current = null;
      setPending(null);
    }
  };

  const loadSettings = async () => {
    const controller = beginRequest("loading");
    if (!controller) {
      return;
    }
    try {
      const nextSettings = readSettings(await requestSettings(controller.signal));
      if (isCurrent(controller)) {
        setSettings(nextSettings);
        if (!nextSettings.enabled) {
          clearCredentials();
        }
      }
    } catch (failure) {
      if (isCurrent(controller)) {
        setSettings(null);
        setError(
          failure instanceof SettingsApiError
            ? failure.message
            : __("Unable to load Ado AI settings. Please retry or refresh this page.", "beyondseo"),
        );
      }
    } finally {
      finishRequest(controller);
    }
  };

  useEffect(() => {
    mounted.current = true;
    void loadSettings();
    return () => {
      mounted.current = false;
      controllerRef.current?.abort();
      controllerRef.current = null;
      requestLock.current = false;
      copyVersion.current += 1;
      copyLock.current = false;
    };
  }, []);

  const changeEnabled = async (enabled: boolean) => {
    if (!settings || (enabled && !settings.canCreateCredentials)) {
      return;
    }
    const controller = beginRequest("saving");
    if (!controller) {
      return;
    }
    clearCredentials();
    setRecovery(false);
    try {
      const result = readMutation(await requestSettings(controller.signal, enabled));
      if (result.settings.enabled !== enabled) {
        throw new Error(__("The requested Ado AI state change could not be confirmed.", "beyondseo"));
      }
      if (isCurrent(controller)) {
        setSettings(result.settings);
        setCredentials(result.credentials);
      }
    } catch (failure) {
      if (!isCurrent(controller)) {
        return;
      }
      const uncertain = !(failure instanceof SettingsApiError) || failure.status >= 500;
      setError(
        failure instanceof SettingsApiError
          ? failure.message
          : __("The update response was lost or could not be verified. Checking the current settings.", "beyondseo"),
      );
      setRecovery(uncertain && enabled);
      if (failure instanceof SettingsApiError && failure.settings) {
        setSettings(failure.settings);
      } else {
        setSettings(null);
        try {
          const currentSettings = readSettings(await requestSettings(controller.signal));
          if (isCurrent(controller)) {
            setSettings(currentSettings);
          }
        } catch {
          if (isCurrent(controller)) {
            setError(
              __(
                "The update could not be confirmed and current settings could not be loaded. Reload settings before trying another change.",
                "beyondseo",
              ),
            );
          }
        }
      }
    } finally {
      finishRequest(controller);
    }
  };

  const copyValue = async (field: CopyField, value: string) => {
    if (!mounted.current || requestLock.current || copyLock.current) {
      return;
    }
    copyLock.current = true;
    const version = ++copyVersion.current;
    setCopying(field);
    setCopyMessage(null);
    try {
      await navigator.clipboard.writeText(value);
      if (mounted.current && copyVersion.current === version) {
        setCopyMessage(
          __("Copied to clipboard. Keep credentials private and clear your clipboard after use.", "beyondseo"),
        );
      }
    } catch {
      if (mounted.current && copyVersion.current === version) {
        setCopyMessage(__("Could not copy. Select the value and copy it manually.", "beyondseo"));
      }
    } finally {
      if (mounted.current && copyVersion.current === version) {
        copyLock.current = false;
        setCopying(null);
      }
    }
  };

  const renderField = (field: CopyField, label: string, value: string, copyLabel: string) => (
    <div className={styles.field}>
      <label htmlFor={`${fieldId}-${field}`} className={styles.label}>
        {label}
      </label>
      <div className={styles.fieldActions}>
        <input
          id={`${fieldId}-${field}`}
          type="text"
          value={value}
          readOnly
          autoComplete="off"
          spellCheck={false}
          className={styles.value}
        />
        <Button
          type={ButtonTypes.secondary}
          onClick={() => void copyValue(field, value)}
          disabled={!!pending || copying !== null}
          testId={`ado-ai-copy-${field}`}
        >
          {copying === field ? __("Copying…", "beyondseo") : copyLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <ComponentContainer>
      <div className={styles.page} aria-busy={pending !== null}>
        <Text type={TextTypes.heading3} className={styles.title}>
          {__("Ado AI", "beyondseo")}
        </Text>
        <Text type={TextTypes.text}>
          {__(
            "Manage external AI access for this entire WordPress site, independently of your rankingCoach account.",
            "beyondseo",
          )}
        </Text>
        <div className={styles.separator} />

        {error && (
          <div className={styles.error} role="alert">
            <Text type={TextTypes.text}>{error}</Text>
          </div>
        )}
        {pending === "loading" && (
          <div role="status" className={styles.panel}>
            <Text type={TextTypes.text}>{__("Loading Ado AI settings…", "beyondseo")}</Text>
            <Skeleton width="220px" height="32px" />
          </div>
        )}
        {!settings && !pending && (
          <Button type={ButtonTypes.secondary} onClick={() => void loadSettings()} testId="ado-ai-reload-settings">
            {__("Reload settings", "beyondseo")}
          </Button>
        )}
        {settings && (
          <>
            <div
              ref={(element) => {
                element
                  ?.querySelector('input[type="checkbox"]')
                  ?.setAttribute("aria-label", __("Enable Ado AI", "beyondseo"));
              }}
            >
              <SettingsRow
                title={__("Enable Ado AI", "beyondseo")}
                description={__(
                  "Allow external AI tools to connect to this site. Disabling stops only the external API; stored redirects, robots.txt overrides, old-slug handling and sitemap preferences remain active.",
                  "beyondseo",
                )}
                checked={settings.enabled}
                onChange={(event) => void changeEnabled((event.target as HTMLInputElement).checked)}
                disabled={!!pending || (!settings.enabled && !settings.canCreateCredentials)}
                testId="ado-ai-enabled-switch"
              />
            </div>
            <section className={styles.panel} aria-label={__("Ado AI status", "beyondseo")}>
              <div role="status" aria-live="polite">
                <Text type={TextTypes.text} fontWeight={FontWeights.medium}>
                  {pending === "saving"
                    ? __("Updating Ado AI settings…", "beyondseo")
                    : settings.enabled
                      ? __("External AI API is enabled site-wide.", "beyondseo")
                      : __("External AI API is disabled site-wide.", "beyondseo")}
                </Text>
              </div>
              {settings.credentialWarning && <Text type={TextTypes.text}>{settings.credentialWarning}</Text>}
              {!settings.enabled && !settings.canCreateCredentials && (
                <Text type={TextTypes.text}>
                  {__(
                    "Application Password creation is unavailable for your user or environment. Resolve the WordPress Application Password or HTTPS restrictions before enabling. Existing access can still be disabled.",
                    "beyondseo",
                  )}
                </Text>
              )}
              {settings.cleanupPending && (
                <>
                  <Text type={TextTypes.text}>
                    {__(
                      "The API is disabled, but credential cleanup is still pending. Retry disable to revoke remaining Ado-created passwords before enabling again.",
                      "beyondseo",
                    )}
                  </Text>
                  <div className={styles.actions}>
                    <Button
                      type={ButtonTypes.secondary}
                      onClick={() => void changeEnabled(false)}
                      disabled={!!pending}
                      testId="ado-ai-retry-disable"
                    >
                      {__("Retry disable and cleanup", "beyondseo")}
                    </Button>
                  </div>
                </>
              )}
              {settings.enabled && !credentials && (
                <Text type={TextTypes.text}>
                  {settings.hasManagedCredentials
                    ? __(
                        "Previously created passwords cannot be displayed again. If you no longer have yours, disable and re-enable Ado AI to create fresh credentials.",
                        "beyondseo",
                      )
                    : __(
                        "Ado AI is enabled without a managed credential. Disable and re-enable to create fresh credentials; loading this page never creates a password.",
                        "beyondseo",
                      )}
                </Text>
              )}
            </section>
          </>
        )}
        {recovery && (
          <div className={styles.panel} role="status">
            <Text type={TextTypes.text}>
              {__(
                "Enabling did not return verified connection credentials. A password may have been created even though the request failed, and it cannot be retrieved. No enable request was automatically retried. Once current settings are confirmed, disable and re-enable Ado AI if you need fresh credentials.",
                "beyondseo",
              )}
            </Text>
          </div>
        )}
        {credentials && settings?.enabled && (
          <section className={styles.panel} aria-label={__("One-time connection credentials", "beyondseo")}>
            <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium}>
              {__("Save your connection credentials now", "beyondseo")}
            </Text>
            <Text type={TextTypes.text}>
              {__(
                "This WordPress username and newly generated Application Password are shown only once. This is not your normal WordPress login password. Copy them to a secure place before leaving or dismissing this panel.",
                "beyondseo",
              )}
            </Text>
            {renderField(
              "username",
              __("WordPress username", "beyondseo"),
              credentials.username,
              __("Copy username", "beyondseo"),
            )}
            {renderField(
              "password",
              __("Application Password", "beyondseo"),
              credentials.password,
              __("Copy password", "beyondseo"),
            )}
            <div className={styles.actions}>
              <Button
                type={ButtonTypes.secondary}
                onClick={clearCredentials}
                disabled={!!pending}
                testId="ado-ai-dismiss-credentials"
              >
                {__("Dismiss credentials", "beyondseo")}
              </Button>
            </div>
          </section>
        )}
        {settings && (
          <section className={styles.panel} aria-label={__("Connection endpoints", "beyondseo")}>
            <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium}>
              {__("Connection endpoints", "beyondseo")}
            </Text>
            <Text type={TextTypes.text}>
              {__(
                "Use HTTP Basic authentication with the WordPress username and Application Password. These endpoints are available only while Ado AI is enabled.",
                "beyondseo",
              )}
            </Text>
            {renderField(
              "tools",
              __("Tools endpoint (GET)", "beyondseo"),
              settings.toolsUrl,
              __("Copy tools URL", "beyondseo"),
            )}
            {renderField(
              "call",
              __("Tool call endpoint (POST)", "beyondseo"),
              settings.callUrl,
              __("Copy call URL", "beyondseo"),
            )}
          </section>
        )}
        {copyMessage && (
          <div role="status" aria-live="polite">
            <Text type={TextTypes.text}>{copyMessage}</Text>
          </div>
        )}
        <section className={styles.panel} aria-label={__("Access and credential security", "beyondseo")}>
          <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium}>
            {__("Access and credential security", "beyondseo")}
          </Text>
          <Text type={TextTypes.text}>
            {__(
              "Ado-created passwords allow all existing Ado tools, including site-setting changes and destructive content or media operations. Share them only with trusted AI clients.",
              "beyondseo",
            )}
          </Text>
          <Text type={TextTypes.text}>
            {__(
              "While BeyondSEO remains active and loaded, these passwords are restricted to GET /ado-ai-mcp/v1/tools and POST /ado-ai-mcp/v1/call. They cannot access other APIs or administer users, accounts, API keys or Application Passwords, including Ado AI settings.",
              "beyondseo",
            )}
          </Text>
          <Text type={TextTypes.text}>
            {__(
              "This restriction depends on BeyondSEO continuing to load. Normal deactivation attempts to revoke Ado-created passwords, but failed cleanup or plugin removal can leave a surviving password usable as an ordinary, unrestricted WordPress Application Password. Revoke any surviving password in WordPress before relying on deactivation or removal.",
              "beyondseo",
            )}
          </Text>
        </section>
      </div>
    </ComponentContainer>
  );
};

export default AdoAiPage;
