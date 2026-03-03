import React, { useState, useEffect } from "react";
import styles from "./GeneralSettingsPage.module.scss";
import { Text, TextTypes } from "vanguard";
import { __ } from "@wordpress/i18n";
import { useSelector } from "react-redux";
import { RootState } from "@src/main.store";
import { seoStore } from "@stores/swagger/rankingcoach/SeoStore";
import SettingsRow from "./SettingsRow";

type SettingsKeys =
  | "allow_seo_optimiser_on_saved_posts"
  | "allow_sync_keywords_to_rankingcoach"
  | "enable_wp_cron_service"
  | "enable_broken_link_checker_job"
  | "enable_user_action_and_event_logs_sharing"
  | "disable_wp_heartbeat_service"
  | "open_rc_dashboard_in_new_tab";

const GeneralSettingsPage: React.FC = () => {
  const { plugin } = useSelector((state: RootState) => state.app);
  const initialSettings = plugin?.pluginData?.settings || ({} as Partial<Record<SettingsKeys, boolean>>);

  const [settings, setSettings] = useState<Partial<Record<SettingsKeys, boolean>>>(initialSettings);
  const [isSaving, setIsSaving] = useState<Partial<Record<SettingsKeys, boolean>>>({});

  useEffect(() => {
    setSettings(initialSettings);
  }, [plugin]);

  const handleSettingChange = async (key: SettingsKeys, value: boolean) => {
    setIsSaving((prev) => ({ ...prev, [key]: true }));
    setSettings((prev) => ({ ...prev, [key]: value }));

    try {
      await seoStore
        .postRankingcoachSeoSettings({
          settings: {
            [key]: value,
          },
        } as any)
        .toPromise();
    } catch (error) {
      // Revert on failure
      setSettings((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setIsSaving((prev) => ({ ...prev, [key]: false }));
    }
  };

  const settingsConfig: {
    key: SettingsKeys;
    title: string;
    description: string;
  }[] = [
    {
      key: "allow_seo_optimiser_on_saved_posts",
      title: __("Allow run score calculation on page/post save", "beyondseo"),
      description: __(
        "Enable this option to automatically run the SEO score calculation when a page or post is saved",
        "beyondseo",
      ),
    },
    {
      key: "allow_sync_keywords_to_rankingcoach",
      title: __("Allow synchronisation the keywords an interval basis", "beyondseo"),
      description: __(
        "Enable this option to synchronise keywords from your WordPress site to the rC platform",
        "beyondseo",
      ),
    },
    {
      key: "enable_wp_cron_service",
      title: __("Enable WP-Cron service", "beyondseo"),
      description: __("Enable this option to use the WP-Cron service for scheduling tasks", "beyondseo"),
    },
    {
      key: "enable_broken_link_checker_job",
      title: __("Allow to run broken link checker an interval basis", "beyondseo"),
      description: __(
        "Enable this option to run the broken link checker job that scans your site for broken links",
        "beyondseo",
      ),
    },
    {
      key: "enable_user_action_and_event_logs_sharing",
      title: __("Enable anonymous usage data sharing", "beyondseo"),
      description: __("Enable this option to share anonymous usage data with the plugin developers", "beyondseo"),
    },
    {
      key: "disable_wp_heartbeat_service",
      title: __("Disable WordPress heartbeat admin-ajax service", "beyondseo"),
      description: __(
        "Enable this option to disable the WordPress heartbeat service that sends periodic AJAX requests to admin-ajax.php. This can improve performance by reducing server load",
        "beyondseo",
      ),
    },
    {
      key: "open_rc_dashboard_in_new_tab",
      title: __("Open rC dashboard in new tab", "beyondseo"),
      description: __(
        "Enable this option to open the RankingCoach dashboard in a new browser tab instead of the current tab",
        "beyondseo",
      ),
    },
  ];

  return (
    <div>
      <Text type={TextTypes.heading3} className={styles.title}>
        {__("General Settings", "beyondseo")}
      </Text>
      <div className={styles.separator}></div>
      <div className={styles.settingsList}>
        {settingsConfig.map(({ key, title, description }) => (
          <SettingsRow
            key={key}
            title={title}
            description={description}
            checked={!!settings[key]}
            onChange={(e) => handleSettingChange(key, (e.target as HTMLInputElement).checked)}
            testId={`${key}-switch`}
            disabled={isSaving[key]}
          />
        ))}
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
