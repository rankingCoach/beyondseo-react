import React, { useState, useEffect, useCallback } from "react";
import styles from "./Settings.module.scss";
import rankingCoachLogo from "../../assets/rC-logo-dark-blue.svg";
import { IconNames, IconSize, TextIcon, Text, ComponentContainer, FontWeights, TextTypes } from "vanguard";
import BreadcrumbsPage from "./BreadcrumbsPage/BreadcrumbsPage";
import RSSPage from "./RSSPage/RSSPage";
import ImportSettingsPage from "./ImportSettingsPage/ImportSettingsPage";
import SitemapPage from "./SitemapPage/SitemapPage";
import RobotsPage from "./RobotsPage/RobotsPage";
import GeneralSettingsPage from "./GeneralSettingsPage/GeneralSettingsPage";
import { __ } from "@wordpress/i18n";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@src/main.store";
import { SeoStore } from "@stores/swagger/rankingcoach/SeoStore";

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  className?: string;
  comingSoon?: boolean;
  subtext?: string;
};

const menuItems: MenuItem[] = [
  { id: "general", label: __("General", "beyondseo"), icon: "settings", component: GeneralSettingsPage },
  { id: "breadcrumbs", label: __("Breadcrumbs", "beyondseo"), icon: "link", component: BreadcrumbsPage },
  { id: "rss", label: __("RSS", "beyondseo"), icon: "rss", component: RSSPage, className: styles.rssItem, subtext: __("Really Simple Syndication", "beyondseo") },
  { id: "sitemap", label: __("Sitemap", "beyondseo"), icon: "sitemap", component: SitemapPage },
  { id: "robots", label: __("Robots.txt", "beyondseo"), icon: "robot", component: RobotsPage }
];

const Settings: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>("general");
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const { plugin } = useSelector((state: RootState) => state.app);
  const [isAccountChecking, setIsAccountChecking] = useState<boolean>(false);
  const dispatch = useDispatch<any>();

  const handleCheckAccount = async () => {
    try {
      setIsAccountChecking(true);

      const response = await (dispatch(
        SeoStore.getRankingcoachSeoAccountDetailsThunk({} as any)
      ) as any).unwrap();
    }
    catch (error) { }
    finally {
      setIsAccountChecking(false);
    }
  }


  const handleMenuClick = (id: string) => {
    setActiveItem(id);
  };

  // Debounce function to limit rapid consecutive calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const checkWpMenuState = useCallback(() => {
    try {
      const adminMenu = document.getElementById("adminmenu") || document.getElementById("adminmenuwrap");
      const isMobileScreen = window.matchMedia("(max-width: 782px)").matches;
      const isSmallScreen = window.matchMedia("(max-width: 960px)").matches;

      if (isMobileScreen || isSmallScreen) {
        setIsMenuCollapsed(true);
        return;
      }

      if (adminMenu) {
        // Get actual width of the admin menu element
        const menuRect = adminMenu.getBoundingClientRect();
        const menuWidth = menuRect.width;

        setIsMenuCollapsed(menuWidth < 50);
      } else {
        // Fallback to class-based detection if we can't find the menu element
        const body = document.body;
        const isCollapsed = body.classList.contains("folded") || body.classList.contains("auto-fold");
        setIsMenuCollapsed(isCollapsed);
      }
    } catch (error) {
      // Default to expanded state on error
      setIsMenuCollapsed(false);
    }
  }, []);

  // Debounced version to avoid too many updates
  const debouncedCheckWpMenuState = useCallback(debounce(checkWpMenuState, 100), [checkWpMenuState]);

  useEffect(() => {
    // Initial check
    checkWpMenuState();

    // Set up resize observer for the admin menu
    const adminMenu = document.getElementById("adminmenu") || document.getElementById("adminmenuwrap");
    let resizeObserver: ResizeObserver | null = null;

    if (adminMenu && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(debouncedCheckWpMenuState);
      resizeObserver.observe(adminMenu);
    }

    // Create a MutationObserver to watch for class changes on body
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          (mutation.attributeName === "class" || mutation.attributeName === "style")
        ) {
          debouncedCheckWpMenuState();
        }
      });
    });

    // Observe body for class and style changes
    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    // If admin menu couldn't be found initially, try observing potential parent elements
    const adminmenuwrap = document.getElementById("adminmenuwrap");
    if (adminmenuwrap) {
      bodyObserver.observe(adminmenuwrap, {
        attributes: true,
        childList: true,
        subtree: true,
      });
    }

    // Listen for window resize events
    window.addEventListener("resize", debouncedCheckWpMenuState);

    // Listen for WordPress admin menu toggle clicks
    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      // Check for collapse menu button or any of its children
      if (
        target &&
        (target.id === "collapse-menu" ||
          target.closest("#collapse-menu") ||
          target.classList.contains("collapse-button") ||
          target.closest(".collapse-button"))
      ) {
        // Use a slightly longer timeout to ensure WordPress has finished its animations
        setTimeout(checkWpMenuState, 300);
      }
    });

    // Check periodically (as a fallback)
    const intervalCheck = setInterval(debouncedCheckWpMenuState, 2000);

    // Cleanup
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      bodyObserver.disconnect();
      window.removeEventListener("resize", debouncedCheckWpMenuState);
      clearInterval(intervalCheck);
    };
  }, [checkWpMenuState, debouncedCheckWpMenuState]);

  const ActiveComponent = menuItems.find((item) => item.id === activeItem)?.component;
  const isActiveItemComingSoon = menuItems.find((item) => item.id === activeItem)?.comingSoon;

  return (
    <div className={`${styles.settingsContainer} ${isMenuCollapsed ? styles.wpMenuCollapsed : styles.wpMenuExpanded}`}>
      <header className={styles.header}>
      </header>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div
            onClick={() => handleMenuClick("general")}
            className={`${styles.settingsTitleContainer} ${activeItem === "general" ? styles.activeSettingsTitle : ""}`}
          >
            <TextIcon
              icon={IconNames.settings}
              fontWeight={FontWeights.bold}
              iconSize={IconSize.large}
              verticalAlign="center"
            >
              {__("Settings", "beyondseo")}
            </TextIcon>
          </div>
          <ul className={styles.menuList}>
            {menuItems.map(
              (item) =>
                item.id !== "general" && (
                  <li
                    key={item.id}
                    className={`${styles.menuItem} ${activeItem === item.id ? styles.activeMenuItem : ""} ${item.className || ""
                      }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className={styles.menuItemContent}>
                      <Text>{__(item.label, "beyondseo")}</Text>
                      {item.subtext && (
                        <Text className={styles.menuItemSubtext}>{__(item.subtext, "beyondseo")}</Text>
                      )}
                    </div>
                  </li>
                ),
            )}
          </ul>
        </aside>

        <main className={styles.contentArea}>
          {ActiveComponent && <ActiveComponent comingSoon={isActiveItemComingSoon} />}
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInfoContainer}>
          <button
            onClick={() => !isAccountChecking && handleCheckAccount()}
            disabled={isAccountChecking}
            className={styles.checkUpdateButton}
          >
            {isAccountChecking ? __("Checking…", "beyondseo") : __("Check my account", "beyondseo")}
          </button>

          <Text type={TextTypes.textHelp} className={styles.infoItem}>
            {__("Plugin version:", "beyondseo")} {plugin?.pluginData?.version || "1.1.15"}
          </Text>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
