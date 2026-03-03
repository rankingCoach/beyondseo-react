import * as React from "react";
import styles from "./LinkAssistantTab.module.scss";
import { FontWeights, Text, TextTypes, TextIcon, IconNames, IconSize } from "vanguard";
import { LinkAssistant } from "./types";
import { __ } from "@wordpress/i18n";

interface LinkAssistantTableProps {
  title: string;
  links: LinkAssistant[];
  emptyMessage?: string;
}

const STATUS_BROKEN = __("broken", "beyondseo");
const STATUS_ACTIVE = __("active", "beyondseo");
const STATUS_UNSCANNED = __("unscanned", "beyondseo");

const getLinkStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return {
        icon: IconNames.check,
        iconColor: "#08451E",
        textColor: "#08451E",
        iconSize: IconSize.small,
        fillColor: "#e9fbed",
        hasCircle: true,
        circleSize: 20,
        bgColor: "#e9fbed",
      };
    case "broken":
      return {
        icon: IconNames.close,
        iconColor: "#6E0F08",
        textColor: "#6E0F08",
        iconSize: IconSize.small,
        fillColor: "#ffeceb",
        hasCircle: true,
        circleSize: 20,
        bgColor: "#ffeceb",
      };
    case "unscanned":
      return {
        icon: IconNames.exclamation,
        iconColor: "#8B4513",
        textColor: "#8B4513",
        iconSize: IconSize.small,
        fillColor: "#FFF3E0",
        hasCircle: true,
        circleSize: 20,
        bgColor: "#FFF3E0",
      };
    default:
      return {
        icon: IconNames.info,
        iconColor: "#0D47A1",
        textColor: "#0D47A1",
        iconSize: IconSize.small,
        fillColor: "#E3F2FD",
        hasCircle: true,
        circleSize: 20,
        bgColor: "#E3F2FD",
      };
  }
};

export const LinkAssistantTable: React.FC<LinkAssistantTableProps> = ({
  title,
  links,
  emptyMessage = __("No internal links found.", "beyondseo"),
}) => {
  return (
    <>
      <Text type={TextTypes.text} className={styles.tableTitle}>
        {title}
      </Text>
      <div className={styles.tableContainer}>
        <table className={styles.redirectsTableContent}>
          <colgroup>
            <col className={styles.colSourcePage} />
            <col className={styles.colTargetUrl} />
            <col className={styles.colLinkText} />
            <col className={styles.colLinkStatus} />
          </colgroup>
          <thead>
            <tr>
              <th className={styles.colSourcePage}>
                <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                  {__("Source Page", "beyondseo")}
                </Text>
              </th>
              <th className={styles.colTargetUrl}>
                <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                  {__("Target URL", "beyondseo")}
                </Text>
              </th>
              <th className={styles.colLinkText}>
                <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                  {__("Link Text", "beyondseo")}
                </Text>
              </th>
              <th className={styles.colLinkStatus}>
                <Text type={TextTypes.textHelp} fontWeight={FontWeights.bold}>
                  {__("Link Status", "beyondseo")}
                </Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {links.length > 0 ? (
              links.map((la, index) => {
                const statusConfig = getLinkStatusIcon(la.status);
                return (
                  <tr key={la.id || index}>
                    <td className={styles.colSourcePage}>{la.source_uri}</td>
                    <td className={styles.colTargetUrl}>{la.url}</td>
                    <td className={styles.colLinkText}>{la.link_text}</td>
                    <td className={styles.colLinkStatus + " " + styles.statusCell}>
                      <div className={styles.statusPill} style={{ backgroundColor: statusConfig.bgColor }}>
                        <TextIcon
                          icon={statusConfig.icon}
                          iconColor={statusConfig.iconColor}
                          textColor={statusConfig.textColor}
                          textType={TextTypes.textHelp}
                          iconSize={statusConfig.iconSize}
                          iconHasCircle={statusConfig.hasCircle}
                          iconFillColor={statusConfig.fillColor}
                          iconCircleSize={statusConfig.circleSize}
                          className={styles.iconText}
                          fontWeight={FontWeights.regular}
                        >
                          {__(la.status === "broken" ? STATUS_BROKEN : la.status === "active" ? STATUS_ACTIVE : STATUS_UNSCANNED, "beyondseo")}
                        </TextIcon>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
