import React, { useEffect, useState } from "react";
import styles from "./WebmasterToolsPage.module.scss";
import { Text, TextTypes, Button, ButtonTypes, ButtonSizes } from "vanguard";
import { __, sprintf } from "@wordpress/i18n";
import { getPluginRestUrl, getRestNonce } from "@helpers/internal-links";

type ProjectDomainState = {
  connected: boolean;
  website: string;
  knownWebsite: string | null;
  inSync: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === "object" && value !== null;

const parseDomainState = (data: unknown): ProjectDomainState | null => {
  if (!isRecord(data) || typeof data.website !== "string") {
    return null;
  }
  return {
    connected: data.connected === true,
    website: data.website,
    knownWebsite: typeof data.knownWebsite === "string" ? data.knownWebsite : null,
    inSync: data.inSync !== false,
  };
};

const updateFailedMessage = (): string =>
  __("The domain update could not be confirmed. Please try again or contact support.", "beyondseo");

/** Throws an Error carrying the message to show when the request fails. */
const requestProjectDomain = async (method: "GET" | "POST"): Promise<ProjectDomainState> => {
  let response: Response;
  let data: unknown;
  try {
    response = await fetch(getPluginRestUrl("account/project-domain"), {
      method,
      credentials: "same-origin",
      cache: "no-store",
      headers: { "X-WP-Nonce": getRestNonce(), Accept: "application/json" },
    });
    data = await response.json();
  } catch {
    throw new Error(updateFailedMessage());
  }

  const state = response.ok ? parseDomainState(data) : null;
  if (!state) {
    // The plugin's own errors arrive translated; anything else gets the generic message
    const isPluginError = isRecord(data) && typeof data.code === "string" && data.code.startsWith("project_domain_");
    throw new Error(
      isPluginError && isRecord(data) && typeof data.message === "string" ? data.message : updateFailedMessage(),
    );
  }
  return state;
};

/**
 * Shows the site address the rankingCoach project should use and lets an admin send it again.
 * The plugin updates the domain on its own when the address changes; this is the manual fallback.
 */
export const ProjectDomain: React.FC = () => {
  const [domain, setDomain] = useState<ProjectDomainState | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let isActive = true;
    requestProjectDomain("GET")
      .then((state) => {
        if (isActive) {
          setDomain(state);
        }
      })
      .catch(() => {});
    return () => {
      isActive = false;
    };
  }, []);

  if (!domain?.connected) {
    return null;
  }

  const handleUpdate = async () => {
    setIsUpdating(true);
    setIsUpdated(false);
    setError("");
    try {
      setDomain(await requestProjectDomain("POST"));
      setIsUpdated(true);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : updateFailedMessage());
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className={styles.separator}></div>
      <Text type={TextTypes.heading4} className={styles.title}>
        {__("Project domain", "beyondseo")}
      </Text>
      <div className={styles.settingsColumn}>
        <Text type={TextTypes.text} className={styles.note}>
          {__(
            "Your rankingCoach project follows the address of this site. When the address changes, for example from a temporary domain to your final one, we update the project for you. You can also send the current address yourself.",
            "beyondseo",
          )}
        </Text>

        <Text type={TextTypes.text}>
          {
            /* translators: %s: the current address of the site */
            sprintf(__("Site address: %s", "beyondseo"), domain.website)
          }
        </Text>

        {!domain.inSync && domain.knownWebsite && !isUpdated && (
          <div role="status" className={styles.domainWarning}>
            {
              /* translators: 1: the previous address of the site, 2: the current address of the site */
              sprintf(
                __(
                  "Your site address changed from %1$s to %2$s, but your project has not been updated yet.",
                  "beyondseo",
                ),
                domain.knownWebsite,
                domain.website,
              )
            }
          </div>
        )}
        {isUpdated && (
          <div role="status" className={styles.domainSuccess}>
            {
              /* translators: %s: the current address of the site */
              sprintf(__("Your project now uses %s.", "beyondseo"), domain.website)
            }
          </div>
        )}
        {error && (
          <div role="alert" className={styles.domainError}>
            {error}
          </div>
        )}

        <div className={styles.buttonContainer}>
          <Button
            size={ButtonSizes.extraLarge}
            type={ButtonTypes.secondary}
            onClick={handleUpdate}
            disabled={isUpdating}
            isLoading={isUpdating}
          >
            {__("Update domain", "beyondseo")}
          </Button>
        </div>
      </div>
    </>
  );
};
