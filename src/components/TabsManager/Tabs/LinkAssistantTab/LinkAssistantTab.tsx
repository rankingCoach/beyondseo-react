import styles from "./LinkAssistantTab.module.scss";
import { Text, TextTypes } from "vanguard";
import { useDispatch } from "react-redux";
import { SeoStore } from "@src/stores/swagger/rankingcoach/SeoStore";
import { LinkAssistantTabPlaceholder } from "./LinkAssistantTabPlaceholder";
import classNames from "classnames";
import { getPathId } from "@helpers/get-path-id";
import { LinkAssistantTable } from "./LinkAssistantTable";
import { LinkAssistants } from "./types";
import { __ } from "@wordpress/i18n";
import { Button, ButtonTypes } from "vanguard";
import tabStyles from "../Tabs.module.scss";
import { useEffect, useState } from "react";

interface LinkAssistantTabProps {}

export const LinkAssistantTab = () => {
  const dispatch = useDispatch();
  const [linkAssistants, setLinkAssistants] = useState<LinkAssistants>({
    inbound: [],
    outbound: [],
    external: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const currentPostId = getPathId();

  useEffect(() => {
    const fetchLinkAssistant = async () => {
      try {
        setIsLoading(true);
        const response = (await dispatch(
          SeoStore.getRankingcoachSeoLinkAnalyzerByIdThunk({ id: currentPostId }),
        )) as any;

        if (response?.payload?.response) {
          const linkAssistantData = response.payload.response;

          setLinkAssistants(linkAssistantData);
        } else {
          setError(__("No link assistant data found", "beyondseo"));
        }
      } catch (err) {
        setError(__("Failed to load link assistant data", "beyondseo"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchLinkAssistant();
  }, [dispatch]);

  const handleScanLinks = async () => {
    try {
      setIsScanning(true);
      await dispatch(
        SeoStore.postRankingcoachSeoLinkAnalyzerVerifyByPostIdThunk({
          post_id: currentPostId,
          requestBody: {},
        }),
      );

      const response = (await dispatch(SeoStore.getRankingcoachSeoLinkAnalyzerByIdThunk({ id: currentPostId }))) as any;

      if (response?.payload?.response) {
        setLinkAssistants(response.payload.response);
      }
    } catch (err) {
      setError(__("Failed to scan links", "beyondseo"));
    } finally {
      setIsScanning(false);
    }
  };

  if (isLoading) {
    return <LinkAssistantTabPlaceholder />;
  }

  if (error) {
    return (
      <div className={classNames(styles.redirectsContainer, tabStyles.tabContent)}>
        <Text type={TextTypes.text} className={styles.tableTitle}>
          {__("Error:", "beyondseo")} {error}
        </Text>
      </div>
    );
  }

  return (
    <div className={classNames(styles.redirectsContainer, tabStyles.tabContent)}>
      <div className={styles.header}>
        <div className={styles.infoBox}>
          <Text type={TextTypes.heading3} className={styles.infoTitle}>
            {__("Link Assistant Overview", "beyondseo")}
          </Text>
          <Text type={TextTypes.text} className={styles.infoDescription}>
            {__(
              "Internal links help search engines understand your content structure and improve your SEO rankings.",
              "beyondseo",
            )}
          </Text>
          <div className={styles.legendContainer}>
            <Text type={TextTypes.text} className={styles.legendTitle}>
              {__("Link Status Guide:", "beyondseo")}
            </Text>
            <ul className={styles.legend}>
              <li>
                <span className={styles.legendDot} data-status="unscanned" />
                <Text type={TextTypes.text}>
                  {__("Not yet scanned - Click `Scan Links` to analyze", "beyondseo")}
                </Text>
              </li>
              <li>
                <span className={styles.legendDot} data-status="ok" />
                <Text type={TextTypes.text}>{__("Working links - SEO-friendly", "beyondseo")}</Text>
              </li>
              <li>
                <span className={styles.legendDot} data-status="broken" />
                <Text type={TextTypes.text}>{__("Broken links - Need attention", "beyondseo")}</Text>
              </li>
            </ul>
          </div>
        </div>

        <Button
          type={ButtonTypes.primary}
          onClick={handleScanLinks}
          isLoading={isScanning}
          disabled={isLoading || isScanning}
          className={styles.scanButton}
        >
          {__("Scan Links", "beyondseo")}
        </Button>
      </div>

      <LinkAssistantTable
        title={__("Inbound Internal:", "beyondseo")}
        links={linkAssistants.inbound}
        emptyMessage={__("No internal links found.", "beyondseo")}
      />

      <LinkAssistantTable
        title={__("Outbound Internal:", "beyondseo")}
        links={linkAssistants.outbound}
        emptyMessage={__("No outbound links found.", "beyondseo")}
      />

      <LinkAssistantTable
        title={__("External:", "beyondseo")}
        links={linkAssistants.external}
        emptyMessage={__("No external links found.", "beyondseo")}
      />
    </div>
  );
};
