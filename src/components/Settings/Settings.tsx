import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "./Settings.module.scss";
import { IconNames, IconSize, TextIcon, Text, ComponentContainer, FontWeights, TextTypes } from "vanguard";
import BreadcrumbsPage from "./BreadcrumbsPage/BreadcrumbsPage";
import RSSPage from "./RSSPage/RSSPage";
import SitemapPage from "./SitemapPage/SitemapPage";
import RobotsPage from "./RobotsPage/RobotsPage";
import GeneralSettingsPage from "./GeneralSettingsPage/GeneralSettingsPage";
import { __ } from "@wordpress/i18n";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@src/main.store";
import { SeoStore } from "@stores/swagger/rankingcoach/SeoStore";
import { isActivationCompleted, isOnboardingCompleted, redirectToConnectPage } from "@helpers/onboarding-helpers";
import { rcWindow } from "@stores/window.store";
import { Review, getReviewDestination } from "../Review/Review";
import { stopReviewFromFooter } from "../Review/ReviewState";
import AccountPage, {
  AccountProjectState,
  AccountProjectDeletionOutcome,
  getAccountProject,
} from "./AccountPage/AccountPage";

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType<any>;
  className?: string;
  comingSoon?: boolean;
  subtext?: string;
};

const sections: MenuItem[] = [
  { id: "general", label: __("General", "beyondseo"), icon: "settings", component: GeneralSettingsPage },
  { id: "breadcrumbs", label: __("Breadcrumbs", "beyondseo"), icon: "link", component: BreadcrumbsPage },
  {
    id: "rss",
    label: __("RSS", "beyondseo"),
    icon: "rss",
    component: RSSPage,
    className: styles.rssItem,
    subtext: __("Really Simple Syndication", "beyondseo"),
  },
  { id: "sitemap", label: __("Sitemap", "beyondseo"), icon: "sitemap", component: SitemapPage },
  { id: "robots", label: __("Robots.txt", "beyondseo"), icon: "robot", component: RobotsPage },
  { id: "account", label: __("Account", "beyondseo"), icon: "user", component: AccountPage },
];

const getSelectedSection = (): string => {
  const section = new URL(window.location.href).searchParams.get("section");
  return sections.some((item) => item.id === section) ? section! : "general";
};

