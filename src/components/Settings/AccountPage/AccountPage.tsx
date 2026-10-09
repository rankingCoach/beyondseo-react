import React, { useEffect, useId, useRef, useState } from "react";
import { Button, ButtonTypes, ComponentContainer, EditModal, FontWeights, Skeleton, Text, TextTypes } from "vanguard";
import { __ } from "@wordpress/i18n";
import { getPluginRestUrl, getRestNonce } from "@helpers/internal-links";
import { redirectToConnectPage } from "@helpers/onboarding-helpers";
import styles from "./AccountPage.module.scss";

export interface AccountProjectState {
  connected: boolean;
  projectId: number | null;
  locationId: number | null;
  website: string;
}

export type AccountProjectDeletionOutcome = "deleted" | "deferred" | "alreadyDeleted";

type AccountProjectDeletionResponse = {
  deletionResult: { outcome: AccountProjectDeletionOutcome };
  project: AccountProjectState;
};

export interface AccountPageProps {
  project: AccountProjectState | null;
  isLoading: boolean;
  loadError: string | null;
  onRefresh: () => Promise<void>;
  onProjectChange: (project: AccountProjectState) => void;
  deletionOutcome: AccountProjectDeletionOutcome | null;
  onDeletionOutcomeChange: (outcome: AccountProjectDeletionOutcome | null) => void;
  onDeletionPendingChange: (pending: boolean) => void;
}