const Settings: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>(getSelectedSection);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState<boolean>(false);
  const { plugin } = useSelector((state: RootState) => state.app);
  const [isAccountChecking, setIsAccountChecking] = useState<boolean>(false);
  const dispatch = useDispatch<any>();
  const [project, setProject] = useState<AccountProjectState | null>(null);
  const [connected, setConnected] = useState(isActivationCompleted);
  const [isProjectLoading, setIsProjectLoading] = useState(true);
  const [projectLoadError, setProjectLoadError] = useState<string | null>(null);
  const [deletionOutcome, setDeletionOutcome] = useState<AccountProjectDeletionOutcome | null>(null);
  const [isMutationPending, setIsMutationPending] = useState(false);
  const mutationPendingRef = useRef(false);
  const projectRequestRef = useRef<AbortController | null>(null);
  const projectRequestVersion = useRef(0);

  const handleProjectChange = useCallback((snapshot: AccountProjectState) => {
    projectRequestVersion.current += 1;
    projectRequestRef.current?.abort();
    setProject(snapshot);
    setConnected(snapshot.connected);
    setIsProjectLoading(false);
    setProjectLoadError(null);
    if (rcWindow.rankingCoachReactData) {
      rcWindow.rankingCoachReactData.isActivationCompleted = snapshot.connected;
    }
  }, []);

  const refreshProject = useCallback(async () => {
    if (mutationPendingRef.current) return;
    projectRequestRef.current?.abort();
    const controller = new AbortController();
    projectRequestRef.current = controller;
    const version = ++projectRequestVersion.current;
    setIsProjectLoading(true);
    setProjectLoadError(null);
    try {
      const snapshot = await getAccountProject(controller.signal);
      if (version === projectRequestVersion.current && !controller.signal.aborted) {
        handleProjectChange(snapshot);
      }
    } catch (error) {
      if (version === projectRequestVersion.current && !controller.signal.aborted) {
        setProjectLoadError(
          error instanceof Error ? error.message : __("Unable to load Account. Please try again.", "beyondseo"),
        );
      }
    } finally {
      if (version === projectRequestVersion.current && !controller.signal.aborted) {
        setIsProjectLoading(false);
      }
    }
  }, [handleProjectChange]);

  const handleMutationPendingChange = useCallback((pending: boolean) => {
    mutationPendingRef.current = pending;
    setIsMutationPending(pending);
    if (pending) {
      projectRequestVersion.current += 1;
      projectRequestRef.current?.abort();
      setIsProjectLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshProject();
    const handlePopState = () => {
      setActiveItem(getSelectedSection());
      void refreshProject();
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      projectRequestVersion.current += 1;
      projectRequestRef.current?.abort();
      window.removeEventListener("popstate", handlePopState);
    };
  }, [refreshProject]);

  const handleCheckAccount = async () => {
    if (project?.accountAuthenticated && !connected) {
      await refreshProject();
      return;
    }
    if (!connected || !isOnboardingCompleted()) {
      redirectToConnectPage();
      return;
    }

    try {
      setIsAccountChecking(true);

      const response = await (dispatch(SeoStore.getRankingcoachSeoAccountDetailsThunk({} as any)) as any).unwrap();
    } catch (error) {
    } finally {
      setIsAccountChecking(false);
      void refreshProject();
    }
  };

  const handleMenuClick = (id: string) => {
    if (mutationPendingRef.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set("section", id);
    if (url.href !== window.location.href) {
      window.history.pushState(window.history.state, "", url);
    }
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

  const menuItems = sections.filter((item) => item.id !== "account" || project?.accountAuthenticated || connected);
  const ActiveComponent = sections.find((item) => item.id === activeItem)?.component;
  const isActiveItemComingSoon = sections.find((item) => item.id === activeItem)?.comingSoon;
  const reviewUrl = getReviewDestination(rcWindow.rankingCoachReactData?.reviewUrl);
  const reviewNotice = <Review placement="settings" />;

  return (
    <div className={`${styles.settingsContainer} ${isMenuCollapsed ? styles.wpMenuCollapsed : styles.wpMenuExpanded}`}>
      <header className={styles.header}></header>

      <div className={styles.mainContent}>
        <aside className={styles.sidebar}>
          <div
            role="button"
            tabIndex={isMutationPending ? -1 : 0}
            aria-disabled={isMutationPending}
            aria-current={activeItem === "general" ? "page" : undefined}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleMenuClick("general");
              }
            }}
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
                    role="button"
                    tabIndex={isMutationPending ? -1 : 0}
                    aria-disabled={isMutationPending}
                    aria-current={activeItem === item.id ? "page" : undefined}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleMenuClick(item.id);
                      }
                    }}
                    className={`${styles.menuItem} ${activeItem === item.id ? styles.activeMenuItem : ""} ${
                      item.className || ""
                    }`}
                    onClick={() => handleMenuClick(item.id)}
                  >
                    <div className={styles.menuItemContent}>
                      <Text>{__(item.label, "beyondseo")}</Text>
                      {item.subtext && <Text className={styles.menuItemSubtext}>{__(item.subtext, "beyondseo")}</Text>}
                    </div>
                  </li>
                ),
            )}
          </ul>
        </aside>

        <main className={styles.contentArea}>
          {activeItem !== "account" && projectLoadError && (
            <div role="alert">
              <Text>{projectLoadError}</Text>
              <button
                className={styles.checkUpdateButton}
                disabled={isProjectLoading}
                onClick={() => void refreshProject()}
              >
                {__("Retry loading Account", "beyondseo")}
              </button>
            </div>
          )}
          <div hidden={activeItem !== "account"}>
            <AccountPage
              project={project}
              isLoading={isProjectLoading || isAccountChecking}
              loadError={projectLoadError}
              onRefresh={refreshProject}
              onProjectChange={handleProjectChange}
              deletionOutcome={deletionOutcome}
              onDeletionOutcomeChange={setDeletionOutcome}
              onMutationPendingChange={handleMutationPendingChange}
              reviewNotice={reviewNotice}
            />
          </div>
          {activeItem !== "account" && ActiveComponent && (
            <ActiveComponent comingSoon={isActiveItemComingSoon} reviewNotice={reviewNotice} />
          )}
        </main>
      </div>

      <footer className={styles.footer}>
        <div className={styles.footerInfoContainer}>
          <button
            onClick={() => !isAccountChecking && !isMutationPending && handleCheckAccount()}
            disabled={isAccountChecking || isMutationPending || isProjectLoading || !!projectLoadError}
            className={styles.checkUpdateButton}
          >
            {isAccountChecking ? __("Checking…", "beyondseo") : __("Check my account", "beyondseo")}
          </button>

          <Text type={TextTypes.textHelp} className={styles.infoItem}>
            {__("Plugin version:", "beyondseo")} {plugin?.pluginData?.version || "1.1.15"}
          </Text>
          {reviewUrl && (
            <Text type={TextTypes.textHelp}>
              <a
                href={reviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={stopReviewFromFooter}
                onAuxClick={(event) => {
                  if (event.button === 1) {
                    stopReviewFromFooter();
                  }
                }}
              >
                {__("Review BeyondSEO on WordPress.org", "beyondseo")}
              </a>
            </Text>
          )}
        </div>
      </footer>
    </div>
  );
};

export default Settings;