export class AccountProjectRequestError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code: string, status = 0) {
    super(message);
    this.name = "AccountProjectRequestError";
    this.code = code;
    this.status = status;
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isIdentifier = (value: unknown): value is number =>
  typeof value === "number" && Number.isSafeInteger(value) && value > 0;

const parseProject = (value: unknown): AccountProjectState => {
  if (
    !isRecord(value) ||
    typeof value.connected !== "boolean" ||
    typeof value.website !== "string" ||
    (value.connected
      ? !isIdentifier(value.projectId) || !isIdentifier(value.locationId)
      : value.projectId !== null || value.locationId !== null)
  ) {
    throw new AccountProjectRequestError(
      __("The project connection could not be verified. Refresh Account before trying again.", "beyondseo"),
      "account_project_invalid_response",
    );
  }

  try {
    const website = new URL(value.website);
    if (!["http:", "https:"].includes(website.protocol) || website.username || website.password) {
      throw new Error();
    }
  } catch {
    throw new AccountProjectRequestError(
      __("The project connection could not be verified. Refresh Account before trying again.", "beyondseo"),
      "account_project_invalid_response",
    );
  }

  return {
    connected: value.connected,
    projectId: value.projectId as number | null,
    locationId: value.locationId as number | null,
    website: value.website,
  };
};

const requestError = (code: string, status: number): AccountProjectRequestError => {
  let message = __(
    "The service could not confirm project deletion. Your local connection has not been removed. Try again or contact support.",
    "beyondseo",
  );
  switch (code) {
    case "account_project_invalid_response":
      message = __(
        "The service response could not be verified. Refresh Account before trying again. If the connection is incomplete, contact support before reconnecting.",
        "beyondseo",
      );
      break;
    case "account_project_cleanup_failed":
      message = __(
        "Project deletion was accepted, but the local connection could not be fully removed. Contact support before retrying or reconnecting. Refresh Account to check the current connection.",
        "beyondseo",
      );
      break;
    case "account_project_changed":
      message = __(
        "The connected project has changed or is no longer connected. Refresh Account and review the project before trying again.",
        "beyondseo",
      );
      break;
    case "account_project_deletion_in_progress":
      message = __(
        "Project deletion is already in progress. Wait for it to finish and refresh Account. If this persists, contact support.",
        "beyondseo",
      );
      break;
    case "account_project_communication_disabled":
      message = __(
        "Enable communication with rankingCoach in Settings before deleting the project. Your local connection has not been removed.",
        "beyondseo",
      );
      break;
    case "account_project_authentication_failed":
      message = __(
        "The service could not authenticate project deletion. Your local connection has not been removed. Contact support to restore access before retrying.",
        "beyondseo",
      );
      break;
    case "account_project_read_failed":
      message = __("Unable to load the local project connection. Please try again.", "beyondseo");
      break;
    default:
      if (status === 401 || status === 403) {
        message = __(
          "Account access could not be verified. Reload this page and sign in as an administrator before trying again.",
          "beyondseo",
        );
      }
  }
  return new AccountProjectRequestError(message, code, status);
};

const requestProject = async (route: string, method: "GET" | "DELETE", signal?: AbortSignal): Promise<unknown> => {
  let response: Response;
  try {
    response = await fetch(getPluginRestUrl(route), {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: { "X-WP-Nonce": getRestNonce(), Accept: "application/json" },
      signal,
    });
  } catch (error) {
    if (signal?.aborted) throw error;
    throw new AccountProjectRequestError(
      method === "GET"
        ? __("Unable to load the local project connection. Check your connection and try again.", "beyondseo")
        : __(
            "The deletion result could not be verified. Refresh Account before trying again. If the connection is incomplete, contact support before reconnecting.",
            "beyondseo",
          ),
      "account_project_network_error",
    );
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new AccountProjectRequestError(
      __("The service response could not be verified. Refresh Account before trying again.", "beyondseo"),
      "account_project_invalid_response",
      response.status,
    );
  }
  if (!response.ok) {
    const code =
      isRecord(data) && typeof data.code === "string" && /^[a-z0-9_]{1,100}$/.test(data.code)
        ? data.code
        : "account_project_invalid_response";
    throw requestError(code, response.status);
  }
  return data;
};

export const getAccountProject = async (signal?: AbortSignal): Promise<AccountProjectState> =>
  parseProject(await requestProject("account/project", "GET", signal));

const deleteAccountProject = async (locationId: number): Promise<AccountProjectDeletionResponse> => {
  if (!isIdentifier(locationId)) throw requestError("account_project_invalid_id", 400);
  const data = await requestProject(`account/project/${locationId}`, "DELETE");
  if (
    !isRecord(data) ||
    !isRecord(data.deletionResult) ||
    typeof data.deletionResult.outcome !== "string" ||
    !["deleted", "deferred", "alreadyDeleted"].includes(data.deletionResult.outcome)
  ) {
    throw new AccountProjectRequestError(
      __("The deletion result could not be verified. Refresh Account before trying again.", "beyondseo"),
      "account_project_invalid_response",
    );
  }
  const project = parseProject(data.project);
  if (project.connected) {
    throw requestError("account_project_cleanup_failed", 500);
  }
  return { deletionResult: { outcome: data.deletionResult.outcome as AccountProjectDeletionOutcome }, project };
};

const focusableSelector =
  'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

const AccountPage: React.FC<AccountPageProps> = ({
  project,
  isLoading,
  loadError,
  onRefresh,
  onProjectChange,
  deletionOutcome,
  onDeletionOutcomeChange,
  onDeletionPendingChange,
}) => {
  const [confirmation, setConfirmation] = useState<AccountProjectState | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [cleanupBlocked, setCleanupBlocked] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(false);
  const pendingRef = useRef(false);
  const modalContentRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const focusConnectRef = useRef(false);
  const mountedRef = useRef(true);
  const pendingCallbackRef = useRef(onDeletionPendingChange);
  pendingCallbackRef.current = onDeletionPendingChange;
  const headingId = useId();
  const descriptionId = useId();

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (pendingRef.current) pendingCallbackRef.current(false);
    };
  }, []);

  useEffect(() => {
    if (!confirmation) return;
    const dialog = modalContentRef.current?.closest<HTMLElement>(".rc-modal");
    if (!dialog) return;
    const content = dialog.querySelector<HTMLElement>(".modal-content") || dialog;
    content.setAttribute("role", "dialog");
    content.setAttribute("aria-modal", "true");
    content.setAttribute("aria-labelledby", headingId);
    content.setAttribute("aria-describedby", descriptionId);
    content.tabIndex = -1;
    const getFocusable = () =>
      Array.from(content.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) => element.getClientRects().length > 0,
      );
    const focusInitial = () => {
      if (!content.getClientRects().length) return;
      const buttons = getFocusable();
      const cancel = buttons.find((element) => element.dataset.testid === "modal-negative-cta");
      (cancel || content).focus();
    };
    const frame = requestAnimationFrame(focusInitial);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!content.getClientRects().length) return;
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        if (!pendingRef.current) setConfirmation(null);
      }
      if (event.key === "Tab") {
        const elements = getFocusable();
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (
          !first ||
          !content.contains(document.activeElement) ||
          (event.shiftKey && (document.activeElement === first || document.activeElement === content)) ||
          (!event.shiftKey && document.activeElement === last)
        ) {
          event.preventDefault();
          (event.shiftKey ? last || content : first || content).focus();
        }
      }
    };
    const handleFocus = (event: FocusEvent) => {
      if (!content.contains(event.target as Node)) focusInitial();
    };
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocus);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocus);
      const target = returnFocusRef.current;
      if (target?.isConnected && target.getClientRects().length && !target.matches(":disabled")) target.focus();
    };
  }, [confirmation, headingId, descriptionId]);

  useEffect(() => {
    if (!confirmation) return;
    const dialog = modalContentRef.current?.closest<HTMLElement>(".rc-modal");
    const content = dialog?.querySelector<HTMLElement>(".modal-content");
    dialog
      ?.querySelectorAll<HTMLButtonElement>(
        '[data-testid="modal-negative-cta"], [data-testid="modal-close-header-cta"]',
      )
      .forEach((button) => {
        button.disabled = isDeleting;
      });
    if (isDeleting && content?.getClientRects().length) content.focus();
  }, [confirmation, isDeleting]);

  useEffect(() => {
    if (confirmation || isLoading || isDeleting || !focusConnectRef.current) return;
    const target =
      pageRef.current?.querySelector<HTMLElement>('[data-testid="account-connect-button"]') || pageRef.current;
    if (!target?.getClientRects().length || target.matches(":disabled")) return;
    target.focus();
    focusConnectRef.current = false;
  });

  const refresh = async () => {
    if (pendingRef.current) return;
    try {
      await onRefresh();
      if (mountedRef.current) setNeedsRefresh(false);
    } catch {
      if (mountedRef.current) setNeedsRefresh(true);
    }
  };

  const handleDelete = async () => {
    if (pendingRef.current || cleanupBlocked || needsRefresh || isLoading || loadError || !confirmation) return;
    if (
      !project?.connected ||
      project.locationId !== confirmation.locationId ||
      project.projectId !== confirmation.projectId
    ) {
      setActionError(requestError("account_project_changed", 409).message);
      setConfirmation(null);
      setNeedsRefresh(true);
      await refresh();
      return;
    }
    pendingRef.current = true;
    setIsDeleting(true);
    setActionError(null);
    onDeletionPendingChange(true);
    try {
      const result = await deleteAccountProject(confirmation.locationId!);
      if (!mountedRef.current) return;
      focusConnectRef.current = true;
      onProjectChange(result.project);
      onDeletionOutcomeChange(result.deletionResult.outcome);
      setConfirmation(null);
    } catch (error) {
      if (!mountedRef.current) return;
      const failure =
        error instanceof AccountProjectRequestError ? error : requestError("account_project_invalid_response", 0);
      setActionError(failure.message);
      setConfirmation(null);
      const cleanupFailed = failure.code === "account_project_cleanup_failed";
      if (cleanupFailed) setCleanupBlocked(true);
      if (
        cleanupFailed ||
        failure.status === 409 ||
        ["account_project_invalid_response", "account_project_network_error"].includes(failure.code)
      ) {
        setNeedsRefresh(true);
        onDeletionPendingChange(false);
        try {
          await onRefresh();
          if (mountedRef.current) setNeedsRefresh(false);
        } catch {
          if (mountedRef.current) setNeedsRefresh(true);
        }
      }
    } finally {
      pendingRef.current = false;
      if (mountedRef.current) {
        setIsDeleting(false);
        onDeletionPendingChange(false);
      }
    }
  };

  const disabled = isLoading || isDeleting || !!loadError || cleanupBlocked || needsRefresh;
  const status =
    deletionOutcome === "deferred"
      ? __(
          "Project deletion was accepted and deferred. The local connection has been removed. Your settings and SEO data are preserved, and the plugin remains active.",
          "beyondseo",
        )
      : deletionOutcome
        ? __(
            "The remote project is deleted and the local connection has been removed. Your settings and SEO data are preserved, and the plugin remains active.",
            "beyondseo",
          )
        : null;

  return (
    <ComponentContainer>
      <div ref={pageRef} className={styles.page} tabIndex={-1}>
        <Text type={TextTypes.heading3} className={styles.title}>
          {__("Account", "beyondseo")}
        </Text>
        <Text type={TextTypes.text} className={styles.description}>
          {__("Manage the project connected to this website.", "beyondseo")}
        </Text>
        {loadError && (
          <div role="alert" className={styles.error}>
            {loadError}
          </div>
        )}
        {actionError && (
          <div role="alert" className={styles.error}>
            {actionError}
          </div>
        )}
        {status && !actionError && (
          <div role="status" className={styles.status}>
            {status}
          </div>
        )}
        {isLoading && (
          <div role="status" className={styles.loading}>
            <Skeleton width="220px" height="40px" />
            <span>{__("Loading project connection…", "beyondseo")}</span>
          </div>
        )}
        {(loadError || actionError || needsRefresh || (!project && !isLoading)) && (
          <div className={styles.actions}>
            <Button
              type={ButtonTypes.secondary}
              disabled={isLoading || isDeleting}
              onClick={refresh}
              testId="account-refresh-button"
            >
              {__("Refresh Account", "beyondseo")}
            </Button>
          </div>
        )}
        {project && (
          <>
            <div className={styles.separator} />
            <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.sectionTitle}>
              {__("Project details", "beyondseo")}
            </Text>
            <dl className={styles.details}>
              <div>
                <dt>{__("Project ID", "beyondseo")}</dt>
                <dd>{project.projectId ?? __("Not connected", "beyondseo")}</dd>
              </div>
              <div>
                <dt>{__("Location ID", "beyondseo")}</dt>
                <dd>{project.locationId ?? __("Not connected", "beyondseo")}</dd>
              </div>
              <div>
                <dt>{__("Website", "beyondseo")}</dt>
                <dd>{project.website}</dd>
              </div>
            </dl>
            <div className={styles.separator} />
            {project.connected ? (
              <section className={styles.destructiveSection}>
                <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.sectionTitle}>
                  {__("Delete project", "beyondseo")}
                </Text>
                <Text type={TextTypes.text} className={styles.description}>
                  {__(
                    "Delete the remote project and remove this website’s connection. Your local settings and SEO data will be kept. This does not cancel your account or subscription.",
                    "beyondseo",
                  )}
                </Text>
                <div className={styles.actions}>
                  <Button
                    type={ButtonTypes.secondary}
                    className={styles.deleteButton}
                    disabled={disabled}
                    testId="account-delete-button"
                    onClick={() => {
                      if (pendingRef.current || disabled) return;
                      returnFocusRef.current =
                        document.activeElement instanceof HTMLElement ? document.activeElement : null;
                      onDeletionOutcomeChange(null);
                      setConfirmation(project);
                    }}
                  >
                    {isDeleting ? __("Deleting project…", "beyondseo") : __("Delete project", "beyondseo")}
                  </Button>
                </div>
              </section>
            ) : (
              <section>
                <Text type={TextTypes.textIntro} fontWeight={FontWeights.medium} className={styles.sectionTitle}>
                  {__("No project connected", "beyondseo")}
                </Text>
                <Text type={TextTypes.text} className={styles.description}>
                  {__(
                    "Connect an account to link this website to a project. Your existing settings and SEO data are still available.",
                    "beyondseo",
                  )}
                </Text>
                <div className={styles.actions}>
                  <Button
                    type={ButtonTypes.primary}
                    disabled={disabled}
                    onClick={redirectToConnectPage}
                    testId="account-connect-button"
                  >
                    {__("Connect", "beyondseo")}
                  </Button>
                </div>
              </section>
            )}
          </>
        )}
      </div>
      {confirmation && (
        <div className={styles.modalScope}>
          <EditModal
            title=""
            close={() => {
              if (!pendingRef.current) setConfirmation(null);
            }}
            closeOnSave={false}
            saveCallback={handleDelete}
            savable={!disabled}
            savingInProgress={isDeleting}
            positiveBtnText={isDeleting ? __("Deleting project…", "beyondseo") : __("Delete project", "beyondseo")}
            width="560px"
            testId="account-delete-confirmation"
          >
            <div ref={modalContentRef} className={styles.confirmation}>
              <h2 id={headingId}>{__("Delete this project?", "beyondseo")}</h2>
              <div id={descriptionId}>
                <Text type={TextTypes.text}>
                  {__(
                    "This deletes the remote project and removes the local connection for this website. Remote project deletion cannot be undone.",
                    "beyondseo",
                  )}
                </Text>
                <dl className={styles.details}>
                  <div>
                    <dt>{__("Location ID", "beyondseo")}</dt>
                    <dd>{confirmation.locationId}</dd>
                  </div>
                  <div>
                    <dt>{__("Website", "beyondseo")}</dt>
                    <dd>{confirmation.website}</dd>
                  </div>
                </dl>
                <Text type={TextTypes.text}>
                  {__(
                    "Your local settings and SEO data will be preserved. The plugin will remain active. Your account and subscription will not be cancelled.",
                    "beyondseo",
                  )}
                </Text>
              </div>
              {isDeleting && (
                <div role="status" className={styles.pending}>
                  {__("Deleting project… Please wait for confirmation.", "beyondseo")}
                </div>
              )}
            </div>
          </EditModal>
        </div>
      )}
    </ComponentContainer>
  );
};

export default AccountPage;
